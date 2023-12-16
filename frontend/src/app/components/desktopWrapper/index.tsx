import React from "react";
import cn from 'classnames';

import styles from './styles.module.css';

export interface IDesktopContentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export const DesktopWrapper: React.FC<IDesktopContentWrapperProps> = (props) => {
    const { children, className, ...otherProps } = props;

    return (
        <div className={cn(styles.container, className)} {...otherProps}>
            {children}
        </div>
    );
};