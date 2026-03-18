import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { X, Check, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface Area {
  width: number
  height: number
  x: number
  y: number
}

interface ImageEditorProps {
  image: string
  onSave: (croppedImage: string) => void
  onCancel: () => void
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ image, onSave, onCancel }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_setCroppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<string> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return ''

    const safeMargin = Math.max(image.width, image.height)
    canvas.width = safeMargin
    canvas.height = safeMargin

    ctx.translate(safeMargin / 2, safeMargin / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-safeMargin / 2, -safeMargin / 2)

    ctx.drawImage(
      image,
      safeMargin / 2 - image.width * 0.5,
      safeMargin / 2 - image.height * 0.5
    )

    const data = ctx.getImageData(0, 0, safeMargin, safeMargin)

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.putImageData(
      data,
      Math.round(0 - safeMargin / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeMargin / 2 + image.height * 0.5 - pixelCrop.y)
    )

    return canvas.toDataURL('image/jpeg')
  }

  const handleSave = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation)
      onSave(croppedImage)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      <div className="p-4 flex justify-between items-center bg-stone-900 border-b border-stone-800 text-white">
        <h3 className="text-xl font-bold">Editar Foto</h3>
        <button onClick={onCancel} className="p-2 hover:bg-stone-800 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative flex-grow bg-stone-800">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
        />
      </div>

      <div className="p-6 bg-stone-900 space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex items-center gap-4 text-white w-full max-w-xs">
            <ZoomOut className="w-5 h-5" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-grow accent-teal-500"
            />
            <ZoomIn className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-4 text-white w-full max-w-xs">
            <RotateCw className="w-5 h-5" />
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onChange={(e) => setRotation(Number(e.target.value))}
              className="flex-grow accent-teal-500"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-8 py-3 rounded-2xl font-bold text-white border border-stone-700 hover:bg-stone-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-2xl font-bold bg-teal-500 text-white hover:bg-teal-600 transition-colors flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Salvar Recorte
          </button>
        </div>
      </div>
    </div>
  )
}
