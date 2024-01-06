'use client'

import { AppDispatch, RootState, setIsLoggedBusiness } from "../../../redux/store";
import { ICategoryProps, IProcedureProps } from "../../../utils/types";
import React, { useEffect, useState } from "react";
import { addAppointment, addProcedure } from "../../../utils/postQuery";
import { capitalizeFirstLetter, getItemsListLength } from "../../../utils/text";
import { getAllCategories, getFavoritesByCustomer, getProceduresByClinicId } from "../../../utils/getQuery";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "../../../components/CardContainer/CardContainerItem";
import { DesktopWrapper } from "../../../components/DesktopWrapper";
import Link from "next/link";
import cn from 'classnames';
import styles from './styles.module.css';
import { useRouter } from "next/navigation";

interface AccountProps{
    params: {
        login: string;
    }
}

const NewProcedureModal = ({ isOpen, onClose, id }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [ name, setName ] = useState();
    const [ price, setPrice ] = useState();
    const [ photoUrl, setPhotoUrl ] = useState();
    const [ categories, setCategories ] = useState<ICategoryProps[]>([]);
    const [ categoryId, setCategoryId ] = useState();

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handlePriceChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrice(parseFloat(event.target.value));
    };
    const handlePhotoUrlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPhotoUrl(event.target.value);
    };

    const handleSubmitClick = () => {
        console.log(photoUrl, name, price, categoryId, id)
        dispatch(addProcedure(photoUrl, name, price, categoryId, id));
        onClose();
    }

    useEffect(() => {
        getAllCategories('procedureCategory')
            .then(data => {
                setCategories(data);
                setCategoryId(data[0].id);
            })
            .catch(error => console.error(error));
    }, []);
     
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>Add new product</h2>
                <input className={styles.modalInput} type="text" value={name} onChange={handleNameChange} placeholder="Name"/>
                <input className={styles.modalInput} type="number" min="1" value={price} onChange={handlePriceChange} placeholder="Price"/>
                <div className={styles.modalInputDescriptionPink}>Choose category for the product:</div>
                {categories && <select className={cn(styles.selectModalContainer, styles.selectContainer)} onChange={(e) => setCategoryId(e.target.value)}>
                    {categories.map((category, key) => {
                        return <option className={styles.optionModal} value={category.id} key={key}>{capitalizeFirstLetter(category.name)}</option>
                    })}
                </select>}
                <div className={styles.modalInputDescription}>URL should starts with https://i.pinimg.com</div>
                <textarea className={cn(styles.modalInput, styles.modalText)} value={photoUrl} onChange={handlePhotoUrlChange} placeholder="URL for photo"/>
                <div className={styles.modalWarning}>Make sure you checked everything twice! <br /> You can't undo this action</div>
                <button className={styles.buttonInverted} onClick={handleSubmitClick}>Submit</button>
            </div>
        </div>
    );
};

const AddAppointmentsModal = ({ isOpen, onClose, id, procedures }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [dates, setDates] = useState([{ date_time: '' }]);
    const [ procedureId, setProcedureId ] = useState<number>(procedures[0].id);

    const handleChange = (i, event) => {
        const values = [...dates];
        values[i].date_time = event.target.value;
        setDates(values);
    };
   
    const handleAddFields = () => {
        const values = [...dates];
        values.push({ date_time: '' });
        setDates(values);
    };
   
    const handleSubmit = (event) => {
        event.preventDefault();
      
        dates.forEach((date) => {
            const formattedDateTime = new Date(date.date_time).toISOString().replace('T', ' ').substring(0, 19);
            dispatch(addAppointment(formattedDateTime, procedureId, false));
        })
        onClose();
    };
   
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>Add appointments</h2>
                {procedures && <select className={cn(styles.selectModalContainer, styles.selectContainer)} onChange={(e) => setProcedureId(e.target.value)}>
                    {procedures.map((procedure, key) => {
                        return <option className={styles.optionModal} value={procedure.id} key={key}>{capitalizeFirstLetter(procedure.name)}</option>
                    })}
                </select>}
                <div className={styles.modalInputDescriptionPink}>You can add as many appointments as you want:</div>
                <form className={styles.modalDateInputContainer} onSubmit={handleSubmit}>
                    {dates.map((date, idx) => {
                    return (
                        <input
                            className={styles.modalInput}
                            type="datetime-local"
                            value={date.date_time}
                            key={idx}
                            onChange={(event) => handleChange(idx, event)}
                        />
                    );
                    })}
                    <button className={styles.modalButtonAdd} type="button" onClick={handleAddFields}>Add one more appointment</button>
                    <button className={styles.buttonInverted} type="submit">Submit</button>
                </form>
            </div>
        </div>
        
    );
};

export default function Page({ params: { login } }: AccountProps) {
    const businessState = useSelector((state: RootState) => state.business);
    
    const [ isAddingNewProcedure, setIsAddingNewProcedure ] = useState(false);
    const [ isAddingAppointments, setIsAddingAppointments ] = useState(false);
    const [ procedures, setProcedures ] = useState<IProcedureProps[]>([]);

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        getProceduresByClinicId(businessState.id)
            .then(data => {
                setProcedures(data);
            })
            .catch(error => console.error(error));
    }, [businessState.id, isAddingNewProcedure, isAddingAppointments]);

    const handleLogOutClick = () => {
        dispatch(setIsLoggedBusiness(false));
        router.push(`/business/`);
    }

    return(
        <DesktopWrapper>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Link className={styles.link} href={`/business/${login}/profile`}>Profile</Link>
                    <Link className={cn(styles.link, styles.selected)} href={`/business/${login}/procedures`}>Procedures</Link>
                    <Link className={styles.link} href={`/business/${login}/orders`}>Orders</Link>
                    <button className={styles.logOutButton} onClick={handleLogOutClick}>Log out</button>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.counter}>{getItemsListLength(procedures, 'procedure', 'procedures')}</div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.button} onClick={() => setIsAddingAppointments(true)}>Add appointments</button>
                        <button className={styles.button} onClick={() => setIsAddingNewProcedure(true)}>Add new procedure</button>
                    </div>
                    {!procedures.length && 
                        <div className={styles.placeholderContainer}>
                            <h1 className={styles.placeholderTitle}>Let's start!</h1>
                            You can add your first procedure by clicking button at the top right corner
                        </div>
                    }
                    <div className={styles.favoriteContainer}>
                        {procedures.map((procedure, key) => {
                            return (
                            <Card item={procedure} canBeDeleted={true} isProduct={false} key={key}/>
                            )
                        })}
                    </div>

                </div>
            </div>
            {isAddingNewProcedure && <NewProcedureModal isOpen={isAddingNewProcedure} onClose={() => setIsAddingNewProcedure(false)} id={businessState.id}/>}
            {isAddingAppointments && <AddAppointmentsModal isOpen={isAddingAppointments} onClose={() => setIsAddingAppointments(false)} id={businessState.id} procedures={procedures}/>}
        </DesktopWrapper>
    );
}