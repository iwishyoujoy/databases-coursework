import { useEffect, useState } from "react";

import { IOrderProps } from "../../utils/types";
import Image from "next/image";
import arrow from 'public/images/arrow.svg';
import axios from "axios";
import { getCheckForOrder } from "../../utils/getQuery";
import { roundAmount } from "../../utils/text";
import styles from './styles.module.css';

interface IOrderCardProps {
    order: IOrderProps;
    login: string;
}

export const OrderCard: React.FC<IOrderCardProps> = (props) => {
    const { order, login } = props;
    const [ amount, setAmount ] = useState(0);

    useEffect(() => {
        getCheckForOrder(order.id)
            .then(data => {
                setAmount(data);
            })
            .catch(error => console.error(error));
        }, [order.id]);

    return (
        <div className={styles.orderContainer}>
            <div className={styles.statusContainer}>
                <div className={styles.status}>{order.status}</div>
                <div className={styles.id}>#{order.id}</div>
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.headersContainer}>
                    <div className={styles.info}>
                        <div className={styles.header}>Date and time: </div>
                        <div className={styles.data}>{order.timestamp}</div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.header}>Total:</div>
                        <div className={styles.data}>{roundAmount(amount)} $</div>
                    </div>
                </div>
                <Image className={styles.arrow} src={arrow} alt='Open the order'/>                
            </div>
        </div>
    );
}