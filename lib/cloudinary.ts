import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ydugu2xq',
  api_key: process.env.CLOUDINARY_API_KEY || '825948682878493',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5TWFbLWdkLS_rD8lMGTSM7KdOGM',
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Uploads a base64 data URI, image buffer, or remote URL to Cloudinary
 */
export async function uploadToCloudinary(
  fileData: string,
  folder: string = 'lapiez-products'
): Promise<CloudinaryUploadResult> {
  try {
    const result = await cloudinary.uploader.upload(fileData, {
      folder: `lapiez/${folder}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error(error?.message || 'Failed to upload image to Cloudinary');
  }
}

export default cloudinary;
