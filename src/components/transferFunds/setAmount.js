import React from "react";
import Inputbox from "../common/inputbox";

export default props => {
	return (
		<div className="subModuleList">
			<div className="walletTransfer">
				<div className="walletModule">
					<div className="walletBalanceModule from">
						<span>{props.i18n("lbl_From")}</span>
						<span className="active">
							{props.i18n(props.transferFrom)}
						</span>
					</div>
					<button
						aria-label="changeDirection"
						className="icon icon-arrow-right2"
						onClick={props.changeDirection}>
						<span>{props.i18n("lbl_Exchange")}</span>
					</button>
					<div className="walletBalanceModule to">
						<span>{props.i18n("lbl_To")}</span>
						<span className="active">
							{props.i18n(props.transferTo)}
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
