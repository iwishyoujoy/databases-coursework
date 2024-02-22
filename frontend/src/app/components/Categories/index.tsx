'use client'

import { AppDispatch, RootState, setProcedureCategoryId, setProductCategoryId } from '../../redux/store';
import { useEffect, useState } from 'react';

import { capitalizeFirstLetter } from '../../utils/text';
import cn from 'classnames';
import { getAllCategories } from '../../utils/getQuery';
import styles from './styles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAllCategoriesQuery } from '../../utils/api';

interface ICategoriesProps {
    categoryType?: 'productCategory' | 'procedureCategory';
}

export const Categories: React.FC<ICategoriesProps> = ({ categoryType = 'productCategory' }) => {
    const categoryState = useSelector((state: RootState) => state.category);
    const [ selectedCategoryId, setSelectedCategoryId ] = useState<number>()

    const dispatch = useDispatch<AppDispatch>();
    const [categories, setCategories] = useState([]);

    const {data: categoriesData} = useGetAllCategoriesQuery(categoryType);

    const handleCategoryClick = (id: number) => {
        setSelectedCategoryId(id);
        if (categoryType === 'productCategory'){
            dispatch(setProductCategoryId(id));
        }
        else{
            dispatch(setProcedureCategoryId(id));
        }
    }

    useEffect(() => {
        if (categoryType === 'productCategory'){
            setSelectedCategoryId(categoryState.productCategoryId);
        }
        else {
            setSelectedCategoryId(categoryState.procedureCategoryId);
        }
        if (categoriesData){
            setCategories(categoriesData);
        }
    }, [categoryType]);

    return (
        <div className={styles.container}>
            <div className={cn(styles.category, styles.hoverPink, selectedCategoryId === -1 ? styles.selected : '')} onClick={() => handleCategoryClick(-1)}>All</div>
            {categories.map((category, key) => {
                const name = capitalizeFirstLetter(category.name);

                return (<div className={cn(styles.category, styles.hoverPink, selectedCategoryId === Number(category.id) ? styles.selected : '')} onClick={() => handleCategoryClick(category.id)} key={key}>{name}</div>)
            })}
        </div>
    )
}