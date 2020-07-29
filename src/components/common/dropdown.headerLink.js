import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

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
		if (this.props.clickDropdown) {
			this.props.clickDropdown();
		}
	};

	selectItem = i => {
		this.setState({ isOpen: false });
		this.props.onSelectItem(i);
	};

	render() {
		let arr = this.props.options.map(item => {
			let key = `${this.props.mainKey}_${item.displayKey}`;
			return item.elemType === defElemType.btn ? (
				<a key={key} className={item.icon} onClick={item.href}>
					{this.props.i18n(item.displayKey)}
				</a>
			) : (
				<Link key={key} to={`${this.props.langId}/${item.href}`}>
					{this.props.i18n(item.displayKey)}
				</Link>
			);
		});

		let selected = null;
		if (this.props.options[this.props.selectedIdx]) {
			let _s = this.props.options[this.props.selectedIdx];

			if (_s.displayText) {
				selected = _s.displayText;
			} else {
				selected = this.props.i18n(_s.displayKey);
			}
		} else {
			selected = this.props.placeholder;
		}

		return (
			<div
				className={`${this.props.className}${
					this.state.isOpen ? " active" : ""
				}`}
				ref={this.wrapper}
				onClick={this.clickDropdown}>
				<button>{selected}</button>
				<div className={this.props.subClassName}>{arr}</div>
			</div>
		);
	}
}

const Item = props => {
	return;
};

Dropdown.propTypes = {
	className: PropTypes.string.isRequired,
	subClassName: PropTypes.string.isRequired,
	i18n: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
	mainKey: PropTypes.string.isRequired,
	placeholder: PropTypes.string
};

export const defElemType = {
	btn: "btn"
};

export default Dropdown;
