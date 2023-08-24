// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDotImageRepository} from "./interface/IDotImageRepository.sol";

contract DotImageRepository is IDotImageRepository {
    function constructDotImage(bytes calldata inputData) external pure override returns (DotImage memory) {
        _validateRLESvg(inputData);

        DotImage memory dotImage;
        dotImage.imageData = inputData;
        return dotImage;
    }

    function _validateRLESvg(bytes memory rleSvg) internal pure {
        require(_isValidRleSvgFormat(rleSvg), "invalidDecompressedSvgFormat");
        require(_decompressedSvgLength(rleSvg) == 1024, "invalidDecompressedSvgLength");
    }

    function _isValidRleSvgFormat(bytes memory rleSvg) internal pure returns (bool) {
        bool result = true;

        if (_isEmptyBytes(rleSvg) || _isUnevenPairBytes(rleSvg)) {
            result = false;
        }

        return result;
    }

    function _isEmptyBytes(bytes memory rleSvg) internal pure returns (bool) {
        return rleSvg.length == 0;
    }

    function _isUnevenPairBytes(bytes memory rleSvg) internal pure returns (bool) {
        return rleSvg.length % 2 != 0;
    }

    function _decompressedSvgLength(bytes memory rleSvg) internal pure returns (uint256) {
        uint256 decompressedBytesLength = 0;

        for (uint256 i = 0; i < rleSvg.length; i += 2) {
            decompressedBytesLength += uint8(rleSvg[i]);
        }
        return decompressedBytesLength;
    }
}
