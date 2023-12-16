import React from 'react';

import Image from "next/image";
import Link from "next/link";

import logo from "@/images/logo.svg";
import search from "@/images/search.svg";
import cart from "@/images/cart.svg";
import account from "@/images/account.svg";

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
                    <Link className={styles.hoverPink} href="/">Home</Link>
                    <Link className={styles.hoverPink} href="/">Catalog</Link>
                    {/* заменить на кастомные дропдауны */}
                    <Link className={styles.hoverPink} href="/">Shop</Link>
                    <Link className={styles.hoverPink} href="/">Pages</Link>
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