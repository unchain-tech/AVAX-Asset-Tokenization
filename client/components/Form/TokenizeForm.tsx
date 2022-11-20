import { useContext, useState } from "react";
import styles from "./TokenizeForm.module.css";
import CurrentAccountContext from "../../context/CurrentAccountProvider";
import { useContract } from "../../hooks/useContract";
import { validAmount } from "../../utils/validAmount";
import { ethers } from "ethers";

export default function TokenizeForm() {
  const [currentAccount] = useContext(CurrentAccountContext);
  const { assetTokenization } = useContract({ currentAccount });

  const [farmerName, setFarmerName] = useState("");
  const [description, setDescription] = useState("");
  const [totalMint, setTotalMint] = useState("");
  const [price, setPrice] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const onClickGenerateNFT = async () => {
    if (!currentAccount) {
      alert("connect wallet");
      return;
    }
    if (!assetTokenization) return;
    if (farmerName === "") {
      alert("enter farmer name");
      return;
    }
    if (description === "") {
      alert("enter description name");
      return;
    }
    if (!validAmount(totalMint)) {
      alert("invalid total number of mint");
      return;
    }
    if (!validAmount(price)) {
      alert("invalid price");
      return;
    }
    if (!validAmount(expirationDate)) {
      alert("invalid expiration date");
      return;
    }
    try {
      const priceInWei = ethers.utils.parseEther(price);

      const txn = await assetTokenization.generateNftContract(
        farmerName,
        description,
        totalMint,
        priceInWei,
        expirationDate
      );
      await txn.wait();

      setFarmerName("");
      setDescription("");
      setTotalMint("");
      setPrice("");
      setExpirationDate("");
      alert("Success");
    } catch (error) {
      alert(error);
    }
  };

  const onChangeExpirationDate = (date: string) => {
    const dateInDate = new Date(date);
    const dateInSeconds = Math.floor(dateInDate.getTime() / 1000);
    setExpirationDate(dateInSeconds.toString());
  };

  return (
    <div className={styles.centerContent}>
      <p>farmer name</p>
      <input
        // className={styles.textField}
        onChange={(e) => setFarmerName(e.target.value)}
      />

      <p>description</p>
      <textarea
        // className={styles.textField}
        onChange={(e) => setDescription(e.target.value)}
      />

      <p>total number of mint</p>
      <input
        // className={styles.textField}
        type="number"
        value={totalMint}
        onChange={(e) => setTotalMint(e.target.value)}
      />

      <p>price</p>
      <input
        // className={styles.textField}
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <p>expiration date</p>
      <input
        // className={styles.textField}
        type="date"
        value={expirationDate}
        onChange={(e) => onChangeExpirationDate(e.target.value)}
      />

      <p>farmerName: {farmerName}</p>
      <p>description: {description}</p>
      <p>totalMint: {totalMint}</p>
      <p>price: {price}</p>
      <p>expirationDate: {expirationDate}</p>
      <div onClick={() => onClickGenerateNFT()}>generate NFT</div>
    </div>
  );
}
