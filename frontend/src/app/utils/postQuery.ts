import axios from "axios";

export const addReview = (customer_id: number, rating: number, content: string, item_id: number) => {
    console.log(customer_id, rating, content, item_id);

    return (dispatch) => {
        axios.post('http://localhost:3100/api/review/create/', { customer_id, rating, content, item_id })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'ADD_REVIEW_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to sign in');
            }
            })
        .catch(error => {
            dispatch({ type: 'ADD_REVIEW_FAILURE', payload: error.message });
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
                throw new Error('Failed to sign up');
            }
        })
        .catch(error => {
            dispatch({ type: 'ADD_FAVORITE_FAILURE', payload: error.message });
        });
    };
};