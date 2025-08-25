// src/components/admin/AddProduct/hooks/useProductImages.ts
import { useState, ChangeEvent } from 'react';

export const useProductImages = () => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [mainPhotoIndex, setMainPhotoIndex] = useState<number>(0);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const previews: string[] = [];

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          previews.push(reader.result);
          if (previews.length === fileArray.length) {
            setPhotos(prev => [...prev, ...fileArray]);
            setPhotoPreviews(prev => [...prev, ...previews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    
    if (index === mainPhotoIndex) {
      setMainPhotoIndex(0);
    } else if (index < mainPhotoIndex) {
      setMainPhotoIndex(prev => prev - 1);
    }
  };

  const setAsMainPhoto = (index: number) => {
    setMainPhotoIndex(index);
  };

  const resetImages = () => {
    setPhotos([]);
    setPhotoPreviews([]);
    setMainPhotoIndex(0);
  };

  return {
    photos,
    photoPreviews,
    mainPhotoIndex,
    handleImageChange,
    removePhoto,
    setAsMainPhoto,
    resetImages
  };
};