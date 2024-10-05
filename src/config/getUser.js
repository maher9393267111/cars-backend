const Users = require("../models/User");



exports.getUser = async (req, res,requireVerify) => {
	if (!req.user) {
		return res
			.status(401)
			.json({ success: false, message: "You Must Be Logged In." });
	}


	try {
		const user = await Users.findById(req.user._id);
		console.log("🔶️🔷️🔶️USER " , user?.role)
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User Not Found." });
		}
		// if (!requireVerify && !user.isVerified) {
		// 	return res
		// 		.status(404)
		// 		.json({ success: false, message: "User Email Is Not Verified." });
		// }

		return user;
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error." });
	}
};

exports.getAdmin = async (req, res) => {
	try {
		if (!req.user) {
			return res
				.status(401)
				.json({ success: false, message: "You Must Be Logged In." });
		}

		const user = await Users.findById(req.user._id);
		console.log("🔶️🔷️🔶️ADMIN " , user?.role)
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User Not Found." });
		}
		if (!user.role.includes("admin")) {
			return { error: "Access Denied.", status: 401 };
		}

		return user;
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Internal server error." });
	}
};

exports.getVendor = async (req, res) => {
	try {
		if (!req.user) {
			return res
				.status(401)
				.json({ success: false, message: "You Must Be Logged In." });
		}

		const user = await Users.findById(req.user._id);
		console.log("🔶️🔷️🔶️USER " , user?.role)
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User Not Found." });
		}
	if (user.role !== 'vendor') {
		console.log("🔶️🔷️🔶️" , user?.role)
			return { error: "Access Denied.", status: 401 };
		}
	return user
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Internal server error." });
	}
};



exports.getAdminOrVendor = async (req, res) => {
	try {
		if (!req.user) {
			return res
				.status(401)
				.json({ success: false, message: "You Must Be Logged In." });
		}

		const user = await Users.findById(req.user._id);
		console.log("🔶️🔷️🔶️USER " , user?.role)
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User Not Found." });
		}

		console.log("🔶️🔷️🔶️OUTSIDEE" , user?.role)
	if (user.role !== 'vendor' &&  user.role !== 'super admin') {
		console.log("SSS🔶️🔷️🔶️SSS" , user?.role)
			return { error: "Access Denied.", status: 401 };
		}
	return user
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Internal server error." });
	}
};
