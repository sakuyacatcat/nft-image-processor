// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {DotImageLibrary} from "../lib/DotImageLibrary.sol";

interface IDotImageDescriptor {
    function describe(DotImageLibrary.DotImage memory dotImage) external view returns (string memory);
}
