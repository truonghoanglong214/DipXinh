/**
 * DịpXinh Design System Tokens
 * Role: Senior SaaS Product Designer & React UI Engineer
 * Domain: Modern Fashion SaaS (Atelier Rental & Retail)
 */

export interface StoreBrandTheme {
  id: string;
  name: string;
  description: string;
  primary: string; // Main brand accent
  primaryHover: string;
  primarySoft: string; // 10-15% tint for badges, subtle highlights
  primaryForeground: string; // Contrast text color on primary
}

export const STORE_BRAND_PRESETS: StoreBrandTheme[] = [
  {
    id: 'dipxinh-atelier',
    name: 'DịpXinh Atelier (Default)',
    description: 'Rượu vang trầm & lụa cổ điển, đặc trưng thời trang cao cấp.',
    primary: '#713F4B',
    primaryHover: '#5C303B',
    primarySoft: '#ECDAD8',
    primaryForeground: '#FFFFFF',
  },
  {
    id: 'imperial-emerald',
    name: 'Ngọc Lục Bảo (Imperial Emerald)',
    description: 'Thanh lịch hoàng gia, phù hợp áo dài & trang sức dạ hội.',
    primary: '#235347',
    primaryHover: '#1A3F36',
    primarySoft: '#DCEDE8',
    primaryForeground: '#FFFFFF',
  },
  {
    id: 'midnight-sapphire',
    name: 'Lam Đêm (Midnight Sapphire)',
    description: 'Hiện đại, sắc sảo, thích hợp âu phục & đầm tiệc dạ quang.',
    primary: '#1E3A5F',
    primaryHover: '#142842',
    primarySoft: '#DCE7F5',
    primaryForeground: '#FFFFFF',
  },
  {
    id: 'terracotta-chic',
    name: 'Đất Nung Tây Âu (Terracotta Chic)',
    description: 'Ấm áp, nghệ thuật, gợi cảm hứng thủ công và haute couture.',
    primary: '#A34836',
    primaryHover: '#863626',
    primarySoft: '#F6E4E0',
    primaryForeground: '#FFFFFF',
  },
  {
    id: 'noir-minimalist',
    name: 'Hắc Sắc Tối Giản (Noir Luxe)',
    description: 'Đen carbon nguyên bản, sắc lạnh và tập trung vào công năng thuần khiết.',
    primary: '#18181B',
    primaryHover: '#27272A',
    primarySoft: '#E4E4E7',
    primaryForeground: '#FFFFFF',
  },
];

export const DESIGN_TOKENS = {
  colors: {
    // Canvas & Neutral Foundation (warm luxury neutrals)
    canvas: '#FCF9F5', // Nền tổng thể ấm áp, tôn da vải vóc
    surface: '#FFFDFC', // Nền card, bảng biểu, modal
    surfaceElevated: '#FFFFFF',
    surfaceSubtle: '#F7F2EC',
    border: '#E8DFD8', // Đường viền mảnh, thanh lịch
    borderSubtle: '#F0EAE4',

    // Ink Typography Foundation
    ink: '#302824', // Màu chữ chính (nâu đen ấm, không gây chói mắt như #000)
    inkMuted: '#756A64', // Màu chữ phụ, mô tả, nhãn
    inkSubtle: '#A89F99', // Placeholder, disabled, hint

    // Default Brand Accents (Platform level)
    brandWine: '#713F4B',
    brandWineDark: '#5C303B',
    brandRose: '#C79A97',
    brandRoseSoft: '#ECDAD8',
    brandGold: '#A98758',
    brandSage: '#A9B2A3',

    // Operational Status Tokens
    status: {
      success: {
        text: '#1E5844',
        bg: '#EAF5F0',
        border: '#BFE3D4',
        solid: '#2E7D5F',
      },
      warning: {
        text: '#7C4E10',
        bg: '#FDF6EC',
        border: '#F2D7B2',
        solid: '#C2781E',
      },
      danger: {
        text: '#8B2E2E',
        bg: '#FCEFEF',
        border: '#F5C9C9',
        solid: '#B93838',
      },
      info: {
        text: '#29546B',
        bg: '#EBF3F8',
        border: '#BFD9E8',
        solid: '#3A7799',
      },
      neutral: {
        text: '#554C47',
        bg: '#F2EDE8',
        border: '#DDD5CD',
        solid: '#70645D',
      },
    },
  },

  typography: {
    fonts: {
      display: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
      sans: '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    sizes: {
      display1: 'text-4xl md:text-5xl font-display font-medium tracking-tight',
      display2: 'text-3xl md:text-4xl font-display font-medium tracking-tight',
      h1: 'text-2xl md:text-3xl font-display font-semibold tracking-tight',
      h2: 'text-xl md:text-2xl font-display font-semibold',
      h3: 'text-lg md:text-xl font-sans font-semibold',
      h4: 'text-base font-sans font-semibold',
      bodyLg: 'text-base font-sans leading-relaxed',
      body: 'text-sm font-sans leading-normal',
      bodySm: 'text-xs font-sans leading-normal',
      caption: 'text-[11px] font-sans font-medium text-ink-muted',
      kicker: 'text-[11px] font-sans font-semibold uppercase tracking-[0.14em]',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    base: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  radius: {
    none: '0px',
    sm: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px (default cards and buttons)
    xl: '0.75rem', // 12px (modals)
    full: '9999px',
  },
} as const;
