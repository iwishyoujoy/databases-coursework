'use client'

import Image from "next/image";
import styles from './styles.module.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { IProductProps } from "../../components/CardContainer/CardContainerItem";
import addToCart from 'public/images/cart.svg';
import heart from 'public/images/heart.svg';
import { capitalizeFirstLetter } from "../../utils/text";
import { DesktopWrapper } from "../../components/DesktopWrapper";

interface ClothesProps{
    params: {
        id: string;
    }
}

export interface IProductCategoryProps {
    id: number;
    name: string;
    description: string;
}

export interface ISellerProps {
    id: number;
    name: string;
    email: string;
    contact: string;
    login: string;
    password: string;
}

export async function getProductById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/product/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getCategoryById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/productCategory/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getSellerById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/seller/id/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getReviewsById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/seller/id/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export default function Page({ params: { id } }: ClothesProps) {
    const [ product, setProduct ] = useState<IProductProps>();
    const [ category, setCategory ] = useState<IProductCategoryProps>();
    const [ seller, setSeller ] = useState<ISellerProps>();

    useEffect(() => {
        getProductById(id)
            .then(data => {
                setProduct(data);
                getCategoryById(data.product_category_id)
                    .then(data => {
                        setCategory(data);
                    })
                    .catch(error => console.error(error));
                    
                getSellerById(data.seller_id)
                    .then(data => {
                        setSeller(data);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
        }, [id]);

    return (
        <DesktopWrapper>
            {product && 
                <div className={styles.container}>
                    <div className={styles.mainContainer}>
                        <Image className={styles.image} height='300' width='300' src={product.photo_url} alt={product.description}/>
                        <div className={styles.infoContainer}>
                            <div className={styles.title}>{capitalizeFirstLetter(product.name)}</div>
                            <div className={styles.actonContainer}>
                                <div className={styles.price}>{product.price} $</div>
                                <Image className={styles.badge} src={heart} alt='Add to favorite'/>
                                <button className={styles.button} >Add to cart</button>
                            </div>
                            <>
                                <div className={styles.aboutContainer}>
                                    <div className={styles.about}>
                                        <div className={styles.header}>Details: </div>
                                        <div className={styles.text}>{product.description}</div>
                                    </div>
                                    {category && 
                                        <div className={styles.about}>
                                            <div className={styles.header}>Category: </div>
                                            <div className={styles.text}>{capitalizeFirstLetter(category.name)}</div>
                                        </div>
                                    }
                                    {seller && 
                                        <div className={styles.about}>
                                            <div className={styles.header}>Seller: </div>
                                            <div className={styles.text}>{seller.name}</div>
                                        </div>
                                    }
                                </div>
                                <div>

                                </div>
                            </>
                        </div>
                    </div>
                </div>}
        </DesktopWrapper>
    )
}