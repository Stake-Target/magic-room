pragma solidity ^0.8.0;

import "./randomize.sol";
import "./tokenomic.sol";

contract MagicRoom is Randomize, Tokenomic {
  mapping(uint256 => Room) public rooms;
  uint roomCount = 0;
  uint idleTime = 1 days;

  constructor(address _tokenAddress) Tokenomic(_tokenAddress) {}

  event StartRoom(uint256 timestamp, uint roomId, Room room);
  event FinishRoom(uint256 timestamp, uint roomId, Room room);
  event Vip(uint256 timestamp, uint roomId, uint step, RewardInfo reward);
  event Reward(uint256 timestamp, uint roomId, uint step, RewardInfo reward);
  event Winner(uint256 timestamp, uint roomId, uint step, RewardInfo reward);
  event ChangeChair(uint256 timestamp, uint roomId, uint step, ChairChangesInfo chairChanges, Room room);

  struct Room {
    uint id;
    uint price;
    uint bank;
    uint steps;
    uint step;
    bool active;
    uint lastActionTime;
    address[] chairs;
}

  struct RewardInfo {
    address to;
    uint index;
    uint value;
  }

  struct Member {
    address account;
    string name;
  }

  struct ChairChangesInfo {
    address enter;
    address leave;
    uint index;
  }

  modifier currentRoomIsNotActive () {
    require(
      _currentRoomIsNotActive(),
      "there is an active room"
    );
    _;
  }

  modifier currentRoomIsActive () {
    require(
      _currentRoomIsActive(),
      "no active room"
    );
    _;
  }

  modifier currentRoomIsActiveAndNot () {
    require(
      _currentRoomIsActive(),
      "no active room"
    );
    _;
  }

  modifier availableAmount (uint _amount) {
    Room memory room = rooms[roomCount];
    uint min = room.price + minPrice;
    require(_amount >= min, string(abi.encodePacked("amount must be greater than or equal to ", min)));
    _;
  }

  function setStepsCount(uint count) external onlyOwner {
    rooms[roomCount].steps = count;
  }

  function createRoom(uint _amount) external currentRoomIsNotActive {
    if (_currentRoomIsDead()) {
      _finishRoom();
    }
    _createRoom();
    _enterToRoom(_amount);
  }

  function getCurrentRoom() external view returns(Room memory room) {
    Room memory room = rooms[roomCount];
    return room;
  }

  function enterToRoom(uint _amount) external currentRoomIsActive availableAmount(_amount) {
    _enterToRoom(_amount);
  }

  function _currentRoomIsNotActive() private returns(bool) {
    return (
    roomCount == 0
    || !rooms[roomCount].active
    || rooms[roomCount].lastActionTime + idleTime < block.timestamp
    );
  }

  function _currentRoomIsActive() private returns(bool) {
    return (
    roomCount != 0
    && rooms[roomCount].active
    && rooms[roomCount].lastActionTime + idleTime > block.timestamp
    );
  }

  function _currentRoomIsDead() private returns(bool) {
    return (
    roomCount != 0
    && rooms[roomCount].active
    && rooms[roomCount].lastActionTime + idleTime < block.timestamp
    );
  }

  function _createRoom () private {
    uint steps = getRandomRange(100, 2000);
    roomCount++;
    address[] memory chairs = new address[](10);
//    for (uint i = 0; i < _addresses.length; i++) {
//      if (_addresses[i] != address(0)) {
//        counter++;
//      }
//    }
    rooms[roomCount] = Room(roomCount, 0, 0, steps, 0, true, block.timestamp, chairs);
    emit StartRoom(block.timestamp, roomCount, rooms[roomCount]);
  }

  function _enterToRoom(uint _amount) private availableAmount(_amount) {
    Room storage room = rooms[roomCount];
    uint vipChair = getRandomRange(0, room.chairs.length - 1);
    uint rewardAddressCount = getValidAddressCount(room.chairs);
    (uint rewards, uint winners, uint vip, uint fee) = getShares(_amount);

    getTokens(_amount);

    room.step++;
    room.lastActionTime = block.timestamp;
    room.price = _amount;
    balance = balance + fee;

    if (room.chairs[vipChair] == address(0)) {
      winners = winners + vip;
    } else {
      _sendRewardToVip(room, vipChair, vip);
    }
    if (rewardAddressCount == 0) {
      winners = winners + rewards;
    } else {
      _sendRewardToMembers(room, rewards / rewardAddressCount);
    }

    room.bank = room.bank + winners;
    _changeChair(room);

    if (room.steps == room.step) {
      _finishRoom();
    }
  }

  function _changeChair(Room storage _room) private {
    uint index = getRandomChair();
    ChairChangesInfo memory chairUpdate = ChairChangesInfo(msg.sender, _room.chairs[index], index);
    _room.chairs[index] = msg.sender;
    emit ChangeChair(block.timestamp, _room.id, _room.step, chairUpdate, _room);
  }

  function _sendRewardToVip(Room memory _room, uint _index, uint _amount) private {
    address to = _room.chairs[_index];
    if (to != address(0) && _amount > 0) {
      RewardInfo memory rewardInfo = RewardInfo(to, _index, _amount);
      sendTokens(rewardInfo.to, rewardInfo.value);
      emit Vip(block.timestamp, _room.id, _room.step, rewardInfo);
    }
  }

  function _sendRewardToMembers(Room memory _room, uint _amount) private {
    for (uint i = 0; i < _room.chairs.length; i++) {
      if (_room.chairs[i] != address(0)) {
        RewardInfo memory rewardInfo = RewardInfo(_room.chairs[i], i, _amount);
        sendTokens(rewardInfo.to, rewardInfo.value);
        emit Reward(block.timestamp, _room.id, _room.step, rewardInfo);
      }
    }
  }

  function _finishRoom() private {
    Room storage room = rooms[roomCount];
    uint rewardAddressCount = getValidAddressCount(room.chairs);
    uint bankRewardPerChair = room.bank / rewardAddressCount;

    for (uint i = 0; i < room.chairs.length; i++) {
      if (room.chairs[i] != address(0)) {
        RewardInfo memory rewardInfo = RewardInfo(room.chairs[i], i, bankRewardPerChair);
        sendTokens(rewardInfo.to, rewardInfo.value);
        emit Winner(block.timestamp, room.id, room.step, rewardInfo);
      }
    }

    room.active = false;

    emit FinishRoom(block.timestamp, room.id, room);
  }
}
