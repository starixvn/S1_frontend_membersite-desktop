import React, { createRef, Component } from "react";
import SubMenu from "./header.menu.sub";
import { defMenuLinks, defSubListClassName } from "./header.menu.def";
import MainMenu from "./header.menu.main";

export default class Panel extends Component {
	constructor(props) {
		super(props);
		this.state = { menuKey: "", casinoTpIds: [] };
		this.wrapper = createRef(null);
	}

	handleMoveToOutside = e => {
		if (this.wrapper.current && !this.wrapper.current.contains(e.target)) {
			this.setState({ menuKey: "" });
		}
	};

	componentDidMount() {
		if (typeof document !== `undefined`) {
			document.addEventListener(
				"mouseover",
				this.handleMoveToOutside,
				true
			);
		}
	}

	showSubMenu = col => {
		this.setState({ menuKey: col });
	};

	componentWillMount() {
		if (typeof document !== `undefined`) {
			document.removeEventListener(
				"mouseover",
				this.handleMoveToOutside,
				false
			);
		}
	}

	render() {
		let subItems = null;
		let mainUrl = "";
		if (typeof defMenuLinks[this.state.menuKey]?.subMenu !== undefined) {
			subItems = defMenuLinks[this.state.menuKey]?.subMenu;
			mainUrl = defMenuLinks[this.state.menuKey]?.path;
			if (
				this.state.menuKey === "casino" &&
				subItems &&
				this.props.casinoTpIds?.length > 0
			) {
				subItems = subItems.filter(s =>
					this.props.casinoTpIds.includes(s.tpId)
				);
			}
		}

		return (
			<div className="menu">
				<MainMenu showSubMenu={this.showSubMenu} />
				{subItems ? (
					<div className="subMenu-Wrapper active" ref={this.wrapper}>
						<SubMenu
							MenuKey={this.state.menuKey}
							listClassName={
								defSubListClassName[this.state.menuKey]
							}
							mainUrl={mainUrl}
							subItems={subItems}
						/>
					</div>
				) : null}
			</div>
		);
	}
}
