import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

import styles from "./LinkToPageButton.module.css";

type Props = {
  linkTo: string;
  iconLeft: any;
  description: string;
};

export default function LinkToPageButton({
  linkTo,
  iconLeft,
  description,
}: Props) {
  return (
    <Link href={linkTo}>
      <div className={styles.button}>
        <div className={styles.icon_left}>{iconLeft}</div>
        <h2>{description}</h2>
        <div className={styles.icon_right}>
          <MdKeyboardArrowRight size={30} />
        </div>
      </div>
    </Link>
  );
}
