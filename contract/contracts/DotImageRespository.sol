// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDotImageRepository} from "./interface/IDotImageRepository.sol";

contract DotImageRepository is IDotImageRepository {
    function constructDotImage(bytes calldata inputData) external view override returns (DotImage memory) {
        DotImage memory dotImage;
        dotImage.imageData = inputData;
        return dotImage;
    }
}
