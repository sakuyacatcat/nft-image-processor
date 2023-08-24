// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {DotImageLibrary} from "../lib/DotImageLibrary.sol";

interface IDotImageRepository {
    function constructDotImage(bytes calldata inputData) external view returns (DotImageLibrary.DotImage memory);
    function sourceDotImage(uint256 tokenId) external view returns (DotImageLibrary.DotImage memory);
    function sinkDotImage(uint256 tokenId, DotImageLibrary.DotImage memory dotImage) external view;
}
