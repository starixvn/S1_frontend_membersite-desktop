import React, {
	useContext,
	useEffect,
	useState,
	createRef,
	lazy,
	Suspense
} from "react";
import kiss from "../../styles/img/kiss.jpg";
import { useTranslation } from "react-i18next";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { api_tp_GotoGame } from "../../service/api/tp";
import productList from "../../datas/productList";

const useGotoGame = ({ isLogin, langId, tpId }) => {
	const { setPopBox } = useContext(popBoxContext);
	const { t } = useTranslation();
	const [data, setData] = useState({ account: "", password: "" });

	const ClickClose = () => {
		setPopBox(() => ({
			isOpen: false
		}));
	};

	useEffect(() => {
		let mounted = true;
		if (isLogin) {
			api_tp_GotoGame({
				TpId: tpId,
				LangId: langId
			}).then(res => {
				if (res.data.errorCode === 0 && mounted && res.data.message) {
					setData(() => JSON.parse(res.data.message));
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
			});
		}

		return () => (mounted = false);
	}, [isLogin, langId, tpId]);

	return { data };
};

const useHandleDownloadPopBox = () => {
	const { setPopBox } = useContext(popBoxContext);

	const ClickDownload = () => {
		const ClickClose = () => {
			setPopBox(() => ({
				isOpen: false
			}));
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.kiss918,
			ClickClose: ClickClose
		});
	};

	return { ClickDownload };
};

const GetImageContent = ({ langId }) => {
	let InstallGuide = null;
	let DownloadImg = null;
	if (langId === "cs") {
		InstallGuide = lazy(() => import("./installGuide.cs"));
		DownloadImg = lazy(() => import("./downloadImg.cs"));
	} else if (langId === "th") {
		InstallGuide = lazy(() => import("./installGuide.th"));
		DownloadImg = lazy(() => import("./downloadImg.th"));
	} else {
		InstallGuide = lazy(() => import("./installGuide.en"));
		DownloadImg = lazy(() => import("./downloadImg.en"));
	}

	return { InstallGuide, DownloadImg };
};

const Kiss918 = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { data } = useGotoGame({
		isLogin: userInfo.isLogin,
		langId: userInfo.langId,
		tpId: productList.kiss918
	});
	const { ClickDownload } = useHandleDownloadPopBox();
	const { InstallGuide, DownloadImg } = GetImageContent(userInfo);

	return (
		<section className="inside">
			<div className="rightModule">
				<div className="infoModule">
					<div className="promotionsInfo">
						<img src={kiss} />
						<div className="userpassword">
							<div className="kisstitle">{t("lbl_Username")}</div>
							<ButtonWithCopyBtn value={data?.account} />
							<div className="kisstitle">{t("lbl_Password")}</div>
							<ButtonWithCopyBtn value={data?.password} />
							<div className="kisstitle">
								{t("lbl_918KissMobileApp")}
							</div>
							<button onClick={ClickDownload}>
								<Suspense fallback={<div></div>}>
									<DownloadImg />
								</Suspense>
							</button>
						</div>
					</div>
				</div>
				<Suspense fallback={<div></div>}>
					<InstallGuide displayText={t("lbl_IOSInstallGuide")} />
				</Suspense>
			</div>
		</section>
	);
};

const ButtonWithCopyBtn = ({ value }) => {
	const ipt = createRef();
	const OnCopy = () => {
		ipt.current.select();
		document.execCommand("copy");
	};
	return (
		<div className="readonly">
			<input readOnly defaultValue={value} ref={ipt} />
			<button
				className="icon icon-files-empty"
				value={value}
				onClick={OnCopy}></button>
		</div>
	);
};

export default Kiss918;
