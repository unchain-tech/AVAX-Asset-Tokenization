import { ethers } from "ethers";
import { useCallback, useContext, useEffect, useState } from "react";
import CurrentAccountContext from "../../context/CurrentAccountProvider";
import { useContract } from "../../hooks/useContract";

type FarmNftDetailsType = {
  farmerAddress: string;
  farmerName: string;
  description: string;
  totalMint: string;
  availableMint: string;
  price: string;
  expirationDate: Date;
};

export default function BuyNftForm() {
  const [currentAccount] = useContext(CurrentAccountContext);
  const { assetTokenization } = useContract({ currentAccount });
  const [allNftDetails, setAllNftDetails] = useState<FarmNftDetailsType[]>([]);

  const NftDetailsCard = ({ details }: { details: FarmNftDetailsType }) => {
    return (
      <div>
        <p>farmer address: {details.farmerAddress}</p>
        <p>farmer name: {details.farmerName}</p>
        <p>description: {details.description}</p>
        <p>total mint: {details.totalMint}</p>
        <p>availableMint: {details.availableMint}</p>
        <p>price: {details.price}</p>
        <p>expiration date: {details.expirationDate.toString()}</p>
      </div>
    );
  };

  const getAllNftDetails = useCallback(async () => {
    if (!currentAccount) {
      alert("connect wallet");
      return;
    }
    if (!assetTokenization) return;
    const farmers = await assetTokenization.getFarmers();
    let allDetails: FarmNftDetailsType[] = [];
    for (let index = 0; index < farmers.length; index++) {
      const available = await assetTokenization.availableContract(
        farmers[index]
      );
      if (available) {
        const details = await assetTokenization.getNftContractDetails(
          farmers[index]
        );
        allDetails.push({
          farmerAddress: details.farmerAddress,
          farmerName: details.farmerName,
          description: details.description,
          totalMint: details.totalMint.toString(),
          availableMint: details.availableMint.toString(),
          price: ethers.utils.formatEther(details.price), // price in wei to ether
          expirationDate: new Date(details.expirationDate.toNumber() * 1000), // new Date(time in mile seconds)
        } as FarmNftDetailsType);
      }
    }
    setAllNftDetails(allDetails);
  }, [currentAccount, assetTokenization]);

  useEffect(() => {
    getAllNftDetails();
  }, [getAllNftDetails]);

  return (
    <div>
      <p>start</p>
      <div>length: {allNftDetails.length}</div>
      {allNftDetails.map((details, index) => {
        return (
          <div key={index}>
            <NftDetailsCard details={details} />
          </div>
        );
      })}
    </div>
  );
}
