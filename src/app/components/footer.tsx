"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-200 p-4 text-black text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        &copy; {new Date().getFullYear()} Todos los derechos reservados. Development by Zury Martinez
      </motion.p>
    </footer>
  );
};

export default Footer;
