export type UploadedFile = {
  url: string;
  type?: "image" | "video";
  status: "uploading" | "uploaded" | "error";
  error?: string;
};