import {firebaseStorage} from './firebase';

export class StorageService {
  async uploadFile(
    path: string,
    localFilePath: string,
    metadata?: {contentType?: string},
  ): Promise<string> {
    try {
      const reference = firebaseStorage.ref(path);
      await reference.putFile(localFilePath, metadata);
      const downloadURL = await reference.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async uploadImage(
    folder: string,
    localFilePath: string,
    fileName?: string,
  ): Promise<string> {
    const name = fileName || `${Date.now()}.jpg`;
    const path = `${folder}/${name}`;
    return this.uploadFile(path, localFilePath, {contentType: 'image/jpeg'});
  }

  async uploadDocument(
    folder: string,
    localFilePath: string,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    const path = `${folder}/${fileName}`;
    return this.uploadFile(path, localFilePath, {contentType});
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const reference = firebaseStorage.ref(path);
      await reference.delete();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async getDownloadURL(path: string): Promise<string> {
    try {
      const reference = firebaseStorage.ref(path);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();

// Storage paths
export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  TASK_ATTACHMENTS: 'tasks/attachments',
  MESSAGE_ATTACHMENTS: 'messages/attachments',
  REPORTS: 'reports',
  VEHICLE_DOCUMENTS: 'vehicles/documents',
};
