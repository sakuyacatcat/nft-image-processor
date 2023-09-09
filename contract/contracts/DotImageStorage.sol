// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDotImageStorage} from "./interface/IDotImageStorage.sol";
import {IDotImageRepository} from "./interface/IDotImageRepository.sol";
import {DotImageLibrary} from "./lib/DotImageLibrary.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DotImageStorage is IDotImageStorage, Ownable {
    mapping(uint256 => DotImageLibrary.DotImage) private _dotImages;

    address private _owner;
    IDotImageRepository private _dotImageRepository;

    constructor() {
        _owner = msg.sender;
    }

    function setRepository(address dotImageRepository) external onlyOwner {
        _dotImageRepository = IDotImageRepository(dotImageRepository);
    }

    modifier onlyValidRepository() {
        require(IDotImageRepository(msg.sender) == _dotImageRepository, "invalidRepository");
        _;
    }

    function createDotImage(uint256 tokenId, DotImageLibrary.DotImage memory dotImage) external onlyValidRepository {
        require(_isValidTokenId(tokenId), "invalidTokenId");
        require(!_isExistingTokenId(tokenId), "existingTokenId");
        _dotImages[tokenId] = dotImage;
    }

    function readDotImage(uint256 tokenId)
        external
        view
        onlyValidRepository
        returns (DotImageLibrary.DotImage memory)
    {
        require(_isValidTokenId(tokenId), "invalidTokenId");
        require(_isExistingTokenId(tokenId), "notExistingTokenId");
        return _dotImages[tokenId];
    }

    function deleteDotImage(uint256 tokenId) external onlyValidRepository {}

    function _isValidTokenId(uint256 tokenId) private pure returns (bool) {
        return tokenId > 0;
    }

    function _isExistingTokenId(uint256 tokenId) private view returns (bool) {
        return _dotImages[tokenId].imageData.length != 0;
    }
}
