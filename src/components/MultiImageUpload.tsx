import React, { useRef, useState } from "react";
import { validateImage, resizeAndCompressImage, RECOMMENDED_DIMENSIONS } from "@/lib/imageUtils";
import { Upload, Camera, Image as ImageIcon, Trash2 } from "lucide-react";

interface MultiImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  type?: 'property' | 'unit';
  disabled?: boolean;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ value, onChange, type = 'property', disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const updateFiles = (files: File[]) => {
    onChange(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleFilesSelected = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList as any as File[]);
    const processed: File[] = [];
    for (const file of files) {
      const validation = validateImage(file);
      if (!validation.valid) continue;
      const compressed = await resizeAndCompressImage(
        file,
        RECOMMENDED_DIMENSIONS[type].width,
        RECOMMENDED_DIMENSIONS[type].height
      );
      processed.push(compressed);
    }
    updateFiles([...(value || []), ...processed]);
  };

  const handleRemove = (index: number) => {
    const next = [...value];
    next.splice(index, 1);
    updateFiles(next);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={onDrag}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Upload className="h-12 w-12 text-gray-400" />
            <Camera className="h-6 w-6 text-gray-300 absolute -top-1 -right-1" />
            <ImageIcon className="h-6 w-6 text-gray-300 absolute -bottom-1 -left-1" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">Drag and drop or click here</p>
            <p className="text-sm text-gray-500">to upload your image (max 2 MiB)</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {previews.map((src, idx) => (
            <div key={idx} className="relative group">
              <img 
                src={src} 
                alt={`preview-${idx}`} 
                className="w-full h-24 object-cover rounded-lg border border-gray-200" 
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleRemove(idx); 
                }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;



