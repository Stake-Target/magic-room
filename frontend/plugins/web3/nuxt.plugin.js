import Web3 from 'web3'
import { MGTTokenContract } from "~/plugins/web3/token.contract"
import { MagicRoomContract } from "~/plugins/web3/game.contract"

export default function ({ app }, inject) {
  const provider = new Web3(window.web3.currentProvider)
  const token = new MGTTokenContract(provider, '0x165eF67ad7342e0ab5f6d0f60B4B6abB86071E4b')
  const game = new MagicRoomContract(provider, '0x23D03aaE60Dac675cB8554B82756d7e3Ae81FfE9')
  inject('web3', { provider, token, game })
}
