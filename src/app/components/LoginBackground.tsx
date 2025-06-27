// app/components/LoginBackground.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  {
    src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop",
    alt: "Górzysty krajobraz o zmierzchu",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop",
    alt: "Piaszczysta plaża z falami oceanu",
  },
  {
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop",
    alt: "Jezioro w górach z drewnianym domkiem",
  },
];

export default function LoginBackground() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(timer); 
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}