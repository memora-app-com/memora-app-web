export type UploadedFile = {
  url: string;
  status: "uploading" | "uploaded" | "error";
  error?: string;
};