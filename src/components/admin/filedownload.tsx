'use client';
import React from 'react';
import { UploadedFile } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink, Printer } from 'lucide-react';

export function FileDownload({ files }: { files: UploadedFile[] }) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-600" />
          Attached Files to Print ({files.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {file.fileName}
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span>•</span>
                  <span className="font-medium text-indigo-600">{file.pageCount || 1} pages</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={file.fileUrl} download={file.fileName} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </a>
              <Button
                size="sm"
                className="gap-1.5 text-xs h-8 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
                onClick={() => window.print()}
              >
                <Printer className="h-3.5 w-3.5" /> Quick Print
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
