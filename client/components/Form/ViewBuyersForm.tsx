import { useCallback, useContext, useEffect, useState } from "react";
import CurrentAccountContext from "../../context/CurrentAccountProvider";
import { useContract } from "../../hooks/useContract";

export default function ViewBuyersForm() {
  const [currentAccount] = useContext(CurrentAccountContext);
  const { assetTokenization } = useContract({ currentAccount });

  const [buyers, setBuyers] = useState<string[]>([]);

  const getBuyers = useCallback(async () => {
    if (!currentAccount) {
      alert("connect wallet");
      return;
    }
    if (!assetTokenization) return;
    setBuyers([]);
    try {
      const buyers = await assetTokenization.getBuyers();
      setBuyers(buyers);
    } catch (error) {
      alert(error);
    }
  }, [currentAccount, assetTokenization]);

  useEffect(() => {
    getBuyers();
  }, [getBuyers]);

  return (
    <div>
      <p>start</p>
      {buyers.map((buyer, index) => {
        return (
          <div key={index}>
            <p>buyer: {buyer}</p>
          </div>
        );
      })}
    </div>
  );
}
