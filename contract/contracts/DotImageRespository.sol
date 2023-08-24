// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDotImageRepository} from "./interface/IDotImageRepository.sol";

contract DotImageRepository is IDotImageRepository {
    function constructDotImage(bytes calldata inputData) external pure override returns (DotImage memory) {
        _validateRLESvgLength(inputData);

        DotImage memory dotImage;
        dotImage.imageData = inputData;
        return dotImage;
    }

    function _validateRLESvgLength(bytes memory rleSvg) internal pure {
        require(_decompressedSvgLength(rleSvg) == 1024, "invalidCompressedSvgLength");
    }

    function _decompressedSvgLength(bytes memory rleSvg) internal pure returns (uint256) {
        uint256 decompressedBytesLength = 0;

        for (uint256 i = 0; i < rleSvg.length; i += 2) {
            decompressedBytesLength += uint8(rleSvg[i]);
        }
        return decompressedBytesLength;
    }
}
