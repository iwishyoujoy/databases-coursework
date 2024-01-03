'use client'

import { AppDispatch, RootState, setIdBusiness } from "../../../redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DesktopWrapper } from "../../../components/DesktopWrapper";
import { ISellerOrClinicProps } from "../../../utils/types";
import Link from "next/link";
import cn from 'classnames';
import { getSellerOrClinicByLogin } from "../../../utils/getQuery";
import styles from './styles.module.css';

interface AccountProps{
    params: {
        login: string;
    }
}

export default function Page({ params: { login } }: AccountProps) {
    const [ business, setBusiness ] = useState<ISellerOrClinicProps>(null);
    const dispatch = useDispatch<AppDispatch>();
    const businessState = useSelector((state: RootState) => state.business);

    useEffect(() => {
        getSellerOrClinicByLogin(login, businessState.isSeller ? 'seller' : 'clinic')
            .then(data => {
                setBusiness(data);
                dispatch(setIdBusiness(data.id));
            })
            .catch(error => console.error(error));
        }, [businessState.isSeller, dispatch, login]);

    return(
        <DesktopWrapper>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={cn(styles.link, styles.selected)} href={`/business/${login}/profile`}>Profile</Link>
                    <Link className={styles.link} href={`/business/${login}/${businessState.isSeller ? 'products' : 'procedures'}`}>{businessState.isSeller ? "Products" : "Procedures"}</Link>
                    <Link className={styles.link} href={`/business/${login}/orders`}>Orders</Link>
                </div>
                {business && 
                <div className={styles.rightContainer}>
                    <div className={styles.data}>
                        <div className={styles.header}>Name:</div>
                        <div className={styles.text}>{business.name}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Email:</div>
                        <div className={styles.text}>{business.email}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Contact:</div>
                        <div className={styles.text}>{business.contact}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Login:</div>
                        <div className={styles.text}>{business.login}</div>
                    </div>
                </div>
                } 
            </div>
        </DesktopWrapper>
    );
}