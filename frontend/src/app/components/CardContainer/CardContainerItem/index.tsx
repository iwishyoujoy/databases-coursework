import Link from 'next/link';
import { capitalizeFirstLetter } from '../../../utils/text';
import styles from './styles.module.css';
import Image from 'next/image';
import addToCart from 'public/images/cart.svg';
import heart from 'public/images/blackHeart.svg';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';

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

export const Card: React.FC<ICardProps> = (props) => {
    const dispatch = useDispatch<AppDispatch>();
    const { item, isProduct = true } = props;

    const handleAddToFavoriteClick = () => {
        if (isProduct){
            dispatch(addToFavorite(11, (item as IProductProps).id_item));
        }
        else {
            dispatch(addToFavorite(11, (item as IProcedureProps).id));
        }
    }

    return (
        <div className={styles.container}>
            <Link href={isProduct ? `products/${(item as IProductProps).id_item}` : `procedures/${(item as IProcedureProps).id}`}>
                <Image  className={styles.image} src={item.photo_url} alt={item.name} width='200' height='200'/>
            </Link>
            <div className={styles.textContainer}>
                <div className={styles.title}>{capitalizeFirstLetter(item.name)}</div>
                <div className={styles.priceContainer}>
                    <div className={styles.price}>{item.price} $</div>
                    <div className={styles.buttonContainer}>
                        <div className={styles.button} onClick={handleAddToFavoriteClick}>
                            <Image className={styles.badge} src={heart} alt='Add to favorite'/>
                        </div>
                        <div className={styles.button}>
                            <Image className={styles.badge} src={addToCart} alt='Add to cart'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}