/**
 * Utility functions for handling date serialization/deserialization
 * to resolve Redux non-serializable value issues with MongoDB dates
 */

/**
 * Converts Date objects to ISO string format for Redux serialization
 */
export const serializeDate = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'string') {
    return date;
  }
  return new Date().toISOString();
};

/**
 * Converts ISO string back to Date object when needed for display
 */
export const deserializeDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Formats date string for display in UI
 */
export const formatDisplayDate = (dateString: string): string => {
  const date = deserializeDate(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats date string for display in tables (shorter format)
 */
export const formatTableDate = (dateString: string): string => {
  const date = deserializeDate(dateString);
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Recursively converts Date objects in an object to ISO strings
 */
export const serializeDatesInObject = (obj: Record<string, unknown>): Record<string, unknown> => {
  const serialized: Record<string, unknown> = { ...obj };
  
  for (const key in serialized) {
    const value = serialized[key];
    if (value instanceof Date) {
      serialized[key] = serializeDate(value);
    } else if (Array.isArray(value)) {
      // Handle arrays by processing each element
      serialized[key] = value.map((item: unknown) => {
        if (item instanceof Date) {
          return serializeDate(item);
        } else if (typeof item === 'object' && item !== null) {
          return serializeDatesInObject(item as Record<string, unknown>);
        }
        return item;
      });
    } else if (typeof value === 'object' && value !== null) {
      serialized[key] = serializeDatesInObject(value as Record<string, unknown>);
    }
  }
  
  return serialized;
};

/**
 * Get relative time string (e.g., "2 minutes ago", "1 hour ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = deserializeDate(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};
