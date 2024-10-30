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
        const photosArray = Object.keys(data).map(async (key) => {
          const url = await getDownloadURL(storageRef(storage, data[key].storagePath));
          return {
            id: key,
            url,
          };
        });
        Promise.all(photosArray).then(setPhotos);
      }
    });
  }, []);

  return (
    <PhotoProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="cursor-pointer w-full h-48 md:h-40 lg:h-32"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoView src={photo.url}>
              <img
                src={photo.url}
                alt=""
                className="w-full h-full max-h-[500px] max-w-[500px] object-contain rounded-lg shadow-md"
              />
            </PhotoView>
          </motion.div>
        ))}
      </div>
    </PhotoProvider>
  );
};

export default PhotoGallery;

