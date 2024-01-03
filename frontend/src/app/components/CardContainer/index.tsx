import { getAllProcedures, getAllProducts, getProceduresbyCategory, getProductsbyCategory } from '../../utils/getQuery';
import { useEffect, useState } from 'react';

import { Card } from './CardContainerItem';
import { RootState } from '../../redux/store';
import axios from 'axios';
import { getItemsListLength } from '../../utils/text';
import styles from './styles.module.css';
import { useSelector } from 'react-redux';

interface ICardContainerProps {
    categoryType?: 'productCategory' | 'procedureCategory';
}

export const CardContainer: React.FC<ICardContainerProps> = ({ categoryType = 'productCategory' }) => {
   const [products, setProducts] = useState([]);
   const categoryState = useSelector((state: RootState) => state.category);

   useEffect(() => {
        if (categoryType === 'productCategory'){
            if (categoryState.productCategoryId === -1){
                getAllProducts()
                    .then(data => {
                        setProducts(data);
                    })
                    .catch(error => console.error(error));
            }
            else{
                getProductsbyCategory(categoryState.productCategoryId)
                    .then(data => {
                        setProducts(data);
                    })
                    .catch(error => console.error(error));
            }
        }
        else{
            if (categoryState.procedureCategoryId === -1){
                getAllProcedures()
                    .then(data => {
                        setProducts(data);
                    })
                    .catch(error => console.error(error));
            }
            else{
                getProceduresbyCategory(categoryState.procedureCategoryId)
                    .then(data => {
                        setProducts(data);
                    })
                    .catch(error => console.error(error));
            }
        }
        
   }, [categoryState.procedureCategoryId, categoryState.productCategoryId, categoryType]);

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
