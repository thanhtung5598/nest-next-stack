import { env } from '@/libs/constant';
import { fetcher } from '@/libs/fetcher';

type UploadImageRes = {
  url: string;
};

class UploadService {
  public baseUrl = `${env?.basePath}/api/upload`;

  public uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return fetcher<UploadImageRes>(this.baseUrl, {
      method: 'POST',
      body: formData,
      headers: {
        ContentType: 'multipart/form-data',
      },
    });
  }
}

export const uploadService = new UploadService();
