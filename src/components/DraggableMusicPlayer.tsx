import React, { useState, useRef, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';
import './DraggableMusicPlayer.css';

interface Position {
  x: number;
  y: number;
}

const DraggableMusicPlayer: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('musicPlayerPosition');
    const savedMinimized = localStorage.getItem('musicPlayerMinimized');
    
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setPosition(parsed);
      } catch (e) {
        console.warn('Failed to parse saved music player position');
      }
    }
    
    if (savedMinimized) {
      setIsMinimized(savedMinimized === 'true');
    }
  }, []);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('musicPlayerPosition', JSON.stringify(position));
  }, [position]);

  // Save minimized state to localStorage
  useEffect(() => {
    localStorage.setItem('musicPlayerMinimized', isMinimized.toString());
  }, [isMinimized]);

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
    const snapThreshold = 50; // pixels from edge to trigger snap
    const elementWidth = dragRef.current?.offsetWidth || 300;
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

      // Prevent default to avoid conflicts
      e.preventDefault();
      e.stopPropagation();

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within screen bounds
      const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 300);
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
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
      document.body.style.pointerEvents = 'none'; // Prevent interaction with other elements
      
      // Re-enable pointer events for the drag handle
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

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      ref={dragRef}
      className={`draggable-music-player ${isDragging ? 'dragging' : ''} ${isMinimized ? 'minimized' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
      }}
    >
      {/* Drag Handle */}
      <div 
        className="drag-handle"
        onMouseDown={handleMouseDown}
        title="Drag to move music player"
      >
        <div className="drag-dots">
          <span>⋮⋮</span>
        </div>
        <div className="drag-title">
          🎵 AUDIO TERMINAL
        </div>
        <div className="drag-controls">
          <button 
            className="minimize-btn"
            onClick={toggleMinimize}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? '□' : '−'}
          </button>
        </div>
      </div>

      {/* Music Player Content */}
      <div className={`music-player-content ${isMinimized ? 'hidden' : ''}`}>
        <MusicPlayer />
      </div>
    </div>
  );
};

export default DraggableMusicPlayer;