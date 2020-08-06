import React, { useContext, useEffect, useState, useRef } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import { TransactionHistory } from "./deposit.historyResult";
import {
	api_payment_GetDepositInfoRecent,
	api_payment_SetDepositCancel
} from "../../service/api/payment";
import { isConvert, number_format } from "../common/common";
import { defPopBoxType } from "../common/popBox";

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const [getHistory, setGetHistory] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetRecentDatas();
	}, []);

	const GetRecentDatas = () => {
		api_payment_GetDepositInfoRecent().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetHistory(res.data.data);
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

	const ClosePopBox = () => {
		setPopBox({ isOpen: false });
	};

	const SubmitProof = (
		bankInfo,
		depositRep,
		amount,
		transId,
		picFileName,
		refId
	) => {
		let { currencyId, ...restBankInfo } = bankInfo;
		let { accountName, accountNo } = depositRep;
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.UploadBankSlip,
			depositTime: `${moment().format()}`,
			...restBankInfo,
			transId: transId,
			accountNo: accountNo,
			accountName: accountName,
			isOpen: true,
			amount: number_format(amount, _isConvert),
			picFileName: picFileName,
			refId: refId,
			refreshDatas: GetRecentDatas
		});
	};

	const ClickCancel = transId => {
		const ClickConfirm = () => {
			setPopBox({ isOpen: false });
			api_payment_SetDepositCancel(transId).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setGetHistory(prevState => {
								let newD = [...prevState];
								let idx = newD.findIndex(
									x => x.transId === transId
								);
								newD[idx].status = 5;
								return newD;
							});
						}
					}
				},
				err => {
					if (isMountedRef.current) {
					}
				}
			);
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Cancel,
			btnBar: (
				<div className="btnGroup">
					<button className="gray" onClick={ClosePopBox}>
						{t("lbl_Cancel")}
					</button>
					<button className="orange" onClick={ClickConfirm}>
						{t("lbl_Confirm")}
					</button>
				</div>
			)
		});
	};

	let arr = getHistory?.map((item, i) => {
		return (
			<TransactionHistory
				key={`deposit-recent-${item.transId}`}
				{...item}
				_isConvert={_isConvert}
				idx={i + 1}
				ClickCancel={ClickCancel.bind(this, item.transId)}
				SubmitProof={SubmitProof.bind(
					this,
					item.bankInfo,
					item.depositRep,
					item.amount,
					item.transId,
					item.picFileName,
					item.refId
				)}
			/>
		);
	});

	return (
		<div className="list">
			<div className="listHeader">
				<div>{t("NO")}</div>
				<div>
					{t("lbl_Date")} ({moment().format("Z")})
				</div>
				<div>{t("lbl_ID")}</div>
				<div>{t("lbl_Method")}</div>
				<div>{t("lbl_Amount")}</div>
				<div>{t("lbl_Status")}</div>
				<div>
					{t("lbl_Action")}
					<button
						className="icon icon-spinner11"
						onClick={GetRecentDatas}></button>
				</div>
			</div>
			<div className="listBody">{arr}</div>
		</div>
	);
};
