'use client';

import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import React, { useEffect, useState } from 'react';

interface ThemeSwitchProps {
  onChange: (theme: 'light' | 'dark') => void;
}

/**
 * 主题切换组件
 * 在亮色和暗色主题之间切换
 */
const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ onChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 初始化主题
  useEffect(() => {
    // 获取存储的主题或使用系统偏好
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);

    setIsDarkMode(shouldUseDarkMode);
  }, []);

  // 切换主题
  const toggleTheme = (checked: boolean) => {
    const theme = checked ? 'dark' : 'light';
    setIsDarkMode(checked);
    localStorage.setItem('theme', theme);
    onChange(theme);
  };

  return (
    <Switch
      checked={isDarkMode}
      onChange={toggleTheme}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  );
};

export default ThemeSwitch;
