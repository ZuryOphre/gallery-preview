"use client";

import React, { useState } from 'react';
import { ref as dbRef, push } from 'firebase/database';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { database, storage } from '@/app/pages/config/firebase';
import { motion } from 'framer-motion';

const Upload: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleUpload = async () => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storagePath = `photos/${file.name}`;
      const storageReference = storageRef(storage, storagePath);
      await uploadBytes(storageReference, file);

      await push(dbRef(database, 'photos'), {
        storagePath,
      });
    }

    setFiles(null);
    alert('Fotos subidas exitosamente');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <motion.h1 className="text-2xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        Subir Fotos
      </motion.h1>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        className="mb-4"
      />
      <motion.button
        onClick={handleUpload}
        className="bg-blue-600 text-white py-2 px-4 rounded"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Subir Fotos
      </motion.button>
    </div>
  );
};

export default Upload;
