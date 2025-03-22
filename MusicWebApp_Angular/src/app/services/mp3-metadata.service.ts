import { Injectable } from '@angular/core';
import { parseBlob } from 'music-metadata';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class Mp3MetadataService {
  constructor() {
    if (typeof window !== "undefined" && typeof Buffer === "undefined") {
      window.Buffer = Buffer;
    }
  }

  async extractMetadata(file: File): Promise<any> {
    try {
      const metadata = await parseBlob(file);
      return new Promise((resolve) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.addEventListener("loadedmetadata", () => {
          resolve({
            title: metadata.common.title || 'Unknown Title',
            artist: metadata.common.artist || 'Unknown Artist',
            album: metadata.common.album || 'Unknown Album',
            genre: metadata.common.genre?.[0] || 'Unknown Genre',
            duration: `${audio.duration.toFixed(2)} seconds`
          });
        });
      });
    } catch (error) {
      console.error('Error reading metadata:', error);
      return null;
    }
  }
}
