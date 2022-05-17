import MagicRoom from "~/../contract/build/contracts/MagicRoom.json"
import Web3 from "web3"

export class MagicRoomContract {
  constructor (provider, address) {
    this.address = address
    this.provider = provider
    this.contract = new this.provider.eth.Contract(MagicRoom.abi, address)
  }

  async isOwner (address) {
    const ownerAddress = await this.contract.methods.owner().call()
    return ownerAddress.toUpperCase() === address.toUpperCase()
  }

  async getCurrentRoom (from) {
    try {
      const result = await this.contract.methods.getCurrentRoom().call()
      return {
        price: formatValue(result.price),
        bank: formatValue(result.bank),
        active: result.active,
        chairs: result.chairs,
        step: +result.step
      }
    } catch (e) {
      return null
    }
  }

  enterToRoom (from, amount) {
    const value = this.provider.utils.toWei(amount.toString())
    const data = this.contract.methods.enterToRoom(value).encodeABI()
    return this.sendTx(from, data)
  }

  createRoom (from) {
    const data = this.contract.methods.createRoom().encodeABI()
    return this.sendTx(from, data)
  }

  finishRoom (from) {
    const data = this.contract.methods.finishRoom().encodeABI()
    return this.sendTx(from, data)
  }

  sendTx (from, data) {
    const to = this.address
    return window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{ from, to, data }]
    })
  }

  async watch (cb) {
    const latestBlockNumber = await this.provider.eth.getBlockNumber()
    const fromBlock = Math.max(0, latestBlockNumber - 5)
    await this.contract.getPastEvents('allEvents', { fromBlock, toBlock: latestBlockNumber }, (err, eventData) => {
      if (!err) {
        console.log('0', eventData[0].blockNumber)
        console.log('last', eventData[eventData.length - 1].blockNumber)
        eventData.forEach((event) => {
          const data = RegistryEvents.parse(event)
          if (data) {
            cb(data)
          }
        })
      }
    })
    this.contract.events.allEvents({}, (err, event) => {
      if (!err) {
        const data = RegistryEvents.parse(event)
        if (data) {
          cb(data)
        }
      }
    })
  }
}

class RegistryEvents {
  static parse (eventData) {
    if (RegistryEvents[eventData.event]) {
      return {
        id: eventData.id,
        event: eventData.event,
        blockNumber: eventData.blockNumber,
        data: RegistryEvents[eventData.event](eventData.returnValues)
      }
    } else {
      console.log('event nor found:', eventData.event, eventData)
      return null
    }
  }

  static Vip (data) {
    return {
      chair: data.chair,
      roomId: +data.roomId,
      step: +data.step
    }
  }

  static Reward (data) {
    return {
      chair: data.chair,
      roomId: +data.roomId,
      step: +data.step,
      value: formatValue(data.value)
    }
  }

  static ChangeChair (data) {
    return {
      bank: formatValue(data.bank),
      chairIndex: +data.chairIndex,
      enter: data.enter,
      leave: data.leave,
      price: formatValue(data.price),
      roomId: +data.roomId,
      step: +data.step
    }
  }
}

function formatValue (value, digits = 2) {
  return +(+Web3.utils.fromWei(value)).toFixed(digits)
}
