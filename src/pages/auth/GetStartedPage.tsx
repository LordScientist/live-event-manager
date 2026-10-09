import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Mail, Smartphone } from 'lucide-react';
import lcIcon from '../../assets/lc-icon.png';
import worldMapUrl from '../../assets/world-map.svg';
import worldMapLightUrl from '../../assets/world-map-light.svg';
import { SplashScreen } from './SplashScreen';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import './GetStartedPage.css';

export interface GetStartedPageProps {
  /**
   * Optionally force showing or suppressing the initial splash screen animation.
   * If not specified, checks `?splash=false` query param and sessionStorage.
   */
  showSplash?: boolean;
}

export const GetStartedPage: React.FC<GetStartedPageProps> = ({
  showSplash: showSplashProp
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine whether to display the splash animation
  const shouldInitialShowSplash = useCallback(() => {
    // 1. Explicit prop override
    if (typeof showSplashProp === 'boolean') {
      return showSplashProp;
    }

    // 2. Query param override (?splash=false or ?splash=true)
    const splashParam = searchParams.get('splash');
    if (splashParam === 'false' || splashParam === '0') return false;
    if (splashParam === 'true' || splashParam === '1') return true;

    // 3. Location state override (e.g., returning from /login or /signup)
    if (location.state?.noSplash || location.state?.fromAuth) {
      return false;
    }

    // 4. Session memory to avoid repetitive splashes during the same session
    try {
      const hasSeen = sessionStorage.getItem('lc_get_started_splash_seen');
      if (hasSeen === 'true') {
        return false;
      }
    } catch {
      // sessionStorage might be restricted in some iframe contexts
    }

    return true;
  }, [showSplashProp, searchParams, location.state]);

  const [isSplashActive, setIsSplashActive] = useState<boolean>(shouldInitialShowSplash);

  const handleSplashComplete = () => {
    setIsSplashActive(false);
    try {
      sessionStorage.setItem('lc_get_started_splash_seen', 'true');
      sessionStorage.setItem('has_seen_splash', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Graceful Splash Screen Overlay */}
      {isSplashActive && (
        <SplashScreen
          duration={2200}
          onComplete={handleSplashComplete}
        />
      )}

      {/* Main "Let's Get Started!" Landing Container */}
      <div className="get-started-page" data-testid="get-started-page">
        {/* Subtle Theme Toggle in top-right */}
        <div className="get-started-theme-toggle">
          <ThemeToggle size="sm" />
        </div>

        {/* Mobile Viewport Wrapper */}
        <main className="get-started-frame" role="main" aria-label="Let's Get Started">
          {/* Subtle World Map Silhouette in Background */}
          <div className="get-started-map-layer" aria-hidden="true">
            <img
              src={worldMapUrl}
              alt=""
              className="get-started-map-img get-started-map-img--dark"
              loading="eager"
            />
            <img
              src={worldMapLightUrl}
              alt=""
              className="get-started-map-img get-started-map-img--light"
              loading="eager"
            />
          </div>

          {/* Top Brand Logo */}
          <header className="get-started-header">
            <div className="get-started-brand" aria-label="Live Connect">
              <img
                src={lcIcon}
                alt="Live Connect Logo"
                className="get-started-brand__logo"
              />
              <div className="get-started-brand__text">
                <span className="get-started-brand__live">Live</span>
                <span className="get-started-brand__connect">Connect</span>
              </div>
            </div>
          </header>

          {/* Center Content Section */}
          <div className="get-started-center-content">
            {/* Main Headline */}
            <h1 className="get-started-headline">
              <span className="get-started-headline__light">Let&apos;s Get</span>
              <span className="get-started-headline__bold">Started!</span>
            </h1>

            {/* Primary Action Button: SIGN IN */}
            <div className="get-started-action-box">
              <Link
                to="/login"
                className="get-started-btn-signin"
                aria-label="Sign In to your account"
              >
                SIGN IN
              </Link>

              {/* Centered Divider Text */}
              <div className="get-started-divider-text" aria-hidden="true">
                OR SIGN IN WITH
              </div>

              {/* Quick Auth Social / Direct Buttons */}
              <div
                className="get-started-auth-methods"
                role="group"
                aria-label="Alternative sign in options"
              >
                {/* Mail / Email Icon Button */}
                <button
                  type="button"
                  className="get-started-circle-btn get-started-circle-btn--mail"
                  onClick={() => navigate('/login?method=email')}
                  aria-label="Sign in with Email"
                  title="Sign in with Email"
                >
                  <Mail className="get-started-circle-icon" size={20} strokeWidth={2.2} />
                </button>

                {/* Smartphone / Mobile Icon Button */}
                <button
                  type="button"
                  className="get-started-circle-btn get-started-circle-btn--phone"
                  onClick={() => navigate('/login?method=phone')}
                  aria-label="Sign in with Phone"
                  title="Sign in with Phone"
                >
                  <Smartphone className="get-started-circle-icon" size={20} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Area: Divider Line & Sign Up Link */}
          <footer className="get-started-footer">
            <div className="get-started-line-divider" role="separator" />

            <div className="get-started-signup-row">
              <span className="get-started-signup-question">
                DIDN&apos;T HAVE ACCOUNT?
              </span>
              <Link
                to="/signup"
                className="get-started-signup-link"
                aria-label="Sign up now for a new account"
              >
                SIGN UP NOW
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default GetStartedPage;
