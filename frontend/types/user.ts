export interface User {
  provider: 'google' | 'apple' | null;
}

export interface AuthState {
  user: User | null;
  entitled: boolean;
}
