pragma solidity ^0.8.0;

abstract contract Randomize {
  uint randNonce = 0;
  uint[] probabilities = [13, 3, 3, 3, 13, 13, 13, 13, 13, 13];

  function getRandomRange(uint _min, uint _max) public returns(uint) {
    randNonce++;
    return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) %  (_max - _min + 1) + _min;
  }

  function _getRandomIndexInArrayWitsProbability(uint[] memory _probability) private returns(uint) {
    uint accumulate = 0;
    uint accumulate2 = 0;
    uint value;
    uint result = 0;

    for (uint i = 0; i < _probability.length; i++) {
      accumulate = accumulate + _probability[i];
    }

    value = getRandomRange(1, accumulate);

    for (uint i = 0; i < _probability.length; i++) {
      if (value > accumulate2 && value <= accumulate2 + _probability[i]) {
        result = i;
      }
      accumulate2 = accumulate2 + _probability[i];
    }
    return result;
  }

  function getRandomChair() internal returns(uint) {
    return _getRandomIndexInArrayWitsProbability(probabilities);
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
