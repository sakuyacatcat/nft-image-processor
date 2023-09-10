// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {DotImageLibrary} from "../lib/DotImageLibrary.sol";

interface IDotImageRepository {
    function constructDotImage(bytes calldata inputData) external view returns (DotImageLibrary.DotImage memory);

    function mintDotImage(uint256 tokenId, DotImageLibrary.DotImage memory dotImage) external;

    function getDotImage(uint256 tokenId) external view returns (DotImageLibrary.DotImage memory);

    function burnDotImage(uint256 tokenId) external view;
}
