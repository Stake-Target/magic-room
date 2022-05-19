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
    string[] names;
  }

  struct RewardInfo {
    Member member;
    uint index;
    uint value;
  }

  struct Member {
    address account;
    string name;
  }

  struct ChairChangesInfo {
    Member enter;
    Member leave;
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

  modifier availableName (string calldata _name) {
    require(bytes(_name).length <= 20, "max length 20 characters");
    _;
  }

  function setStepsCount(uint count) external onlyOwner {
    rooms[roomCount].steps = count;
  }

  function createRoom(string calldata _name, uint _amount) external availableName(_name) currentRoomIsNotActive {
    if (_currentRoomIsDead()) {
      _finishRoom();
    }
    _createRoom();
    _enterToRoom(_name, _amount);
  }

  function getCurrentRoom() external view returns(Room memory room) {
    Room memory room = rooms[roomCount];
    return room;
  }

  function enterToRoom(string calldata _name, uint _amount) external availableName(_name) currentRoomIsActive availableAmount(_amount) {
    _enterToRoom(_name, _amount);
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
    string[] memory names = new string[](10);
    rooms[roomCount] = Room(roomCount, 0, 0, steps, 0, true, block.timestamp, chairs, names);
    emit StartRoom(block.timestamp, roomCount, rooms[roomCount]);
  }

  function _enterToRoom(string calldata _name, uint _amount) private availableAmount(_amount) {
    Room storage room = rooms[roomCount];
    Member memory enter = Member(msg.sender, _name);
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
    _changeChair(room, enter);

    if (room.steps == room.step) {
      _finishRoom();
    }
  }

  function _changeChair(Room storage _room, Member memory enter) private {
    uint index = getRandomChair();
    Member memory leave = Member(_room.chairs[index], _room.names[index]);
    ChairChangesInfo memory chairUpdate = ChairChangesInfo(enter, leave, index);
    _room.chairs[index] = enter.account;
    _room.names[index] = enter.name;
    emit ChangeChair(block.timestamp, _room.id, _room.step, chairUpdate, _room);
  }

  function _sendRewardToVip(Room memory _room, uint _index, uint _amount) private {
    address to = _room.chairs[_index];
    if (to != address(0) && _amount > 0) {
      Member memory member = Member(to, _room.names[_index]);
      RewardInfo memory rewardInfo = RewardInfo(member, _index, _amount);
      sendTokens(rewardInfo.member.account, rewardInfo.value);
      emit Vip(block.timestamp, _room.id, _room.step, rewardInfo);
    }
  }

  function _sendRewardToMembers(Room memory _room, uint _amount) private {
    for (uint i = 0; i < _room.chairs.length; i++) {
      if (_room.chairs[i] != address(0)) {
        Member memory member = Member(_room.chairs[i], _room.names[i]);
        RewardInfo memory rewardInfo = RewardInfo(member, i, _amount);
        sendTokens(member.account, rewardInfo.value);
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
        Member memory member = Member(room.chairs[i], room.names[i]);
        RewardInfo memory rewardInfo = RewardInfo(member, i, bankRewardPerChair);
        sendTokens(member.account, rewardInfo.value);
        emit Winner(block.timestamp, room.id, room.step, rewardInfo);
      }
    }

    room.active = false;
    emit FinishRoom(block.timestamp, room.id, room);
  }

  function getValidAddressCount(address[] memory _addresses) internal returns(uint) {
    uint counter = 0;
    for (uint i = 0; i < _addresses.length; i++) {
      if (_addresses[i] != address(0)) {
        counter++;
      }
    }
    return counter;
  }

}
