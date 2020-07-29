import React, { Component, createRef } from "react";

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
		let arr = this.props.options.map((item, i) => {
			return (
				<Item
					key={`${this.props.mainKey}_${item.id}`}
					displayKey={item.displayKey}
					i18n={this.props.i18n}
					onClick={this.selectItem.bind(null, i)}
				/>
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
				className="dropdown"
				ref={this.wrapper}
				onClick={this.clickDropdown}>
				<i className={`icon ${this.props.icon}`}></i>
				<button className="btn">{selected}</button>
				<div
					className={`dropdown-container${
						this.state.isOpen ? " active" : ""
					}`}>
					{arr}
				</div>
			</div>
		);
	}
}

const Item = props => {
	return (
		<div className="dropdown-item" onClick={props.onClick}>
			{props.i18n(props.displayKey)}
		</div>
	);
};

export default Dropdown;
