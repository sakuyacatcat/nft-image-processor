declare var cv: any;

import React, { useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function onOpenCvReady() {
  document.getElementById('loadingOpenCv')?.remove();
}

export default function ImageUploader() {
  useEffect(() => {
    if (typeof cv === 'undefined') {
      document.getElementById('loadingOpenCv')?.addEventListener('opencvready', onOpenCvReady);
    } else {
      onOpenCvReady();
    }

    return () => {
      document.getElementById('loadingOpenCv')?.removeEventListener('opencvready', onOpenCvReady);
    };
  }, []);

  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
	if (e.target.files && e.target.files.length > 0) {
	  const reader = new FileReader()
	  reader.addEventListener('load', () => setImgSrc(reader.result as string))
	  reader.readAsDataURL(e.target.files[0])
	}
  }

  const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    imgRef.current = e.currentTarget
  }

  const onCropComplete = async (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
			// canvasで読み込み
      const canvas = document.createElement('canvas');
      canvas.width = imgRef.current.width;
      canvas.height = imgRef.current.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imgRef.current, 0, 0);

			// canvasがオリジナルに対して画像比率を定義
      const scaleX = imgRef.current.width / imgRef.current.naturalWidth;
      const scaleY = imgRef.current.height / imgRef.current.naturalHeight;

      // クロップ領域に対応するマスクを作成
      let mask = new cv.Mat.zeros(imgRef.current.height, imgRef.current.width, cv.CV_8UC1);
      let rect = new cv.Rect(crop.x!, crop.y!, crop.width!, crop.height!);
      mask.roi(rect).setTo(new cv.Scalar(255));

      // 元画像をcv.Matに変換
      const src = cv.imread(canvas);

			console.log(src);
			cv.imshow(canvasRef.current, src)

	  // インペインティングの適用
      // const dst = new cv.Mat();
      // const inpaintRadius = 3;
      // const inpaintMethod = cv.INPAINT_TELEA;
      // console.log("c");
      // cv.inpaint(src, mask, dst, inpaintRadius, inpaintMethod);
      // // 修復された画像をCanvasに表示
      // console.log("d");
      // console.log(mask);
      // console.log(dst);
      // console.log(inpaintRadius);
      // console.log(inpaintMethod);
      // cv.imshow(canvas, dst);

      // // CanvasからDataURLを取得し、imgSrcを更新
      // const newImgSrc = canvas.toDataURL();
      // setImgSrc(newImgSrc);

      // // リソースの解放
      // src.delete();
      // dst.delete();
      // mask.delete();
    }
    console.log('Crop:', crop);
  }

  const onCropChange = (newCrop: Crop) => {
	setCrop(newCrop)
  }

  return (
	<div>
	  <input type="file" accept="image/*" onChange={onSelectFile} />
	  {imgSrc && (
		<ReactCrop
		  crop={crop}
		  onComplete={onCropComplete}
		  onChange={onCropChange}
		//   aspect={16 / 9}
		>
		  <img
			ref={imgRef}
			alt="Crop me"
			src={imgSrc}
			onLoad={onImageLoaded}
		  />
		</ReactCrop>
	  )}
		<canvas ref={canvasRef}></canvas>
	</div>
  )
}
