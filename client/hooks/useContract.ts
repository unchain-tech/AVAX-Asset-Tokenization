import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FMaticArtifact from "../artifacts/FMatic.json";
import FAvaxArtifact from "../artifacts/FAvax.json";
import LendingArtifact from "../artifacts/Lending.json";
import { FMatic as FMaticContractType } from "../types/FMatic";
import { FAvax as FAvaxContractType } from "../types/FAvax";
import { Lending as LendingContractType } from "../types/Lending";
import { getEthereum } from "../utils/ethereum";

export const FMaticAddress = "0xe47118D0E279241e0929DaBa51aD77beb9872D06";
export const FAvaxAddress = "0x08F42B0AfA0E6666B2D1e4009865d352760cB346";
export const LendingAddress = "0xCEFe35ABEe8673Ecf4BC97a0cE78D9DEC8d6A39d";

export type TokenType = {
  symbol: string;
  contract: FMaticContractType | FAvaxContractType;
};

export type LendingType = {
  contract: LendingContractType;
};

type ReturnUseContract = {
  fMatic: TokenType | undefined;
  fAvax: TokenType | undefined;
  lending: LendingType | undefined;
};

export const useContract = (
  currentAccount: string | undefined
): ReturnUseContract => {
  const [fMatic, setFMatic] = useState<TokenType>();
  const [fAvax, setFAvax] = useState<TokenType>();
  const [lending, setLending] = useState<LendingType>();
  const ethereum = getEthereum();

  const getContract = (
    contractAddress: string,
    abi: ethers.ContractInterface,
    storeContract: (_: ethers.Contract) => void
  ) => {
    if (!ethereum) {
      console.log("Ethereum object doesn't exist!");
      return;
    }
    if (!currentAccount) {
      // ログインしていない状態でコントラクトの関数を呼び出すと失敗するため
      // currentAccountがundefinedの場合はcontractオブジェクトもundefinedにします。
      console.log("currentAccount doesn't exist!");
      return;
    }
    try {
      // @ts-ignore: ethereum as ethers.providers.ExternalProvider
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner(); // 簡易実装のため, 引数なし = 初めのアカウント(account#0)を使用する
      const Contract = new ethers.Contract(contractAddress, abi, signer);
      storeContract(Contract);
    } catch (error) {
      console.log(error);
    }
  };

  const generateFMatic = async (contract: FMaticContractType) => {
    try {
      const symbol = await contract.symbol();
      setFMatic({ symbol: symbol, contract: contract } as TokenType);
    } catch (error) {
      console.log(error);
    }
  };

  const generateAvax = async (contract: FAvaxContractType) => {
    try {
      const symbol = await contract.symbol();
      setFAvax({ symbol: symbol, contract: contract } as TokenType);
    } catch (error) {
      console.log(error);
    }
  };

  const generateLending = async (contract: LendingContractType) => {
    try {
      setLending({
        contract: contract,
      } as LendingType);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContract(
      FMaticAddress,
      FMaticArtifact.abi,
      (Contract: ethers.Contract) => {
        generateFMatic(Contract as FMaticContractType);
      }
    );
    getContract(
      FAvaxAddress,
      FAvaxArtifact.abi,
      (Contract: ethers.Contract) => {
        generateAvax(Contract as FAvaxContractType);
      }
    );
    getContract(
      LendingAddress,
      LendingArtifact.abi,
      (Contract: ethers.Contract) => {
        generateLending(Contract as LendingContractType);
      }
    );
  }, [ethereum, currentAccount]);

  return {
    fMatic,
    fAvax,
    lending,
  };
};
