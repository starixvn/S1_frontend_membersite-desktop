import React from "react";
import { number_format } from "../common/common";
import PropTypes from "prop-types";
import ReloadSpin from "../common/reloadSpin";

const ShowWallet = props => {
	let { walletInfo } = props;

	const walletCardList = walletInfo.map((item, idx) => {
		return (
			<div className="walletBalanceModule" key={`wallets-${idx}`}>
				<span className={`icon ${item.walletIcon}`}>
					{props.i18n(item.displayKey)}
				</span>
				<span>{number_format(item.balance, props._isConvert)}</span>
				<div className="btnGroup">
					<button
						className="orange"
						onClick={props.restoreAll.bind(this, item.id)}>
						{props.i18n("lbl_RestoreAll")}
					</button>
				</div>
			</div>
		);
	});

	return (
		<div className="walletModule">
			{walletCardList}
			<ReloadSpin btnActive={false} func={props.getAllWalletData} />
		</div>
	);
};

export default ShowWallet;

ShowWallet.propTypes = {
	i18n: PropTypes.func.isRequired,
	_isConvert: PropTypes.bool.isRequired,
	restoreAll: PropTypes.func.isRequired,
	getAllWalletData: PropTypes.func.isRequired
};
