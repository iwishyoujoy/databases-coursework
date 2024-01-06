import { OrderStatus } from "./types";
import axios from "axios";

export const updateAmountForItemInOrder = (order_id: number, item_id: number, current_amount: number, status: OrderStatus) => {
    return (dispatch) => {
        return new Promise<void>((resolve, reject) => {
            axios.put('http://localhost:3100/api/item_in_order/update/', { 
                order_id,
                item_id,
                current_amount,
                status
            })
            .then(response => {
                if (response.status === 200) {
                   dispatch({ type: 'UPDATE_AMOUNT_SUCCESS', payload: response.data });
                   resolve();
                } else {
                   throw new Error('Failed to update amount');
                }
            })
            .catch(error => {
                dispatch({ type: 'UPDATE_AMOUNT_FAILURE', payload: error.message });
                reject(error);
            });
        });
    };
 };

export const placeOrderFromCart = (order_id: number, customer_id: number, customer_login: string, timestamp: string, status: OrderStatus) => {
    return (dispatch) => {
        return new Promise<void>((resolve, reject) => {
            axios.put(`http://localhost:3100/api/order/${order_id}`, { 
                order_id,
                customer_id,
                customer_login,
                timestamp,
                status
            })
            .then(response => {
                if (response.status === 200) {
                   dispatch({ type: 'PLACE_ORDER_SUCCESS', payload: response.data });
                   resolve();
                } else {
                   throw new Error('Failed to place and order');
                }
            })
            .catch(error => {
                dispatch({ type: 'PLACE_ORDER_FAILURE', payload: error.message });
                reject(error);
            });
        });
    };
};
