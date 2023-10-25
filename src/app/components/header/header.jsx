import styles from './header.module.css';
import Image from "next/image";

import logo from "@/images/logo.svg";
import search from "@/images/search.svg";
import cart from "@/images/cart.svg";
import account from "@/images/account.svg";
import arrowDown from "@/images/arrowDown.svg";

import Link from "next/link";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from '@chakra-ui/react';


export default function Header(){
    return (
        <header>
            <div className={styles.logoContainer}>
                <Image className={styles.logo} src={logo} alt="Logo picture - heels"/>
                <div className={styles.logoText}>Bimbo shop</div>
            </div>
            <div className={styles.menuContainer}>
                <Link href="/">Home</Link>
                <Link href="/">Catalog</Link>
                <Menu>
                    <MenuButton rightIcon={<div>{arrowDown}</div>}>
                        Shop
                    </MenuButton>
                    {arrowDown}
                    <MenuList>
                        <MenuItem as='a' href='#'>Fashion</MenuItem>
                        <MenuItem as='a' href='#'>Procedures</MenuItem>
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton rightIcon={<div>{arrowDown}</div>}>
                        Pages   
                    </MenuButton>
                    <MenuList>
                        <MenuItem as='a' href='#'>Blog</MenuItem>
                        <MenuItem as='a' href='#'>Something</MenuItem>
                    </MenuList>
                </Menu>
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