"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useFirebaseWebSocket } from "@/hooks/useFirebaseWebSocket";
import { AnimatePresence } from "framer-motion";
import { oracleService } from "@/utils/oracleService";
import { websiteAnalytics } from "@/utils/analytics";


// Dynamically import all components to avoid SSR issues
const BackgroundVideo = dynamic(() => import("@/components/BackgroundVideo"), { ssr: false });
const LeftTypewriter = dynamic(() => import("@/components/LeftTypewriter"), { ssr: false });
const RadialVideoButtons = dynamic(() => import("@/components/RadialVideoButtons"), { ssr: false });
const BottomNavigation = dynamic(() => import("@/components/BottomNavigation"), { ssr: false });
// BirthdayEntry removed - no longer needed
const Scope = dynamic(() => import("@/components/Scope"), { ssr: false });
const NavigationHub = dynamic(() => import("@/components/NavigationHub"), { ssr: false });
const OracleHub = dynamic(() => import("@/components/OracleHub"), { ssr: false });
const RetroGeometry = dynamic(() => import("@/components/RetroGeometry"), { ssr: false });
const Manifesto = dynamic(() => import("@/components/Manifesto"), { ssr: false });
const CornerLogo = dynamic(() => import("@/components/CornerLogo"), { ssr: false });

