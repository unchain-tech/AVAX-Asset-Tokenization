// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./CropsNft.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

//農家ごとにコントラクトを作る mapping -> contract
contract AssetTokenization {
    CropsNft[] public allNftContracts;
    uint256 private numOfAvailableContracts;
    mapping(uint256 => bool) isAvailableContract;

    struct nftContractAttribute {
        uint256 id;
        string nftName;
        string description;
        uint256 totalMint;
        uint256 availableMint;
        uint256 price;
        uint256 expirationDate;
    }

    constructor() {
        console.log("This is my NFT contract.");
    }

    function newCropsNft(
        string memory _nftName,
        string memory _description,
        uint256 _totalMint,
        uint256 _price,
        uint256 _expirationDate
    ) public {
        CropsNft newNft = new CropsNft(
            _nftName,
            _description,
            _totalMint,
            _price,
            _expirationDate
        );

        numOfAvailableContracts++;

        uint256 currentId = allNftContracts.length;
        isAvailableContract[currentId] = true;

        allNftContracts.push(newNft);
    }

    function getAllCropsNft()
        public
        view
        returns (nftContractAttribute[] memory)
    {
        nftContractAttribute[] memory attributes = new nftContractAttribute[](
            numOfAvailableContracts
        );
        for (uint256 index = 0; index < numOfAvailableContracts; index++) {
            if (isAvailableContract[index]) {
                attributes[index] = nftContractAttribute(
                    index,
                    allNftContracts[index].nftName(),
                    allNftContracts[index].description(),
                    allNftContracts[index].totalMint(),
                    allNftContracts[index].availableMint(),
                    allNftContracts[index].price(),
                    allNftContracts[index].expirationDate()
                );
            }
        }
        return attributes;
    }

    function buy(uint256 id) public {
        allNftContracts[id].mint();
    }

    function getAddress(uint256 id) public view returns (address) {
        return address(allNftContracts[id]);
    }

    function checkExpiration() public {
        for (uint256 index = 0; index < numOfAvailableContracts; index++) {
            if (isAvailableContract[index] == false) {
                continue;
            }
            if (allNftContracts[index].available() == false) {
                isAvailableContract[index] = false;
                numOfAvailableContracts--;
                allNftContracts[index].burn();
            }
        }
    }
}
