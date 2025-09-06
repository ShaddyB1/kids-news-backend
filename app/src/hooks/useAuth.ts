import { useState, useEffect } from 'react';
import { FEATURES, MOCK_AUTH, isMockMode } from '../config/features';

export function useAuth() {
  const [state, setState] = useState(MOCK_AUTH);

  // Always use mock implementation for testing
  return {
    ...state,
    signInWithGoogle: async () => {
      setState(prev => ({ ...prev, user: { provider: 'google' } }));
    },
    signInWithApple: async () => {
      setState(prev => ({ ...prev, user: { provider: 'apple' } }));
    },
    restore: async () => true,
  };
}