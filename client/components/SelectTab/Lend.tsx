import { useEffect, useState } from "react";
import { TokenType, LendingType } from "../../hooks/useContract";
import styles from "./SelectTab.module.css";
import { BigNumber, ethers } from "ethers";
import InputNumberBox from "../InputBox/InputNumberBox";
import { MdAdd } from "react-icons/md";
import { validAmount } from "../../utils/validAmount";

type Props = {
  token0: TokenType | undefined;
  token1: TokenType | undefined;
  lending: LendingType | undefined;
  currentAccount: string | undefined;
  updateDetails: () => void;
};

export default function Lend({
  token0,
  token1,
  lending,
  currentAccount,
  updateDetails,
}: Props) {
  const [amountOfToken0, setAmountOfToken0] = useState("");
  const [amountOfToken1, setAmountOfToken1] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // getPrice();
  }, [lending]);

  const getPrice = async () => {
    if (!lending) return;
    try {
      const txn = await lending.contract.storeLatestPrice();
      txn.wait();
      const price = await lending.contract.storedPrice();
      setPrice(parseInt(price.toString()) / 100000000);
      alert("success");
    } catch (error) {
      alert(error);
    }
  };

  const getProvideEstimate = async (
    token: TokenType,
    amount: string,
    setPairTokenAmount: (amount: string) => void
  ) => {
    if (!lending || !token0 || !token1) return;
    if (!price) return;
    if (!validAmount(amount)) return;
    try {
      // const amountInWei = ethers.utils.parseEther(amount);
      // const pairAmountInWei = await lending.contract.getEquivalentToken(
      //   token.contract.address,
      //   amountInWei
      // );
      // const pairAmountInEther = ethers.utils.formatEther(pairAmountInWei);
      // setPairTokenAmount(pairAmountInEther);
    } catch (error) {
      alert(error);
    }
  };

  const onChangeAmount = (
    amount: string,
    token: TokenType | undefined,
    setAmount: (amount: string) => void,
    setPairTokenAmount: (amount: string) => void
  ) => {
    if (!token) return;
    setAmount(amount);
    getProvideEstimate(token, amount, setPairTokenAmount);
  };

  const onClickProvide = async () => {
    if (!currentAccount) {
      alert("connect wallet");
      return;
    }
    if (!lending || !token0 || !token1) return;
    if (!validAmount(amountOfToken0) || !validAmount(amountOfToken1)) {
      alert("Amount should be a valid number");
      return;
    }
    try {
      const amountToken0InWei = ethers.utils.parseEther(amountOfToken0);
      const amountToken1InWei = ethers.utils.parseEther(amountOfToken1);

      const txn0 = await token0.contract.approve(
        lending.contract.address,
        amountToken0InWei
      );
      const txn1 = await token1.contract.approve(
        lending.contract.address,
        amountToken1InWei
      );

      await txn0.wait();
      await txn1.wait();

      // const txn = await lending.contract.provide(
      //   token0.contract.address,
      //   amountToken0InWei,
      //   token1.contract.address,
      //   amountToken1InWei
      // );
      // await txn.wait();
      setAmountOfToken0("");
      setAmountOfToken1("");
      getPrice(); // プールの状態を確認
      updateDetails(); // ユーザとammの情報を更新
      alert("Success");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.tabBody}>
      <InputNumberBox
        leftHeader={"Amount of " + (token0 ? token0.symbol : "some token")}
        right={token0 ? token0.symbol : ""}
        value={amountOfToken0}
        onChange={(e) =>
          onChangeAmount(
            e.target.value,
            token0,
            setAmountOfToken0,
            setAmountOfToken1
          )
        }
      />
      <div className={styles.swapIcon}>
        <MdAdd />
      </div>
      <InputNumberBox
        leftHeader={"Amount of " + (token1 ? token1.symbol : "some token")}
        right={token1 ? token1.symbol : ""}
        value={amountOfToken1}
        onChange={(e) =>
          onChangeAmount(
            e.target.value,
            token1,
            setAmountOfToken1,
            setAmountOfToken0
          )
        }
      />
      <div className={styles.bottomDiv}>
        <div className={styles.btn} onClick={() => getPrice()}>
          get price
        </div>
      </div>
      <div>price = {price}</div>
    </div>
  );
}
