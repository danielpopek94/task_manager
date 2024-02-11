/* eslint-disable no-console */
import React, { useState } from 'react';
import { handleLogin } from '../api/login';
import { handleRegister } from '../api/register';

interface Props {
  handleActiveSession: (value: boolean) => void;
}

export const LoginPage = ({ handleActiveSession }: Props) => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('coolpassword');
  const [errorType, setErrorType] = useState('');
  const [register, setRegister] = useState(false);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (register) {
      handleRegister(email, password)
        .then((res) => {
          localStorage.setItem('token', res.token);
          handleActiveSession(true);
        })
        .catch((err) => {
          const errorMessage = err.response.data.error;

          console.error(errorMessage);

          if (errorMessage.includes('email')) {
            setErrorType('email');
          } else if (errorMessage.includes('password')) {
            setErrorType('password');
          }
        });

    } else {
      handleLogin(email, password)
        .then((res) => {
          localStorage.setItem('token', res.token);
          handleActiveSession(true);
        })
        .catch((err) => {
          const errorMessage = err.response.data.error;

          console.error(errorMessage);

          if (errorMessage.includes('email')) {
            setErrorType('email');
          } else if (errorMessage.includes('password')) {
            setErrorType('password');
          }
        });
    }
  };

  const handleSwitchFormType = () => {
    setEmail('');
    setPassword('');
    setRegister(true);
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__box">
          <div className="login__form-box">
            <div className="login__ic-account"></div>
            <form
              name="login__form"
              action="#"
              method="post"
              onSubmit={(event) => handleSubmitForm(event)}
            >
              <div className="login__input-container">
                <input
                  className="login__input"
                  type="email"
                  name="your-email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                {errorType === 'email'
                  && <p className='login__error-message'>Invalid email!</p>}
              </div>

              <div className="login__input-container">
                <input
                  className="login__input"
                  type="password"
                  name="your-password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                {errorType === 'password'
                  && <p className='login__error-message'>Invalid password!</p>}
              </div>

              <div
                className="loader"
                style={{
                  margin: '0 auto',
                  opacity: '0',
                }}
              />
              <button className="login__btn" type="submit">
                {register ? 'Register' : 'Login'}
              </button>
              <p
                className="login__text login__text-register"
                onClick={handleSwitchFormType}
              >Register</p>
              <p className="login__text">
                Or try this:<br></br>
                admin@gmail.com<br></br>
                coolpassword
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
