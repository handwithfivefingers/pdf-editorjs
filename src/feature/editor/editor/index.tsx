import { forwardRef } from 'react';
import styles from './styles.module.scss';
const Editor = forwardRef((props: any, ref: any) => {
	return (
		<div className={styles.editor} ref={ref} {...props}>
		
		</div>
	);
});

export default Editor;
