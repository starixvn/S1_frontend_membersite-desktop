import React, { Component, createRef } from "react";
import moment from "moment";
import DateTime from "react-datetime";
import { number_format } from "../common/common";
import {
	api_payment_UploadReceipt,
	api_payment_SetDepositReceipt
} from "../../service/api/payment";
import config from "../../config";
import ClipboardJS from "../../lib/clipboard.min";
import Inputbox from "../common/inputbox";
import { defPopBoxType } from "../common/popBox";

export class Module extends Component {
	state = {
		processing: false,
		depositTime: this.props.depositTime ? this.props.depositTime : moment(),
		refId: this.props.refId ? this.props.refId : "",
		picFileName: this.props.picFileName ? this.props.picFileName : null,
		fileImg: null,
		refIdStatus: { checked: null, tip: "" },
		picFormatTip: null,
		depositTimeTip: ""
	};
	isMountedRef = false;
	filebox = createRef();

	componentDidMount() {
		this.isMountedRef = true;

		this._clipboard = new ClipboardJS(".copyBtn");
		this._clipboard.on("success", e => {});
		this._clipboard.on("error", e => {});
	}

	componentWillUnmount() {
		this.isMountedRef = false;

		this._clipboard.destroy();
	}

	onUploadFile = (action, e) => {
		e.preventDefault();
		let files =
			action === "onDrop"
				? e.dataTransfer.files
				: this.filebox.current.files;

		this.setState({ picFileName: files[0].name });

		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = () => {
			this.setState({ fileImg: reader.result });
		};

		if (files.length > 0 && files[0].type.includes("image")) {
			this.setState({ picFormatTip: null });

			let formData = new FormData();
			formData.append("TransId", this.props.transId);
			formData.append("Receipt", files[0]);

			api_payment_UploadReceipt(formData).then(
				res => {
					if (this.isMountedRef) {
						if (res.data.errorCode === 0) {
							if (this.props.refreshDatas) {
								this.props.refreshDatas();
							}
						} else {
							alert(res.data.message);
						}
					}
				},
				err => {
					if (this.isMountedRef) {
						alert(this.datas.i18n("msg_ApiServerError"));
					}
				}
			);
		} else {
			this.setState({
				picFileName: null,
				picFormatTip: this.props.i18n("lbl_PicFormatTip")
			});
		}
	};

	dragOver = e => {
		e.preventDefault();
	};

	editField = (col, value, e) => {
		this.setState({ [col]: value === null ? e.target.value : value });
	};

	clickSubmit = e => {
		e.preventDefault();
		if (!this.state.processing) {
			this.setState({ processing: true });

			if (this.state.refId !== "") {
				api_payment_SetDepositReceipt(
					this.props.transId,
					moment(this.state.depositTime).unix(),
					this.state.refId
				).then(
					res => {
						if (this.isMountedRef) {
							this.setState({ processing: false });

							if (res.data.errorCode === 0) {
								const ClickClose = () => {
									if (this.props.refreshDatas) {
										this.props.refreshDatas();
									} else if (this.props.backDeposit) {
										this.props.backDeposit();
									}
									this.props.ClosePopBox();
								};

								this.props.setPopBox(prevS => ({
									isOpen: true,
									popBoxType: defPopBoxType.Success,
									prevBtnBar: prevS.btnBar,
									btnBar: (
										<div className="btnGroup">
											<button
												className="btn-cancel"
												onClick={ClickClose}>
												OK
											</button>
										</div>
									)
								}));
							} else {
								alert(res.data.message);
							}
						}
					},
					err => {
						if (this.isMountedRef) {
							alert(this.props.i18n("msg_ApiServerError"));
							this.setState({ processing: false });
						}
					}
				);
			} else {
				if (this.isMountedRef) {
					this.setState({
						refIdStatus: {
							checked: false,
							tip: this.props.i18n("lbl_RemindForRefNum")
						}
					});
					this.setState({ processing: false });
				}
			}
		}
	};

	checkTip = e => {
		let val = e.target.value;

		let _tip = val === "" ? this.props.i18n("lbl_RemindForRefNum") : "";
		this.setState({ refIdStatus: { checked: val !== "", tip: _tip } });
	};

	clickInfo = col => {
		let _tip = "";

		if (col === "depositTimeTip") {
			_tip =
				this.state.depositTimeTip === ""
					? this.props.i18n("lbl_DepositTimeToolTip")
					: "";
			this.setState({ depositTimeTip: _tip });
		} else {
			_tip =
				this.state.refIdStatus.tip === ""
					? this.props.i18n("lbl_RefNoHint")
					: "";
			this.setState({ refIdStatus: { checked: null, tip: _tip } });
		}
	};

