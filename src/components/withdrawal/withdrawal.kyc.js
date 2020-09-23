import React, { useRef, useEffect, useContext, createRef } from "react";
import { defActionType } from "./withdrawal.reducer";
import { api_accountStrict_UploadCustPhotoId } from "../../service/api/accountStrict";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import config from "../../config";

export default ({ t, dispatch, kycData, KycCheck, kycStatus }) => {
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);
	const filebox = createRef();
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const dragOver = e => {
		e.preventDefault();
	};

	const onChangeFile = (action, e) => {
		e.preventDefault();
		let files =
			action === "onDrop" ? e.dataTransfer.files : filebox.current.files;
		let fileImg = null;

		if (files.length > 0) {
			let reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = () => {
				fileImg = reader.result;
				dispatch({
					type: defActionType.SET_KYC_DATA,
					kycData: {
						picFileName: files[0].name,
						fileData: files,
						fileImg: fileImg
					}
				});
			};
		}
	};

	const onUploadFile = () => {
		const ClosePopBox = () => {
			setPopBox({ isOpen: false });
		};

		if (kycData?.fileData?.length > 0) {
			let formData = new FormData();
			formData.append("PhotoId", kycData.fileData[0]);

			api_accountStrict_UploadCustPhotoId(formData).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							KycCheck();
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message,
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-cancel"
											onClick={ClosePopBox}>
											{t("lbl_Close")}
										</button>
									</div>
								)
							});
						}
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
										onClick={ClosePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			);
		}
	};

	return kycStatus === "kycUpload" ? (
		<div className="subModuleList">
			<div className="subModule">
				<div className="subModuleBody column align-items-center">
					<span className="title">{t("lbl_SubmitPhotoId")}</span>
					<div className="txt-lightgray">
						{t("lbl_SubmitPhotoIdList_Title")}
						<br />
						{t("lbl_ImageUploadWarning")}
						<br />
						{t("lbl_ImageJpgPngOnly")}
					</div>
					<label
						className="upload_img"
						onDragOver={dragOver.bind(this)}
						onDrop={onChangeFile.bind(this, "onDrop")}>
						<input
							type="file"
							onChange={onChangeFile.bind(this, "onChange")}
							ref={filebox}
						/>
						{kycData.picFileName ? (
							<img alt="DepositReceipt" src={kycData.fileImg} />
						) : (
							<i className="icon icon-plus"></i>
						)}{" "}
					</label>
					<div className="directions">
						<ul>
							<li>{t("lbl_NationalIdentityCard")}</li>
							<li>{t("lbl_Passport")}</li>
							<li>{t("lbl_DrivingLicense")}</li>
							<li>{t("lbl_BirthCertificate")}</li>
						</ul>
					</div>
					<div className="btnGroup">
						<button
							className={
								kycData?.fileData?.length > 0
									? "btn-check"
									: "btn-cancel"
							}
							onClick={onUploadFile}>
							{t("lbl_Submit")}
						</button>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className="subModuleList kycHeight">
			<div className="subModule">
				<div className="subModuleBody column align-items-center">
					<div className="icon icon-icon32px_worker"></div>
					<span className="title txt-yellow">{t("lbl_WaitKYC")}</span>
					<div className="txt-lightgray">{t("lbl_WaitKYCHint")}</div>
				</div>
			</div>
		</div>
	);
};
