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
          <motion.div
            key={photo.id}
            className="cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoView src={photo.url}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="w-48 h-48">
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </PhotoView>
          </motion.div>
        ))}
      </div>
    </PhotoProvider>
  );
};

export default PhotoGallery;
