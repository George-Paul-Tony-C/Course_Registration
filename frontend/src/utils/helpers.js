/**
 * Common helper functions used across components
 */

/**
 * Gets a display name from an object based on available properties
 * @param {Object} obj - The object to extract a display name from
 * @returns {string} The display name
 */
export const getDisplayName = (obj) => {
  if (!obj) return '';
  
  // Return full name if both first and last name exist
  if (obj.firstName && obj.lastName) {
    return `${obj.firstName} ${obj.lastName}`;
  }
  
  // Return just first name if only it exists
  if (obj.firstName) {
    return obj.firstName;
  }
  
  // Return just last name if only it exists
  if (obj.lastName) {
    return obj.lastName;
  }
  
  // Return name if it exists
  if (obj.name) {
    return obj.name;
  }
  
  // Return username or displayName if they exist
  if (obj.username) {
    return obj.username;
  }
  
  if (obj.displayName) {
    return obj.displayName;
  }
  
  // Return email without domain if no better option exists
  if (obj.email) {
    return obj.email.split('@')[0];
  }
  
  // Fall back to ID if nothing else
  if (obj.id) {
    return `User ${obj.id}`;
  }
  
  return 'Unknown';
};

/**
 * Formats a date into a readable string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Formatting options for toLocaleDateString
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
};

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Time to wait in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Groups an array of objects by a key
 * @param {Array} array - Array to group
 * @param {string|Function} key - Key to group by or function that returns key
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Creates a unique ID
 * @returns {string} Unique ID
 */
export const createId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Formats a course ID with proper padding and prefix
 * @param {number|string} id - Course ID to format
 * @param {string} prefix - Optional prefix for course ID
 * @returns {string} Formatted course ID
 */
export const formatCourseId = (id, prefix = 'CS') => {
  if (!id) return '';
  
  // Convert to string and pad with zeros if needed
  const numericId = String(id).replace(/\D/g, '');
  const paddedId = numericId.padStart(3, '0');
  
  return `${prefix}${paddedId}`;
};

/**
 * Gets course status based on dates
 * @param {Object} course - Course object with dates
 * @returns {string} Course status (upcoming, active, completed)
 */
export const getCourseStatus = (course) => {
  if (!course || !course.startDate || !course.endDate) return 'unknown';
  
  const now = new Date();
  const startDate = new Date(course.startDate);
  const endDate = new Date(course.endDate);
  
  if (now < startDate) return 'upcoming';
  if (now > endDate) return 'completed';
  return 'active';
};