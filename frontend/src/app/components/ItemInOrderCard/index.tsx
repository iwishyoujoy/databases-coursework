import { IItemInOrderProps, OrderStatus } from "../../utils/types";
import { capitalizeFirstLetter, roundAmount } from "../../utils/text";
import { getAppointmentById, getProcedureById, getProductById } from "../../utils/getQuery";
import { use, useEffect, useState } from "react";

import { AppDispatch } from "../../redux/store";
import Image from "next/image";
import cn from 'classnames';
import styles from './styles.module.css';
import { updateItemInOrder } from "../../utils/putQuery";
import { useDispatch } from "react-redux";

interface IItemInOrderCardProps {
    item: IItemInOrderProps;
    num: number;
    canBeChanged?: boolean;
    view?: 'seller' | 'clinic' | 'default';
}

const statuses = [ 'Glam in Progress', 'Glowing and Going', 'Ready to Slay'];

export const ItemInOrderCard: React.FC<IItemInOrderCardProps> = (props) => {
    const { item, num, canBeChanged = false, view = 'default' } = props;

    const dispatch = useDispatch<AppDispatch>();

    const [ curStatus, setCurStatus ] = useState<OrderStatus>('Glam in Progress');
    const [ name, setName ] = useState<string>();
    const [ photoUrl, setPhotoUrl ] = useState<string>();
    const [ price, setPrice ] = useState<number>();
    const [ dateTime, setDateTime ] = useState<string>();

    useEffect(() => {
        if (view === 'seller'){
            setCurStatus(item.status);
            getProductById(item.item_id)
                .then((data) => {
                    setName(data.name);
                    setPhotoUrl(data.photo_url);
                    setPrice(data.price);
                })
                .catch((error) => console.error(error));
        }
        else if (view === 'clinic'){
            setCurStatus(item.status);
            getAppointmentById(item.item_id)
                .then((data) => {
                    setDateTime(data.date_time);
                    
                    getProcedureById(data.procedure_id)
                        .then((procedureData) => {
                            setName(procedureData.name);
                            setPhotoUrl(procedureData.photo_url);
                            setPrice(procedureData.price);
                        })
                })
        }
        else {
            if (item.type === 'product'){
                setCurStatus(item.status);
                getProductById(item.item_id)
                    .then((data) => {
                        setName(data.name);
                        setPhotoUrl(data.photo_url);
                        setPrice(data.price);
                    })
                    .catch((error) => console.error(error));
            }
            else{
                setCurStatus(item.status);
                getAppointmentById(item.item_id)
                    .then((data) => {
                        setDateTime(data.date_time);
                        
                        getProcedureById(data.procedure_id)
                            .then((procedureData) => {
                                setName(procedureData.name);
                                setPhotoUrl(procedureData.photo_url);
                                setPrice(procedureData.price);
                            })
                    })
            }
        }
    }, [item.item_id, item.type, view]);

    useEffect(() => {
        if (curStatus !== 'Glam in Progress'){
            dispatch(updateItemInOrder(item.order_id, item.item_id, item.current_amount, curStatus));
        }
    }, [curStatus])

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurStatus(event.target.value);
    }

    return (
        <div className={styles.cardContainer}>
            {item.type === 'product' ? (
                <>
                <div className={styles.container}>
                    <div className={styles.number}># {num}</div>
                    {photoUrl && <div className={styles.imageContainer}>
                        <Image className={styles.image} src={photoUrl} alt={name} height='300' width='300'/>
                    </div>}
                    {price && name && <div className={styles.infoContainer}>
                        <div className={styles.title}>{capitalizeFirstLetter(name)}</div>
                        <div className={styles.amount}>Amount: {item.current_amount}</div>
                        <div className={styles.total}>Total: {roundAmount(item.current_amount * price)} $</div>
                    </div>}
                </div>
                <div className={canBeChanged ? styles.statusChangeable : styles.status}>
                    {canBeChanged ? (
                        <select className={styles.selectContainer} value={curStatus} onChange={handleStatusChange}>
                            {statuses.map((status, key) => {
                                return <option className={styles.option} value={status} key={key}>{capitalizeFirstLetter(status)}</option>
                            })}
                        </select>
                    ) : (item.status)}
                </div>
                </>
            ) : (
                <>
                <div className={styles.container}>
                    <div className={styles.number}># {num}</div>
                    {photoUrl && <div className={styles.imageContainer}>
                        <Image className={styles.image} src={photoUrl} alt={name} height='300' width='300'/>
                    </div>}
                    {dateTime && price && name && <div className={styles.infoContainer}>
                        <div className={styles.title}>{capitalizeFirstLetter(name)}</div>
                        <div className={styles.amount}>Date and time: {dateTime}</div>
                        <div className={styles.total}>Total: {roundAmount(price)} $</div>
                    </div>}
                </div>
                <div className={canBeChanged ? styles.statusChangeable : styles.status}>
                    {canBeChanged ? (
                        <select className={styles.selectContainer} onChange={handleStatusChange}>
                        {statuses.map((status, key) => {
                            return <option className={styles.option} value={status} key={key}>{capitalizeFirstLetter(status)}</option>
                        })}
                        </select>
                    ) : (item.status)}
                </div>
                </>
            )}
        </div>
    );

};