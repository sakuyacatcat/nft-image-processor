// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDotImageRepository {
    struct DotImage {
        bytes imageData;
    }

    function constructDotImage(bytes calldata inputData) external view returns (DotImage memory);
}
