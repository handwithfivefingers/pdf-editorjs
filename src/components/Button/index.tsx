import React, { ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';
interface IButton<T> extends ButtonHTMLAttributes<T> {
	children: React.ReactNode;
	active?: boolean;
}

export default function Button({ children, ...rest }: IButton<any>) {
	return (
		<button
			className={clsx(styles.btn, {
				[styles.active]: rest.active,
			})}
			{...rest}
		>
			{children}
		</button>
	);
}
