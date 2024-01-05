'use client'

import { IAppointmentProps, IItemInOrderProps, IOrderProps, IProcedureProps, IProductProps } from "../utils/types";
import React, { useEffect, useState } from "react";
import { getAppointmentById, getItemsFromOrder, getOrderById, getProcedureById, getProductById } from "../utils/getQuery";

import { DesktopWrapper } from "../components/DesktopWrapper";
import { RootState } from "../redux/store";
import styles from './styles.module.css';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Page() {  
    const loginState = useSelector((state: RootState) => state.login);
    const cartState = useSelector((state: RootState) => state.cart);
    const [ items, setItems ] = useState<IItemInOrderProps[]>([]);
    const [ order, setOrder ] = useState<IOrderProps>();
    const [ products, setProducts ] = useState<IProductProps[]>();
    const [ appointments, setAppointments ] = useState<IAppointmentProps[]>();
    const [ procedures, setProcedures ] = useState<IProcedureProps[]>();

    // const router = useRouter();

    useEffect(() => {
        getItemsFromOrder(cartState.orderId)
            .then((data) => {
                setItems(data);
            
                const promisesProducts = data.filter(item => item.type === 'product').map(item => {
                    return getProductById(item.item_id)
                       .then(itemData => {
                           return itemData;
                       })
                       .catch(error => console.error(error));
                });
     
                const promisesAppointments = data.filter(item => item.type === 'appointment').map(item => {
                    return getAppointmentById(item.item_id)
                       .then(itemData => {
                           return itemData;
                       })
                       .catch(error => console.error(error));
                });
 
                Promise.all(promisesProducts)
                   .then(products => {
                        if (products.length){
                            setProducts(products);
                        }
                   });
 
                Promise.all(promisesAppointments)
                   .then(appointments => {
                        if (appointments){
                            setAppointments(appointments);

                            const promisesProcedures = appointments.map((appointment) => {
                                return getProcedureById(appointment.procedure_id)
                                    .then(itemData => {
                                        return itemData;
                                    })
                                    .catch(error => console.error(error));
                            });
            
                            Promise.all(promisesProcedures)
                            .then(procedures => {
                                setProcedures(procedures);
                            });
                        }
                    });
            })
            .catch(error => console.log(error));

        getOrderById(cartState.orderId)
            .then((data) => {
                setOrder(data);
            })
            .catch(error => console.log(error));
    }, [cartState.orderId]);
     
    return (
        <DesktopWrapper>
        <div className={styles.title}>Cart</div>
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                
            </div>
            <div className={styles.rightContainer}>
                
            </div>
        </div>
    </DesktopWrapper>
    );
}