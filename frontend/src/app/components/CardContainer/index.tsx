import axios from 'axios';
import { useState, useEffect } from 'react';

import styles from './styles.module.css';
import { Card } from './CardContainerItem';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { getItemsListLength } from '../../utils/text';

interface ICardContainerProps {
    categoryType?: 'productCategory' | 'procedureCategory';
}

async function getAllProducts(): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/product/all`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getAllProcedures(): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedure/all`);
    
        return response.data;
    }catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

async function getProductsbyCategory(selector): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/productCategory/${selector}/products`);
     
        return response.data;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
 }

async function getProceduresbyCategory(selector): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/procedureCategory/${selector}/procedures`);
     
        return response.data;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}
 

export const CardContainer: React.FC<ICardContainerProps> = ({ categoryType = 'productCategory' }) => {
   const [products, setProducts] = useState([]);
   const categoryState = useSelector((state: RootState) => state.category);

   useEffect(() => {
        if (categoryType === 'productCategory'){
            if (categoryState.productCategory === '-1'){
                getAllProducts()
                    .then(data => {
                        setProducts(data);
                    })
                    .catch(error => console.error(error));
            }
            else{
                getProductsbyCategory(categoryState.productCategory)
                    .then(data => {
                        setProducts(data);
                    })
                    .catch(error => console.error(error));
            }
        }
        else{
            if (categoryState.procedureCategory === '-1'){
                getAllProcedures()
                    .then(data => {
                        setProducts(data);
                    })
                    .catch(error => console.error(error));
            }
            else{
                getProceduresbyCategory(categoryState.procedureCategory)
                    .then(data => {
                        setProducts(data);
                    })
                    .catch(error => console.error(error));
            }
        }
        
   }, [categoryState.procedureCategory, categoryState.productCategory, categoryType]);

   return (
       <div className={styles.container}>
            {products.length > 0 ? (
                <>
                <div className={styles.counter}>{getItemsListLength(products, 'item', 'items')}</div>
                <div className={styles.cardContainer}>
                    {products.map((product, key) => {
                        return (<Card item={product} key={key} isProduct={categoryType === 'productCategory'}/>)
                    })}
                </div>
                </>
            ) : (
                <div className={styles.errorContainer}>
                    <h1 className={styles.error}>Oopsie... </h1>
                    <p className={styles.errorDescription}>Nothing was found, search for something else</p>
                </div>
            )}
       </div>
   )
}
