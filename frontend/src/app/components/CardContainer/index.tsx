import axios from 'axios';
import { useState, useEffect } from 'react';
import cn from 'classnames';

import styles from './styles.module.css';
import { Card } from './CardContainerItem';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

async function getAllProducts(selector): Promise<any> {
   try {
       const response = await axios.get(`http://localhost:3100/api/product/${selector}`);
    
       return response.data;
   } catch (error) {
       console.error(`Error: ${error}`);
       throw error;
   }
}

export const CardContainer = () => {
   const [products, setProducts] = useState([]);
   const categoryState = useSelector((state: RootState) => state.category);

   useEffect(() => {
        if (categoryState.productCategory !== '-1'){
            getAllProducts('all')
                .then(data => {
                    setProducts(data);
                })
                .catch(error => console.error(error));
        }
        else{
            getAllProducts(categoryState.productCategory)
                .then(data => {
                    setProducts(data);
                })
                .catch(error => console.error(error));
        }
   }, [categoryState.productCategory]);

   return (
       <div className={styles.container}>
           {products.map((product, key) => {
               return (<Card product={product} key={key} />)
           })}
       </div>
   )
}
