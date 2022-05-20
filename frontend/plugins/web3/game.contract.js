import MagicRoom from "~/../contract/build/contracts/MagicRoom.json"
import Web3 from "web3"

export class MagicRoomContract {
  constructor (provider, address) {
    this.address = address
    this.provider = provider
    this.contract = new this.provider.eth.Contract(MagicRoom.abi, address)
    this._listeners = []

    this.contract.events.allEvents({}, (err, event) => {
      if (!err) {
        const data = RegistryEvents.parse(event)
        if (data) {
          this._listeners.forEach(cb => cb(data))
        }
      }
    })
  }

  async isOwner (address) {
    const ownerAddress = await this.contract.methods.owner().call()
    return ownerAddress.toUpperCase() === address.toUpperCase()
  }

  async getCurrentRoom (from) {
    try {
      const result = await this.contract.methods.getCurrentRoom().call()
      return RegistryEvents.Room(result)
    } catch (e) {
      return null
    }
  }

  enterToRoom (from, name, amount) {
    const value = this.provider.utils.toWei(amount.toString())
    const data = this.contract.methods.enterToRoom(name, value).encodeABI()
    return this._sendTx(from, data)
  }

  createRoom (from, name, amount) {
    const value = this.provider.utils.toWei(amount.toString())
    const data = this.contract.methods.createRoom(name, value).encodeABI()
    return this._sendTx(from, data)
  }

  finishRoom (from) {
    const data = this.contract.methods.finishRoom().encodeABI()
    return this._sendTx(from, data)
  }

  _sendTx (from, data) {
    const to = this.address
    return window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{ from, to, data }]
    })
  }

  async getPastEvents (options) {
    const _options = Object.assign({ toBlock: null, fromBlock: null }, options)
    const events = []
    if (!_options.toBlock) {
      _options.toBlock = await this.provider.eth.getBlockNumber()
    }
    if (!_options.fromBlock) {
      _options.fromBlock = Math.max(0, _options.toBlock - 5)
    }
    await this.contract.getPastEvents('allEvents', _options, (err, eventData) => {
      if (!err) {
        return eventData.forEach((data) => {
          const _data = RegistryEvents.parse(data)
          if (_data) {
            events.push(_data)
          }
        })
      }
    })
    return events.reverse()
  }

  addEventsListener (cb) {
    this._listeners.push(cb)
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
      // console.log('event nor found:', eventData.event, eventData)
      return null
    }
  }

  static Vip (data) {
    console.log('Reward', data)
    return {
      chair: data.chair,
      roomId: +data.roomId,
      step: +data.step,
      value: formatValue(data.value)
    }
  }

  static Reward (data) {
    console.log('Reward', data)
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

  static Winner (data) {
    return {
      roomId: +data.roomId,
      step: +data.step,
      chairIndex: +data.chairIndex,
      chair: data.chair,
      leave: data.leave,
      value: formatValue(data.value)
    }
  }

  static Room (data) {
    return {
      roomId: +data.roomId,
      price: formatValue(data.price),
      bank: formatValue(data.bank),
      active: data.active,
      chairs: data.chairs,
      names: data.names,
      lastActionTime: +data.lastActionTime,
      step: +data.step,
      steps: +data.steps
    }
  }
}

function formatValue (value, digits = 2) {
  return +(+Web3.utils.fromWei(value)).toFixed(digits)
}
