import React, { useState, useEffect, useRef } from 'react';
import { themeManager, Theme, ThemeColors } from '../lib/ThemeManager';

interface Position {
  x: number;
  y: number;
}

const ThemeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [currentTheme, setCurrentTheme] = useState<Theme>(themeManager.getCurrentTheme());
  const dragRef = useRef<HTMLDivElement>(null);

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('themeSelectorPosition');
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch (e) {
        console.warn('Failed to parse saved theme selector position');
      }
    }
  }, []);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('themeSelectorPosition', JSON.stringify(position));
  }, [position]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setCurrentTheme(themeManager.getCurrentTheme());
    };

    // Apply initial theme
    themeManager.applyTheme();

    // Listen for storage changes (in case theme is changed from another component)
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = dragRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  // Snap to edges function
  const snapToEdges = (x: number, y: number) => {
    const snapThreshold = 50;
    const elementWidth = dragRef.current?.offsetWidth || 280;
    const elementHeight = dragRef.current?.offsetHeight || 200;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newX = x;
    let newY = y;

    // Snap to left edge
    if (x < snapThreshold) {
      newX = 10;
    }
    // Snap to right edge
    else if (x + elementWidth > screenWidth - snapThreshold) {
      newX = screenWidth - elementWidth - 10;
    }

    // Snap to top edge
    if (y < snapThreshold) {
      newY = 10;
    }
    // Snap to bottom edge
    else if (y + elementHeight > screenHeight - snapThreshold) {
      newY = screenHeight - elementHeight - 10;
    }

    return { x: newX, y: newY };
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within screen bounds
      const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 280);
      const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 200);

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);

      // Apply snap-to-edges after dragging ends
      const currentElement = dragRef.current;
      if (currentElement) {
        const rect = currentElement.getBoundingClientRect();
        const snapped = snapToEdges(rect.left, rect.top);
        setPosition(snapped);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';

      if (dragRef.current) {
        dragRef.current.style.pointerEvents = 'auto';
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';
    };
  }, [isDragging, dragOffset]);

  const handleThemeSelect = (themeId: string) => {
    if (themeManager.setTheme(themeId)) {
      setCurrentTheme(themeManager.getCurrentTheme());
    }
  };

  const getThemePreview = (colors: ThemeColors) => ({
    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20, ${colors.accent}20)`,
    border: `2px solid ${colors.primary}`,
    boxShadow: `0 0 10px ${colors.primary}40`
  });

  if (!isOpen) {
    return (
      <div
        ref={dragRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          backgroundColor: 'var(--panel-color)',
          color: 'var(--primary-color)',
          padding: '8px 12px',
          border: '2px solid var(--primary-color)',
          borderRadius: '8px',
          fontFamily: 'var(--font-family)',
          zIndex: 1000,
          cursor: 'pointer',
          fontSize: '14px'
        }}
        onClick={() => setIsOpen(true)}
        onMouseDown={handleMouseDown}
        title="Click to open theme selector"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🎨</span>
          <span>Theme</span>
          <span style={{
            marginLeft: 'auto',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: currentTheme.colors.primary,
            boxShadow: `0 0 5px ${currentTheme.colors.primary}`
          }}></span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dragRef}
      className={`theme-selector ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '280px',
        backgroundColor: 'var(--panel-color)',
        color: 'var(--primary-color)',
        padding: '16px',
        border: '2px solid var(--primary-color)',
        borderRadius: '8px',
        fontFamily: 'var(--font-family)',
        zIndex: 1000,
        boxShadow: '0 0 20px var(--primary-color)40'
      }}
    >
      {/* Drag Handle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          padding: '4px 8px',
          backgroundColor: 'var(--background-color)',
          borderRadius: '4px',
          border: '1px solid var(--border-color)'
        }}
        onMouseDown={handleMouseDown}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⋮⋮</span>
          <span>🎨 THEME SELECTOR</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--primary-color)',
            border: '1px solid var(--primary-color)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'var(--font-family)'
          }}
          title="Close theme selector"
        >
          −
        </button>
      </div>

      {/* Current Theme Display */}
      <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: 'var(--background-color)', borderRadius: '4px' }}>
        <div style={{ fontSize: '12px', color: 'var(--secondary-color)', marginBottom: '4px' }}>
          CURRENT THEME:
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: currentTheme.colors.primary }}>
          {currentTheme.name}
        </div>
        <div style={{
          display: 'flex',
          gap: '4px',
          marginTop: '8px'
        }}>
          {[currentTheme.colors.primary, currentTheme.colors.secondary, currentTheme.colors.accent].map((color, index) => (
            <div
              key={index}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: `0 0 5px ${color}`,
                border: '1px solid var(--border-color)'
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Theme Options */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--secondary-color)', marginBottom: '8px' }}>
          AVAILABLE THEMES:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
          {themeManager.getAllThemes().map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              disabled={theme.id === currentTheme.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                backgroundColor: theme.id === currentTheme.id ? 'var(--primary-color)' : 'var(--background-color)',
                color: theme.id === currentTheme.id ? 'var(--background-color)' : 'var(--primary-color)',
                border: `1px solid ${theme.colors.primary}`,
                borderRadius: '4px',
                cursor: theme.id === currentTheme.id ? 'default' : 'pointer',
                fontSize: '12px',
                fontFamily: 'var(--font-family)',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              title={`Switch to ${theme.name} theme`}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                border: '1px solid var(--border-color)',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: theme.id === currentTheme.id ? 'bold' : 'normal' }}>
                  {theme.name}
                </div>
                <div style={{
                  fontSize: '10px',
                  opacity: 0.8,
                  marginTop: '2px'
                }}>
                  {theme.colors.primary} / {theme.colors.secondary}
                </div>
              </div>
              {theme.id === currentTheme.id && (
                <span style={{ color: 'var(--success-color)', fontSize: '14px' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Preview */}
      <div style={{ marginTop: '12px', padding: '8px', backgroundColor: 'var(--background-color)', borderRadius: '4px' }}>
        <div style={{ fontSize: '10px', color: 'var(--secondary-color)', marginBottom: '4px' }}>
          PREVIEW:
        </div>
        <div
          style={{
            height: '30px',
            borderRadius: '4px',
            ...getThemePreview(currentTheme.colors)
          }}
        />
      </div>
    </div>
  );
};

export default ThemeSelector;
