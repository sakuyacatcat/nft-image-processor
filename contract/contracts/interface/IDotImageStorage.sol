// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {DotImageLibrary} from "../lib/DotImageLibrary.sol";

interface IDotImageStorage {
    function createDotImage(uint256 tokenId, DotImageLibrary.DotImage memory dotImage) external;

    function readDotImage(uint256 tokenId) external view returns (DotImageLibrary.DotImage memory);

    function deleteDotImage(uint256 tokenId) external;
}
