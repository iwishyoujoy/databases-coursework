import axios from "axios";

export const updateAmountForItemInOrder = (order_id: number, item_id: number, current_amount: number) => {
    return (dispatch) => {
        return new Promise<void>((resolve, reject) => {
            axios.put('http://localhost:3100/api/item_in_order/update/', { 
                order_id,
                item_id,
                current_amount
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
