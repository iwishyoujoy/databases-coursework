import { capitalizeFirstLetter, roundAmount } from "../../utils/text";
import { getAppointmentById, getProcedureById, getProductById } from "../../utils/getQuery";
import { useEffect, useState } from "react";

import { IItemInOrderProps } from "../../utils/types";
import Image from "next/image";
import styles from './styles.module.css';

interface IItemInOrderCardProps {
    item: IItemInOrderProps;
    num: number;
}

export const ItemInOrderCard: React.FC<IItemInOrderCardProps> = (props) => {
    const { item, num } = props;
    const [ name, setName ] = useState<string>();
    const [ photoUrl, setPhotoUrl ] = useState<string>();
    const [ price, setPrice ] = useState<number>();
    const [ dateTime, setDateTime ] = useState<string>();

    useEffect(() => {
        if (item.type === 'product'){
            getProductById(item.item_id)
                .then((data) => {
                    console.log(data);
                    setName(data.name);
                    setPhotoUrl(data.photo_url);
                    setPrice(data.price);
                })
                .catch((error) => console.error(error));
        }
        else{
            getAppointmentById(item.item_id)
                .then((data) => {
                    setDateTime(data.date_time);
                    
                    getProcedureById(data.procedure_id)
                        .then((procedureData) => {
                            console.log(procedureData)
                            setName(procedureData.name);
                            setPhotoUrl(procedureData.photo_url);
                            setPrice(procedureData.price);
                        })
                })
        }
    }, [item.item_id, item.type]);

    return (
        <div className={styles.cardContainer}>
            {item.type === 'product' ? (
                <>
                <div className={styles.number}># {num}</div>
                {photoUrl && <div className={styles.imageContainer}>
                    <Image className={styles.image} src={photoUrl} alt={name} height='300' width='300'/>
                </div>}
                {price && name && <div className={styles.infoContainer}>
                    <div className={styles.title}>{capitalizeFirstLetter(name)}</div>
                    <div className={styles.amount}>Amount: {item.current_amount}</div>
                    <div className={styles.total}>Total: {roundAmount(item.current_amount * price)} $</div>
                </div>}
                <div className={styles.status}>{item.status}</div>
                </>
            ) : (
                <>
                <div className={styles.number}># {num}</div>
                {photoUrl && <div className={styles.imageContainer}>
                    <Image className={styles.image} src={photoUrl} alt={name} height='300' width='300'/>
                </div>}
                {dateTime && price && name && <div className={styles.infoContainer}>
                    <div className={styles.title}>{capitalizeFirstLetter(name)}</div>
                    <div className={styles.amount}>Date and time: {dateTime}</div>
                    <div className={styles.total}>Total: {roundAmount(price)} $</div>
                </div>}
                <div className={styles.status}>{item.status}</div>
                </>
            )}
        </div>
    );

};