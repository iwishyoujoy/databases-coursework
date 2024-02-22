import { useEffect, useState } from 'react';

import { Card } from './CardContainerItem';
import { RootState } from '../../redux/store';
import { getItemsListLength } from '../../utils/text';
import styles from './styles.module.css';
import { useSelector } from 'react-redux';
import { useGetAllProceduresQuery, useGetAllProductsQuery, useGetProceduresbyCategoryQuery, useGetProductsbyCategoryQuery } from '../../utils/api';

interface ICardContainerProps {
    categoryType?: 'productCategory' | 'procedureCategory';
}

export const CardContainer: React.FC<ICardContainerProps> = ({ categoryType = 'productCategory' }) => {
    const [products, setProducts] = useState([]);
    const categoryState = useSelector((state: RootState) => state.category);

    const {data: productsData} = useGetAllProductsQuery()
    const {data: proceduresData} = useGetAllProceduresQuery()
    const {data: proceduresByCategory} = useGetProceduresbyCategoryQuery(categoryState.procedureCategoryId, { skip: 
        categoryType !== 'procedureCategory' ||
        (categoryType === 'procedureCategory' && categoryState.procedureCategoryId === -1)
    })
    const {data: productsByCategory} = useGetProductsbyCategoryQuery(categoryState.productCategoryId, { skip: 
        categoryType !== 'productCategory' ||
        (categoryType === 'productCategory' && categoryState.productCategoryId === -1)
    })

    useEffect(() => {
        if (categoryType === 'productCategory'){
            if (categoryState.productCategoryId === -1 && productsData){
                setProducts(productsData);
            }
            else if (productsByCategory){
                setProducts(productsByCategory);
            }
        }
        else {
            if (categoryState.procedureCategoryId === -1 && proceduresData){
                setProducts(proceduresData);
            }
            else if (proceduresByCategory){
                setProducts(proceduresByCategory);
            }
        }
    }, [productsData, proceduresData, proceduresByCategory, productsByCategory, categoryState.procedureCategoryId, categoryState.productCategoryId]);

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
