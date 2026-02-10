import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#722ed1',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',

    borderRadius: 6,
    fontSize: 14,

    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontFamilyCode: '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace',
  },
  components: {
    Button: {
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      primaryShadow: '0 2px 8px rgba(114, 46, 209, 0.2)',
      borderRadius: 6,
    },
    Input: {
      controlHeight: 36,
      controlHeightLG: 44,
      activeShadow: '0 0 0 2px rgba(114, 46, 209, 0.1)',
      borderRadius: 6,
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#333',
      rowHoverBg: 'rgba(114, 46, 209, 0.03)',
      borderRadius: 8,
    },
    Card: {
      boxShadowTertiary: '0 2px 8px rgba(0, 0, 0, 0.04)',
      borderRadiusLG: 12,
    },
    Modal: {
      borderRadiusLG: 12,
    },
    Select: {
      controlHeight: 36,
      borderRadius: 6,
    },
  },
};
