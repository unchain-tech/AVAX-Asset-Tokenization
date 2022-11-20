import type { NextPage } from "next";
import Link from "next/link";
import DefaultLayout from "../components/Layout/DefaultLayout";
import ForFarmerButton from "../components/Button/ForFarmerButton";
import { MdAgriculture, MdList } from "react-icons/md";

const Home: NextPage = () => {
  return (
    <DefaultLayout home>
      <ForFarmerButton
        linkTo={"/FarmerPage"}
        icon_left={<MdAgriculture size={50} />}
        description={"For Farmer"}
      />
      <ForFarmerButton
        linkTo={"/BuyerPage"}
        icon_left={<MdList size={50} />}
        description={"BuyerPage"}
      />
    </DefaultLayout>
  );
};

export default Home;
