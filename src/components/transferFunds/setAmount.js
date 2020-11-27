import React, { useState } from "react";
import Inputbox from "../common/inputbox";
import Dropdown from "../common/dropdown";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	const originOptions = props.options;
	// const [selectedFromIdx, setSelectedFromIdx] = useState(0);
	// const [selectedToIdx, setSelectedToIdx] = useState(0);
	// const [fomOptions, setFromOptions] = useState(originOptions);
	// const [toOptions, setToOptions] = useState(originOptions);

	// console.log(originOptions);
	//lbl_MainWallet
	//lbl_TpWallet_1
	//lbl_TpWallet_21

	// const onSelectFromItem = i => {
	// 	setSelectedFromIdx(i);
	// 	if (fomOptions[i].displayKey === "lbl_MainWallet") {
	// 		setToOptions(
	// 			originOptions.filter(o => o.displayKey !== "lbl_MainWallet")
	// 		);
	// 	} else {
	// 		setToOptions(
	// 			originOptions.filter(
	// 				(o, idx) =>
	// 					o.displayKey === "lbl_MainWallet"
	// 			)
	// 		);
	// 	}
	// };

	// const onSelectToItem = i => {
	// 	setSelectedToIdx(i);
	// 	setFromOptions(originOptions.filter((o, idx) => idx !== i));
	// };

	return (
		<div className="subModuleList">
			{/* {console.log(props)} */}
			<div className="walletTransfer">
				<div className="walletModule transferModule">
					<div className="inputBox-org">
						<Dropdown
							// defaultOption={t("lbl_MainWallet")}
							i18n={t}
							mainKey={`from_wallet_${props.selectedFromIdx}`}
							options={props.fomOptions}
							selectedIdx={props.selectedFromIdx}
							onSelectItem={props.onSelectFromItem.bind(this)}
							title={t("lbl_From")}
						/>
					</div>
					<div className="inputBox-blue">
						<Dropdown
							// defaultOption={t("lbl_MainWallet")}
							i18n={t}
							mainKey={`to_wallet_${props.selectedFromIdx}`}
							options={props.toOptions}
							selectedIdx={props.selectedToIdx}
							onSelectItem={props.onSelectToItem.bind(this)}
							title={t("lbl_To")}
						/>
					</div>
					{/* <div
						className={`walletBalanceModule from${
							props.transferFrom !== "lbl_MainWallet"
								? " active"
								: ""
						}`}>
						<span>
							{props.transferFrom === "lbl_MainWallet"
								? props.i18n("lbl_From")
								: props.i18n("lbl_To")}
						</span>
						<span className="active">
							{props.i18n("lbl_MainWallet")}
						</span>
					</div>
					<button
						aria-label="changeDirection"
						className="icon icon-icon32px_Double-arrow"
						onClick={props.changeDirection}></button>
					<div
						className={`walletBalanceModule to${
							props.transferTo !== "lbl_TpWallet_1"
								? " active"
								: ""
						}`}>
						<span>
							{props.transferFrom === "lbl_TpWallet_1"
								? props.i18n("lbl_From")
								: props.i18n("lbl_To")}
						</span>
						<span className="active">
							{props.i18n("lbl_TpWallet_1")}
						</span>
					</div> */}
				</div>
				<form className="inputModuleRow" onSubmit={props.clickSubmit}>
					<Inputbox
						className="inputBox-white"
						title={props.i18n("lbl_Amount")}
						value={props.amount}
						onChange={props.onChange}
						onBlur={props.onBlur}
						clickInfo={props.clickInfo}
						checked={props.checked}
						tip={props.tip}
						_isConvert={props._isConvert}
						isAmount={true}
					/>
					<div className="btnGroup">
						<button className="btn-check" type="submit">
							{props.i18n("lbl_Submit")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
