-- AlterTable
ALTER TABLE "File" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'material',
ADD COLUMN     "originalUploaderId" TEXT;
