import MagicToken from "~/../contract/build/contracts/MagicToken.json"

export class MGTTokenContract {
  constructor (provider, data) {
    this.address = data.address
    this.provider = provider
    this.contract = new this.provider.eth.Contract(MagicToken.abi, this.address)
  }

  async allowance (contractAddress, account) {
    try {
      const result = await this.contract.methods.allowance(account, contractAddress).call()
      return +this.provider.utils.fromWei(result)
    } catch (e) {
      return 0
    }
  }

  approve (contractAddress, from, amount) {
    const value = this.provider.utils.toWei(amount.toString())
    const data = this.contract.methods.approve(contractAddress, value).encodeABI()
    return this.sendTx(from, data)
  }

  async getBalance (account) {
    try {
      const result = await this.contract.methods.balanceOf(account).call()
      return +(+this.provider.utils.fromWei(result)).toFixed(2)
    } catch (e) {
      return 0
    }
  }

  sendTx (from, data) {
    const to = this.address
    return window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{ from, to, data }]
    })
  }
}
