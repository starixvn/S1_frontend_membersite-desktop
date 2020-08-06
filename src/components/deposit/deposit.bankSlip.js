import React, {
	useContext,
	useEffect,
	useState,
	useRef,
	createRef,
	Component
} from "react";
import moment from "moment";
import DateTime from "react-datetime";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { number_format, isConvert } from "../common/common";
import {
	api_payment_UploadReceipt,
	api_payment_SetDepositReceipt
} from "../../service/api/payment";
import style from "../../styles/css/datePicker.css";
import config from "../../config";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	return (
		<>
			<section className="inside">
				<div id="leftMenu"></div>
				<div className="rightModule">
					<div className="infoModule">
						<div className="deposit-title icon icon-library">
							<span>{t("lbl_Deposit")}</span>
							<div>{t("lbl_DepositOptionHint")}</div>
						</div>
						<div className="slipInfo">
							<button className="icon icon-arrow-left2"></button>
							<div className="smallList">
								<ul>
									<li>
										{t("lbl_Date")} ({moment().format("Z")})
									</li>
									<li>
										{moment(props.datas.depositTime).format(
											"YYYY/MM/DD HH:mm:ss A"
										)}
									</li>
									<li>{t("lbl_ID")}</li>
									<li>{props.datas.transId}</li>
									<li>{t("lbl_RealName")}</li>
									<li>{props.datas.accountName}</li>
									<li>{t("lbl_BankName")}</li>
									<li>{props.datas.bankName}</li>
									<li>{t("lbl_DepositAmount")}</li>
									<li>{props.datas.amount}</li>
								</ul>
							</div>
							<div className="subModuleList">
								<div className="subModule">
									<div className="subModuleBody column align-items-center">
										<Module i18n={t} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export class Module extends Component {
	state = {
		processing: false,
		depositTime: this.props.depositTime ? this.props.depositTime : null,
		refId: this.props.refId ? this.props.refId : "",
		picFileName: this.props.picFileName ? this.props.picFileName : null,
		fileImg: null
	};
	isMountedRef = false;
	filebox = createRef();

	componentDidMount() {
		this.isMountedRef = true;
	}

	componentWillUnmount() {
		this.isMountedRef = false;
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

		if (files.length > 0) {
			let formData = new FormData();
			formData.append("TransId", this.props.transId);
			formData.append("Receipt", files[0]);
			api_payment_UploadReceipt(formData).then(
				res => {
					if (this.isMountedRef) {
						if (res.data.errorCode === 0) {
							alert(this.props.i18n("lbl_UploadSuccess"));
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
			let bankSlip = this.props.bankSlip;

			if (this.state.refId !== "") {
				api_payment_SetDepositReceipt(
					this.props.transId,
					moment(this.state.depositTime).unix(),
					this.state.refId
				).then(
					res => {
						if (this.isMountedRef) {
							if (res.data.errorCode === 0) {
								alert(this.props.i18n("lbl_UpdateSuccess"));
							} else {
								alert(res.data.message);
							}
							if (this.props.refreshDatas) {
								this.props.refreshDatas();
							} else if (this.props.backDeposit) {
								this.props.backDeposit();
							}
							this.setState({ processing: false });
							if (this.props.ClosePopBox) {
								this.props.ClosePopBox();
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
					alert(this.props.i18n("lbl_RemindForRefNum"));
					this.setState({ processing: false });
				}
			}
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
					className="upload_img"
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
									? `${config.apiURL}/Cashier/DepositReceip.jpg?transId=${this.props.transId}&FileName=${this.state.picFileName}`
									: `${this.state.fileImg}`
							}
						/>
					) : (
						<i className="icon icon-plus"></i>
					)}
				</label>
				{this.state.picFileName !== null ? (
					<span>{this.state.picFileName}</span>
				) : null}
				<div className="directions">
					<ul>
						<li>{this.props.i18n("BankSlipHint1")}</li>
						<li>{this.props.i18n("BankSlipHint2")}</li>
						<li>{this.props.i18n("BankSlipHint3")}</li>
					</ul>
				</div>
				<form onSubmit={this.clickSubmit}>
					<div className="inputBox-white">
						<i className="txt-blue">
							{this.props.i18n("lbl_DepositTime")}
						</i>
						<DateTime
							value={moment(this.state.depositTime).format(
								"YYYY-MM-DD HH:mm A"
							)}
							onChange={this.editField.bind(this, "depositTime")}
						/>
						<div className="iconModule">
							<i className="icon icon-calendar"></i>
							<i className="icon icon-information-solid"></i>
						</div>
					</div>
					<div className="inputBox-white">
						<i className="txt-blue">
							{this.props.i18n("lbl_Refno")}
						</i>
						<input
							value={this.state.refId}
							onChange={this.editField.bind(this, "refId", null)}
						/>
						<div className="iconModule">
							<i className="icon icon-information-solid"></i>
						</div>
					</div>
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
