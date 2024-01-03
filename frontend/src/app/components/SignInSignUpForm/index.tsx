import { AppDispatch, RootState, setBirthday, setIsLogged, setLogin, setName, setPassword, setPhoneNumber, setSurname } from '../../redux/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Image from 'next/image';
import axios from 'axios';
import background from 'public/images/makeup.jpeg';
import backgroundSignUp from 'public/images/1.jpeg';
import cn from 'classnames';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

export const SignIn = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const loginState = useSelector((state: RootState) => state.login);
    const router = useRouter();

    const signIn = (login, password) => {
        return (dispatch) => {
            axios.post('http://localhost:3100/api/customer/signin/', { login, password })
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: 'SIGNIN_SUCCESS', payload: response.data });
                    dispatch(setIsLogged(true));
                    router.push(`/account/${loginState.login}/profile`);
                } else {
                    throw new Error('Failed to sign in');
                }
                })
            .catch(error => {
                dispatch({ type: 'SIGNIN_FAILURE', payload: error.message });
            });
        };
    };

    const signUp = (name, surname, birthday, phoneNumber, login, password) => {
        return (dispatch) => {
            axios.post('http://localhost:3100/api/customer/signup/', { 
                name,
                surname,
                birthday,
                phone_number: phoneNumber,
                login,
                password
             })
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: 'SIGNUP_SUCCESS', payload: response.data });
                    dispatch(setIsLogged(true));
                    router.push(`/account/${loginState.login}/profile`);
                } else {
                    throw new Error('Failed to sign up');
                }
            })
            .catch(error => {
                dispatch({ type: 'SIGNUP_FAILURE', payload: error.message });
            });
        };
    };
   
    const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setLogin(event.target.value));
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPassword(event.target.value));
    };
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setName(event.target.value));
    };
    const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSurname(event.target.value));
    };
    const handleBirthdayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setBirthday(event.target.value));
    };
    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setPhoneNumber(event.target.value));
    };  

    const handleSignUpClick = () => {
        dispatch(signUp(loginState.name, loginState.surname, loginState.birthday, loginState.phoneNumber, loginState.login, loginState.password));
    }
       
    const handleSignInClick = () => {
        dispatch(signIn(loginState.login, loginState.password));
    }

    return (
        isSignUp ? (
            <div className={styles.containerSignUp}>
                <div className={styles.leftContainer}>
                    <div className={styles.title}>Create account bestie!</div>
                    <div className={styles.inputContainer}>
                        <input className={styles.input} type='text' placeholder='Name' value={loginState.name} onChange={handleNameChange}/>
                        <input className={styles.input} type='text' placeholder='Surname' value={loginState.surname} onChange={handleSurnameChange}/>
                        <div className={styles.inputDescription}>Your birthday:</div>
                        <input className={styles.input} type='date' max='2005-01-01' value={loginState.birthday} onChange={handleBirthdayChange}/>
                        <input className={styles.input} type='text' placeholder='Phone number' value={loginState.phoneNumber} onChange={handlePhoneNumberChange}/>
                        <input className={styles.input} type='text' placeholder='Login' value={loginState.login} onChange={handleLoginChange}/>
                        <input className={styles.input} type='password' placeholder='Password' value={loginState.password} onChange={handlePasswordChange}/>
                    </div>
                    <div className={styles.description}>If you already have an account, you can log in any time, click below</div>
                    <div className={styles.buttonContainer}>
                        <button className={cn(styles.button, styles.signin)} onClick={handleSignUpClick}>Sign Up</button>
                        <button className={cn(styles.signup)} onClick={() => setIsSignUp(!isSignUp)}>Sign In</button>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <Image className={styles.backgroundSignUp} src={backgroundSignUp} alt='Girl with makeup'/>
                </div>
            </div>
        ) : (
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
                        <button className={cn(styles.button, styles.signin)} onClick={handleSignInClick}>Sign In</button>
                        <button className={cn(styles.signup)} onClick={() => setIsSignUp(!isSignUp)}>Sign Up</button>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <Image className={styles.background} src={background} alt='Girl with makeup'/>
                </div>
            </div>
        )  
    );
}