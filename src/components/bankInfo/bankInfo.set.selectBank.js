import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./bankInfo.reducer";
import { api_payment_GetBankInfoSysList } from "../../service/api/payment";
import { popBoxContext } from "../common/context";
import config from "../../config";
import { defPopBoxType } from "../common/popBox";
import Loading from "../common/loading";

export default ({ dispatch, bankList }) => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const [loading, setLoading] = useState(true);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetBankInfoSysList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						dispatch({
							type: defActionType.SET_BANKLIST,
							bankList: res.data.data
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
										onClick={ClickClose}>
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
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
					setLoading(false);
				}
			}
		);
	}, []);

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const toLastStep = () => {
		dispatch({ type: defActionType.TO_LAST_STEP });
	};

	const selectBank = bankIdx => {
		dispatch({ type: defActionType.SELECT_BANK, bankIdx });
	};

	let bankOptions = bankList?.map((item, i) => {
		return (
			<li key={`addBankAccount-${item.sysId}`}>
				<a onClick={selectBank.bind(this, i)}>
					<img
						src={`${config.imgUrl}/common/images/BankLogo/${item.bankLogo}`}
						alt={item.bankName}
					/>
				</a>
			</li>
		);
	});

	return loading ? (
		<Loading />
	) : (
		<>
			<div className="platformName">
				<div className="icon icon-arrow-right2"></div>
				<div>
					<div>{t("lbl_SelectBank")}</div>
				</div>
				<button
					className="icon icon-arrow-left2"
					onClick={toLastStep}></button>
			</div>
			<div className="subModuleList">
				<div className="subModule">
					<div className="subModuleBody">
						<ul>{bankOptions}</ul>
					</div>
				</div>
			</div>
		</>
	);
};
