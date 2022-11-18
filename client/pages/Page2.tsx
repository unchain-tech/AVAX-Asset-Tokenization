import { useContext } from "react";
import DefaultLayout from "../components/Layout/DefaultLayout";
import CurrentAccountContext from "../context/CurrentAccountProvider";

export default function Page2() {
  const [currentAccount] = useContext(CurrentAccountContext);

  return <DefaultLayout>address: {currentAccount}</DefaultLayout>;
}
