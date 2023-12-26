import React from 'react';

import Image from "next/image";
import Link from "next/link";

import logo from "public/images/logo.svg";
import search from "public/images/search.svg";
import cart from "public/images/cart.svg";
import account from "public/images/account.svg";

// import arrowDown from "@/images/arrowDown.svg";

import styles from './header.module.css';

export const Header = () => {

    // const response = fetch('https://localhost:3100/api/review/all');

    return (
        <header className={styles.header}>
            <div className={styles.leftContainer}>
                <Link className={styles.logoContainer} href='/'>
                    <Image className={styles.logo} src={logo} alt="Logo picture - heels"/>
                    <div className={styles.logoText}>Bimbo shop</div>
                </Link>
                <div className={styles.menuContainer}>
                    <Link className={styles.hoverPink} href="/clothes">Clothes</Link>
                    <Link className={styles.hoverPink} href="/procedures">Procedures</Link>
                </div>
            </div>
            <div className={styles.accountContainer}>
                <Link href="/" className={styles.menuLink}>
                    <Image className={styles.menuLogo} src={search} alt="Search"/>
                </Link>
                <Link href="/" className={styles.menuLink}>
                    <Image className={styles.menuLogo} src={cart} alt="Cart"/>
                </Link>
                <Link href="/account" className={styles.menuLink}>
                    <Image className={styles.menuLogo} src={account} alt="Account"/>
                </Link>
            </div>
        </header>
    );
}