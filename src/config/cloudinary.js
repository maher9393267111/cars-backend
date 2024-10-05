const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "ddmusvbbw",
  api_key: "351881194713175",
  api_secret: "lkABw26Ku7gz_eKlRe3_Bhgs-N0",
  secure: true,
});

module.exports = cloudinary;
