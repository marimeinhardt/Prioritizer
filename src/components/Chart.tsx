import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';
import { formatTime } from '../utils/timeCalculations';

interface ChartProps {
  themes: Theme[];
  totalTime: number;
}

const Chart: React.FC<ChartProps> = ({ themes, totalTime }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Wait for the Nunito font to load
    document.fonts.ready.then(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set dimensions based on container
      const containerWidth = canvas.clientWidth;
      const containerHeight = canvas.clientHeight;
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      
      // Chart dimensions
      const chartWidth = containerWidth * 0.2;
      const chartHeight = containerHeight * 0.85;
      const chartX = containerWidth * 0.1;
      const chartY = (containerHeight - chartHeight) / 2 + 20; // Added more space from top
      
      // Draw background
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(chartX, chartY, chartWidth, chartHeight);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(chartX, chartY, chartWidth, chartHeight);
      
      // Draw grid lines and labels
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const y = chartY + (chartHeight * i) / 10;
        const percentage = 100 - (i * 10);
        
        // Grid line
        ctx.moveTo(chartX, y);
        ctx.lineTo(chartX + chartWidth, y);
        
        // Percentage label
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Nunito';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, chartX - 5, y);
      }
      ctx.strokeStyle = '#e5e7eb';
      ctx.stroke();
      
      // Draw bars for themes and their projects
      let currentY = chartY + chartHeight;
      themes.forEach(theme => {
        const themeHeight = (theme.percentage / 100) * chartHeight;
        currentY -= themeHeight;
        
        // Theme bar
        ctx.fillStyle = theme.color;
        ctx.fillRect(chartX, currentY, chartWidth, themeHeight);
        
        const labelX = chartX + chartWidth + 20;
        
        // Only show theme name if there are no projects and time is >= 50 minutes
        if (theme.projects.length === 0 && theme.timeValue >= 0.833) {
          ctx.fillStyle = '#4b5563';
          ctx.font = '11px Nunito';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            `${theme.name} (${formatTime(theme.timeValue)})`,
            labelX,
            currentY + themeHeight / 2
          );
        }
        
        // Draw projects within theme
        let projectY = currentY;
        theme.projects.forEach(project => {
          const projectHeight = (project.percentage / 100) * themeHeight;
          
          // Project divider line
          ctx.beginPath();
          ctx.moveTo(chartX, projectY);
          ctx.lineTo(chartX + chartWidth, projectY);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Only show project label if time is >= 50 minutes
          if (project.timeValue >= 0.833) {
            ctx.fillStyle = '#4b5563';
            ctx.font = '11px Nunito';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              `${project.name} (${formatTime(project.timeValue)})`,
              labelX,
              projectY + projectHeight / 2
            );
          }
          
          projectY += projectHeight;
        });
      });
      
      // Chart title
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 14px Nunito';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(
        `${totalTime}h`,
        containerWidth / 2,
        20
      );
    });
  }, [themes, totalTime]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <canvas 
        ref={canvasRef} 
        className="w-full h-[600px]"
      />
    </div>
  );
};

export default Chart;