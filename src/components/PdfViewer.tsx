'use client'
import React from 'react';
import { Document, Page } from 'react-pdf';

export default function PdfViewer({ url }: { url: string }) {
  return (
    <div className="border rounded p-2">
      <Document file={url}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}
