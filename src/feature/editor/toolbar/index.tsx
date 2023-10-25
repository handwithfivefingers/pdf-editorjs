import Button from '@app/components/Button';
import styles from './styles.module.scss';

interface ToolbarProps {
	onBold: () => void;
	paragraph: any;
}
export default function Toolbar(props: ToolbarProps) {
	const { onBold } = props;

	return (
		<div className={styles.toolbar}>
			<Bolder onClick={onBold} />
			<Italic />
			<Underline />
			<ParagraphSelection {...props.paragraph} />
		</div>
	);
}
const PARAGRAPH_SELECTION = [
	{
		label: 'Heading 1',
		value: 'h1',
	},
	{
		label: 'Heading 2',
		value: 'h2',
	},
	{
		label: 'Heading 3',
		value: 'h3',
	},
	{
		label: 'Heading 4',
		value: 'h4',
	},
	{
		label: 'Heading 5',
		value: 'h5',
	},
	{
		label: 'Paragraph',
		value: 'p',
	},
];
const ParagraphSelection = ({ value, ...props }: any) => {
	return (
		<select defaultValue={value} {...props}>
			{PARAGRAPH_SELECTION.map((item) => (
				<option key={item.value} value={item.value}>
					{item.label}
				</option>
			))}
		</select>
	);
};

const Bolder = (props: any) => {
	return <Button {...props}>B</Button>;
};
const Italic = (props: any) => {
	return <Button {...props}>I</Button>;
};

const Underline = (props: any) => {
	return <Button {...props}>U</Button>;
};
