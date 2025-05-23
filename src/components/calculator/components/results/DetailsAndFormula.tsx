'use client';

import { Card, Typography } from 'antd';
import React from 'react';
import { ChartDataPoint } from '../../types/chart-types';
import EmptyResultCard from './EmptyResultCard';
import StatisticsOverview from './StatisticsOverview';

const { Title } = Typography;

interface DetailsAndFormulaProps {
  chartData: ChartDataPoint[];
  calculationResult: {
    type: string;
    label: string;
    value: number | string;
    unit?: string;
    additionalInfo?: Record<string, string | number>;
  } | null;
}

/**
 * 计算结果统计组件
 * 显示投资收益概览
 */
const DetailsAndFormula: React.FC<DetailsAndFormulaProps> = ({ chartData, calculationResult }) => {
  // 如果没有数据，显示空状态
  if (!chartData || chartData.length === 0) {
    return <EmptyResultCard />;
  }

  return (
    <Card
      className="mb-4 details-formula-card h-full shadow-sm hover:shadow-md transition-shadow"
      styles={{
        body: {
          background: 'transparent',
          padding: '16px',
          height: '100%',
        },
      }}
      title={
        <Title level={4} className="m-0">
          投资收益概览
        </Title>
      }
    >
      <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
        <StatisticsOverview chartData={chartData} calculationResult={calculationResult} />
      </div>
    </Card>
  );
};

export default DetailsAndFormula;
