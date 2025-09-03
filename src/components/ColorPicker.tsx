import React from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    panelColor: string;
    borderColor: string;
    textColor: string;
  };
  onColorChange: (key: string, color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ theme, onColorChange, onClose }) => {

  const handleColorInputChange = (property: string, value: string) => {
    onColorChange(property, value);
  };



  // Generate 100 preset themes with cool names - All maintaining dark terminal aesthetic
  const presetThemes = [
    { name: "NEON_CIRCUIT", colors: ['#00ff00', '#ffff00', '#000000', '#111111', '#333333'] },
    { name: "CYBER_SAMURAI", colors: ['#ff6600', '#00ff66', '#000000', '#111111', '#332211'] },
    { name: "QUANTUM_VOID", colors: ['#6600ff', '#ff6600', '#000000', '#0a0a0a', '#330066'] },
    { name: "DIGITAL_DAWN", colors: ['#ffaa00', '#00aaff', '#000000', '#111111', '#442200'] },
    { name: "PLASMA_BEAM", colors: ['#ff0080', '#80ff00', '#000000', '#0f0f0f', '#330033'] },
    { name: "BINARY_MATRIX", colors: ['#00ff00', '#ff0000', '#000000', '#001100', '#003300'] },
    { name: "CODE_CASCADE", colors: ['#00ffff', '#ff00aa', '#000000', '#001122', '#003344'] },
    { name: "DATA_STORM", colors: ['#aa00ff', '#00ffaa', '#000000', '#0a0a0a', '#220044'] },
    { name: "PIXEL_DREAM", colors: ['#ff5500', '#00ff55', '#000000', '#110a00', '#332200'] },
    { name: "VIRTUAL_REALITY", colors: ['#ff00ff', '#00aaff', '#000000', '#110011', '#440044'] },
    { name: "AI_NEXUS", colors: ['#ffff00', '#ff0088', '#000000', '#111100', '#444400'] },
    { name: "CRYSTAL_CORE", colors: ['#0088ff', '#ff8800', '#000000', '#001122', '#002244'] },
    { name: "DEEP_WEB", colors: ['#660066', '#00ff88', '#000000', '#110011', '#220022'] },
    { name: "GLITCHED_GRID", colors: ['#ff4400', '#44ff00', '#000000', '#110a00', '#221100'] },
    { name: "HOLOWAVE", colors: ['#0044ff', '#ff4400', '#000000', '#000a11', '#001144'] },
    { name: "INFINITE_LOOP", colors: ['#aaff00', '#00aaff', '#000000', '#111100', '#223300'] },
    { name: "LASER_POINT", colors: ['#ff00aa', '#aaff00', '#000000', '#110011', '#330022'] },
    { name: "MEGACITY", colors: ['#ffaa00', '#00ffaa', '#000000', '#111111', '#443322'] },
    { name: "NEURAL_NET", colors: ['#88ff00', '#ff8800', '#000000', '#0a1100', '#224400'] },
    { name: "OPTICAL_FIBER", colors: ['#00ff55', '#ff0055', '#000000', '#001100', '#003322'] },
    { name: "PULSE_WAVE", colors: ['#ff5500', '#00ff55', '#000000', '#110a00', '#332200'] },
    { name: "QUATRON", colors: ['#55ff00', '#ff5500', '#000000', '#0a1100', '#223300'] },
    { name: "ROYAL_BYTE", colors: ['#0055ff', '#ff0055', '#000000', '#000a11', '#001133'] },
    { name: "SYNAPSE", colors: ['#55ff88', '#ff8855', '#000000', '#0a110a', '#224422'] },
    { name: "TECHNO_VORTEX", colors: ['#8855ff', '#ff5588', '#000000', '#0a0a11', '#222244'] },
    { name: "ULTRA_VECTOR", colors: ['#aa55ff', '#ff55aa', '#000000', '#110a11', '#330233'] },
    { name: "VORTEX_CORE", colors: ['#ff55aa', '#aa55ff', '#000000', '#110a11', '#330233'] },
    { name: "WAVE_RIDER", colors: ['#55aa00', '#00aa55', '#000000', '#0a1100', '#223322'] },
    { name: "XENON_FLASH", colors: ['#aa0055', '#55aa00', '#000000', '#110a00', '#332211'] },
    { name: "YOTTA_BYTE", colors: ['#0055aa', '#aa0055', '#000000', '#000a11', '#001133'] },
    { name: "ZETTA_STORM", colors: ['#aa5500', '#0055aa', '#000000', '#110a00', '#332200'] },
    { name: "AETHER_GLOW", colors: ['#ff8800', '#00ff88', '#000000', '#111100', '#443322'] },
    { name: "BIONIC_PULSE", colors: ['#ff8800', '#8800ff', '#000000', '#110a00', '#332200'] },
    { name: "CERULEAN_DEEP", colors: ['#0088ff', '#ff0088', '#000000', '#000a11', '#002244'] },
    { name: "DYNAMIC_CORE", colors: ['#88ff00', '#ff8800', '#000000', '#0a1100', '#224400'] },
    { name: "ELECTRIC_STORM", colors: ['#ffff00', '#ff00ff', '#000000', '#111100', '#444400'] },
    { name: "FLUX_CAPACITOR", colors: ['#00ff66', '#6600ff', '#000000', '#001100', '#003322'] },
    { name: "GRAVITY_WELL", colors: ['#ff6600', '#00ff66', '#000000', '#110a00', '#332200'] },
    { name: "HYBRID_MATRIX", colors: ['#66ff00', '#ff00aa', '#000000', '#0a1100', '#223300'] },
    { name: "ILLUSION_NET", colors: ['#aa00ff', '#ffaa00', '#000000', '#110a00', '#332200'] },
    { name: "JUNCTURE_POINT", colors: ['#00aaff', '#ff00aa', '#000000', '#000a11', '#002244'] },
    { name: "KINETIC_ENERGY", colors: ['#ffaa44', '#00ffaa', '#000000', '#111100', '#443322'] },
    { name: "LUMINOUS_VOID", colors: ['#44aa00', '#aa44ff', '#000000', '#0a1100', '#223300'] },
    { name: "MECH_WARRIOR", colors: ['#aa4400', '#44aa00', '#000000', '#110a00', '#332200'] },
    { name: "NANO_FLUX", colors: ['#44aaff', '#aa44ff', '#000000', '#000a11', '#002244'] },
    { name: "OCEANIC_DEEP", colors: ['#aaff44', '#ffaa44', '#000000', '#111100', '#443322'] },
    { name: "PRISMATIC_BEAM", colors: ['#ff44aa', '#44ffaa', '#000000', '#110a11', '#332233'] },
    { name: "QUANTUM_WEAVE", colors: ['#44ffaa', '#aa44ff', '#000000', '#0a110a', '#224422'] },
    { name: "RADIANT_ECHO", colors: ['#aaffaa', '#ff44aa', '#000000', '#111100', '#443322'] },
    { name: "SPECTRAL_SHIFT", colors: ['#ff44aa', '#aa44aa', '#000000', '#110a11', '#332233'] },
    { name: "TEMPEST_RAGE", colors: ['#ffe044', '#44ffce', '#000000', '#111100', '#443322'] },
    { name: "ULTRAVIOLET_RAY", colors: ['#a44aff', '#ffa4e4', '#000000', '#110a11', '#332244'] },
    { name: "VIRAL_LOGIC", colors: ['#44ffa4', '#a4a44c', '#000000', '#0a110a', '#224422'] },
    { name: "WARP_DRIVE", colors: ['#ffa444', '#44ffa4', '#000000', '#111100', '#443322'] },
    { name: "XRAY_VISOR", colors: ['#44a4ff', '#ffa44c', '#000000', '#000a11', '#002244'] },
    { name: "YELLOW_ALERT", colors: ['#a444ff', '#44ffa4', '#000000', '#110a11', '#332244'] },
    { name: "ZENITH_LOOP", colors: ['#ffa4ce', '#a444ff', '#000000', '#111100', '#443322'] },
    { name: "AUDIO_MAGIC", colors: ['#cc44ff', '#44ffcc', '#000000', '#110a11', '#332244'] },
    { name: "BLADE_RUNNER", colors: ['#44ccff', '#ffcc44', '#000000', '#000a11', '#002244'] },
    { name: "CLOUD_SYSTEM", colors: ['#ffcc44', '#cc44ff', '#000000', '#111100', '#443322'] },
    { name: "DARK_ENERGY", colors: ['#ccff44', '#44ccff', '#000000', '#0a1100', '#224400'] },
    { name: "ELECTRIC_VIAL", colors: ['#44ffcc', '#cc44ff', '#000000', '#0a110a', '#224422'] },
    { name: "FUTURE_LIGHT", colors: ['#ffccaa', '#44ffcc', '#000000', '#111100', '#443322'] },
    { name: "GALAXY_EDGE", colors: ['#cc44aa', '#aacc44', '#000000', '#110a11', '#332233'] },
    { name: "HORIZON_SCAN", colors: ['#44ccaa', '#aacc44', '#000000', '#0a110a', '#224422'] },
    { name: "INSTANT_TELEPORT", colors: ['#aacc44', '#44ccaa', '#000000', '#111100', '#443322'] },
    { name: "JUMP_START", colors: ['#44aa44', '#aa44cc', '#000000', '#0a110a', '#224422'] },
    { name: "KRYPTON_GLOW", colors: ['#aa44a4', '#cc44aa', '#000000', '#110a11', '#332233'] },
    { name: "LUMINO_FLUX", colors: ['#44aa99', '#aa44cc', '#000000', '#0a110a', '#224422'] },
    { name: "MIND_BENDER", colors: ['#aa9944', '#44aa88', '#000000', '#111100', '#443322'] },
    { name: "NECRONOMICON", colors: ['#4499aa', '#aa44e9', '#000000', '#0a110a', '#224422'] },
    { name: "OVERDRIVE_MODE", colors: ['#99aa44', '#44aa66', '#000000', '#111100', '#443322'] },
    { name: "PHASE_FOREST", colors: ['#44cc66', '#cc44e9', '#000000', '#0a110a', '#224422'] },
    { name: "QUANTA_BURN", colors: ['#66cc44', '#44cc66', '#000000', '#0a1100', '#224400'] },
    { name: "RICKSHAW_NEON", colors: ['#cc6634', '#44cc44', '#000000', '#110a00', '#332200'] },
    { name: "SPACE_ZONE", colors: ['#66cc44', '#cc44ec', '#000000', '#0a1100', '#224400'] },
    { name: "TIME_TRAVEL", colors: ['#cc44aa', '#cc44aa', '#000000', '#110a11', '#332233'] },
    { name: "ULTRA_NOVA", colors: ['#ece44c', '#44cc55', '#000000', '#111100', '#443322'] },
    { name: "VILLAGE_GREEN", colors: ['#44ece4', '#cce44c', '#000000', '#0a1110', '#224433'] },
    { name: "WIND_WHISPER", colors: ['#ece44c', '#444cec', '#000000', '#111100', '#443322'] },
    { name: "XENON_LAMP", colors: ['#44cec4', '#cec44c', '#000000', '#0a1110', '#224433'] },
    { name: "YELLOW_SUBMARINE", colors: ['#cec44c', '#44cec4', '#000000', '#111100', '#443322'] },
    { name: "ZEPHYR_WOODS", colors: ['#4244ce', '#ce4442', '#000000', '#0a0a11', '#222244'] },
    { name: "ALPHA_NEUTRINO", colors: ['#ce4244', '#44ce42', '#000000', '#110a00', '#332200'] },
    { name: "BETA_PULSE", colors: ['#4442ce', '#ce4442', '#000000', '#0a0a11', '#222244'] },
    { name: "CRYSTAL_CARPET", colors: ['#4244ce', '#44ce42', '#000000', '#0a0a11', '#222244'] },
    { name: "DELTA_WING", colors: ['#42ce44', '#4442ce', '#000000', '#0a1100', '#224400'] },
    { name: "EPSILON_GEAR", colors: ['#ce4242', '#4244ce', '#000000', '#110a00', '#332200'] },
    { name: "GAMMA_RAYS", colors: ['#4242ce', '#42ce42', '#000000', '#0a0a11', '#222244'] },
    { name: "HYPER_LINK", colors: ['#4242ce', '#42ce42', '#000000', '#0a0a11', '#222244'] },
    { name: "ICEBERG_BLUE", colors: ['#aa4433', '#42ce42', '#000000', '#110a00', '#332200'] },
    { name: "JELLY_BEAN", colors: ['#42ce42', '#ce4242', '#000000', '#0a1100', '#224400'] },
    { name: "KALEIDOSCOPE", colors: ['#ce4242', '#42ce42', '#000000', '#110a00', '#332200'] },
    { name: "LASER_SIGHT", colors: ['#42ce42', '#ce4242', '#000000', '#0a1100', '#224400'] },
    { name: "MOON_LIGHT", colors: ['#4242ce', '#42ce42', '#000000', '#0a0a11', '#222244'] },
    { name: "NEBULA_DUST", colors: ['#ce4242', '#42ce42', '#000000', '#110a00', '#332200'] },
    { name: "OASIS_MIRAGE", colors: ['#4242ce', '#ce4242', '#000000', '#0a0a11', '#222244'] },
    { name: "PIXIE_DUST", colors: ['#42ce42', '#4242ce', '#000000', '#0a1100', '#224400'] },
    { name: "QUILL_PEN", colors: ['#4242ce', '#42ce42', '#000000', '#0a0a11', '#222244'] },
    { name: "RAIN_DROP", colors: ['#42ce42', '#4242ce', '#000000', '#0a1100', '#224400'] },
    { name: "SHELL_SPIRAL", colors: ['#ce4242', '#42ce42', '#000000', '#110a00', '#332200'] },
    { name: "THUNDER_CLOUD", colors: ['#4242ce', '#ce4242', '#000000', '#0a0a11', '#222244'] },
    { name: "UNICORN_HORN", colors: ['#42ce42', '#ce42ce', '#000000', '#0a1100', '#224400'] },
    { name: "VIOLET_STORM", colors: ['#ce42ce', '#42ce42', '#000000', '#110a11', '#332233'] },
    { name: "WHITE_NOISE", colors: ['#cecece', '#424242', '#000000', '#0a0a0a', '#222222'] },
    { name: "TERMINAL_GREEN", colors: ['#00ff00', '#33ff33', '#000000', '#001100', '#003300'] },
    { name: "AMBER_SCREEN", colors: ['#ffaa00', '#ff8800', '#000000', '#110a00', '#332200'] },
    { name: "RETRO_BLUE", colors: ['#0088ff', '#0066cc', '#000000', '#000a11', '#002244'] }
  ];

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
            if (propKey === 'textColor') return null; // Skip textColor as it's derived
            
            return (
              <div key={property} className="color-input-group">
                <label>{colorNames[property] || property.toUpperCase()}</label>
                <div className="color-input-container">
                  <input
                    type="color"
                    value={theme[propKey]}
                    onChange={(e) => handleColorInputChange(property, e.target.value)}
                    className="color-input"
                  />
                  <input
                    type="text"
                    value={theme[propKey]}
                    onChange={(e) => handleColorInputChange(property, e.target.value)}
                    className="hex-input"
                    placeholder="#000000"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="preset-themes">
          <h3>PRESET_THEMES (100)</h3>
          <div className="themes-scroll-container">
            <div className="theme-grid">
              {presetThemes.map((preset) => (
                <button
                  key={preset.name}
                  className="preset-theme-btn"
                  onClick={() => {
                    onColorChange('primaryColor', preset.colors[0]);
                    onColorChange('secondaryColor', preset.colors[1]);
                    onColorChange('backgroundColor', preset.colors[2]);
                    onColorChange('panelColor', preset.colors[3]);
                    onColorChange('borderColor', preset.colors[4]);
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
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