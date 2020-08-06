import React, { useContext, useState, useEffect, useRef } from "react";
import moment from "moment";
import { number_format } from "../common/common";
import { userInfoContext, popBoxContext } from "../common/context";
import { api_payment_DepositReqWireTransfer } from "../../service/api/payment";
import { useTranslation } from "react-i18next";
import { Redirect } from "@reach/router";
import { defActionType } from "./locaLBank.reducer";
import { defPopBoxType } from "../common/popBox";
import config from "../../config";
import path from "../../path";

export default ({ bankInfo, amount, _isConvert, dispatch }) => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);
	const [redirectPath, setRedirectPath] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClickCancel = () => {
		const ClickYes = () => {
			setPopBox({
				isOpen: false
			});
			setRedirectPath(`/${userInfo.langId}/${path.deposit.root}`);
		};

		const ClickNo = () => {
			setPopBox({ isOpen: false });
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Cancel,
			btnBar: (
				<div className="btnGroup">
					<button className="gray" onClick={ClickNo}>
						No
					</button>
					<button className="orange" onClick={ClickYes}>
						Yes
					</button>
				</div>
			)
		});
	};

	const ClickSubmit = () => {
		api_payment_DepositReqWireTransfer({
			amount: Number(amount),
			sysId: bankInfo.sysId
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;

						const backDeposit = () => {
							setRedirectPath(
								`/${userInfo.langId}/${path.deposit.root}`
							);
						};

						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.UploadBankSlip,
							depositTime: `${moment().format(
								"yyyy-MM-DD "
							)}${moment().format("HH:mm A")}`,
							amount: number_format(amount, _isConvert),
							backDeposit: backDeposit,
							...datas
						});
					} else {
						alert(res.data.message);
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
				}
			}
		);
	};

	return redirectPath === null ? (
		<div className="subModuleList">
			<div className="subModule">
				<div className="subModuleBody column align-items-center">
					<span className="title">Important Note</span>
					<div className="txt-lightgray">
						Please confirm the deposit information.
					</div>
					<div className="bankName">
						<img
							src={`${config.imgUrl}/common/images/BankLogo/${bankInfo.bankLogo}`}
							alt={bankInfo.bankName}
						/>
					</div>
					<div className="smallList">
						<ul>
							<li>Selected Bank</li>
							<li>{bankInfo.bankName}</li>
						</ul>
						<ul>
							<li>Deposit Amount</li>
							<li>
								{number_format(
									_isConvert ? amount * 1000 : amount,
									_isConvert
								)}
							</li>
						</ul>
					</div>
					<div className="btnGroup">
						<button onClick={ClickCancel} className="gray">
							{t("lbl_Cancel")}
						</button>
						<button onClick={ClickSubmit} className="orange">
							{t("lbl_Submit")}
						</button>
					</div>
				</div>
			</div>
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