	render() {
		return (
			<>
				<span className="title">
					{this.props.i18n("lbl_SubmitProof")}
				</span>
				<div className="txt-lightgray">
					{this.props.i18n("lbl_AttachFile")}
				</div>
				<label
					className={`upload_img${
						this.state.picFormatTip ? " error" : ""
					}`}
					onDragOver={this.dragOver.bind(this)}
					onDrop={this.onUploadFile.bind(this, "onDrop")}>
					<input
						type="file"
						accept="image/*"
						ref={this.filebox}
						onChange={this.onUploadFile.bind(this, "onChange")}
					/>
					{this.state.picFileName ? (
						<img
							src={
								this.state.fileImg === null
									? `${config.apiURL}/${this.props.langId}/Cashier/DepositReceip.jpg?transId=${this.props.transId}&FileName=${this.state.picFileName}`
									: `${this.state.fileImg}`
							}
						/>
					) : this.state.picFormatTip ? (
						<i className="icon icon-broken_image"></i>
					) : (
						<i className="icon icon-plus"></i>
					)}
				</label>
				{this.state.picFileName !== null ? (
					<span>{this.state.picFileName}</span>
				) : this.state.picFormatTip !== null ? (
					<div className="txt-red">{this.state.picFormatTip}</div>
				) : null}
				<div className="directions">
					<ul>
						<li>{this.props.i18n("BankSlipHint1")}</li>
						<li>{this.props.i18n("BankSlipHint2")}</li>
						<li>{this.props.i18n("BankSlipHint3")}</li>
					</ul>
				</div>

				<div className="smallList checkBankSlip">
					<div className="txt-lightgray">
						{this.props.i18n("lbl_TransactionHint")}
					</div>
					<ul>
						<li>
							<div className="bankName">
								<img
									src={`${config.imgUrl}/common/images/BankLogo/${this.props.bankLogo}`}
									alt={this.props.bankName}
								/>
							</div>
						</li>
						<li>{this.props.bankName}</li>
						<li>
							<a
								href={this.props.bankSite}
								className="icon icon-new-tab"
								target="_blank">
								<span>
									{this.props.i18n("lbl_OpenOtherSite")}
								</span>
							</a>
						</li>
					</ul>
					<ul>
						<li>{this.props.i18n("lbl_BankAccountName")}</li>
						<li>{this.props.accountName}</li>
						<li>
							<button
								className="icon icon-files-empty copyBtn"
								data-clipboard-text={this.props.accountName}>
								<span>{this.props.i18n("lbl_Copy")}</span>
							</button>
						</li>
					</ul>
					<ul>
						<li>{this.props.i18n("lbl_BankNumber")}</li>
						<li>{this.props.accountNo}</li>
						<li>
							<button
								className="icon icon-files-empty copyBtn"
								data-clipboard-text={this.props.accountNo}>
								<span>{this.props.i18n("lbl_Copy")}</span>
							</button>
						</li>
					</ul>
					<ul>
						<li>{this.props.i18n("lbl_DepositAmount")}</li>
						<li>
							{number_format(
								this.props.amount,
								this.props._isConvert
							)}
						</li>
						<li>
							<button
								className="icon icon-files-empty copyBtn"
								data-clipboard-text={this.props.amount}>
								<span>{this.props.i18n("lbl_Copy")}</span>
							</button>
						</li>
					</ul>
				</div>

				<form onSubmit={this.clickSubmit}>
					<div className="inputBox-white">
						<i className="txt-blue">
							{`${this.props.i18n(
								"lbl_DepositTime"
							)} (${moment().format("Z")})`}
						</i>
						<DateTime
							value={this.state.depositTime}
							onChange={this.editField.bind(this, "depositTime")}
						/>
						<div className="iconModule">
							<i className="icon icon-calendar"></i>
							<i
								className={`icon icon-information-solid`}
								onClick={this.clickInfo.bind(
									this,
									"depositTimeTip"
								)}></i>
						</div>
					</div>
					<div
						className={`tip${
							this.state.depositTimeTip ? " active" : ""
						}`}>
						{this.state.depositTimeTip}
					</div>

					<Inputbox
						className="inputBox-white"
						title={this.props.i18n("lbl_Refno")}
						value={this.state.refId}
						onChange={this.editField.bind(this, "refId", null)}
						onBlur={this.checkTip.bind(this)}
						checked={this.state.refIdStatus.checked}
						clickInfo={this.clickInfo.bind(this, "refIdStatus")}
						tip={this.state.refIdStatus.tip}
					/>

					<div className="btnGroup">
						<button
							type="button"
							className="gray"
							onClick={this.props.ClosePopBox}>
							{this.props.i18n("lbl_Cancel")}
						</button>
						<button className="orange" type="submit">
							{this.props.i18n("lbl_Submit")}
						</button>
					</div>
				</form>
			</>
		);
	}
}
