// components/Header.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Tangerine } from 'next/font/google';

const tangerine = Tangerine({ subsets: ['latin'], weight: '400' });

const Header: React.FC = () => {
  return (
    <header className="bg-stone-200 p-4 text-black text-center">
      <motion.h1
        className={`${tangerine.className} text-6xl font-bold`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Ricardo Bravo
      </motion.h1>
      <motion.h2
        className="text-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Galería Temporal
      </motion.h2>
    </header>
  );
};

export default Header;
