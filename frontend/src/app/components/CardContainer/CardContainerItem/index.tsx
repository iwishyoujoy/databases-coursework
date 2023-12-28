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

interface IProcedureProps{
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

export const Card: React.FC<ICardProps> = (props) => {
    const { item, isProduct = true } = props;

    return (
        <div className={styles.container}>
            <Link href={isProduct ? `clothes/${(item as IProductProps).id_item}` : `procedures/${(item as IProcedureProps).id}`}>
                <Image  className={styles.image} src={item.photo_url} alt={item.name} width='200' height='200'/>
            </Link>
            <div className={styles.textContainer}>
                <div className={styles.title}>{capitalizeFirstLetter(item.name)}</div>
                <div className={styles.priceContainer}>
                    <div className={styles.price}>{item.price} $</div>
                    <div className={styles.button}>
                        <Image className={styles.addToCart} src={addToCart} alt='Add to cart'/>
                    </div>
                </div>
            </div>
        </div>
    );

}