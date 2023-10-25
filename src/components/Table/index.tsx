import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './styles.module.scss';
const Table = forwardRef(({ column, row, data }: any, ref) => {
	const [tableSource, setTableSource] = useState(data || []);

	const handleChange = (event: any, col: number, row = 0) => {
		const nextState = [...tableSource];
		const value = event.target.value;

		console.log('value', value);
		console.log('col', col);
		console.log('row', row);

		if (!nextState?.[row]) {
			nextState[row] = Array(column).fill('');
			nextState[row][col] = value;
		} else {
			if (!nextState[row]?.[col]) {
				nextState[row][col] = value;
			} else {
				nextState[row][col] = value;
      }
		}
		setTableSource(nextState);
	};
	useImperativeHandle(
		ref,
		() => {
			return {
				data: tableSource,
			};
		},
		[]
	);

	return (
		<div>
			<table>
				<thead>
					<tr className={styles.bodyItem} key={`header_row`}>
						{Array(+column)
							.fill('')
							.map((_, rowIndex) => (
								<th key={`headers_col_${rowIndex}`}>
									<input onChange={(e) => handleChange(e, rowIndex)} />
								</th>
							))}
					</tr>
				</thead>
				<tbody>
					{Array(+row)
						.slice(1)
						.fill('')
						.map((_, rowIndex) => {
							return (
								<tr className={styles.bodyItem} key={`body_row_${rowIndex}`}>
									{Array(+column)
										.fill('')
										.map((_, colIndex) => (
											<td key={`body_col_${colIndex}`}>
												<input onChange={(e) => handleChange(e, colIndex, rowIndex + 1)} />
											</td>
										))}
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
});

export default Table;
