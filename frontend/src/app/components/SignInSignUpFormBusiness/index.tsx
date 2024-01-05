import { AppDispatch, RootState, setContactBusiness, setEmailBusiness, setIsLoggedBusiness, setIsSellerBusiness, setLoginBusiness, setNameBusiness, setPasswordBusiness } from '../../redux/store';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import Image from 'next/image';
import axios from 'axios';
import background from 'public/images/business2.jpeg';
import backgroundSignUp from 'public/images/business1.jpeg';
import cn from 'classnames';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

export const SignInBusiness = () => {
    const [ isSignUp, setIsSignUp ] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const businessState = useSelector((state: RootState) => state.business);
    const router = useRouter();

    const signInBusiness = (login: string, password: string, type: string) => {
        return (dispatch) => {
            axios.post(`http://localhost:3100/api/${type}/signin/`, { login, password })
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: 'SIGNIN_SUCCESS', payload: response.data });
                    dispatch(setIsLoggedBusiness(true));
                    router.push(`/business/${businessState.login}/profile`);
                } else {
                    throw new Error('Failed to sign in');
                }
                })
            .catch(error => {
                dispatch({ type: 'SIGNIN_FAILURE', payload: error.message });
            });
        };
    };

    const signUpBusiness = (name: string, email: string, contact: string, login: string, password: string, type: string) => {
        return (dispatch) => {
            axios.post(`http://localhost:3100/api/${type}/signup/`, { 
                name,
                email,
                contact,
                login,
                password
             })
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: 'SIGNUP_SUCCESS', payload: response.data });
                    dispatch(setIsLoggedBusiness(true));
                    router.push(`/business/${businessState.login}/profile`);
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
      dispatch(setLoginBusiness(event.target.value));
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPasswordBusiness(event.target.value));
    };
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setNameBusiness(event.target.value));
    };
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setEmailBusiness(event.target.value));
    };
    const handleContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setContactBusiness(event.target.value));
    }; 
    const handleIsSellerChange = (value: boolean) => {
        dispatch(setIsSellerBusiness(value));
    }; 

    const handleSignUpClick = (e) => {
        e.preventDefault();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!businessState.email || !emailRegex.test(businessState.email)) {
            toast.error('Invalid email format');

            return;
        }
        
        if (!businessState.password || businessState.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
    
            return;
        }
        dispatch(signUpBusiness(businessState.name, businessState.email, businessState.contact, businessState.login, businessState.password, businessState.isSeller ? 'seller' : 'clinic'));
    }
       
    const handleSignInClick = (e) => {
        e.preventDefault();
        dispatch(signInBusiness(businessState.login, businessState.password, businessState.isSeller ? 'seller' : 'clinic'));
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
                    <div className={styles.title}>Create business <br/> account bestie!</div>
                    <form onSubmit={handleSignUpClick}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputDescription}>Choose who you want to sign up as:</div>
                            <div className={styles.radioInputContainer}>
                                <input className={styles.radioInput} type="radio" name="type" value="seller" checked={businessState.isSeller} onChange={() => handleIsSellerChange(true)} />
                                <label className={styles.radioInputLabel} htmlFor="seller" onClick={() => handleIsSellerChange(true)}>Seller</label>
                                <input className={styles.radioInput} type="radio" name="type" value="clinic" checked={!businessState.isSeller} onChange={() => handleIsSellerChange(false)} />
                                <label className={styles.radioInputLabel} htmlFor="clinic" onClick={() => handleIsSellerChange(false)}>Clinic</label>
                            </div>
                            <input className={styles.input} type='text' placeholder='Name' value={businessState.name} onChange={handleNameChange}/>
                            <input className={styles.input} type='text' placeholder='Email' value={businessState.email} onChange={handleEmailChange}/>
                            <div className={styles.inputDescription}>Contact person's name:</div>
                            <input className={styles.input} type='text' placeholder='Contact' value={businessState.contact} onChange={handleContactChange}/>
                            <input className={styles.input} type='text' placeholder='Login' value={businessState.login} onChange={handleLoginChange}/>
                            <input className={styles.input} type='password' placeholder='Password' value={businessState.password} onChange={handlePasswordChange}/>
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
                    <div className={styles.title}>Welcome back girlboss!</div>
                    <div className={styles.subtitle}>
                        Enter login and password, <br /> that's all we need
                    </div>
                    <form onSubmit={handleSignInClick}>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputDescription}>Choose who you want to log in as:</div>
                            <div className={styles.radioInputContainer}>
                                <input className={styles.radioInput} type="radio" name="type" value="seller" checked={businessState.isSeller} onChange={() => handleIsSellerChange(true)} />
                                <label className={styles.radioInputLabel} htmlFor="seller" onClick={() => handleIsSellerChange(true)}>Seller</label>
                                <input className={styles.radioInput} type="radio" name="type" value="clinic" checked={!businessState.isSeller} onChange={() => handleIsSellerChange(false)} />
                                <label className={styles.radioInputLabel} htmlFor="clinic" onClick={() => handleIsSellerChange(false)}>Clinic</label>
                            </div>
                            <input className={styles.input} type='text' placeholder='Login' value={businessState.login} onChange={handleLoginChange}/>
                            <input className={styles.input} type='password' placeholder='Password' value={businessState.password} onChange={handlePasswordChange}/>
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