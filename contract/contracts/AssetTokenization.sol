// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./FarmNft.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract AssetTokenization is AutomationCompatibleInterface {
    address[] public farmers;
    mapping(address => FarmNft) farmerToNftContract;

    struct nftContractDetails {
        address farmerAddress;
        string farmerName;
        string name;
        string symbol;
        string description;
        uint256 totalMint;
        uint256 availableMint;
        uint256 price;
        uint256 expirationDate;
    }

    function isContractDeployed(address farmer) internal view returns (bool) {
        return address(farmerToNftContract[farmer]) != address(0);
    }

    function addFarmer(address newFarmer) internal {
        for (uint256 index = 0; index < farmers.length; index++) {
            if (newFarmer == farmers[index]) {
                return;
            }
        }
        farmers.push(newFarmer);
    }

    function generateNftContract(
        string memory _farmerName,
        string memory _name,
        string memory _symbol,
        string memory _description,
        uint256 _totalMint,
        uint256 _price,
        uint256 _expirationDate
    ) public {
        require(
            isContractDeployed(msg.sender) == false,
            "Your token is already deployed"
        );

        addFarmer(msg.sender);

        FarmNft newNft = new FarmNft(
            msg.sender,
            _farmerName,
            _name,
            _symbol,
            _description,
            _totalMint,
            _price,
            _expirationDate
        );

        farmerToNftContract[msg.sender] = newNft;
    }

    function getNftContractDetails(address farmerAddress)
        public
        view
        returns (nftContractDetails memory)
    {
        nftContractDetails memory details;
        details = nftContractDetails(
            farmerToNftContract[farmerAddress].farmerAddress(),
            farmerToNftContract[farmerAddress].farmerName(),
            farmerToNftContract[farmerAddress].name(),
            farmerToNftContract[farmerAddress].symbol(),
            farmerToNftContract[farmerAddress].description(),
            farmerToNftContract[farmerAddress].totalMint(),
            farmerToNftContract[farmerAddress].availableMint(),
            farmerToNftContract[farmerAddress].price(),
            farmerToNftContract[farmerAddress].expirationDate()
        );

        return details;
    }

    function buyNft(address farmerAddress) public {
        require(isContractDeployed(farmerAddress), "Not yet deployed");
        farmerToNftContract[farmerAddress].mintNFT(msg.sender);
    }

    function getBuyers() public view returns (address[] memory) {
        return farmerToNftContract[msg.sender].getTokenOwners();
    }

    //TODO なぜchianlinkなのか調べておく
    // for upkeep that chainlink automation function.
    // if checkUpkeep() returns true, chainlink automatically runs performUpkeep() that follows below.
    // check whether there are expired contracts.
    function checkUpkeep(
        bytes calldata /* optional data. don't use in this code */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* optional data. return initial value in this code */
        )
    {
        for (uint256 index = 0; index < farmers.length; index++) {
            if (isContractDeployed(farmers[index]) == false) {
                continue;
            }
            if (farmerToNftContract[farmers[index]].isExpired() == true) {
                return (true, "");
            }
        }
        return (false, "");
    }

    // for chainlink
    // burn expired NFT and delete NFT Contract.
    function performUpkeep(
        bytes calldata /* optional data. don't use in this code */
    ) external override {
        for (uint256 index = 0; index < farmers.length; index++) {
            address farmer = farmers[index];
            if (isContractDeployed(farmer) == false) {
                continue;
            }
            if (farmerToNftContract[farmer].isExpired() == true) {
                farmerToNftContract[farmer].burnNFT();
                delete farmerToNftContract[farmer];
            }
        }
    }
}
