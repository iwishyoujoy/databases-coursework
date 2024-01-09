import { OrderStatus } from "./types";
import axios from "axios";

export const updateItemInOrder = (order_id: number, item_id: number, current_amount: number, status: OrderStatus) => {
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
                   dispatch({ type: 'UPDATE_ITEM_IN_ORDER_SUCCESS', payload: response.data });
                   resolve();
                } else {
                   throw new Error('Failed to update item in order');
                }
            })
            .catch(error => {
                dispatch({ type: 'UPDATE_ITEM_IN_ORDER_FAILURE', payload: error.message });
                reject(error);
            });
        });
    };
 };

export const updateOrderStatus = (order_id: number, customer_id: number, customer_login: string, timestamp: string, status: OrderStatus) => {
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
                   dispatch({ type: 'UPDATE_ORDER_SUCCESS', payload: response.data });
                   resolve();
                } else {
                   throw new Error('Failed to update the order');
                }
            })
            .catch(error => {
                dispatch({ type: 'UPDATE_ORDER_FAILURE', payload: error.message });
                reject(error);
            });
        });
    };
};
