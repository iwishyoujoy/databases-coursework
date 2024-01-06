import axios from "axios";

export const removeFromFavorite = (customer_id: number, item_id: number) => {
    return (dispatch) => {
        axios.delete(`http://localhost:3100/api/favorite/${customer_id}/${item_id}`)
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'REMOVE_FAVORITE_SUCCESS', payload: { customer_id, item_id } });
            } else {
                throw new Error('Failed to remove from favorites');
            }
        })
        .catch(error => {
            dispatch({ type: 'REMOVE_FAVORITE_FAILURE', payload: error.message });
        });
    };
};

export const deleteProductById = (id: number) => {
    return (dispatch) => {
        axios.delete(`http://localhost:3100/api/product/${id}`)
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: { id } });
            } else {
                throw new Error('Failed to remove from favorites');
            }
        })
        .catch(error => {
            dispatch({ type: 'DELETE_PRODUCT_FAILURE', payload: error.message });
        });
    };
};

export const deleteProcedureById = (id: number) => {
    return (dispatch) => {
        axios.delete(`http://localhost:3100/api/procedure/${id}`)
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'DELETE_PROCEDURE_SUCCESS', payload: { id } });
            } else {
                throw new Error('Failed to delete procedure');
            }
        })
        .catch(error => {
            dispatch({ type: 'DELETE_PROCEDURE_FAILURE', payload: error.message });
        });
    };
};

export const deleteItemFromOrder = (order_id: number, item_id: number) => {
    return (dispatch) => {
        return new Promise<void>((resolve, reject) => {
            axios.delete(`http://localhost:3100/api/item_in_order/${order_id}/${item_id}`)
            .then(response => {
                if (response.status === 200) {
                   dispatch({ type: 'DELETE_ITEM_FROM_ORDER_SUCCESS', payload: { order_id, item_id } });
                   resolve();
                } else {
                   reject(new Error('Failed to remove from favorites'));
                }
            })
            .catch(error => {
                dispatch({ type: 'DELETE_ITEM_FROM_ORDER_FAILURE', payload: error.message });
                reject(error);
            });
        });
    };
 };
 