// Styles
import styles from './LoadingMessage.module.scss';

// Components
import Spinner from '../Spinner/Spinner';

type StateProps = {
  message: string;
}

type Props = StateProps;

const LoadingMessage: React.FC<Props> = ({ message }: Props) => {
  return (
    <div className={styles.loadingMessage}>
      <span className={styles.loadingMessage__spinnerWrapper}><Spinner /></span>
      <span>{ message }</span>
    </div>
  );
};

export default LoadingMessage;