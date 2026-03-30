import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react';

import type { OurFileRouter } from '@/app/api/uploadthing/core';

const UPLOADTHING_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, '')}/api/uploadthing`
  : '/api/uploadthing';

export const UploadButton = generateUploadButton<OurFileRouter>({ url: UPLOADTHING_URL });
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({ url: UPLOADTHING_URL });
export const { useUploadThing } = generateReactHelpers<OurFileRouter>({ url: UPLOADTHING_URL });
