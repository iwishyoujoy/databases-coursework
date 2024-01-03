'use client'

import { AppDispatch, setProcedureCategoryId, setProductCategoryId } from '../../redux/store';
import { useEffect, useState } from 'react';

import { capitalizeFirstLetter } from '../../utils/text';
import cn from 'classnames';
import { getAllCategories } from '../../utils/getQuery';
import styles from './styles.module.css';
import { useDispatch } from 'react-redux';

interface ICategoriesProps {
    categoryType?: 'productCategory' | 'procedureCategory';
}

export const Categories: React.FC<ICategoriesProps> = ({ categoryType = 'productCategory' }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleCategoryClick = (id: number, name: string) => {
        setSelectedCategory(name);
        if (categoryType === 'productCategory'){
            dispatch(setProductCategoryId(id));
        }
        else{
            dispatch(setProcedureCategoryId(id));
        }
    }

    useEffect(() => {
        getAllCategories(categoryType)
            .then(data => {
                setCategories(data);
            })
            .catch(error => console.error(error));
    }, [categoryType]);

    return (
        <div className={styles.container}>
            <div className={cn(styles.category, styles.hoverPink, selectedCategory === 'All' ? styles.selected : '')} onClick={() => handleCategoryClick(-1, 'All')}>All</div>
            {categories.map((category, key) => {
                const name = capitalizeFirstLetter(category.name);

                return (<div className={cn(styles.category, styles.hoverPink, selectedCategory === name ? styles.selected : '')} onClick={() => handleCategoryClick(category.id, name)} key={key}>{name}</div>)
            })}
        </div>
    )
}