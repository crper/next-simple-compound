/**
 * @file 表单相关类型定义
 * @description 定义计算器组件中使用的表单相关类型
 */

/**
 * 期数单位类型
 */
export type PeriodUnit = 'years' | 'halfYears' | 'quarters' | 'months' | 'weeks' | 'days';

/**
 * 表单值类型
 */
export interface FormValues {
  principal?: number;
  annualRate?: number;
  periods?: number;
  periodUnit: PeriodUnit; // 修改为必填项
  additionalContribution?: number;
  futureValueInput?: number;
  inflationRate?: number; // 通货膨胀率（用于通货膨胀影响计算模式）
}
