pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract Tokenomic is Ownable {
  IERC20 token;
  Tokenomics tokenomics = Tokenomics(1, 50, 28, 20);

  uint minPrice = 1 * 10 ** 18;
  uint balance = 0;

  constructor(address _tokenAddress) {
    token = IERC20(_tokenAddress);
  }

  struct Tokenomics {
    uint fee;
    uint reward;
    uint vip;
    uint winners;
  }

  function getShares(uint _amount) internal returns (uint rewards, uint winners, uint vip, uint fee) {
    uint rewards = _amount * tokenomics.reward / 100;
    uint winners = _amount * tokenomics.winners / 100;
    uint vip = _amount * tokenomics.vip / 100;
    uint fee = _amount * tokenomics.fee / 100;
    return (rewards, winners, vip, fee);
  }

  function getTokenimic() external view returns (uint fee, uint reward, uint vip, uint winners ) {
    return (tokenomics.fee, tokenomics.reward, tokenomics.vip, tokenomics.winners);
  }

  function withdraw(address _to) external onlyOwner {
    sendTokens(_to, balance);
    balance = 0;
  }

  function balanceOf() external view onlyOwner returns(uint) {
    return balance;
  }

  function getTokens(uint _amount) internal {
    token.transferFrom(msg.sender, address(this), _amount);
  }

  function sendTokens(address _to, uint _amount) internal {
    token.transfer(_to, _amount);
  }

}
