import { useSettings } from '../context/SettingsContext';
import { theme } from '../constants/theme';

/**
 * Custom hook to access theme colors based on current dark mode setting
 * Returns the appropriate theme colors object for dark/light mode
 */
export const useTheme = () => {
  const { settings } = useSettings();
  const { darkMode } = settings;
  
  return theme[darkMode ? 'dark' : 'light'];
};

export default useTheme;
