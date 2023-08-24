import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("DotImageRepository", function() {
  let contract: Contract;

  before(async () => {
    const DotImageRepository = await ethers.getContractFactory("DotImageRepository");
    contract = await DotImageRepository.deploy();
  });

  describe("連長圧縮された svg 文字列を入力に DotImage オブジェクトを作成できる", function() {
    describe("入力された連長圧縮された svg 文字列が適切な場合 DotImage オブジェクトの作成に成功する", function() {
      it("入力が適切な連長圧縮フォーマットであり、32x32 ドット分の文字列の場合 svg オブジェクトを返す", async () => {
        // すべて"00"のカラーインデックスの32x32のドット絵のsvgを連長圧縮したbytes列
        const validCompressedSVG = "0xff00ff00ff00ff00";
        const dotImage = await contract.constructDotImage(validCompressedSVG)
        expect(dotImage.imageData).to.equal("0xff00ff00ff00ff00");
      });
    });

  })
});
