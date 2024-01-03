import { AppDispatch, RootState } from '../../../redux/store';
import { IProcedureProps, IProductProps } from '../../../utils/types';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import addToCart from 'public/images/cart.svg';
import { addToFavorite } from '../../../utils/postQuery';
import axios from 'axios';
import blackHeart from 'public/images/blackHeart.svg';
import { capitalizeFirstLetter } from '../../../utils/text';
import { getCustomerData } from '../../../utils/getQuery';
import pinkHeart from 'public/images/heart.svg';
import { removeFromFavorite } from '../../../utils/deleteQuery';
import styles from './styles.module.css';

interface ICardProps {
    item: IProductProps | IProcedureProps;
    isProduct?: boolean;
    isInFavorite?: boolean;
}

export const Card: React.FC<ICardProps> = (props) => {
    const loginState = useSelector((state: RootState) => state.login);
    const dispatch = useDispatch<AppDispatch>();
    const [ customerId, setCustomerId ] = useState();
    const [isFavorite, setIsFavorite] = useState(false);
    const { item, isProduct = true } = props;

    useEffect(() => {
        if (loginState.isLogged){
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
        }
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
            <Link href={isProduct ? `http://localhost:3000/products/${(item as IProductProps).id_item}` : `http://localhost:3000/procedures/${(item as IProcedureProps).id}`}>
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