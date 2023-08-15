import React, { useRef, useState } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import * as Tesseract from 'tesseract.js'

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

  const onCropComplete = async (crop: Crop) => {
	if (imgRef.current && crop.width && crop.height) {
	  const canvas = document.createElement('canvas')
	  const scaleX = imgRef.current.naturalWidth / imgRef.current.width
	  const scaleY = imgRef.current.naturalHeight / imgRef.current.height
	  canvas.width = crop.width
	  canvas.height = crop.height
	  const ctx = canvas.getContext('2d')!
	  ctx.drawImage(
		imgRef.current,
		crop.x! * scaleX,
		crop.y! * scaleY,
		crop.width! * scaleX,
		crop.height! * scaleY,
		0,
		0,
		crop.width!,
		crop.height!
	  )

	  const imageSrc = canvas.toDataURL()

	  const result = await Tesseract.recognize(imageSrc, 'eng')
	  console.log('OCR Result:', result.data.text)
	}
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
	</div>
  )
}
