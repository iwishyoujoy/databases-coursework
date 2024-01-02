'use client'

import { AppDispatch, RootState } from "../../redux/store";
import { IProductProps, addToFavorite, removeFromFavorite } from "../../components/CardContainer/CardContainerItem";
import { capitalizeFirstLetter, getItemsListLength } from "../../utils/text";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { DesktopWrapper } from "../../components/DesktopWrapper";
import Image from "next/image";
import axios from "axios";
import blackHeart from 'public/images/blackHeart.svg';
import cn from 'classnames';
import { getCustomerData } from "../../account/[id]/profile/page";
import { getFavoritesByCustomer } from "../../account/[id]/favorite/page";
import minus from 'public/images/minus.svg';
import minusDisabled from 'public/images/minusDisabled.svg';
import pinkHeart from 'public/images/heart.svg';
import plus from 'public/images/plus.svg';
import plusDisabled from 'public/images/plusDisabled.svg';
import styles from './styles.module.css';

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
    surname: string;
    name: string;
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

export async function getReviewsById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/review/item-id/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export const addReview = (customer_id, rating, content, item_id) => {
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

export const getAverageReviewRating = (reviews: IReviewProps[]): number => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    return totalRating / reviews.length;
};

export const displayRatingAsStars = (rating) => {
    const fullStar = '★';
    const emptyStar = '☆';
    const roundedRating = Math.round(rating);
    const fullStarsCount = roundedRating;
    const emptyStarsCount = 5 - fullStarsCount;

    return fullStar.repeat(fullStarsCount) + emptyStar.repeat(emptyStarsCount);     
};

const ReviewModal = ({ isOpen, onClose, customerId, id }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [ rating, setRating ] = useState();
    const [ content, setContent ] = useState();

    const handleSendReviewClick = () => {
        dispatch(addReview(customerId, rating, content, parseInt(id)));
        onClose();
    }

    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRating(parseInt(event.target.value));
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };
     
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>Write a review</h2>
                <input className={styles.modalInput} type="number" min="1" max="5" value={rating} onChange={handleRatingChange} placeholder="Rating out of 5"/>
                <textarea className={cn(styles.modalInput, styles.modalText)} value={content} onChange={handleContentChange} placeholder="Review..."/>
                <button className={styles.buttonInverted} onClick={handleSendReviewClick}>Submit</button>
            </div>
        </div>
    );
};

