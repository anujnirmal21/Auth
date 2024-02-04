import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KRY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (filepath) => {
  try {
    if (!filepath) return null;

    //upload file
    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    //file uploaded
    // console.log("Uploaded Successfully... ", response);
    fs.unlinkSync(filepath);

    return response;
  } catch (error) {
    fs.unlinkSync(filepath);
    //removes locallly saved file

    return null;
  }
};

export { uploadCloudinary };
