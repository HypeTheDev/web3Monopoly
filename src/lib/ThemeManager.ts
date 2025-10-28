export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  panel: string;
  border: string;
  text: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export const THEMES: Record<string, Theme> = {
  terminal: {
    id: 'terminal',
    name: 'Terminal Classic',
    colors: {
      primary: '#00ff00',
      secondary: '#ffff00',
      accent: '#ff00ff',
      success: '#00ffff',
      warning: '#ff8800',
      danger: '#ff0000',
      info: '#8888ff',
      background: '#000000',
      panel: '#111111',
      border: '#333333',
      text: '#cccccc'
    }
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      success: '#00ff00',
      warning: '#ff8800',
      danger: '#ff0000',
      info: '#8888ff',
      background: '#0a0a0a',
      panel: '#1a1a2e',
      border: '#16213e',
      text: '#e0e0e0'
    }
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix',
    colors: {
      primary: '#00ff41',
      secondary: '#00ff41',
      accent: '#00ff41',
      success: '#00ff41',
      warning: '#ffff00',
      danger: '#ff0000',
      info: '#00ff41',
      background: '#000000',
      panel: '#001100',
      border: '#003300',
      text: '#00ff41'
    }
  },
  amber: {
    id: 'amber',
    name: 'Amber Terminal',
    colors: {
      primary: '#ffb000',
      secondary: '#ff8c00',
      accent: '#ff6b35',
      success: '#32cd32',
      warning: '#ffd700',
      danger: '#dc143c',
      info: '#87ceeb',
      background: '#1a1a00',
      panel: '#2a2a00',
      border: '#4a4a00',
      text: '#ffd700'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Deep',
    colors: {
      primary: '#00bcd4',
      secondary: '#4dd0e1',
      accent: '#00acc1',
      success: '#4caf50',
      warning: '#ff9800',
      danger: '#f44336',
      info: '#2196f3',
      background: '#001a1a',
      panel: '#002626',
      border: '#004444',
      text: '#80deea'
    }
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    colors: {
      primary: '#ff007f',
      secondary: '#00ffff',
      accent: '#ffff00',
      success: '#00ff7f',
      warning: '#ff8000',
      danger: '#ff0000',
      info: '#ff00ff',
      background: '#1a0033',
      panel: '#2d1b69',
      border: '#4a0e4e',
      text: '#ff00ff'
    }
  }
};

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: Theme = THEMES.terminal;
  private cookieName = 'terminal_theme';

  private constructor() {
    this.loadThemeFromCookie();
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  private loadThemeFromCookie(): void {
    try {
      const savedThemeId = this.getCookie(this.cookieName);
      if (savedThemeId && THEMES[savedThemeId]) {
        this.currentTheme = THEMES[savedThemeId];
      }
    } catch (error) {
      console.warn('Failed to load theme from cookie:', error);
    }
  }

  private saveThemeToCookie(): void {
    try {
      this.setCookie(this.cookieName, this.currentTheme.id, 365); // 1 year expiry
    } catch (error) {
      console.warn('Failed to save theme to cookie:', error);
    }
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  getAllThemes(): Theme[] {
    return Object.values(THEMES);
  }

  setTheme(themeId: string): boolean {
    if (THEMES[themeId]) {
      this.currentTheme = THEMES[themeId];
      this.saveThemeToCookie();
      this.applyTheme();
      return true;
    }
    return false;
  }

  applyTheme(): void {
    const root = document.documentElement;
    const colors = this.currentTheme.colors;

    // Apply CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}-color`, value);
    });

    // Apply to legacy CSS variables for backward compatibility
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--success-color', colors.success);
    root.style.setProperty('--warning-color', colors.warning);
    root.style.setProperty('--danger-color', colors.danger);
    root.style.setProperty('--info-color', colors.info);
    root.style.setProperty('--background-color', colors.background);
    root.style.setProperty('--panel-color', colors.panel);
    root.style.setProperty('--border-color', colors.border);
    root.style.setProperty('--text-color', colors.text);

    // Apply to modern neon color system
    root.style.setProperty('--neon-cyan', colors.primary);
    root.style.setProperty('--neon-green', colors.success);
    root.style.setProperty('--neon-pink', colors.accent);
    root.style.setProperty('--neon-yellow', colors.secondary);
    root.style.setProperty('--neon-purple', colors.info);
    root.style.setProperty('--neon-orange', colors.warning);
    root.style.setProperty('--neon-red', colors.danger);
    
    // Apply background colors
    root.style.setProperty('--bg-primary', colors.background);
    root.style.setProperty('--bg-secondary', colors.panel);
    root.style.setProperty('--bg-tertiary', colors.border);

    // Force a repaint to ensure changes are applied
    void document.body.offsetHeight;
  }

  getThemeColors(): ThemeColors {
    return this.currentTheme.colors;
  }
}

export const themeManager = ThemeManager.getInstance();
