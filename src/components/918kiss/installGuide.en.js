import React from "react";
import Step1 from "../../styles/img/918/en/Help_01.png";
import Step2 from "../../styles/img/918/en/Help_02.png";
import Step3 from "../../styles/img/918/en/Help_03.png";
import Step4 from "../../styles/img/918/en/Help_04.png";
import Step5 from "../../styles/img/918/en/Help_05.png";
import Step6 from "../../styles/img/918/en/Help_06.png";
import Step7 from "../../styles/img/918/en/Help_07.png";
import Step8 from "../../styles/img/918/en/Help_08.png";
import Step9 from "../../styles/img/918/en/Help_09.png";
import Step10 from "../../styles/img/918/en/Help_10.png";
import Step11 from "../../styles/img/918/en/Help_11.png";

export default ({ displayText }) => (
	<div className="installGuide">
		{displayText}
		<div>
			<img src={Step1} />
			<img src={Step2} />
			<img src={Step3} />
			<img src={Step4} />
			<img src={Step5} />
			<img src={Step6} />
			<img src={Step7} />
			<img src={Step8} />
			<img src={Step9} />
			<img src={Step10} />
			<img src={Step11} />
		</div>
	</div>
);
