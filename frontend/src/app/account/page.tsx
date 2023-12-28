'use client'

import React from "react";

import { SignIn } from "../components/SignInSignUpForm";
import { DesktopWrapper } from "../components/DesktopWrapper";

import styles from './styles.module.css';

export default function Page() {    
    return (
        <DesktopWrapper>
            <div className={styles.mainUI}>
                <SignIn />
            </div>
        </DesktopWrapper>
    );
}