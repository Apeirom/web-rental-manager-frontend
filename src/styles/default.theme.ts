export const defaultTheme = {
    colors: {
        // Brand Blue (Tons de Azul)
        blue1: '#f0f8ff',
        blue2: '#e0f0fe',
        blue3: '#bae0fd',
        blue4: '#7dc8fc',
        blue5: '#36aef8',
        blue6: '#0e90e2', // Cor Principal (Primary)
        blue7: '#0272bc',
        blue8: '#0360a1',
        blue9: '#065186',

        // Neutros (Tons de Cinza para fundos, bordas e textos)
        slate1: '#f8f9fa', // Background principal do App
        slate2: '#f1f3f5', // Background de cards
        slate3: '#e9ecef',
        slate4: '#dee2e6', // Bordas sutis
        slate5: '#ced4da',
        slate6: '#adb5bd', // Ícones inativos
        slate7: '#868e96',
        slate8: '#495057', // Textos secundários
        slate9: '#343a40', // Textos principais
        slate10: '#212529', // Títulos

        white: '#FFFFFF',
        danger: '#fa5252',
        success: '#40c057',

        onSurface: {
            lowEmphasis: '#868e96',
            mediumEmphasis: '#495057',
            highEmphasis: '#212529'
        }
    },
    space: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256],
    radii: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        round: '50%'
    },
    fontSizes: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '24px',
        xxl: '32px'
    },
    fonts: {
        untitled:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        mono: 'Söhne Mono, menlo, monospace'
    },
    fontWeights: {
        regular: 400,
        medium: 500,
        bold: 700
    },
    lineHeights: {
        tight: 1.2,
        base: 1.5,
        loose: 1.75
    },
    shadows: {
        sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        md: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
        lg: '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)'
    },
    transitions: {
        fast: '0.2s ease-in-out',
        base: '0.3s ease-in-out'
    }
};

export type Theme = typeof defaultTheme;

// props that later will be injected by styled-components
export type ThemeProps = { theme?: Theme };

// 'primary' | 'secondary'
export type ColorType = keyof Theme['colors'];

// 12 possible spaces
export type SpaceIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// 3 possible border radius
export type RadiiIndex = 'sm' | 'md' | 'lg';
