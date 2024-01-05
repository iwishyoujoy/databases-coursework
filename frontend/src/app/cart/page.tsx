'use client'

import { AppDispatch, RootState } from "../redux/store";
import { IAppointmentProps, IItemInOrderProps, IOrderProps, IProcedureProps, IProductWithAmountProps } from "../utils/types";
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, getItemsListLength, getItemsListLengthOnlyLength, roundAmount } from "../utils/text";
import { getAppointmentById, getCheckForOrder, getItemsFromOrder, getOrderById, getProcedureById, getProductById } from "../utils/getQuery";
import { useDispatch, useSelector } from "react-redux";

import { DesktopWrapper } from "../components/DesktopWrapper";
import Image from 'next/image';
import Link from "next/link";
import cn from 'classnames';
import { deleteItemFromOrder } from "../utils/deleteQuery";
import minus from 'public/images/minus.svg';
import minusDisabled from 'public/images/minusDisabled.svg';
import plus from 'public/images/plus.svg';
import plusDisabled from 'public/images/plusDisabled.svg';
import styles from './styles.module.css';
import trash from 'public/images/trash.svg';
import { updateAmountForItemInOrder } from "../utils/putQuery";
import { useRouter } from "next/navigation";

export default function Page() {  
    const loginState = useSelector((state: RootState) => state.login);
    const cartState = useSelector((state: RootState) => state.cart);

    const dispatch = useDispatch<AppDispatch>();

    const [ items, setItems ] = useState<IItemInOrderProps[]>([]);
    const [ order, setOrder ] = useState<IOrderProps>();
    const [ products, setProducts ] = useState<IProductWithAmountProps[]>();
    const [ appointments, setAppointments ] = useState<IAppointmentProps[]>();
    const [ procedures, setProcedures ] = useState<IProcedureProps[]>();
    const [ amount, setAmount ] = useState<number>(0);
    const [ countItems, setCountItems ] = useState<number>(10);

    // const router = useRouter();

    useEffect(() => {
        if (loginState.isLogged){
            const fetchAndSetData = async () => {
                try {
                    const data = await getItemsFromOrder(cartState.orderId);
                    setItems(data);
    
                    const promisesProducts = data.filter(item => item.type === 'product').map(item => {
                        return getProductById(item.item_id)
                            .then(itemData => {
                                const correspondingItem = data.find(i => i.item_id === itemData.id_item);
                                if (correspondingItem) {
                                    return {...itemData, amount: correspondingItem.current_amount};
                                } else {
                                    throw new Error(`No corresponding item found for product ${itemData.id_item}`);
                                }
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
                                console.log(products);
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
    
                } catch (error) {
                    console.log(error);
                }
            };
    
            fetchAndSetData();
    
            getOrderById(cartState.orderId)
                .then((data) => {
                    setOrder(data);
                })
                .catch(error => console.log(error));
    
            getCheckForOrder(cartState.orderId)
                .then(data => {
                    setAmount(data);
                })
                .catch(error => console.error(error));
        }
        
    }, [cartState.orderId, countItems, loginState.isLogged]);

    function sumAmounts(products: IProductWithAmountProps[]): number {
        return products.reduce((sum, product) => sum + product.amount, 0);
    }
    
    const handleDeleteFromCartClick = (id: number) => {
        dispatch(deleteItemFromOrder(cartState.orderId, id))
            .then(() => {
                setCountItems(countItems - 1);
            })
    }

    const increaseCount = (product: IProductWithAmountProps, count: number) => {
        if (product.amount_available > 0) {
            dispatch(updateAmountForItemInOrder(cartState.orderId, product.id_item, count + 1))
                .then(() => {
                    setCountItems(countItems + 1);
                })
        }
    };

    const decreaseCount = (product: IProductWithAmountProps, count: number) => {
        if (count > 1) {
            dispatch(updateAmountForItemInOrder(cartState.orderId, product.id_item, count - 1))
                .then(() => {
                    setCountItems(countItems - 1);
                })
        }
    }
     
    return (
        <DesktopWrapper>
        <div className={styles.title}>Cart</div>
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                {amount === 0 ? (
                    <div className={styles.placeholder}>
                        <h1 className={styles.placeholderTitle}>Nothing in here</h1>
                        You either haven't logged in, or you haven't added anything to the cart
                    </div>
                ) : (
                    <>
                    {products && 
                        <>
                        <div className={styles.productsTitle}>Products</div>
                        <div className={styles.productsContainer}>
                            {products.map((product, key) => {
                            return (
                                <div className={styles.productContainer} key={key}>
                                    <div className={styles.productNumber}># {key + 1}</div>
                                    <Link href={`http://localhost:3000/products/${product.id_item}`}>
                                        <Image className={styles.productImage} src={product.photo_url} alt={product.description} height='300' width='300'/>
                                    </Link>
                                    <div className={styles.productTitle}>{capitalizeFirstLetter(product.name)}</div>
                                    <div className={styles.amountContainer}>
                                        <Image className={cn(styles.badge)} src={product.amount === 1 ? minusDisabled : minus} onClick={() => decreaseCount(product, product.amount)} alt='Minus' />
                                            <div className={styles.counter}>{product.amount}</div>
                                        <Image className={cn(styles.badge)} src={product.amount_available === 0 ? plusDisabled : plus} onClick={() => increaseCount(product, product.amount)} alt='Plus' />
                                    </div>
                                    <div className={styles.lastContainer}>
                                        <Image className={styles.deleteButton} onClick={() => handleDeleteFromCartClick(product.id_item)} src={trash} alt='Delete' />
                                        <div className={styles.productPrice}>{product.price} $</div>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                        </>
                    }
                    {procedures && 
                        <>
                        <div className={styles.producedureTitle}>Procedures</div>
                        <div className={styles.productsContainer}>
                            {procedures.map((procedure, key) => {
                            return (
                                <div className={styles.productContainer} key={key}>
                                    <div className={styles.productNumber}># {key + 1}</div>
                                    <Link href={`http://localhost:3000/procedures/${procedure.id}`}>
                                        <Image className={styles.productImage} src={procedure.photo_url} alt={procedure.name} height='300' width='300'/>
                                    </Link>
                                    <div className={styles.productTitle}>{capitalizeFirstLetter(procedure.name)}</div>
                                    <div className={styles.appointmentTime}>{appointments[key].date_time}</div>
                                    <div className={styles.lastContainer}>
                                        <Image className={styles.deleteButton} src={trash} onClick={() => handleDeleteFromCartClick(appointments[key].item_id)} alt='Delete' />
                                        <div className={styles.productPrice}>{procedure.price} $</div>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                        </> 
                    }
                    </>
                )}
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.cartTitle}>Order total</div>
                <div className={styles.cartList}>
                    <div>Products</div>
                    <div>{products ? getItemsListLengthOnlyLength(sumAmounts(products), 'piece', 'pieces') : '0 pieces'}</div>
                </div>
                <div className={styles.cartList}>
                    <div>Procedures</div>
                    <div>{procedures ? getItemsListLength(procedures, 'appointment', 'appointments') : '0 appointments'}</div>
                </div>
                <div className={styles.cartTotal}>
                    <div className={styles.cartTotalTitle}>Total</div>
                    <div className={styles.cartTotalAmount}>{amount !== 0 ? roundAmount(amount) : '0'} $</div>
                </div>
                <button className={styles.button}>{`Place an order`}</button>
            </div>
        </div>
    </DesktopWrapper>
    );
}