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
  url?: string; // Hacemos que url sea opcional
  storagePath: string;
};

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadedPhotos, setLoadedPhotos] = useState<Photo[]>([]); // Ajustamos el tipo a Photo[]
  const [showGallery, setShowGallery] = useState(false); // Controla la visibilidad de la galería

  useEffect(() => {
    const dbRef = ref(database, 'photos');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const photoList = Object.keys(data).map((key) => ({
          id: key,
          storagePath: data[key].storagePath, // Almacena solo la ruta de almacenamiento
        }));
        setPhotos(photoList);
      }
    });
  }, []);

  const loadImages = async () => {
    const photoPromises = photos.map(async (photo) => {
      const url = await getDownloadURL(storageRef(storage, photo.storagePath));
      return { ...photo, url };
    });
    const loaded = await Promise.all(photoPromises);
    setLoadedPhotos(loaded); // Guardamos los objetos completos de tipo Photo
    setShowGallery(true); // Muestra la galería
  };

  return (
    <div className="p-4">
      {!showGallery ? (
        <button 
          onClick={loadImages} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Ver Galería
        </button>
      ) : (
        <PhotoProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {loadedPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                className="cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <PhotoView src={photo.url!}>
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
      )}
    </div>
  );
};

export default PhotoGallery;
