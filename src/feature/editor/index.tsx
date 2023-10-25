import { useRef, useState } from 'react';
import Editor from './editor';
import styles from './styles.module.scss';
import Toolbar from './toolbar';

interface IGetSelectionText {
	isRange: boolean;
	node: HTMLElement | Node | null | undefined;
	parentNode: HTMLElement | null | undefined;
	remainText: string[];
	value: string;
}

export default function TMEditor() {
	const editorRef = useRef<any>(null);
	const [paragraphSelection, setParagraphSelection] = useState('p');

	const onBold = () => {
		// const text = getSelectionText();
		// if (text.isRange) {
		// 	if (text.parentNode) {
		// 		const [first, last] = text.remainText;
		// 		const node = first + `<b>${text.value}</b>` + last;
		// 		text.parentNode.innerHTML = node;
		// 		console.log('node', node);
		// 		console.log('remainText', text.remainText);
		// 	}
		// }
		const func = getSelectionTextFunc()

		const res = func.saveSelection(editorRef.current)
		console.log('res',res)
	};

	const createElement = (type: string, value = '') => {
		const elmt = document.createElement(type);
		elmt.innerHTML = value;
		return elmt;
	};

	const getSelectionTextFunc = (): any => {
		// const selection: Selection | null = window.getSelection();
		// const currentNode = selection?.['focusNode'];
		// const range = selection?.getRangeAt(0);
		// const selectedText = range?.toString();
		// const isRange = selection?.['type'] === 'Range';
		// const parentNode = currentNode?.parentElement;
		// console.log('selection',selection)
		// let remainText: string[] = [];
		// if (selectedText) {
		// 	if (parentNode?.innerText) {
		// 		const index = parentNode?.innerText.indexOf(selectedText) || -1;
		// 		if (index !== -1) {
		// 			remainText = [parentNode?.innerText.slice(0, index), parentNode?.innerText.slice(index + selectedText.length)];
		// 		} else {
		// 			remainText = [...parentNode?.innerText];
		// 		}
		// 	}
		// }
		let saveSelection, restoreSelection;
		if (window.getSelection && document.createRange) {
			saveSelection = function (containerEl: HTMLUnknownElement) {
				let range = (window.getSelection() as any).getRangeAt(0);
				let preSelectionRange = range.cloneRange();
				preSelectionRange.selectNodeContents(containerEl);
				preSelectionRange.setEnd(range.startContainer, range.startOffset);
				let start = preSelectionRange.toString().length;

				return {
					start: start,
					end: start + range.toString().length,
				};
			};

			restoreSelection = function (containerEl: HTMLElement, savedSel: any) {
				let charIndex = 0,
					range = document.createRange();
				range.setStart(containerEl, 0);
				range.collapse(true);
				let nodeStack = [containerEl],
					node: any,
					foundStart = false,
					stop = false;

				while (!stop && (node = nodeStack.pop())) {
					if (node.nodeType == 3) {
						let nextCharIndex = charIndex + node.length;
						if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
							range.setStart(node, savedSel.start - charIndex);
							foundStart = true;
						}
						if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
							range.setEnd(node, savedSel.end - charIndex);
							stop = true;
						}
						charIndex = nextCharIndex;
					} else {
						let i = node.childNodes.length;
						while (i--) {
							nodeStack.push(node.childNodes[i]);
						}
					}
				}

				let sel = window.getSelection();
				sel?.removeAllRanges();
				sel?.addRange(range);
			};
		} else if ((document as any).selection && (document.body as any).createTextRange) {
			saveSelection = function (containerEl: HTMLUnknownElement) {
				let selectedTextRange = (document as any).selection.createRange();
				let preSelectionTextRange = (document.body as any).createTextRange();
				preSelectionTextRange.moveToElementText(containerEl);
				preSelectionTextRange.setEndPoint('EndToStart', selectedTextRange);
				let start = preSelectionTextRange.text.length;

				return {
					start: start,
					end: start + selectedTextRange.text.length,
				};
			};

			restoreSelection = function (containerEl: HTMLUnknownElement, savedSel: any) {
				let textRange = (document.body as any).createTextRange();
				textRange.moveToElementText(containerEl);
				textRange.collapse(true);
				textRange.moveEnd('character', savedSel.end);
				textRange.moveStart('character', savedSel.start);
				textRange.select();
			};
		}
		return { saveSelection, restoreSelection };

		// return {
		// 	isRange,
		// 	value: range?.toString() || '',
		// 	remainText,
		// 	parentNode: parentNode,
		// 	node: currentNode,
		// };
	};
	const handleParagraphSelectionChange = (e: any) => {
		// setParagraphSelection(e.target.value);

		const windowSelection: Selection | null = window.getSelection();
		const currentNode = windowSelection?.['focusNode'];
		const activeEl = editorRef.current.contains(currentNode);

		const isRange = windowSelection?.['type'] === 'Range';

		if (activeEl && isRange) {
			const parent = currentNode?.parentElement;
			const text = parent?.innerHTML || '';
			const selectedText = windowSelection?.toString();
			const regx = new RegExp(selectedText, 'i');
			const remainText = text.replace(regx, '');

			const elmt = document.createElement(e.target.value);
			elmt.contentEditable = 'true';
			elmt.innerHTML = selectedText;
			(parent as any).innerHTML = remainText;
			parent?.insertAdjacentElement('afterend', elmt);
		}
		setParagraphSelection(e.target.value);
		console.log('activeEl', activeEl);
	};

	const onHandleFocusEditor = (e: any) => {
		const nodeList = editorRef.current.childNodes;
		if (!nodeList.length) {
			addElement();
		} else {
			const isCurrent = isCurrentElement(e, editorRef);
			if (isCurrent) {
				if (nodeList.length) {
					const lastElement = [...nodeList].pop();
					if (!lastElement.innerText?.length) {
						selectEnd(lastElement);
					} else {
						addElement();
					}
				}
			}
		}
	};

	const addElement = (paraType = null, val = '') => {
		const elmt = document.createElement(paraType ? paraType : paragraphSelection);
		elmt.contentEditable = 'true';
		elmt.innerHTML = val;
		editorRef.current.appendChild(elmt);
		elmt.addEventListener('keydown', onEnter);
		elmt.focus();
	};

	const onEnter = (e: any, isParent = false) => {
		if (e.keyCode === 13) {
			e.stopPropagation();
			if (!isParent) addElement();
		}
	};

	const selectEnd = (elmt: any) => {
		const len = elmt.innerText.length;
		const range = document.createRange();
		const sel = window.getSelection();
		try {
			range.setStart(elmt.lastChild, len);
		} catch (error) {
			console.log('elmt.lastChild', elmt, elmt.lastChild);
			if (elmt.lastChild) {
				range.setStart(elmt.lastChild, elmt.lastChild.innerText.length);
			} else {
				range.setStart(elmt, 0);
			}
		} finally {
			range.collapse(true);
			sel?.removeAllRanges();
			sel?.addRange(range);
			elmt.focus();
		}
	};

	const isCurrentElement = (e: any, ref: any) => {
		return ref.current == e.target;
	};

	const paragraphProps = {
		value: paragraphSelection,
		onChange: handleParagraphSelectionChange,
	};

	return (
		<div className={styles.editor}>
			<Toolbar onBold={onBold} paragraph={paragraphProps} />

			<Editor ref={editorRef} onClick={onHandleFocusEditor} contentEditable={true} onKeyDown={(e: any) => onEnter(e, true)} />
		</div>
	);
}
