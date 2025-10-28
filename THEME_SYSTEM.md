# Theme System Documentation

## Overview
The BKM Terminal platform features a comprehensive theme system with 6 pre-built themes and a draggable theme selector interface.

## Features

### 🎨 Available Themes

#### 1. Terminal Classic (Default)
**Classic green terminal aesthetic**
```css
Primary:    #00ff00 (Green)
Secondary:  #ffff00 (Yellow)
Accent:     #ff00ff (Magenta)
Background: #000000 (Black)
```

#### 2. Cyberpunk
**Neon lights and retro-futuristic vibes**
```css
Primary:    #00ffff (Cyan)
Secondary:  #ff00ff (Pink)
Accent:     #ffff00 (Yellow)
Background: #0a0a0a (Near Black)
```

#### 3. Matrix
**Inspired by the Matrix digital rain**
```css
Primary:    #00ff41 (Matrix Green)
Secondary:  #00ff41 (Matrix Green)
Accent:     #00ff41 (Matrix Green)
Background: #000000 (Black)
```

#### 4. Amber Terminal
**Vintage amber monitor aesthetic**
```css
Primary:    #ffb000 (Amber)
Secondary:  #ff8c00 (Dark Orange)
Accent:     #ff6b35 (Orange Red)
Background: #1a1a00 (Dark Brown)
```

#### 5. Ocean Deep
**Deep blue underwater vibes**
```css
Primary:    #00bcd4 (Cyan)
Secondary:  #4dd0e1 (Light Cyan)
Accent:     #00acc1 (Dark Cyan)
Background: #001a1a (Deep Blue)
```

#### 6. Synthwave
**80s retro synthwave aesthetic**
```css
Primary:    #ff007f (Hot Pink)
Secondary:  #00ffff (Cyan)
Accent:     #ffff00 (Yellow)
Background: #1a0033 (Deep Purple)
```

## Technical Implementation

### ThemeManager Service

#### Singleton Pattern
```typescript
import { themeManager } from './lib/ThemeManager';

// Get current theme
const currentTheme = themeManager.getCurrentTheme();

// Set a new theme
themeManager.setTheme('cyberpunk');

// Get all available themes
const allThemes = themeManager.getAllThemes();

// Apply theme to DOM
themeManager.applyTheme();
```

#### Theme Structure
```typescript
interface ThemeColors {
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

interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}
```

### CSS Variables Applied

#### Legacy Variables
```css
--primary-color
--secondary-color
--accent-color
--success-color
--warning-color
--danger-color
--info-color
--background-color
--panel-color
--border-color
--text-color
```

#### Modern Neon System
```css
--neon-cyan      (maps to primary)
--neon-green     (maps to success)
--neon-pink      (maps to accent)
--neon-yellow    (maps to secondary)
--neon-purple    (maps to info)
--neon-orange    (maps to warning)
--neon-red       (maps to danger)
```

#### Background System
```css
--bg-primary     (maps to background)
--bg-secondary   (maps to panel)
--bg-tertiary    (maps to border)
```

## ThemeSelector Component

### Features
- ✅ Draggable interface
- ✅ Edge snapping
- ✅ Position persistence
- ✅ Minimizable
- ✅ Live preview
- ✅ Current theme indicator

### Usage

#### In App.tsx
```typescript
import ThemeSelector from './components/ThemeSelector';

function App() {
  return (
    <div className="App">
      <ThemeSelector />
      {/* other components */}
    </div>
  );
}
```

### User Interface

#### Minimized State
```
┌─────────────┐
│ 🎨 Theme ● │ ← Click to expand
└─────────────┘
```

#### Expanded State
```
┌──────────────────────────┐
│ ⋮⋮ 🎨 THEME SELECTOR  − │
├──────────────────────────┤
│ CURRENT THEME:           │
│ Terminal Classic         │
│ ● ● ●                    │ ← Color preview
├──────────────────────────┤
│ AVAILABLE THEMES:        │
│ □ Terminal Classic ✓     │
│ □ Cyberpunk             │
│ □ Matrix                │
│ □ Amber Terminal        │
│ □ Ocean Deep            │
│ □ Synthwave             │
├──────────────────────────┤
│ PREVIEW:                 │
│ [gradient preview]       │
└──────────────────────────┘
```

## Integration with Components

### Using Theme Variables in CSS

```css
/* Modern approach */
.my-component {
  background: var(--bg-primary);
  color: var(--neon-cyan);
  border: 1px solid var(--neon-green);
}

/* Legacy approach */
.my-component {
  background: var(--background-color);
  color: var(--primary-color);
  border: 1px solid var(--success-color);
}
```

### Using Theme in React Components

```typescript
import { themeManager } from '../lib/ThemeManager';

const MyComponent = () => {
  const theme = themeManager.getCurrentTheme();
  
  return (
    <div style={{ color: theme.colors.primary }}>
      Themed content
    </div>
  );
};
```

### Dynamic Theme-Based Styling

```typescript
const getThemeStyles = () => {
  const colors = themeManager.getThemeColors();
  
  return {
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    boxShadow: `0 0 20px ${colors.primary}40`
  };
};
```

## Persistence

### Storage Method
- **Cookie-based** storage
- **1-year expiry**
- **Cookie name:** `terminal_theme`
- **Path:** `/` (site-wide)
- **SameSite:** `Lax`

### LocalStorage (Selector Position)
```typescript
localStorage.getItem('themeSelectorPosition')
// Returns: {"x": 20, "y": 100}
```

## Creating Custom Themes

### Add New Theme to ThemeManager.ts

