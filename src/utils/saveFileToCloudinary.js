import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { CLOUDINARY } from '../constants/index.js';
import fs from 'node:fs/promises';

cloudinary.config({
  cloud_name: env(CLOUDINARY.CLOUD_NAME),
  api_key: env(CLOUDINARY.API_KEY),
  api_secret: env(CLOUDINARY.API_SECRET),
});

const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};

export default saveFileToCloudinary;
