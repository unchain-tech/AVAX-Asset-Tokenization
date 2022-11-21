import { useState } from "react";
import styles from "./FarmerContainer.module.css";
import TokenizeForm from "../Form/TokenizeForm";
import ViewBuyersForm from "../Form/ViewBuyersForm";

export default function FarmerContainer() {
  // farmer actions
  const Tokenize = "Tokenize";
  const ViewBuyers = "ViewBuyers";

  const [activeTab, setActiveTab] = useState(Tokenize);
  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectTab}>
        <div
          className={
            styles.tabStyle +
            " " +
            (activeTab === Tokenize ? styles.activeTab : "")
          }
          onClick={() => changeTab(Tokenize)}
        >
          {Tokenize}
        </div>
        <div
          className={
            styles.tabStyle +
            " " +
            (activeTab === ViewBuyers ? styles.activeTab : "")
          }
          onClick={() => changeTab(ViewBuyers)}
        >
          {ViewBuyers}
        </div>
      </div>
      <div className={styles.tabBody}>
        {activeTab === Tokenize && <TokenizeForm />}
        {activeTab === ViewBuyers && <ViewBuyersForm />}
      </div>
    </div>
  );
}
