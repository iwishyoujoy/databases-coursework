'use client'

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

import styles from './styles.module.css';

export default function Page() {
    const { isLogged } = useSelector((state: RootState) => state.login);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogged){
            navigate('/account');
        }
    }, [isLogged, navigate]);

    return (
        <div className={styles.container}>
            hello
        </div>
    );
}