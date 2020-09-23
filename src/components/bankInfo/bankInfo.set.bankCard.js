import React, { useEffect, useRef, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { api_accountStrict_DelCustBankInfo } from "../../service/api/accountStrict";
import Loading from "../common/loading";

export default props => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const [loading, setLoading] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const deleteBankAccount = (sysId, accountNo) => {
		const ClickCancel = () => {
			setPopBox({
				isOpen: false
			});
		};

		const deleteCard = (sysId, accountNo) => {
			setPopBox({
				isOpen: false
			});
			setLoading(true);

			api_accountStrict_DelCustBankInfo({
				AccountName: props.accountName,
				AccountNo: accountNo,
				SysId: sysId
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							props.reload();
							setPopBox({
								isOpen: false
							});
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message,
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-cancel"
											onClick={ClickCancel}>
											{t("lbl_Close")}
										</button>
									</div>
								)
							});
						}
						setLoading(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: t("msg_ApiServerError"),
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickCancel}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
						setLoading(false);
					}
				}
			);
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.ConfirmDelete,
			message: t("lbl_AreYouSureDelete"),
			message2: t("lbl_CantBeRestore"),
			btnBar: (
				<div className="btnGroup">
					<button
						className="btn-cancel"
						onClick={deleteCard.bind(this, sysId, accountNo)}>
						{t("lbl_Yes")}
					</button>
					<button className="btn-check" onClick={ClickCancel}>
						{t("lbl_No")}
					</button>
				</div>
			)
		});
	};

	let arr = props.custBankList?.map(item => {
		return (
			<div className="addBankName" key={`bankCard-${item.accountNo}`}>
				<div className="addBankInfo">
					<div className="bankName">
						<img
							alt="BankLogo"
							src={`${config.imgUrl}/common/images/BankLogo/${item.bankLogo}`}
						/>
					</div>
				</div>
				<div className="addBankInfo">
					<div className="txt-blue">{item.accountNo}</div>
					<button
						aria-label="deleteBankAccount"
						className="icon icon-bin"
						onClick={deleteBankAccount.bind(
							this,
							item.sysId,
							item.accountNo
						)}></button>
				</div>
			</div>
		);
	});
	return loading ? (
		<Loading />
	) : (
		<>
			{props.custBankList?.length > 0 ? (
				<div className="infoModule">
					<div className="walletModule">
						<div className="addBank haveBank">{arr}</div>
					</div>
				</div>
			) : null}
		</>
	);
};
