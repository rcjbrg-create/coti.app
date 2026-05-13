export type MediaType = "image" | "video" | "thumbnail";

export interface UploadResult {
  path: string;
  bucket: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface MediaFile {
  file: File;
  preview: string;
  type: MediaType;
}
