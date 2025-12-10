/**
 * File utility functions for handling file operations
 */

/**
 * Format file size from bytes to human-readable string
 * @param bytes - File size in bytes (can be null)
 * @returns Formatted string like "2.5 MB", "150 KB", or "Unknown size"
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) {
    return 'Unknown size';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i >= sizes.length) {
    return `${(bytes / Math.pow(k, sizes.length - 1)).toFixed(1)} ${sizes[sizes.length - 1]}`;
  }

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Extract file extension from filename or URL
 * @param filename - Filename or file URL
 * @returns Lowercase file extension (e.g., "pdf", "docx") or empty string
 */
export function getFileExtension(filename: string): string {
  if (!filename) return '';

  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) {
    return '';
  }

  return filename.substring(lastDot + 1).toLowerCase();
}

/**
 * Format date to relative time string (matches PostItem.tsx pattern)
 * @param dateString - ISO date string
 * @returns Relative time like "Just now", "2h ago", or formatted date
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    if (diffInHours < 1) return 'Just now';
    return `${diffInHours}h ago`;
  }

  return date.toLocaleDateString();
}

/**
 * Extract filename from file URL path
 * @param url - File URL or absolute path
 * @returns Extracted filename or original URL if extraction fails
 */
export function getFilenameFromUrl(url: string): string {
  if (!url) return '';

  // Handle both Unix and Windows paths
  const lastSlash = Math.max(url.lastIndexOf('/'), url.lastIndexOf('\\'));

  if (lastSlash === -1) {
    return url;
  }

  return url.substring(lastSlash + 1);
}

/**
 * Determine file type category from extension or MIME type
 * Used for icon selection
 * @param filename - Filename
 * @param mimeType - Optional MIME type
 * @returns File type category string
 */
export function getFileTypeCategory(filename: string, mimeType?: string): string {
  const extension = getFileExtension(filename);

  // Check by extension first
  if (extension) {
    // Documents
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'document';
    if (['xls', 'xlsx'].includes(extension)) return 'spreadsheet';
    if (['ppt', 'pptx'].includes(extension)) return 'presentation';

    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) return 'image';

    // Videos
    if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'].includes(extension)) return 'video';

    // Audio
    if (['mp3', 'wav', 'aac', 'm4a', 'flac', 'ogg'].includes(extension)) return 'audio';

    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive';
  }

  // Check by MIME type if no extension match
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
  }

  return 'other';
}
