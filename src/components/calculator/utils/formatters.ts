/**
 * 格式化工具函数
 * 处理金额、百分比等数据的格式化和解析
 */

import type { CalculationMode } from '../types';

/**
 * 格式化金额，添加货币符号和千分位分隔符
 */
export const formatMoney = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return '';
  return `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 解析金额字符串，移除货币符号和千分位分隔符
 */
export const parseMoney = (value: string | undefined): string => {
  if (value === undefined || value === null) return '';
  return value.replace(/\¥\s?|(,*)/g, '');
};

/**
 * 格式化百分比，添加百分号
 */
export const formatPercent = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return '';
  return `${value}%`;
};

/**
 * 解析百分比字符串，移除百分号
 */
export const parsePercent = (value: string | undefined): string => {
  if (value === undefined || value === null) return '';
  return value.replace('%', '');
};

/**
 * 格式化数字，处理大数值显示
 * 整数显示为整数，浮点数至少保留6位小数
 */
export const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
    return '0.000000';
  }

  // 处理大数值
  if (value >= 1000000000000) {
    // 万亿级别
    return `${(value / 1000000000000).toFixed(6)}万亿`;
  } else if (value >= 100000000) {
    // 亿级别
    return `${(value / 100000000).toFixed(6)}亿`;
  } else if (value >= 10000) {
    // 万级别
    return `${(value / 10000).toFixed(6)}万`;
  }

  // 判断是否为整数
  if (Number.isInteger(value)) {
    return value.toLocaleString();
  } else {
    // 浮点数至少保留6位小数
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    });
  }
};

/**
 * 格式化计算结果值
 * 整数显示为整数，浮点数至少保留6位小数
 */
export const formatResultValue = (result: {
  value: number | string;
  type?: CalculationMode;
  unit?: string;
}): string => {
  if (!result) return '';

  const { value, type, unit } = result;
  if (typeof value === 'string') return `${value} ${unit || ''}`;

  // 判断是否为整数
  const isInteger = Number.isInteger(value);

  switch (type) {
    case 'futureValue':
    case 'principal':
      if (isInteger) {
        return `${value.toLocaleString()} ${unit || ''}`;
      } else {
        return `${value.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ${unit || ''}`;
      }
    case 'periods':
      return `${Math.round(value)} ${unit || ''}`;
    case 'rate':
      return `${value.toFixed(6)}${unit || ''}`;
    default:
      if (isInteger) {
        return `${value.toLocaleString()} ${unit || ''}`;
      } else {
        return `${value.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ${unit || ''}`;
      }
  }
};
