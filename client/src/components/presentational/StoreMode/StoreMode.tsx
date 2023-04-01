import { Icon } from '@iconify/react';

// Styles
import styles from './StoreMode.module.scss';

// Store
import { useConfigurationStore } from '../../../store/configuration.store';

const StoreMode = () => {
  const { getStoreMode } = useConfigurationStore((state) => state);

  const getTitle = () => {
    return getStoreMode() === 'online' ? 'Connected to the server' : 'Disconnected from the server';
  }

  return (
    <div className={styles.storeMode} title={getTitle()}>
      <Icon icon={ getStoreMode() === 'online' ? 'material-symbols:power-plug' : 'material-symbols:power-plug-off'} />
      <span className={styles.storeMode__title}>{ getStoreMode() === 'online' ? 'Online' : 'Offline' }</span>
    </div>
  );
}

export default StoreMode;