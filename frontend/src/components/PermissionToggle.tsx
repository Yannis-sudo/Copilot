import React from "react";
import useTheme from "../hooks/useTheme";

interface PermissionToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function PermissionToggle({
  label,
  checked,
  onChange,
  disabled = false
}: PermissionToggleProps): React.ReactElement {
  const theme = useTheme();

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span 
        className="text-sm font-medium"
        style={{ 
          color: disabled ? theme.colors.textTertiary : theme.colors.textSecondary 
        }}
      >
        {label}
      </span>
      
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: checked ? theme.colors.primary : theme.colors.muted,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.boxShadow = `0 0 0 2px ${theme.colors.primary}`;
          }
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'none';
        }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          style={{
            transform: checked ? 'translateX(1.25rem)' : 'translateX(0.125rem)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
          }}
        />
      </button>
    </div>
  );
}
