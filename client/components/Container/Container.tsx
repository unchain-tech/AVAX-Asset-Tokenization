import { useState } from "react";
import { useContract } from "../../hooks/useContract";
import styles from "./Container.module.css";
import Faucet from "../SelectTab/Faucet";
import Lend from "../SelectTab/Lend";
import Borrow from "../SelectTab/Borrow";

type Props = {
  currentAccount: string | undefined;
};

export default function Container({ currentAccount }: Props) {
  const [activeTab, setActiveTab] = useState("Borrow");
  const [updateDetailsFlag, setUpdateDetailsFlag] = useState(0);
  const {
    fMatic: token0,
    fAvax: token1,
    lending,
  } = useContract(currentAccount);

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const updateDetails = () => {
    // フラグを0と1の間で交互に変更します。
    setUpdateDetailsFlag((updateDetailsFlag + 1) % 2);
  };

  return (
    <div className={styles.mainBody}>
      <div className={styles.centerContent}>
        <div className={styles.selectTab}>
          <div
            className={
              styles.tabStyle +
              " " +
              (activeTab === "Borrow" ? styles.activeTab : "")
            }
            onClick={() => changeTab("Borrow")}
          >
            Borrow
          </div>
          <div
            className={
              styles.tabStyle +
              " " +
              (activeTab === "Lend" ? styles.activeTab : "")
            }
            onClick={() => changeTab("Lend")}
          >
            Lend
          </div>
          <div
            className={
              styles.tabStyle +
              " " +
              (activeTab === "Faucet" ? styles.activeTab : "")
            }
            onClick={() => changeTab("Faucet")}
          >
            Faucet
          </div>
        </div>

        {activeTab === "Borrow" && (
          <Borrow
            token0={token0}
            token1={token1}
            lending={lending}
            currentAccount={currentAccount}
            updateDetails={updateDetails}
          />
        )}
        {activeTab === "Lend" && (
          <Lend
            token0={token0}
            token1={token1}
            lending={lending}
            currentAccount={currentAccount}
            updateDetails={updateDetails}
          />
        )}
        {activeTab === "Faucet" && (
          <Faucet
            token0={token0}
            token1={token1}
            currentAccount={currentAccount}
            updateDetails={updateDetails}
          />
        )}
      </div>
    </div>
  );
}
