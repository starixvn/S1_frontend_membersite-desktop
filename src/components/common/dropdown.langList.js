import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { api_account_SetLanguage } from "../../service/api/account";
import { getNewLanguagePath, setCookie } from "../common/common";

const defLangDisplayText = {
	en: "English",
	cs: "简体中文",
	id: "Indonesian",
	th: "ภาษาไทย"
};

const defLangList = () =>
	Object.keys(defLangDisplayText).map(k => {
		return { icon: `flag ${k}`, value: k };
	});

export class Dropdown extends Component {
	constructor(props) {
		super(props);

		this.state = { isOpen: false };
		this.wrapper = createRef(null);
	}

	componentDidMount() {
		if (typeof document !== `undefined`) {
			document.addEventListener("mousedown", this.handleClickOutside);
		}
	}

	componentWillMount() {
		if (typeof document !== `undefined`) {
			document.removeEventListener("mousedown", this.handleClickOutside);
		}
	}

	handleClickOutside = e => {
		if (this.wrapper.current && !this.wrapper.current.contains(e.target)) {
			this.setState({ isOpen: false });
		}
	};

	clickDropdown = e => {
		e.preventDefault();
		this.setState({ isOpen: !this.state.isOpen });
		if (this.props.clickDropdown) {
			this.props.clickDropdown();
		}
	};

	selectItem = async (value, newPath) => {
		this.setState({ isOpen: false });
		if (this.props.isLogin) {
			try {
				api_account_SetLanguage(value);
			} catch (e) {}
		}

		window.location.href = newPath;
		setCookie("goalLangId", value);
	};

	render() {
		let arr = defLangList().map((item, idx) => {
			let key = `${this.props.mainKey}_${idx}`;

			return (
				<button
					key={key}
					// to={newPathArr}
					className={item.icon}
					onClick={this.selectItem.bind(
						this,
						item.value,
						getNewLanguagePath(item.value)
					)}>
					{defLangDisplayText[item.value]}
				</button>
			);
		});

		let selected = (
			<button className={`flag ${this.props.selectedValue}`}>
				{/* {defLangDisplayText[this.props.selectedValue]} */}
			</button>
		);

		return (
			<div
				className={`${this.props.className}${
					this.state.isOpen ? " active" : ""
				}`}
				ref={this.wrapper}
				onClick={this.clickDropdown}>
				{selected}
				<div className={this.props.subClassName}>{arr}</div>
			</div>
		);
	}
}

Dropdown.propTypes = {
	className: PropTypes.string.isRequired,
	subClassName: PropTypes.string.isRequired,
	mainKey: PropTypes.string.isRequired,
	selectedValue: PropTypes.string.isRequired
};

export default Dropdown;
