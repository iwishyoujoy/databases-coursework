'use client'

import { AppDispatch, setProcedureCategoryId, setProductCategoryId } from '../../redux/store';
import { useEffect, useState } from 'react';

import axios from 'axios';
import { capitalizeFirstLetter } from '../../utils/text';
import cn from 'classnames';
import styles from './styles.module.css';
import { useDispatch } from 'react-redux';

interface ICategoriesProps {
    categoryType?: 'productCategory' | 'procedureCategory';
}

async function getAllProductCategories(categoryType): Promise<any> {
    try {
        const response = await axios.get(`http://localhost:3100/api/${categoryType}/all`);
     
        return response.data;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}

export const Categories: React.FC<ICategoriesProps> = ({ categoryType = 'productCategory' }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleCategoryClick = (id, name) => {
        setSelectedCategory(name);
        if (categoryType === 'productCategory'){
            dispatch(setProductCategoryId(id));
        }
        else{
            dispatch(setProcedureCategoryId(id));
        }
    }

    useEffect(() => {
        getAllProductCategories(categoryType)
            .then(data => {
                setCategories(data);
            })
            .catch(error => console.error(error));
    }, [categoryType]);

    return (
        <div className={styles.container}>
            <div className={cn(styles.category, styles.hoverPink, selectedCategory === 'All' ? styles.selected : '')} onClick={() => handleCategoryClick('-1', 'All')}>All</div>
            {categories.map((category, key) => {
                const name = capitalizeFirstLetter(category.name);

                return (<div className={cn(styles.category, styles.hoverPink, selectedCategory === name ? styles.selected : '')} onClick={() => handleCategoryClick(category.id, name)} key={key}>{name}</div>)
            })}
        </div>
    )
}