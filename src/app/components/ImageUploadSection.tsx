import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadSectionProps {
  title: string;
  images: File[];
  onImagesAdded: (files: File[]) => void;
  onImageRemoved: (index: number) => void;
}

const ImageUploadSection = ({
  title,
  images,
  onImagesAdded,
  onImageRemoved,
} : ImageUploadSectionProps ) => {
  const fileInputRef = useRef(null);
 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onImagesAdded(files as File[]);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="bg-gray-50 text-black p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        <div className="gap-4">
          {/* File Upload Button */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer bg-white transition-colors">
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Choose Files</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Image Preview Grid */}
        <div className="grid grid-cols-2 gap-4">
          {images.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => onImageRemoved(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;