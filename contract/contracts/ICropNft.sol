// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface ICropNft {
    function farmerName() external view returns (string memory);

    function cropsName() external view returns (string memory);

    function description() external view returns (string memory);

    function totalMint() external view returns (uint256);

    function availableMint() external view returns (uint256);

    function price() external view returns (uint256);

    function expirationDate() external view returns (uint256);

    function mintNFT() external;

    function tokenURI(uint256 _tokenId) external view returns (string memory);
}
