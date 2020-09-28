import React, {
	Component,
	createRef,
	useContext,
	useEffect,
	useRef
} from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import path from "../../path";
import { walletInfoContext, userInfoContext } from "../common/context";
import moment from "moment";
import { isConvert, number_format } from "../common/common";
import {
	api_account_GetWalletInfo,
	api_account_SetHideBalance
} from "../../service/api/account";
import ReloadSpin from "../common/reloadSpin";

export default props => {
	const { walletInfo, setWalletInfo } = useContext(walletInfoContext);
	const { userInfo } = useContext(userInfoContext);
	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const RefreshBalance = () => {
		api_account_GetWalletInfo().then(res => {
			if (res.data.errorCode === 0 && isMountedRef.current) {
				let tpWallets = res.data.data.tpWallets?.map(t => {
					return {
						tpId: t.tpId,
						balance: t.balance
					};
				});
				setWalletInfo(prevState => ({
					...prevState,
					main: res.data.data.balance,
					tpWallets: tpWallets,
					lastTransaction: res.data.data.lastTransaction
				}));
			}
		});
	};

	const HandleDisplayBalance = (value, e) => {
		e.stopPropagation();
		setWalletInfo(prevS => ({ ...prevS, isHideBalance: value }));
		api_account_SetHideBalance({ value });
	};

	return userInfo.isLogin && userInfo.currencyId !== undefined ? (
		<Dropdown
			{...props}
			lastTransaction={walletInfo.lastTransaction}
			lastLogin={userInfo.lastLogin}
			currencyId={userInfo.currencyId}
			walletInfo={walletInfo}
			_isConvert={isConvert(userInfo.currencyId)}
			RefreshBalance={RefreshBalance}
			HandleDisplayBalance={HandleDisplayBalance}
		/>
	) : (
		<></>
	);
};

class Dropdown extends Component {
	constructor(props) {
		super(props);
		if (typeof document !== `undefined`) {
			document.addEventListener("mousedown", this.handleClickOutside);
		}
		this.state = { isOpen: false };
		this.wrapper = createRef(null);
	}

	handleClickOutside = e => {
		if (this.wrapper.current && !this.wrapper.current.contains(e.target)) {
			this.setState({ isOpen: false });
		}
	};

	clickDropdown = e => {
		e.preventDefault();
		this.setState({ isOpen: !this.state.isOpen });
	};

	render() {
		let isHideBalance = this.props.walletInfo?.isHideBalance;

		let balance = isHideBalance
			? "*****"
			: this.props.walletInfo.main
			? number_format(this.props.walletInfo.main, false)
			: 0;

		const tpWallets =
			this.props.walletInfo.tpWallets &&
			this.props.walletInfo.tpWallets.map(t => {
				return (
					<div
						className="walletBalance"
						key={`header-tpwallet-${t.tpId}`}>
						<span>{this.props.i18n(`lbl_TpWallet_${t.tpId}`)}</span>
						<span>
							{isHideBalance
								? "*****"
								: number_format(t.balance, false)}
						</span>
					</div>
				);
			});

		return (
			<div
				className={`wallet icon icon-balance${
					this.state.isOpen ? " active" : ""
				}`}
				ref={this.wrapper}
				onClick={this.clickDropdown}>
				<button>
					{`${
						this.props.currencyId === 51
							? "VNĐ"
							: this.props.i18n(
									`Currency_${this.props.currencyId}`
							  )
					} ${balance}`}
				</button>
				<button
					aria-label="HandleDisplayBalance"
					onClick={this.props.HandleDisplayBalance.bind(
						this,
						!isHideBalance
					)}
					className={`icon icon-eye${
						isHideBalance ? "-blocked" : ""
					}`}></button>
				<div className="submenu">
					<div className="balance">
						<span>{`${this.props.i18n(
							`Currency_${this.props.currencyId}`
						)}`}</span>
						<span>
							{balance}
							<ReloadSpin
								btnActive={false}
								func={this.props.RefreshBalance}
							/>
						</span>
					</div>
					{tpWallets}
					<div className="btnGroup">
						<Link
							to={`${this.props.langId}/${path.deposit.root}`}
							className="orange">
							{this.props.i18n("lbl_Deposit")}
						</Link>
						<Link
							to={`${this.props.langId}/${path.transferFunds.root}`}
							className="orange">
							{this.props.i18n("lbl_TransferFunds")}
						</Link>
					</div>
					<div className="loginLog">
						<span>{this.props.i18n("lbl_LastLogin")}</span>
						<span>
							{this.props.lastLogin
								? moment(this.props.lastLogin).format("l LTS")
								: null}
						</span>
					</div>
					<div className="transactionLog">
						<span>{this.props.i18n("lbl_LastTransaction")}</span>
						<span>
							{this.props.lastTransaction
								? moment(this.props.lastTransaction).format(
										"l LTS"
								  )
								: null}
						</span>
					</div>
				</div>
			</div>
		);
	}
}

Dropdown.propTypes = {
	i18n: PropTypes.func.isRequired
};
