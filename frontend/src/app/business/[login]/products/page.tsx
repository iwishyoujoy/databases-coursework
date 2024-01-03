'use client'

import { AppDispatch, RootState } from "../../../redux/store";
import { ICategoryProps, IProductProps } from "../../../utils/types";
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, getItemsListLength } from "../../../utils/text";
import { getAllCategories, getFavoritesByCustomer, getProductById } from "../../../utils/getQuery";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "../../../components/CardContainer/CardContainerItem";
import { DesktopWrapper } from "../../../components/DesktopWrapper";
import Link from "next/link";
import { addProduct } from "../../../utils/postQuery";
import cn from 'classnames';
import styles from './styles.module.css';

interface AccountProps{
    params: {
        login: string;
    }
}

const NewProductModal = ({ isOpen, onClose, id }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [ name, setName ] = useState();
    const [ price, setPrice ] = useState();
    const [ description, setDescription ] = useState();
    const [ photoUrl, setPhotoUrl ] = useState();
    const [ amountAvailable, setAmountAvailable ] = useState();
    const [ categories, setCategories ] = useState<ICategoryProps[]>([]);
    const [ categoryId, setCategoryId ] = useState();

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handlePriceChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrice(parseFloat(event.target.value));
    };
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };
    const handlePhotoUrlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPhotoUrl(event.target.value);
    };
    const handleAmountAvailableChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAmountAvailable(parseInt(event.target.value));
    };

    const handleSendReviewClick = () => {
        console.log(name, price, description, photoUrl, amountAvailable, id, categoryId)
        dispatch(addProduct(name, price, description, photoUrl, amountAvailable, id, categoryId));
        // onClose();
    }

    useEffect(() => {
        getAllCategories('productCategory')
            .then(data => {
                setCategories(data);
            })
            .catch(error => console.error(error));
    }, []);
     
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>Add new product</h2>
                <input className={styles.modalInput} type="text" value={name} onChange={handleNameChange} placeholder="Name"/>
                <input className={styles.modalInput} type="number" min="1" value={price} onChange={handlePriceChange} placeholder="Price"/>
                <input className={styles.modalInput} type="text" value={description} onChange={handleDescriptionChange} placeholder="Description"/>
                <input className={styles.modalInput} type="number" min="1" value={amountAvailable} onChange={handleAmountAvailableChange} placeholder="Amount available"/>
                <div className={styles.modalInputDescriptionPink}>Choose category for the product:</div>
                {categories && <select className={cn(styles.selectModalContainer, styles.selectContainer)} onChange={(e) => setCategoryId(e.target.value)}>
                    {categories.map((category, key) => {
                        return <option className={styles.optionModal} value={category.id} key={key}>{capitalizeFirstLetter(category.name)}</option>
                    })}
                </select>}
                <div className={styles.modalInputDescription}>URL should starts with https://i.pinimg.com</div>
                <textarea className={cn(styles.modalInput, styles.modalText)} value={photoUrl} onChange={handlePhotoUrlChange} placeholder="URL for photo"/>
                <div className={styles.modalWarning}>Make sure you checked everything twice! <br /> You can't undo this action</div>
                <button className={styles.buttonInverted} onClick={handleSendReviewClick}>Submit</button>
            </div>
        </div>
    );
};

export default function Page({ params: { login } }: AccountProps) {
    // const [ favorites, setFavorites ] = useState<IProductProps[]>([]);
    const businessState = useSelector((state: RootState) => state.business);
    const [ isAddingNewProduct, setIsAddingNewProduct ] = useState(false);

    // useEffect(() => {
    //     getFavoritesByCustomer(login)
    //         .then(data => {
    //             const promises = data.map((item) => {
    //                 const newItemData = item.favoriteProductId;

    //                return getProductById(newItemData.item_id)
    //                    .then(itemData => {
    //                        return itemData;
    //                    })
    //                    .catch(error => console.error(error));
    //             });
 
    //             Promise.all(promises)
    //                .then(products => {
    //                    setFavorites(products);
    //                });
    //         })
    //         .catch(error => console.error(error));
    // }, [favorites, login]);

    return(
        <DesktopWrapper>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={styles.link} href={`/business/${login}/profile`}>Profile</Link>
                    <Link className={cn(styles.link, styles.selected)} href={`/business/${login}/products`}>Products</Link>
                    <Link className={styles.link} href={`/business/${login}/orders`}>Orders</Link>
                </div>
                <div className={styles.rightContainer}>
                    {/* <div className={styles.counter}>{getItemsListLength(favorites, 'products', 'favorites')}</div> */}
                    <div className={styles.buttonContainer}>
                        <button className={styles.button} onClick={() => setIsAddingNewProduct(true)}>Add new product</button>
                    </div>
                    {/* {!favorites.length && 
                        <div className={styles.placeholder}>
                            <h1 className={styles.placeholderTitle}>Oopsie...</h1>
                            Seems like you didn't add any products to your favorites!
                        </div>}
                    <div className={styles.favoriteContainer}>
                        {favorites.map((favorite, key) => {
                            return (
                            <Card item={favorite} isInFavorite={true} isProduct={favorite?.id_item ? true : false} key={key}/>
                            )
                        })}
                    </div> */}
                    <div className={styles.placeholderContainer}>
                        <h1 className={styles.placeholderTitle}>Let's start!</h1>
                        You can add your first product by clicking button at the top right corner
                    </div>
                </div>
            </div>
            {isAddingNewProduct && <NewProductModal isOpen={isAddingNewProduct} onClose={() => setIsAddingNewProduct(false)} id={businessState.id}/>}
        </DesktopWrapper>
    );
}