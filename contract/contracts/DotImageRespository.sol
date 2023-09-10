// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDotImageRepository} from "./interface/IDotImageRepository.sol";
import {IDotImageStorage} from "./interface/IDotImageStorage.sol";
import {DotImageLibrary} from "./lib/DotImageLibrary.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DotImageRepository is IDotImageRepository, Ownable {
    IDotImageStorage private _dotImageStorage;

    function constructDotImage(bytes calldata inputData)
        external
        pure
        override
        returns (DotImageLibrary.DotImage memory)
    {
        _validateRLESvg(inputData);

        DotImageLibrary.DotImage memory dotImage;
        dotImage.imageData = inputData;
        return dotImage;
    }

    function mintDotImage(uint256 tokenId, DotImageLibrary.DotImage memory dotImage) external override {
        _dotImageStorage.createDotImage(tokenId, dotImage);
    }

    function getDotImage(uint256 tokenId) external view override returns (DotImageLibrary.DotImage memory) {
        DotImageLibrary.DotImage memory dotImage = _dotImageStorage.readDotImage(tokenId);
        return dotImage;
    }

    function burnDotImage(uint256 tokenId) external override {
        _dotImageStorage.deleteDotImage(tokenId);
    }

    function setStorage(address dotImageStorage) external onlyOwner {
        _dotImageStorage = IDotImageStorage(dotImageStorage);
    }

    function _validateRLESvg(bytes memory rleSvg) private pure {
        require(_isValidRleSvgFormat(rleSvg), "invalidDecompressedSvgFormat");
        require(_decompressedSvgLength(rleSvg) == 1024, "invalidDecompressedSvgLength");
    }

    function _isValidRleSvgFormat(bytes memory rleSvg) private pure returns (bool) {
        bool result = true;

        if (_isEmptyBytes(rleSvg) || _isUnevenPairBytes(rleSvg)) {
            result = false;
        }

        return result;
    }

    function _isEmptyBytes(bytes memory rleSvg) private pure returns (bool) {
        return rleSvg.length == 0;
    }

    function _isUnevenPairBytes(bytes memory rleSvg) private pure returns (bool) {
        return rleSvg.length % 2 != 0;
    }

    function _decompressedSvgLength(bytes memory rleSvg) private pure returns (uint256) {
        uint256 decompressedBytesLength = 0;

        for (uint256 i = 0; i < rleSvg.length; i += 2) {
            decompressedBytesLength += uint8(rleSvg[i]);
        }
        return decompressedBytesLength;
    }
}
