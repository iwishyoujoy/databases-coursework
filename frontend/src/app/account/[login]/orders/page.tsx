'use client'

import { AppDispatch, setIsLogged } from "../../../redux/store";
import React, { useEffect, useState } from "react";

import { DesktopWrapper } from "../../../components/DesktopWrapper";
import { IOrderProps } from "../../../utils/types";
import Link from "next/link";
import { OrderCard } from "../../../components/OrderCard";
import cn from 'classnames';
import { getItemsListLength } from "../../../utils/text";
import { getOrdersForCustomer } from "../../../utils/getQuery";
import styles from './styles.module.css';
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

interface AccountProps{
    params: {
        login: string;
    }
}

export default function Page({ params: { login } }: AccountProps) {
    const [ orders, setOrders ] = useState<IOrderProps[]>([]);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        getOrdersForCustomer(login)
            .then(data => {
                setOrders(data);
            })
            .catch(error => console.error(error));
        }, [login]);

    const handleLogOutClick = () => {
        dispatch(setIsLogged(false));
        router.push(`/account/`);
    }
    
    return(
        <DesktopWrapper>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={styles.link} href={`/account/${login}/profile`}>Profile</Link>
                    <Link className={cn(styles.link, styles.selected)} href={`/account/${login}/orders`}>Orders</Link>
                    <Link className={styles.link} href={`/account/${login}/favorite`}>Favorite</Link>
                    <button className={styles.logOutButton} onClick={handleLogOutClick}>Log out</button>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.counter}>{getItemsListLength(orders, 'order', 'orders')}</div>
                    {!orders.length && 
                        <div className={styles.placeholder}>
                            <h1 className={styles.placeholderTitle}>Oopsie...</h1>
                            Seems like you didn't purchased anything!
                        </div>}
                    {orders.map((order, key) => {
                        return (
                           <OrderCard order={order} key={key} login={login}/> 
                        )
                    })}
                </div>
            </div>
        </DesktopWrapper>
    );
}