'use client';

import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database, storage } from '@/app/pages/config/firebase';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { motion } from 'framer-motion';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

type Photo = {
  id: string;
  url: string;
};

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const dbRef = ref(database, 'photos');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const photoPromises = Object.keys(data).map(async (key) => {
          const url = await getDownloadURL(
            storageRef(storage, data[key].storagePath)
          );
          return {
            id: key,
            url,
          };
        });
        Promise.all(photoPromises).then(setPhotos);
      }
    });
  }, []);

  return (
    <PhotoProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {photos.map((photo) => (
          <motion.div key={photo.id} className="cursor-pointer w-full">
            <PhotoView src={photo.url}>
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={photo.url}
                  alt=""
                  className="object-cover rounded-lg shadow-md"
                />
              </div>
            </PhotoView>
          </motion.div>
        ))}
      </div>
    </PhotoProvider>
  );
};

export default PhotoGallery;
