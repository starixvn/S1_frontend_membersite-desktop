import React, { useContext, useEffect, useRef, useState } from "react";
import { popBoxContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { Module } from "../deposit/deposit.bankSlip";

export default props => {
	const { t } = useTranslation();
	const { popBox, setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClosePopBox = () => {
		setPopBox({
			isOpen: false
		});
		if (props.backDeposit) {
			props.backDeposit();
		}
	};

	return (
		<div className="upload active">
			<Module i18n={t} {...props} ClosePopBox={ClosePopBox} />
		</div>
	);
};
