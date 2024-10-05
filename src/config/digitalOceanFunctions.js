// Import the cloudinary module
const cloudinary = require("./cloudinary");
const {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

// prepare S3 client
const bucketName = "dash93";
const region = "us-east-1";
const accessKeyId = "DO00PHUUAT4VXQF27H6N";
// "DO00M9XA6DJ9P9Y4UWFT";
const secretAccessKey = "P1YyD/tvykl7hpLKBF/g3Ff1KN2yJOunrRlWSXGRa5s";
// "fcWJxA4nn0r5yNKUi1011UzQ66FPMO6Lt8UEuGWSypE";

const endpoint = "https://nyc3.digitaloceanspaces.com";
const cdnEndpoint = "https://dash93.nyc3.cdn.digitaloceanspaces.com";

const s3Client = new S3Client({
  endpoint: endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const uploadOnCloudinary = (file) => {
  return cloudinary.uploader.unsigned_upload(file);
};

const deleteFromCloudinary = (file) => {
  return cloudinary.uploader.destroy(file);
};

exports.multiFileUploader = async (images) => {
  const cloudinaryImageUploadMethod = async (file) => {
    const image = await uploadOnCloudinary(file);
    return image;
  };

  var imageUrlList = [];

  for (var i = 0; i < images.length; i++) {
    var localFilePath = images[i];

    // Upload the local image to Cloudinary
    // and get image url as response
    var result = await cloudinaryImageUploadMethod(localFilePath);
    imageUrlList.push(result);
  }
  const uploaded = imageUrlList.map((v) => {
    return {
      _id: v.public_id,
      url: v.secure_url,
    };
  });
  return uploaded;
};

exports.singleFileUploader = async (image) => {
  const result = await uploadOnCloudinary(image);
  const uploaded = {
    _id: result.public_id,
    url: result.secure_url,
  };
  return uploaded;
};



exports.singleFileDelete = async (id) => {
 // const result = await deleteFromCloudinary(id);
  const deleteParams = {
	Bucket: bucketName,
	Key: `dara/${id}`,
  };

  var result = await s3Client.send(new DeleteObjectCommand(deleteParams));



  return result;
};

exports.multiFilesDelete = async (images) => {
  const results = [];

  for (var i = 0; i < images.length; i++) {
    var image = images[i];

    const deleteParams = {
      Bucket: bucketName,
      Key: `dara/${image?._id}`,
    };

    var result = await s3Client.send(new DeleteObjectCommand(deleteParams));

    results.push(result);
  }

  return results;
};
