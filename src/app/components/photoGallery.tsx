'use client';

import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database, storage } from '@/app/pages/config/firebase';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

type Photo = {
  id: string;
  url: string;
};

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const dbRef = ref(database, 'photos');
    onValue(dbRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Cargar las URLs de todas las fotos al hacer clic en "Ver Galería"
        const photoPromises = Object.keys(data).map(async (key) => {
          const url = await getDownloadURL(storageRef(storage, data[key].storagePath));
          return { id: key, url };
        });
        const loadedPhotos = await Promise.all(photoPromises);
        setPhotos(loadedPhotos);
      }
    });
  }, []);

  const handleShowGallery = () => {
    setShowGallery(true);
  };

  return (
    <div className="p-4">
      {!showGallery ? (
        <button 
          onClick={handleShowGallery} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Ver Galería
        </button>
      ) : (
        <PhotoProvider>
          <div className="hidden">
            {photos.map((photo) => (
              <PhotoView key={photo.id} src={photo.url}>
                <img src={photo.url} alt="Galería" />
              </PhotoView>
            ))}
          </div>
          <div className="text-center">
            <p className="text-lg">Galería cargada en el visor</p>
          </div>
        </PhotoProvider>
      )}
    </div>
  );
};

export default PhotoGallery;
