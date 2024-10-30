import React from 'react';
import Head from 'next/head';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import PhotoGallery from '@/app/components/photoGallery';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Galería de Fotos</title>
        <meta name="description" content="Galería de Fotos con Firebase y Next.js" />
      </Head>
      <Header />
      <main className="min-h-screen bg-gray-100 p-4">
        <PhotoGallery />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
