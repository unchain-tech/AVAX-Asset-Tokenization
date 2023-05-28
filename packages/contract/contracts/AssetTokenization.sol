// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./FarmNft.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract AssetTokenization is AutomationCompatibleInterface {
    address[] private _farmers;
    mapping(address => FarmNft) private _farmerToNftContract;

    struct NftContractDetails {
        address farmerAddress;
        string farmerName;
        string description;
        uint256 totalMint;
        uint256 availableMint;
        uint256 price;
        uint256 expirationDate;
    }

    function availableContract(address farmer) public view returns (bool) {
        return address(_farmerToNftContract[farmer]) != address(0);
    }

    function _addFarmer(address newFarmer) internal {
        for (uint256 index = 0; index < _farmers.length; index++) {
            if (newFarmer == _farmers[index]) {
                return;
            }
        }
        _farmers.push(newFarmer);
    }

    function generateNftContract(
        string memory _farmerName,
        string memory _description,
        uint256 _totalMint,
        uint256 _price,
        uint256 _expirationDate
    ) public {
        address farmerAddress = msg.sender;

        require(
            availableContract(farmerAddress) == false,
            "Your token is already deployed"
        );

        _addFarmer(farmerAddress);

        FarmNft newNft = new FarmNft(
            farmerAddress,
            _farmerName,
            _description,
            _totalMint,
            _price,
            _expirationDate
        );

        _farmerToNftContract[farmerAddress] = newNft;
    }

    function getNftContractDetails(
        address farmerAddress
    ) public view returns (NftContractDetails memory) {
        require(availableContract(farmerAddress), "not available");

        NftContractDetails memory details;
        details = NftContractDetails(
            _farmerToNftContract[farmerAddress].farmerAddress(),
            _farmerToNftContract[farmerAddress].farmerName(),
            _farmerToNftContract[farmerAddress].description(),
            _farmerToNftContract[farmerAddress].totalMint(),
            _farmerToNftContract[farmerAddress].availableMint(),
            _farmerToNftContract[farmerAddress].price(),
            _farmerToNftContract[farmerAddress].expirationDate()
        );

        return details;
    }

    function buyNft(address farmerAddress) public payable {
        require(availableContract(farmerAddress), "Not yet deployed");

        address buyerAddress = msg.sender;
        _farmerToNftContract[farmerAddress].mintNFT{value: msg.value}(
            buyerAddress
        );
    }

    function getBuyers() public view returns (address[] memory) {
        address farmerAddress = msg.sender;

        require(availableContract(farmerAddress), "Not yet deployed");

        return _farmerToNftContract[farmerAddress].getTokenOwners();
    }

    function getFarmers() public view returns (address[] memory) {
        return _farmers;
    }

    // For upkeep that chainlink automation function.
    // Check whether there are expired contracts.
    // If checkUpkeep() returns true, chainlink automatically runs performUpkeep() that follows below.
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
        for (uint256 index = 0; index < _farmers.length; index++) {
            address farmer = _farmers[index];
            if (!availableContract(farmer)) {
                continue;
            }
            if (_farmerToNftContract[farmer].isExpired()) {
                return (true, "");
            }
        }
        return (false, "");
    }

    // For chainlink.
    // Burn expired NFT and delete NFT Contract.
    function performUpkeep(
        bytes calldata /* optional data. don't use in this code */
    ) external override {
        for (uint256 index = 0; index < _farmers.length; index++) {
            address farmer = _farmers[index];
            if (!availableContract(farmer)) {
                continue;
            }
            if (_farmerToNftContract[farmer].isExpired()) {
                _farmerToNftContract[farmer].burnNFT();
                delete _farmerToNftContract[farmer];
            }
        }
    }
}
