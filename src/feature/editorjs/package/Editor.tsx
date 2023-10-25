import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import editorjsCodeflask from '@calumk/editorjs-codeflask';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';

import { forwardRef, useEffect } from 'react';
import { Columns } from './Column';

const Editor = forwardRef(({ data }: any, ref: any) => {
	useEffect(() => {
		if (!ref.current) {
			ref.current = new EditorJS({
				holder: 'edit',
				tools: {
					header: {
						class: Header,
						inlineToolbar: true,
						shortcut: 'CMD+SHIFT+H',
						tunes: ['align'],
						config: {
							placeholder: 'Enter a header',
							levels: [1, 2, 3, 4, 5],
							defaultLevel: 3,
						},
					},
					paragraph: {
						class: Paragraph,
						inlineToolbar: ['link'],
						tunes: ['align'],
					},
					list: {
						class: List,
						inlineToolbar: true,
					},
					table: {
						class: Table,
						inlineToolbar: true,
					},
					code: {
						class: editorjsCodeflask,
						inlineToolbar: true,
					},
					align: {
						class: AlignmentTuneTool,
						inlineToolbar: true,
						config: {
							default: 'left',
							blocks: {
								header: 'center',
								list: 'left',
							},
						},
					},
					columns: Columns,
				},
				onReady: () => {
					console.log('Editor.js is ready to work!');
				},
				data: data,
				// onChange: (api, event) => {
				// 	api.saver.save();
				// 	console.log("Now I know that Editor's content changed!", api, event);
				// },
			});
		}

		return () => {
			console.log('destroy');
			ref.current?.destroy?.();
		};
	}, [ref.current]);

	return <div id='edit'></div>;
});

export default Editor;
