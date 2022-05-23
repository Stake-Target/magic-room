import Web3 from 'web3'
import { MGTTokenContract } from "~/plugins/web3/token.contract"
import { MagicRoomContract } from "~/plugins/web3/game.contract"

const networkData = {
  chainId: '0x' + (97).toString(16),
  chainName: 'Binance Smart Chain Testnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: [
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    'https://data-seed-prebsc-2-s1.binance.org:8545',
    'https://data-seed-prebsc-1-s2.binance.org:8545',
    'https://data-seed-prebsc-1-s3.binance.org:8545',
    'https://data-seed-prebsc-2-s3.binance.org:8545'
  ],
  blockExplorerUrls: ['https://testnet.bscscan.com/']
  // iconUrls?: string[]; // Currently ignored.
}

const tokenData = {
  address: '0xc8AcEF3CA6CB447E1EfAe6A79e3d20BBCc5723B8',
  symbol: 'MGT',
  decimals: '18'
}
const gameData = {
  address: '0xb229D89118f8e6DC27DA022ecfDB163E5F37e88e'
}

export default function ({ app }, inject) {
  const provider = new Web3(networkData.rpcUrls[2])
  // const provider = new Web3(window.web3.currentProvider)
  // ethereum.on('chainChanged', handleChainChanged)
  const token = new MGTTokenContract(provider, tokenData)
  const game = new MagicRoomContract(provider, gameData)

  async function addToken () {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenData.address,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals
            // image: tokenImage
          }
        }
      })
    } catch (error) {}
  }

  async function switchChain () {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkData.chainId }]
      })
    } catch (switchError) {
      console.log('switchError', switchError)
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkData]
          })
        } catch (addError) {}
      }
    }
  }

  function getTokenExplorerUrl () {
    return networkData.blockExplorerUrls[0] + '/address/' + tokenData.address
  }

  function getGameExplorerUrl () {
    return networkData.blockExplorerUrls[0] + '/address/' + gameData.address
  }

  inject('web3', { provider, token, game, addToken, switchChain, getTokenExplorerUrl, getGameExplorerUrl })
}
