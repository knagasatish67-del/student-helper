'use client';
import React, { useState, useRef } from 'react';
import { UploadedFile } from '@/types';
import { Button } from '@/components/ui/button';
import { UploadCloud, File, Trash2, Plus, CheckCircle2, Layers } from 'lucide-react';

export interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  accept?: string;
  maxFiles?: number;
}

export function FileUpload({
  files,
  onFilesChange,
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.jpg,.png',
  maxFiles = 100, // Unlimited support per PRD
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (uploadedList: FileList | null) => {
    if (!uploadedList || uploadedList.length === 0) return;

    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < uploadedList.length; i++) {
      const file = uploadedList[i];
      // Estimate pages roughly based on size for PDF/docs or default to 10
      const estimatedPages = Math.max(1, Math.round(file.size / 150000)) || 10;
      newFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        fileType: file.type || 'application/pdf',
        pageCount: estimatedPages,
        uploadedAt: new Date().toISOString(),
      });
    }

    onFilesChange([...files, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const updatePageCount = (id: string, count: number) => {
    onFilesChange(
      files.map((f) => (f.id === id ? { ...f, pageCount: Math.max(1, count) } : f))
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-7 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40'
            : 'border-zinc-300 hover:border-indigo-400 bg-zinc-50/60 dark:border-zinc-700 dark:bg-zinc-900/40'
        }`}
      >
        <div className="rounded-full bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 mb-2.5">
          <UploadCloud className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Click to upload or drag & drop files here
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Layers className="h-3 w-3" /> Unlimited PDFs
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Upload any number of PDF, DOC, DOCX, or scanned documents (No limit)
        </p>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Uploaded Documents ({files.length} {files.length === 1 ? 'file' : 'files'})
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add More Files
            </Button>
          </div>

          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[240px] sm:max-w-[340px]">
                      {file.fileName}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {formatFileSize(file.fileSize)}
                    </p>
                  </div>
                </div>

                {/* Page count adjustment & delete */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                    <label className="text-[11px] text-zinc-500">Pages:</label>
                    <input
                      type="number"
                      min="1"
                      value={file.pageCount || 1}
                      onChange={(e) => updatePageCount(file.id, parseInt(e.target.value) || 1)}
                      className="w-14 rounded border border-zinc-200 px-2 py-1 text-center text-xs font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="h-8 w-8 text-zinc-400 hover:text-rose-600"
                    title="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
