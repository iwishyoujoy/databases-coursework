'use client'

import { Card, IProductProps } from "../../../components/CardContainer/CardContainerItem";
import React, { useEffect, useState } from "react";

import { DesktopWrapper } from "../../../components/desktopWrapper";
import Link from "next/link";
import { OrderCard } from "../../../components/OrderCard";
import axios from "axios";
import cn from 'classnames';
import { getItemsListLength } from "../../../utils/text";
import { getProductById } from "../../../products/[id]/page";
import styles from './styles.module.css';

interface AccountProps{
    params: {
        id: string;
    }
}

async function getFavoritesByCustomer(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/favorite/all/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export default function Page({ params: { id } }: AccountProps) {
    const [ favorites, setFavorites ] = useState<IProductProps[]>([]);

    useEffect(() => {
        getFavoritesByCustomer(id)
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
    }, [favorites, id]);

    return(
        <DesktopWrapper>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={styles.link} href={`/account/${id}/profile`}>Profile</Link>
                    <Link className={styles.link} href={`/account/${id}/orders`}>Orders</Link>
                    <Link className={cn(styles.link, styles.selected)} href={`/account/${id}/favorite`}>Favorite</Link>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.counter}>{getItemsListLength(favorites, 'favorite', 'favorites')}</div>
                    <div className={styles.favoriteContainer}>
                        {favorites.map((favorite, key) => {
                            return (
                            <Card item={favorite} isInFavorite={true} isProduct={favorite?.id_item ? true : false} key={key}/>
                            )
                        })}
                    </div>
                </div>
            </div>
        </DesktopWrapper>
    );
}