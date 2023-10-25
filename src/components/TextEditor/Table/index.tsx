import { FormEvent, useState } from 'react';
import Button from '../../Button';
import styles from './styles.module.scss';

interface ITable {
	onSubmit: any;
}
interface ISetting {
	row: number | string;
	column: number | string;
}
export default function Table({ onSubmit }: ITable) {
	const [setting, setSetting] = useState<ISetting>({
		column: 0,
		row: 0,
	});

	const handleFinish = (e:any) => {
		e.preventDefault()
		const value = {
			setting: setting,
		};
		onSubmit(value);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.table}>
				<form>
					<input
						placeholder='Column'
						name='column'
						value={setting.column}
						onChange={({ target }: any) => {
							console.log('target', target.value);
							setSetting((prev: any) => ({ ...prev, column: +target.value }));
						}}
					/>
					<input placeholder='Row' name='row' value={setting.row} onChange={({ target }: any) => setSetting((prev: any) => ({ ...prev, row: +target.value }))} />
					<Button onClick={handleFinish}> Submit</Button>
				</form>
			</div>
		</div>
	);
}
