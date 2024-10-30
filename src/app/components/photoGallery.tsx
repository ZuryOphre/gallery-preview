
// components/PhotoGallery.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database, storage } from '../firebaseConfig';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import { motion } from 'framer-motion';

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
    <LightGallery plugins={[lgThumbnail]} elementClassNames="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {photos.map((photo) => (
        <motion.div
          key={photo.id}
          className="cursor-pointer w-full h-60"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <a href={photo.url}>
            <img
              src={photo.url}
              alt=""
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </a>
        </motion.div>
      ))}
    </LightGallery>
  );
};

export default PhotoGallery;