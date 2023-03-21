import { Icon } from '@iconify/react';

// Styles
import styles from './AuthOnlineOfflineSelector.module.scss';

// Types
import { STORE_MODE } from '../../../../typings/common.types';

// Components
import ToggleButton from '../../../presentational/UI/ToggleButton/ToggleButton';

type StateProps = {
  selectedMode: STORE_MODE;
}

type DispatchProps = {
  onChange: () => void;
}

type Props = StateProps & DispatchProps;

const AuthOnlineOfflineSelector = ({ selectedMode, onChange }: Props) => {
  return (
    <div className={styles.authOnlineOffline}>
      <ToggleButton
        initialValue={selectedMode === 'online' ? 'left' : 'right'}
        size='medium'
        leftName='Online'
        leftIconName='material-symbols:network-wifi-rounded'
        rightName='Offline'
        rightIconName='material-symbols:signal-wifi-off-outline'
        onChange={onChange} />

      <div className={`${styles.authOnlineOffline__description} ${styles.info}`}>
        {selectedMode === 'online' ? (
          <>
            <p>
              The data will be saved online and will be available on all your devices.
            </p>
            <p>
              Requires creating an account (or login if already created).
            </p>
          </>
        ) : (
          <>
            <p>
              The data will be saved offline and will be available only on this device.
            </p>
            <p>
              You also need to use the same browser to access the data (no incognito mode).
            </p>
            <p>
              You can always switch to online mode to sync your data.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthOnlineOfflineSelector;