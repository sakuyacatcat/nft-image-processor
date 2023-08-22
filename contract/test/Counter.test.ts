import { expect } from "chai";
import { ethers } from "hardhat";

describe("Counter Contract", function () {
  it("Should increment the count", async function () {
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();
    await counter.deployed();

    // expect(await counter.getCount()).to.equal(0);
    expect((await counter.getCount()).toNumber()).to.equal(0);


    await counter.increment();

    // expect(await counter.getCount()).to.equal(1);
    expect((await counter.getCount()).toNumber()).to.equal(1);

  });
});
