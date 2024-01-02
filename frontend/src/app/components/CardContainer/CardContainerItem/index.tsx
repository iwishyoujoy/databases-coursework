import { AppDispatch, RootState } from '../../../redux/store';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import addToCart from 'public/images/cart.svg';
import axios from 'axios';
import blackHeart from 'public/images/blackHeart.svg';
import { capitalizeFirstLetter } from '../../../utils/text';
import { getCustomerData } from '../../../account/[id]/profile/page';
import pinkHeart from 'public/images/heart.svg';
import styles from './styles.module.css';

export interface IProductProps{
    id_item: number;
    name: string;
    price: number;
    description: string;
    photo_url: string;
    amount_available: number;
    seller_id: number;
    product_category_id: number;
}

export interface IProcedureProps{
    id: number;
    photo_url: string;
    name: string;
    price: number;
    procedure_category_id: number;
    clinic_id: number;
}

interface ICardProps {
    item: IProductProps | IProcedureProps;
    isProduct?: boolean;
    isInFavorite?: boolean;
}

export const addToFavorite = (customer_id, item_id) => {
    return (dispatch) => {
        axios.post('http://localhost:3100/api/favorite/create/', { 
            customer_id,
            item_id
         })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'ADD_FAVORITE_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to sign up');
            }
        })
        .catch(error => {
            dispatch({ type: 'ADD_FAVORITE_FAILURE', payload: error.message });
        });
    };
};

export const removeFromFavorite = (customer_id, item_id) => {
    return (dispatch) => {
        axios.delete(`http://localhost:3100/api/favorite/${customer_id}/${item_id}`)
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'REMOVE_FAVORITE_SUCCESS', payload: { customer_id, item_id } });
            } else {
                throw new Error('Failed to remove from favorites');
            }
        })
        .catch(error => {
            dispatch({ type: 'REMOVE_FAVORITE_FAILURE', payload: error.message });
        });
    };
};

export const Card: React.FC<ICardProps> = (props) => {
    const loginState = useSelector((state: RootState) => state.login);
    const dispatch = useDispatch<AppDispatch>();
    const [ customerId, setCustomerId ] = useState();
    const [isFavorite, setIsFavorite] = useState(false);
    const { item, isProduct = true } = props;

    useEffect(() => {
        getCustomerData(loginState.login)
            .then(data => {
                setCustomerId(data.id);
                axios.get(`http://localhost:3100/api/favorite/all/${loginState.login}`)
                    .then(response => {
                        const favoriteItems = response.data.map(item => item.favoriteProductId.item_id);
                        setIsFavorite(favoriteItems.includes((item as IProductProps).id_item));
                    })
                .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
        }, [item, loginState.login]);

    const toggleFavorite = () => {
        if (!loginState.isLogged){
            toast.error("You can not add this item to favorite! Please log in first!");
        }
        else{
            if (isFavorite) {
                dispatch(removeFromFavorite(customerId, (item as IProductProps).id_item));
                setIsFavorite(false);
            } else {
                dispatch(addToFavorite(customerId, (item as IProductProps).id_item));
                setIsFavorite(true);
            }
        }
    }

    return (
        <>
        <Toaster
            position="bottom-right"
            reverseOrder={false}
        />
        <div className={styles.container}>
            <Link href={isProduct ? `products/${(item as IProductProps).id_item}` : `procedures/${(item as IProcedureProps).id}`}>
                <Image  className={styles.image} src={item.photo_url} alt={item.name} width='200' height='200'/>
            </Link>
            <div className={styles.textContainer}>
                <div className={styles.title}>{capitalizeFirstLetter(item.name)}</div>
                <div className={styles.priceContainer}>
                    <div className={styles.price}>{item.price} $</div>
                    <div className={styles.buttonContainer}>
                        {isProduct && 
                            <div className={styles.button} onClick={toggleFavorite}>
                                <Image className={styles.badge} src={isFavorite ? blackHeart : pinkHeart} alt='Add to favorite'/>
                            </div>
                        }
                        <div className={styles.button}>
                            <Image className={styles.badge} src={addToCart} alt='Add to cart'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );

}