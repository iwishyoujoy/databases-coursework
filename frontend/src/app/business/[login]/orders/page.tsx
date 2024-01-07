'use client'

import { AppDispatch, RootState, setIsLoggedBusiness } from "../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DesktopWrapper } from "../../../components/DesktopWrapper";
import { IProcedureProps } from "../../../utils/types";
import Link from "next/link";
import cn from 'classnames';
import styles from './styles.module.css';
import { useRouter } from "next/navigation";

interface AccountProps{
    params: {
        login: string;
    }
}

export default function Page({ params: { login } }: AccountProps) {
    const businessState = useSelector((state: RootState) => state.business);

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // getProceduresByClinicId(businessState.id)
        //     .then(data => {
        //         setProcedures(data);
        //     })
        //     .catch(error => console.error(error));
    }, []);

    const handleLogOutClick = () => {
        dispatch(setIsLoggedBusiness(false));
        router.push(`/business/`);
    }

    return(
        <DesktopWrapper>
        <div className={styles.title}>Business account</div>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={styles.link} href={`/business/${login}/profile`}>Profile</Link>
                    <Link className={styles.link} href={`/business/${login}/${businessState.isSeller ? 'products' : 'procedures'}`}>{businessState.isSeller ? "Products" : "Procedures"}</Link>
                    <Link className={cn(styles.link, styles.selected)} href={`/business/${login}/orders`}>Orders</Link>
                    <button className={styles.logOutButton} onClick={handleLogOutClick}>Log out</button>
                </div>
                <div className={styles.rightContainer}>

                </div>
            </div>
        </DesktopWrapper>
    );
}