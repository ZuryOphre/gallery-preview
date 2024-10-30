"use client";

import React, { useState } from 'react';
import { ref as dbRef, push } from 'firebase/database';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { database, storage } from '@/app/pages/config/firebase';
import { motion } from 'framer-motion';

const Upload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const storagePath = `photos/${file.name}`;
    const storageReference = storageRef(storage, storagePath);
    await uploadBytes(storageReference, file);

    await push(dbRef(database, 'photos'), {
      title,
      description,
      storagePath,
    });

    setTitle('');
    setDescription('');
    setFile(null);
    alert('Foto subida exitosamente');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <motion.h1 className="text-2xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        Subir Foto
      </motion.h1>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-4"
      ></textarea>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="mb-4"
      />
      <motion.button
        onClick={handleUpload}
        className="bg-blue-600 text-white py-2 px-4 rounded"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Subir Foto
      </motion.button>
    </div>
  );
};

export default Upload;
