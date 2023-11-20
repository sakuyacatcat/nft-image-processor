// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDotImageRepository} from "./interface/IDotImageRepository.sol";
import {IDotImageDescriptor} from "./interface/IDotImageDescriptor.sol";
import {DotImageLibrary} from "./lib/DotImageLibrary.sol";
import {ERC721} from "./base/ERC721.sol";

contract DotImageNFT is ERC721 {
    uint256 public currentTokenId;

    IDotImageRepository private _dotImageRepository;
    IDotImageDescriptor private _dotImageDescriptor;

    mapping(uint256 => string) private _usernamesById;

    constructor() ERC721(msg.sender, "DotImageNFT", "DOT", msg.sender, 1000) {}

    function setRepository(address dotImageRepository) external onlyOwner {
        _dotImageRepository = IDotImageRepository(dotImageRepository);
    }

    function setDescriptor(address dotImageDescriptor) external onlyOwner {
        _dotImageDescriptor = IDotImageDescriptor(dotImageDescriptor);
    }

    function mint(string calldata username) public {
        uint256 newId = currentTokenId;
        _safeMint(msg.sender, newId);

        _usernamesById[newId] = username;
        currentTokenId++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "NoExistentTokenError");
        DotImageLibrary.DotImage memory dotImage = _dotImageRepository.getDotImage(tokenId);
        return _dotImageDescriptor.tokenURI(dotImage);
    }
}
