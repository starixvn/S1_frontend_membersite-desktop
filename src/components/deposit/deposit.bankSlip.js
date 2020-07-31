import React, {
	useContext,
	useEffect,
	useState,
	useRef,
	createRef,
	Component
} from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { number_format, isConvert } from "../common/common";
import {
	api_payment_UploadReceipt,
	api_payment_SetDepositReceipt
} from "../../service/api/payment";

const fakeData = {
	createTime: "2020-07-30T08:01:05-04:00",
	depositType: 3,
	transId: "DP24921",
	amount: 1000,
	status: 1,
	depositRep: {
		ver: 1,
		sysId: 10,
		accountName: "Charin Boonkiriyaeat",
		accountNo: "1752547396",
		currencyId: 4
	},
	bankInfo: {
		sysId: 10,
		currencyId: 4,
		bankCode: "SCB",
		bankName: "Siam Commercial Bank",
		bankLogo: "SCB.png",
		bankSite: "https://www.scbeasy.com/v1.4/site/presignon/en/srv/srv.asp"
	},
	refId: null,
	depositTime: "0001-01-01T00:00:00",
	picFileName: null
};

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});
	return <Module data={fakeData} i18n={t} />;
};

class Module extends Component {
	state = { processind: false };
	isMountedRef = false;
	filebox = React.createRef();

	componentDidMount() {
		this.isMountedRef = true;
	}
	componentWillUnmount() {
		this.isMountedRef = false;
	}

	onUploadFile = () => {
		let files = this.filebox.current.files;
		if (files.length > 0) {
			let formData = new FormData();
			formData.append("TransId", this.props.data.transId);
			formData.append("Receipt", files[0]);
			api_payment_UploadReceipt(formData).then(res => {
				if (this.isMountedRef) {
					console.log(res);
				}
			});
		}
	};

	render() {
		return (
			<section className="inside">
				<div id="leftMenu"></div>
				<div className="rightModule">
					<div className="infoModule">
						<div className="deposit-title icon icon-library">
							<span>{this.props.i18n("lbl_Deposit")}</span>
							<div>
								{this.props.i18n("lbl_DepositOptionHint")}
							</div>
						</div>
						<div className="slipInfo">
							<button className="icon icon-arrow-left2"></button>
							<div className="smallList">
								<ul>
									<li>
										{this.props.i18n("lbl_Date")} (
										{moment().format("Z")})
									</li>
									<li>
										{moment(
											this.props.data.createTime
										).format("YYYY/MM/DD HH:mm:ss A")}
									</li>
									<li>ID</li>
									<li>{this.props.data.transId}</li>
									<li>{this.props.i18n("lbl_RealName")}</li>
									<li>
										{this.props.data.depositRep.accountName}
									</li>
									<li>{this.props.i18n("lbl_BankName")}</li>
									<li>{this.props.data.bankInfo.bankName}</li>
									<li>
										{this.props.i18n("lbl_DepositAmount")}
									</li>
									<li>{this.props.data.amount}</li>
								</ul>
							</div>
						</div>
						<div className="subModuleList">
							<div className="subModule">
								<div className="subModuleBody column align-items-center">
									<span className="title">
										{this.props.i18n("lbl_SubmitProof")}
									</span>
									<div className="txt-lightgray">
										{this.props.i18n("lbl_AttachFile")}
									</div>
									<label className="upload_img">
										<input
											type="file"
											accept="image/*"
											ref={this.filebox}
											onChange={this.onUploadFile}
										/>
										<i className="icon icon-plus"></i>
									</label>
									<div className="directions">
										<ul>
											<li>Maximum file siz 4 MB each</li>
											<li>Maximum number of file:1</li>
											<li>
												Accepted file types: JPG, JPGE,
												PNG, GIF
											</li>
										</ul>
									</div>
									<div className="inputBox-white">
										<i className="txt-blue">
											{this.props.i18n("lbl_DepositTime")}
										</i>
										<input placeholder="YY/MM/DD (+08:00)" />
										<div className="iconModule">
											<i className="icon icon-calendar"></i>
											<i className="icon icon-information-solid"></i>
										</div>
									</div>
									<div className="inputBox-white">
										<i className="txt-blue">
											{this.props.i18n("lbl_Refno")}
										</i>
										<input />
										<div className="iconModule">
											<i className="icon icon-information-solid"></i>
										</div>
									</div>
									<div className="btnGroup">
										<button className="orange">
											{this.props.i18n("lbl_Submit")}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
