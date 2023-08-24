// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDotImageRepository} from "./interface/IDotImageRepository.sol";
import {DotImageLibrary} from "./lib/DotImageLibrary.sol";

contract DotImageRepository is IDotImageRepository {
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

    function sourceDotImage(uint256 tokenId) external pure override returns (DotImageLibrary.DotImage memory) {
        DotImageLibrary.DotImage memory dotImage;
        dotImage.imageData = bytes("sourceDotImage");
        return dotImage;
    }

    function sinkDotImage(uint256 tokenId, DotImageLibrary.DotImage memory dotImage) external pure override {
        require(tokenId == 0, "invalidTokenId");
        require(_isValidRleSvgFormat(dotImage.imageData), "invalidDecompressedSvgFormat");
        require(_decompressedSvgLength(dotImage.imageData) == 1024, "invalidDecompressedSvgLength");
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
