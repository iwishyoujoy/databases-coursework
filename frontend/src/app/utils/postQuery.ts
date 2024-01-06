import { OrderStatus } from "./types";
import axios from "axios";

export const addReview = (customer_id: number, rating: number, content: string, item_id: number) => {
    return (dispatch) => {
        axios.post('http://localhost:3100/api/review/create/', { customer_id, rating, content, item_id })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'ADD_REVIEW_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to add review');
            }
            })
        .catch(error => {
            dispatch({ type: 'ADD_REVIEW_FAILURE', payload: error.message });
        });
    };
};

export const addProduct = (name: string, price: number, description: string, photo_url: string, amount_available: number, seller_id: number, product_category_id: number) => {
    return (dispatch) => {
        axios.post('http://localhost:3100/api/product/create/', { 
            name,
            price,
            description,
            photo_url,
            amount_available,
            seller_id,
            product_category_id
         })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'ADD_PRODUCT_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to add new item');
            }
            })
        .catch(error => {
            dispatch({ type: 'ADD_PRODUCT_FAILURE', payload: error.message });
        });
    };
};

export const addProcedure = (photo_url: string, name: string, price: number, procedure_category_id: number, clinic_id: number,) => {
    return (dispatch) => {
        axios.post('http://localhost:3100/api/procedure/create/', { 
            photo_url,
            name,
            price,
            procedure_category_id,
            clinic_id
         })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'ADD_PROCEDURE_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to add new item');
            }
            })
        .catch(error => {
            dispatch({ type: 'ADD_PROCEDURE_FAILURE', payload: error.message });
        });
    };
};

export const addToFavorite = (customer_id: number, item_id: number) => {
    return (dispatch) => {
        axios.post('http://localhost:3100/api/favorite/create/', { 
            customer_id,
            item_id
         })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'ADD_FAVORITE_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to add item to favorite');
            }
        })
        .catch(error => {
            dispatch({ type: 'ADD_FAVORITE_FAILURE', payload: error.message });
        });
    };
};

export const createOrder = (customer_id: number, customer_login: string, timestamp: string, status: OrderStatus) => {
    return (dispatch) => {
        return new Promise<void>((resolve, reject) => {
            axios.post('http://localhost:3100/api/order/create/', { 
                customer_id,
                customer_login,
                timestamp,
                status
            })
            .then(response => {
                if (response.status === 200) {
                    dispatch({ type: 'CREATE_ORDER_SUCCESS', payload: response.data });
                    resolve();
                    } else {
                    throw new Error('Failed to create order');
                    }
            })
            .catch(error => {
                dispatch({ type: 'CREATE_ORDER_FAILURE', payload: error.message });
                reject(error);
            })
        });
    };
 };
 

export const addItemToCart = (order_id: number, item_id: number, current_amount: number, status: OrderStatus) => {
    return (dispatch) => {
        axios.post('http://localhost:3100/api/item_in_order/create/', { 
            order_id,
            item_id,
            current_amount,
            status
         })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'ADD_ITEM_TO_CART_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to add item to cart');
            }
            })
        .catch(error => {
            dispatch({ type: 'ADD_ITEM_TO_CART_FAILURE', payload: error.message });
        });
    };
};

export const addAppointment = (date_time: string, procedure_id: number, status: boolean) => {
    return (dispatch) => {
        axios.post('http://localhost:3100/api/appointment/create/', { 
            date_time,
            procedure_id,
            status
         })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'ADD_APPOINTMENT_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to add an appointment');
            }
            })
        .catch(error => {
            dispatch({ type: 'ADD_APPOINTMENT_FAILURE', payload: error.message });
        });
    };
};