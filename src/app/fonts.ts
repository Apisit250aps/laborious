// app/fonts.ts
import localFont from 'next/font/local';

export const sarabun = localFont({
  src: [
    { path: '../../public/fonts/sarabun/Sarabun-Thin.ttf', weight: '100' },
    { path: '../../public/fonts/sarabun/Sarabun-ExtraLight.ttf', weight: '200' },
    { path: '../../public/fonts/sarabun/Sarabun-Light.ttf', weight: '300' },
    { path: '../../public/fonts/sarabun/Sarabun-Regular.ttf', weight: '400' },
    { path: '../../public/fonts/sarabun/Sarabun-Medium.ttf', weight: '500' },
    { path: '../../public/fonts/sarabun/Sarabun-SemiBold.ttf', weight: '600' },
    { path: '../../public/fonts/sarabun/Sarabun-Bold.ttf', weight: '700' },
    { path: '../../public/fonts/sarabun/Sarabun-ExtraBold.ttf', weight: '800' },
  ],
  variable: '--font-sarabun',
  display: 'swap',
});
