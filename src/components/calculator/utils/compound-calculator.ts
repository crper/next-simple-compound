/**
 * @file 复利计算器实现
 * @description 实现复利计算器的各项功能，包括计算和图表数据生成
 * 所有计算默认每期追加投资（A）发生在期末（Ordinary Annuity）。
 * 利率（r）和期数（n）应与所选的期数单位（年/月/日）保持一致。
 */

import {
  calculateAmountComposition,
  futureValueFormula,
  periodsFormula,
  principalFormula,
  rateFormula,
} from './compound-formulas';
import { round } from './math';

/**
 * 图表数据点类型定义
 */
export interface ChartDataPoint {
  period: number; // 当前期数
  value: number; // 当前期末总价值
  principal: number; // 初始本金部分
  interest: number; // 累计利息部分
  contribution: number; // 累计追加投资部分
}

/**
 * 高精度计算复利终值
 * 使用Decimal.js库进行高精度计算，避免浮点数精度问题
 */
export const calculateFutureValuePrecise = (
  P: number,
  r: number,
  n: number,
  A: number = 0
): number => {
  return futureValueFormula(P, r, n, A);
};

/**
 * 计算复利终值 (Future Value, FV)
 * @param P 初始本金 (Principal)
 * @param r 每期利率 (Rate per period)。例如，如果年利率是5%，按月计算，则 r = 0.05 / 12。
 * @param n 总期数 (Number of periods)。例如，如果投资5年，按月计算，则 n = 5 * 12。
 * @param A 每期追加投资 (Additional contribution per period)，默认为0。PRD要求默认为期末投入。
 * @returns {number} FV 复利终值。如果计算无效（例如，参数不合理），则返回 NaN。
 */
export const calculateFutureValue = (P: number, r: number, n: number, A: number = 0): number => {
  // 参数校验
  if (P < 0 || n < 0 || A < 0) return NaN;
  if (r < 0) return NaN; // 负利率需要特殊处理

  try {
    // 使用公式库中的函数计算
    return futureValueFormula(P, r, n, A);
  } catch (error) {
    console.error('复利终值计算错误:', error);
    return NaN;
  }
};

/**
 * 计算达到目标终值所需的初始本金 (Principal, P)
 * @param FV 目标终值 (Future Value)
 * @param r 每期利率 (Rate per period)
 * @param n 总期数 (Number of periods)
 * @param A 每期追加投资 (Additional contribution per period)，默认为0
 * @returns {number} P 所需初始本金。如果计算无效，则返回 NaN。
 */
export const calculatePrincipal = (FV: number, r: number, n: number, A: number = 0): number => {
  // 参数校验
  if (FV < 0 || n < 0 || A < 0) return NaN;
  if (r < 0) return NaN;

  try {
    // 使用公式库中的函数计算
    return principalFormula(FV, r, n, A);
  } catch (error) {
    console.error('所需本金计算错误:', error);
    return NaN;
  }
};

/**
 * 计算达到目标终值所需的期数 (Number of periods, n)
 * @param FV 目标终值 (Future Value)
 * @param P 初始本金 (Principal)
 * @param r 每期利率 (Rate per period)
 * @param A 每期追加投资 (Additional contribution per period)，默认为0
 * @returns {number} n 所需期数。如果计算无效，则返回 NaN。
 */
export const calculatePeriods = (FV: number, P: number, r: number, A: number = 0): number => {
  // 参数校验
  if (FV < 0 || P < 0 || A < 0) return NaN;
  if (r < 0) return NaN;
  if (P > FV && A === 0) return NaN; // 如果本金已超过目标且没有追加投资，则无解

  try {
    // 使用公式库中的函数计算
    return periodsFormula(FV, P, r, A);
  } catch (error) {
    console.error('所需期数计算错误:', error);
    return NaN;
  }
};

/**
 * 计算达到目标终值所需的每期利率 (Rate per period, r)
 * @param FV 目标终值 (Future Value)
 * @param P 初始本金 (Principal)
 * @param n 总期数 (Number of periods)
 * @param A 每期追加投资 (Additional contribution per period)，默认为0
 * @returns {number} r 所需每期利率。如果计算无效，则返回 NaN。
 */
export const calculateRate = (FV: number, P: number, n: number, A: number = 0): number => {
  // 参数校验
  if (FV < 0 || P < 0 || n <= 0 || A < 0) return NaN;
  if (P + A * n > FV) return NaN; // 本金加追加投资已超过目标，无需利率

  try {
    // 使用公式库中的函数计算
    return rateFormula(FV, P, n, A);
  } catch (error) {
    console.error('所需利率计算错误:', error);
    return NaN;
  }
};

/**
 * 生成图表数据
 * 根据PRD 5.3，对于大量数据点进行抽样处理，避免图表过于密集
 * @param P 初始本金
 * @param r 每期利率
 * @param n 总期数
 * @param A 每期追加投资
 * @returns 图表数据点数组
 */
export const generateChartData = (
  P: number,
  r: number,
  n: number,
  A: number = 0
): Array<ChartDataPoint> => {
  const chartData: Array<ChartDataPoint> = [];

  // 参数校验
  if (P < 0 || r < -1 || n <= 0 || A < 0 || isNaN(P) || isNaN(r) || isNaN(n) || isNaN(A)) {
    return chartData;
  }

  // 根据期数确定抽样策略，符合PRD 5.3要求
  let samplingInterval = 1;
  if (n > 500) {
    samplingInterval = Math.max(1, Math.floor(n / 100)); // 保留约100个数据点
  } else if (n > 100) {
    samplingInterval = Math.max(1, Math.floor(n / 50)); // 保留约50个数据点
  }

  // 始终包含第0期（初始状态）
  chartData.push({
    period: 0,
    value: P,
    principal: P,
    interest: 0,
    contribution: 0,
  });

  // 计算每个期数的数据点
  for (let i = 1; i <= n; i++) {
    // 使用计算金额组成函数获取该期的数据
    const { principal, interest, contribution, total } = calculateAmountComposition(P, r, i, A);

    // 按抽样间隔添加数据点
    if (i % samplingInterval === 0 || i === n) {
      // 处理整数情况
      const roundIfNeeded = (num: number): number => {
        const rounded = Math.round(num);
        return Math.abs(num - rounded) < 1e-10 ? rounded : round(num, 2);
      };

      chartData.push({
        period: i,
        value: roundIfNeeded(total),
        principal: roundIfNeeded(principal),
        interest: roundIfNeeded(interest),
        contribution: roundIfNeeded(contribution),
      });
    }
  }

  return chartData;
};

// 从compound-formulas.ts导出getPeriodRateConverter，保持API兼容
export { getPeriodRateConverter } from './compound-formulas';
