'use client'

import React, { useEffect } from "react";

import { DesktopWrapper } from "../components/DesktopWrapper";
import { RootState } from "../redux/store";
import { SignInBusiness } from "../components/SignInSignUpFormBusiness";
import styles from './styles.module.css';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Page() {  
    const businessState = useSelector((state: RootState) => state.business);
    const router = useRouter();

    useEffect(() => {
        if (businessState.isLogged) {
            router.push(`/business/${businessState.login}/profile`);
        }
    }, [businessState.isLogged, businessState.login, router]);
     
    return (
        <DesktopWrapper>
            <div className={styles.mainUI}>
                <SignInBusiness />
            </div>
        </DesktopWrapper>
    );
}