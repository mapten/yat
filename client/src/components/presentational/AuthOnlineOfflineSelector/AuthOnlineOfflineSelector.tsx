import { useState } from 'react';

// Styles
import styles from './AuthOnlineOfflineSelector.module.scss';

// Types
import { STORE_MODE } from '../../../typings/common.types';

// Components
import ToggleButton from '../UI/ToggleButton/ToggleButton';

type StateProps = {
  initialSelectedMode: STORE_MODE;
}

type DispatchProps = {
  onChange: (mode: STORE_MODE) => void;
}

type Props = StateProps & DispatchProps;

const AuthOnlineOfflineSelector = ({ initialSelectedMode, onChange }: Props) => {
  const [selectedMode, setSelectedMode] = useState<STORE_MODE>(initialSelectedMode);

  const changeHandler = () => {
    const newMode = selectedMode === 'online' ? 'offline' : 'online';
    setSelectedMode(newMode);
    onChange(newMode);
  };

  return (
    <div className={styles.authOnlineOffline}>
      <ToggleButton
        initialValue={selectedMode === 'online' ? 'left' : 'right'}
        size='medium'
        leftName='Online'
        leftIconName='material-symbols:network-wifi-rounded'
        rightName='Offline'
        rightIconName='material-symbols:signal-wifi-off-outline'
        onChange={changeHandler} />

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