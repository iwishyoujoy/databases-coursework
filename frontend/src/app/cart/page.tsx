'use client'

import { IAppointmentProps, IItemProps, IOrderProps, IProcedureProps, IProductProps } from "../utils/types";
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
    const [ items, setItems ] = useState<IItemProps[]>([]);
    const [ order, setOrder ] = useState<IOrderProps>();
    const [ products, setProducts ] = useState<IProductProps[]>();
    const [ appointments, setAppointments ] = useState<IAppointmentProps[]>();
    const [ procedures, setProcedures ] = useState<IProcedureProps[]>();

    // const router = useRouter();

    useEffect(() => {
        getItemsFromOrder(cartState.orderId)
            .then((data) => {
                setItems(data);
            
                const promisesProducts = data.map((item) => {
                    if (item.type = 'product'){
                        return getProductById(item.id)
                            .then(itemData => {
                                return itemData;
                            })
                            .catch(error => console.error(error));
                    }
                });

                const promisesAppointments = data.map((item) => {
                    if (item.type = 'appointment'){
                        return getAppointmentById(item.id)
                            .then(itemData => {
                                return itemData;
                            })
                            .catch(error => console.error(error));
                    }
                });
 
                Promise.all(promisesProducts)
                   .then(products => {
                        console.log(products);
                       setProducts(products);
                   });
 
                Promise.all(promisesAppointments)
                   .then(appointments => {
                        console.log(appointments);
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
                            console.log(procedures);
                            setProcedures(procedures);
                        });
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
                {/* {items && (
                    items.map((item) => {
                        return (
                            <div className={styles.itemContainer}>
                                <div>
                                    <Image src={}/>
                                </div>
                            </div>
                        );
                    })
                )} */}
            </div>
            <div className={styles.rightContainer}>
                
            </div>
        </div>
    </DesktopWrapper>
    );
}