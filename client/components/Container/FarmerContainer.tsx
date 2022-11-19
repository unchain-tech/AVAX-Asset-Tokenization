import { useState } from "react";
import styles from "./FarmerContainer.module.css";

export default function FarmerContainer() {
  // farmer actions
  const Tokenize = "Tokenize";
  const ViewBuyers = "ViewBuyers";

  const [activeTab, setActiveTab] = useState(Tokenize);
  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.mainBody}>
      <div className={styles.centerContent}>
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

        {activeTab === Tokenize && Tokenize}
        {activeTab === ViewBuyers && ViewBuyers}
      </div>
    </div>
  );
}
