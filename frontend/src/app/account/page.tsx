'use client'

import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";
import { SignIn } from "../components/SignInSignUpForm";
import { DesktopWrapper } from "../components/DesktopWrapper";

import styles from './styles.module.css';

export default function Page() {
    const { isLogged } = useSelector((state: RootState) => state.login);

    
    return (
        <DesktopWrapper>
            {isLogged ? (
                <div></div>
            ) : (
                <div className={styles.mainUI}>
                    <SignIn />
                </div>
            )}
        </DesktopWrapper>
    );
}