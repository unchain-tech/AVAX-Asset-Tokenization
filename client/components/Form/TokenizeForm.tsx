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

  const validInput = () => {
    if (farmerName === "") {
      alert("enter farmer name");
      return false;
    }
    if (description === "") {
      alert("enter description name");
      return false;
    }
    if (!validAmount(totalMint)) {
      alert("invalid total number of mint");
      return false;
    }
    if (!validAmount(price)) {
      alert("invalid price");
      return false;
    }
    if (expirationDate === "") {
      alert("invalid expiration date");
      return false;
    }
    return true;
  };

  const dateToSeconds = (date: string) => {
    const dateInDate = new Date(date);
    const dateInSeconds = Math.floor(dateInDate.getTime() / 1000);
    return dateInSeconds.toString();
  };

  const onClickGenerateNFT = async () => {
    if (!currentAccount) {
      alert("connect wallet");
      return;
    }
    if (!assetTokenization) return;
    if (!validInput()) return;
    try {
      const priceInWei = ethers.utils.parseEther(price);
      const dateInSeconds = dateToSeconds(expirationDate);

      const txn = await assetTokenization.generateNftContract(
        farmerName,
        description,
        totalMint,
        priceInWei,
        dateInSeconds
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

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.field}>
          <p>Farmer name:</p>
          <input
            className={styles.line}
            type="text"
            onChange={(e) => setFarmerName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <p>description:</p>
          <textarea
            className={styles.text_area}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <p>total number of mint:</p>
          <input
            className={styles.line}
            type="number"
            value={totalMint}
            onChange={(e) => setTotalMint(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <p>price:</p>
          <input
            className={styles.line}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <p>expiration date:</p>
          <input
            className={styles.date}
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>
        <div className={styles.submit_field}>
          <button
            className={styles.submit_button}
            onClick={() => onClickGenerateNFT()}
          >
            generate NFT
          </button>
        </div>
      </form>
      <p>farmerName: {farmerName}</p>
      <p>description: {description}</p>
      <p>totalMint: {totalMint}</p>
      <p>price: {price}</p>
      <p>expirationDate: {expirationDate}</p>
    </div>
  );
}
