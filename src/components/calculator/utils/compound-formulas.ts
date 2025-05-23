/**
 * @file 复利计算公式
 * @description 专注于复利相关的公式实现，与math目录中的工具函数配合使用
 */

import { add, compoundInterest, divide, futureValueFactor, log, multiply, subtract } from './math';

/**
 * 计算复利终值 (Future Value, FV)
 *
 * 使用公式: FV = P * (1 + r)^n + A * [((1 + r)^n - 1) / r]
 *
 * @param P 初始本金 (Principal)
 * @param r 每期利率 (Rate per period)
 * @param n 总期数 (Number of periods)
 * @param A 每期追加投资 (Additional contribution per period)，默认为0（期末投入）
 * @returns 复利终值
 */
export const futureValueFormula = (P: number, r: number, n: number, A: number = 0): number => {
  // 直接使用金融工具中的复利计算函数
  return compoundInterest(P, r, n, A);
};

/**
 * 计算达到目标终值所需的初始本金 (Principal, P)
 *
 * 推导公式:
 * FV = P * (1 + r)^n + A * [((1 + r)^n - 1) / r]
 * P = (FV - A * [((1 + r)^n - 1) / r]) / (1 + r)^n
 *
 * @param FV 目标终值
 * @param r 每期利率
 * @param n 总期数
 * @param A 每期追加投资，默认为0
 * @returns 所需初始本金
 */
export const principalFormula = (FV: number, r: number, n: number, A: number = 0): number => {
  try {
    // 处理利率为0的特殊情况
    if (r === 0) {
      return subtract(FV, multiply(A, n));
    }

    // 计算 (1 + r)^n - 终值因子
    const fvFactor = futureValueFactor(r, n);

    // 计算追加投资部分: A * ((1 + r)^n - 1) / r
    let contributionPart = 0;
    if (A !== 0) {
      const contributionFactor = divide(subtract(fvFactor, 1), r);
      contributionPart = multiply(A, contributionFactor);
    }

    // 计算所需本金: (FV - contributionPart) / (1 + r)^n
    return divide(subtract(FV, contributionPart), fvFactor);
  } catch (error) {
    console.error('所需本金计算错误:', error);
    throw error;
  }
};

/**
 * 计算达到目标终值所需的期数 (Number of periods, n)
 *
 * 对于无追加投资的情况，公式推导为:
 * FV = P * (1 + r)^n
 * n = log(FV/P) / log(1+r)
 *
 * 对于有追加投资的情况，由于方程复杂，使用迭代法求解
 *
 * @param FV 目标终值
 * @param P 初始本金
 * @param r 利率（每期）
 * @param A 每期追加投资，默认为0
 * @returns 所需期数
 */
export const periodsFormula = (FV: number, P: number, r: number, A: number = 0): number => {
  try {
    // 处理利率为0的特殊情况
    if (r === 0) {
      if (A === 0 && P < FV) {
        return Infinity; // 无法仅通过本金达到目标
      }
      return divide(subtract(FV, P), A);
    }

    // 处理无追加投资的情况
    if (A === 0) {
      // n = log(FV/P) / log(1+r)
      const ratio = divide(FV, P);
      return log(ratio, add(1, r));
    }

    // 对于有追加投资的情况，使用二分法求解
    let low = 0;
    let high = 10000; // 设置一个合理的上限
    let mid = 0;
    let result = 0;
    const epsilon = 0.0001; // 精度要求

    while (high - low > epsilon) {
      mid = (low + high) / 2;
      // 调用终值公式计算当前期数的终值
      result = futureValueFormula(P, r, mid, A);

      if (Math.abs(result - FV) < epsilon) {
        return mid;
      }

      if (result < FV) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return mid;
  } catch (error) {
    console.error('所需期数计算错误:', error);
    throw error;
  }
};

/**
 * 计算达到目标终值所需的每期利率 (Rate per period, r)
 *
 * 由于公式复杂且无法直接求解，使用二分法求解
 *
 * @param FV 目标终值
 * @param P 初始本金
 * @param n 总期数
 * @param A 每期追加投资，默认为0
 * @returns 所需每期利率
 */
export const rateFormula = (FV: number, P: number, n: number, A: number = 0): number => {
  try {
    // 处理特殊情况
    const totalContribution = add(P, multiply(A, n));
    if (totalContribution >= FV) {
      // 本金加追加投资已超过或等于目标，不需要利率增长
      return 0;
    }

    // 使用二分法求解
    let low = 0;
    let high = 10; // 设置一个合理的上限，相当于1000%
    let mid = 0;
    let result = 0;
    const epsilon = 0.0000001; // 精度要求

    while (high - low > epsilon) {
      mid = (low + high) / 2;
      // 调用终值公式计算当前利率的终值
      result = futureValueFormula(P, mid, n, A);

      if (Math.abs(result - FV) < epsilon) {
        return mid;
      }

      if (result < FV) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return mid;
  } catch (error) {
    console.error('所需利率计算错误:', error);
    throw error;
  }
};

/**
 * 计算金额组成
 * 计算某一期的本金、利息和追加投资的组成部分
 *
 * @param P 初始本金
 * @param r 每期利率
 * @param n 当前期数
 * @param A 每期追加投资
 * @returns 返回对象包含{principal, interest, contribution, total}
 */
export const calculateAmountComposition = (
  P: number,
  r: number,
  n: number,
  A: number = 0
): {
  principal: number;
  interest: number;
  contribution: number;
  total: number;
} => {
  if (n === 0) {
    return {
      principal: P,
      interest: 0,
      contribution: 0,
      total: P,
    };
  }

  // 计算总终值
  const totalFV = futureValueFormula(P, r, n, A);

  // 累计追加投资总额
  const totalContribution = multiply(A, n);

  // 计算利息部分 = 总终值 - 初始本金 - 累计追加投资
  const interest = subtract(totalFV, add(P, totalContribution));

  return {
    principal: P, // 初始本金保持不变
    interest: interest > 0 ? interest : 0, // 累计利息
    contribution: totalContribution, // 累计追加投资
    total: totalFV, // 总终值
  };
};

/**
 * 获取期数单位转换系数
 * @param periodUnit 期数单位（年/半年/季度/月/周/日）
 * @returns 转换系数
 */
export const getPeriodRateConverter = (
  periodUnit: 'years' | 'halfYears' | 'quarters' | 'months' | 'weeks' | 'days'
): number => {
  switch (periodUnit) {
    case 'years':
      return 1;
    case 'halfYears':
      return 2;
    case 'quarters':
      return 4;
    case 'months':
      return 12;
    case 'weeks':
      return 52;
    case 'days':
      return 365;
    default:
      return 1;
  }
};
