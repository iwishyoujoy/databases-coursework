'use client'

import React, { useEffect } from "react";

import { DesktopWrapper } from "../components/DesktopWrapper";
import { RootState } from "../redux/store";
import { SignIn } from "../components/SignInSignUpForm";
import styles from './styles.module.css';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Page() {  
    const loginState = useSelector((state: RootState) => state.login);
    const router = useRouter();

    useEffect(() => {
        if (loginState.isLogged) {
            router.push(`/account/${loginState.login}/profile`);
        }
    }, [loginState.isLogged, loginState.login, router]);
     
    return (
        <DesktopWrapper>
            <div className={styles.mainUI}>
                <SignIn />
            </div>
        </DesktopWrapper>
    );
}