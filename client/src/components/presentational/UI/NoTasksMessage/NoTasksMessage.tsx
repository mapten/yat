import React from 'react';

// Styles
import styles from './NoTasksMessage.module.scss';

export const NoTasksMessage: React.FC = () => {
  return (
    <div className={styles.container}>
      <p>There are no tasks created. Click on &apos;Create&apos; to add a new one</p>
    </div>
  );
};