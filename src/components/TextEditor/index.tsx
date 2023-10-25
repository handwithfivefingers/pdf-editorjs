import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Button from '../Button';
import TableConfig from './Table';
import styles from './styles.module.scss';
import clsx from 'clsx';
import Table from '../Table';
import ParaInput from '../ParaInput';

interface ITextEditor {
	onSubmit?: (val: any) => void;
}

export enum Type {
	'PARAGRAPH' = 'PARAGRAPH',
	'TABLE' = 'TABLE',
}
interface EditorContext {
	type: string | any;
	data: string | any;
	col?: number;
	row?: number;
	html?: any;
}

export default function TextEditor({ onSubmit }: ITextEditor) {
	const [dataType, setType] = useState<any>(Type.PARAGRAPH);
	const [data, setData] = useState<EditorContext[]>([{ type: Type.PARAGRAPH, data: '' }]);
	const contentRef = useRef<any>({
		main: null,
		listInput: [],
	});
	const modalRef = useRef<any>(null);
	const onSave = () => {
		// if (onSubmit) {
		// 	onSubmit({
		// 		data,
		// 		type,
		// 	});
		// }
		console.log('content', contentRef.current);
		const listInput = contentRef.current?.listInput;
		const json = {};
		if (listInput?.length) {
			for (let inp of listInput) {
				const data = inp.innerText || inp.current?.data;
				console.log('data', data);
			}
		}
	};
	const handleAddParagraph = (type: any) => {
		const nextData = [...data];
		nextData.push({ type, data: '' });
		setData(nextData);
		setType(type);
	};
	const handleAddTable = (type: any) => {
		modalRef.current.setOpen(true);
		setType(type);
	};
	const handleGetTableData = (tableData: any) => {
		const nextData = [...data];
		nextData.push({ type: dataType, data: tableData.setting });
		setData(nextData);
		console.log('handleGetTableData', tableData);
		console.log('handleGetTableData', nextData);
	};
	const onSetType = (type: any) => {
		if (type === Type.PARAGRAPH) {
			handleAddParagraph(type);
		} else if (type === Type.TABLE) {
			handleAddTable(type);
		}
	};

	const addFocus = () => {
		if (!contentRef.current?.main?.classList.contains(styles.focus)) contentRef.current?.main?.classList.add(styles.focus);
	};
	const removeFocus = () => {
		contentRef.current?.main?.classList.remove(styles.focus);
	};

	useEffect(() => {
		const clickHandler = (e: any) => {
			if (!contentRef.current?.main?.contains(e.target)) {
				removeFocus();
			} else {
				addFocus();
			}
		};
		window.addEventListener('click', clickHandler, { capture: false });
		return () => window.removeEventListener('click', clickHandler, { capture: false });
	}, []);
	return (
		<div className={styles.wrapper}>
			<div className={styles.action}>
				<Button onClick={() => onSetType(Type['TABLE'])} active={Type['TABLE'] === dataType}>
					Table
				</Button>
				<Button onClick={() => onSetType(Type['PARAGRAPH'])} active={Type['PARAGRAPH'] === dataType}>
					Paragraph
				</Button>
				<Button onClick={onSave}>Submit</Button>
			</div>
			<div className={styles.content} ref={(ref) => (contentRef.current.main = ref)}>
				{data.map((item, i) => {
					if (item.type === Type.PARAGRAPH) {
						return <ParaInput ref={(ref) => (contentRef.current.listInput[i] = ref)} />;
					} else if (item.type === Type.TABLE) {
						return <Table {...item.data} ref={(ref: any) => (contentRef.current.listInput[i] = ref)} />;
					}
					return null;
				})}
			</div>
			<Modal ref={modalRef}>
				<TableConfig onSubmit={handleGetTableData} />
			</Modal>
		</div>
	);
}

const Modal = forwardRef(({ children }: any, ref: any) => {
	const [open, setOpen] = useState(false);

	useImperativeHandle(
		ref,
		() => {
			return {
				setOpen,
			};
		},
		[]
	);

	return (
		<div
			className={clsx(styles.modal, {
				[styles.open]: open,
			})}
		>
			<div className={styles.modalContent}>{children}</div>
		</div>
	);
});
