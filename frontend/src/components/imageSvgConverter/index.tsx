import { useEffect, useState } from 'react';

function DotArtComponent() {
  const [svg, setSvg] = useState('');
  const [originalImage, setOriginalImage] = useState('');
  const [dotSize, setDotSize] = useState('64');
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    // dotSize または url が変更されたときに実行
    if (url) {
      convertPNGToDotArtSVG(url, Number(dotSize)).then(setSvg);
    }
  }, [dotSize, url]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setUrl(url); // URLの保存（useEffectの依存関係で使用）
  };

  const handleDotSizeChange = (e) => {
    setDotSize(e.target.value);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} accept="image/png" />
      <select value={dotSize} onChange={handleDotSizeChange}>
        <option value="16">16x16</option>
        <option value="32">32x32</option>
        <option value="64">64x64</option>
        <option value="128">128x128</option>
        <option value="256">256x256</option>
      </select>
      {originalImage && <img src={originalImage} alt="Original" />}
      {svg && <div dangerouslySetInnerHTML={{ __html: svg }} />}
    </div>
  );
}

export default DotArtComponent;

// convertPNGToDotArtSVG関数は以前のメッセージで提供されたものと同じです。

async function convertPNGToDotArtSVG(url: string, dotSize: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = dotSize;
      canvas.height = dotSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Context not available');

      ctx.drawImage(img, 0, 0, dotSize, dotSize); // ドット数にリサイズ

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">`; // 512px四方に固定

      const scale = 512 / dotSize; // 描画スケールの計算

      for (let y = 0; y < dotSize; y++) {
        for (let x = 0; x < dotSize; x++) {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          let [r, g, b, a] = pixel;

          if (a !== 0) {
            // 256色に丸める
            r = Math.round(r / 4) * 4;
            g = Math.round(g / 4) * 4;
            b = Math.round(b / 4) * 4;

            const color = `rgba(${r},${g},${b},${a / 255})`;
            svg += `<rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="${color}"/>`; // スケールに合わせて描画
          }
        }
      }

      resolve(svg + '</svg>');
    };
  });
}
