import { useContext, useEffect, useState } from "react";
import CurrentAccountContext from "../../context/CurrentAccountProvider";

type FarmNftDetailsType = {
  farmerAddress: string;
  farmerName: string;
  description: string;
  totalMint: string;
  availableMint: string;
  price: string;
  expirationDate: string;
};

export default function ViewBuyersForm() {
  const [currentAccount] = useContext(CurrentAccountContext);
  const [allNftDetails, setAllNftDetails] = useState<FarmNftDetailsType[]>([]);

  const NftDetailsCard = ({ details }: { details: FarmNftDetailsType }) => {
    return <div>address: {details.farmerAddress}</div>;
  };

  const getAllNftDetails = async () => {
    setAllNftDetails([]);
    for (let index = 0; index < 5; index++) {
      setAllNftDetails((prevState) => [
        ...prevState,
        {
          farmerAddress: index.toString(),
          farmerName: "1",
          description: "1",
          totalMint: "1",
          availableMint: "1",
          price: "1",
          expirationDate: "1",
        } as FarmNftDetailsType,
      ]);
    }
  };

  useEffect(() => {
    getAllNftDetails();
  }, []);

  return (
    <div>
      <p>start</p>
      <div>aaaa: {allNftDetails.length}</div>
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
