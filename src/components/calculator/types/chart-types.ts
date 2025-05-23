/**
 * @file 图表相关类型定义
 * @description 包含图表数据点等类型定义
 */

import type { ChartDataPoint as CoreChartDataPoint } from '../utils/compound-calculator';

/**
 * 图表数据点类型
 * 扩展自核心计算模块的数据点类型
 */
export interface ChartDataPoint extends CoreChartDataPoint {
  realValue?: number; // 考虑通货膨胀后的实际价值
}

/**
 * 图表配置接口
 */
export interface ChartConfig {
  showPrincipal: boolean;
  showInterest: boolean;
  showContribution: boolean;
}

/**
 * 方案类型定义
 */
export interface Scheme {
  id?: string; // 方案唯一ID
  name: string; // 方案名称
  data: ChartDataPoint[]; // 方案图表数据
  color: string; // 方案线条颜色
  params: {
    // 方案参数
    principal: number;
    rate: number;
    periods: number;
    additionalContribution: number;
    periodUnit: string;
  };
  createdAt?: number; // 方案创建时间
}
