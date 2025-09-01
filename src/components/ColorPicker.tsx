import React, { useState } from 'react';
import { TerminalTheme } from '../types/GameTypes';
import './ColorPicker.css';

interface ColorPickerProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    panelColor: string;
    borderColor: string;
  };
  onColorChange: (key: keyof TerminalTheme, color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ theme, onColorChange, onClose }) => {
  const [activeProperty, setActiveProperty] = useState<keyof typeof theme | null>(null);

  // Rainbow color palette
  const rainbowColors = [
    '#ff0000', '#ff4400', '#ff8800', '#ffaa00', '#ffff00',
    '#aaff00', '#55ff00', '#00ff00', '#00ff55', '#00ffaa',
    '#00ffff', '#00aaff', '#0055ff', '#0000ff', '#4400ff',
    '#8800ff', '#aa00ff', '#ff00ff', '#ff00aa', '#ff0055'
  ];

  // Terminal-appropriate color palettes
  const colorPalettes = {
    terminal: ['#00ff00', '#ffff00', '#000000', '#111111', '#333333'],
    cyber: ['#00ffff', '#ff00ff', '#000011', '#111133', '#333366'],
    matrix: ['#00ff00', '#00aa00', '#000000', '#003300', '#006600'],
    retro: ['#ff6b6b', '#ffff00', '#000000', '#111111', '#666666'],
    neon: ['#ff0080', '#00ffff', '#001122', '#113344', '#334466']
  };

  const colorNames: { [key: string]: string } = {
    primaryColor: 'PRIMARY',
    secondaryColor: 'SECONDARY',
    backgroundColor: 'BACKGROUND',
    panelColor: 'PANEL',
    borderColor: 'BORDER'
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content color-picker-modal">
        <h2>THEME_CUSTOMIZATION</h2>

        <div className="current-theme-display">
          <h3>CURRENT_THEME_PREVIEW</h3>
          <div
            className="theme-preview"
            style={{
              backgroundColor: theme.backgroundColor,
              border: `2px solid ${theme.primaryColor}`,
              color: theme.primaryColor,
              padding: '10px',
              fontFamily: 'inherit',
              fontSize: '14px'
            }}
          >
            <div style={{ color: theme.secondaryColor }}>
              [TERMINAL_MODE_ACTIVE]
            </div>
            <div>
              PROPERTY_ELEMENTS_HERE
            </div>
            <div style={{ color: theme.secondaryColor, background: theme.panelColor }}>
              PANEL_CONTENT
            </div>
          </div>
        </div>

        <div className="color-customization">
          {Object.keys(theme).map((property) => {
            const propKey = property as keyof typeof theme;
            return (
              <div key={property} className="color-property">
                <div className="property-label">
                  {colorNames[property] || property.toUpperCase()}:
                </div>
                <div className="color-selection">
                  {activeProperty === propKey ? (
                    <div className="palette-grid">
                      <div className="current-color-display">
                        <div
                          className="current-color-preview"
                          style={{ backgroundColor: theme[propKey] }}
                        ></div>
                        <span>{theme[propKey]}</span>
                      </div>
                      <div className="palette-list">
                        <h4>RAINBOW_COLORS:</h4>
                        <div className="rainbow-grid">
                          {rainbowColors.map((color, index) => (
                            <button
                              key={`${property}-${color}-${index}`}
                              className="rainbow-color"
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                onColorChange(propKey, color);
                                setActiveProperty(null);
                              }}
                              title={`Color ${index + 1}: ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        className="back-btn"
                        onClick={() => setActiveProperty(null)}
                      >
                        BACK
                      </button>
                    </div>
                  ) : (
                    <button
                      className="color-picker-btn"
                      style={{
                        backgroundColor: theme[propKey],
                        border: '1px solid var(--primary-color, #00ff00)',
                        color: theme[propKey] === '#000000' ? '#00ff00' : '#000000',
                        padding: '5px 15px',
                        fontFamily: 'inherit',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveProperty(propKey)}
                    >
                      CUSTOMIZE
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="preset-themes">
          <h3>PRESET_THEMES</h3>
          <div className="theme-grid">
            {Object.entries(colorPalettes).map(([themeName, colors]) => (
              <button
                key={themeName}
                className="preset-theme-btn"
                onClick={() => {
                  onColorChange('primaryColor', colors[0]);
                  onColorChange('secondaryColor', colors[1]);
                  onColorChange('backgroundColor', colors[2]);
                  onColorChange('panelColor', colors[3]);
                  onColorChange('borderColor', colors[4]);
                }}
                style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                {themeName.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="action-btn save-btn" onClick={onClose}>
            SAVE_AND_EXIT
          </button>
          <button
            className="action-btn reset-btn"
            onClick={() => {
              // Reset to default terminal theme
              onColorChange('primaryColor', '#00ff00');
              onColorChange('secondaryColor', '#ffff00');
              onColorChange('backgroundColor', '#000000');
              onColorChange('panelColor', '#111111');
              onColorChange('borderColor', '#333333');
            }}
          >
            RESET_TO_DEFAULT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
