import axios from 'axios';
import React from 'react';
import cn from 'classnames';
import Image from 'next/image';

import background from 'public/images/makeup.jpeg';

import styles from './styles.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState, setLogin, setPassword } from '../../redux/store';

axios.defaults.baseURL = 'http://localhost:3100';

export const signUp = (username, password) => {
    return (dispatch) => {
        axios.post('/api/customer/signup/', { username, password })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'SIGNUP_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to sign up');
            }
        })
        .catch(error => {
            dispatch({ type: 'SIGNUP_FAILURE', payload: error.message });
        });
    };
};

export const signIn = (username, password) => {
    return (dispatch) => {
        axios.post('/api/customer/signin/', { username, password })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'SIGNIN_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to sign in');
            }
            })
        .catch(error => {
            dispatch({ type: 'SIGNIN_FAILURE', payload: error.message });
        });
    };
};

// export const getAllUsers = () => {
//     return async (dispatch) => {
//         try {
//             const response = await axios.get('/api/customer/all');
//             dispatch({ type: 'GET_USERS_SUCCESS', payload: response.data });
//         } catch (error) {
//             dispatch({ type: 'GET_USERS_FAILURE', payload: error.message });
//         }
//     };
// };   

export const Login = () => {
    const dispatch = useDispatch<AppDispatch>();
    const loginState = useSelector((state: RootState) => state.login);
   
    const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setLogin(event.target.value));
    };
   
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPassword(event.target.value));
    };

    const handleSignUpClick = () => {
        dispatch(signUp(loginState.login, loginState.password));
    }
       
    const handleSignInClick = () => {
        dispatch(signIn(loginState.login, loginState.password));
    }

    return (
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                <div className={styles.title}>Welcome back girlie!</div>
                <div className={styles.subtitle}>
                    Enter login and password, <br /> that's all we need girlie
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input} type='text' placeholder='Login' value={loginState.login} onChange={handleLoginChange}/>
                    <input className={styles.input} type='password' placeholder='Password' value={loginState.password} onChange={handlePasswordChange}/>
                </div>
                <div className={styles.description}>If you don't have an account, you can registry any time, click below</div>
                <div className={styles.buttonContainer}>
                    <button className={cn(styles.button, styles.signup)} onClick={handleSignUpClick}>Sign Up</button>
                    <button className={cn(styles.button, styles.signin)} onClick={handleSignInClick}>Sign In</button>
                </div>
            </div>
            <div className={styles.rightContainer}>
                <Image className={styles.background} src={background} alt='Girl with makeup'/>
            </div>
        </div>
    );
}