const utils = require("./helpers/utils");
const Web3 = require("web3");
const time = require("./helpers/time");
const MagicRoom = artifacts.require("MagicRoom");
const MagicToken = artifacts.require("MagicToken");

contract("MagicRoom", (accounts) => {
  let [alice, bob, cavin, dany] = accounts;
  let tokenContractInstance;
  let contractInstance;

  beforeEach(async () => {
    tokenContractInstance = await MagicToken.new();
    contractInstance = await MagicRoom.new(
      tokenContractInstance.address
    );
  });

  context("create a new room", async () => {
    it("should be able to create a new room", async () => {
      const result = await createRoom(alice);
      expect(result.receipt.status).to.equal(true);
    })
    it("should be able to create a new room and enter", async () => {
      await createRoom(alice);
      const result = await contractInstance.getCurrentRoom.call();
      expect(result.chairs.includes(alice)).to.equal(true);
    })
    it("should not allow two room", async () => {
      await giveTokens(bob, 100);
      await createRoom(alice);
      await utils.shouldThrow(contractInstance.createRoom(toWei(2), { from: bob }));
    })
  })

  context("view fns", async () => {
    it("should return tokenomic", async () => {
      const tokenimic = await contractInstance.getTokenimic.call();
      expect(tokenimic.winners.toNumber()).to.be.a('number');
      expect(tokenimic.vip.toNumber()).to.be.a('number');
      expect(tokenimic.reward.toNumber()).to.be.a('number');
      expect(tokenimic.fee.toNumber()).to.be.a('number');
    })
    it("should return current room", async () => {
      await giveTokens(bob, 100);
      await contractInstance.createRoom(toWei(1), { from: bob });
      const result = await contractInstance.getCurrentRoom.call();
      expect(+result.id).to.be.a('number');
      expect(+result.step).to.be.a('number');
      expect(+result.steps).to.be.a('number');
      expect(fromWei(result.price)).to.be.a('number');
      expect(fromWei(result.bank)).to.be.a('number');
      expect(+result.lastActionTime).to.be.a('number');
      expect(result.active).to.be.a('boolean');
      expect(result.chairs).to.be.a('array');
    })
  })

  context("enter to room", async () => {
    it("on chair", async () => {
      await createRoom(alice);
      await giveTokens(bob, 100);
      await contractInstance.enterToRoom(toWei(2), { from: bob });
      const room = await contractInstance.getCurrentRoom.call();
      expect(room.chairs.includes(bob)).to.equal(true);
    })
    it("small amount", async () => {
      await createRoom(alice);
      await giveTokens(bob, 100);
      await utils.shouldThrow(contractInstance.enterToRoom(toWei("0.0001"), { from: bob }));
    })
    it("amount should go up", async () => {
      await createRoom(alice);
      await giveTokens(bob, 100);
      await giveTokens(cavin, 100);

      const resultBob = await contractInstance.enterToRoom(toWei(2), { from: bob });
      const resultCavin = await contractInstance.enterToRoom(toWei(3), { from: cavin });

      expect(resultBob.receipt.status).to.equal(true);
      expect(resultCavin.receipt.status).to.equal(true)
      await utils.shouldThrow(contractInstance.enterToRoom(toWei(3), { from: cavin }));
    })
    it("rewards", async () => {
      await createRoom(bob);
      await giveTokens(bob, 99);
      await giveTokens(cavin, 100);
      await contractInstance.enterToRoom(toWei(2), { from: cavin });
      const balanceBob = fromWei(await tokenContractInstance.balanceOf(bob));
      const balanceCavin = fromWei(await tokenContractInstance.balanceOf(cavin));
      expect(balanceBob > 99).to.equal(true);
      expect(balanceCavin === 98).to.equal(true);
    })
  })

  context("room", async () => {
    it("should change lastActionTime", async () => {
      await createRoom(alice, 1);
      await contractInstance.setStepsCount(3);
      const room = await contractInstance.getCurrentRoom.call();
      const startActionTime = room.lastActionTime;

      await giveTokens(bob, 10000);

      for(let i = 1, prevPrice = fromWei(room.price) + 1; i < +room.steps; i++, prevPrice ++) {
        await contractInstance.enterToRoom(toWei(prevPrice), { from: bob });
        const roomAfterEnter = await contractInstance.getCurrentRoom.call();
        expect(startActionTime !== roomAfterEnter.lastActionTime).to.equal(true);
      }
    })
    it("should finish", async () => {
      await createRoom(alice, 1);
      await contractInstance.setStepsCount(3 * 3 + 1);
      const room = await contractInstance.getCurrentRoom.call();
      await giveTokens(bob, 10000);
      await giveTokens(cavin, 10000);
      await giveTokens(dany, 10000);

      let prevPrice = fromWei(room.price);
      let step = 1;
      for(let i = 1; i < +room.steps; i += 3) {
        await nextBid(bob);
        await nextBid(cavin);
        await nextBid(dany);
      }
      async function nextBid (from) {
        prevPrice += 1;
        step += 1;
        await contractInstance.enterToRoom(toWei(prevPrice), { from });
      }
      const room2 = await contractInstance.getCurrentRoom.call();
      expect(room2.active).to.equal(false);
    })
    // it("timeout", async () => {
    //   await createRoom(alice, 1);
    //   await giveTokens(bob, 10000);
    //   await time.increase(time.duration.days);
    //   const room = await contractInstance.getCurrentRoom.call();
    //   console.log('room', room);
    // })
    it("rewards", async () => {
      const tokenimic = await contractInstance.getTokenimic.call();
      const cavinTikens = 2;
      await createRoom(bob, 1);
      await giveTokens(cavin, cavinTikens);
      const reward = cavinTikens * tokenimic.reward / 100;
      await contractInstance.enterToRoom(toWei(cavinTikens), { from: cavin });
      const balbncaBob = await tokenContractInstance.balanceOf(bob);
      expect(fromWei(balbncaBob) === reward).to.equal(true);
    })
  })

  it("withdraw", async () => {
    await createRoom(bob, 1);
    const tokenimic = await contractInstance.getTokenimic.call();

    await giveTokens(bob, 99);
    await giveTokens(cavin, 100);

    await contractInstance.enterToRoom(toWei(2), { from: cavin });
    const fee = 3 * tokenimic.fee / 100;

    const balanceBefore = fromWei(await contractInstance.balanceOf.call());
    await contractInstance.withdraw(alice);
    const balanceAfter = fromWei(await contractInstance.balanceOf.call());
    expect(balanceBefore === fee).to.equal(true);
    expect(balanceAfter === 0).to.equal(true);
    const balanceOf = fromWei(await tokenContractInstance.balanceOf.call(alice));
    expect(balanceOf === 999999800 + fee).to.equal(true);
  })

  function toWei (value) {
    return Web3.utils.toWei(value.toString());
  }

  function fromWei (value) {
    return +Web3.utils.fromWei(value);
  }

  async function giveTokens (to, amount) {
    await tokenContractInstance.transfer(to, toWei(amount));
    await tokenContractInstance.approve(contractInstance.address, toWei(amount), { from: to });
  }
  async function createRoom (from, amount = 1) {
    await tokenContractInstance.transfer(from, toWei(amount));
    await tokenContractInstance.approve(contractInstance.address, toWei(amount), { from });
    return contractInstance.createRoom(toWei(amount), { from });
  }
})

