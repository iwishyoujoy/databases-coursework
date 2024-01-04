'use client'

import React, { useEffect, useState } from "react";

import { DesktopWrapper } from "../components/DesktopWrapper";
import { RootState } from "../redux/store";
import { getItemsFromOrder } from "../utils/getQuery";
import styles from './styles.module.css';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Page() {  
    const loginState = useSelector((state: RootState) => state.login);
    const cartState = useSelector((state: RootState) => state.cart);
    const [ items, setItems ] = useState([]);

    // const router = useRouter();

    useEffect(() => {
        getItemsFromOrder(cartState.orderId)
            .then((data) => {
                setItems(data);
            })
            .catch(error => console.log(error));
    }, [cartState.orderId]);
     
    return (
        <DesktopWrapper>
        <div className={styles.title}>Cart</div>
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                {/* {items && (
                    items.map((item) => {
                        return (
                            <div className={styles.itemContainer}>
                                <div>
                                    <Image src={}/>
                                </div>
                            </div>
                        );
                    })
                )} */}
            </div>
            <div className={styles.rightContainer}>
                
            </div>
        </div>
    </DesktopWrapper>
    );
}