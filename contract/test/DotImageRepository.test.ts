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
        const validCompressedSVG = "0xff00ff00ff00ff000400";
        const dotImage = await contract.constructDotImage(validCompressedSVG)
        expect(dotImage.imageData).to.equal("0xff00ff00ff00ff000400");
      });
    });

    describe("入力された連長圧縮された svg 文字列が不正な場合 DotImage オブジェクトの作成に失敗する", function() {
      it("入力が適切な連長圧縮フォーマットであるが、32x32 ドット分の文字列でなく、1文字足りない場合に invalidDecompressedSvgLength エラーを返す", async () => {
        // すべて"00"のカラーインデックスの32x32のドット絵よりも1ドット少ないsvgを連長圧縮したbytes列
        const tooShortCompressedSVG = "0xff00ff00ff00ff000300";
        await expect(contract.constructDotImage(tooShortCompressedSVG)).to.be.rejectedWith("invalidDecompressedSvgLength");
      });

      it("入力が適切な連長圧縮フォーマットであるが、32x32 ドット分の文字列でなく、1文字多い場合に invalidDecompressedSvgLength エラーを返す", async () => {
        // すべて"00"のカラーインデックスの32x32のドット絵よりも1ドット多いsvgを連長圧縮したbytes列
        const tooLongCompressedSVG = "0xff00ff00ff00ff000500";
        await expect(contract.constructDotImage(tooLongCompressedSVG)).to.be.rejectedWith("invalidDecompressedSvgLength");
      });
    })
  })
});