```typescript
export const THEMES: Record<string, Theme> = {
  // ... existing themes
  myTheme: {
    id: 'myTheme',
    name: 'My Custom Theme',
    colors: {
      primary: '#ff1493',    // Deep Pink
      secondary: '#00ff00',   // Green
      accent: '#ffa500',      // Orange
      success: '#32cd32',     // Lime Green
      warning: '#ffd700',     // Gold
      danger: '#ff4500',      // Orange Red
      info: '#1e90ff',        // Dodger Blue
      background: '#0f0f0f',  // Dark Gray
      panel: '#1a1a1a',       // Darker Gray
      border: '#333333',      // Medium Gray
      text: '#ffffff'         // White
    }
  }
};
```

### Theme Best Practices

1. **Contrast**
   - Ensure text colors have sufficient contrast with backgrounds
   - WCAG AA: Minimum 4.5:1 ratio
   - WCAG AAA: Minimum 7:1 ratio

2. **Consistency**
   - Use primary for main UI elements
   - Use secondary for secondary actions
   - Use accent for highlights and special elements

3. **Accessibility**
   - Test themes with color blindness simulators
   - Ensure UI remains usable in all themes
   - Don't rely solely on color for information

4. **Visual Harmony**
   - Choose complementary colors
   - Maintain similar saturation levels
   - Consider color psychology

## Theme Testing

### Manual Testing
```typescript
// In browser console
const tm = require('./lib/ThemeManager').themeManager;

// Test all themes
['terminal', 'cyberpunk', 'matrix', 'amber', 'ocean', 'synthwave']
  .forEach(theme => {
    tm.setTheme(theme);
    console.log(`Applied: ${theme}`);
  });
```

### Visual Testing Checklist
- [ ] All pages render correctly
- [ ] Text is readable
- [ ] Borders are visible
- [ ] Buttons have sufficient contrast
- [ ] Hover states are clear
- [ ] Focus indicators are visible
- [ ] Shadows/glows work well

## Performance

### Optimization
- **Single repaint** when changing themes
- **CSS variables** for instant updates
- **No component re-renders** needed
- **Cached theme** in singleton

### Memory Usage
- **~5KB** theme data
- **Minimal** DOM manipulation
- **No** additional libraries

## Browser Compatibility

### Supported Features
- ✅ CSS Custom Properties (all modern browsers)
- ✅ Document.cookie API
- ✅ localStorage API
- ✅ CSS Variables (IE 11+ with polyfill)

### Fallbacks
- Default terminal theme if cookie fails
- Inline styles for critical elements
- Progressive enhancement

## Responsive Design

### Desktop
- Full theme selector (280px width)
- All features visible
- Draggable positioning

### Mobile (≤768px)
- Compact theme selector
- Touch-friendly controls
- Larger touch targets

### Mobile Portrait (≤480px)
- Minimized by default
- Simplified UI
- Quick theme switching

## Integration Points

### Components Using Themes
- ✅ App.tsx (global)
- ✅ HomePage
- ✅ LoginPage
- ✅ MonopolyPage
- ✅ MessengerPage
- ✅ UserHeader
- ✅ TokenWallet
- ✅ MusicPlayer
- ✅ All buttons and panels

### Theme-Aware Components
```typescript
// Components that respond to theme changes
- ThemeSelector
- UserHeader  
- TokenWallet
- TokenNotification
- All game pages
- All UI components
```

## Future Enhancements

### Planned Features
- [ ] Theme editor (create custom themes in UI)
- [ ] Import/export themes (JSON)
- [ ] Community theme sharing
- [ ] Time-based theme switching (day/night)
- [ ] Theme animation transitions
- [ ] Per-game theme preferences
- [ ] Accessibility mode (high contrast)
- [ ] Colorblind-friendly themes

### Advanced Features
- [ ] Theme marketplace
- [ ] AI-generated themes
- [ ] Gradient themes
- [ ] Animated backgrounds
- [ ] Sound themes (UI sounds per theme)
- [ ] Font themes

## Troubleshooting

### Theme Not Applying
1. Check browser console for errors
2. Verify cookie is saved: `document.cookie`
3. Force apply: `themeManager.applyTheme()`
4. Clear cookies and reload

### Colors Not Changing
1. Ensure using CSS variables correctly
2. Check element specificity
3. Verify theme ID is valid
4. Refresh page

### Selector Not Dragging
1. Check z-index conflicts
2. Verify pointer events
3. Test mouse/touch events
4. Clear localStorage: `localStorage.clear()`

## API Reference

### ThemeManager Methods

```typescript
// Get singleton instance
ThemeManager.getInstance(): ThemeManager

// Get current theme
getCurrentTheme(): Theme

// Get all available themes
getAllThemes(): Theme[]

// Set active theme
setTheme(themeId: string): boolean

// Apply current theme to DOM
applyTheme(): void

// Get current theme colors
getThemeColors(): ThemeColors
```

### Theme Interface

```typescript
interface Theme {
  id: string;           // Unique identifier
  name: string;         // Display name
  colors: ThemeColors;  // Color configuration
}

interface ThemeColors {
  primary: string;      // Main UI color
  secondary: string;    // Secondary UI color
  accent: string;       // Highlight color
  success: string;      // Success states
  warning: string;      // Warning states
  danger: string;       // Error/danger states
  info: string;         // Information states
  background: string;   // Main background
  panel: string;        // Panel backgrounds
  border: string;       // Border colors
  text: string;         // Text color
}
```

## Credits

### Inspiration
- Classic terminal emulators
- Retro computing aesthetics
- Modern dark mode designs
- Cyberpunk visual style

### Technology
- CSS Custom Properties
- React Hooks
- Cookie API
- LocalStorage API

---

**Built with ❤️ for customizable terminal experiences**
