import axios from "axios";
import { IOrderProps } from "../../account/[id]/orders/page";
import styles from './styles.module.css';
import Image from "next/image";
import arrow from 'public/images/arrow.svg';
import { useEffect, useState } from "react";
import { roundAmount } from "../../utils/text";

interface IOrderCardProps {
    order: IOrderProps;
    login: string;
}

async function getCheckForOrder(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/order/check/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
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