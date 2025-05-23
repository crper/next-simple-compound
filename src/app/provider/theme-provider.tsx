'use client';

import {
  CalculatorOutlined,
  GithubOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Drawer, Layout, Menu, Typography, theme } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeSwitch } from '../../components/calculator/components/common';

const { Header, Content, Footer } = Layout;

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 在客户端初始化主题和检测屏幕尺寸
  useEffect(() => {
    // 获取存储的主题或使用系统偏好
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);
    setIsDarkMode(shouldUseDarkMode);

    // 应用主题类到文档
    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 检测屏幕尺寸
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // 切换主题
  const toggleTheme = (theme: 'light' | 'dark') => {
    const isDark = theme === 'dark';
    setIsDarkMode(isDark);

    // 更新文档类
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 生成菜单项函数
  const getMenuItems = () => [
    {
      key: 'home',
      icon: <HomeOutlined style={{ color: isDarkMode ? '#1890ff' : undefined }} />,
      label: (
        <Link href="/" style={{ color: isDarkMode ? '#fff' : undefined }}>
          首页
        </Link>
      ),
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined style={{ color: isDarkMode ? '#1890ff' : undefined }} />,
      label: (
        <Link href="/about" style={{ color: isDarkMode ? '#fff' : undefined }}>
          关于
        </Link>
      ),
    },
    {
      key: 'github',
      icon: <GithubOutlined style={{ color: isDarkMode ? '#1890ff' : undefined }} />,
      label: (
        <Link
          href="https://github.com/crper/next-simple-compound"
          target="_blank"
          style={{ color: isDarkMode ? '#fff' : undefined }}
        >
          GitHub
        </Link>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isDarkMode ? 'rgba(31, 31, 31, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderBottom: `1px solid ${isDarkMode ? '#333' : '#f0f0f0'}`,
            boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          className={isDarkMode ? 'dark-header' : 'light-header'}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalculatorOutlined
                style={{
                  fontSize: '24px',
                  color: '#1677ff',
                  textShadow: isDarkMode ? '0 0 5px rgba(24, 144, 255, 0.5)' : 'none',
                }}
              />
              <Typography.Title
                level={4}
                style={{
                  margin: 0,
                  color: isDarkMode ? '#fff' : '#1677ff',
                  textShadow: isDarkMode ? '0 0 5px rgba(255, 255, 255, 0.3)' : 'none',
                }}
              >
                Compound+ 复利计算器
              </Typography.Title>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <>
                <div style={{ marginRight: '16px', width: '160px' }}>
                  <ThemeSwitch onChange={toggleTheme} />
                </div>
                <Button
                  type="text"
                  icon={
                    <MenuOutlined
                      style={{ color: isDarkMode ? '#fff' : undefined, fontSize: '18px' }}
                    />
                  }
                  onClick={() => setDrawerVisible(true)}
                  style={{ border: 'none' }}
                />
                <Drawer
                  title="菜单"
                  placement="right"
                  onClose={() => setDrawerVisible(false)}
                  open={drawerVisible}
                  styles={{
                    body: {
                      padding: 0,
                      background: isDarkMode ? '#1f1f1f' : '#fff',
                    },
                    header: {
                      background: isDarkMode ? '#1f1f1f' : '#fff',
                      color: isDarkMode ? '#fff' : undefined,
                      borderBottom: `1px solid ${isDarkMode ? '#333' : '#f0f0f0'}`,
                    },
                  }}
                >
                  <Menu
                    mode="vertical"
                    items={getMenuItems()}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: isDarkMode ? '#fff' : 'inherit',
                    }}
                    theme={isDarkMode ? 'dark' : 'light'}
                    onClick={() => setDrawerVisible(false)}
                  />
                </Drawer>
              </>
            ) : (
              <>
                <Menu
                  mode="horizontal"
                  items={getMenuItems()}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: isDarkMode ? '#fff' : 'inherit',
                  }}
                  theme={isDarkMode ? 'dark' : 'light'}
                  disabledOverflow={true}
                />
                <ThemeSwitch onChange={toggleTheme} />
              </>
            )}
          </div>
        </Header>

        <Content style={{ padding: '24px', flex: 1 }}>{children}</Content>

        <Footer
          style={{
            textAlign: 'center',
            background: isDarkMode ? 'rgba(31, 31, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderTop: `1px solid ${isDarkMode ? '#333' : '#f0f0f0'}`,
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
        >
          <Typography.Text
            type="secondary"
            style={{
              color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : undefined,
            }}
          >
            © 2024 Compound+ 复利计算器. 保留所有权利.
          </Typography.Text>
          <br />
          <Typography.Text
            type="secondary"
            style={{
              fontSize: '12px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.45)' : undefined,
            }}
          >
            现代化复利计算工具，轻松规划您的财务未来
          </Typography.Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
