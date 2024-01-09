import { AppDispatch, setOrderId, setTimestamp } from "../../redux/store";
import { IItemInOrderProps, IOrderProps, OrderStatus } from "../../utils/types";
import { getCheckForOrder, getItemsFromOrder, getOrderById } from "../../utils/getQuery";
import { useEffect, useState } from "react";

import Image from "next/image";
import arrow from 'public/images/arrow.svg';
import { roundAmount } from "../../utils/text";
import styles from './styles.module.css';
import { updateOrderStatus } from "../../utils/putQuery";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

interface IOrderCardProps {
    order: IOrderProps;
    login: string;
}

export const OrderCard: React.FC<IOrderCardProps> = (props) => {
    const { order, login } = props;
    const [ amount, setAmount ] = useState(0);
    const [ items, setItems ] = useState<IItemInOrderProps[]>();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    useEffect(() => {
        getCheckForOrder(order.id)
            .then(data => {
                setAmount(data);
            })
            .catch(error => console.error(error));

            getItemsFromOrder(order.id)
            .then((data) => {
                setItems(data);
                
                if (order.status !== 'Starting to Sparkle'){
                    let newStatus: OrderStatus = 'Ready to Slay';
                    if (data.some(item => item.status === 'Glam in Progress')) {
                        newStatus = 'Glam in Progress';
                    } else if (data.some(item => item.status === 'Glowing and Going')) {
                        newStatus = 'Glowing and Going';
                    }
        
                    if (newStatus !== order.status) {
                        dispatch(updateOrderStatus(order.id, order.customer_id, login, order.timestamp, newStatus));
                    }
                }
                
            })
            .catch((error) => {
                console.error(error);
            })
        }, [dispatch, login, order.customer_id, order.id, order.status, order.timestamp]);

    if (order.status === 'Starting to Sparkle'){
        dispatch(setOrderId(order.id));
        getOrderById(order.id)
            .then((data) => {
                dispatch(setTimestamp(data.timestamp));
            })
            .catch(error => console.error(error));
    }

    const handleArrowClick = () => {
        if (order.status === 'Starting to Sparkle'){
            router.push(`http://localhost:3000/cart`);
        }
        else{
            router.push(`http://localhost:3000/account/${login}/orders/${order.id}`);
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