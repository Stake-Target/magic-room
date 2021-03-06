import MagicRoom from "~/../contract/build/contracts/MagicRoom.json"
import Web3 from "web3"

export class MagicRoomContract {
  constructor (provider, data) {
    this.address = data.address
    this.provider = provider
    this.genesisBlock = 19585969
    this.contract = new this.provider.eth.Contract(MagicRoom.abi, this.address)
    this._listeners = []
    this._updateListeners = []
    this.latestBlock = null
    this.watch()
    // this.contract.events.allEvents({}, (err, event) => {
    //   if (!err) {
    //     const data = RegistryEvents.parse(event)
    //     if (data) {
    //       this._listeners.forEach(cb => cb(data))
    //     }
    //   }
    // })
  }

  async watch () {
    await new Promise(resolve => setTimeout(resolve, 4000))
    const latestBlock = await this.provider.eth.getBlockNumber()
    if (latestBlock !== this.latestBlock) {
      if (this.latestBlock) {
        const result = await this.getPastEvents({ toBlock: latestBlock, fromBlock: this.latestBlock + 1 })
        const events = result.events.reverse()
        events.forEach(event => this._listeners.forEach(cb => cb(event)))
        if (events.length) {
          this._updateListeners.forEach(cb => cb(events))
        }
      }
      this.latestBlock = latestBlock
    }
    this.watch()
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

  setStepsCount (from, steps) {
    const data = this.contract.methods.setStepsCount(steps).encodeABI()
    return this._sendTx(from, data)
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
    // const _options = Object.assign({ toBlock: '19527838', fromBlock: '19527838' }, options)
    const _options = Object.assign({}, options)
    const events = []
    if (!_options.toBlock) {
      _options.toBlock = await this.provider.eth.getBlockNumber()
    }
    if (!_options.fromBlock) {
      _options.fromBlock = Math.max(this.genesisBlock, _options.toBlock - 1000)
    }
    // await this.contract.getPastEvents('StartRoom', {}, (err, eventData) => {
    //   console.log('StartRoom events', err, eventData)
    // })
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
    return {
      events: events.reverse(),
      fromBlock: _options.fromBlock,
      toBlock: _options.toBlock
    }
  }

  addEventsListener (cb) {
    this._listeners.push(cb)
  }

  addUpdateListener (cb) {
    this._updateListeners.push(cb)
  }
}

class RegistryEvents {
  static parse (eventData) {
    if (RegistryEvents[eventData.event]) {
      return {
        id: eventData.id,
        event: eventData.event,
        blockNumber: +eventData.blockNumber,
        timestamp: +eventData.returnValues.timestamp,
        data: RegistryEvents[eventData.event](eventData.returnValues)
      }
    } else {
      // console.log('event nor found:', eventData.event, eventData)
      return null
    }
  }

  static FinishRoom (data) {
    return {
      step: 0,
      roomId: +data.room.id,
      room: RegistryEvents.Room(data.room)
    }
  }

  static StartRoom (data) {
    return {
      step: 0,
      roomId: +data.room.id,
      room: RegistryEvents.Room(data.room)
    }
  }

  static Vip (data) {
    return {
      roomId: +data.roomId,
      step: +data.step,
      reward: {
        index: +data.reward.index,
        value: formatValue(data.reward.value),
        member: data.reward.member
      }
    }
  }

  static Reward (data) {
    return {
      roomId: +data.roomId,
      step: +data.step,
      reward: {
        index: +data.reward.index,
        value: formatValue(data.reward.value),
        member: data.reward.member
      }
    }
  }

  static Winner (data) {
    return {
      roomId: +data.roomId,
      step: +data.step,
      reward: {
        index: +data.reward.index,
        value: formatValue(data.reward.value),
        member: data.reward.member
      }
    }
  }

  static ChangeChair (data) {
    return {
      roomId: +data.roomId,
      step: +data.step,
      room: RegistryEvents.Room(data.room),
      chairChanges: {
        index: +data.chairChanges.index,
        enter: data.chairChanges.enter,
        leave: data.chairChanges.leave
      }
    }
  }

  static Room (data) {
    return {
      id: +data.id,
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
