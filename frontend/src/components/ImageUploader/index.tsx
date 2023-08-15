import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<ReactCrop.Crop>({ aspect: 4 / 3 });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div>
          <img src={image} alt="Uploaded preview" style={{ maxWidth: '100%' }} />
          <ReactCrop
            crop={crop}
            ruleOfThirds
            onComplete={newCrop => setCrop(newCrop)}
            onChange={newCrop => setCrop(newCrop)}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
