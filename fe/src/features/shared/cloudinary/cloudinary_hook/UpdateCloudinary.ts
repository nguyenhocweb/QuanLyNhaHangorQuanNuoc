import { CloudinarySignatureRequest } from "../cloudinary_type/CloudinarySignature_type";
import axios from "axios";
export const uploadFileToCloudinary = async (
    signatureData: CloudinarySignatureRequest,
    file: File
): Promise<string> => {
    const { apiKey, cloudName, folder, public_id, signature, timestamp, transformation } = signatureData;
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);
    formData.append("public_id", public_id);

    if (transformation) {
        formData.append("transformation", transformation);
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const uploadRes = await axios.post(cloudinaryUrl, formData);

    return uploadRes.data.secure_url as string;
};