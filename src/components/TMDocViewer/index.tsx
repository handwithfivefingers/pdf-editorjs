import { useEffect } from 'react';
// import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";


export default function TMDocViewer() {
	useEffect(() => {
		fetch('/docs/docs.docx')
			.then((res) => res.json())
			.then((res) => {
				console.log('res', res);
			})
			.catch((error) => {
				console.log('error', error.toString());
			});
	}, []);
	return (
		<div>
			<DocViewer
				prefetchMethod='GET'
				documents={[
					{
						uri: 'http://localhost:5173/docs/docs.docx',
						fileType: 'docx',
					},
				]}
				pluginRenderers={DocViewerRenderers}
			/>
		</div>
	);
}
