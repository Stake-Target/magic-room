import Web3 from 'Web3'
import { MGTTokenContract } from "~/plugins/web3/token.contract"
import { MagicRoomContract } from "~/plugins/web3/game.contract"

export default function ({ app }, inject) {
  const provider = new Web3(window.web3.currentProvider)
  const token = new MGTTokenContract(provider, '0x859DC715d6928e665e578Bb11eCBbf3De79f1950')
  const game = new MagicRoomContract(provider, '0xF57571a7d121F69A2082B9D9007894F631e14A78')
  inject('web3', { provider, token, game })
}
