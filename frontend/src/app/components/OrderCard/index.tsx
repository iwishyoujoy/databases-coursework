import { AppDispatch, setOrderId } from "../../redux/store";
import { useEffect, useState } from "react";

import { IOrderProps } from "../../utils/types";
import Image from "next/image";
import arrow from 'public/images/arrow.svg';
import { getCheckForOrder } from "../../utils/getQuery";
import { roundAmount } from "../../utils/text";
import styles from './styles.module.css';
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

interface IOrderCardProps {
    order: IOrderProps;
    login: string;
}

export const OrderCard: React.FC<IOrderCardProps> = (props) => {
    const { order, login } = props;
    const [ amount, setAmount ] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    useEffect(() => {
        getCheckForOrder(order.id)
            .then(data => {
                setAmount(data);
            })
            .catch(error => console.error(error));
        }, [order.id]);

    if (order.status === 'Starting to Sparkle'){
        dispatch(setOrderId(order.id));
    }

    const handleArrowClick = () => {
        if (order.status === 'Starting to Sparkle'){
            router.push(`http://localhost:3000/cart`);
        }
        else{
            // TODO: delete later
            console.log("delete later")
        }
    }

    return (
        <div className={styles.orderContainer}>
            <div className={styles.statusContainer}>
                <div className={styles.statusContainerLeft}>
                    <div className={styles.status}>{order.status}</div>
                    <div className={styles.statusComment}>{order.status === 'Starting to Sparkle' ? "This is everything inside your cart, we prepare in advance" : ""}</div>
                </div>
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
                <Image className={styles.arrow} onClick={handleArrowClick} src={arrow} alt='Open the order'/>                
            </div>
        </div>
    );
}