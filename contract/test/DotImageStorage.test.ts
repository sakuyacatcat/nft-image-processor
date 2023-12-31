import { expect } from "chai";
import crypto from "crypto";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("DotImageStorage", function() {
  let storage: Contract;

  beforeEach(async () => {
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

    describe("入力された tokenId が有効な整数でない場合、保存に失敗する", function() {
      const testCases = [
        { name: "小数の場合", input: 1.1, expected: "underflow" },
        { name: "負の数の場合", input: -1, expected: "value out-of-bounds" },
        { name: "最小の値より 1 小さい 0 の場合", input: 0, expected: "invalidTokenId" },
      ];

      testCases.forEach(({name, input, expected}) => {
        it(`tokenId が${name}に${expected}エラーを返す`, async () => {
          const registerId = input;
          const dotImage = { imageData: '0x' + crypto.randomBytes(10).toString("hex") };
          await expect(storage.createDotImage(registerId, dotImage)).to.be.rejectedWith(expected);
        });
      });
    });

    describe("入力された tokenId が既に使用されている場合、保存に失敗する", function() {
      it("入力された tokenId が既に使用されている場合、existingTokenId エラーを返す", async () => {
        const registerId = 1;
        const dotImage1 = { imageData: '0x' + crypto.randomBytes(10).toString("hex") };
        await storage.createDotImage(registerId, dotImage1);

        const dotImage2 = { imageData: '0x' + crypto.randomBytes(10).toString("hex") };
        await expect(storage.createDotImage(registerId, dotImage2)).to.be.rejectedWith("existingTokenId");
      });
    });
  });

  describe("入力された tokenId に関連付けられた DotImage オブジェクトを取得できる", function() {
    describe("入力された tokenId が有効な整数であり、関連付けられた DotImage オブジェクトが存在する場合、取得に成功する", function() {
      it("tokenId が 1 であり、関連付けられた DotImage オブジェクトが存在する場合、取得に成功する", async () => {
        const registerId = 1;
        const dotImage = { imageData: '0x' + crypto.randomBytes(10).toString("hex") };
        await storage.createDotImage(registerId, dotImage);
        const storedDotImage = await storage.readDotImage(registerId);
        expect(storedDotImage.imageData).to.deep.equal(dotImage.imageData);
      });
    });

    describe("入力された tokenId が有効な整数であるが、関連付けられた DotImage オブジェクトが存在しない場合、取得に失敗する", function() {
      it("tokenId が 1 であり、関連付けられた DotImage オブジェクトが存在しない場合、notExistingTokenId エラーを返す", async () => {
        const registerId = 1;
        await expect(storage.readDotImage(registerId)).to.be.rejectedWith("notExistingTokenId");
      });
    });

    describe("入力された tokenId が有効な整数でない場合、取得に失敗する", function() {
      const testCases = [
        { name: "小数の場合", input: 1.1, expected: "underflow" },
        { name: "負の数の場合", input: -1, expected: "value out-of-bounds" },
        { name: "最小の値より 1 小さい 0 の場合", input: 0, expected: "invalidTokenId" },
      ];

      testCases.forEach(({name, input, expected}) => {
        it(`tokenId が${name}に${expected}エラーを返す`, async () => {
          const registerId = input;
          await expect(storage.readDotImage(registerId)).to.be.rejectedWith(expected);
        });
      });
    });
  });

  describe("入力された tokenId に関連付けられた DotImage オブジェクトを削除できる", function() {
    describe("入力された tokenId が有効であり、関連付けられた DotImage オブジェクトが存在する場合、削除に成功する", function() {
      it("tokenId が 1 であり、関連付けられた DotImage オブジェクトが存在する場合、削除に成功する", async () => {
        const registerId = 1;
        const dotImage = { imageData: '0x' + crypto.randomBytes(10).toString("hex") };
        await storage.createDotImage(registerId, dotImage);
        await storage.deleteDotImage(registerId);
        await expect(storage.readDotImage(registerId)).to.be.rejectedWith("notExistingTokenId");
      });
    });

    describe("入力された tokenId が有効であるが、関連付けられた DotImage オブジェクトが存在しない場合、削除に失敗する", function() {
      it("tokenId が 1 であり、関連付けられた DotImage オブジェクトが存在しない場合、notExistingTokenId エラーを返す", async () => {
        const registerId = 1;
        await expect(storage.deleteDotImage(registerId)).to.be.rejectedWith("notExistingTokenId");
      });
    });

    describe("入力された tokenId が有効でない場合、削除に失敗する", function() {
      const testCases = [
        { name: "小数の場合", input: 1.1, expected: "underflow" },
        { name: "負の数の場合", input: -1, expected: "value out-of-bounds" },
        { name: "最小の値より 1 小さい 0 の場合", input: 0, expected: "invalidTokenId" },
      ];

      testCases.forEach(({name, input, expected}) => {
        it(`tokenId が${name}に${expected}エラーを返す`, async () => {
          const registerId = input;
          await expect(storage.deleteDotImage(registerId)).to.be.rejectedWith(expected);
        });
      });
    });
  });
});
