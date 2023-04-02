import { useEffect, useId, useState } from 'react';

// Styles
import styles from './Auth.module.scss';

// Types
import { STORE_MODE } from '../../../typings/common.types';

// Store
import { useAuthStore } from '../../../store/auth.store';
import { useConfigurationStore } from '../../../store/configuration.store';
import { useTokenStore } from '../../../store/token.store';

// Components
import { Button } from '../../presentational/UI/Button/Button';
import AuthOnlineOfflineSelector from '../../presentational/AuthOnlineOfflineSelector/AuthOnlineOfflineSelector';

type StateProps = {
  initialMode?: STORE_MODE;
}

type Props = StateProps;

const Auth: React.FC<Props> = ({ initialMode }: Props) => {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  const { createUser, login, setLoginVisibleMode } = useAuthStore((state) => state);
  const { setStoreMode } = useConfigurationStore((state) => state);
  const { fetchCsrfToken } = useTokenStore((state) => state);

  const [mode, setMode] = useState<STORE_MODE>(initialMode || 'offline');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorName, setErrorName] = useState<string>('');
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');

  const changeEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorEmail('');
    setEmail(e.target.value);
  };

  const changePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorPassword('');
    setPassword(e.target.value);
  };

  const changeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorName('');
    setName(e.target.value);
  };

  const validateName = () => {
    if (name.length === 0) {
      setErrorName('Name is required');
      return;
    }
  };

  const validateEmail = () => {
    if (email.length === 0) {
      setErrorEmail('Email is required');
      return;
    }

    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setErrorEmail('Email is not valid');
      return;
    }
  };

  const validatePassword = () => {
    if (password.length === 0) {
      setErrorPassword('Password is required');
      return;
    }
    if (!isLogin && password.length < 8) {
      setErrorPassword('Password must be at least 8 characters');
      return;
    }
  };

  const submitHandler = async () => {
    if (mode === 'offline') {
      setStoreMode('offline');
      setLoginVisibleMode(undefined);
      return;
    }

    validateEmail();
    validatePassword();
    if (!isLogin) {
      validateName();
    }

    if (errorEmail || errorPassword || (errorName && !isLogin)) {
      return;
    }

    let singinSuccess = isLogin ? await login({ email, password }) : await createUser({ name, email, password });

    if (singinSuccess) {
      setLoginVisibleMode(undefined);
      await fetchCsrfToken();
      setStoreMode('online');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorName('');
    setErrorEmail('');
    setErrorPassword('');
  };

  const toggleLogin = () => {
    resetForm();
    setIsLogin(!isLogin);
  };

  const toggleModeHandler = () => {
    setMode(mode === 'online' ? 'offline' : 'online');
  };

  const getSubmitButtonText = () => {
    if (mode === 'online') {
      return isLogin ? 'Login' : 'Create Account';
    }
    return 'Start';
  };

  const getHeaderText = () => {
    if (mode === 'online') {
      return isLogin ? 'Hello' : 'Welcome';
    }
    return 'Welcome';
  };

  return (
    <div className={styles.authContainer}>
      <div className={`themeWrapper ${styles.auth}`}>
        <h2>{getHeaderText()}</h2>
        <h3>How do you want to proceed?</h3>
        <AuthOnlineOfflineSelector initialSelectedMode={mode} onChange={toggleModeHandler} />
        {
          mode === 'online' && (
            <>
              {!isLogin && (
                <div className={styles.formControl}>
                  <label htmlFor={nameId}>Name</label>
                  <input className={`${errorName ? 'danger' : ''}`} value={name} onChange={changeNameHandler} type="text" id={nameId} />
                  {errorName && (
                    <p className={`errorText ${styles.errorText}`}>{errorName}</p>
                  )}
                </div>
              )}
              <div className={styles.formControl}>
                <label htmlFor={emailId}>Email</label>
                <input className={`${errorEmail ? 'danger' : ''}`} value={email} onChange={changeEmailHandler} type="email" id={emailId} />
                {errorEmail && (
                  <p className={`errorText ${styles.errorText}`}>{errorEmail}</p>
                )}
              </div>
              <div className={styles.formControl}>
                <label htmlFor={passwordId}>Password</label>
                <input className={`${errorPassword ? 'danger' : ''}`} value={password} onChange={changePasswordHandler} type="password" id={passwordId} />
                {errorPassword && (
                  <p className={`errorText ${styles.errorText}`}>{errorPassword}</p>
                )}
              </div>
            </>
          )}
        <div className={styles.formActions} style={{ justifyContent: mode === 'online' ? 'space-between' : 'flex-end' }}>
          {mode === 'online' && (
            <Button displayText={isLogin ? 'Create an account' : 'Log in'} size="big" buttonType="link" buttonStyle="default" onClick={toggleLogin} />
          )}
          <Button displayText={getSubmitButtonText()} size="big" buttonStyle="default" onClick={submitHandler} />
        </div>
      </div>
    </div>
  );
};

export default Auth;