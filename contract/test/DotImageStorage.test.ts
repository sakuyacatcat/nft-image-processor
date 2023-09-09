import { expect } from "chai";
import crypto from "crypto";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("DotImageStorage", function() {
  let storage: Contract;

  before(async () => {
    const deployer = await ethers.getSigner(0);
    const DotImageStorage = await ethers.getContractFactory("DotImageStorage");
    storage = await DotImageStorage.connect(deployer).deploy();
    await storage.deployed();
    await storage.connect(deployer).setRepository(deployer.address);
  });

  describe("入力された tokenId と DotImage オブジェクトを関連付けて保存できる", function() {
    describe("入力された tokenId が未使用の整数であり、DotImage オブジェクトが適切な場合保存に成功する", function() {
      it("tokenId が最小の値の 1 であり、DotImage オブジェクトが適切な場合保存に成功する", async () => {
        const registerId = 1;
        const dotImage = { imageData: '0x' + crypto.randomBytes(10).toString("hex") };
        await storage.createDotImage(registerId, dotImage);
        const storedDotImage = await storage.readDotImage(registerId);
        expect(storedDotImage.imageData).to.deep.equal(dotImage.imageData);
      });
    });
  });

  describe("入力された tokenId に関連付けられた DotImage オブジェクトを取得できる", function() {

  });

  describe("入力された tokenId に関連付けられた DotImage オブジェクトを削除できる", function() {

  });
});
