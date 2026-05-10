import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";

interface AuthState {
  user: any | null; // Use any to support both Firebase User and Mock User
  loading: boolean;
  isDemoMode: boolean;
  setUser: (user: any | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
  loginMock: (email: string) => void;
  logoutMock: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isDemoMode: !isFirebaseConfigured,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  initialize: () => {
    if (isFirebaseConfigured) {
      onAuthStateChanged(auth, (user) => {
        set({ user, loading: false });
      });
    } else {
      // In Demo Mode, we check local storage for a mock user
      const mockUser = localStorage.getItem('nexus_mock_user');
      set({
        user: mockUser ? JSON.parse(mockUser) : null,
        loading: false
      });
    }
  },
  loginMock: (email) => {
    const mockUser = {
      email,
      uid: 'mock-uid-123',
      displayName: email.split('@')[0],
      isMock: true
    };
    localStorage.setItem('nexus_mock_user', JSON.stringify(mockUser));
    set({ user: mockUser });
  },
  logoutMock: () => {
    localStorage.removeItem('nexus_mock_user');
    set({ user: null });
  }
}));
