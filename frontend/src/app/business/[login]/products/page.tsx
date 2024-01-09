'use client'

import { AppDispatch, RootState, setIsLoggedBusiness } from "../../../redux/store";
import { ICategoryProps, IProductProps } from "../../../utils/types";
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, getItemsListLength } from "../../../utils/text";
import { getAllCategories, getProductsBySellerId } from "../../../utils/getQuery";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "../../../components/CardContainer/CardContainerItem";
import { DesktopWrapper } from "../../../components/DesktopWrapper";
import Link from "next/link";
import { addProduct } from "../../../utils/postQuery";
import cn from 'classnames';
import styles from './styles.module.css';
import { useRouter } from "next/navigation";

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

    const handleSubmitClick = () => {
        dispatch(addProduct(name, price, description, photoUrl, amountAvailable, id, categoryId));
        onClose();
    }

    useEffect(() => {
        getAllCategories('productCategory')
            .then(data => {
                setCategories(data);
                setCategoryId(data[0].id);
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
                <textarea className={cn(styles.modalInput, styles.modalDescriptionInput)} value={description} onChange={handleDescriptionChange} placeholder="Description"/>
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
                <button className={styles.buttonInverted} onClick={handleSubmitClick}>Submit</button>
            </div>
        </div>
    );
};

export default function Page({ params: { login } }: AccountProps) {
    const businessState = useSelector((state: RootState) => state.business);
    const deletedProductId = useSelector((state: RootState) => state.product.deletedProductId);

    const [ isAddingNewProduct, setIsAddingNewProduct ] = useState(false);
    const [ products, setProducts ] = useState<IProductProps[]>([]);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (businessState.isLogged){
            getProductsBySellerId(businessState.id)
                .then(data => {
                    setProducts(data);
                })
                .catch(error => console.error(error));
        }
    }, [businessState.id, deletedProductId, isAddingNewProduct]);

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
                    <Link className={cn(styles.link, styles.selected)} href={`/business/${login}/products`}>Products</Link>
                    <Link className={styles.link} href={`/business/${login}/orders`}>Orders</Link>
                    <button className={styles.logOutButton} onClick={handleLogOutClick}>Log out</button>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.counter}>{getItemsListLength(products, 'product', 'products')}</div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.button} onClick={() => setIsAddingNewProduct(true)}>Add new product</button>
                    </div>
                    {!products.length && 
                        <div className={styles.placeholderContainer}>
                            <h1 className={styles.placeholderTitle}>Let's start!</h1>
                            You can add your first product by clicking button at the top right corner
                        </div>
                    }
                    <div className={styles.favoriteContainer}>
                        {products.map((product, key) => {
                            return (
                            <Card item={product} canBeDeleted={true} isProduct={true} key={key}/>
                            )
                        })}
                    </div>

                </div>
            </div>
            {isAddingNewProduct && <NewProductModal isOpen={isAddingNewProduct} onClose={() => setIsAddingNewProduct(false)} id={businessState.id}/>}
        </DesktopWrapper>
    );
}