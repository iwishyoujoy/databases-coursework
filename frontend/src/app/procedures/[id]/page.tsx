'use client'

import { AppDispatch, RootState } from "../../redux/store";
import { IProcedureProps, IProductProps } from "../../components/CardContainer/CardContainerItem";
import { IReviewProps, addReview, displayRatingAsStars, getAverageReviewRating, getReviewsById } from "../../products/[id]/page";
import { capitalizeFirstLetter, getItemsListLength } from "../../utils/text";
import toast, { Toaster } from 'react-hot-toast';
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DesktopWrapper } from "../../components/DesktopWrapper";
import Image from "next/image";
import addToCart from 'public/images/cart.svg';
import axios from "axios";
import cn from 'classnames';
import { getCustomerData } from "../../account/[id]/profile/page";
import heart from 'public/images/heart.svg';
import styles from './styles.module.css';

interface ClothesProps{
    params: {
        id: string;
    }
}

export interface IProcedureCategoryProps {
    id: number;
    name: string;
    description: string;
}

export interface IClinicProps {
    id: number;
    name: string;
    email: string;
    contact: string;
    login: string;
    password: string;
}

export interface IAppointmentProps {
    item_id: number;
    date_time: string;
    procedure_id: number;
    status: boolean;
}

export async function getProcedureById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedure/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getCategoryById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedureCategory/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getClinicById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/clinic/id/${id}`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getAppointmentsById(id): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedure/${id}/appointments`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
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
                {appointments && <select className={cn(styles.selectModalContainer, styles.selectContainer)} onChange={(e) => setId(e.target.value)}>
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

export default function Page({ params: { id } }: ClothesProps) {
    const loginState = useSelector((state: RootState) => state.login);
    const [ customerId, setCustomerId ] = useState();
    const dispatch = useDispatch<AppDispatch>();
    const [ procedure, setProcedure ] = useState<IProcedureProps>();
    const [ category, setCategory ] = useState<IProcedureCategoryProps>();
    const [ clinic, setClinic ] = useState<IClinicProps>();
    const [ appointments, setAppointments ] = useState<IAppointmentProps[]>([]);
    const [ reviews, setReviews ] = useState<IReviewProps[]>();

    const [ isWritingReview, setIsWritingReview ] = useState(false);

    useEffect(() => {
        getProcedureById(id)
            .then(data => {
                setProcedure(data);
                getCategoryById(data.procedure_category_id)
                    .then(data => {
                        setCategory(data);
                    })
                    .catch(error => console.error(error));
                    
                getClinicById(data.clinic_id)
                    .then(data => {
                        setClinic(data);
                    })
                    .catch(error => console.error(error));
                
                getAppointmentsById(data.id)
                    .then(data => {
                        setAppointments(data);
                        const reviewsPromises = data.map(appointment => getReviewsById(appointment.item_id));

                        Promise.all(reviewsPromises)
                            .then(reviewsArrays => {
                                const allReviews = [].concat(...reviewsArrays);
                                setReviews(allReviews);
                            })
                            .catch(error => console.error(error));
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

    const handleReviewClick = () => {
        if (!loginState.isLogged) {
            toast.error("You can not write a review! Please log in first!");
        }
        // else if (isAlreadyWrittenReview){
        //     toast.error("You can not write a review! You\'ve already written a review for this item!", {
        //         icon: '✍️'
        //     });
        // }
        else {
            setIsWritingReview(true);
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
                                            <div className={styles.numberOfReviews}>{reviews && getItemsListLength(reviews, 'review', 'reviews')}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.addToCartContainer}>
                                    <div className={styles.buttonContainer}>
                                        {appointments && <select className={styles.selectContainer}>
                                            {appointments.map((appointment, key) => {
                                                return <option className={styles.option} key={key}>{appointment.date_time}</option>
                                            })}
                                        </select>}
                                        <button className={styles.button}>{`Add to cart - ${procedure.price} $`}</button>
                                    </div>
                                    {appointments && <div className={styles.amountLeft}>{`${appointments.length} ${appointments.length === 1 ? 'appointment' : 'appointments'} available`}</div>}
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
                                                    {/* {review.customer_id === customerId && <div className={styles.myReview}>my review</div>}     */}
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