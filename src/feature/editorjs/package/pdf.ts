import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface fontConfigProps {
	paragraph: {
		fontSize: number;
		fontWeight: string;
	};
	heading1: {
		fontSize: number;
		fontWeight: string;
	};
	heading2: {
		fontSize: number;
		fontWeight: string;
	};
	heading3: {
		fontSize: number;
		fontWeight: string;
	};
	heading4: {
		fontSize: number;
		fontWeight: string;
	};
	heading5: {
		fontSize: number;
		fontWeight: string;
	};
}

class PDFPrinter {
	doc: any = new jsPDF('p', 'mm', [297, 210]);
	pageHeight: number;
	pageWidth: number;
	gap: number = 10;
	yAxis: number = this.gap; // Default y axis
	xOffset: number = 10;
	fontConfig: fontConfigProps = {
		paragraph: {
			fontSize: 8,
			fontWeight: 'normal',
		},
		heading1: {
			fontSize: 24,
			fontWeight: 'bold',
		},
		heading2: {
			fontSize: 20,
			fontWeight: 'bold',
		},
		heading3: {
			fontSize: 16,
			fontWeight: 'bold',
		},
		heading4: {
			fontSize: 14,
			fontWeight: 'bold',
		},
		heading5: {
			fontSize: 12,
			fontWeight: 'bold',
		},
	};
	constructor(blockData: any) {
		console.log('blockData', blockData);
		// this.doc.setFontSize(this.fontSize, 'normal');

		this.pageHeight = this.doc.internal.pageSize.height || this.doc.internal.pageSize.getHeight();
		this.pageWidth = this.doc.internal.pageSize.width || this.doc.internal.pageSize.getWidth();

		for (let block of blockData) {
			const { type, data } = block;
			if (type === 'paragraph') {
				this.applyText(block);
				continue;
			}
			if (type === 'table') {
				this.applyTable(data);
				continue;
			}
			if (type === 'header') {
				this.applyHeader(block);
			}
		}
	}

	getStringWidth = (text: string | number) => {
		return (this.doc.getStringUnitWidth(text) * this.doc.internal.getFontSize()) / 2;
	};
	getTextWidth = (text: string | number) => {
		return this.doc.getTextWidth(text);
	};

	getDimentions = (text: string | number) => {
		return this.doc.getTextDimensions(text);
	};

	updateYAxis = (nextCursor: number) => {
		this.yAxis = nextCursor;
	};

	canAddPage = (nextCursor: number) => {
		return this.pageHeight < nextCursor + this.gap;
	};

	applyText = (block: any) => {
		const { tunes, data } = block;

		const configs: any = {
			align: tunes.align.alignment,
		};

		let xOffset = this.xOffset;

		if (configs.align === 'center') {
			xOffset = this.pageWidth / 2;
		} else if (configs.align === 'right') {
			xOffset = this.pageWidth - 10;
		}

		// const d = this.getDimentions(data.text);
		const { fontSize, fontWeight } = this.fontConfig.paragraph;
		this.doc.text(data.text, xOffset, this.yAxis, configs).setFontSize(fontSize).setFont(undefined, fontWeight);

		this.updateYAxis(this.yAxis + (fontSize * 0.5) / 2);
	};

	applyHeader = (block: any) => {
		const { tunes, data } = block;
		const { fontSize, fontWeight } = (this.fontConfig as any)[`heading${data.level}`];

		const configs: any = {
			align: tunes.align.alignment,
		};

		let xOffset = this.xOffset;

		if (configs.align === 'center') {
			xOffset = this.pageWidth / 2;
		} else if (configs.align === 'right') {
			xOffset = this.pageWidth - 10;
		}
		this.doc.setFontSize(fontSize);
		this.doc.setFont(undefined, fontWeight);

		const dim = this.getDimentions(data.text);
		const isNextPage = this.canAddPage(this.yAxis + dim.h);
		console.log('isNextPage', isNextPage, this.yAxis, fontSize);

		if (isNextPage) {
			this.doc.addPage();
			this.updateYAxis(this.gap);
		} else {
			this.updateYAxis(this.yAxis + dim.h);
		}

		this.doc.text(data.text, xOffset, this.yAxis, configs);

		this.updateYAxis(this.yAxis + dim.h);
	};

	applyTable = (data: any) => {
		const { content, withHeadings } = data;
		let nextCursor = this.yAxis;
		const configs: any = {
			margin: { left: 10 },
			didDrawCell: (hookData: any) => {
				console.log('hookData', hookData.cell.height);
				nextCursor = hookData.cursor.y + hookData.cell.height;
			},
		};
		if (!withHeadings) {
			configs.body = content;
		} else {
			const head = content.splice(0, 1);
			configs.head = head;
			configs.body = content;
		}
		autoTable(this.doc, configs);
		console.log('nextCursor', nextCursor);
		this.updateYAxis(nextCursor);
	};

	save = (name: string) => {
		this.doc.save(name);
	};
}

export default PDFPrinter;
