import Web3 from 'Web3'
import { MGTTokenContract } from "~/plugins/web3/token.contract"
import { MagicRoomContract } from "~/plugins/web3/game.contract"

export default function ({ app }, inject) {
  const provider = new Web3(window.web3.currentProvider)
  const token = new MGTTokenContract(provider, '0xec609218AA69faA4371D282e34Ff423D00afC137')
  const game = new MagicRoomContract(provider, '0xb60634925867304CF4a4aACdFDd2937538F54862')
  inject('web3', { provider, token, game })
}
