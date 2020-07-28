import React from "react";

import Responsibility1 from "../../styles/img/responsibility1.png";
import Responsibility2 from "../../styles/img/responsibility2.png";
import Licenses from "../../styles/img/licenses.png";
import Security from "../../styles/img/security.png";

export default () => {
	return (
		<footer>
			<div className="webmap">
				<div>
					<span className="title">Sports Betting</span>
					<div>
						<a href="">Soccer Betting</a>
						<a href="">Basketball Betting</a>
						<a href="">Baseball Betting</a>
						<a href="">Badminton</a>
					</div>
					<div>
						<a href="">Football Betting</a>
						<a href="">Tennis Betting</a>
						<a href="">Hockey Betting</a>
						<a href="">E-Sport Betting</a>
					</div>
				</div>
				<div>
					<span className="title">Our Policies</span>
					<div>
						<a href="">Responsible Gaming</a>
						<a href="">Terms and Conditions</a>
						<a href="">Privacy Policy</a>
						<a href="">Cookie Policy</a>
					</div>
				</div>
				<div>
					<span className="title">Help & Support</span>
					<div>
						<a href="">Rules and Regulations</a>
						<a href="">Account Terms</a>
						<a href="">FAQ</a>
					</div>
				</div>
				<div>
					<span className="title">Nova88</span>
					<div>
						<a href="">About Us</a>
						<a href="">Terms of Use</a>
						<a href="">Contact Us</a>
					</div>
				</div>
				<div>
					<span className="title">Responsibility</span>
					<div>
						<a href="">
							<img src={Responsibility1} />
						</a>
						<a href="">
							<img src={Responsibility2} />
						</a>
					</div>
				</div>
				<div>
					<span className="title">Licenses</span>
					<div>
						<a href="">
							<img src={Licenses} />
						</a>
					</div>
				</div>
				<div>
					<span className="title">Security</span>
					<div>
						<a href="">
							<img src={Security} />
						</a>
					</div>
				</div>
				<div>
					<span className="title">Payment</span>
					<div>
						<a href="">
							<img src="http://www.n88dev.com/common/images/logo/h2p.png" />
						</a>
						<a href="">
							<img src="http://www.n88dev.com/common/images/logo/ep.png" />
						</a>
					</div>
				</div>
				<div>
					<span className="title">Social Media</span>
					<div>
						<a href="" className="icon icon-instagram">
							Instagram
						</a>
						<a href="" className="icon icon-facebook">
							Facebook
						</a>
						<a href="" className="icon icon-twitter">
							Twitter
						</a>
					</div>
				</div>
			</div>
			<div className="platform">
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/saba.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/ab.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/yl.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/ag.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/jk.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/gp.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/dg.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/sa.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/yg.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/pp.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/sg.png" />
				</a>
				<a href="">
					<img src="http://www.n88dev.com/common/images/logo/pg.png" />
				</a>
			</div>
			<div className="copyright">
				© Copyright 2020. Nova88. All Rights Reserved.
			</div>
		</footer>
	);
};
