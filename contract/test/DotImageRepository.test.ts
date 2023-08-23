import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("DotImageRepository", function() {
  let contract: Contract;

  before(async () => {
    const DotImageRepository = await ethers.getContractFactory("DotImageRepository");
    contract = await DotImageRepository.deploy();
  });
});
