// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./CropNft.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "./ICropNft.sol";

contract Manager {
    uint256 private numOfNft;
    address[] public allCropNft;

    struct attribute {
        uint256 id;
        string farmerName;
        string cropsName;
        string description;
        uint256 totalMint;
        uint256 availableMint;
        uint256 price;
        uint256 expirationDate;
    }

    constructor() {
        console.log("This is my NFT contract.");
    }

    function newCrops(
        string memory _farmerName,
        string memory _cropsName,
        string memory _description,
        uint256 _totalMint,
        uint256 _price,
        uint256 _expirationDate
    ) public {
        CropNft newNft = new CropNft(
            _farmerName,
            _cropsName,
            _description,
            _totalMint,
            _price,
            _expirationDate
        );
        allCropNft.push(address(newNft));
        numOfNft++;
    }

    function allAttribute() public view returns (attribute[] memory) {
        attribute[] memory attributes = new attribute[](numOfNft);
        for (uint256 index = 0; index < numOfNft; index++) {
            if (allCropNft[index] != address(0)) {
                attributes[index] = attribute(
                    index,
                    ICropNft(allCropNft[index]).farmerName(),
                    ICropNft(allCropNft[index]).cropsName(),
                    ICropNft(allCropNft[index]).description(),
                    ICropNft(allCropNft[index]).totalMint(),
                    ICropNft(allCropNft[index]).availableMint(),
                    ICropNft(allCropNft[index]).price(),
                    ICropNft(allCropNft[index]).expirationDate()
                );
            }
        }
        return attributes;
    }
}
