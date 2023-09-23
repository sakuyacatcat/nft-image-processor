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
    // describe("入力された paletteIndex が 0~255 の整数であるが、color が 6 桁の 16 進数文字列でない場合、カラーパレットへの保存に失敗する", function() {});
    // describe("入力された paletteIndex が 0~255 の整数以外の場合、カラーパレットへの保存に失敗する", function() {});
  });

});
