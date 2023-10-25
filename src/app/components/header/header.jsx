import styles from './header.module.css';
import Image from "next/image";

import logo from "@/images/logo.svg";
import search from "@/images/search.svg";
import cart from "@/images/cart.svg";
import account from "@/images/account.svg";

// import arrowDown from "@/images/arrowDown.svg";

import Link from "next/link";

export default function Header(){
    return (
        <header>
            <div className={styles.leftContainer}>
                <div className={styles.logoContainer}>
                    <Image className={styles.logo} src={logo} alt="Logo picture - heels"/>
                    <div className={styles.logoText}>Bimbo shop</div>
                </div>
                <div className={styles.menuContainer}>
                    <Link className={styles.hoverPink} href="/">Home</Link>
                    <Link className={styles.hoverPink} href="/">Catalog</Link>
                    {/* заменить на кастомные дропдауны */}
                    <Link className={styles.hoverPink} href="/">Shop</Link>
                    <Link className={styles.hoverPink} href="/">Pages</Link>
                </div>
            </div>
            <div className={styles.accountContainer}>
                <Link href="/">
                    <Image className={styles.search} src={search} alt="Search"/>
                </Link>
                <Link href="/">
                    <Image className={styles.cart} src={cart} alt="Cart"/>
                </Link>
                <Link href="/">
                    <Image className={styles.account} src={account} alt="Account"/>
                </Link>
            </div>
        </header>
    );
}