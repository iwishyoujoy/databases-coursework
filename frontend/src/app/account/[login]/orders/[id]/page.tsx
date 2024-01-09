'use client'

import { AppDispatch, RootState, setIsLogged } from "../../../../redux/store";
import React, { useEffect, useState } from "react";

import { DesktopWrapper } from "../../../../components/DesktopWrapper";
import { IItemInOrderProps } from "../../../../utils/types";
import Image from 'next/image';
import { ItemInOrderCard } from "../../../../components/ItemInOrderCard";
import Link from "next/link";
import arrow from 'public/images/arrowLeft.svg';
import cn from 'classnames';
import { getItemsFromOrder } from "../../../../utils/getQuery";
import styles from './styles.module.css';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface OrderProps{
    params: {
        login: string;
        id: number;
    }
}

export default function Page({ params: { login, id } }: OrderProps) {
    const loginState = useSelector((state: RootState) => state.login);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [ items, setItems ] = useState<IItemInOrderProps[]>();

    useEffect(() => {
        if (loginState.isLogged){
            getItemsFromOrder(id)
                .then((data) => {
                    setItems(data);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    }, [id]);
    
    const handleLogOutClick = () => {
        dispatch(setIsLogged(false));
        router.push(`/account/`);
    }

    const handleArrowClick = () => {
        router.push(`http://localhost:3000/account/${login}/orders`);
    }
    
    return(
        <DesktopWrapper>
            <div className={styles.title}>Personal account</div>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={styles.link} href={`/account/${login}/profile`}>Profile</Link>
                    <Link className={cn(styles.link, styles.selected)} href={`/account/${login}/orders`}>Orders</Link>
                    <Link className={styles.link} href={`/account/${login}/favorite`}>Favorite</Link>
                    <button className={styles.logOutButton} onClick={handleLogOutClick}>Log out</button>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.rightContainerTitle}>
                        <Image className={styles.arrow} onClick={handleArrowClick} src={arrow} alt='Open the order'/>                
                        Items in order # {id}
                    </div>
                    {items && 
                        items.map((item, key) => {
                            return (
                                <ItemInOrderCard key={key} num={key + 1} item={item}/>
                            )
                        })
                    }
                </div>
            </div>
        </DesktopWrapper>
    );
}