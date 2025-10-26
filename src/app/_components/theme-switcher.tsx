"use client";

import styles from "./switch.module.css";
import { memo, useEffect, useState } from "react";

declare global {
  var updateDOM: () => void;
}

type ColorSchemePreference = "system" | "dark" | "light";

const STORAGE_KEY = "nextjs-blog-starter-theme";
const modes: ColorSchemePreference[] = ["system", "dark", "light"];

/** to reuse updateDOM function defined inside injected script */

/** function to be injected in script tag for avoiding FOUC (Flash of Unstyled Content) */
export const NoFOUCScript = (storageKey: string) => {
  /* can not use outside constants or function as this script will be injected in a different context */
  const [SYSTEM, DARK, LIGHT] = ["system", "dark", "light"];

  /** Modify transition globally to avoid patched transitions */
  const modifyTransition = () => {
    const css = document.createElement("style");
    css.textContent = "*,*:after,*:before{transition:none !important;}";
    document.head.appendChild(css);

    return () => {
      /* Force restyle */
      getComputedStyle(document.body);
      /* Wait for next tick before removing */
      setTimeout(() => document.head.removeChild(css), 1);
    };
  };

  const media = matchMedia(`(prefers-color-scheme: ${DARK})`);

  /** function to add remove dark class */
  window.updateDOM = () => {
    // Only run on client side after hydration
    if (typeof window === 'undefined') return;
    
    const restoreTransitions = modifyTransition();
    const mode = localStorage.getItem(storageKey) ?? SYSTEM;
    const systemMode = media.matches ? DARK : LIGHT;
    const resolvedMode = mode === SYSTEM ? systemMode : mode;
    const classList = document.documentElement.classList;
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (resolvedMode === DARK) classList.add(DARK);
      else classList.remove(DARK);
      document.documentElement.setAttribute("data-mode", mode);
      restoreTransitions();
    });
  };
  
  // Only execute if we're in the browser and DOM is ready
  if (typeof window !== 'undefined' && document.readyState !== 'loading') {
    window.updateDOM();
  } else if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', window.updateDOM);
  }
  media.addEventListener("change", window.updateDOM);
};

let updateDOM: () => void;

/**
 * Switch button to quickly toggle user preference.
 */
const Switch = () => {
  const [mode, setMode] = useState<ColorSchemePreference>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);
    
    // Initialize mode from localStorage after mounting
    const storedMode = localStorage.getItem(STORAGE_KEY) as ColorSchemePreference;
    if (storedMode) {
      setMode(storedMode);
    }

    // Wait for the script to load and define updateDOM
    const checkUpdateDOM = () => {
      if (window.updateDOM) {
        updateDOM = window.updateDOM;
      } else {
        // Retry after a short delay
        setTimeout(checkUpdateDOM, 100);
      }
    };
    checkUpdateDOM();
    
    /** Sync the tabs */
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEY) {
        setMode(e.newValue as ColorSchemePreference);
      }
    };
    
    addEventListener("storage", handleStorageChange);
    
    return () => {
      removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (mounted && updateDOM) {
      localStorage.setItem(STORAGE_KEY, mode);
      updateDOM();
    }
  }, [mode, mounted]);

  /** toggle mode */
  const handleModeSwitch = () => {
    const index = modes.indexOf(mode);
    setMode(modes[(index + 1) % modes.length]);
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className={styles.switch}
        disabled
        aria-label="Theme switcher loading"
      />
    );
  }

  return (
    <button
      className={styles.switch}
      onClick={handleModeSwitch}
      aria-label={`Switch to ${modes[(modes.indexOf(mode) + 1) % modes.length]} mode`}
    />
  );
};

const Script = memo(() => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(${NoFOUCScript.toString()})('${STORAGE_KEY}')`,
    }}
  />
));

/**
 * This component which applies classes and transitions.
 */
export const ThemeSwitcher = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on client side to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Script />
      <Switch />
    </>
  );
};
