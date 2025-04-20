import React from 'react';
import { Plus } from 'lucide-react';
import { Theme as ThemeType } from '../types';
import Theme from './Theme';

interface ThemeListProps {
  themes: ThemeType[];
  totalTime: number;
  onThemePercentageChange: (themeId: string, newPercentage: number) => void;
  onThemeToggleFreeze: (themeId: string) => void;
  onProjectPercentageChange: (themeId: string, projectId: string, newPercentage: number) => void;
  onProjectToggleFreeze: (themeId: string, projectId: string) => void;
  onThemeNameChange: (themeId: string, newName: string) => void;
  onProjectNameChange: (themeId: string, projectId: string, newName: string) => void;
  onThemeAdd: () => void;
  onThemeDelete: (themeId: string, targetThemeId?: string) => void;
  onProjectAdd: (themeId: string) => void;
  onProjectDelete: (themeId: string, projectId: string) => void;
}

const ThemeList: React.FC<ThemeListProps> = ({
  themes,
  totalTime,
  onThemePercentageChange,
  onThemeToggleFreeze,
  onProjectPercentageChange,
  onProjectToggleFreeze,
  onThemeNameChange,
  onProjectNameChange,
  onThemeAdd,
  onThemeDelete,
  onProjectAdd,
  onProjectDelete
}) => {
  // Calculate number of unfrozen themes
  const unfrozenThemeCount = themes.filter(t => !t.isFrozen).length;

  return (
    <div>
      <div className="space-y-6">
        {themes.map((theme) => (
          <Theme
            key={theme.id}
            theme={theme}
            themes={themes}
            totalTime={totalTime}
            unfrozenThemeCount={unfrozenThemeCount}
            onThemePercentageChange={onThemePercentageChange}
            onThemeToggleFreeze={onThemeToggleFreeze}
            onProjectPercentageChange={onProjectPercentageChange}
            onProjectToggleFreeze={onProjectToggleFreeze}
            onThemeNameChange={onThemeNameChange}
            onProjectNameChange={onProjectNameChange}
            onThemeDelete={onThemeDelete}
            onProjectAdd={onProjectAdd}
            onProjectDelete={onProjectDelete}
          />
        ))}
      </div>

      <button
        onClick={onThemeAdd}
        className="w-full mt-6 flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors font-bold"
      >
        <Plus size={20} className="mr-2" />
        Add Theme
      </button>
    </div>
  );
};

export default ThemeList;