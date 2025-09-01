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

  // Generate 100 preset themes with cool names
  const presetThemes = [
    { name: "NEON_CIRCUIT", colors: ['#ff00ff', '#00ffff', '#000011', '#111133', '#333366'] },
    { name: "CYBER_SAMURAI", colors: ['#ff6600', '#00ff66', '#000022', '#111144', '#333366'] },
    { name: "QUANTUM_VOID", colors: ['#6600ff', '#ff6600', '#000033', '#111155', '#333377'] },
    { name: "DIGITAL_DAWN", colors: ['#ffaa00', '#00aaff', '#000044', '#111166', '#333388'] },
    { name: "PLASMA_BEAM", colors: ['#ff0080', '#80ff00', '#000055', '#111177', '#333399'] },
    { name: "BINARY_MATRIX", colors: ['#00ff00', '#ff0000', '#000011', '#111122', '#222233'] },
    { name: "CODE_CASCADE", colors: ['#00ffff', '#ff00aa', '#001122', '#112233', '#333344'] },
    { name: "DATA_STORM", colors: ['#aa00ff', '#00ffaa', '#000066', '#111188', '#3333aa'] },
    { name: "PIXEL_DREAM", colors: ['#ff5500', '#00ff55', '#000077', '#111199', '#3333bb'] },
    { name: "VIRTUAL_REALITY", colors: ['#ff00ff', '#00aaff', '#000088', '#1111aa', '#3333cc'] },
    { name: "AI_NEXUS", colors: ['#ffff00', '#ff0088', '#000099', '#1111bb', '#3333dd'] },
    { name: "CRYSTAL_CORE", colors: ['#0088ff', '#ff8800', '#0000aa', '#1111cc', '#3333ee'] },
    { name: "DEEP_WEB", colors: ['#660066', '#00ff88', '#0000bb', '#1111dd', '#3333ff'] },
    { name: "GLITCHED_GRID", colors: ['#ff4400', '#44ff00', '#0000cc', '#1111ee', '#3344ff'] },
    { name: "HOLOWAVE", colors: ['#0044ff', '#ff4400', '#0000dd', '#1111ff', '#3344ff'] },
    { name: "INFINITE_LOOP", colors: ['#aaff00', '#00aaff', '#0000ee', '#2233ff', '#4466ff'] },
    { name: "LASER_POINT", colors: ['#ff00aa', '#aaff00', '#0000ff', '#2233ff', '#4466ff'] },
    { name: "MEGACITY", colors: ['#ffaa00', '#00ffaa', '#001122', '#223344', '#445566'] },
    { name: "NEURAL_NET", colors: ['#88ff00', '#ff8800', '#001133', '#223355', '#445577'] },
    { name: "OPTICAL_FIBER", colors: ['#00ff55', '#ff0055', '#001144', '#223366', '#445588'] },
    { name: "PULSE_WAVE", colors: ['#ff5500', '#00ff55', '#001155', '#223377', '#445599'] },
    { name: "QUATRON", colors: ['#55ff00', '#ff5500', '#001166', '#223388', '#4455aa'] },
    { name: "ROYALBYTE", colors: ['#0055ff', '#ff0055', '#001177', '#223399', '#4455bb'] },
    { name: "SYNAPSE", colors: ['#55ff88', '#ff8855', '#001188', '#2233aa', '#4455cc'] },
    { name: "TECHNO_VORTEX", colors: ['#8855ff', '#ff5588', '#001199', '#2233bb', '#4455dd'] },
    { name: "ULTRA_VECTOR", colors: ['#aa55ff', '#ff55aa', '#0011aa', '#2233cc', '#4455ee'] },
    { name: "VORTEX_CORE", colors: ['#ff55aa', '#aa55ff', '#0011bb', '#2233dd', '#4455ff'] },
    { name: "WAVE_RIDER", colors: ['#55aa00', '#00aa55', '#0011cc', '#2233ee', '#4466ff'] },
    { name: "XENON_FLASH", colors: ['#aa0055', '#55aa00', '#0011dd', '#2233ff', '#4466ff'] },
    { name: "YOTTABYTE", colors: ['#0055aa', '#aa0055', '#0011ee', '#3344ff', '#5588ff'] },
    { name: "ZETTA_STORM", colors: ['#aa5500', '#0055aa', '#0011ff', '#3344ff', '#5588ff'] },
    { name: "AETHER", colors: ['#ff8800', '#00ff88', '#112233', '#334455', '#556677'] },
    { name: "BIONIC", colors: ['#ff8800', '#8800ff', '#112244', '#334466', '#556688'] },
    { name: "CERULEAN", colors: ['#0088ff', '#ff0088', '#112255', '#334477', '#556699'] },
    { name: "DYNAMIC", colors: ['#88ff00', '#ff8800', '#112266', '#334488', '#5566aa'] },
    { name: "ELECTRIC", colors: ['#ffff00', '#ff00ff', '#112277', '#334499', '#5566bb'] },
    { name: "FLUXION", colors: ['#00ff66', '#6600ff', '#112288', '#3344aa', '#5566cc'] },
    { name: "GRAVITY", colors: ['#ff6600', '#00ff66', '#112299', '#3344bb', '#5566dd'] },
    { name: "HYBRID", colors: ['#66ff00', '#ff00aa', '#1122aa', '#3344cc', '#5566ee'] },
    { name: "ILLUSION", colors: ['#aa00ff', '#ffaa00', '#1122bb', '#3344dd', '#5566ff'] },
    { name: "JUNCTURE", colors: ['#00aaff', '#ff00aa', '#1122cc', '#3344ee', '#5577ff'] },
    { name: "KINETIC", colors: ['#ffaa44', '#00ffaa', '#1122dd', '#3344ff', '#5577ff'] },
    { name: "LUMINOUS", colors: ['#44aa00', '#aa44ff', '#1122ee', '#4455ff', '#6688ff'] },
    { name: "MECHANICAL", colors: ['#aa4400', '#44aa00', '#1122ff', '#4455ff', '#6688ff'] },
    { name: "NANO_FLUX", colors: ['#44aaff', '#aa44ff', '#223311', '#445533', '#667755'] },
    { name: "OCEANIC", colors: ['#aaff44', '#ffaa44', '#223322', '#445544', '#667766'] },
    { name: "PRISMATIC", colors: ['#ff44aa', '#44ffaa', '#223333', '#445555', '#667777'] },
    { name: "QUANTUM_WEAVE", colors: ['#44ffaa', '#aa44ff', '#223344', '#445566', '#667788'] },
    { name: "RADIANT_ECHO", colors: ['#aaffaa', '#ff44aa', '#223355', '#445577', '#667799'] },
    { name: "SPECTRAL", colors: ['#ff44aaff', '#aa44aa', '#223366', '#445588', '#6677aa'] },
    { name: "TEMPEST", colors: ['#ffe044', '#44ffce', '#223377', '#445599', '#6677bb'] },
    { name: "ULTRAVIOLET", colors: ['#a44aff', '#ffa4e4', '#223388', '#4455aa', '#6677cc'] },
    { name: "VIRA_LOGIC", colors: ['#44ffa4', '#a4a44c', '#223399', '#4455bb', '#6677dd'] },
    { name: "WARP_DRIVE", colors: ['#ffa444', '#44ffa4', '#2233aa', '#4455cc', '#6677ee'] },
    { name: "XRAY_VISOR", colors: ['#44a4ff', '#ffa44c', '#2233bb', '#4455dd', '#6677ff'] },
    { name: "YELLOW_FIRE", colors: ['#a444ff', '#44ffa4', '#2233cc', '#4455ee', '#6688ff'] },
    { name: "ZENITH_LOOP", colors: ['#ffa4ce', '#a444ff', '#2233dd', '#4455ff', '#6688ff'] },
    { name: "AUDIO_MAGIC", colors: ['#cc44ff', '#44ffcc', '#2233ee', '#5566ff', '#77aaff'] },
    { name: "BLADE_RUNNER", colors: ['#44ccff', '#ffcc44', '#2233ff', '#5566ff', '#77aaff'] },
    { name: "CLOUD_SYSTEM", colors: ['#ffcc44', '#cc44ff', '#334411', '#556633', '#778855'] },
    { name: "DARK_ENERGY", colors: ['#ccff44', '#44ccff', '#334422', '#556644', '#778866'] },
    { name: "ELECTRIC_VIAL", colors: ['#44ffcc', '#cc44ff', '#334433', '#556655', '#778877'] },
    { name: "FUTURE_LIGHT", colors: ['#ffccaa', '#44ffcc', '#334444', '#556666', '#778888'] },
    { name: "GALAXY_EDGE", colors: ['#cc44aa', '#aacc44', '#334455', '#556677', '#778899'] },
    { name: "HORIZON_SCAN", colors: ['#44ccaa', '#aacc44', '#334466', '#556688', '#7788aa'] },
    { name: "INSTANT_TELEPORT", colors: ['#aacc44', '#44ccaa', '#334477', '#556699', '#7788bb'] },
    { name: "JUMP_START", colors: ['#44aa44', '#aa44cc', '#334488', '#5566aa', '#7788cc'] },
    { name: "KRYPTONIZ", colors: ['#aa44a4', '#cc44aa', '#334499', '#5566bb', '#7788dd'] },
    { name: "LUMINO_FLUX", colors: ['#44aa99', '#aa44cc', '#3344aa', '#5566cc', '#7788ee'] },
    { name: "MIND_BENDER", colors: ['#aa9944', '#44aa88', '#3344bb', '#5566dd', '#7788ff'] },
    { name: "NECRONOMICON", colors: ['#4499aa', '#aa44e9', '#3344cc', '#5566ee', '#7799ff'] },
    { name: "OVERDRIVE", colors: ['#99aa44', '#44aa66', '#3344dd', '#5566ff', '#7799ff'] },
    { name: "PHASE_FOREST", colors: ['#44cc66', '#cc44e9', '#3344ee', '#5577ff', '#77aaff'] },
    { name: "QUANTA_BURN", colors: ['#66cc44', '#44cc66', '#3344ff', '#5577ff', '#77aaff'] },
    { name: "RICKSHAW", colors: ['#cc6634', '#44cc44', '#445511', '#667733', '#889955'] },
    { name: "SPACE_ZONE", colors: ['#66cc44', '#cc44ec', '#445522', '#667744', '#889966'] },
    { name: "TIME_TRAVEL", colors: ['#cc44aa', '#cc44aa', '#445533', '#667755', '#889977'] },
    { name: "ULTRA_NOVA", colors: ['#ece44c', '#44cc55', '#445544', '#667766', '#889988'] },
    { name: "VILLAGE_GREEN", colors: ['#44ece4', '#cce44c', '#445555', '#667777', '#889999'] },
    { name: "WIND_WHISPER", colors: ['#ece44c', '#444cec', '#445566', '#667788', '#8899aa'] },
    { name: "XENON_LAMP", colors: ['#44cec4', '#cec44c', '#445577', '#667799', '#8899bb'] },
    { name: "YELLOW_SUB", colors: ['#cec44c', '#44cec4', '#445588', '#6677aa', '#8899cc'] },
    { name: "ZEPHYR_WOODS", colors: ['#4244ce', '#ce4442', '#445599', '#6677bb', '#8899dd'] },
    { name: "ALPHA_NEUTRINO", colors: ['#ce4244', '#44ce42', '#4455aa', '#6677cc', '#8899ee'] },
    { name: "BETA_PULSE", colors: ['#4442ce', '#ce4442', '#4455bb', '#6677dd', '#8899ff'] },
    { name: "CRYSTAL_CARPET", colors: ['#4244ce', '#44ce42', '#4455cc', '#6677ee', '#88aaff'] },
    { name: "DELTA_WING", colors: ['#42ce44', '#4442ce', '#4455dd', '#6677ff', '#88aaff'] },
    { name: "EPSILON_GEAR", colors: ['#ce4242', '#4244ce', '#4455ee', '#6688ff', '#99bbff'] },
    { name: "GAMMA_RAYS", colors: ['#4242ce', '#42ce42', '#4455ff', '#6688ff', '#99bbff'] },
    { name: "HYPER_LINK", colors: ['#4242ce', '#42ce42', '#556611', '#778833', '#99aa55'] },
    { name: "ICEBERG", colors: ['#ce décider', '#42ce42', '#556622', '#778844', '#99aa66'] },
    { name: "JELLY_BEAN", colors: ['#42ce42', '#42ce42', '#556633', '#778855', '#9Ⲓaa77'] },
    { name: "KALEIDOSCOPE", colors: ['#42ce42', '#42ce42', '#556644', '#778866', '#99aa88'] },
    { name: "LASER_SIGHT", colors: ['#42ce42', '#42ce42', '#556655', '#778877', '#99aa99'] },
    { name: "MOON_LIGHT", colors: ['#4242ce', '#42ce42', '#556666', '#778888', '#99aaaa'] },
    { name: "NEBULA", colors: ['#4242ce', '#42ce42', '#556677', '#778899', '#99aabb'] },
    { name: "OASIS", colors: ['#4242ce', '#42ce42', '#556688', '#7788aa', '#99aacc'] },
    { name: "PIXIE_DUST", colors: ['#4242ce', '#42ce42', '#556699', '#7788bb', '#99aadd'] },
    { name: "QUILL_PEN", colors: ['#4242ce', '#42ce42', '#5566aa', '#7788cc', '#99aaee'] },
    { name: "RAIN_DROP", colors: ['#4242ce', '#42ce42', '#5566bb', '#7788dd', '#99aaff'] },
    { name: "SHELL_SPIR", colors: ['#4242ce', '#42ce42', '#5566cc', '#7788ee', '#99bbff'] },
    { name: "THUNDER_CLOUD", colors: ['#4242ce', '#42ce42', '#5566dd', '#7788ff', '#99bbff'] },
    { name: "UNICORN_HORN", colors: ['#4242ce', '#42ce42', '#5566ee', '#7799ff', '#aabfff'] },
    { name: "VIOLET_OLEANDER", colors: ['#4242ce', '#42ce42', '#5566ff', '#7799ff', '#aabfff'] },
    { name: "WHITE_ROSE", colors: ['#4242ce', '#426ffe', '#667766', '#889988', '#aabaaa'] }
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
