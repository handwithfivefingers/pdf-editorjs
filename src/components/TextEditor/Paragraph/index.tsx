import Button from '../../Button';
import { ChangeEvent, useRef, useState } from 'react';

export default function ParagraphEditor({ onSubmit }: any) {
	const [data, setData] = useState<any>();
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const onInputChange = (e: ChangeEvent) => {
		const { value }: any = e.target;
		setData(value);
	};
	const onSave = () => {
		if (onSubmit) {
			onSubmit(data);
		}
	};
	return (
		<div>
			<textarea onChange={onInputChange} ref={inputRef} />
			<Button onClick={onSave}>Save</Button>
		</div>
	);
}
