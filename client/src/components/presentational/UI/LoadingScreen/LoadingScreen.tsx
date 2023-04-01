// Styles
import styles from './LoadingScreen.module.scss';

// Components
import Spinner from '../Spinner/Spinner';

const LoadingScreen = () => {
  return (
    <div className={`themeOppositeBg ${styles.loading}`}>
      <div className={styles.spinnerWrapper}>
        <Spinner />
      </div>
    </div>
  );
};

export default LoadingScreen;