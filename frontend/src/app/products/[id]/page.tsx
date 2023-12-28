'use client'

import Image from "next/image";
import styles from './styles.module.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { IProductProps } from "../../components/CardContainer/CardContainerItem";
import addToCart from 'public/images/cart.svg';
import heart from 'public/images/heart.svg';
import { capitalizeFirstLetter, getItemsListLength } from "../../utils/text";
import { DesktopWrapper } from "../../components/DesktopWrapper";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerData } from "../../account/[id]/profile/page";

interface ClothesProps{
    params: {
        id: string;
    }
}

export interface IProductCategoryProps {
    id: number;
    name: string;
    description: string;
}

export interface ISellerProps {
    id: number;
    name: string;
    email: string;
    contact: string;
    login: string;
    password: string;
}

export interface IReviewProps {
    id: number;
    customer_id: number;
    rating: number;
    content: string;
    item_id: number;
}

export async function getProductById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/product/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getCategoryById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/productCategory/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getSellerById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/seller/id/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getReviewsById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/review/item-id/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

const addReview = (customer_id, rating, content, item_id) => {
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

const addItemToOrder = (customer_id, rating, content, item_id) => {
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

const createOrder = (customer_id, timestamp, status) => {
    return (dispatch) => {
        axios.post('http://localhost:3100/api/order/create/', { customer_id, timestamp, status })
        .then(response => {
            if (response.status === 200) {
                dispatch({ type: 'ADD_ORDER_SUCCESS', payload: response.data });
            } else {
                throw new Error('Failed to sign in');
            }
            })
        .catch(error => {
            dispatch({ type: 'ADD_ORDER_FAILURE', payload: error.message });
        });
    };
};

export default function Page({ params: { id } }: ClothesProps) {
    const loginState = useSelector((state: RootState) => state.login);
    const cartState = useSelector((state: RootState) => state.cart);

    const [ customerId, setCustomerId ] = useState();
    const dispatch = useDispatch<AppDispatch>();
    const [ product, setProduct ] = useState<IProductProps>();
    const [ category, setCategory ] = useState<IProductCategoryProps>();
    const [ seller, setSeller ] = useState<ISellerProps>();
    const [ reviews, setReviews ] = useState<IReviewProps[]>();

    const [ isWritingReview, setIsWritingReview ] = useState(false);
    const [ rating, setRating ] = useState();
    const [ content, setContent ] = useState();

    useEffect(() => {
        getProductById(id)
            .then(data => {
                setProduct(data);
                getCategoryById(data.product_category_id)
                    .then(data => {
                        setCategory(data);
                    })
                    .catch(error => console.error(error));
                    
                getSellerById(data.seller_id)
                    .then(data => {
                        setSeller(data);
                    })
                    .catch(error => console.error(error));
                
                getReviewsById(data.id_item)
                    .then(data => {
                        setReviews(data);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
        getCustomerData(loginState.login)
            .then(data => {
                setCustomerId(data.id);
            })
            .catch(error => console.error(error));
        }, [id, loginState.login]);

    const handleWriteReviewClick = () => {
        setIsWritingReview(!isWritingReview);
    }

    const handleSendReviewClick = () => {
        dispatch(addReview(customerId, rating, content, id));
        setIsWritingReview(false);
    }

    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRating(event.target.value);
        console.log(rating);
    };
    const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
        console.log(content);
    };

    const handleAddToCartClick = () => {
        if (!cartState.orderId){
            createOrder
        }
    }

    return (
        <DesktopWrapper>
            {product && 
                <div className={styles.container}>
                    <div className={styles.mainContainer}>
                        <Image className={styles.image} height='300' width='300' src={product.photo_url} alt={product.description}/>
                        <div className={styles.info}>
                            <div className={styles.infoContainer}>
                                <div className={styles.title}>{capitalizeFirstLetter(product.name)}</div>
                                <div className={styles.actonContainer}>
                                    <div className={styles.price}>{product.price} $</div>
                                    <Image className={styles.badge} src={heart} alt='Add to favorite'/>
                                    <button className={styles.button} onClick={handleAddToCartClick}>Add to cart</button>
                                </div>
                                    <div className={styles.aboutContainer}>
                                        <div className={styles.about}>
                                            <div className={styles.header}>Details: </div>
                                            <div className={styles.text}>{product.description}</div>
                                        </div>
                                        {category && 
                                            <div className={styles.about}>
                                                <div className={styles.header}>Category: </div>
                                                <div className={styles.text}>{capitalizeFirstLetter(category.name)}</div>
                                            </div>
                                        }
                                        {seller && 
                                            <div className={styles.about}>
                                                <div className={styles.header}>Seller: </div>
                                                <div className={styles.text}>{seller.name}</div>
                                            </div>
                                        }
                                    </div> 
                            </div>
                            {reviews && <div className={styles.counter}>{getItemsListLength(reviews, 'review', 'reviews')}</div>}
                            <div className={styles.reviewContainer}>
                                {reviews && reviews.map((review, key) => {
                                    return (
                                        <div className={styles.review} key={key}>
                                            <div className={styles.rating}>{review.rating} / 5</div>
                                            <div className={styles.content}>{review.content}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button className={styles.buttonReview} onClick={handleWriteReviewClick}>Write a review</button>
                            {isWritingReview  && 
                                <div className={styles.reviewInputContainer}>
                                    <input className={styles.input} type='text' placeholder='Rating (out of 5)' value={rating} onChange={handleRatingChange}/>
                                    <textarea className={styles.inputBigger} type='text' placeholder='Write whatever you think!' value={content} onChange={handleContentChange}></textarea>
                                    <button className={styles.buttonSend} onClick={handleSendReviewClick}>Send</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>}
        </DesktopWrapper>
    )
}