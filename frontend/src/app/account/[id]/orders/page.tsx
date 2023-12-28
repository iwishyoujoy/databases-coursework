'use client'

import React, { useEffect, useState } from "react";
import cn from 'classnames';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

import styles from './styles.module.css';
import { DesktopWrapper } from "../../../components/DesktopWrapper";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import arrow from 'public/images/arrow.svg';
import { getItemsListLength } from "../../../utils/text";

export interface IOrderProps {
    id: number;
    customer_id: string;
    status: string;
    timestamp: string;
}

interface AccountProps{
    params: {
        id: string;
    }
}

async function getOrdersForCustomer(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/order/customer/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export default function Page({ params: { id } }: AccountProps) {
    // const { isLogged } = useSelector((state: RootState) => state.login);
    const [ orders, setOrders ] = useState<IOrderProps[]>([]);

    // useEffect(() => {
    //     if (!isLogged){
    //         navigate('/account');
    //     }
    // }, [isLogged, navigate]);

    useEffect(() => {
        getOrdersForCustomer(id)
            .then(data => {
                console.log(data);
                setOrders(data);
            })
            .catch(error => console.error(error));
        }, [id]);
    
    return(
        <DesktopWrapper>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={styles.link} href={`/account/${id}/profile`}>Profile</Link>
                    <Link className={cn(styles.link, styles.selected)} href={`/account/${id}/orders`}>Orders</Link>
                    <Link className={styles.link} href={`/account/${id}/favorite`}>Favorite</Link>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.counter}>{getItemsListLength(orders, 'order', 'orders')}</div>
                    {orders.map((order, key) => {
                        return (
                            <div className={styles.orderContainer} key={key}>
                                <div className={styles.statusContainer}>
                                    <div className={styles.status}>{order.status}</div>
                                    <div className={styles.id}>#{order.id}</div>
                                </div>
                                <div className={styles.infoContainer}>
                                    <div className={styles.info}>
                                        <div className={styles.header}>Date and time: </div>
                                        <div className={styles.data}>{order.timestamp}</div>
                                    </div>
                                    <Image className={styles.arrow} src={arrow} alt='Open the order'/>
                                    {/* <div className={styles.info}>
                                        <div className={styles.data}>{order.amount}</div>
                                        <div className={styles.header}>Date and time</div>
                                    </div> */}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </DesktopWrapper>
    );
}