/**
 * 数学工具库入口文件
 * 导出所有数学工具功能
 */

import { advancedMath } from './advanced';
import { basicMath } from './basic';
import { financialMath } from './financial';
import { statisticsMath } from './statistics';

// 导出基础数学运算
export const { add, subtract, multiply, divide, pow, round, abs, mod, max, min } = basicMath;

// 导出高级数学函数
export const { exp, log, sqrt, sin, cos, tan, toRadians, toDegrees } = advancedMath;

// 导出金融计算工具
export const {
  compoundInterest,
  annuityDue,
  mortgagePayment,
  npv,
  presentValueOfAnnuity,
  futureValueFactor,
  equalPrincipalPayment,
} = financialMath;

// 导出统计计算工具
export const {
  mean,
  variance,
  standardDeviation,
  median,
  percentile,
  covariance,
  correlation,
  weightedMean,
} = statisticsMath;

// 导出完整的工具对象
export const preciseCalculator = {
  ...basicMath,
  ...advancedMath,
  ...financialMath,
};

// 导出金融计算器（兼容旧版API）
export const financialCalculator = financialMath;

// 导出统计计算器（兼容旧版API）
export const statisticsCalculator = statisticsMath;
