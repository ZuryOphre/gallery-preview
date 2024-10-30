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
  storagePath: string;
};

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const dbRef = ref(database, 'photos');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const photoList = Object.keys(data).map((key) => ({
          id: key,
          storagePath: data[key].storagePath,
        }));
        setPhotos(photoList);
      }
    });
  }, []);

  const handleImageClick = async (photo: Photo) => {
    const url = await getDownloadURL(storageRef(storage, photo.storagePath));
    setSelectedPhotoUrl(url);
  };

  return (
    <div className="p-4">
      {!showGallery ? (
        <button 
          onClick={() => setShowGallery(true)} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Ver Galería
        </button>
      ) : (
        <PhotoProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                className="cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleImageClick(photo)}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="w-48 h-48 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">Ver Imagen</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedPhotoUrl && (
            <PhotoView src={selectedPhotoUrl}>
              <img src={selectedPhotoUrl} alt="Selected" onClick={() => setSelectedPhotoUrl(null)} />
            </PhotoView>
          )}
        </PhotoProvider>
      )}
    </div>
  );
};

export default PhotoGallery;
