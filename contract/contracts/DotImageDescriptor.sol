// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {DotImageLibrary} from "./lib/DotImageLibrary.sol";
import {NFTDescriptor} from "./lib/NFTDescriptor.sol";
import {IDotImageDescriptor} from "./interface/IDotImageDescriptor.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract DotImageDescriptor is IDotImageDescriptor, Ownable {
    using Strings for uint256;

    mapping(uint8 => string[]) public palettes;

    function addColorToPalette(uint8 _paletteIndex, string calldata _color) external onlyOwner {
        _addColorToPalette(_paletteIndex, _color);
    }

    function _addColorToPalette(uint8 _paletteIndex, string calldata _color) internal {
        palettes[_paletteIndex].push(_color);
    }

    function getPaletteColor(uint8 _paletteIndex, uint256 _colorIndex) external view returns (string memory) {
        return palettes[_paletteIndex][_colorIndex];
    }

    function tokenURI(DotImageLibrary.DotImage memory dotImage) external view returns (string memory) {
        return dataURI(dotImage);
    }

    function dataURI(DotImageLibrary.DotImage memory dotImage) public view returns (string memory) {
        return "test";
    }
}
