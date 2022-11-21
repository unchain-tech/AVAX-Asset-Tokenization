import styles from "./ActionButton.module.css";

type Props = {
  title: string;
  onClick: () => void;
};

export default function ActionButton({ title, onClick }: Props) {
  return (
    <button className={styles.button} onClick={() => onClick()}>
      {title}
    </button>
  );
}
