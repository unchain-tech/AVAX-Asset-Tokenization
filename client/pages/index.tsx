import type { NextPage } from "next";
import Link from "next/link";
import DefaultLayout from "../components/Layout/DefaultLayout";

const Home: NextPage = () => {
  return (
    <DefaultLayout home>
      <Link href="/FarmerPage">
        <h2>FarmerPage &rarr;</h2>
      </Link>
      <Link href="/BuyerPage">
        <h2>BuyerPage &rarr;</h2>
      </Link>
    </DefaultLayout>
  );
};

export default Home;
