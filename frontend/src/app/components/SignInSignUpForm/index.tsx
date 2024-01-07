import { AppDispatch, RootState, setBirthday, setIsLogged, setLogin, setName, setPassword, setPhoneNumber, setSurname, setTimestamp } from '../../redux/store';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import Image from 'next/image';
import axios from 'axios';
import background from 'public/images/makeup.jpeg';
import backgroundSignUp from 'public/images/1.jpeg';
import cn from 'classnames';
import { createOrder } from '../../utils/postQuery';
import { getCustomerData } from '../../utils/getQuery';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

export const SignIn = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const loginState = useSelector((state: RootState) => state.login);
    const router = useRouter();

    const signIn = (login, password) => {
        return (dispatch) => {
            return new Promise<void>((resolve, reject) => {
                axios.post('http://localhost:3100/api/customer/signin/', { login, password })
                .then(response => {
                    if (response.status === 200) {
                        dispatch({ type: 'SIGNIN_SUCCESS', payload: response.data });
                        dispatch(setIsLogged(true));
                        router.push(`/account/${loginState.login}/orders`);
                        resolve();
                    } else {
                        reject(new Error('Failed to sign in'));
                    }
                    })
                .catch(error => {
                    dispatch({ type: 'SIGNIN_FAILURE', payload: error.message });
                    reject(error);
                });
            })
        };
    };

    const signUp = (name, surname, birthday, phoneNumber, login, password) => {
        return (dispatch) => {
            return new Promise<void>((resolve, reject) =>{
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

                    const now = new Date();
                    const year = now.getFullYear();
                    const month = ('0' + (now.getMonth() + 1)).slice(-2); // месяцы индексируются с 0, поэтому добавляем 1 и дополняем нулями до двух символов
                    const date = ('0' + now.getDate()).slice(-2);
                    const hours = ('0' + now.getHours()).slice(-2);
                    const minutes = ('0' + now.getMinutes()).slice(-2);
                    const seconds = ('0' + now.getSeconds()).slice(-2);

                    const formattedDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
                    dispatch(setTimestamp(formattedDate));
                    getCustomerData(loginState.login)
                        .then((data) => {
                            dispatch(createOrder(data.id, loginState.login, formattedDate, 'Starting to Sparkle'))
                                .then(() => {
                                    router.push(`/account/${loginState.login}/profile`);
                                })
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                    resolve();
                } else {
                    reject(new Error('Failed to sign up'));
                }
            })
            .catch(error => {
                dispatch({ type: 'SIGNUP_FAILURE', payload: error.message });
                reject(error);
            });
            })   
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

    const handleSignUpClick = (e) => {
        e.preventDefault();
        const phoneNumberRegex = /^((\+79)|(89))\d{9}$/;

        if (!loginState.phoneNumber || !phoneNumberRegex.test(loginState.phoneNumber)) {
            toast.error('Invalid phone number format');

            return;
        }
        
        if (!loginState.password || loginState.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
    
            return;
        }
        dispatch(signUp(loginState.name, loginState.surname, loginState.birthday, loginState.phoneNumber, loginState.login, loginState.password))
            .catch(() => {
                toast.error("Failed to sign up, login is already taken");
            });
    }
       
    const handleSignInClick = (e) => {
        e.preventDefault();
        dispatch(signIn(loginState.login, loginState.password))
            .catch(() => {
                toast.error("Failed to sign in, either the login or the password contain an error");
            });
    }

    return (
        <>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            {isSignUp ? (
                <div className={styles.containerSignUp}>
                    <div className={styles.leftContainer}>
                        <div className={styles.title}>Create account bestie!</div>
                        <form onSubmit={handleSignUpClick}>
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
                                <button className={cn(styles.button, styles.signin)} type='submit'>Sign Up</button>
                                <button className={cn(styles.signup)} onClick={() => setIsSignUp(!isSignUp)}>Sign In</button>
                            </div>
                        </form>
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
                        <form onSubmit={handleSignInClick}>
                            <div className={styles.inputContainer}>
                                <input className={styles.input} type='text' placeholder='Login' value={loginState.login} onChange={handleLoginChange}/>
                                <input className={styles.input} type='password' placeholder='Password' value={loginState.password} onChange={handlePasswordChange}/>
                            </div>
                            <div className={styles.description}>If you don't have an account, you can registry any time, click below</div>
                            <div className={styles.buttonContainer}>
                                <button className={cn(styles.button, styles.signin)} type='submit'>Sign In</button>
                                <button className={cn(styles.signup)} onClick={() => setIsSignUp(!isSignUp)}>Sign Up</button>
                            </div>
                        </form>
                    </div>
                    <div className={styles.rightContainer}>
                        <Image className={styles.background} src={background} alt='Girl with makeup'/>
                    </div>
                </div>
            )}
        </>
    );
}