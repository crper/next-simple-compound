import { RootProvider } from '@/app/provider/root-provider';
import { getAssetPath } from '@/utils/path';
import '@ant-design/v5-patch-for-react-19';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Compound+ 复利计算器',
  description: '极简复利计算器H5（移动端优化版）',
  icons: {
    icon: getAssetPath('/images/favicon/favicon.ico'),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <main>
          <RootProvider>{children}</RootProvider>
        </main>
      </body>
    </html>
  );
}
