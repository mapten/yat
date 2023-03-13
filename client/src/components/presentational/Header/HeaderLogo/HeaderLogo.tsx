
// Styles
import styles from './HeaderLogo.module.scss';

const HeaderLogo = () => {
  return (
    <div className="header-logo">
      <a href="/">
        <h1>
          <span className={styles.y}>Y</span>
          <span className={styles.a}>a</span>
          <span className={styles.t}>t</span>
        </h1>
      </a>
    </div>
  );
};

export default HeaderLogo;