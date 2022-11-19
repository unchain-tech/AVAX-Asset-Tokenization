import { useContext } from "react";
import CurrentAccountContext from "../../context/CurrentAccountProvider";

export default function ViewBuyersForm() {
  const [currentAccount] = useContext(CurrentAccountContext);

  return <div>address: {currentAccount}</div>;
}
