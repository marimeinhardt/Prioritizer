import { Theme, Project } from '../types';

/**
 * Converts a time value to a percentage based on total time
 */
export const timeToPercentage = (timeValue: number, totalTime: number): number => {
  return (timeValue / totalTime) * 100;
};

/**
 * Converts a percentage to a time value based on total time
 */
export const percentageToTime = (percentage: number, totalTime: number): number => {
  return (percentage / 100) * totalTime;
};

/**
 * Calculates the total available percentage considering frozen themes
 */
export const calculateAvailablePercentage = (themes: Theme[]): number => {
  const frozenPercentage = themes
    .filter(theme => theme.isFrozen)
    .reduce((sum, theme) => sum + theme.percentage, 0);
  
  return Math.max(0, 100 - frozenPercentage);
};

/**
 * Adjusts the percentage of unfrozen themes proportionally
 */
export const adjustThemePercentages = (
  themes: Theme[],
  updatedThemeId: string,
  newPercentage: number
): Theme[] => {
  const oldTheme = themes.find((theme) => theme.id === updatedThemeId);
  if (!oldTheme) return themes;

  const frozenThemes = themes.filter(
    (theme) => theme.isFrozen && theme.id !== updatedThemeId
  );
  
  const frozenPercentage = frozenThemes.reduce(
    (sum, theme) => sum + theme.percentage,
    0
  );

  const maxAvailablePercentage = 100 - frozenPercentage;
  const clampedNewPercentage = Math.min(newPercentage, maxAvailablePercentage);
  const availablePercentage = maxAvailablePercentage - clampedNewPercentage;

  const unfrozenThemes = themes.filter(
    (theme) => !theme.isFrozen && theme.id !== updatedThemeId
  );

  const totalUnfrozenPercentage = unfrozenThemes.reduce(
    (sum, theme) => sum + theme.percentage,
    0
  );

  return themes.map((theme) => {
    if (theme.id === updatedThemeId) {
      return { ...theme, percentage: clampedNewPercentage };
    } else if (theme.isFrozen) {
      return theme;
    } else {
      const proportion = totalUnfrozenPercentage > 0 
        ? theme.percentage / totalUnfrozenPercentage 
        : 1 / unfrozenThemes.length;
      
      return { 
        ...theme, 
        percentage: Math.max(0, availablePercentage * proportion)
      };
    }
  });
};

/**
 * Adjusts the percentage of unfrozen projects proportionally
 */
export const adjustProjectPercentages = (
  projects: Project[],
  updatedProjectId: string,
  newPercentage: number
): Project[] => {
  const oldProject = projects.find((project) => project.id === updatedProjectId);
  if (!oldProject) return projects;

  const frozenProjects = projects.filter(
    (project) => project.isFrozen && project.id !== updatedProjectId
  );
  
  const frozenPercentage = frozenProjects.reduce(
    (sum, project) => sum + project.percentage,
    0
  );

  const maxAvailablePercentage = 100 - frozenPercentage;
  const clampedNewPercentage = Math.min(newPercentage, maxAvailablePercentage);
  const availablePercentage = maxAvailablePercentage - clampedNewPercentage;

  const unfrozenProjects = projects.filter(
    (project) => !project.isFrozen && project.id !== updatedProjectId
  );

  const totalUnfrozenPercentage = unfrozenProjects.reduce(
    (sum, project) => sum + project.percentage,
    0
  );

  return projects.map((project) => {
    if (project.id === updatedProjectId) {
      return { ...project, percentage: clampedNewPercentage };
    } else if (project.isFrozen) {
      return project;
    } else {
      const proportion = totalUnfrozenPercentage > 0 
        ? project.percentage / totalUnfrozenPercentage 
        : 1 / unfrozenProjects.length;
      
      return { 
        ...project, 
        percentage: Math.max(0, availablePercentage * proportion)
      };
    }
  });
};

/**
 * Updates time values for themes and their projects based on percentages
 */
export const updateTimeValues = (themes: Theme[], totalTime: number): Theme[] => {
  return themes.map((theme) => {
    const themeTimeValue = (theme.percentage / 100) * totalTime;
    
    const updatedProjects = theme.projects.map((project) => ({
      ...project,
      timeValue: (project.percentage / 100) * themeTimeValue
    }));
    
    return {
      ...theme,
      timeValue: themeTimeValue,
      projects: updatedProjects,
    };
  });
};

/**
 * Formats time values for display
 */
export const formatTime = (timeValue: number): string => {
  const hours = Math.floor(timeValue);
  const minutes = Math.round((timeValue - hours) * 60);
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};