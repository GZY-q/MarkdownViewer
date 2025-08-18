import React, { useState, useRef, useCallback, useEffect } from 'react';
import './ResizablePanes.css';

interface ResizablePanesProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  initialSplitPercentage?: number;
  minPaneSize?: number;
}

const ResizablePanes: React.FC<ResizablePanesProps> = ({
  leftPane,
  rightPane,
  initialSplitPercentage = 50,
  minPaneSize = 200
}) => {
  const [splitPercentage, setSplitPercentage] = useState(initialSplitPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // 计算新的分割百分比
    let newPercentage = (mouseX / containerWidth) * 100;
    
    // 限制最小和最大尺寸
    const minPercentage = (minPaneSize / containerWidth) * 100;
    const maxPercentage = 100 - minPercentage;
    
    newPercentage = Math.max(minPercentage, Math.min(maxPercentage, newPercentage));
    
    setSplitPercentage(newPercentage);
  }, [isDragging, minPaneSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="resizable-panes"
    >
      <div 
        className="pane left-pane"
        style={{ width: `${splitPercentage}%` }}
      >
        {leftPane}
      </div>
      
      <div 
        ref={resizerRef}
        className={`resizer ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="resizer-line" />
      </div>
      
      <div 
        className="pane right-pane"
        style={{ width: `${100 - splitPercentage}%` }}
      >
        {rightPane}
      </div>
    </div>
  );
};

export default ResizablePanes;