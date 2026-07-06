export interface CloudinarySignatureBulk_Request{
    folder:string,
    public_ids:string[],
    
}
export interface CloudinarySignatureBulkResponse {
  signature: string;
  timestamp: number;
  folder: string;
  transformation: string;
  public_id: string;
  apiKey: string;
  cloudName: string;
}
export interface FileUploadItem {
    file: File;
    public_id: string; // Tên file do Component bên ngoài truyền vào
}

export interface MultipleUploadParams {
    items: FileUploadItem[]; // Nhận một mảng chứa file và tên file
    folder: string;
}