'use client';

import { Card, Empty, Space } from 'antd';
import React from 'react';

/**
 * 空结果卡片组件
 * 当没有计算数据时显示
 */
const EmptyResultCard: React.FC = () => {
  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow text-center py-8">
      <Empty
        description={
          <Space direction="vertical" size="large" className="mt-4">
            <span className="text-lg font-medium text-gray-600">暂无计算数据</span>
            <span className="text-sm text-gray-500">请在上方输入参数并点击开始计算按钮</span>
          </Space>
        }
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{
          height: 80,
        }}
      />
    </Card>
  );
};

export default EmptyResultCard;
