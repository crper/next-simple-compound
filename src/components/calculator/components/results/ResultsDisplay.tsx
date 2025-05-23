'use client';

import { Card, Empty, Flex, Spin, Table } from 'antd';
import React from 'react';
import { ChartDataPoint, Scheme } from '../../types/chart-types';
import { formatNumber } from '../../utils';
import ChartDisplay from './ChartDisplay';
import DetailsAndFormula from './DetailsAndFormula';

interface ResultsDisplayProps {
  calculationResult: {
    type: string;
    label: string;
    value: number | string;
    unit?: string;
    additionalInfo?: Record<string, string | number>; // 添加额外信息字段
  } | null;
  chartData: ChartDataPoint[];
  schemes: Scheme[];
  isCalculating: boolean;
  workerIsCalculating: boolean;
  calculationProgress: number;
  chartRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 结果显示组件
 * 整合统计数据、图表和数据表格的展示
 */
const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  calculationResult,
  chartData,
  isCalculating,
  workerIsCalculating,
  calculationProgress,
  chartRef,
}) => {
  // 是否是通货膨胀计算模式
  const isInflationMode = calculationResult?.type === 'inflation';

  // 表格列定义
  const columns = [
    {
      title: '期数',
      dataIndex: 'period',
      key: 'period',
      sorter: (a: ChartDataPoint, b: ChartDataPoint) => a.period - b.period,
      width: 80,
    },
    {
      title: '本金',
      dataIndex: 'principal',
      key: 'principal',
      render: (text: number) => `¥${formatNumber(text)}`,
      sorter: (a: ChartDataPoint, b: ChartDataPoint) => a.principal - b.principal,
      width: 150,
    },
    {
      title: '追加投资',
      dataIndex: 'contribution',
      key: 'contribution',
      render: (text: number) => `¥${formatNumber(text)}`,
      sorter: (a: ChartDataPoint, b: ChartDataPoint) => a.contribution - b.contribution,
      width: 150,
    },
    {
      title: '利息',
      dataIndex: 'interest',
      key: 'interest',
      render: (text: number) => `¥${formatNumber(text)}`,
      sorter: (a: ChartDataPoint, b: ChartDataPoint) => a.interest - b.interest,
      width: 150,
    },
    {
      title: '总金额（名义值）',
      dataIndex: 'value',
      key: 'value',
      render: (text: number) => `¥${formatNumber(text)}`,
      sorter: (a: ChartDataPoint, b: ChartDataPoint) => a.value - b.value,
      width: 180,
    },
    // 通货膨胀模式下显示实际购买力列
    ...(isInflationMode
      ? [
          {
            title: '实际购买力',
            dataIndex: 'realValue',
            key: 'realValue',
            render: (text: number) => `¥${formatNumber(text)}`,
            sorter: (a: ChartDataPoint, b: ChartDataPoint) =>
              (a.realValue || 0) - (b.realValue || 0),
            width: 150,
          },
        ]
      : []),
  ];

  // 如果没有数据，显示引导提示
  if (!chartData || chartData.length === 0) {
    return (
      <Card className="mb-6 shadow-sm results-empty-card glass">
        <div className="text-center py-16">
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            styles={{
              image: {
                height: 160,
              },
            }}
            description={
              <div>
                <h3 className="text-lg font-medium mb-2">暂无计算数据</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  请在上方输入参数并点击开始计算按钮，或尝试实时计算功能
                </p>
              </div>
            }
          ></Empty>
        </div>
      </Card>
    );
  }

  // 计算表格的适当高度
  const tableHeight = Math.min(
    // 最小高度为300px，最大高度为视口高度的40%或400px取较小值
    Math.max(300, window.innerHeight * 0.4),
    400
  );

  return (
    <Spin
      spinning={workerIsCalculating}
      tip={`计算中 (${calculationProgress}%)`}
      className="results-spinner"
    >
      <Flex vertical gap="middle" className="w-full">
        {/* 使用 Flex 组件实现响应式布局 - 大屏左右布局，小屏垂直布局 */}
        <div className="flex flex-col lg:flex-row w-full gap-4 justify-between">
          {/* 统计数据和公式展示 */}
          <div className="w-full flex-1 lg:w-5/12 xl:w-5/12 xxl:w-1/3">
            <DetailsAndFormula chartData={chartData} calculationResult={calculationResult} />
          </div>

          {/* 图表展示 */}
          <div className="w-full flex-1 lg:w-6/12 xl:w-6/12 xxl:w-2/3">
            <ChartDisplay chartData={chartData} isCalculating={isCalculating} chartRef={chartRef} />
          </div>
        </div>

        {/* 数据表格 - 始终占据整行 */}
        <Card className="mb-4 shadow-md w-full results-data-card glass">
          <div className="results-table-container">
            <Table
              dataSource={chartData.map(item => ({ ...item, key: item.period }))}
              columns={columns}
              scroll={{ x: 768, y: tableHeight }}
              pagination={false}
              className="w-full results-data-table"
              size="middle"
              sticky={true}
              virtual={true}
            />
          </div>
        </Card>
      </Flex>
    </Spin>
  );
};

export default ResultsDisplay;
