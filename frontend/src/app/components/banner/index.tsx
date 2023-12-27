import Image from 'next/image';
import styles from './styles.module.css'

import src from "public/images/makeup.jpg";

export const Banner = () => {
    return (
        <div className={styles.container}>
            <Image src={src} className={styles.image} alt='Banner with glittery makeup' />
            <div className={styles.infoContainer}>
                <div className={styles.title}>Shine bright like a diamond...</div>
                <div className={styles.description}>That's what Rihanna said, and she's always right. Hurry up to buy your highlighter. 10 colors are already available!</div>
            </div>
        </div>
    );
}