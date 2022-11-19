import { ethers } from "hardhat";
import { BigNumber, Overrides } from "ethers";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

describe("AssetTokenization", function () {
  const oneWeekInSecond = 60 * 60 * 24 * 7;

  async function deployContract() {
    const accounts = await ethers.getSigners();

    const AssetTokenization = await ethers.getContractFactory(
      "AssetTokenization"
    );
    const assetTokenization = await AssetTokenization.deploy();

    return {
      deployAccount: accounts[0],
      userAccounts: accounts.slice(1, accounts.length),
      assetTokenization,
    };
  }

  describe("basic", function () {
    it("generate NFT contract and check details", async function () {
      const { userAccounts, assetTokenization } = await loadFixture(
        deployContract
      );

      const farmerName = "farmer";
      const name = "nft";
      const symbol = "symbol";
      const description = "description";
      const totalMint = BigNumber.from(5);
      const price = BigNumber.from(100);
      const expirationDate = BigNumber.from(Date.now())
        .div(1000) // in second
        .add(oneWeekInSecond); // one week later

      const account1 = userAccounts[0];
      const account2 = userAccounts[1];

      await assetTokenization
        .connect(account1)
        .generateNftContract(
          farmerName,
          description,
          totalMint,
          price,
          expirationDate
        );

      await assetTokenization
        .connect(account2)
        .generateNftContract(
          farmerName,
          description,
          totalMint,
          price,
          expirationDate
        );

      const details1 = await assetTokenization.getNftContractDetails(
        account1.address
      );
      expect(details1.farmerAddress).to.equal(account1.address);
      expect(details1.farmerName).to.equal(farmerName);
      expect(details1.description).to.equal(description);
      expect(details1.totalMint).to.equal(totalMint);
      expect(details1.availableMint).to.equal(totalMint);
      expect(details1.price).to.equal(price);
      expect(details1.expirationDate).to.equal(expirationDate);

      const details2 = await assetTokenization.getNftContractDetails(
        account2.address
      );
      expect(details2.farmerAddress).to.equal(account2.address);
      expect(details2.farmerName).to.equal(farmerName);
      expect(details2.description).to.equal(description);
      expect(details2.totalMint).to.equal(totalMint);
      expect(details2.availableMint).to.equal(totalMint);
      expect(details2.price).to.equal(price);
      expect(details2.expirationDate).to.equal(expirationDate);
    });
  });

  describe("buyNFT", function () {
    it("balance should be change", async function () {
      const { userAccounts, assetTokenization } = await loadFixture(
        deployContract
      );

      const farmerName = "farmer";
      const name = "nft";
      const symbol = "symbol";
      const description = "description";
      const totalMint = BigNumber.from(5);
      const price = BigNumber.from(100);
      const expirationDate = BigNumber.from(Date.now())
        .div(1000) // in second
        .add(oneWeekInSecond); // one week later

      const account1 = userAccounts[0];
      const account2 = userAccounts[1];

      await assetTokenization
        .connect(account1)
        .generateNftContract(
          farmerName,
          description,
          totalMint,
          price,
          expirationDate
        );

      await expect(
        assetTokenization
          .connect(account2)
          .buyNft(account1.address, { value: price } as Overrides)
      ).to.changeEtherBalances([account1, account2], [price, -price]);
    });
  });

  describe("upkeep", function () {
    it("checkUpkeep and performUpkeep", async function () {
      const { userAccounts, assetTokenization } = await loadFixture(
        deployContract
      );

      // 定数用意
      const farmerName = "farmer";
      const name = "nft";
      const symbol = "symbol";
      const description = "description";
      const totalMint = BigNumber.from(5);
      const price = BigNumber.from(100);

      /* 期限に余裕があるnftコントラクトの用意 */
      const account1 = userAccounts[0];
      const expirationDateAfterNow = BigNumber.from(Date.now())
        .div(1000) // in second
        .add(oneWeekInSecond); // one week later

      // デプロイ
      await assetTokenization
        .connect(account1)
        .generateNftContract(
          farmerName,
          description,
          totalMint,
          price,
          expirationDateAfterNow
        );

      const [return1] = await assetTokenization.checkUpkeep("0x00");

      // 期限切れのnftコントラクトがないのでfalse
      expect(return1).to.equal(false);

      /* 期限切れのnftコントラクトを用意 */
      const account2 = userAccounts[1];
      const expirationDateBeforeNow = BigNumber.from(Date.now())
        .div(1000) // in second
        .sub(1); // back to before now

      // デプロイ
      await assetTokenization
        .connect(account2)
        .generateNftContract(
          farmerName,
          description,
          totalMint,
          price,
          expirationDateBeforeNow
        );

      const [return2] = await assetTokenization.checkUpkeep("0x00");

      // 期限切れのnftコントラクトがあるのでtrue
      expect(return2).to.equal(true);

      await assetTokenization.performUpkeep("0x00");

      // 期限切れのnftコントラクトの情報は取得できない
      await expect(assetTokenization.getNftContractDetails(account2.address)).to
        .be.reverted;
    });
  });
});
