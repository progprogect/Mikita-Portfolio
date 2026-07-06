import type * as THREE from 'three';
import { loadImage, makeCardTexture, makePhotoTexture } from './utils';
import { profile } from '../content/profile';
import { clients } from '../content/clients';
import { services } from '../content/services';

export interface Assets {
  photo: THREE.CanvasTexture;
  /** service id -> textures of its diagram images */
  serviceImages: Map<string, THREE.CanvasTexture[]>;
  /** client name -> white logo card */
  logos: Map<string, THREE.CanvasTexture>;
}

export async function loadAssets(onProgress: (ratio: number) => void): Promise<Assets> {
  await document.fonts.ready;

  const jobs: Array<() => Promise<void>> = [];
  const serviceImages = new Map<string, THREE.CanvasTexture[]>();
  const logos = new Map<string, THREE.CanvasTexture>();
  let photo!: THREE.CanvasTexture;

  jobs.push(async () => {
    photo = makePhotoTexture(await loadImage(profile.photo));
  });

  for (const service of services) {
    serviceImages.set(service.id, []);
    service.images.forEach((src, i) => {
      jobs.push(async () => {
        const img = await loadImage(src);
        serviceImages.get(service.id)![i] = makeCardTexture(img);
      });
    });
  }

  for (const client of clients) {
    jobs.push(async () => {
      const img = await loadImage(client.logo);
      logos.set(client.name, makeCardTexture(img, { width: 512, height: 320, pad: 52, radius: 36, bg: '#ffffff' }));
    });
  }

  let done = 0;
  await Promise.all(
    jobs.map((job) =>
      job().then(() => {
        done += 1;
        onProgress(done / jobs.length);
      }),
    ),
  );

  return { photo, serviceImages, logos };
}
