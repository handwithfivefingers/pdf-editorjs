import { Packer } from 'docx';
import { renderAsync } from 'docx-preview';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
export default function DocEditor() {
	const ref = useRef<any>();
	const [data, setData] = useState<Blob>();

	useEffect(() => {
		fetchData();
	}, []);
	
	const fetchData = async () => {
		const resp = await fetch('http://localhost:5173/docs/docs.docx').then((res) => res.blob());
		setData(resp);
		renderData(resp)

	};

	const onEdit = (data: any) => {
		Packer.toBlob(data).then((blob) => {
			setData(blob);
			renderData(blob)
		});
	};

	const renderData = useCallback((blob:any) => {
		renderAsync(blob, ref.current, undefined, { breakPages: true });
	}, [data]);
	return (
		<div className={styles.docEditor}>
			{/* <DocumentData onEdit={onEdit} containerRef={ref} /> */}
			<div ref={ref}></div>
		</div>
	);
}
