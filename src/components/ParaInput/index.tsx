import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const ParaInput = forwardRef(({ data }: any, ref) => {
	const innerRef = useRef<any>(null);
	useImperativeHandle(
		ref,
		() => {
			return {
				data: innerRef.current.innerText,
			};
		},
		[]
	);

	return (
		<p ref={innerRef} contentEditable={true}>
			{data}
		</p>
	);
});
export default ParaInput