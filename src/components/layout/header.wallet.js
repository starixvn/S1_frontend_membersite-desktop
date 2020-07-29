import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import path from "../../path";

export class Dropdown extends Component {
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
		return (
			<div
				className={`wallet icon icon-balance${
					this.state.isOpen ? " active" : ""
				}`}
				ref={this.wrapper}
				onClick={this.clickDropdown}>
				<button>$159.66</button>
				<div className="submenu">
					<div className="balance">
						<span>VND</span>
						<span>
							159.66('000')<i className="icon icon-spinner11"></i>
						</span>
					</div>
					<div className="walletBalance">
						<span>Sportsbook Wallet</span>
						<span>0('000')</span>
					</div>
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
						<span>Last Login</span>
						<span>7/3/2020 8:04:32 PM</span>
					</div>
					<div className="transactionLog">
						<span>Last Transaction</span>
						<span>7/3/2020 8:04:32 PM</span>
					</div>
				</div>
			</div>
		);
	}
}

Dropdown.propTypes = {
	i18n: PropTypes.func.isRequired
};

export default Dropdown;
