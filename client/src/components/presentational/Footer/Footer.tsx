// Styles
import styles from './Footer.module.scss';

//Components
import ProgressBar from '../ProgressBar/ProgressBar';

export const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <ProgressBar className={styles.progressBar} />
    </div>
  );
};

export default Footer;