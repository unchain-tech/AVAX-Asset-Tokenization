// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./FarmNft.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract AssetTokenization is AutomationCompatibleInterface {
    FarmNft[] allNftContracts;
    uint256 availableNftContractCount;
    mapping(address => FarmNft) farmerToNftContract;
    //TODO フロントからループを回して, それぞれreturnする

    struct nftContractDetails {
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
        return address(farmerToNftContract[farmer]) != address(0);
    }

    function isContractDeployed(uint256 index) internal view returns (bool) {
        return address(allNftContracts[index]) != address(0);
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
            farmerDeployedNft(msg.sender) == false,
            "Your token is already deployed"
        );

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

        allNftContracts.push(newNft);
        availableNftContractCount++;
        farmerToNftContract[msg.sender] = newNft;
    }

    function getNftContractsDetails()
        public
        view
        returns (nftContractDetails[] memory)
    {
        nftContractDetails[] memory deltails = new nftContractDetails[](
            availableNftContractCount
        );
        uint256 counter;

        for (uint256 index = 0; index < allNftContracts.length; index++) {
            if (isContractDeployed(index)) {
                deltails[counter] = nftContractDetails(
                    allNftContracts[index].farmerName(),
                    allNftContracts[index].name(),
                    allNftContracts[index].symbol(),
                    allNftContracts[index].description(),
                    index,
                    allNftContracts[index].totalMint(),
                    allNftContracts[index].availableMint(),
                    allNftContracts[index].price(),
                    allNftContracts[index].expirationDate()
                );
                counter++;
            }
        }

        return deltails;
    }

    function buyNft(uint256 index) public {
        require(isContractDeployed(index), "Not yet deployed");
        allNftContracts[index].mintNFT(msg.sender);
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
        for (uint256 index = 0; index < allNftContracts.length; index++) {
            if (isContractDeployed(index) == false) {
                continue;
            }
            if (allNftContracts[index].isExpired() == true) {
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
        for (uint256 index = 0; index < allNftContracts.length; index++) {
            if (isContractDeployed(index) == false) {
                continue;
            }
            if (allNftContracts[index].isExpired() == true) {
                allNftContracts[index].burnNFT();
                address farmer = allNftContracts[index].farmerAddress();
                delete farmerToNftContract[farmer];
                delete allNftContracts[index];
                availableNftContractCount--;
            }
        }
    }
}
