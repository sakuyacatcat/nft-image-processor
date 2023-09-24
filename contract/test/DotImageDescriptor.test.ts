import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("DotImageDescriptor", function() {
  let descriptor: Contract;

  beforeEach(async () => {
    const DotImageDescriptor = await ethers.getContractFactory("DotImageDescriptor");
    descriptor = await DotImageDescriptor.deploy();
  });

  describe("入力された paletteIndex に対応するカラーパレットに color を保存できる", function() {
    describe("入力された paletteIndex が 0~255 の整数であり、color が 6 桁の 16 進数文字列の場合、カラーパレットへの保存に成功する", function() {
      const testCases = [
        { paletteCondition: "最小の0", colorCondition: "最小の'000000'", inputPaletteIndex: 0, inputColor: "000000" },
        { paletteCondition: "最大の255", colorCondition: "最小の'000000'", inputPaletteIndex: 255, inputColor: "000000" },
        { paletteCondition: "最小の0", colorCondition: "最大の'ffffff'", inputPaletteIndex: 0, inputColor: "ffffff" },
        { paletteCondition: "最大の255", colorCondition: "最小の'ffffff'", inputPaletteIndex: 255, inputColor: "ffffff" },
      ];

      testCases.forEach(({paletteCondition, colorCondition, inputPaletteIndex, inputColor}) => {
        it(`paletteIndex が 0~255 の整数のうち${paletteCondition}で、color が 6 桁の 16 進数文字列で${colorCondition}の場合、カラーパレットの保存に保存する`, async () => {
          const paletteIndex = inputPaletteIndex;
          const color = inputColor;
          await descriptor.addColorToPalette(paletteIndex, color);
          const addedColor = await descriptor.getPaletteColor(paletteIndex, 0);
          expect(addedColor).to.equal(color);
        });
      });
    });
    describe("入力された paletteIndex が 0~255 の整数であるが、color が 6 桁の 16 進数文字列でない場合、カラーパレットへの保存に失敗する", function() {
      const testCases = [
        { colorCondition: "5桁の16進数文字列", inputColor: "00000", expectedError: "invalidDigitColor" },
        { colorCondition: "7桁の16進数文字列", inputColor: "0000000", expectedError: "invalidDigitColor" },
        { colorCondition: "16進数以外を含む文字列", inputColor: "zzzzzz", expectedError: "invalidHexStringColor" },
        { colorCondition: "整数", inputColor: 1, expectedError: "nullStringColor" },
        { colorCondition: "小数", inputColor: 0.1, expectedError: "nullStringColor" },
        { colorCondition: "空文字列", inputColor: "", expectedError: "nullStringColor" },
      ]

      testCases.forEach(({colorCondition, inputColor, expectedError}) => {
        it(`paletteIndex が 0~255 の整数を満たす 0 であるが、color が${colorCondition}である${inputColor}の場合、${expectedError}を返す`, async () => {
          const paletteIndex = 0;
          const color = inputColor;
          await expect(descriptor.addColorToPalette(paletteIndex, color)).to.be.rejectedWith(expectedError);
        });
      });
    });

    describe("入力された color は 6 桁の 16 進数文字列であるが、paletteIndex が 0~255 の整数以外の場合、カラーパレットへの保存に失敗する", function() {
      const testCases = [
        { paletteCondition: "下端の0よりも1小さい値", inputPaletteIndex: -1, expectedError: "value out-of-bounds" },
        { paletteCondition: "上端の255よりも1大きい値", inputPaletteIndex: 256, expectedError: "value out-of-bounds" },
        { paletteCondition: "小数", inputPaletteIndex: 0.1, expectedError: "underflow" },
      ];

      testCases.forEach(({paletteCondition, inputPaletteIndex, expectedError}) => {
        it(`color が 6 桁の 16 進数文字列を満たす '000000' であるが、paletteIndex が${paletteCondition}である${inputPaletteIndex}の場合、${expectedError}を返す`, async () => {
          const color = "000000";
          const paletteIndex = inputPaletteIndex;
          await expect(descriptor.addColorToPalette(paletteIndex, color)).to.be.rejectedWith(expectedError);
        });
      });
    });
  });

});
