import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '@components/3rdparty/ui/button';
import { cn } from '@lib/utils';
import { UploadedDocument, DocumentType } from './models';

interface DocumentUploaderProps {
  documents: UploadedDocument[];
  onChange: (documents: UploadedDocument[]) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const documentCategories: { type: DocumentType; label: string; description: string }[] = [
  { type: 'title', label: 'Title Documents', description: 'C of O, Deed of Assignment, etc.' },
  { type: 'survey', label: 'Survey Plans', description: 'Approved survey documents' },
  { type: 'photo', label: 'Property Photos', description: 'Images of the property' },
  { type: 'other', label: 'Other Documents', description: 'Any other relevant documents' },
];

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_FORMATS = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export function DocumentUploader({
  documents,
  onChange,
  maxSizeMB = MAX_FILE_SIZE_MB,
  acceptedFormats = ACCEPTED_FORMATS,
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentType>('title');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Accepted formats: PDF, JPG, PNG`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }
    return null;
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);
    const newDocuments: UploadedDocument[] = [];

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      const preview = await createPreview(file);
      newDocuments.push({
        id: generateId(),
        file,
        name: file.name,
        type: selectedCategory,
        preview,
      });
    }

    if (newDocuments.length > 0) {
      onChange([...documents, ...newDocuments]);
    }
  }, [documents, onChange, selectedCategory]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeDocument = (id: string) => {
    onChange(documents.filter(doc => doc.id !== id));
  };

  const getFileIcon = (doc: UploadedDocument) => {
    if (doc.preview) {
      return (
        <img
          src={doc.preview}
          alt={doc.name}
          className="w-full h-full object-cover"
        />
      );
    }
    if (doc.file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <File className="w-8 h-8 text-muted-foreground" />;
  };

  const getCategoryLabel = (type: DocumentType) => {
    return documentCategories.find(cat => cat.type === type)?.label || type;
  };

  const groupedDocuments = documentCategories.map(category => ({
    ...category,
    documents: documents.filter(doc => doc.type === category.type),
  })).filter(group => group.documents.length > 0);

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Document Category</label>
        <div className="grid grid-cols-2 gap-2">
          {documentCategories.map((category) => (
            <button
              key={category.type}
              type="button"
              onClick={() => setSelectedCategory(category.type)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all",
                selectedCategory === category.type
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
            >
              <p className="text-sm font-medium text-foreground">{category.label}</p>
              <p className="text-xs text-muted-foreground">{category.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isDragging ? "bg-primary/10" : "bg-muted"
          )}>
            <Upload className={cn(
              "w-6 h-6 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Uploading to: <span className="font-medium text-primary">{getCategoryLabel(selectedCategory)}</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            PDF, JPG, PNG • Max {maxSizeMB}MB per file
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Uploaded Documents */}
      {groupedDocuments.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Uploaded Documents</h4>
          
          {groupedDocuments.map((group) => (
            <div key={group.type} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group.label}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {group.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="relative group rounded-lg border border-border overflow-hidden bg-card"
                  >
                    <div className="aspect-square flex items-center justify-center bg-muted/50">
                      {getFileIcon(doc)}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground truncate" title={doc.name}>
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {documents.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No documents uploaded yet. Documents are optional but help speed up verification.
        </p>
      )}
    </div>
  );
}
