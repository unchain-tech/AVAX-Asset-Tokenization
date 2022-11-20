import Link from "next/link";
import { ElementType, ReactNode } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import styles from "./Button.module.css";

type Props = {
  linkTo: string;
  icon_left: any;
  description: string;
};

export default function ForFarmerButton({
  linkTo,
  icon_left,
  description,
}: Props) {
  return (
    <Link href={linkTo}>
      <div className={styles.button}>
        <div className={styles.icon_left}>{icon_left}</div>
        <h2>{description}</h2>
        <div className={styles.icon_right}>
          <MdKeyboardArrowRight size={30} />
        </div>
      </div>
    </Link>
  );
}
