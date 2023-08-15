import React, { useRef, useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function ImageUploader() {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const imgRef = useRef<HTMLImageElement | null>(null)

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

  const onCropComplete = (crop: Crop) => {
	console.log('Crop:', crop)
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
		  aspect={16 / 9}
		>
		  <img
			ref={imgRef}
			alt="Crop me"
			src={imgSrc}
			onLoad={onImageLoaded}
		  />
		</ReactCrop>
	  )}
	</div>
  )
}
