export const theme = {
  dark: {
    colors: {
      background: '#0B1220', // tiefes modernes Blau-Schwarz
      surface: '#111827',

      primary: '#3B82F6',       // modernes UI-Blau
      primaryLight: '#60A5FA',
      primaryDarker: '#2563EB',

      secondary: '#1F2937',
      muted: '#374151',

      textPrimary: '#F9FAFB',
      textSecondary: '#9CA3AF',
      textTertiary: '#6B7280',
      textDark: '#4B5563',

      border: 'rgba(59,130,246,0.20)',
      shadow: 'rgba(0,0,0,0.45)',

      alpha08: 'rgba(59,130,246,0.08)',
      alpha12: 'rgba(59,130,246,0.12)',
      alpha18: 'rgba(59,130,246,0.18)',
      alpha25: 'rgba(59,130,246,0.25)',
    },

    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.25rem',
      '3xl': '1.75rem',
    },

    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.25)',
      md: '0 6px 12px rgba(0,0,0,0.35)',
      lg: '0 12px 24px rgba(0,0,0,0.45)',
      xl: '0 20px 40px rgba(0,0,0,0.55)',

      // moderner subtiler Glow
      glow: '0 0 0 1px rgba(59,130,246,0.15), 0 8px 24px rgba(59,130,246,0.18)',
    }
  },

  light: {
    colors: {
      background: '#FFFFFF',
      surface: '#F9FAFB',

      primary: '#2563EB',
      primaryLight: '#60A5FA',
      primaryDarker: '#1D4ED8',

      secondary: '#F3F4F6',
      muted: '#E5E7EB',

      textPrimary: '#0F172A',
      textSecondary: '#6B7280',
      textTertiary: '#9CA3AF',
      textDark: '#374151',

      border: 'rgba(37,99,235,0.25)',
      shadow: 'rgba(0,0,0,0.08)',

      alpha08: 'rgba(37,99,235,0.08)',
      alpha12: 'rgba(37,99,235,0.12)',
      alpha18: 'rgba(37,99,235,0.18)',
      alpha25: 'rgba(37,99,235,0.25)',
    },

    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.25rem',
      '3xl': '1.75rem',
    },

    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.04)',
      md: '0 4px 8px rgba(0,0,0,0.06)',
      lg: '0 8px 16px rgba(0,0,0,0.08)',
      xl: '0 16px 32px rgba(0,0,0,0.10)',

      glow: '0 0 0 1px rgba(37,99,235,0.10), 0 6px 20px rgba(37,99,235,0.12)',
    }
  }
};