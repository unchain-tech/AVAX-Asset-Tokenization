import ForFarmerButton from "../Button/ForFarmerButton";
import { MdAgriculture, MdList } from "react-icons/md";
import styles from "./HomeContainer.module.css";

export default function HomeContainer() {
  return (
    <div className={styles.centerContent}>
      <ForFarmerButton
        linkTo={"/FarmerPage"}
        icon_left={<MdAgriculture size={50} />}
        description={"For Farmer"}
      />
      <ForFarmerButton
        linkTo={"/BuyerPage"}
        icon_left={<MdList size={50} />}
        description={"For Buyer"}
      />
    </div>
  );
}
