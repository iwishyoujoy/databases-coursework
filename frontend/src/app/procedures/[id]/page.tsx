'use client'

import { AppDispatch, RootState } from "../../redux/store";
import { IAppointmentProps, ICategoryProps, IProcedureProps, IReviewProps, ISellerOrClinicProps } from "../../utils/types";
import { addItemToCart, addReview } from "../../utils/postQuery";
import { capitalizeFirstLetter, getItemsListLength, roundAmount } from "../../utils/text";
import { displayRatingAsStars, getAverageReviewRating } from "../../utils/review";
import { getAppointmentsByProcedureId, getCategoryById, getCustomerData, getProcedureById, getReviewsById, getSellerOrClinicById } from "../../utils/getQuery";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { DesktopWrapper } from "../../components/DesktopWrapper";
import Image from "next/image";
import cn from 'classnames';
import styles from './styles.module.css';

interface ProcedureProps{
    params: {
        id: number;
    }
}

const ReviewModal = ({ isOpen, onClose, customerId, appointments }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [ rating, setRating ] = useState();
    const [ content, setContent ] = useState();
    const [ id, setId ] = useState();

    useEffect(() => {
        setId(appointments[0].item_id);
    }, [appointments]);

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
                <div className={styles.modalInputLabel}>Select appointment to write review on:</div>
                {appointments && <select className={styles.selectModalContainer} onChange={(e) => setId(e.target.value)}>
                    {appointments.map((appointment, key) => {
                        return <option className={styles.optionModal} value={appointment.item_id} key={key}>{appointment.date_time}</option>
                    })}
                </select>}
                <input className={styles.modalInput} type="number" min="1" max="5" value={rating} onChange={handleRatingChange} placeholder="Rating out of 5"/>
                <textarea className={cn(styles.modalInput, styles.modalText)} value={content} onChange={handleContentChange} placeholder="Review..."/>
                <button className={styles.buttonInverted} onClick={handleSendReviewClick}>Submit</button>
            </div>
        </div>
    );
};

export default function Page({ params: { id } }: ProcedureProps) {
    const loginState = useSelector((state: RootState) => state.login);
    const cartState = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch<AppDispatch>();

    const [ customerId, setCustomerId ] = useState();
    const [ procedure, setProcedure ] = useState<IProcedureProps>();
    const [ category, setCategory ] = useState<ICategoryProps>();
    const [ clinic, setClinic ] = useState<ISellerOrClinicProps>();
    const [ appointments, setAppointments ] = useState<IAppointmentProps[]>([]);
    const [ appointmentId, setAppointmentId ] = useState<number>();
    const [ reviews, setReviews ] = useState<IReviewProps[]>();

    const [ isWritingReview, setIsWritingReview ] = useState(false);
    const [ isAlreadyWrittenReview, setIsAlreadyWrittenReview ] = useState(false);

    useEffect(() => {
        getProcedureById(id)
            .then(data => {
                setProcedure(data);
                getCategoryById(data.procedure_category_id, 'procedure')
                    .then(data => {
                        setCategory(data);
                    })
                    .catch(error => console.error(error));
                    
                getSellerOrClinicById(data.clinic_id, 'clinic')
                    .then(data => {
                        setClinic(data);
                    })
                    .catch(error => console.error(error));
                
                getAppointmentsByProcedureId(data.id)
                    .then(data => {
                        setAppointments(data);
                        if (data.length > 0){
                            setAppointmentId(data[0].item_id);
                            const reviewsPromises = data.map(appointment => getReviewsById(appointment.item_id));

                            Promise.all(reviewsPromises)
                                .then(reviewsArrays => {
                                    const allReviews = [].concat(...reviewsArrays);
                                    setReviews(allReviews);
                                })
                                .catch(error => console.error(error));
                        
                        }})                        
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));

        if (loginState.isLogged){
            getCustomerData(loginState.login)
                .then(data => {
                    setCustomerId(data.id);
                })
                .catch(error => console.error(error));
        
            if (reviews && customerId) {
                setIsAlreadyWrittenReview(reviews.some(review => review.customer_id === customerId));
            }
        }
        }, [customerId, id, loginState.isLogged, loginState.login, reviews, isWritingReview]);

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

    const handleAddToCartClick = () => {
        if (!loginState.isLogged){
            toast.error("You can not add item to cart! Please log in first");
        }
        else {
            dispatch(addItemToCart(cartState.orderId, appointmentId, 1, 'Starting to Sparkle'));
        }
    }

    return (
        <DesktopWrapper>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
            {procedure && 
                <div className={styles.container}>
                    <div className={styles.topContainer}>
                        <div className={styles.leftContainer}>
                            <Image className={styles.image} src={procedure.photo_url} alt={procedure.name} height='300' width='300'/>
                        </div>
                        <div className={styles.rightContainer}>
                            <div className={styles.productContainer}>
                                <div className={styles.titleContainer}>
                                    <div className={styles.title}>{capitalizeFirstLetter(procedure.name)}</div>
                                    <div className={styles.avgReviewContainer}>
                                        <div className={styles.avgReview}>
                                            <div className={styles.avgRating}>
                                                {reviews && displayRatingAsStars(getAverageReviewRating(reviews))}
                                            </div>
                                            <div className={styles.numberOfReviews}>{
                                                appointments.length > 0 ?
                                                (reviews && getItemsListLength(reviews, 'review', 'reviews')) : ("0 reviews")
                                            }</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.addToCartContainer}>
                                    <div className={styles.buttonContainer}>
                                        {appointments.filter(appointment => !appointment.status).length > 0 ? (
                                            <>
                                                {appointments && <select className={styles.selectContainer} onChange={(e) => setAppointmentId(e.target.value)}>
                                                    {appointments.filter(appointment => !appointment.status).map((appointment, key) => {
                                                        return <option className={styles.option} value={appointment.item_id} key={key}>{appointment.date_time}</option>
                                                    })}
                                                </select>}
                                            </>
                                        ) : (
                                            <select className={styles.selectContainer}>
                                                <option className={styles.option}>Nothing available</option>
                                            </select>
                                        )}
                                        <button className={styles.button} onClick={handleAddToCartClick}>{`Add to cart - ${roundAmount(procedure.price)} $`}</button>
                                    </div>
                                    {appointments && <div className={styles.amountLeft}>{`${appointments.filter(appointment => !appointment.status).length} ${appointments.filter(appointment => !appointment.status).length === 1 ? 'appointment' : 'appointments'} available`}</div>}
                                </div>
                                <div className={styles.descriptionContainer}>
                                    {category && 
                                        <div className={styles.descriptionElement}>
                                            <div className={styles.header}>Category:</div>
                                            <div className={styles.text}>{capitalizeFirstLetter(category.name)}</div>
                                        </div>
                                    }
                                    {clinic && 
                                        <div className={styles.descriptionElement}>
                                            <div className={styles.header}>Clinic:</div>
                                            <div className={styles.text}>{clinic.name}</div>
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
                {isWritingReview && <ReviewModal appointments={appointments} isOpen={isWritingReview} onClose={() => setIsWritingReview(false)}  customerId={customerId} id={id}/>}
        </DesktopWrapper>
    );
}