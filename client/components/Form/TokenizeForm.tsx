import { useContext, useState } from "react";
import styles from "./Form.module.css";
import CurrentAccountContext from "../../context/CurrentAccountProvider";

export default function TokenizeForm() {
  const [currentAccount] = useContext(CurrentAccountContext);

  const [farmerName, setFarmerName] = useState("");
  const [description, setDescription] = useState("");
  const [totalMint, setTotalMint] = useState("");
  const [price, setPrice] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  return (
    <div>
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
        onChange={(e) => setExpirationDate(e.target.value)}
      />

      <p>farmerName: {farmerName}</p>
      <p>description: {description}</p>
      <p>totalMint: {totalMint}</p>
      <p>price: {price}</p>
      <p>expirationDate: {expirationDate}</p>
    </div>
  );
}
