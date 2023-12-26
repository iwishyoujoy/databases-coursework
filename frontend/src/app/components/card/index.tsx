import styles from './styles.module.css';
import Image from 'next/image';

interface ICardProps {
    title: string;
    price: string;
    src: string;
}

export const Card: React.FC<ICardProps> = (props) => {
    const {title, price, src} = props;

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <Image className={styles.image} src={src} alt='Picture of product'/>
            </div>
            <div className={styles.title}>
                {title}
            </div>
            <div className={styles.price}>
                {price}
            </div>
        </div>
    );

}