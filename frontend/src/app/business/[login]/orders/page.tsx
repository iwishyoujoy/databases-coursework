'use client'

import { AppDispatch, RootState, setIsLoggedBusiness } from "../../../redux/store";
import React, { useEffect, useState } from "react";
import { getOrderForClinicById, getOrderForSellerById } from "../../../utils/getQuery";
import { useDispatch, useSelector } from "react-redux";

import { DesktopWrapper } from "../../../components/DesktopWrapper";
import { ItemInOrderCard } from "../../../components/ItemInOrderCard";
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
    const [ orders, setOrders ] = useState();

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (businessState.isLogged){
            if (businessState.isSeller){
                getOrderForSellerById(businessState.id)
                    .then(data => {
                        console.log(data);
                        setOrders(data);
                    })
                    .catch(error => console.error(error));
            }
            else {
                getOrderForClinicById(businessState.id)
                    .then(data => {
                        console.log(data);
                        setOrders(data);
                    })
                    .catch(error => console.error(error));
            }
        }
    }, [businessState.id, businessState.isSeller]);

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
                    {orders ?
                        <>
                            {Object.entries(orders).map(([orderNumber, orderItems]) => (
                                <div key={orderNumber} className={styles.orderContainer}>
                                    <div className={styles.orderTitle}>Order Number: {orderNumber}</div>
                                    {orderItems.map((item, index) => (
                                        <ItemInOrderCard view={businessState.isSeller ? 'seller' : 'clinic'} key={index} item={{...item.itemInOrderId, type: businessState.isSeller ? 'product' : 'appointment'}} canBeChanged={true} num={index + 1}/>
                                    ))}
                                </div>
                            ))}
                            <div className={styles.note}>Note: After assembly, as well as after sending the product, please change the status on the right.</div>
                        </>
                    : (
                        <div className={styles.placeholder}>
                            <h1 className={styles.placeholderTitle}>No orders yet</h1>
                            Either you haven't placed your items, or no one has placed an order yet
                        </div>
                    )
                    }
                </div>
            </div>
        </DesktopWrapper>
    );
}