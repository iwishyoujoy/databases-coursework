'use client'

import React, { useEffect, useState } from "react";

import { DesktopWrapper } from "../../../components/DesktopWrapper";
import { ICustomerProps } from "../../../utils/types";
import Link from "next/link";
import cn from 'classnames';
import { getCustomerData } from "../../../utils/getQuery";
import styles from './styles.module.css';

interface AccountProps{
    params: {
        login: string;
    }
}

export default function Page({ params: { login } }: AccountProps) {
    const [ customer, setCustomer ] = useState<ICustomerProps>(null);

    useEffect(() => {
        getCustomerData(login)
            .then(data => {
                setCustomer(data);
            })
            .catch(error => console.error(error));
        }, [login]);

    return(
        <DesktopWrapper>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={cn(styles.link, styles.selected)} href={`/account/${login}/profile`}>Profile</Link>
                    <Link className={styles.link} href={`/account/${login}/orders`}>Orders</Link>
                    <Link className={styles.link} href={`/account/${login}/favorite`}>Favorite</Link>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.data}>
                        <div className={styles.header}>Name:</div>
                        <div className={styles.text}>{customer ? customer.name : ""}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Surname:</div>
                        <div className={styles.text}>{customer ? customer.surname : ""}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Birthday:</div>
                        <div className={styles.text}>{customer ? customer.birthday: ""}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Phone number:</div>
                        <div className={styles.text}>{customer ? customer.phone_number : ""}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Login:</div>
                        <div className={styles.text}>{customer ? customer.login : ""}</div>
                    </div>
                </div>
            </div>
        </DesktopWrapper>
    );
}