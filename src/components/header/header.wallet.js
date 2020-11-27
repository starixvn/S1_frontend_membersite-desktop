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
import {
	walletInfoContext,
	userInfoContext,
	bonusWalletsContext
} from "../common/context";
import moment from "moment";
import { isConvert, number_format } from "../common/common";
import {
	api_account_SetHideBalance,
	api_account_GetTpWalletList,
	api_account_GetTpWalletBalance
} from "../../service/api/account";
import ReloadSpin from "../common/reloadSpin";
import HeaderProcessBar from "./header.processBar";

export default props => {
	const { walletInfo, setWalletInfo, getContentWalletInfo } = useContext(
		walletInfoContext
	);
	const { bonusWallets } = useContext(bonusWalletsContext);
	const { userInfo } = useContext(userInfoContext);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

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
			bonusWallets={bonusWallets}
			_isConvert={isConvert(userInfo.currencyId)}
			getContentWalletInfo={getContentWalletInfo}
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

		this.state = {
			isOpen: false,
			tpWalletsData: []
		};
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

	componentDidMount() {
		this.getTpWalletsData();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.walletInfo !== this.props.walletInfo) {
			this.getTpWalletsData();
		}
	}

	getTpWalletsData = async () => {
		try {
			const res = await api_account_GetTpWalletList(1);
			if (res.data.errorCode === 0 && res.data.data) {
				res.data.data.forEach(tp => {
					this.getTpWalletBalances(tp);
				});
			}
		} catch (error) {}
	};

	getTpWalletBalances = async ({ tpId }) => {
		if (!tpId) return;
		try {
			const res = await api_account_GetTpWalletBalance(tpId);
			if (res.data.errorCode === 0) {
				let data = res.data.data;
				let prevState = this.state.tpWalletsData;
				let idx = prevState.findIndex(x => x.tpId === data.tpId);
				let newData = null;
				if (idx !== -1) {
					prevState[idx].balance = data.balance;
					newData = prevState;
				} else {
					newData = [...prevState, data];
				}
				this.setState({ tpWalletsData: newData });
			}
		} catch (error) {}
	};

	render() {
		let { tpWalletsData } = this.state;
		let isHideBalance = this.props.walletInfo?.isHideBalance;

		let allTpWalletBalance = tpWalletsData.reduce((prev, curr) => {
			return prev + curr.balance;
		}, 0);

		let balance = isHideBalance
			? "*****"
			: this.props.walletInfo[0].balance === null
			? 0
			: number_format(
					this.props.walletInfo[0].balance + allTpWalletBalance,
					this.props._isConvert
			  );

		let showTpWallets = () => {
			let tpWallets;
			try {
				if (tpWalletsData && tpWalletsData.length > 0) {
					tpWallets = tpWalletsData.map(t => {
						return (
							<div
								className="walletBalance"
								key={`header-tpwallet-${t.tpId}`}>
								<div>
									<span>
										{this.props.i18n(
											`lbl_TpWallet_${t.tpId}`
										)}
									</span>
									<span>
										{number_format(
											t.balance,
											this.props._isConvert
										)}
									</span>
								</div>
							</div>
						);
					});
				}
			} catch (error) {}
			return tpWallets;
		};

		const bonusWallets = this.props.bonusWallets.map(item => {
			return (
				<div
					className="walletBalance"
					key={`header-bonuswallet-${item.tpId}`}>
					<div>
						<span>
							{this.props.i18n(
								`lbl_BonusWallet_${item.promoCategoryId}`
							)}
						</span>
						<span>{number_format(item.bonus)}</span>
					</div>
					<HeaderProcessBar
						turnover={item.turnover}
						rollover={item.rollover}
					/>
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
							{number_format(
								this.props.walletInfo[0].balance,
								this.props._isConvert
							)}
							<ReloadSpin
								btnActive={false}
								func={this.props.getContentWalletInfo}
							/>
						</span>
					</div>

					{bonusWallets}
					{showTpWallets()}

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
