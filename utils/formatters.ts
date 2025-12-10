/**
 * Formatters
 * Utility functions for formatting dates, numbers, strings, and files
 */

// ============================================================
// Date Formatters
// ============================================================

/**
 * Format date to relative time string
 * @param dateString - ISO date string
 * @returns Relative time like "Just now", "2h ago", or formatted date
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString();
}

/**
 * Format date to short date string
 * @param dateString - ISO date string
 * @returns Formatted date like "Jan 15"
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date to full date string
 * @param dateString - ISO date string
 * @returns Formatted date like "January 15, 2024"
 */
export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to time string
 * @param dateString - ISO date string
 * @returns Formatted time like "2:30 PM"
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date to date and time string
 * @param dateString - ISO date string
 * @returns Formatted date and time like "Jan 15 at 2:30 PM"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr} at ${timeStr}`;
}

/**
 * Check if date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

// ============================================================
// File Formatters
// ============================================================

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

// ============================================================
// String Formatters
// ============================================================

/**
 * Truncate string to specified length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength - 3)}...`;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get initials from name (first letter of first and last name)
 */
export function getInitials(name: string): string {
  if (!name) return '?';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format count with abbreviation (1.2K, 3.4M)
 */
export function formatCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}
