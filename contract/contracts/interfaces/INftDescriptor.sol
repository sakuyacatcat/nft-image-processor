// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INftDescriptor {
    function tokenURI(uint256 tokenId) external pure returns (string memory image);
}
