import { useState } from 'react';
import React from 'react';
import cn from 'classnames';
import Image from 'next/image';

import background from '@/images/makeup.jpeg';

import styles from './styles.module.css';
// import { useDispatch } from 'react-redux';

export const Login = () => {
    const [ isSignUp, setIsSignUp ] = useState(true);
    const [ isError, setIsError ] = useState(false);

    const handleSignUpClick = () => {
        if (!isSignUp){
            setIsSignUp(!isSignUp);
        }
    }

    const handleSignInClick = () => {
        if (isSignUp){
            setIsSignUp(!isSignUp);
        }
    }

    const handlePasswordAgain = (event) => {
        setPasswordAgain(event.target.value);
        if (passwordAgain !== password){
            setIsError(true);
        }
        else {
            setIsError(false);
        }
        console.log(password);
        console.log(passwordAgain);
        console.log(isError);
    }

    const title = isSignUp ? 'Create account bestie' : 'Welcome back girlie!'
    const description = isSignUp ? `If you already have an account, click sign up ASAP` : 'If you don\'t have an account, you can registry any time, click below';

    const [ login, setLogin ] = useState(undefined);
    const [ password, setPassword ] = useState(undefined);
    const [ passwordAgain, setPasswordAgain] = useState(undefined);

    // const dispatch = useDispatch();
    

    return (
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                <div className={styles.title}>
                    {title}
                </div>
                <div className={styles.subtitle}>
                    Enter login and password, <br /> that's all we need girlie
                </div>
                <div className={styles.inputContainer}>
                    <input className={styles.input} type='text' placeholder='Login' value={login} onChange={() => setLogin(event.target.value)}/>
                    <input className={styles.input} type='password' placeholder='Password' value={password} onChange={() => setPassword(event.target.value)}/>
                    {isSignUp && <input className={styles.input} type='password' placeholder='Password again' value={passwordAgain} onChange={() => handlePasswordAgain(event)}/>}
                </div>
                {isError && <div className={styles.error}>Oopsie! Passwords don't match!</div>}
                <div className={styles.description}>
                    {description}
                </div>
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