export default function Page() {
  // Removed birthday/zodiac functionality - go directly to main page
  const [showMainPage, setShowMainPage] = useState(true);
  const [isNavigationHubOpen, setIsNavigationHubOpen] = useState(false);
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [isOracleHubOpen, setIsOracleHubOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cornerLogoVisible, setCornerLogoVisible] = useState(true);

  // Solana monitoring - now using Firebase WebSocket
  const {
    tokens,
    connectionStatus,
    loading: solanaLoading,
    reconnect,
    addToken,
    replaceWithSearchToken,
    resetToOriginalTokens,
    isSearchMode
  } = useFirebaseWebSocket();

  // Handle adding searched tokens to the list (REPLACE mode)
  const handleAddToken = (newToken: any) => {
    replaceWithSearchToken(newToken);
  };

  // Handle resetting to original tokens
  const handleResetTokens = () => {
    resetToOriginalTokens();
  };



  // Debug logging for state changes
  useEffect(() => {
    console.log("🎯 STATE CHANGED - isScopeOpen:", isScopeOpen, "isNavigationHubOpen:", isNavigationHubOpen, "isOracleHubOpen:", isOracleHubOpen, "isManifestoOpen:", isManifestoOpen);
    // console.log("🎯 TOKENS STATE:", { tokensCount: tokens.length, loading: solanaLoading, connected: connectionStatus.isConnected });
    
    // Track feature usage
    if (isScopeOpen) {
      websiteAnalytics.trackFeatureUsage('scope', 'opened');
      console.log("🎯 SCOPE IS NOW OPEN - Firebase WebSocket active");
    } else {
      websiteAnalytics.trackFeatureUsage('scope', 'closed');
      console.log("🎯 SCOPE IS NOW CLOSED - Firebase WebSocket active");
    }
    
    if (isNavigationHubOpen) {
      websiteAnalytics.trackFeatureUsage('navigation_hub', 'opened');
    } else {
      websiteAnalytics.trackFeatureUsage('navigation_hub', 'closed');
    }
    
    if (isOracleHubOpen) {
      websiteAnalytics.trackFeatureUsage('oracle_hub', 'opened');
    } else {
      websiteAnalytics.trackFeatureUsage('oracle_hub', 'closed');
    }
    
    if (isManifestoOpen) {
      websiteAnalytics.trackFeatureUsage('manifesto', 'opened');
    } else {
      websiteAnalytics.trackFeatureUsage('manifesto', 'closed');
    }
  }, [isScopeOpen, isNavigationHubOpen, isOracleHubOpen, isManifestoOpen]);

  // Smooth CornerLogo visibility transitions
  useEffect(() => {
    const shouldBeVisible = !isScopeOpen && !isNavigationHubOpen && !isOracleHubOpen && !isManifestoOpen;
    
    if (shouldBeVisible) {
      // Show immediately when closing hubs
      setCornerLogoVisible(true);
    } else {
      // Small delay when opening hubs to prevent flash
      const timer = setTimeout(() => {
        setCornerLogoVisible(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isScopeOpen, isNavigationHubOpen, isOracleHubOpen, isManifestoOpen]);

  // Check localStorage on component mount
  useEffect(() => {
    console.log('🔍 Page useEffect running - checking localStorage...');
    
    try {
      const savedBirthday = localStorage.getItem('userBirthday');
      const savedZodiacSign = localStorage.getItem('zodiacSign');
      const savedScopeOpen = localStorage.getItem('isScopeOpen');
      const savedNavigationOpen = localStorage.getItem('isNavigationHubOpen');
      const savedOracleOpen = localStorage.getItem('isOracleHubOpen');
      const savedManifestoOpen = localStorage.getItem('isManifestoOpen');
      
      console.log('🔍 localStorage values:', {
        savedBirthday: !!savedBirthday,
        savedZodiacSign: !!savedZodiacSign,
        savedScopeOpen,
        savedNavigationOpen,
        savedOracleOpen,
        savedManifestoOpen
      });
      
      if (savedBirthday && savedZodiacSign) {
        console.log('🔍 Found saved data, setting up main page...');
        setUserBirthday(new Date(savedBirthday));
        setZodiacSign(savedZodiacSign);
        setShowMainPage(true);
      } else {
        console.log('🔍 No saved data, will show birthday entry...');
        // If no saved data, still set loading to false so we can show birthday entry
        setShowMainPage(false);
      }
      
      // Restore UI states from localStorage
      if (savedScopeOpen) {
        setIsScopeOpen(savedScopeOpen === 'true');
      }
      if (savedNavigationOpen) {
        setIsNavigationHubOpen(savedNavigationOpen === 'true');
      }
      if (savedOracleOpen) {
        setIsOracleHubOpen(savedOracleOpen === 'true');
      }
      if (savedManifestoOpen) {
        setIsManifestoOpen(savedManifestoOpen === 'true');
      }
      
      console.log('🔍 Setting isLoading to false...');
      setIsLoading(false);
    } catch (error) {
      console.error('🔍 Error in useEffect:', error);
      setIsLoading(false);
    }
  }, []);

  // Initialize Oracle service to run 24/7
  useEffect(() => {
    console.log('🚀 Initializing Oracle service for 24/7 operation...');
    oracleService.startOracle();
    
    // Cleanup on unmount
    return () => {
      console.log('🛑 Cleaning up Oracle service...');
      oracleService.stopOracle();
    };
  }, []);

  // Removed birthday/zodiac functions - no longer needed


  // Functions to save UI states to localStorage
  const saveScopeState = (isOpen: boolean) => {
    setIsScopeOpen(isOpen);
    localStorage.setItem('isScopeOpen', isOpen.toString());
  };

  const saveNavigationState = (isOpen: boolean) => {
    setIsNavigationHubOpen(isOpen);
    localStorage.setItem('isNavigationHubOpen', isOpen.toString());
  };

  const saveOracleState = (isOpen: boolean) => {
    setIsOracleHubOpen(isOpen);
    localStorage.setItem('isOracleHubOpen', isOpen.toString());
  };

  const saveManifestoState = (isOpen: boolean) => {
    setIsManifestoOpen(isOpen);
    localStorage.setItem('isManifestoOpen', isOpen.toString());
  };

  // Show loading state while checking localStorage
  if (isLoading) {
    return <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  // Go directly to main page - birthday/zodiac functionality removed
  return (
    <ErrorBoundary>
      <main className="fixed inset-0 overflow-visible">
        {/* Always show background components - Scope will overlay on top */}
        <RetroGeometry isSlow={isNavigationHubOpen} isOracleOpen={isOracleHubOpen} isScopeOpen={isScopeOpen} />
        <BackgroundVideo isOracleOpen={isOracleHubOpen} />
        {!isOracleHubOpen && !isScopeOpen && <LeftTypewriter />}
        <CornerLogo size={64} isVisible={cornerLogoVisible} />
        <RadialVideoButtons 
          isNavigationHubOpen={isNavigationHubOpen}
          setIsNavigationHubOpen={saveNavigationState}
          isScopeOpen={isScopeOpen}
          setIsScopeOpen={saveScopeState}
          isOracleHubOpen={isOracleHubOpen}
          setIsOracleHubOpen={saveOracleState}
          isManifestoOpen={isManifestoOpen}
          setIsManifestoOpen={saveManifestoState}
        />
        <BottomNavigation isNavigationHubOpen={isNavigationHubOpen} isOracleHubOpen={isOracleHubOpen} isScopeOpen={isScopeOpen} />
        
        {/* NAVIGATION HUB component - overlays on top of background */}
        <AnimatePresence mode="wait">
          {isNavigationHubOpen && (
            <NavigationHub 
              key="navigation"
              isOpen={isNavigationHubOpen}
              onClose={() => saveNavigationState(false)}
            />
          )}
        </AnimatePresence>

        {/* SCOPE component - now overlays on top of background */}
        <AnimatePresence mode="wait">
          {isScopeOpen && (
            <Scope 
              key="scope"
              isOpen={isScopeOpen}
              tokens={tokens}
              isLoading={solanaLoading}
              lastUpdate={new Date()}
              stats={{ totalTokens: tokens.length }}
              connectionStatus={connectionStatus.isConnected ? "Connected" : "Disconnected"}
              live={true}
              resumeLive={() => {}}
              pauseLive={() => {}}
              pauseLiveOnHover={() => {}}
              resumeLiveAfterHover={() => {}}
              isHoverPaused={false}
              queuedTokens={[]}
              newTokenMint={null}
              onClose={() => saveScopeState(false)}
              onAddToken={handleAddToken}
              onResetTokens={handleResetTokens}
              isSearchMode={isSearchMode}
            />
          )}
        </AnimatePresence>

        {/* ORACLE HUB component - overlays on top of background */}
        <OracleHub 
          isOpen={isOracleHubOpen}
          onClose={() => saveOracleState(false)}
        />

        {/* MANIFESTO component - overlays on top of background */}
        <AnimatePresence mode="wait">
          {isManifestoOpen && (
            <Manifesto 
              key="manifesto"
              isOpen={isManifestoOpen}
              onClose={() => saveManifestoState(false)}
            />
          )}
        </AnimatePresence>
      </main>
    </ErrorBoundary>
  );
}
