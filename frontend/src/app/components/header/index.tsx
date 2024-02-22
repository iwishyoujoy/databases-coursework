'use client'

import React, { useState } from 'react';

import Image from "next/image";
import Link from "next/link";
import { RootState } from '../../redux/store';
import account from "public/images/account.svg";
import business from 'public/images/business.svg';
import cart from "public/images/cart.svg";
import cn from 'classnames';
import logo from "public/images/logo.svg";
import styles from './header.module.css';
import { useSelector } from 'react-redux';

export const Header = () => {
    const [selectedCategory, setSelectedCategory] = useState('Products');

    return (
        <header className={styles.header}>
            <div className={styles.leftContainer}>
                <Link className={styles.logoContainer} href='/products'>
                    <Image className={styles.logo} src={logo} alt="Logo picture - diamond"/>
                    <div className={styles.logoText}>Bimbo shop</div>
                </Link>
                <div className={styles.menuContainer}>
                    <Link className={cn(styles.hoverPink, selectedCategory === 'Products' ? styles.selected : '')} onClick={() => setSelectedCategory('Products')} href="/products">Products</Link>
                    <Link className={cn(styles.hoverPink, selectedCategory === 'Procedures' ? styles.selected : '')} onClick={() => setSelectedCategory('Procedures')} href="/procedures">Procedures</Link>
                </div>
            </div>
            <div className={styles.accountContainer}>
                <Link href="/business" className={styles.menuLink}>
                    <Image className={styles.menuLogo} src={business} alt="For business"/>
                </Link>
                <Link href="/cart" className={styles.menuLink}>
                    <Image className={styles.menuLogo} src={cart} alt="Cart"/>
                </Link>
                <Link href="/account" className={styles.menuLink}>
                    <Image className={styles.menuLogo} src={account} alt="Account"/>
                </Link>
            </div>
        </header>
    );
}