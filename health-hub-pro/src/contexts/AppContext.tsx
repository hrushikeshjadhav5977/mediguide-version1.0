import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSession, onAuthStateChange, getCurrentUser } from '@/lib/auth';
import type { Session } from '@supabase/supabase-js';
import { FamilyMember } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export type Screen =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'profile-setup'
  | 'home'
  | 'history'
  | 'scan'
  | 'scanning'
  | 'scan-error'
  | 'report-result'
  | 'family'
  | 'add-family'
  | 'nickname-popup'
  | 'profile'
  | 'report-explanation';

export type Tab = 'home' | 'history' | 'scan' | 'family' | 'profile';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface Report {
  id: string;
  date: string;
  type: string;
  labName: string;
  flagLevel: 'green' | 'yellow' | 'red';
  uploadedToABDM: boolean;
}



interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  hasCompletedProfile: boolean;
  setHasCompletedProfile: (value: boolean) => void;
  freeScansLeft: number;
  setFreeScansLeft: (value: number) => void;
  reports: Report[];
  setReports: (reports: Report[]) => void;
  familyMembers: FamilyMember[];
  setFamilyMembers: (members: FamilyMember[]) => void;
  showAuthModal: boolean;
  setShowAuthModal: (value: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  showPremiumModal: boolean;
  setShowPremiumModal: (value: boolean) => void;
  showNicknameModal: boolean;
  setShowNicknameModal: (value: boolean) => void;
  selectedFamilyMember: { id: string; name: string } | null;
  setSelectedFamilyMember: (member: { id: string; name: string } | null) => void;
  currentReportId: string | null;
  setCurrentReportId: (id: string | null) => void;
  viewingMember: FamilyMember | null;
  setViewingMember: (member: FamilyMember | null) => void;
  openChatbot: boolean;
  setOpenChatbot: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockReports: Report[] = [
  { id: '1', date: 'Jan 3, 2025', type: 'Lipid Panel', labName: 'CityLab Diagnostics', flagLevel: 'yellow', uploadedToABDM: true },
  { id: '2', date: 'Dec 28, 2024', type: 'Complete Blood Count', labName: 'Apollo Labs', flagLevel: 'green', uploadedToABDM: true },
  { id: '3', date: 'Dec 15, 2024', type: 'HbA1c Test', labName: 'HealthFirst Labs', flagLevel: 'red', uploadedToABDM: false },
  { id: '4', date: 'Nov 30, 2024', type: 'Liver Function Test', labName: 'CityLab Diagnostics', flagLevel: 'green', uploadedToABDM: true },
  { id: '5', date: 'Nov 15, 2024', type: 'Thyroid Panel', labName: 'MedPath Labs', flagLevel: 'yellow', uploadedToABDM: false },
];

const mockFamilyMembers: FamilyMember[] = [];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [freeScansLeft, setFreeScansLeft] = useState(3);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<{ id: string; name: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [viewingMember, setViewingMember] = useState<FamilyMember | null>(null);
  const [openChatbot, setOpenChatbot] = useState(false);

  /**
   * Initialize authentication state on app load
   * Checks for existing session and updates app state accordingly
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await getSession();
        const supabaseUser = await getCurrentUser();

        if (session && supabaseUser) {
          setIsLoggedIn(true);
          // Map Supabase user to app user format if needed
          // For now, we'll just set logged in state
          // Navigate to home if user is authenticated
          setCurrentScreen('home');
        } else {
          setIsLoggedIn(false);
          setCurrentScreen('onboarding');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoggedIn(false);
        setCurrentScreen('onboarding');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    initializeAuth();

    /**
     * Listen to authentication state changes
     * Updates app state when user signs in/out
     */
    const { data: { subscription } } = onAuthStateChange(async (event, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        const supabaseUser = await getCurrentUser();
        if (supabaseUser) {
          setCurrentScreen('home');
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
        setCurrentScreen('onboarding');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Session refreshed, user still logged in
        setIsLoggedIn(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sync activeTab with currentScreen
   * Ensures tab highlight always matches the current screen
   */
  useEffect(() => {
    // Map screens to their corresponding tabs
    const screenToTabMap: Record<Screen, Tab> = {
      'home': 'home',
      'scan': 'scan',
      'scanning': 'scan',
      'scan-error': 'scan',
      'report-result': 'home',
      'report-explanation': 'home',
      'history': 'history',
      'family': 'family',
      'add-family': 'family',
      'nickname-popup': 'family',
      'profile': 'profile',
      'profile-setup': 'profile',
      'splash': 'home',
      'onboarding': 'home',
      'login': 'home',
      'signup': 'home',
    };

    const correspondingTab = screenToTabMap[currentScreen];
    if (correspondingTab && correspondingTab !== activeTab) {
      setActiveTab(correspondingTab);
    }
  }, [currentScreen, activeTab, setActiveTab]);

  /**
   * Load user profile on app startup
   * Fetches profile data from Supabase after authentication
   */
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          console.log('[AppContext] No authenticated user');
          return;
        }

        console.log('[AppContext] Loading profile for user:', authUser.id);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.log('[AppContext] No profile found:', profileError.message);
          return;
        }

        if (profileData) {
          console.log('[AppContext] Profile loaded:', profileData);

          // Map Supabase profile to app user format
          const fullName = (profileData.full_name as string) ?? '';
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] ?? '';
          const lastName = nameParts.slice(1).join(' ') ?? '';

          const userData = {
            firstName,
            lastName,
            email: authUser.email ?? '',
            dateOfBirth: (profileData.dob as string) ?? '',
            phoneNumber: (profileData.phone_number as string) ?? '',
            gender: (profileData.gender as string) ?? '',
            bloodGroup: (profileData.blood_group as string) ?? '',
            allergies: (profileData.allergies as string) ?? '',
            conditions: (profileData.health_conditions as string) ?? '',
            emergencyContact: {
              name: (profileData.em_contact_name as string) ?? '',
              relationship: (profileData.em_relationship as string) ?? '',
              phone: (profileData.em_phone as string) ?? '',
            },
          };

          console.log('[AppContext] Setting user data:', userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('[AppContext] Error loading profile:', error);
      }
    };

    // Only load profile if logged in
    if (isLoggedIn) {
      loadUserProfile();
    }
  }, [isLoggedIn, setUser]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        activeTab,
        setActiveTab,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        hasCompletedProfile,
        setHasCompletedProfile,
        freeScansLeft,
        setFreeScansLeft,
        reports,
        setReports,
        familyMembers,
        setFamilyMembers,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        showPremiumModal,
        setShowPremiumModal,
        showNicknameModal,
        setShowNicknameModal,
        selectedFamilyMember,
        setSelectedFamilyMember,
        currentReportId,
        setCurrentReportId,
        viewingMember,
        setViewingMember,
        openChatbot,
        setOpenChatbot,
      }}
    >
      {isCheckingAuth ? null : children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
