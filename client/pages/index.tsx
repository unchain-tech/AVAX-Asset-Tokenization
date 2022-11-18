import type { NextPage } from "next";
import Link from "next/link";
import DefaultLayout from "../components/Layout/DefaultLayout";

const Home: NextPage = () => {
  return (
    <DefaultLayout home>
      {/* <Container currentAccount={currentAccount} /> */}
      <Link href="/Page1">
        <h2>page1 &rarr;</h2>
      </Link>
      <Link href="/Page2">
        <h2>page2 &rarr;</h2>
      </Link>
    </DefaultLayout>
  );
};

export default Home;
