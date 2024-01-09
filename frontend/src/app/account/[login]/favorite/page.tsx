'use client'

import { AppDispatch, RootState, setIsLogged } from "../../../redux/store";
import React, { useEffect, useState } from "react";
import { getFavoritesByCustomer, getProductById } from "../../../utils/getQuery";

import { Card } from "../../../components/CardContainer/CardContainerItem";
import { DesktopWrapper } from "../../../components/DesktopWrapper";
import { IProductProps } from "../../../utils/types";
import Link from "next/link";
import cn from 'classnames';
import { getItemsListLength } from "../../../utils/text";
import styles from './styles.module.css';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface AccountProps{
    params: {
        login: string;
    }
}

export default function Page({ params: { login } }: AccountProps) {
    const loginState = useSelector((state: RootState) => state.login);

    const [ favorites, setFavorites ] = useState<IProductProps[]>([]);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (loginState.isLogged){
            getFavoritesByCustomer(login)
                .then(data => {
                    const promises = data.map((item) => {
                        const newItemData = item.favoriteProductId;

                    return getProductById(newItemData.item_id)
                        .then(itemData => {
                            return itemData;
                        })
                        .catch(error => console.error(error));
                    });
    
                    Promise.all(promises)
                    .then(products => {
                        setFavorites(products);
                    });
                })
                .catch(error => console.error(error));
        }
    }, [favorites, login]);

    const handleLogOutClick = () => {
        dispatch(setIsLogged(false));
        router.push(`/account/`);
    }

    return(
        <DesktopWrapper>
            <div className={styles.title}>Personal account</div>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={styles.link} href={`/account/${login}/profile`}>Profile</Link>
                    <Link className={styles.link} href={`/account/${login}/orders`}>Orders</Link>
                    <Link className={cn(styles.link, styles.selected)} href={`/account/${login}/favorite`}>Favorite</Link>
                    <button className={styles.logOutButton} onClick={handleLogOutClick}>Log out</button>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.counter}>{getItemsListLength(favorites, 'favorite', 'favorites')}</div>
                    {!favorites.length && 
                        <div className={styles.placeholder}>
                            <h1 className={styles.placeholderTitle}>Oopsie...</h1>
                            Seems like you didn't add any products to your favorites!
                        </div>}
                    <div className={styles.favoriteContainer}>
                        {favorites.map((favorite, key) => {
                            return (
                            <Card item={favorite} isProduct={favorite?.id_item ? true : false} key={key}/>
                            )
                        })}
                    </div>
                </div>
            </div>
        </DesktopWrapper>
    );
}