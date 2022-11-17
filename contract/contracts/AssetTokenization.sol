// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./FarmerNft.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract AssetTokenization {
    FarmerNft[] nftContracts;
    uint256 nftContractCount;
    mapping(address => FarmerNft) farmerToNft;

    struct nftDetails {
        string farmerName;
        string name;
        string symbol;
        string description;
        uint256 id;
        uint256 totalMint;
        uint256 availableMint;
        uint256 price;
        uint256 expirationDate;
    }

    function farmerDeployedNft(address farmer) internal view returns (bool) {
        return address(farmerToNft[farmer]) != address(0);
    }

    function isDeployed(uint256 index) internal view returns (bool) {
        return address(nftContracts[index]) != address(0);
    }

    function generateNft(
        string memory _farmerName,
        string memory _name,
        string memory _symbol,
        string memory _description,
        uint256 _totalMint,
        uint256 _price,
        uint256 _expirationDate
    ) public {
        require(
            farmerDeployedNft(msg.sender) == false,
            "Your token is already deployed"
        );

        FarmerNft newNft = new FarmerNft(
            _farmerName,
            _name,
            _symbol,
            _description,
            _totalMint,
            _price,
            _expirationDate
        );

        nftContracts.push(newNft);
        nftContractCount++;
        farmerToNft[msg.sender] = newNft;
    }

    function allNftDetails() public view returns (nftDetails[] memory) {
        nftDetails[] memory deltails = new nftDetails[](nftContractCount);
        uint256 counter;

        for (uint256 index = 0; index < nftContracts.length; index++) {
            if (isDeployed(index)) {
                deltails[counter] = nftDetails(
                    nftContracts[index].farmerName(),
                    nftContracts[index].name(),
                    nftContracts[index].symbol(),
                    nftContracts[index].description(),
                    index,
                    nftContracts[index].totalMint(),
                    nftContracts[index].availableMint(),
                    nftContracts[index].price(),
                    nftContracts[index].expirationDate()
                );
                counter++;
            }
        }

        return deltails;
    }

    function buy(uint256 index) public {
        require(isDeployed(index), "Not yet deployed");
        nftContracts[index].mint(msg.sender);
    }

    function getBuyers() public view returns (address[] memory) {
        return farmerToNft[msg.sender].allOwners();
    }

    // function checkExpiration() public {
    //     for (uint256 index = 0; index < nftContracts.length; index++) {
    //         if (isDeployed(index) == false) {
    //             continue;
    //         }
    //         if (nftContracts[index].available() == false) {
    //             isAvailableContract[index] = false;
    //             numOfAvailableContracts--;
    //             farmerToNft[index].burn();
    //         }
    //     }
    // }
}
