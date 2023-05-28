import { MdAgriculture, MdList } from 'react-icons/md';

import LinkToPageButton from '../Button/LinkToPageButton';
import styles from './HomeContainer.module.css';

export default function HomeContainer() {
  return (
    <div>
      <div className={styles.centerContent}>
        <LinkToPageButton
          linkTo={'/FarmerPage'}
          iconLeft={<MdAgriculture size={50} />}
          description={'For Farmer'}
        />
      </div>
      <div className={styles.centerContent}>
        <LinkToPageButton
          linkTo={'/BuyerPage'}
          iconLeft={<MdList size={50} />}
          description={'For Buyer'}
        />
      </div>
    </div>
  );
}
