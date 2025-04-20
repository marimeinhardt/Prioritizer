import React, { useState } from 'react';
import { LockIcon, UnlockIcon, X, Pencil, Check } from 'lucide-react';
import { Project as ProjectType } from '../types';
import { formatTime } from '../utils/timeCalculations';

interface ProjectProps {
  project: ProjectType;
  themeColor: string;
  totalThemeTime: number;
  unfrozenProjectCount: number;
  projects: ProjectType[];
  onPercentageChange: (projectId: string, newPercentage: number) => void;
  onToggleFreeze: (projectId: string) => void;
  onDelete: (targetProjectId?: string) => void;
  onNameChange: (projectId: string, newName: string) => void;
}

const Project: React.FC<ProjectProps> = ({
  project,
  themeColor,
  totalThemeTime,
  unfrozenProjectCount,
  projects,
  onPercentageChange,
  onToggleFreeze,
  onDelete,
  onNameChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(project.percentage.toString());
  const [isTimeInput, setIsTimeInput] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTargetProjectSelect, setShowTargetProjectSelect] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(project.name);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(100, Math.max(0, Number(e.target.value)));
    onPercentageChange(project.id, newValue);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  
  const handleInputBlur = () => {
    let newValue: number;
    if (isTimeInput) {
      // Convert time input to percentage of theme time
      const timeValue = Number(editValue);
      newValue = Math.min(100, Math.max(0, (timeValue / totalThemeTime) * 100));
    } else {
      // Direct percentage input
      newValue = Math.min(100, Math.max(0, Number(editValue)));
    }
    onPercentageChange(project.id, newValue);
    setEditValue(newValue.toString());
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
  };

  const handleNameSave = () => {
    if (nameValue.trim() !== '') {
      onNameChange(project.id, nameValue);
      setEditingName(false);
    }
  };

  const handleNameCancel = () => {
    setNameValue(project.name);
    setEditingName(false);
  };

  const handleDeleteClick = () => {
    // If this is the last project in the theme, just show delete confirmation
    if (projects.length === 1) {
      setShowDeleteConfirm(true);
      return;
    }

    // If this is the last unfrozen project and there are other frozen projects,
    // show target selection
    const otherUnfrozenProjects = projects.filter(p => !p.isFrozen && p.id !== project.id);
    const frozenProjects = projects.filter(p => p.isFrozen);
    
    if (!project.isFrozen && otherUnfrozenProjects.length === 0 && frozenProjects.length > 0) {
      setShowTargetProjectSelect(true);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteConfirm = (targetProjectId?: string) => {
    onDelete(targetProjectId);
    setShowDeleteConfirm(false);
    setShowTargetProjectSelect(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setShowTargetProjectSelect(false);
  };

  // Determine if slider should be disabled
  const isSliderDisabled = project.isFrozen || (!project.isFrozen && unfrozenProjectCount === 1);
  
  return (
    <div 
      className={`pl-5 pr-4 py-4 rounded-xl border transition-all ${
        project.isFrozen ? 'bg-gray-100 border-gray-300' : 'bg-white border-transparent shadow-sm'}`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: themeColor }}></div>
          {editingName ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={nameValue}
                onChange={handleNameChange}
                className="px-2 py-1 border rounded text-sm font-medium bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button 
                onClick={handleNameSave}
                className="p-1 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
              >
                <Check size={14} />
              </button>
              <button 
                onClick={handleNameCancel}
                className="p-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">{project.name}</span>
              <button
                onClick={() => setEditingName(true)}
                className="ml-1.5 p-1 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <Pencil size={14} />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleFreeze(project.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              project.isFrozen 
                ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            aria-label={project.isFrozen ? "Unlock project" : "Lock project"}
          >
            {project.isFrozen ? (
              <LockIcon className="h-4 w-4" />
            ) : (
              <UnlockIcon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1.5 rounded-lg bg-gray-100 text-red-600 hover:bg-red-100"
            aria-label="Delete project"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="mb-3 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800 mb-2 font-bold">Delete this project?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleDeleteCancel}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteConfirm()}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {showTargetProjectSelect && (
        <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2 font-bold">
            This is the last unfrozen project. Select a project to transfer its time allocation:
          </p>
          <div className="space-y-2">
            {projects.filter(p => p.id !== project.id).map(p => (
              <button
                key={p.id}
                onClick={() => handleDeleteConfirm(p.id)}
                className="w-full px-3 py-1.5 text-left rounded-lg hover:bg-yellow-100 text-xs flex items-center font-bold"
              >
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: themeColor }}></div>
                {p.name} ({p.percentage.toFixed(1)}%)
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={handleDeleteCancel}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-center">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={project.percentage}
          onChange={handleSliderChange}
          disabled={isSliderDisabled}
          className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
            isSliderDisabled ? 'bg-gray-200' : 'bg-gray-200'
          }`}
          style={{
            backgroundImage: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${project.percentage}%, #e5e7eb ${project.percentage}%, #e5e7eb 100%)`
          }}
        />
        
        {isEditing ? (
          <div className="ml-4 flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max={isTimeInput ? totalThemeTime : 100}
              value={editValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-24 px-3 py-1.5 border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <span className="text-sm text-gray-500">
              {isTimeInput ? 'h' : '%'}
            </span>
          </div>
        ) : (
          <div className="ml-4 flex items-center space-x-2">
            <button 
              className="text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
              onClick={() => {
                if (!isSliderDisabled) {
                  setIsTimeInput(false);
                  setEditValue(project.percentage.toFixed(1));
                  setIsEditing(true);
                }
              }}
              disabled={isSliderDisabled}
            >
              {project.percentage.toFixed(1)}%
            </button>
            <button 
              className="text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
              onClick={() => {
                if (!isSliderDisabled) {
                  setIsTimeInput(true);
                  setEditValue(project.timeValue.toFixed(1));
                  setIsEditing(true);
                }
              }}
              disabled={isSliderDisabled}
            >
              {formatTime(project.timeValue)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;