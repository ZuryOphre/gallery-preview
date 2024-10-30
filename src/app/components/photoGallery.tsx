"use client";

import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database, storage } from '@/app/pages/config/firebase';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';

type Photo = {
  id: string;
  title: string;
  url: string;
  description: string;
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
            title: data[key].title,
            url,
            description: data[key].description,
          };
        });
        Promise.all(photosArray).then(setPhotos);
      }
    });
  }, []);

  return (
    <LightGallery plugins={[lgThumbnail]} elementClassNames="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {photos.map((photo) => (
        <a key={photo.id} href={photo.url} data-sub-html={`<h4>${photo.title}</h4><p>${photo.description}</p>`}>
          <img src={photo.url} alt={photo.title} className="w-full h-48 object-cover rounded-lg shadow-md" />
        </a>
      ))}
    </LightGallery>
  );
};

export default PhotoGallery;
