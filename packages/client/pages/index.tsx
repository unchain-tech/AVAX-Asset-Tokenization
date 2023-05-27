import type { NextPage } from "next";

import HomeContainer from "../components/Container/HomeContainer";
import DefaultLayout from "../components/Layout/DefaultLayout";

const Home: NextPage = () => {
  return (
    <DefaultLayout home>
      <HomeContainer />
    </DefaultLayout>
  );
};

export default Home;
