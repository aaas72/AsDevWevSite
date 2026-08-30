import React from "react";
import { FiUploadCloud } from "react-icons/fi";
import Button from "./Button";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  dimensions: string;
  uploadText: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  isUploading,
  dimensions,
  uploadText,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] text-[#919191] uppercase tracking-[0.2em] font-bold ml-1">
        {label}
      </label>
      <div className="relative group/upload h-40 bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20">
        {value ? (
          <div className="relative w-full h-full group">
            <img 
              src={value} 
              alt={label} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button as="label" variant="primary" size="sm">
                CHANGE {uploadText}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={onChange} 
                  disabled={isUploading} 
                />
              </Button>
              <span className="text-[8px] text-white/70 mt-2 font-bold tracking-widest">{dimensions}</span>
            </div>
          </div>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-white/5 transition-colors">
            <FiUploadCloud className="text-2xl text-[#919191] mb-2" />
            <span className="text-[10px] font-bold tracking-widest text-[#919191]">
              {isUploading ? "UPLOADING..." : `UPLOAD ${uploadText}`}
            </span>
            <span className="text-[8px] text-[#919191]/70 mt-1 font-bold tracking-widest">{dimensions}</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={onChange} 
              disabled={isUploading} 
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
