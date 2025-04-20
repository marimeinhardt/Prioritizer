import React, { useState } from 'react';
import { PlusCircle, Lock, Unlock, Pencil, Check, X, Plus } from 'lucide-react';
import { Theme as ThemeType, Project as ProjectType } from '../types';
import Project from './Project';
import { formatTime } from '../utils/timeCalculations';

interface ThemeProps {
  theme: ThemeType;
  totalTime: number;
  unfrozenThemeCount: number;
  themes: ThemeType[];
  onThemePercentageChange: (themeId: string, newPercentage: number) => void;
  onThemeToggleFreeze: (themeId: string) => void;
  onProjectPercentageChange: (themeId: string, projectId: string, newPercentage: number) => void;
  onProjectToggleFreeze: (themeId: string, projectId: string) => void;
  onThemeNameChange: (themeId: string, newName: string) => void;
  onProjectNameChange: (themeId: string, projectId: string, newName: string) => void;
  onThemeDelete: (themeId: string, targetThemeId?: string) => void;
  onProjectAdd: (themeId: string) => void;
  onProjectDelete: (themeId: string, projectId: string, targetProjectId?: string) => void;
}

const Theme: React.FC<ThemeProps> = ({
  theme,
  totalTime,
  unfrozenThemeCount,
  themes,
  onThemePercentageChange,
  onThemeToggleFreeze,
  onProjectPercentageChange,
  onProjectToggleFreeze,
  onThemeNameChange,
  onProjectNameChange,
  onThemeDelete,
  onProjectAdd,
  onProjectDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(theme.percentage.toString());
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(theme.name);
  const [isTimeInput, setIsTimeInput] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTargetThemeSelect, setShowTargetThemeSelect] = useState(false);

  // Calculate number of unfrozen projects
  const unfrozenProjectCount = theme.projects.filter(p => !p.isFrozen).length;
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(100, Math.max(0, Number(e.target.value)));
    onThemePercentageChange(theme.id, newValue);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  
  const handleInputBlur = () => {
    let newValue: number;
    if (isTimeInput) {
      const timeValue = Number(editValue);
      newValue = Math.min(100, Math.max(0, (timeValue / totalTime) * 100));
    } else {
      newValue = Math.min(100, Math.max(0, Number(editValue)));
    }
    onThemePercentageChange(theme.id, newValue);
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
      onThemeNameChange(theme.id, nameValue);
      setEditingName(false);
    }
  };

  const handleNameCancel = () => {
    setNameValue(theme.name);
    setEditingName(false);
  };

  const handleDeleteClick = () => {
    // If this is the last theme, just show delete confirmation
    if (themes.length === 1) {
      setShowDeleteConfirm(true);
      return;
    }

    // If this is the last unfrozen theme and there are other frozen themes,
    // show target selection
    const otherUnfrozenThemes = themes.filter(t => !t.isFrozen && t.id !== theme.id);
    const frozenThemes = themes.filter(t => t.isFrozen);
    
    if (!theme.isFrozen && otherUnfrozenThemes.length === 0 && frozenThemes.length > 0) {
      setShowTargetThemeSelect(true);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteConfirm = (targetThemeId?: string) => {
    onThemeDelete(theme.id, targetThemeId);
    setShowDeleteConfirm(false);
    setShowTargetThemeSelect(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setShowTargetThemeSelect(false);
  };

  // Determine if slider should be disabled
  const isSliderDisabled = theme.isFrozen || (!theme.isFrozen && unfrozenThemeCount === 1);
  
  return (
    <div className={`rounded-2xl shadow-sm mb-6 overflow-hidden transition-all border ${
      theme.isFrozen ? 'bg-gray-100 border-gray-300' : 'bg-white border-transparent'
    }`}>
      <div 
        className={`p-6 flex justify-between items-center ${
          theme.isFrozen ? 'bg-gray-200' : ''
        }`}
        style={{ backgroundColor: theme.isFrozen ? undefined : theme.color }}
      >
        {editingName ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={nameValue}
              onChange={handleNameChange}
              className="px-3 py-2 border rounded-lg text-lg font-bold bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button 
              onClick={handleNameSave}
              className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
            >
              <Check size={18} />
            </button>
            <button 
              onClick={handleNameCancel}
              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <h3 
              className={`text-lg font-bold ${theme.isFrozen ? 'text-gray-700' : 'text-white'}`}
            >
              {theme.name}
            </h3>
            <button
              onClick={() => setEditingName(true)}
              className={`ml-2 p-1.5 rounded-lg ${
                theme.isFrozen 
                  ? 'text-gray-500 hover:bg-gray-300' 
                  : 'text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              <Pencil size={16} />
            </button>
            <span 
              className={`ml-3 text-sm font-bold px-3 py-1 rounded-full ${
                theme.isFrozen 
                  ? 'bg-white/80 text-gray-700' 
                  : 'bg-white/20 text-white'
              }`}
            >
              {formatTime(theme.timeValue)}
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onProjectAdd(theme.id)}
            className={`p-2 rounded-lg ${
              theme.isFrozen 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-300' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            aria-label="Add project"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => onThemeToggleFreeze(theme.id)}
            className={`p-2 rounded-lg transition-colors ${
              theme.isFrozen 
                ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            aria-label={theme.isFrozen ? "Unlock theme" : "Lock theme"}
          >
            {theme.isFrozen ? <Lock size={18} /> : <Unlock size={18} />}
          </button>
          <button
            onClick={handleDeleteClick}
            className={`p-2 rounded-lg ${
              theme.isFrozen 
                ? 'bg-gray-100 text-red-600 hover:bg-red-100' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            aria-label="Delete theme"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {showDeleteConfirm && (
        <div className="px-6 py-4 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-800 mb-3 font-bold">
            Are you sure you want to delete this theme and all its projects?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteConfirm()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {showTargetThemeSelect && (
        <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100">
          <p className="text-sm text-yellow-800 mb-3 font-bold">
            This is the last unfrozen theme. Select a theme to transfer its time allocation:
          </p>
          <div className="space-y-2 mb-3">
            {themes.filter(t => t.id !== theme.id).map(t => (
              <button
                key={t.id}
                onClick={() => handleDeleteConfirm(t.id)}
                className="w-full px-4 py-2 text-left rounded-lg hover:bg-yellow-100 text-sm flex items-center font-bold"
                style={{ color: t.color }}
              >
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: t.color }}></div>
                {t.name} ({t.percentage.toFixed(1)}%)
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center mb-6">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={theme.percentage}
            onChange={handleSliderChange}
            disabled={isSliderDisabled}
            className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
              isSliderDisabled ? 'bg-gray-200' : 'bg-gray-200'
            }`}
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.isFrozen ? '#64748B' : theme.color} 0%, ${theme.isFrozen ? '#64748B' : theme.color} ${theme.percentage}%, #e5e7eb ${theme.percentage}%, #e5e7eb 100%)`
            }}
          />
          
          {isEditing ? (
            <div className="ml-4 flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max={isTimeInput ? totalTime : 100}
                value={editValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="w-24 px-3 py-1.5 border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                autoFocus
              />
              <span className="text-sm text-gray-500 font-bold">
                {isTimeInput ? 'h' : '%'}
              </span>
            </div>
          ) : (
            <div className="ml-4 flex items-center space-x-2">
              <button 
                className="text-sm font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                onClick={() => {
                  if (!isSliderDisabled) {
                    setIsTimeInput(false);
                    setEditValue(theme.percentage.toFixed(1));
                    setIsEditing(true);
                  }
                }}
                disabled={isSliderDisabled}
              >
                {theme.percentage.toFixed(1)}%
              </button>
              <button 
                className="text-sm font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                onClick={() => {
                  if (!isSliderDisabled) {
                    setIsTimeInput(true);
                    setEditValue(theme.timeValue.toFixed(1));
                    setIsEditing(true);
                  }
                }}
                disabled={isSliderDisabled}
              >
                {formatTime(theme.timeValue)}
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {theme.projects.map((project) => (
            <Project
              key={project.id}
              project={project}
              themeColor={theme.isFrozen ? '#64748B' : theme.color}
              totalThemeTime={theme.timeValue}
              unfrozenProjectCount={unfrozenProjectCount}
              projects={theme.projects}
              onPercentageChange={(projectId, newPercentage) => 
                onProjectPercentageChange(theme.id, projectId, newPercentage)
              }
              onToggleFreeze={(projectId) => 
                onProjectToggleFreeze(theme.id, projectId)
              }
              onDelete={(targetProjectId) => onProjectDelete(theme.id, project.id, targetProjectId)}
              onNameChange={(projectId, newName) => 
                onProjectNameChange(theme.id, projectId, newName)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Theme;