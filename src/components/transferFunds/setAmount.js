import React, { useState } from "react";
import Inputbox from "../common/inputbox";
import Dropdown from "../common/dropdown";
import { useTranslation } from "react-i18next";

export default props => {
	const { t } = useTranslation();
	const originOptions = props.options;

	return (
		<div className="subModuleList">
			{/* {console.log(props)} */}
			<div className="walletTransfer">
				<div className="walletModule transferModule">
					<div className="inputBox-org">
						<Dropdown
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
							i18n={t}
							mainKey={`to_wallet_${props.selectedFromIdx}`}
							options={props.toOptions}
							selectedIdx={props.selectedToIdx}
							onSelectItem={props.onSelectToItem.bind(this)}
							title={t("lbl_To")}
						/>
					</div>
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
