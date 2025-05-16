
/**
 * Design System Tokens
 * 
 * This file provides programmatic access to our design tokens
 * for use in TypeScript/JavaScript files.
 */

export const colors = {
  // Base colors
  background: 'var(--color-background)',
  foreground: 'var(--color-foreground)',
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  muted: 'var(--color-muted)',
  border: 'var(--color-border)',
  
  // Status colors
  error: 'var(--color-error)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)',
  
  // Chat app specific
  chatBackground: 'var(--chatapp-background)',
  chatText: 'var(--chatapp-text)',
  chatSecondaryText: 'var(--chatapp-secondaryText)',
  userBubble: 'var(--chatapp-userBubble)',
  aiBubble: 'var(--chatapp-aiBubble)',
  codeBlock: 'var(--chatapp-codeBlock)',
  codeText: 'var(--chatapp-codeText)',
  inputBg: 'var(--chatapp-inputBg)',
  inputBorder: 'var(--chatapp-inputBorder)',
  placeholder: 'var(--chatapp-placeholder)',
};

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    md: 'var(--font-size-md)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
  },
  fontWeight: {
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
  },
};

export const spacing = {
  '1': 'var(--space-1)',
  '2': 'var(--space-2)',
  '3': 'var(--space-3)',
  '4': 'var(--space-4)',
  '5': 'var(--space-5)',
  '6': 'var(--space-6)',
  '8': 'var(--space-8)',
  '10': 'var(--space-10)',
  '12': 'var(--space-12)',
  '16': 'var(--space-16)',
  '20': 'var(--space-20)',
};

export const borderRadius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: 'var(--radius-full)',
};

export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
};

export const transitions = {
  fast: 'var(--transition-fast)',
  normal: 'var(--transition-normal)',
  slow: 'var(--transition-slow)',
};

export const zIndices = {
  base: 'var(--z-base)',
  menu: 'var(--z-menu)',
  modal: 'var(--z-modal)',
  toast: 'var(--z-toast)',
};

// Design system object with all tokens
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndices,
};

export default designTokens;
