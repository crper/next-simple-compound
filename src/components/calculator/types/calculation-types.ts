/**
 * @file 计算相关类型定义
 * @description 定义计算器组件中使用的计算相关类型
 */

/**
 * 计算模式类型
 */
export type CalculationMode =
  | 'futureValue' // 计算复利终值
  | 'principal' // 计算所需本金
  | 'periods' // 计算所需期数
  | 'rate' // 计算所需年利率
  | 'inflation'; // 通货膨胀影响计算

/**
 * 计算参数接口
 */
export interface CalculationParams {
  calculationMode: CalculationMode;
  principal?: number;
  futureValueInput?: number;
  annualRate?: number;
  periods?: number;
  periodUnit: string;
  additionalContribution?: number;
  inflationRate?: number; // 通货膨胀率
}

/**
 * 计算结果接口
 */
export interface CalculationResult {
  type: CalculationMode;
  label: string;
  value: number | string;
  unit?: string;
  additionalInfo?: Record<string, string | number>; // 额外信息，如通货膨胀模式下的实际购买力
}

/**
 * 计算方案接口
 */
export interface CalculationScheme {
  id: string;
  name: string;
  params: CalculationParams;
  result: CalculationResult | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 获取计算模式对应的标签
 * @param mode 计算模式
 * @returns 对应的中文标签
 */
export const getCalculationLabel = (mode: CalculationMode): string => {
  switch (mode) {
    case 'futureValue':
      return '复利终值';
    case 'principal':
      return '所需本金';
    case 'periods':
      return '所需期数';
    case 'rate':
      return '所需年利率';
    case 'inflation':
      return '通货膨胀影响';
    default:
      return '计算结果';
  }
};
