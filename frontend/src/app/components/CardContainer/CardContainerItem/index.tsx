import Link from 'next/link';
import { capitalizeFirstLetter } from '../../../utils/text';
import styles from './styles.module.css';
import Image from 'next/image';
import addToCart from 'public/images/addtoCart.svg';

interface IProductProps{
    id_item: number;
    name: string;
    price: number;
    description: string;
    photo_url: string;
    amount_available: number;
    seller_id: number;
    product_category_id: number;
}

interface ICardProps {
    product: IProductProps;
}

export const Card: React.FC<ICardProps> = (props) => {
    const {product} = props;

    return (
        <div className={styles.container}>
            <Link href={`clothes/${product.id_item}`}>
                <Image  className={styles.image} src={product.photo_url} alt={product.name} width='200' height='200'/>
            </Link>
            <div className={styles.textContainer}>
                <div className={styles.title}>{capitalizeFirstLetter(product.name)}</div>
                <div className={styles.priceContainer}>
                    <div className={styles.price}>{product.price} $</div>
                    <div className={styles.button}>
                        <Image className={styles.addToCart} src={addToCart} alt='Add to cart'/>
                    </div>
                </div>
            </div>
        </div>
    );

}