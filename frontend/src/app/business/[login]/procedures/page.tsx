'use client'

import { AppDispatch, RootState, setIsLoggedBusiness } from "../../../redux/store";
import { ICategoryProps, IProcedureProps } from "../../../utils/types";
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter, getItemsListLength } from "../../../utils/text";
import { getAllCategories, getFavoritesByCustomer, getProceduresByClinicId } from "../../../utils/getQuery";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "../../../components/CardContainer/CardContainerItem";
import { DesktopWrapper } from "../../../components/DesktopWrapper";
import Link from "next/link";
import { addProcedure } from "../../../utils/postQuery";
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
    // const [ appointments, setAppointments ] = useState(); // добавить иконку что нет аппоинтментов - добавить аппоинтменты
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

export default function Page({ params: { login } }: AccountProps) {
    const businessState = useSelector((state: RootState) => state.business);
    const [ isAddingNewProcedure, setIsAddingNewProcedure ] = useState(false);
    const [ procedures, setProcedures ] = useState<IProcedureProps[]>([]);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        getProceduresByClinicId(businessState.id)
            .then(data => {
                setProcedures(data);
            })
            .catch(error => console.error(error));
    }, [businessState.id]);

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
        </DesktopWrapper>
    );
}