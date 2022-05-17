const MagicToken = artifacts.require("MagicToken");
const MagicRoom = artifacts.require("MagicRoom");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MagicToken, { overwrite: true, from: accounts[0] });
  await deployer.deploy(MagicRoom, MagicToken.address, { overwrite: true, from: accounts[0] });
  // console.log('MagicToken', MagicToken)
  // MagicToken.transfer(accounts[1], "10000000", { from: accounts[0] })
};
