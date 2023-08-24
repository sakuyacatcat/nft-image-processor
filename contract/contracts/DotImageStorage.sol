// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDotImageStorage} from "./interface/IDotImageStorage.sol";
import {DotImageLibrary} from "./lib/DotImageLibrary.sol";

contract DotImageStorage is IDotImageStorage {
    function createDotImage(uint256 tokenId) external view returns (DotImageLibrary.DotImage memory) {
        DotImageLibrary.DotImage memory dotImage;
        dotImage.imageData = bytes("createDotImage");
        return dotImage;
    }

    function getDotImage(uint256 tokenId, DotImageLibrary.DotImage memory dotImage) external view {}
}
