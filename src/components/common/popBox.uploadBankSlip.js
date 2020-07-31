import React, { useContext } from "react";
import { popBoxContext } from "../common/context";

export default () => {
	const { popBox, setPopBox } = useContext(popBoxContext);
	const ClosePopBox = () => {
		setPopBox({
			isOpen: false
		});
	};

	return (
		<div className="upload active">
			<span className="title">Upload Bank Slip</span>
			<div className="txt-lightgray">
				Please attach your bank slip here.
			</div>
			<label className="upload_img">
				<input type="file" />
				<i className="icon icon-plus"></i>
			</label>
			<div className="directions">
				<ul>
					<li>Maximum file siz 4 MB each</li>
					<li>Maximum number of file:1</li>
					<li>Accepted file types: JPG, JPGE, PNG, GIF</li>
				</ul>
			</div>
			<div className="inputBox-white">
				<i className="txt-blue">Amount</i>
				<input placeholder="YY/MM/DD (+08:00)" />
				<div className="iconModule">
					<i className="icon icon-calendar"></i>
					<i className="icon icon-information-solid"></i>
				</div>
			</div>
			<div className="inputBox-white">
				<i className="txt-blue">Reference No.</i>
				<input />
				<div className="iconModule">
					<i className="icon icon-information-solid"></i>
				</div>
			</div>
			<div className="btnGroup">
				<button className="gray" onClick={ClosePopBox}>
					Cancel
				</button>
				<button className="orange">Submit</button>
			</div>
		</div>
	);
};
