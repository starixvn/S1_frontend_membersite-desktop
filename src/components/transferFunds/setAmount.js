import React from "react";
import Inputbox from "../common/inputbox";

export default props => {
	return (
		<div className="subModuleList">
			<div className="walletTransfer">
				<div className="walletModule transferModule">
					<div
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
