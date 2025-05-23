'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { PropsWithChildren } from 'react';
import ThemeProvider from './theme-provider';

export const RootProvider = ({ children }: PropsWithChildren) => {
  return (
    <AntdRegistry>
      <ThemeProvider>{children}</ThemeProvider>
    </AntdRegistry>
  );
};
