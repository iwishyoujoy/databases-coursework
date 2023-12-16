import React from "react";

import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.css";

import logo from "@/images/logo.svg";
import address from "@/images/address.svg";
import email from "@/images/email.svg";
import phone from "@/images/phone.svg";
import fax from "@/images/fax.svg";

import { Button } from '@chakra-ui/react';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.leftContainer}>
                <div className={styles.logoContainer}>
                    <Image className={styles.logo} src={logo} alt="Logo picture"/>
                    Bimbo shop
                </div>
                <div className={styles.description}>
                    Welcome to Bimbo shop! Transform your dream into reality with our stylish trends and unforgettable shopping experience. Don't forget to check our updates on social media. Your satisfaction fuels our passion!
                </div>
                <div className={styles.buttonContainer}>
                    <Button className={styles.blackButton} borderRadius="0" w="300px" colorScheme='black' variant='outline'>
                        Twitter
                    </Button>
                    <Button className={styles.blackButton} borderRadius="0" w="300px" colorScheme='black' variant='outline'>
                        Facebook
                    </Button>
                    <Button className={styles.blackButton} borderRadius="0" w="300px" colorScheme='black' variant='outline'>
                        Instagram
                    </Button>
                    <Button className={styles.blackButton} borderRadius="0" w="300px" colorScheme='black' variant='outline'>
                        VK
                    </Button>
                </div>
            </div>
            <div className={styles.middleContainer}>
                <h1 className={styles.header}>Help</h1>
                <div className={styles.linkContainer}>
                    <Link className={styles.linkBigger} href="/">Search</Link>
                    <Link className={styles.linkBigger} href="/">Delivery Information</Link>
                    <Link className={styles.linkBigger} href="/">Privacy Policy</Link>
                    <Link className={styles.linkBigger} href="/">Terms & Conditions</Link>
                    <Link className={styles.linkBigger} href="/">Cookie Agreement</Link>
                </div>
            </div>
            <div className={styles.rightContainer}>
                <h1 className={styles.header}>We are @</h1>
                <div className={styles.infoContainer}>
                    <div className={styles.info}>
                        <div className={styles.infoFirstRow}>
                            <Image className={styles.svg} src={address} alt="Picture of house"/>
                            Address
                        </div>
                        <div className={styles.actualInfo}>
                            Russia, Saint-Petersburg, Kronverksky Avenue, 49
                        </div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.infoFirstRow}>
                            <Image className={styles.svg} src={email} alt="Picture of email"/>
                            Email
                        </div>
                        <div className={styles.actualInfo}>
                            bimboshop@yandex.ru
                            <br />
                            bimboshophelp@yandex.ru
                        </div>
                    </div>   
                    <div className={styles.info}>
                        <div className={styles.infoFirstRow}>
                            <Image className={styles.svg} src={phone} alt="Picture of phone"/>
                            Phone
                        </div>
                        <div className={styles.actualInfo}>
                            +79873563245
                            <br />
                            +79654736529
                        </div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.infoFirstRow}>
                            <Image className={styles.svg} src={fax} alt="Picture of fax"/>
                            Fax
                        </div>
                        <div className={styles.actualInfo}>
                            8-812-1234567
                            <br />
                            810-41-1234567890
                        </div>
                    </div>        
                </div>
            </div>
        </footer>
    );
}