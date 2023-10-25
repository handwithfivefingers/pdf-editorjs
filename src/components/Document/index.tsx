import TextEditor, { Type } from '../TextEditor';
import { Document, Footer, Header, NumberFormat, PageOrientation, Paragraph, SectionType, Table, TableCell, TableRow, convertMillimetersToTwip } from 'docx';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

export default function DocumentData({ onEdit, containerRef }: any) {
	const pageSize = {
		size: {
			orientation: PageOrientation.PORTRAIT,
			height: convertMillimetersToTwip(297),
			width: convertMillimetersToTwip(210),
		},
		pageNumbers: {
			start: 1,
			formatType: NumberFormat.DECIMAL,
		},
	};

	const [doc, setDoc] = useState<any>({
		sections: [
			{
				properties: {
					type: SectionType.NEXT_PAGE,
					page: pageSize,
				},
				headers: {
					default: new Header({
						children: [new Paragraph('Header text')],
					}),
				},
				footers: {
					default: new Footer({
						children: [new Paragraph('Footer text')],
					}),
				},
				children: [],
			},
		],
	});

	useEffect(() => {
		const documentData = new Document(doc);
		if (onEdit) {
			onEdit(documentData);
		}
	}, []);

	const handleSubmit = ({ data, type }: any) => {
		const h = calculateText(data);
		if (Type['PARAGRAPH'] === type) {
			return addParagraph({ data, h, cb: onEdit });
		}
		if (Type['TABLE'] === type) {
			return addTable({ data, h, cb: onEdit });
		}
	};

	const calculateText = (data: any) => {
		const div = document.createElement('div');
		div.setAttribute('id', 'temp');
		const sectionAttr = getSectionStyle();
		if (sectionAttr.attributes) {
			div.setAttribute('style', `white-space: break-spaces; width:${sectionAttr?.style?.getPropertyValue('width')}`);
		}
		div.innerHTML = data;
		document.body.append(div);
		const divHeight = document.querySelector('#temp')?.clientHeight;
		div.remove();
		return divHeight;
	};

	const getSectionStyle = () => {
		const listSection = containerRef.current.querySelectorAll('section');
		if (!listSection.length) return {};
		const currentSection = [...listSection].pop();
		const style = window.getComputedStyle(currentSection);
		const attributes = currentSection.getAttribute('style');
		return {
			style,
			attributes,
		};
	};
	
	const getPage = ({ elementH }: any) => {
		const listSection = containerRef.current.querySelectorAll('section');
		if (!listSection.length) return 0;
		const currentSection = [...listSection].pop();
		const style = window.getComputedStyle(currentSection);
		if (!style) return 0;
		const minHeightPT = style.getPropertyValue('min-height');
		const height = Number(minHeightPT.split('px')[0]);
		const { height: headerHeight } = currentSection.querySelector('header')?.getBoundingClientRect() || { height: 0 };
		const { height: bodyHeight } = currentSection.querySelector('article')?.getBoundingClientRect() || { height: 0 };
		const { height: footerHeight } = currentSection.querySelector('footer')?.getBoundingClientRect() || { height: 0 };
		if (height - headerHeight - bodyHeight - footerHeight <= elementH) {
			return listSection.length;
		} else {
			return listSection.length - 1;
		}
	};

	const addParagraph = ({ data, h, cb }: any) => {
		const sectionsIndex = getPage({ elementH: h });

		const nextState = { ...doc };

		if (!nextState.sections[sectionsIndex === 0 ? 0 : sectionsIndex]) {
			nextState.sections[sectionsIndex === 0 ? 0 : sectionsIndex] = {
				properties: {
					type: SectionType.NEXT_PAGE,
					page: pageSize,
				},
				headers: {
					default: new Header({
						children: [new Paragraph('Header text')],
					}),
				},
				footers: {
					default: new Footer({
						children: [new Paragraph('Footer text')],
					}),
				},
				children: [],
			};
		}

		const templateSection = nextState.sections[sectionsIndex === 0 ? 0 : sectionsIndex];

		templateSection.children.push(
			new Paragraph({
				text: data,
				pageBreakBefore: true,
			})
		);
		setDoc(nextState);
		if (cb) {
			const documentData = new Document(nextState);
			cb(documentData);
		}
	};

	const addTable = ({ data, h, cb }: any) => {
		const sectionsIndex = getPage({ elementH: h });

		const nextState = { ...doc };

		if (!nextState.sections[sectionsIndex === 0 ? 0 : sectionsIndex]) {
			nextState.sections[sectionsIndex === 0 ? 0 : sectionsIndex] = {
				properties: {
					type: SectionType.NEXT_PAGE,
					page: pageSize,
				},
				headers: {
					default: new Header({
						children: [new Paragraph('Header text')],
					}),
				},
				footers: {
					default: new Footer({
						children: [new Paragraph('Footer text')],
					}),
				},
				children: [],
			};
		}

		const templateSection = nextState.sections[sectionsIndex === 0 ? 0 : sectionsIndex];

		const { header, body } = data;

		const table = new Table({
			columnWidths: [4505, 4505],
			rows: [
				new TableRow({
					tableHeader:true,
					children: header.map((head: any) => new TableCell({ children: [new Paragraph(head)] })),
				}),
				...body.map((cols: any[]) => {
					return new TableRow({
						children: cols.map((col: any) => new TableCell({ children: [new Paragraph(col)] })),
					});
				}),
			],
		});

		templateSection.children.push(table);

		setDoc(nextState);
		if (cb) {
			const documentData = new Document(nextState);
			cb(documentData);
		}
	};

	return (
		<>
			<div className={styles.wrapper}>
				<TextEditor onSubmit={handleSubmit} />
			</div>
		</>
	);
}
