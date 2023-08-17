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
	const [svgString, setSvgString] = useState<string | null>(null);

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

      // クロップ領域に対応するマスクを作成
      let mask = new cv.Mat.zeros(imgRef.current.height, imgRef.current.width, cv.CV_8UC1);
      let rect = new cv.Rect(crop.x!, crop.y!, crop.width!, crop.height!);
      mask.roi(rect).setTo(new cv.Scalar(255));

      // 元画像をcv.Matに変換、RGBAをinpaintにぶち込めるようにRGBに変換しておく
      const src = cv.imread(canvas);
			let src3Channel = new cv.Mat();
			cv.cvtColor(src, src3Channel, cv.COLOR_RGBA2RGB);

		  // インペインティングの適用
      const dst = new cv.Mat(src3Channel.rows, src3Channel.cols, src3Channel.type());
      const inpaintRadius = 3;
      const inpaintMethod = cv.INPAINT_NS;
      cv.inpaint(src3Channel, mask, dst, inpaintRadius, inpaintMethod);

			// 336x336のサイズにリサイズ
			const dsize = new cv.Size(512, 512);
			let resized = new cv.Mat();
			cv.resize(dst, resized, dsize, 0, 0, cv.INTER_LINEAR); // ドット絵効果のためにcv.INTER_NEARESTを使用

			// 修復された画像をCanvasに表示
      cv.imshow(canvasRef.current, resized);

			const pngDataUrl = canvasRef.current!.toDataURL();

			// CanvasからSVGに変換
			const SvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
      <image href="${pngDataUrl}" x="0" y="0" height="512" width="512"/>
			</svg>`;
			setSvgString(SvgString); // SVG文字列をstateにセット

			// CanvasからDataURLを取得し、imgSrcを更新
      const newImgSrc = canvas.toDataURL();
      setImgSrc(newImgSrc);

      // // リソースの解放
			src.delete();
      src3Channel.delete();
      dst.delete();
      mask.delete();
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
		{svgString && (
			<img src={`data:image/svg+xml,${encodeURIComponent(svgString)}`} alt="SVG output" />
		)}
	</div>
  )
}
