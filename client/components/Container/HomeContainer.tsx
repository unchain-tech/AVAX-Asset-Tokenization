import ForFarmerButton from "../Button/ForFarmerButton";
import { MdAgriculture, MdList } from "react-icons/md";

export default function HomeContainer() {
  return (
    <div>
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
    </div>
  );
}
