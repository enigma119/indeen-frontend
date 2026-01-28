/**
 * Map of Supabase auth error messages to French translations
 */
const errorMap: Record<string, string> = {
  // Login errors
  'Invalid login credentials': 'Email ou mot de passe incorrect',
  'Email not confirmed': 'Veuillez vérifier votre email avant de vous connecter',
  'Invalid email or password': 'Email ou mot de passe incorrect',

  // Signup errors
  'User already registered': 'Cet email est déjà utilisé',
  'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
  'Unable to validate email address: invalid format': 'Format d\'email invalide',
  'Database error saving new user': 'Erreur lors de la création du compte. L\'email est peut-être déjà utilisé.',

  // Password reset errors
  'Email rate limit exceeded': 'Trop de tentatives. Veuillez attendre quelques minutes',
  'For security purposes, you can only request this once every 60 seconds':
    'Pour des raisons de sécurité, veuillez attendre 60 secondes avant de réessayer',

  // Session errors
  'JWT expired': 'Votre session a expiré. Veuillez vous reconnecter',
  'Invalid Refresh Token': 'Session invalide. Veuillez vous reconnecter',
  'Refresh Token Not Found': 'Session expirée. Veuillez vous reconnecter',

  // Rate limiting
  'Request rate limit reached': 'Trop de requêtes. Veuillez patienter',

  // Network errors
  'Failed to fetch': 'Erreur de connexion. Vérifiez votre connexion internet',
  'Network request failed': 'Erreur réseau. Veuillez réessayer',

  // Generic errors
  'An error occurred': 'Une erreur est survenue',
  'Something went wrong': 'Une erreur est survenue. Veuillez réessayer',
};

/**
 * Translates Supabase auth errors to French user-friendly messages
 * @param error - The error object or string from Supabase
 * @returns A French error message
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!error) {
    return 'Une erreur est survenue';
  }

  // Handle string errors
  if (typeof error === 'string') {
    return errorMap[error] || error;
  }

  // Handle error objects
  if (typeof error === 'object') {
    const errorObj = error as { message?: string; error_description?: string };

    // Check for message property
    if (errorObj.message) {
      return errorMap[errorObj.message] || errorObj.message;
    }

    // Check for error_description (OAuth errors)
    if (errorObj.error_description) {
      return errorMap[errorObj.error_description] || errorObj.error_description;
    }
  }

  return 'Une erreur est survenue. Veuillez réessayer';
}

/**
 * Check if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = typeof error === 'string'
    ? error
    : (error as { message?: string }).message || '';

  return (
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('Network request failed') ||
    errorMessage.includes('network')
  );
}

/**
 * Check if an error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = typeof error === 'string'
    ? error
    : (error as { message?: string }).message || '';

  return (
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many requests')
  );
}
