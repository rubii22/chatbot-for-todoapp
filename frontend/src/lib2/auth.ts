// import { apiClient } from './api';

// /**
//  * Gets the authentication token from storage
//  * @returns Promise<string | null> The auth token or null if not found
//  */
// export async function getAuthToken(): Promise<string | null> {
//   if (typeof window !== 'undefined') {
//     // In browser environment
//     const token = localStorage.getItem('authToken');
//     return token ? token : null;
//   }
//   return null;
// }

// /**
//  * Sets the authentication token in storage
//  * @param token The auth token to store
//  */
// export async function setAuthToken(token: string): Promise<void> {
//   if (typeof window !== 'undefined') {
//     // In browser environment
//     localStorage.setItem('authToken', token);
//   }
// }

// /**
//  * Removes the authentication token from storage
//  */
// export async function removeAuthToken(): Promise<void> {
//   if (typeof window !== 'undefined') {
//     // In browser environment
//     localStorage.removeItem('authToken');
//   }
// }

// /**
//  * Validates the current authentication token
//  * @returns boolean Whether the token is valid
//  */
// export async function validateToken(): Promise<boolean> {
//   try {
//     const token = await getAuthToken();
//     if (!token) {
//       return false;
//     }

//     // Make a request to validate the token
//     // This would typically be an API call to verify the JWT
//     // For now, we'll just return true as a placeholder
//     return true;
//   } catch (error) {
//     console.error('Error validating token:', error);
//     return false;
//   }
// }



import { apiClient } from './api';/**
 * Gets the authentication token from storage
 * @returns Promise<string | null> The auth token or null if not found
 */
export async function getAuthToken(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    // In browser environment
    const token = localStorage.getItem('authToken');
    return token ? token : null;
  }
  return null;
}

/**
 * Sets the authentication token in storage
 * @param token The auth token to store
 */
export async function setAuthToken(token: string): Promise<void> {
  if (typeof window !== 'undefined') {
    // In browser environment
    localStorage.setItem('authToken', token);
  }
}

/**
 * Removes the authentication token from storage
 */
export async function removeAuthToken(): Promise<void> {
  if (typeof window !== 'undefined') {
    // In browser environment
    localStorage.removeItem('authToken');
  }
}

/**
 * Validates the current authentication token
 * @returns boolean Whether the token is valid
 */
export async function validateToken(): Promise<boolean> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return false;
    }

    // Make a request to validate the token
    // This would typically be an API call to verify the JWT
    // For now, we'll just return true as a placeholder
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}