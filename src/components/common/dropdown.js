import React, { Component, createRef } from "react";

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
					displayText={item.displayText}
					imgUrl={this.props.imgUrl + item.image}
					className={this.props.className}
				/>
			);
		});

		let selected = null;
		if (
			this.props.options?.length > 0 &&
			this.props.options[this.props.selectedIdx]
		) {
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
				{this.props.icon ? (
					<i className={`icon ${this.props.icon}`}></i>
				) : null}
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
			{props.imgUrl ? (
				<>
					<div className={props.className}>
						<img src={props.imgUrl} alt="" />
					</div>
					<div>{props.displayText}</div>
				</>
			) : props.displayText ? (
				props.displayText
			) : (
				props.i18n(props.displayKey)
			)}
		</div>
	);
};

export default Dropdown;
