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
        _colorValidation(_color);
        palettes[_paletteIndex].push(_color);
    }

    function _colorValidation(string calldata _color) internal pure {
        require(_isNotNullString(_color), "nullStringColor");
        require(_isValidColorDigit(_color), "invalidDigitColor");
        require(_isValidHexColor(_color), "invalidHexStringColor");
    }

    function _isNotNullString(string calldata _string) private pure returns (bool) {
        return bytes(_string).length != 0;
    }

    function _isValidHexColor(string calldata _color) private pure returns (bool) {
        bytes memory colorBytes = bytes(_color);
        for (uint256 i = 0; i < colorBytes.length; i++) {
            bytes1 char = colorBytes[i];
            if (!_isValidHexChar(char)) {
                return false;
            }
        }
        return true;
    }

    function _isValidHexChar(bytes1 _char) private pure returns (bool) {
        return (_char >= bytes1("0") && _char <= bytes1("9")) || (_char >= bytes1("a") && _char <= bytes1("f"))
            || (_char >= bytes1("A") && _char <= bytes1("F"));
    }

    function _isValidColorDigit(string calldata _color) private pure returns (bool) {
        return bytes(_color).length == 6;
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
