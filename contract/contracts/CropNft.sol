// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "./libraries/Base64.sol";
import "hardhat/console.sol";

contract CropNft is ERC721 {
    string public farmerName;
    string public cropsName;
    string public description;
    uint256 public totalMint;
    uint256 public availableMint;
    uint256 public price;
    uint256 public expirationDate;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor(
        string memory _farmerName,
        string memory _cropsName,
        string memory _description,
        uint256 _totalMint,
        uint256 _price,
        uint256 _expirationDate
    ) ERC721("CropNFT", "CROP") {
        farmerName = _farmerName;
        cropsName = _cropsName;
        description = _description;
        totalMint = _totalMint;
        availableMint = _totalMint;
        price = _price;
        expirationDate = _expirationDate;
        console.log("This is my NFT contract.");
    }

    function mintNFT() public {
        require(availableMint > 0, "Not enough nft");

        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
        _tokenIds.increment();
        availableMint--;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        cropsName,
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "',
                        description,
                        '", "image": "ipfs://',
                        "", //TODO: 画像も入れるか
                        '"}' //TODO: この他の属性を追加するか
                    ) // これの正式形式がわからん
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }
}
