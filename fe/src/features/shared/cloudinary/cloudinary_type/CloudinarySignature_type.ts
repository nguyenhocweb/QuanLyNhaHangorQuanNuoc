export interface FileUploadItem {
    file: File;
    public_idfe: string; // Tên file do Component bên ngoài truyền vào
    folder:string, 
}
export interface CloudinarySignature_Request {
    folder:string,
    public_id:string
}
export interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  folder: string;
  transformation: string;
  public_id: string;
  apiKey: string;
  cloudName: string;
}
export interface CloudinarySignatureRequest extends CloudinarySignatureResponse{}