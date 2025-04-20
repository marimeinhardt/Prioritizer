import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TimeInput from './components/TimeInput';
import ThemeList from './components/ThemeList';
import Chart from './components/Chart';
import { generateInitialData } from './utils/mockData';
import { 
  adjustThemePercentages, 
  adjustProjectPercentages, 
  updateTimeValues,
  generateId,
  calculateAvailablePercentage,
  percentageToTime 
} from './utils/timeCalculations';
import { AppState, Theme, Project } from './types';

const themeColors = [
  '#6A80B9', // Indigo
  '#638C6D', // Sky blue
  '#FFAD60', // Emerald
  '#96CEB4', // Amber
  '#00879E', // Pink
  '#FFAB5B', // Purple
  '#fb8290', // New color
];

const STORAGE_KEY = 'timePriorityAppState';

function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : generateInitialData();
  });
  
  useEffect(() => {
    const updatedThemes = updateTimeValues(appState.themes, appState.totalTime);
    setAppState(prevState => ({
      ...prevState,
      themes: updatedThemes
    }));
  }, [appState.totalTime, appState.themes.map(t => t.percentage).join(',')]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  // Save state when the user closes the tab or refreshes
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [appState]);
  
  const handleTotalTimeChange = (newTime: number) => {
    setAppState(prevState => ({
      ...prevState,
      totalTime: newTime
    }));
  };
  
  const handleThemePercentageChange = (themeId: string, newPercentage: number) => {
    const adjustedThemes = adjustThemePercentages(
      appState.themes,
      themeId,
      newPercentage
    );
    
    setAppState(prevState => ({
      ...prevState,
      themes: adjustedThemes
    }));
  };
  
  const handleThemeToggleFreeze = (themeId: string) => {
    setAppState(prevState => ({
      ...prevState,
      themes: prevState.themes.map(theme => 
        theme.id === themeId 
          ? { ...theme, isFrozen: !theme.isFrozen } 
          : theme
      )
    }));
  };

  const handleThemeNameChange = (themeId: string, newName: string) => {
    setAppState(prevState => ({
      ...prevState,
      themes: prevState.themes.map(theme => 
        theme.id === themeId 
          ? { ...theme, name: newName } 
          : theme
      )
    }));
  };

  const handleProjectNameChange = (themeId: string, projectId: string, newName: string) => {
    setAppState(prevState => ({
      ...prevState,
      themes: prevState.themes.map(theme => 
        theme.id === themeId 
          ? {
              ...theme,
              projects: theme.projects.map(project =>
                project.id === projectId
                  ? { ...project, name: newName }
                  : project
              )
            }
          : theme
      )
    }));
  };
  
  const handleProjectPercentageChange = (
    themeId: string,
    projectId: string,
    newPercentage: number
  ) => {
    setAppState(prevState => {
      const theme = prevState.themes.find(t => t.id === themeId);
      if (!theme) return prevState;
      
      const adjustedProjects = adjustProjectPercentages(
        theme.projects,
        projectId,
        newPercentage
      );

      // Calculate new time values for projects based on theme's time
      const themeTime = (theme.percentage / 100) * prevState.totalTime;
      const projectsWithTime = adjustedProjects.map(project => ({
        ...project,
        timeValue: (project.percentage / 100) * themeTime
      }));
      
      return {
        ...prevState,
        themes: prevState.themes.map(theme => 
          theme.id === themeId 
            ? { ...theme, projects: projectsWithTime }
            : theme
        )
      };
    });
  };
  
  const handleProjectToggleFreeze = (themeId: string, projectId: string) => {
    setAppState(prevState => ({
      ...prevState,
      themes: prevState.themes.map(theme => 
        theme.id === themeId 
          ? {
              ...theme,
              projects: theme.projects.map(project => 
                project.id === projectId 
                  ? { ...project, isFrozen: !project.isFrozen } 
                  : project
              )
            } 
          : theme
      )
    }));
  };

  const handleThemeAdd = () => {
    const newTheme: Theme = {
      id: `theme-${generateId()}`,
      name: 'New Theme',
      percentage: 0,
      timeValue: 0, // Will be calculated
      isFrozen: false,
      color: themeColors[appState.themes.length % themeColors.length],
      projects: []
    };

    setAppState(prevState => {
      // If there are no themes, give 100% to the new theme
      if (prevState.themes.length === 0) {
        return {
          ...prevState,
          themes: [{ ...newTheme, percentage: 100, timeValue: prevState.totalTime }]
        };
      }

      const availablePercentage = calculateAvailablePercentage(prevState.themes);
      
      // If no available percentage, add theme with 0%
      if (availablePercentage <= 1) {
        return {
          ...prevState,
          themes: [...prevState.themes, { ...newTheme, percentage: 0, timeValue: 0 }]
        };
      }

      const unfrozenThemes = prevState.themes.filter(t => !t.isFrozen);
      
      // Calculate how much to reduce each unfrozen theme
      const reductionPerTheme = unfrozenThemes.length > 0
        ? 1 / unfrozenThemes.length
        : 0;

      // Adjust existing themes and add new theme with 1%
      const newPercentage = 1;
      const newTimeValue = percentageToTime(newPercentage, prevState.totalTime);

      return {
        ...prevState,
        themes: [
          ...prevState.themes.map(theme => 
            theme.isFrozen 
              ? theme 
              : { 
                  ...theme, 
                  percentage: theme.percentage - reductionPerTheme,
                  timeValue: percentageToTime(theme.percentage - reductionPerTheme, prevState.totalTime)
                }
          ),
          { ...newTheme, percentage: newPercentage, timeValue: newTimeValue }
        ]
      };
    });
  };

  const handleThemeDelete = (themeId: string, targetThemeId?: string) => {
    setAppState(prevState => {
      const themeToDelete = prevState.themes.find(t => t.id === themeId);
      if (!themeToDelete) return prevState;

      const remainingThemes = prevState.themes.filter(t => t.id !== themeId);
      
      // If this is the last unfrozen theme and a target theme is specified
      if (!themeToDelete.isFrozen && targetThemeId) {
        return {
          ...prevState,
          themes: remainingThemes.map(theme => 
            theme.id === targetThemeId
              ? { 
                  ...theme, 
                  percentage: theme.percentage + themeToDelete.percentage,
                  timeValue: percentageToTime(theme.percentage + themeToDelete.percentage, prevState.totalTime)
                }
              : theme
          )
        };
      }

      // Otherwise, distribute percentage among unfrozen themes
      const unfrozenThemes = remainingThemes.filter(t => !t.isFrozen);
      const frozenPercentage = remainingThemes
        .filter(t => t.isFrozen)
        .reduce((sum, t) => sum + t.percentage, 0);
      const availablePercentage = 100 - frozenPercentage;
      const percentagePerTheme = unfrozenThemes.length > 0 
        ? availablePercentage / unfrozenThemes.length 
        : 0;

      return {
        ...prevState,
        themes: remainingThemes.map(theme => 
          theme.isFrozen 
            ? theme 
            : { 
                ...theme, 
                percentage: percentagePerTheme,
                timeValue: percentageToTime(percentagePerTheme, prevState.totalTime)
              }
        )
      };
    });
  };

  const handleProjectAdd = (themeId: string) => {
    setAppState(prevState => {
      const theme = prevState.themes.find(t => t.id === themeId);
      if (!theme) return prevState;

      const themeTime = (theme.percentage / 100) * prevState.totalTime;

      const newProject: Project = {
        id: `project-${generateId()}`,
        name: 'New Project',
        percentage: theme.projects.length === 0 ? 100 : 0,
        timeValue: theme.projects.length === 0 ? themeTime : 0,
        isFrozen: false
      };

      if (theme.projects.length === 0) {
        return {
          ...prevState,
          themes: prevState.themes.map(t => 
            t.id === themeId 
              ? { ...t, projects: [newProject] }
              : t
          )
        };
      }

      const unfrozenProjects = theme.projects.filter(p => !p.isFrozen);
      const percentagePerProject = unfrozenProjects.length > 0 
        ? 100 / (unfrozenProjects.length + 1) 
        : 0;

      const updatedProjects = [
        ...theme.projects.map(project => {
          const newPercentage = project.isFrozen 
            ? project.percentage 
            : percentagePerProject;
          return {
            ...project,
            percentage: newPercentage,
            timeValue: (newPercentage / 100) * themeTime
          };
        }),
        { 
          ...newProject, 
          percentage: percentagePerProject,
          timeValue: (percentagePerProject / 100) * themeTime
        }
      ];

      return {
        ...prevState,
        themes: prevState.themes.map(t => 
          t.id === themeId 
            ? { ...t, projects: updatedProjects }
            : t
        )
      };
    });
  };

  const handleProjectDelete = (themeId: string, projectId: string, targetProjectId?: string) => {
    setAppState(prevState => {
      const theme = prevState.themes.find(t => t.id === themeId);
      if (!theme) return prevState;

      const projectToDelete = theme.projects.find(p => p.id === projectId);
      if (!projectToDelete) return prevState;

      const remainingProjects = theme.projects.filter(p => p.id !== projectId);
      const themeTime = (theme.percentage / 100) * prevState.totalTime;

      // If this is the last unfrozen project and a target project is specified
      if (!projectToDelete.isFrozen && targetProjectId) {
        return {
          ...prevState,
          themes: prevState.themes.map(t => 
            t.id === themeId 
              ? {
                  ...t,
                  projects: remainingProjects.map(project => {
                    if (project.id === targetProjectId) {
                      const newPercentage = project.percentage + projectToDelete.percentage;
                      return { 
                        ...project, 
                        percentage: newPercentage,
                        timeValue: (newPercentage / 100) * themeTime
                      };
                    }
                    return project;
                  })
                }
              : t
          )
        };
      }

      // Otherwise, distribute percentage among unfrozen projects
      const unfrozenProjects = remainingProjects.filter(p => !p.isFrozen);
      const percentagePerProject = unfrozenProjects.length > 0 
        ? 100 / unfrozenProjects.length 
        : 0;

      const updatedProjects = remainingProjects.map(project => {
        const newPercentage = project.isFrozen 
          ? project.percentage 
          : percentagePerProject;
        return {
          ...project,
          percentage: newPercentage,
          timeValue: (newPercentage / 100) * themeTime
        };
      });

      return {
        ...prevState,
        themes: prevState.themes.map(t => 
          t.id === themeId 
            ? { ...t, projects: updatedProjects }
            : t
        )
      };
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Chart 
              themes={appState.themes} 
              totalTime={appState.totalTime} 
            />
          </div>
          
          <div className="md:col-span-8">
            <TimeInput 
              totalTime={appState.totalTime} 
              onTotalTimeChange={handleTotalTimeChange} 
            />
            
            <ThemeList 
              themes={appState.themes}
              totalTime={appState.totalTime}
              onThemePercentageChange={handleThemePercentageChange}
              onThemeToggleFreeze={handleThemeToggleFreeze}
              onProjectPercentageChange={handleProjectPercentageChange}
              onProjectToggleFreeze={handleProjectToggleFreeze}
              onThemeNameChange={handleThemeNameChange}
              onProjectNameChange={handleProjectNameChange}
              onThemeAdd={handleThemeAdd}
              onThemeDelete={handleThemeDelete}
              onProjectAdd={handleProjectAdd}
              onProjectDelete={handleProjectDelete}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;