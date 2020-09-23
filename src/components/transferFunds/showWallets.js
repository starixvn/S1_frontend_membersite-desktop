import React from "react";
import { number_format } from "../common/common";
import PropTypes from "prop-types";
import ReloadSpin from "../common/reloadSpin";

const ShowWallet = props => {
	let arr = props.walletInfo?.map((item, idx) => {
		return (
			<div className="walletBalanceModule" key={`wallets-${item.id}`}>
				<span className="icon icon-balance">
					{props.i18n(item.displayKey)}
				</span>
				<span>{number_format(item.balance, props._isConvert)}</span>
				<div className="btnGroup">
					<button
						className="orange"
						onClick={props.restoreAll.bind(this, idx)}>
						{props.i18n("lbl_RestoreAll")}
					</button>
				</div>
			</div>
		);
	});
	return (
		<div className="walletModule">
			{arr}
			<ReloadSpin btnActive={false} func={props.getWalletData} />
		</div>
	);
};

export default ShowWallet;

ShowWallet.propTypes = {
	walletInfo: PropTypes.array.isRequired,
	i18n: PropTypes.func.isRequired,
	_isConvert: PropTypes.bool.isRequired,
	restoreAll: PropTypes.func.isRequired,
	getWalletData: PropTypes.func.isRequired
};
