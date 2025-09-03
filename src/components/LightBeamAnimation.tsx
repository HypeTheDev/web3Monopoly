import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { PageType } from '../pages/PageRouter';
import './LightBeamAnimation.css';

interface LightBeam {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  duration: number;
  delay: number;
  thickness: number;
  type: 'horizontal' | 'vertical' | 'diagonal' | 'circuit';
}

interface LightBeamAnimationProps {
  currentPage: PageType;
}

const LightBeamAnimation: React.FC<LightBeamAnimationProps> = ({ currentPage }) => {
  const [beams, setBeams] = useState<LightBeam[]>([]);
  const [isActive, setIsActive] = useState(true);

  // Page-specific color palettes
  const pageColors = useMemo(() => ({
    [PageType.HOME]: ['#00ff00', '#ffff00', '#00ffff'],
    [PageType.MESSENGER]: ['#ff00ff', '#00ffff', '#ff0080'],
    [PageType.MONOPOLY]: ['#00ff00', '#ffd700', '#ff6b35'],
    [PageType.DBA]: ['#ff8800', '#00ff80', '#8080ff'],
    [PageType.CHESS]: ['#8888ff', '#ffff88', '#ff88ff'],
    [PageType.SPADES]: ['#ff4444', '#44ff44', '#4444ff']
  }), []);

  const colors = pageColors[currentPage] || pageColors[PageType.HOME];

  // Page-specific beam generation patterns
  const getPageBeamConfig = useCallback(() => {
    switch (currentPage) {
      case PageType.MESSENGER:
        return {
          types: ['diagonal', 'circuit'] as LightBeam['type'][],
          frequency: 1.5, // Higher frequency
          thickness: [2, 4], // Thicker beams
          speed: [1.5, 3] // Faster beams
        };
      case PageType.MONOPOLY:
        return {
          types: ['horizontal', 'vertical'] as LightBeam['type'][],
          frequency: 0.8, // Lower frequency
          thickness: [1, 2], // Thinner beams
          speed: [3, 5] // Slower beams
        };
      case PageType.DBA:
        return {
          types: ['diagonal', 'horizontal'] as LightBeam['type'][],
          frequency: 1.2,
          thickness: [2, 3],
          speed: [2, 4]
        };
      case PageType.CHESS:
        return {
          types: ['circuit', 'diagonal'] as LightBeam['type'][],
          frequency: 0.9,
          thickness: [1, 3],
          speed: [2.5, 4.5]
        };
      case PageType.SPADES:
        return {
          types: ['horizontal', 'diagonal'] as LightBeam['type'][],
          frequency: 1.1,
          thickness: [2, 3],
          speed: [2, 3.5]
        };
      default: // HOME
        return {
          types: ['horizontal', 'vertical', 'diagonal', 'circuit'] as LightBeam['type'][],
          frequency: 1.0,
          thickness: [1, 4],
          speed: [2, 5]
        };
    }
  }, [currentPage]);

  // Generate random light beam paths
  const generateBeam = useCallback((): LightBeam => {
    const config = getPageBeamConfig();
    const type = config.types[Math.floor(Math.random() * config.types.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const thickness = config.thickness[0] + Math.random() * (config.thickness[1] - config.thickness[0]);
    const duration = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
    const delay = Math.random() * 2; // 0-2 seconds delay

    let startX, startY, endX, endY;

    switch (type) {
      case 'horizontal':
        startX = 0;
        startY = Math.random() * 100;
        endX = 100;
        endY = startY + (Math.random() - 0.5) * 20; // Slight curve
        break;
      case 'vertical':
        startX = Math.random() * 100;
        startY = 0;
        endX = startX + (Math.random() - 0.5) * 20; // Slight curve
        endY = 100;
        break;
      case 'diagonal':
        startX = Math.random() > 0.5 ? 0 : 100;
        startY = Math.random() > 0.5 ? 0 : 100;
        endX = startX === 0 ? 100 : 0;
        endY = startY === 0 ? 100 : 0;
        break;
      case 'circuit':
      default:
        // Circuit-like paths with right angles
        const isFromLeft = Math.random() > 0.5;
        if (isFromLeft) {
          startX = 0;
          startY = Math.random() * 100;
          endX = Math.random() * 50 + 25; // Mid-screen
          endY = Math.random() * 100;
        } else {
          startX = Math.random() * 50 + 25;
          startY = Math.random() * 100;
          endX = 100;
          endY = Math.random() * 100;
        }
        break;
    }

    return {
      id: `beam_${Date.now()}_${Math.random()}`,
      startX,
      startY,
      endX,
      endY,
      color,
      duration,
      delay,
      thickness,
      type
    };
  }, [colors, getPageBeamConfig]);

  // Generate scanning beam that sweeps across screen
  const generateScanBeam = useCallback((): LightBeam => {
    const isHorizontal = Math.random() > 0.5;
    return {
      id: `scan_${Date.now()}_${Math.random()}`,
      startX: isHorizontal ? 0 : Math.random() * 100,
      startY: isHorizontal ? Math.random() * 100 : 0,
      endX: isHorizontal ? 100 : Math.random() * 100,
      endY: isHorizontal ? Math.random() * 100 : 100,
      color: colors[0], // Always use primary green for scan beams
      duration: 1.5,
      delay: 0,
      thickness: 1,
      type: isHorizontal ? 'horizontal' : 'vertical'
    };
  }, [colors]);

  // Add new beams periodically
  useEffect(() => {
    if (!isActive) return;

    const addBeam = () => {
      const newBeam = Math.random() > 0.3 ? generateBeam() : generateScanBeam();
      
      setBeams(prev => {
        // Keep only recent beams to prevent memory buildup
        const recentBeams = prev.filter(beam => 
          Date.now() - parseInt(beam.id.split('_')[1]) < 10000
        );
        return [...recentBeams, newBeam];
      });

      // Remove beam after animation completes
      setTimeout(() => {
        setBeams(prev => prev.filter(beam => beam.id !== newBeam.id));
      }, (newBeam.duration + newBeam.delay) * 1000 + 1000);
    };

    // Initial beams
    addBeam();
    addBeam();
    
    // Add new beams at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to add beam
        addBeam();
      }
    }, Math.random() * 2000 + 1000); // 1-3 seconds

    return () => clearInterval(interval);
  }, [isActive, generateBeam, generateScanBeam, currentPage]);

  // Control animation based on user activity and create interactive beams
  useEffect(() => {
    let activityTimer: NodeJS.Timeout;

    const resetActivityTimer = () => {
      clearTimeout(activityTimer);
      setIsActive(true);
      
      // Reduce activity after 30 seconds of no interaction
      activityTimer = setTimeout(() => {
        setIsActive(false);
      }, 30000);
    };

    const handleActivity = () => resetActivityTimer();

    // Create interactive beam on click
    const handleClick = (e: MouseEvent) => {
      resetActivityTimer();
      
      // Create beam from click position to a random edge
      const clickX = (e.clientX / window.innerWidth) * 100;
      const clickY = (e.clientY / window.innerHeight) * 100;
      
      const interactiveBeam: LightBeam = {
        id: `interactive_${Date.now()}_${Math.random()}`,
        startX: clickX,
        startY: clickY,
        endX: Math.random() > 0.5 ? 0 : 100,
        endY: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 2,
        delay: 0,
        thickness: 3,
        type: 'diagonal'
      };
      
      setBeams(prev => [...prev, interactiveBeam]);
      
      // Remove after animation
      setTimeout(() => {
        setBeams(prev => prev.filter(beam => beam.id !== interactiveBeam.id));
      }, 3000);
    };

    // Create beam trail on mouse movement (throttled)
    let lastMouseBeam = 0;
    const handleMouseMove = (e: MouseEvent) => {
      resetActivityTimer();
      
      const now = Date.now();
      if (now - lastMouseBeam > 1000 && Math.random() > 0.8) { // 20% chance, max once per second
        lastMouseBeam = now;
        
        const mouseX = (e.clientX / window.innerWidth) * 100;
        const mouseY = (e.clientY / window.innerHeight) * 100;
        
        const trailBeam: LightBeam = {
          id: `trail_${Date.now()}_${Math.random()}`,
          startX: mouseX - 10 + Math.random() * 20,
          startY: mouseY - 10 + Math.random() * 20,
          endX: mouseX + 10 + Math.random() * 20,
          endY: mouseY + 10 + Math.random() * 20,
          color: colors[0], // Always green for mouse trails
          duration: 1,
          delay: 0,
          thickness: 1,
          type: 'circuit'
        };
        
        setBeams(prev => [...prev, trailBeam]);
        
        setTimeout(() => {
          setBeams(prev => prev.filter(beam => beam.id !== trailBeam.id));
        }, 2000);
      }
    };

    // Listen for user activity
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keypress', handleActivity);
    document.addEventListener('scroll', handleActivity);

    resetActivityTimer();

    return () => {
      clearTimeout(activityTimer);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keypress', handleActivity);
      document.removeEventListener('scroll', handleActivity);
    };
  }, [colors]);

  return (
    <div className="light-beam-container">
      {beams.map(beam => (
        <div
          key={beam.id}
          className={`light-beam light-beam-${beam.type}`}
          style={
            {
              '--start-x': `${beam.startX}%`,
              '--start-y': `${beam.startY}%`,
              '--end-x': `${beam.endX}%`,
              '--end-y': `${beam.endY}%`,
              '--beam-color': beam.color,
              '--beam-thickness': `${beam.thickness}px`,
              '--animation-duration': `${beam.duration}s`,
              '--animation-delay': `${beam.delay}s`,
            } as React.CSSProperties
          }
        >
          {/* Main beam line */}
          <div className="beam-line"></div>
          
          {/* Glow effect */}
          <div className="beam-glow"></div>
          
          {/* Particles along the beam */}
          <div className="beam-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>
          
          {/* Start and end points */}
          <div className="beam-point beam-start"></div>
          <div className="beam-point beam-end"></div>
        </div>
      ))}
      
      {/* Corner node indicators */}
      <div className="corner-nodes">
        <div className="corner-node top-left"></div>
        <div className="corner-node top-right"></div>
        <div className="corner-node bottom-left"></div>
        <div className="corner-node bottom-right"></div>
      </div>
      
      {/* Circuit grid overlay */}
      <div className="circuit-grid">
        <div className="grid-lines horizontal">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="grid-line" style={{ top: `${(i + 1) * 12.5}%` }}></div>
          ))}
        </div>
        <div className="grid-lines vertical">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="grid-line" style={{ left: `${(i + 1) * 8.33}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LightBeamAnimation;