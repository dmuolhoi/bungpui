
# Bungpui Design System

This document outlines the design system used in the Bungpui AI application.

## Color System

### Base Colors
- Background: Dark mode `#000000`, Light mode `#F5F5F5`
- Foreground: Dark mode `#FFFFFF`, Light mode `#333333`
- Primary: Dark mode `#9b87f5`, Light mode `#7E69AB`
- Primary Hover: Dark mode `#7E69AB`, Light mode `#6E59A5`
- Secondary: Dark mode `#1A1A1A`, Light mode `#FFFFFF`
- Accent: Dark mode `#00FF00`, Light mode `#008000`
- Muted: Dark mode `#666666`, Light mode `#666666`
- Border: Dark mode `#333333`, Light mode `#DDDDDD`

### Status Colors
- Error: Dark mode `#ea384c`, Light mode `#DC2626`
- Success: Dark mode `#10B981`, Light mode `#059669`
- Warning: Dark mode `#F59E0B`, Light mode `#D97706`
- Info: Dark mode `#0EA5E9`, Light mode `#0284C7`

### Chat App Specific
- User Bubble: Dark mode `#1A1A1A`, Light mode `#E1EFFF`
- AI Bubble: Dark mode `#111111`, Light mode `#F0F0F0`
- Code Block: Dark mode `#222222`, Light mode `#F8F8F8`
- Code Text: Dark mode `#00FF00`, Light mode `#008000`

## Typography

### Font Families
- Sans-serif: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- Monospace: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- md: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### Font Weights
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing System

Our spacing system uses a consistent scale:
- space-1: 0.25rem (4px)
- space-2: 0.5rem (8px)
- space-3: 0.75rem (12px)
- space-4: 1rem (16px)
- space-5: 1.25rem (20px)
- space-6: 1.5rem (24px)
- space-8: 2rem (32px)
- space-10: 2.5rem (40px)
- space-12: 3rem (48px)
- space-16: 4rem (64px)
- space-20: 5rem (80px)

## Border Radius
- Small: 0.25rem (4px)
- Medium: 0.5rem (8px)
- Large: 0.75rem (12px)
- Full: 9999px (circular)

## Shadows
- Small: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- Medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- Large: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)

## Transitions
- Fast: 0.15s ease
- Normal: 0.25s ease
- Slow: 0.4s ease

## Z-index Layers
- Base: 1
- Menu: 10
- Modal: 50
- Toast: 100

## Component Examples

### Buttons
- Primary: Background color is primary, text is white
- Secondary: Background is secondary, border is border color
- Hover states use primary-hover color

### Cards
- Background uses AI bubble color
- Border uses input border color
- Box shadow uses small shadow

### Inputs
- Background uses input background color
- Border uses input border color
- Focus state uses primary color

## Usage in Code

### CSS Variables
```css
.my-element {
  color: var(--chatapp-text);
  background-color: var(--chatapp-background);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
```

### Tailwind Classes
```jsx
<div className="text-chatapp-text bg-chatapp-background p-4 rounded-md">
  Content here
</div>
```

### JavaScript/TypeScript
```tsx
import { colors, spacing } from './design-tokens';

const MyComponent = () => (
  <div style={{ 
    color: colors.chatText,
    padding: spacing[4]
  }}>
    Content here
  </div>
);
```

## Theme Switching

The application supports both light and dark modes. The theme is toggled by adding or removing the `.light-mode` class on the document root.
