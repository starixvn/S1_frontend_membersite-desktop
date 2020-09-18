import React, { useState, useRef, useEffect } from "react";

export default ({ func, btnActive = true }) => {
	const [spin, setSpin] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const clickSpin = e => {
		e.stopPropagation();
		setSpin(true);
		if (!spin) {
			func(e);
		}
		setTimeout(() => {
			if (isMountedRef.current) {
				setSpin(false);
			}
		}, 1500);
	};

	return (
		<button
			disabled={btnActive}
			aria-label="clickSpin"
			onClick={clickSpin}
			className={`icon icon-spinner11${spin ? " active" : ""}`}></button>
	);
};
