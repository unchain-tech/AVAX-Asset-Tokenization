import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useWallet } from "../hooks/useWallet";
import Container from "../components/Container/Container";
import Link from "next/link";

const Home: NextPage = () => {
  const { currentAccount, connectWallet } = useWallet();

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
      {/* <Container currentAccount={currentAccount} /> */}
      <Link href="/Page1">
        <h2>page1 &rarr;</h2>
      </Link>
      <Link href="/Page2">
        <h2>page2 &rarr;</h2>
      </Link>
    </div>
  );
};

export default Home;
