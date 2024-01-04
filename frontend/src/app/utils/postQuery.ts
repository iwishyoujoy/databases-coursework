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