
// Styles
import styles from './Footer.module.scss';

// Store
import { RootState } from '../../../store/models/rootState.model';
import { getTaskList } from '../../../store/reducers/task.reducer';

// Models
import { Task } from '../../../models/task.model';

//Components
import ProgressBar from '../ProgressBar/ProgressBar';
import { connect } from 'react-redux';

type StateProps = {
  taskList: Task[];
}

type Props = StateProps;

export const Footer: React.FC<Props> = ({taskList} : Props) => {

  const progress = (taskList && taskList.filter((task) => task.done).length / taskList.length * 100) || 0;

  return (
    <div className={styles.footer}>
      <ProgressBar className={styles.progressBar} progress={progress} />
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => {
  return {
    taskList: getTaskList(state.task)
  };
};

const connector = connect(mapStateToProps, undefined);
export default connector(Footer);