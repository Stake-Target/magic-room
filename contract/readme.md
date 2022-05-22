truffle build
truffle test ./test/MagicRoom.js
truffle console --network development
  migrate
  migrate --reset


https://trufflesuite.com/docs/truffle/getting-started/running-migrations/

# Deploy to loom

1) https://loomx.io/developers/en/basic-install-all.html#purpose
2) ./loom genkey -a public_key -k private_key


# BSC

* [test network](https://medium.com/spartanprotocol/how-to-connect-metamask-to-bsc-testnet-7d89c111ab2)
  * Network Name: BSC Testnet
  * New RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545
  * ChainID: 97 
  * Symbol: BNB 
  * Block Explorer URL: https://explorer.binance.org/smart-testnet
* [testnet faucet](https://testnet.bscscan.com/)

### console

    truffle console --network testnet
