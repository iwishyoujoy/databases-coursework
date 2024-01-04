'use client'

import { AppDispatch, setIsLogged } from "../../../redux/store";
import React, { useEffect, useState } from "react";

import { DesktopWrapper } from "../../../components/DesktopWrapper";
import { ICustomerProps } from "../../../utils/types";
import Link from "next/link";
import cn from 'classnames';
import { getCustomerData } from "../../../utils/getQuery";
import styles from './styles.module.css';
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

interface AccountProps{
    params: {
        login: string;
    }
}

export default function Page({ params: { login } }: AccountProps) {
    const [ customer, setCustomer ] = useState<ICustomerProps>(null);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        getCustomerData(login)
            .then(data => {
                setCustomer(data);
            })
            .catch(error => console.error(error));
        }, [login]);

    const handleLogOutClick = () => {
        dispatch(setIsLogged(false));
        router.push(`/account/`);
    }

    return(
        <DesktopWrapper>
            <div className={styles.title}>Personal account</div>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={cn(styles.link, styles.selected)} href={`/account/${login}/profile`}>Profile</Link>
                    <Link className={styles.link} href={`/account/${login}/orders`}>Orders</Link>
                    <Link className={styles.link} href={`/account/${login}/favorite`}>Favorite</Link>
                    <button className={styles.logOutButton} onClick={handleLogOutClick}>Log out</button>
                </div>
                {customer &&
                <div className={styles.rightContainer}>
                    <div className={styles.data}>
                        <div className={styles.header}>Name:</div>
                        <div className={styles.text}>{customer.name}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Surname:</div>
                        <div className={styles.text}>{customer.surname}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Birthday:</div>
                        <div className={styles.text}>{customer.birthday}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Phone number:</div>
                        <div className={styles.text}>{customer.phone_number}</div>
                    </div>
                    <div className={styles.data}>
                        <div className={styles.header}>Login:</div>
                        <div className={styles.text}>{customer.login}</div>
                    </div>
                </div>
                }
            </div>
        </DesktopWrapper>
    );
}