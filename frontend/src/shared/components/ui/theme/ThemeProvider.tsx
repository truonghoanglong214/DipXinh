import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { StoreBrandTheme, STORE_BRAND_PRESETS } from './tokens';

interface ThemeContextType {
  activeTheme: StoreBrandTheme;
  setThemeById: (id: string) => void;
  setCustomTheme: (theme: Partial<StoreBrandTheme> & { primary: string }) => void;
  presets: StoreBrandTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  initialTheme?: StoreBrandTheme;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialTheme = STORE_BRAND_PRESETS[0],
  children,
}) => {
  const [activeTheme, setActiveTheme] = useState<StoreBrandTheme>(initialTheme);

  const setThemeById = (id: string) => {
    const found = STORE_BRAND_PRESETS.find((p) => p.id === id);
    if (found) {
      setActiveTheme(found);
    }
  };

  const setCustomTheme = (theme: Partial<StoreBrandTheme> & { primary: string }) => {
    // Generate soft and hover variants if not provided
    const primary = theme.primary;
    setActiveTheme({
      id: theme.id || 'custom-store-theme',
      name: theme.name || 'Tùy biến Cửa hàng',
      description: theme.description || 'Cấu hình nhận diện thương hiệu động',
      primary,
      primaryHover: theme.primaryHover || primary,
      primarySoft: theme.primarySoft || `${primary}18`, // 10% alpha fallback
      primaryForeground: theme.primaryForeground || '#FFFFFF',
    });
  };

  // Synchronize CSS custom properties on :root or current subtree
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--dx-primary', activeTheme.primary);
    root.style.setProperty('--dx-primary-hover', activeTheme.primaryHover);
    root.style.setProperty('--dx-primary-soft', activeTheme.primarySoft);
    root.style.setProperty('--dx-primary-foreground', activeTheme.primaryForeground);
    root.style.setProperty('--dx-ring', activeTheme.primary);
  }, [activeTheme]);

  const value = useMemo(
    () => ({
      activeTheme,
      setThemeById,
      setCustomTheme,
      presets: STORE_BRAND_PRESETS,
    }),
    [activeTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useStoreTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      activeTheme: STORE_BRAND_PRESETS[0],
      setThemeById: () => {},
      setCustomTheme: () => {},
      presets: STORE_BRAND_PRESETS,
    };
  }
  return context;
}
