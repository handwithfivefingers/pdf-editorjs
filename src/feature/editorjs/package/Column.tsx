import editorjsColumns from '@calumk/editorjs-columns';
import Delimiter from '@editorjs/delimiter';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Alert from 'editorjs-alert';
import Paragraph from '@editorjs/paragraph';

let column_tools = {
	header: Header,
	alert: Alert,
	paragraph: Paragraph,
	delimiter: Delimiter,
};

const Columns = {
	class: editorjsColumns,
	config: {
		EditorJsLibrary: EditorJS, // Pass the library instance to the columns instance.
		tools: column_tools, // IMPORTANT! ref the column_tools
	},
};
export { Columns };
