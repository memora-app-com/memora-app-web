"use client";

import { useState, useEffect } from "react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-uploader";
import { Progress } from "@/components/ui/progress";
import { Paperclip } from "lucide-react";
import * as tus from "tus-js-client";
import { createClient } from "@/utils/supabase/client";
import { Trash2 as RemoveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadedFile } from "./UploadedFile";

const supabase = createClient();

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400 text-center">
        <strong>Click here to upload</strong>
        {/* &nbsp;or drag and drop */}
        <ul className="text-left">
          <li>- images or videos</li>
          <li>
            - up to <strong>200MB</strong> per file
          </li>
          <li>
            - up to <strong>10</strong> files total
          </li>
        </ul>

        {/* up to <strong>200MB</strong> */}
      </p>
    </>
  );
};

const MultipleImageUploader = (props: {
  galleryId: string;
  userId: string;
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [progress, setProgress] = useState<number[]>([]);

  const resumableUploadEndpoint = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/upload/resumable`;
  const bucketName = "main-bucket";
  const parentFolderName = "photos";

  const dropZoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    maxFiles: 10,
    maxSize: 1024 * 1024 * 200, // 200MB
    multiple: true,
  };
  const uploadFile = async (fileName: string, file: File, index: number) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const fileRelativePath = `${props.galleryId}/${props.userId}/${fileName}`;
    const fileAbsoluteUrl = `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/object/public/${bucketName}/${parentFolderName}/${fileRelativePath}`;

    return new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: resumableUploadEndpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session?.access_token}`,
          "x-upsert": "true",
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: bucketName,
          objectName: `${parentFolderName}/${fileRelativePath}`,
          contentType: file.type || "application/octet-stream",
          cacheControl: "3600",
        },
        chunkSize: 6 * 1024 * 1024, // Must be set to 6MB
        onError: (error) => {
          props.setUploadedFiles((prevUploadedFiles) => [
            ...prevUploadedFiles,
            {
              url: fileAbsoluteUrl,
              status: "error",
              type: file.type.split("/")[0] as "image" | "video",
              error: error.message,
            },
          ]);

          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 99).toFixed(2);
          setProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[index] = parseFloat(percentage);

            return newProgress;
          });
        },

        onSuccess: () => {
          setProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[index] = 100;

            return newProgress;
          });

          props.setUploadedFiles((prevUploadedFiles) => [
            ...prevUploadedFiles,
            {
              url: fileAbsoluteUrl,
              type: file.type.split("/")[0] as "image" | "video",
              status: "uploaded",
            },
          ]);

          resolve();
        },
      });

      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        upload.start();
      });
    });
  };

  useEffect(() => {
    if (files && files.length > 0) {
      const handleUpload = async () => {
        for (let i = 0; i < files.length; i++) {
          // Check if the progress of the current file is not 100 (i.e., it hasn't been uploaded yet)
          if (progress[i] !== 100) {
            const file = files[i];
            const fileName = file.name;
            await uploadFile(fileName, file, i);
          }
        }
      };

      handleUpload();
    }
  }, [files]);

  const handleValueChange = (newFiles) => {
    setFiles(newFiles);
    // Ensure progress array length matches files array length, and retain progress of already uploaded files
    setProgress((prevProgress) => {
      const newProgress = [...prevProgress];
      newFiles.forEach((_, index) => {
        if (newProgress[index] === undefined) {
          newProgress[index] = 0;
        }
      });
      return newProgress;
    });
  };

  return (
    <FileUploader
      value={files}
      onValueChange={handleValueChange}
      dropzoneOptions={dropZoneConfig}
      className="relative bg-background rounded-lg p-2"
    >
      <FileInput className="outline-dashed outline-1 outline-foreground">
        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
          <FileSvgDraw />
        </div>
      </FileInput>
      <FileUploaderContent>
        {files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem key={i} index={i}>
              <Paperclip className="h-4 w-4 stroke-current" />
              <span
                className={cn(
                  "truncate",
                  progress[i] === 100 ? "w-full" : "w-1/2"
                )}
              >
                {file.name}
              </span>
              <Progress
                className={progress[i] === 100 ? "hidden" : "w-1/2"}
                value={progress[i]}
              />
              {/* <button
                disabled
                className="cursor-not-allowed text-muted-foreground opacity-50 "
              >
                <RemoveIcon className="w-4 h-4 hover:stroke-destructive duration-200 ease-in-out" />
              </button> */}
            </FileUploaderItem>
          ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

export default MultipleImageUploader;
