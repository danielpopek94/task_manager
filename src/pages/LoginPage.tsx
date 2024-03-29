/* eslint-disable no-console */
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { handleLogin } from '../api/login';
import { handleRegister } from '../api/register';
import useVerification from '../utils/verification';

interface Props {
  handleActiveSession: (value: boolean) => void;
}

export const LoginPage = ({ handleActiveSession }: Props) => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('coolpassword');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [errorType, setErrorType] = useState('');
  const [register, setRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const verification = useVerification();

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (register) {
      const isStrongPassword = verification.password(password);

      if (!isStrongPassword) {
        toast.error('Too weak password');
        setErrorType('weak-password');
        setIsLoading(false);

        return;
      }



      handleRegister(email, password)
        .then((res) => {
          localStorage.setItem('token', res.token);
          handleActiveSession(true);
          toast.success('Created account successfully');
        })
        .catch((err) => {
          const errorMessage = err.response.data.error;

          toast.error(errorMessage);
          console.error(errorMessage);

          if (errorMessage.includes('email')) {
            setErrorType('email');
          } else if (errorMessage.includes('password')) {
            setErrorType('password');
          }
        }).finally(() => {
          setIsLoading(false);
        });

    } else {
      handleLogin(email, password)
        .then((res) => {
          localStorage.setItem('token', res.token);
          handleActiveSession(true);
          toast.success('Logged in successfully');
        })
        .catch((err) => {
          const errorMessage = err.response.data.error;

          console.error(errorMessage);
          toast.error(errorMessage);

          if (errorMessage.includes('email')) {
            setErrorType('email');
          } else if (errorMessage.includes('password')) {
            setErrorType('password');
          }
        }).finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleSwitchFormType = () => {
    setEmail('');
    setPassword('');
    setRepeatedPassword('');
    setErrorType('');
    setRegister((prev) => !prev);
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
                  autoComplete="email"
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
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                {errorType === 'password'
                  && <p className='login__error-message'>Invalid password!</p>}
                {errorType === 'weak-password'
                  && <p className='login__error-message'>
                    Minimum 8 characters,
                    at least 1 letter,
                    1 number and 1 special character
                  </p>}
              </div>

              {register
                && <div className="login__input-container">
                  <input
                    className="login__input"
                    type="password"
                    name="your-repeated-password"
                    placeholder="Repeat password"
                    value={repeatedPassword}
                    onChange={(event) =>
                      setRepeatedPassword(event.target.value)
                    }
                    required
                  />
                  {errorType === 'password'
                    && <p className='login__error-message'>Invalid password!</p>
                  }
                </div>
              }

              <div
                className="loader"
                style={{
                  margin: '0 auto',
                  opacity: isLoading ? '1' : '0',
                }}
              />
              <button
                className="login__btn"
                type="submit"
              >
                {register ? 'Register' : 'Login'}
              </button>
              <p
                className="login__text login__text-register"
                onClick={handleSwitchFormType}
              >{
                  register
                    ? 'Back to Login'
                    : 'Register'
                }
              </p>
              <p className="login__text">
                Or try this for testing purposes:<br></br>
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
