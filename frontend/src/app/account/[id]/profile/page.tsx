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

export interface ICustomerProps {
    id: number;
    name: string;
    surname: string;
    birthday: string;
    phone_number: string;
    login: string;
    password: string;
}
interface AccountProps{
    params: {
        id: string;
    }
}

async function getCustomerData(login): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/customer/${login}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export default function Page({ params: { id } }: AccountProps) {
    const { isLogged } = useSelector((state: RootState) => state.login);
    const [ customer, setCustomer ] = useState<ICustomerProps>(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isLogged){
    //         navigate('/account');
    //     }
    // }, [isLogged, navigate]);

    useEffect(() => {
        getCustomerData(id)
            .then(data => {
                setCustomer(data);
            })
            .catch(error => console.error(error));
        }, [id]);

    return(
        <DesktopWrapper>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={cn(styles.link, styles.selected)} href={`/account/${id}/profile`}>Profile</Link>
                    <Link className={styles.link} href={`/account/${id}/orders`}>Orders</Link>
                    <Link className={styles.link} href={`/account/${id}/favorite`}>Favorite</Link>
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