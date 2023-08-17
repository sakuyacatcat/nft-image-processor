import React, { useEffect, useRef, useState } from 'react';
declare const cv: any;

function onOpenCvReady() {
  document.getElementById('loadingOpenCv')?.remove();
}

export default function ImagePixelConverter() {
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

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [resolution, setResolution] = useState<number>(32);
  const [colors, setColors] = useState<number>(16);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
    // resolution または colors が変更されたときに再実行
    if (imgRef.current) {
      processImage({ currentTarget: imgRef.current } as React.SyntheticEvent<HTMLImageElement, Event>);
    }
  }, [resolution, colors]);


  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const canvasSize = 512; // キャンバスの固定サイズ

  const processImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const image = e.currentTarget;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // キャンバスのサイズを固定
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // 一時キャンバスを作成してリサイズ
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = resolution;
    tempCanvas.height = resolution;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(image, 0, 0, resolution, resolution);

    // 画像をcv.Matに読み込み
    const src = cv.imread(tempCanvas);

    // リサイズ後の画像を格納するためのMatを作成
    const resized = new cv.Mat();
    const newSize = new cv.Size(resolution, resolution);

    // 画像をリサイズ（cv.INTER_NEARESTを使用）
    cv.resize(src, resized, newSize, 0, 0, cv.INTER_NEAREST);

    // 色数を減らす
    const colorScale = 256 / colors;
    for (let y = 0; y < resized.rows; y++) {
      for (let x = 0; x < resized.cols; x++) {
        const pixel = resized.ucharPtr(y, x);
        for (let i = 0; i < 3; i++) {
          pixel[i] = Math.floor(pixel[i] / colorScale) * colorScale;
        }
      }
    }

    // 輪郭を強調するためのMatを作成
    const edges = new cv.Mat();

    // Cannyエッジ検出を適用
    cv.Canny(resized, edges, 50, 150, 3, false);

    // 輪郭を白色に変換
    for (let y = 0; y < edges.rows; y++) {
      for (let x = 0; x < edges.cols; x++) {
        if (edges.ucharPtr(y, x)[0] !== 0) {
          const pixel = resized.ucharPtr(y, x);
          pixel[0] = 255;
          pixel[1] = 255;
          pixel[2] = 255;
        }
      }
    }

    // 一時キャンバスに結果を描画
    cv.imshow(tempCanvas, resized);

      // 一時キャンバスの内容を最終キャンバスにコピー
    ctx.imageSmoothingEnabled = false; // ぼやけを防ぐ
    ctx.drawImage(tempCanvas, 0, 0, canvasSize, canvasSize);

    // リソースの解放
    src.delete();
    resized.delete();
  };


  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      <label>
        Resolution:
        <input type="range" min="8" max="512" value={resolution} onChange={(e) => setResolution(Number(e.target.value))} />
      </label>
      <label>
        Colors:
        <input type="range" min="2" max="256" value={colors} onChange={(e) => setColors(Number(e.target.value))} />
      </label>
      {imgSrc && (
        <div>
          <img ref={imgRef} alt="Original" src={imgSrc} onLoad={processImage} style={{ display: 'none' }} />
          <canvas
            ref={canvasRef}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      )}
    </div>
  );
}