export default function Page({ params: { id } }: ClothesProps) {
    const loginState = useSelector((state: RootState) => state.login);

    const [ customerId, setCustomerId ] = useState();
    const dispatch = useDispatch<AppDispatch>();
    const [ product, setProduct ] = useState<IProductProps>();
    const [ category, setCategory ] = useState<IProductCategoryProps>();
    const [ seller, setSeller ] = useState<ISellerProps>();
    const [ reviews, setReviews ] = useState<IReviewProps[]>();

    const [ isWritingReview, setIsWritingReview ] = useState(false);
    const [ isAlreadyWrittenReview, setIsAlreadyWrittenReview ] = useState(false);

    const [count, setCount] = useState(1);

    const [isFavorite, setIsFavorite] = useState(false);

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

        getFavoritesByCustomer(loginState.login)
            .then(data => {
                const isCurrentProductFavorite = data.some(favorite => favorite.favoriteProductId.item_id == id);
                setIsFavorite(isCurrentProductFavorite);
            })
            .catch(error => console.error(error));

        if (reviews && customerId) {
            setIsAlreadyWrittenReview(reviews.some(review => review.customer_id === customerId));
        }
    }, [customerId, id, loginState.login, reviews, setIsAlreadyWrittenReview]);

    const toggleFavorite = () => {
        if (!loginState.isLogged){
            toast.error("You can not add this item to favorite! Please log in first!");
        }
        else {
            if (isFavorite) {
                dispatch(removeFromFavorite(customerId, product.id_item));
                setIsFavorite(false);
            } else {
                dispatch(addToFavorite(customerId, product.id_item));
                setIsFavorite(true);
            }
        }
    }

    const handleReviewClick = () => {
        if (!loginState.isLogged) {
            toast.error("You can not write a review! Please log in first!");
        }
        else if (isAlreadyWrittenReview){
            toast.error("You can not write a review! You\'ve already written a review for this item!", {
                icon: '✍️'
            });
        }
        else {
            setIsWritingReview(true);
        }
    }

    const increaseCount = () => {
        if (count < product.amount_available) {
            setCount(prevCount => prevCount + 1);
        }
    };

    const decreaseCount = () => {
        if (count > 1) {
            setCount(prevCount => prevCount - 1);
        }
    }

    return (
        <DesktopWrapper>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            {product && 
                <div className={styles.container}>
                    <div className={styles.topContainer}>
                        <div className={styles.leftContainer}>
                            <Image className={styles.image} src={product.photo_url} alt={product.description} height='300' width='300'/>
                        </div>
                        <div className={styles.rightContainer}>
                            <div className={styles.productContainer}>
                                <div className={styles.titleContainer}>
                                    <div className={styles.title}>{capitalizeFirstLetter(product.name)}</div>
                                    <div className={styles.avgReviewContainer}>
                                        <div className={styles.avgReview}>
                                            <div className={styles.avgRating}>
                                                {reviews && displayRatingAsStars(getAverageReviewRating(reviews))}
                                            </div>
                                            <div className={styles.numberOfReviews}>{reviews && getItemsListLength(reviews, 'review', 'reviews')}</div>
                                        </div>
                                        <Image className={styles.addtoFavorite} src={isFavorite ? blackHeart : pinkHeart} alt='Add to favorite' onClick={toggleFavorite}/>
                                    </div>
                                </div>
                                <div className={styles.addToCartContainer}>
                                    <div className={styles.buttonContainer}>
                                        <div className={styles.counterContainer}>
                                            <Image className={cn(styles.badge, count === 1 ? styles.badgeDisabled : styles.badgeEnabled)} src={count === 1 ? minusDisabled : minus} alt='Minus' onClick={decreaseCount}/>
                                            <div className={styles.counter}>{count}</div>
                                            <Image className={cn(styles.badge, count === product.amount_available ? styles.badgeDisabled : styles.badgeEnabled)} src={count === product.amount_available ? plusDisabled : plus} alt='Plus' onClick={increaseCount}/>
                                        </div>
                                        <button className={styles.button}>{`Add to cart - ${product.price * count} $`}</button>
                                    </div>
                                    <div className={styles.amountLeft}>{`${product.amount_available} ${product.amount_available === 1 ? 'piece' : 'pieces'} left`}</div>
                                </div>
                                <div className={styles.descriptionContainer}>
                                    <div className={styles.descriptionElement}>
                                        <div className={styles.header}>Description:</div>
                                        <div className={styles.text}>{product.description}</div>
                                    </div>
                                    {category && 
                                        <div className={styles.descriptionElement}>
                                            <div className={styles.header}>Category:</div>
                                            <div className={styles.text}>{capitalizeFirstLetter(category.name)}</div>
                                        </div>
                                    }
                                    {seller && 
                                        <div className={styles.descriptionElement}>
                                            <div className={styles.header}>Seller:</div>
                                            <div className={styles.text}>{seller.name}</div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={styles.reviewsContainer}>
                                <div className={styles.reviewsTitle}>Reviews</div>
                                <button className={styles.button} onClick={handleReviewClick} >Write a review</button>
                                {reviews && 
                                    reviews.map((review, key) => {
                                        return (
                                            <div className={styles.reviewContainer} key={key}>
                                                <div className={styles.rating}>
                                                    {displayRatingAsStars(review.rating)}
                                                    {review.customer_id === customerId && <div className={styles.myReview}>my review</div>}    
                                                </div>
                                                <div className={styles.text}>{review.content}</div>
                                                <div className={styles.author}>by {review.surname} {review.name}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>}
                {isWritingReview && <ReviewModal isOpen={isWritingReview} onClose={() => setIsWritingReview(false)}  customerId={customerId} id={id}/>}
        </DesktopWrapper>
    );
}