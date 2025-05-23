/**
 * @file 图表相关工具函数
 * @description 提供图表数据生成和处理的工具函数
 */

import { ChartDataPoint as ChartDataPointType } from '../types/chart-types';
import {
  ChartDataPoint,
  generateChartData as coreGenerateChartData,
} from '../utils/compound-calculator';

/**
 * 生成图表数据
 * @param principal 本金
 * @param rate 利率
 * @param periods 期数
 * @param additionalContribution 追加投资
 * @returns 图表数据点数组
 */
export const generateChartData = (
  principal: number,
  rate: number,
  periods: number,
  additionalContribution: number = 0
): ChartDataPoint[] => {
  // 直接使用核心计算模块的函数，避免重复实现
  return coreGenerateChartData(principal, rate, periods, additionalContribution);
};

/**
 * 生成随机颜色
 * @returns 随机颜色字符串
 */
export const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * 计算图表中的利息、本金和追加投资比例
 * @param chartData 图表数据
 * @returns 包含各部分比例的对象
 */
export const calculateChartProportions = (chartData: ChartDataPointType[]) => {
  if (!chartData || chartData.length === 0) {
    return { principalRatio: 0, interestRatio: 0, contributionRatio: 0 };
  }

  // 获取最后一个数据点
  const lastPoint = chartData[chartData.length - 1];
  const totalValue = lastPoint.value;

  // 如果总值为0，返回默认值
  if (totalValue === 0) {
    return { principalRatio: 0, interestRatio: 0, contributionRatio: 0 };
  }

  // 获取初始本金、累计利息和累计追加投资
  const initialPrincipal = chartData[0].principal;
  const totalInterest = lastPoint.interest;
  const totalContribution = lastPoint.contribution;

  // 计算各部分比例
  const principalRatio = (initialPrincipal / totalValue) * 100;
  const interestRatio = (totalInterest / totalValue) * 100;
  const contributionRatio = (totalContribution / totalValue) * 100;

  return {
    principalRatio,
    interestRatio,
    contributionRatio,
  };
};
