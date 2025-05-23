'use client';

import { Card, Empty, Spin, Tabs, Typography } from 'antd';
import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartDataPoint } from '../../types/chart-types';
import { formatNumber } from '../../utils';
import { abs, divide, max, multiply, round, subtract } from '../../utils/math';

const { Title } = Typography;

interface ChartDisplayProps {
  chartData: ChartDataPoint[];
  isCalculating: boolean;
  chartRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 图表显示组件
 * 使用Recharts展示复利计算结果的可视化图表
 */
const ChartDisplay: React.FC<ChartDisplayProps> = ({ chartData, isCalculating, chartRef }) => {
  // 判断是否包含通货膨胀的实际价值数据
  const hasInflationData = chartData.length > 0 && chartData[0].realValue !== undefined;

  // 使用useMemo优化计算密集型操作
  const chartAnalysisData = useMemo(() => {
    if (chartData.length === 0) return null;

    // 计算增长率数据（仅取部分点，避免图表过密）
    const growthRateData = chartData
      .filter((_, index) => index % Math.max(1, Math.floor(chartData.length / 20)) === 0)
      .map((point, index, array) => {
        // 计算每个点的增长率
        const previousPoint = index > 0 ? array[index - 1] : point;
        const growthRate =
          index > 0
            ? round(
                multiply(divide(point.value - previousPoint.value, previousPoint.value), 100),
                2
              )
            : 0;

        // 计算通货膨胀调整后的增长率
        const inflationAdjustedGrowthRate =
          point.realValue !== undefined && previousPoint.realValue !== undefined && index > 0
            ? round(
                multiply(
                  divide(point.realValue - previousPoint.realValue, previousPoint.realValue),
                  100
                ),
                2
              )
            : undefined;

        return {
          ...point,
          growthRate,
          inflationAdjustedGrowthRate,
        };
      });

    return {
      growthRateData,
    };
  }, [chartData]);

  // 如果正在计算，显示加载状态
  if (isCalculating) {
    return (
      <Card className="mb-4 results-chart-card glass shadow-md">
        <div className="flex justify-center items-center py-16">
          <Spin tip="计算中..." size="large" />
        </div>
      </Card>
    );
  }

  // 如果没有数据，显示空状态
  if (!chartData || chartData.length === 0) {
    return (
      <Card className="mb-4 results-chart-card glass shadow-md">
        <Empty
          description={<span className="dark:text-gray-300">暂无图表数据</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  // 准备饼图数据
  const lastPoint = chartData[chartData.length - 1];
  const pieData = [
    {
      name: '本金',
      value: lastPoint.principal,
      color: '#8884d8',
    },
    {
      name: '利息',
      value: lastPoint.interest,
      color: '#82ca9d',
    },
    {
      name: '追加投资',
      value: lastPoint.contribution,
      color: '#ffc658',
    },
  ];

  // 自定义工具提示
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="text-gray-700 dark:text-gray-300 font-medium">{`第 ${label} 期`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="font-medium">
              {`${entry.name}: ${entry.name.includes('率') ? entry.value + '%' : '¥' + formatNumber(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 自定义饼图工具提示
  interface PieTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  }

  const CustomPieTooltip: React.FC<PieTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p style={{ color: payload[0].color }} className="font-medium">
            {`${payload[0].name}: ¥${formatNumber(payload[0].value)}`}
          </p>
          <p className="dark:text-gray-300">{`占比: ${round(multiply(divide(payload[0].value, lastPoint.value), 100), 2).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mb-4 results-chart-card glass shadow-md" ref={chartRef}>
      <Title level={4} className="mb-4">
        投资增长图表
      </Title>

      <Tabs
        defaultActiveKey="line"
        items={[
          {
            key: 'line',
            label: '增长曲线',
            children: (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis
                      tickFormatter={value =>
                        `¥${
                          value >= 1000000
                            ? `${round(divide(value, 1000000), 1).toFixed(1)}M`
                            : value >= 1000
                              ? `${round(divide(value, 1000), 1).toFixed(1)}K`
                              : value
                        }`
                      }
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      name="名义总额"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    {hasInflationData && (
                      <Area
                        type="monotone"
                        dataKey="realValue"
                        name="实际购买力"
                        stackId="3"
                        stroke="#e63946"
                        fill="#e63946"
                        fillOpacity={0.3}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="principal"
                      name="本金"
                      stackId="2"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="contribution"
                      name="追加投资"
                      stackId="2"
                      stroke="#ffc658"
                      fill="#ffc658"
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="interest"
                      name="利息"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ),
          },
          {
            key: 'bar',
            label: '柱状图',
            children: (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={chartData.filter((_, i) => i % Math.ceil(chartData.length / 20) === 0)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis
                    tickFormatter={value =>
                      `¥${
                        value >= 1000000
                          ? `${round(divide(value, 1000000), 1).toFixed(1)}M`
                          : value >= 1000
                            ? `${round(divide(value, 1000), 1).toFixed(1)}K`
                            : value
                      }`
                    }
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="principal" name="本金" stackId="a" fill="#8884d8" />
                  <Bar dataKey="contribution" name="追加投资" stackId="a" fill="#ffc658" />
                  <Bar dataKey="interest" name="利息" stackId="a" fill="#82ca9d" />
                  {hasInflationData && <Bar dataKey="realValue" name="实际购买力" fill="#e63946" />}
                </BarChart>
              </ResponsiveContainer>
            ),
          },
          {
            key: 'pie',
            label: '构成占比',
            children: (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${round(multiply(percent, 100), 2).toFixed(2)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ),
          },
          ...(hasInflationData
            ? [
                {
                  key: 'inflation',
                  label: '通货膨胀影响',
                  children: (
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis
                          yAxisId="left"
                          tickFormatter={value =>
                            `¥${
                              value >= 1000000
                                ? `${round(divide(value, 1000000), 1).toFixed(1)}M`
                                : value >= 1000
                                  ? `${round(divide(value, 1000), 1).toFixed(1)}K`
                                  : value
                            }`
                          }
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tickFormatter={value => `${value}%`}
                          domain={[
                            0,
                            chartData[chartData.length - 1]?.realValue !== undefined
                              ? max(
                                  multiply(
                                    divide(
                                      abs(
                                        subtract(
                                          chartData[chartData.length - 1].value,
                                          chartData[chartData.length - 1].realValue || 0
                                        )
                                      ),
                                      chartData[chartData.length - 1].value
                                    ),
                                    100
                                  ) * 1.2,
                                  100
                                )
                              : 100,
                          ]}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="value"
                          name="名义价值"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                        />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="realValue"
                          name="实际购买力"
                          stroke="#e63946"
                          fill="#e63946"
                          fillOpacity={0.3}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey={item =>
                            item.realValue !== undefined
                              ? round(
                                  multiply(
                                    divide(abs(subtract(item.value, item.realValue)), item.value),
                                    100
                                  ),
                                  2
                                )
                              : 0
                          }
                          name="购买力损失率"
                          stroke="#ff8c00"
                          strokeWidth={2}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ),
                },
                {
                  key: 'growth',
                  label: '增长率对比',
                  children: (
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart
                        data={chartAnalysisData?.growthRateData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis tickFormatter={value => `${value}%`} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="growthRate" name="名义增长率" fill="#8884d8" />
                        {hasInflationData && (
                          <Bar
                            dataKey="inflationAdjustedGrowthRate"
                            name="实际增长率"
                            fill="#e63946"
                          />
                        )}
                        <Line
                          type="monotone"
                          dataKey="growthRate"
                          name="名义增长趋势"
                          stroke="#8884d8"
                          dot={false}
                        />
                        {hasInflationData && (
                          <Line
                            type="monotone"
                            dataKey="inflationAdjustedGrowthRate"
                            name="实际增长趋势"
                            stroke="#e63946"
                            dot={false}
                          />
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  ),
                },
              ]
            : []),
        ]}
      />
    </Card>
  );
};

export default ChartDisplay;
