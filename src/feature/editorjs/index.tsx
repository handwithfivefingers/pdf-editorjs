import { useRef } from 'react';
import Editor from './package/Editor';
import PDFPrinter from './package/pdf';
import styles from './styles.module.scss';

const MOCK_DATA = {
	time: new Date().getTime(),
	blocks: [
		{
			type: 'paragraph',
			data: {
				text: 'hello world',
			},
			tunes: {
				align: {
					alignment: 'center',
				},
			},
		},
		{
			type: 'table',
			data: {
				withHeadings: true,
				content: [['Header', 'Header2'], ...Array(100).fill([Math.random() * 100, Math.random() * 100])],
			},
		},
		{
			type: 'header',
			data: {
				text: 'Heading Component',
				level: 3,
			},
			tunes: {
				align: {
					alignment: 'center',
				},
			},
		},
		{
			type: 'header',
			data: {
				text: 'Heading Component',
				level: 3,
			},
			tunes: {
				align: {
					alignment: 'center',
				},
			},
		},
		{
			type: 'header',
			data: {
				text: 'Heading Component',
				level: 3,
			},
			tunes: {
				align: {
					alignment: 'center',
				},
			},
		},
		{
			type: 'header',
			data: {
				text: 'Heading Component',
				level: 3,
			},
			tunes: {
				align: {
					alignment: 'center',
				},
			},
		},
	],
	version: '2.11.10',
};
export default function RTEJS() {
	const ref = useRef<any>();

	const handleSave = async (e: any) => {
		e.preventDefault();
		const val = await ref.current.save();
		console.log(val);
	};

	const handlePrint = async (e: any) => {
		e.preventDefault();
		const val = await ref.current.save();
		console.log(val);
		const { blocks } = val;
		const doc = new PDFPrinter(blocks);
		doc.save('test.pdf');
	};

	return (
		<div className={styles.wrapper}>
			<button onClick={handleSave}>Submit</button>
			<button onClick={handlePrint}>PDF</button>
			<Editor ref={ref} data={MOCK_DATA} />
		</div>
	);
}
