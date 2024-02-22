import { AppDispatch, RootState, productDeleted } from '../../../redux/store';
import { IProcedureProps, IProductProps } from '../../../utils/types';
import { addItemToCart, addToFavorite } from '../../../utils/postQuery';
import { deleteProcedureById, deleteProductById, removeFromFavorite } from '../../../utils/deleteQuery';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import addToCart from 'public/images/cart.svg';
import blackHeart from 'public/images/blackHeart.svg';
import { capitalizeFirstLetter } from '../../../utils/text';
import pinkHeart from 'public/images/heart.svg';
import styles from './styles.module.css';
import trash from 'public/images/trash.svg';
import { useGetAppointmentsByProcedureIdQuery, useGetCustomerDataQuery, useGetFavoritesByCustomerQuery } from '../../../utils/api';

interface ICardProps {
    item: IProductProps | IProcedureProps;
    isProduct?: boolean;
    canBeDeleted?: boolean
}

export const Card: React.FC<ICardProps> = (props) => {
    const { item, isProduct = true, canBeDeleted = false } = props;

    const loginState = useSelector((state: RootState) => state.login);
    const cartState = useSelector((state: RootState) => state.cart);

    const dispatch = useDispatch<AppDispatch>();

    const [ customerId, setCustomerId ] = useState<number>();
    const [ isFavorite, setIsFavorite] = useState<boolean>(false);
    const [ appointmentId, setAppointmentId ] = useState<number>();

    const {data: customerData} = useGetCustomerDataQuery(loginState.login);
    const {data: favoriteItemsData} = useGetFavoritesByCustomerQuery(loginState.login);
    const {data: appointmentsData} = useGetAppointmentsByProcedureIdQuery((item as IProcedureProps).id, { skip: isProduct });

    useEffect(() => {
        if (loginState.isLogged){
            if (isProduct){
                if (customerData){
                    setCustomerId(customerData.id);
                }
                if (favoriteItemsData){
                    const favoriteItems = favoriteItemsData.map(item => item.favoriteProductId.item_id);
                    setIsFavorite(favoriteItems.includes((item as IProductProps).id_item));
                }
            }
            else{
                if (appointmentsData){
                    setAppointmentId(appointmentsData[0]?.item_id);
                }
            }
        }
    }, [isProduct, customerData, favoriteItemsData, appointmentsData, loginState.isLogged]);

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

    const handleDeleteClick = () => {
        if (isProduct){
            dispatch(deleteProductById((item as IProductProps).id_item));
            dispatch(productDeleted((item as IProductProps).id_item));
        }
        else {
            dispatch(deleteProcedureById((item as IProcedureProps).id));
            dispatch(productDeleted((item as IProcedureProps).id));
        }
    };

    const handleAddToCartClick = () => {
        if (!loginState.isLogged){
            toast.error("You can not add this item to cart! Please log in first!");
        }
        else{
            if (isProduct){
                dispatch(addItemToCart(cartState.orderId, (item as IProductProps).id_item, 1, 'Starting to Sparkle'));
            }
            else{
                
                dispatch(addItemToCart(cartState.orderId, appointmentId, 1, 'Starting to Sparkle'));
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
                        {canBeDeleted ? (
                            <div className={styles.button}>
                                <Image className={styles.badge} onClick={handleDeleteClick} src={trash} alt='Delete item'/>
                            </div>
                        ) : (
                            <>
                                {isProduct && 
                                    <div className={styles.button} onClick={toggleFavorite}>
                                        <Image className={styles.badge} src={isFavorite ? blackHeart : pinkHeart} alt='Add to favorite'/>
                                    </div>
                                }
                                <div className={styles.button}>
                                    <Image className={styles.badge} onClick={handleAddToCartClick} src={addToCart} alt='Add to cart'/>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );

}