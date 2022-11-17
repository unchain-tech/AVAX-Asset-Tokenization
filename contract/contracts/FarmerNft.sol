// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract FarmerNft is ERC721 {
    string public farmerName;
    string public description;
    uint256 public totalMint;
    uint256 public availableMint;
    uint256 public price;
    uint256 public expirationDate;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor(
        string memory _farmerName,
        string memory _name,
        string memory _symbol,
        string memory _description,
        uint256 _totalMint,
        uint256 _price,
        uint256 _expirationDate
    ) ERC721(_name, _symbol) {
        farmerName = _farmerName;
        description = _description;
        totalMint = _totalMint;
        availableMint = _totalMint;
        price = _price;
        expirationDate = _expirationDate;
    }

    //TODO トークンはavaxにする
    function mint(address to) public {
        require(availableMint > 0, "Not enough nft");

        uint256 newItemId = _tokenIds.current();
        _safeMint(to, newItemId);
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
                        name(),
                        " -- NFT #: ",
                        Strings.toString(_tokenId),
                        '", "description": "',
                        description,
                        '", "image": "ipfs://',
                        "", //TODO: 画像は事前のipfsで
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

    function available() public view returns (bool) {
        if (block.timestamp < expirationDate) {
            return true;
        } else {
            return false;
        }
    }

    function end() public {
        require(available() == false, "still available");
        for (uint256 id = 0; id < _tokenIds.current(); id++) {
            _burn(id);
        }
    }

    function allOwners() public view returns (address[] memory) {
        address[] memory owners = new address[](_tokenIds.current());
        for (uint256 index = 0; index < _tokenIds.current(); index++) {
            owners[index] = ownerOf(index);
        }
        return owners;
    }
}
