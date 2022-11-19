import styles from "./DefaultLayout.module.css";
import Link from "next/link";
import CurrentAccountContext from "../../context/CurrentAccountProvider";
import { useContext, ReactNode } from "react";

type Props = {
  children: ReactNode;
  home?: boolean;
};

export default function DefaultLayout({ children, home }: Props) {
  const [currentAccount, connectWallet] = useContext(CurrentAccountContext);

  return (
    <div className={styles.pageBody}>
      <div className={styles.navBar}>
        <div className={styles.rightHeader}>
          <div className={styles.appName}> Lending </div>
        </div>
        {currentAccount == undefined ? (
          <div className={styles.connectBtn} onClick={connectWallet}>
            {" "}
            Connect to wallet{" "}
          </div>
        ) : (
          <div className={styles.connected}>
            {" "}
            {"Connected to " + currentAccount}{" "}
          </div>
        )}
      </div>
      <div>{children}</div>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <div>← Back to home</div>
          </Link>
        </div>
      )}
    </div>
  );
}
