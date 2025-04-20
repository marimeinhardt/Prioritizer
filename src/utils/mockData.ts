import { AppState, Theme } from '../types';

export const generateInitialData = (): AppState => {
  // Initial themes with projects
  const workTheme: Theme = {
    id: 'theme-1',
    name: 'Work',
    percentage: 40,
    timeValue: 0, // Will be calculated
    isFrozen: false,
    color: '#6A80B9', // Indigo
    projects: [
      {
        id: 'project-1-1',
        name: 'Project Alpha',
        percentage: 40,
        timeValue: 0,
        isFrozen: false
      },
      {
        id: 'project-1-2',
        name: 'Project Beta',
        percentage: 30,
        timeValue: 0,
        isFrozen: false
      },
      {
        id: 'project-1-3',
        name: 'Admin Tasks',
        percentage: 30,
        timeValue: 0,
        isFrozen: false
      }
    ]
  };

  const personalTheme: Theme = {
    id: 'theme-2',
    name: 'Personal',
    percentage: 30,
    timeValue: 0,
    isFrozen: false,
    color: '#638C6D', // Sky blue
    projects: [
      {
        id: 'project-2-1',
        name: 'Exercise',
        percentage: 40,
        timeValue: 0,
        isFrozen: false
      },
      {
        id: 'project-2-2',
        name: 'Reading',
        percentage: 30,
        timeValue: 0,
        isFrozen: false
      },
      {
        id: 'project-2-3',
        name: 'Family Time',
        percentage: 30,
        timeValue: 0,
        isFrozen: false
      }
    ]
  };

  const learningTheme: Theme = {
    id: 'theme-3',
    name: 'Learning',
    percentage: 30,
    timeValue: 0,
    isFrozen: false,
    color: '#FFAD60', // Emerald
    projects: [
      {
        id: 'project-3-1',
        name: 'Online Course',
        percentage: 50,
        timeValue: 0,
        isFrozen: false
      },
      {
        id: 'project-3-2',
        name: 'Books & Articles',
        percentage: 30,
        timeValue: 0,
        isFrozen: false
      },
      {
        id: 'project-3-3',
        name: 'Practice',
        percentage: 20,
        timeValue: 0,
        isFrozen: false
      }
    ]
  };

  return {
    totalTime: 40,
    themes: [workTheme, personalTheme, learningTheme]
  };
};