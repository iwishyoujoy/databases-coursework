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