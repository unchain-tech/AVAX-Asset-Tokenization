import { useContext, useEffect, useState } from "react";
import CurrentAccountContext from "../../context/CurrentAccountProvider";

export default function ViewBuyersForm() {
  const [currentAccount] = useContext(CurrentAccountContext);
  const [buyers, setBuyers] = useState<string[]>([]);

  const getBuyers = async () => {
    setBuyers(["a", "b"]);
  };

  useEffect(() => {
    getBuyers();
  }, []);

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
