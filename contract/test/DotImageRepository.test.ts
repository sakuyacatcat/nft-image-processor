import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("DotImageRepository", function() {
  let contract: Contract;

  beforeEach(async () => {
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

    describe("入力された連長圧縮された svg 文字列が不正な長さの場合 DotImage オブジェクトの作成に失敗する", function() {
      const testCases = [
        { name: "32x32 ドット分の文字列よりも 1 文字少ない bytes 列の場合", input: "0xff00ff00ff00ff000300", expected: "invalidDecompressedSvgLength" },
        { name: "32x32 ドット分の文字列よりも 1 文字多い bytes 列の場合", input: "0xff00ff00ff00ff000500", expected: "invalidDecompressedSvgLength" },
      ];

      testCases.forEach(({name, input, expected}) => {
        it(`入力が適切な連長圧縮フォーマットであるが、${name}に ${expected} エラーを返す`, async () => {
          await expect(contract.constructDotImage(input)).to.be.rejectedWith(expected);
        });
      });
    });

    describe("入力された連長圧縮 svg 文字列が不正なフォーマットの場合 DotImage オブジェクトの作成に失敗する", function() {
      const testCases = [
        { name: "空の bytes 文字列の場合", input: "0x", expected: "invalidDecompressedSvgFormat"},
        { name: "奇数長の bytes 文字列の場合", input: "0xff", expected: "invalidDecompressedSvgFormat"},
        { name: "0~F 以外の文字を含む場合", input: "0xff!!", expected: "invalid arrayify value"},
        { name: "0x 始まりの bytes 文字列でない場合", input: "ff00", expected: "invalid arrayify value"},
      ];

      testCases.forEach(({name, input, expected}) => {
        it(`入力の連長圧縮が${name}に ${expected} エラーを返す`, async () => {
          await expect(contract.constructDotImage(input)).to.be.rejectedWith(expected);
        });
      });
    });
  })
});
