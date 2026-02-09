import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  // 支持的语言列表
  locales: locales,

  // 默认语言
  defaultLocale: 'en',

  // 语言前缀策略
  localePrefix: 'always',
});

export const config = {
  // 匹配除了 api、_next、_vercel 和静态文件之外的所有路径
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
