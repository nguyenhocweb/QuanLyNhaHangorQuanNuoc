export type TemplateCode = 'TPL_MODERN' | 'TPL_CLASSIC' | 'TPL_LUXURY' | 'TPL_FASTFOOD' | string;

export interface ThemeConfig {
    primaryColor?: string;
    primaryHoverColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontHeading?: string;
    fontBody?: string;
    borderRadius?: string;
}

const TEMPLATE_PRESETS: Record<string, ThemeConfig> = {
    'TPL_MODERN': {
        primaryColor: '#4f46e5', // indigo-600
        primaryHoverColor: '#4338ca', // indigo-700
        secondaryColor: '#f3f4f6', // gray-100
        accentColor: '#ec4899', // pink-500
        borderRadius: '1rem', // rounded-2xl
    },
    'TPL_CLASSIC': {
        primaryColor: '#b45309', // amber-700
        primaryHoverColor: '#92400e', // amber-800
        secondaryColor: '#fef3c7', // amber-50
        accentColor: '#be123c', // rose-700
        borderRadius: '0.25rem', // rounded
        fontHeading: 'Georgia, serif',
    },
    'TPL_LUXURY': {
        primaryColor: '#171717', // neutral-900
        primaryHoverColor: '#262626', // neutral-800
        secondaryColor: '#fafafa', // neutral-50
        accentColor: '#d4af37', // metallic gold
        borderRadius: '0px', // no rounded corners
        fontHeading: 'Playfair Display, serif',
    }
};

/**
 * Parses and applies the template theme CSS variables to the document or a specific ref
 */
export const applyTheme = (templateCode?: TemplateCode, customConfig?: ThemeConfig, element?: HTMLElement | null) => {
    if (typeof window === 'undefined') return;
    
    const target = element || document.documentElement;
    const baseConfig = templateCode ? (TEMPLATE_PRESETS[templateCode] || TEMPLATE_PRESETS['TPL_MODERN']) : TEMPLATE_PRESETS['TPL_MODERN'];
    
    // Merge base template config with user custom overrides
    const finalConfig = { ...baseConfig, ...customConfig };

    if (finalConfig.primaryColor) target.style.setProperty('--tpl-primary', finalConfig.primaryColor);
    if (finalConfig.primaryHoverColor) target.style.setProperty('--tpl-primary-hover', finalConfig.primaryHoverColor);
    if (finalConfig.secondaryColor) target.style.setProperty('--tpl-secondary', finalConfig.secondaryColor);
    if (finalConfig.accentColor) target.style.setProperty('--tpl-accent', finalConfig.accentColor);
    if (finalConfig.fontHeading) target.style.setProperty('--tpl-font-heading', finalConfig.fontHeading);
    if (finalConfig.fontBody) target.style.setProperty('--tpl-font-body', finalConfig.fontBody);
    if (finalConfig.borderRadius) target.style.setProperty('--tpl-radius', finalConfig.borderRadius);
};
