import React, { useContext, useEffect, useState, useRef } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import { TransactionHistory } from "./deposit.historyResult";
import {
	api_payment_GetDepositInfoRecent,
	api_payment_SetDepositCancel
} from "../../service/api/payment";
import { isConvert } from "../common/common";
import { defPopBoxType } from "../common/popBox";
import ReloadSpin from "../common/reloadSpin";
import { Link } from "@reach/router";
import path from "../../path";

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
			depositTime: `${moment().format("yyyy-MM-DD ")}${moment().format(
				"hh:mm A"
			)}`,
			...restBankInfo,
			transId: transId,
			accountNo: accountNo,
			accountName: accountName,
			isOpen: true,
			amount: amount,
			picFileName: picFileName,
			refId: refId,
			refreshDatas: GetRecentDatas,
			_isConvert: _isConvert
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
					<button className="gray" onClick={ClickConfirm}>
						{t("lbl_Yes")}
					</button>
					<button className="orange" onClick={ClosePopBox}>
						{t("lbl_No")}
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
		<>
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
						<ReloadSpin func={GetRecentDatas} />
					</div>
				</div>
				{getHistory?.length > 0 ? (
					<div className="listBody">{arr}</div>
				) : (
					<div className="nodata">{t("msg_NoData")}</div>
				)}
			</div>
			<Link
				to={`/${userInfo.langId}/${path.depositHistory.root}`}
				className="icon icon-books"></Link>
		</>
	);
};
