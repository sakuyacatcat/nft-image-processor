// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721Base} from "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract ERC721 is ERC721Base {
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721Base(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps) {}
}
