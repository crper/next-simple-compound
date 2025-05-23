/**
 * 金融计算模块
 * 包含复利、贷款、现金流等金融计算功能
 */

import Decimal from 'decimal.js';

/**
 * 金融计算工具
 */
export const financialMath = {
  /**
   * 计算复利终值
   * 公式: FV = P * (1 + r)^n + A * [(1 + r)^n - 1] / r
   *
   * @param principal 本金
   * @param rate 每期利率（小数形式）
   * @param periods 期数
   * @param additionalContribution 每期追加投资（期末投入）
   * @returns 终值
   */
  compoundInterest: (
    principal: number,
    rate: number,
    periods: number,
    additionalContribution: number = 0
  ): number => {
    if (principal < 0 || rate < 0 || periods < 0 || additionalContribution < 0) {
      throw new Error('参数不能为负数');
    }

    if (rate === 0) {
      // 无利息情况下，终值就是本金加上所有追加投资
      return principal + additionalContribution * periods;
    }

    const p = new Decimal(principal);
    const r = new Decimal(rate);
    const n = new Decimal(periods);
    const a = new Decimal(additionalContribution);

    // 本金部分: P * (1 + r)^n
    const principalPart = p.times(new Decimal(1).plus(r).pow(n));

    // 追加投资部分: A * [(1 + r)^n - 1] / r
    let contributionPart = new Decimal(0);
    if (!a.isZero()) {
      contributionPart = a.times(new Decimal(1).plus(r).pow(n).minus(1).dividedBy(r));
    }

    return principalPart.plus(contributionPart).toNumber();
  },

  /**
   * 计算期初复利投资终值（Annuity Due）
   * 公式: FV = P * (1 + r)^n + A * [(1 + r)^n - 1] / r * (1 + r)
   *
   * @param principal 本金
   * @param rate 每期利率
   * @param periods 期数
   * @param additionalContribution 每期追加投资（期初投入）
   * @returns 终值
   */
  annuityDue: (
    principal: number,
    rate: number,
    periods: number,
    additionalContribution: number = 0
  ): number => {
    if (principal < 0 || rate < 0 || periods < 0 || additionalContribution < 0) {
      throw new Error('参数不能为负数');
    }

    if (rate === 0) {
      // 无利息情况下，终值就是本金加上所有追加投资
      return principal + additionalContribution * periods;
    }

    const p = new Decimal(principal);
    const r = new Decimal(rate);
    const n = new Decimal(periods);
    const a = new Decimal(additionalContribution);

    // 本金部分: P * (1 + r)^n
    const principalPart = p.times(new Decimal(1).plus(r).pow(n));

    // 追加投资部分: A * [(1 + r)^n - 1] / r * (1 + r)
    let contributionPart = new Decimal(0);
    if (!a.isZero()) {
      contributionPart = a
        .times(new Decimal(1).plus(r).pow(n).minus(1).dividedBy(r))
        .times(new Decimal(1).plus(r));
    }

    return principalPart.plus(contributionPart).toNumber();
  },

  /**
   * 计算达到目标金额所需期数
   * 使用迭代法求解方程：FV = P * (1 + r)^n + A * [(1 + r)^n - 1] / r
   *
   * @param targetValue 目标金额
   * @param principal 本金
   * @param rate 每期利率（小数形式）
   * @param additionalContribution 每期追加投资（期末投入）
   * @param maxIterations 最大迭代次数
   * @returns 所需期数（可能为小数，表示期数的近似值）
   */
  periodsToReachTarget: (
    targetValue: number,
    principal: number,
    rate: number,
    additionalContribution: number = 0,
    maxIterations: number = 1000
  ): number => {
    if (targetValue <= 0 || principal < 0 || rate < 0 || additionalContribution < 0) {
      throw new Error('目标金额必须为正数，其他参数不能为负数');
    }

    // 特殊情况处理
    if (targetValue <= principal) {
      return 0; // 已经达到目标
    }

    // 无利率且无追加投资的情况
    if (rate === 0 && additionalContribution === 0) {
      throw new Error('无法达到目标金额：利率为0且无追加投资');
    }

    // 无利率但有追加投资的情况
    if (rate === 0 && additionalContribution > 0) {
      const periods = new Decimal(targetValue).minus(principal).dividedBy(additionalContribution);
      return periods.toNumber();
    }

    const p = new Decimal(principal);
    const r = new Decimal(rate);
    const fv = new Decimal(targetValue);
    const a = new Decimal(additionalContribution);

    // 使用对数公式求解（仅针对无追加投资的情况）
    if (a.isZero()) {
      // 公式：n = ln(FV/P) / ln(1+r)
      const periods = new Decimal(fv).dividedBy(p).ln().dividedBy(new Decimal(1).plus(r).ln());
      return periods.toNumber();
    }

    // 使用迭代法求解（有追加投资的情况）
    // 二分查找法
    let low = 0;
    let high = 1000; // 设置一个合理的上限
    let iterations = 0;

    while (low <= high && iterations < maxIterations) {
      iterations++;
      const mid = (low + high) / 2;
      const calculatedFV = financialMath.compoundInterest(
        principal,
        rate,
        mid,
        additionalContribution
      );

      if (Math.abs(calculatedFV - targetValue) < 0.01) {
        return mid;
      }

      if (calculatedFV < targetValue) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return (low + high) / 2; // 返回近似值
  },

  /**
   * 计算达到目标金额所需利率
   * 使用迭代法求解方程：FV = P * (1 + r)^n + A * [(1 + r)^n - 1] / r
   *
   * @param targetValue 目标金额
   * @param principal 本金
   * @param periods 期数
   * @param additionalContribution 每期追加投资（期末投入）
   * @param maxIterations 最大迭代次数
   * @returns 所需利率（小数形式）
   */
  rateToReachTarget: (
    targetValue: number,
    principal: number,
    periods: number,
    additionalContribution: number = 0,
    maxIterations: number = 1000
  ): number => {
    if (targetValue <= 0 || principal < 0 || periods <= 0 || additionalContribution < 0) {
      throw new Error('目标金额和期数必须为正数，其他参数不能为负数');
    }

    // 特殊情况处理
    if (targetValue <= principal) {
      return 0; // 已经达到目标
    }

    // 无追加投资且本金等于目标值的情况
    if (additionalContribution === 0 && targetValue === principal) {
      return 0;
    }

    // 无追加投资的情况
    if (additionalContribution === 0) {
      // 公式：r = (FV/P)^(1/n) - 1
      const rate = new Decimal(targetValue)
        .dividedBy(principal)
        .pow(new Decimal(1).dividedBy(periods))
        .minus(1);
      return rate.toNumber();
    }

    // 使用二分查找法迭代求解
    let low = 0;
    let high = 1; // 初始假设利率在0-100%之间
    let iterations = 0;

    while (low <= high && iterations < maxIterations) {
      iterations++;
      const mid = (low + high) / 2;
      const calculatedFV = financialMath.compoundInterest(
        principal,
        mid,
        periods,
        additionalContribution
      );

      if (Math.abs(calculatedFV - targetValue) < 0.01) {
        return mid;
      }

      if (calculatedFV < targetValue) {
        low = mid;
      } else {
        high = mid;
      }

      // 如果高边界太小，扩大搜索范围
      if (high === 1 && calculatedFV < targetValue) {
        high = high * 2;
      }
    }

    return (low + high) / 2; // 返回近似值
  },

  /**
   * 计算等额本息月供（贷款每月还款额）
   * @param principal 贷款本金
   * @param annualRate 年利率（小数形式）
   * @param months 贷款期限（月数）
   * @returns 月供金额
   */
  mortgagePayment: (principal: number, annualRate: number, months: number): number => {
    if (principal <= 0 || months <= 0) {
      throw new Error('贷款本金和期限必须为正数');
    }

    // 月利率
    const monthlyRate = new Decimal(annualRate).dividedBy(12);

    // 无利息情况
    if (monthlyRate.isZero()) {
      return new Decimal(principal).dividedBy(months).toNumber();
    }

    // 使用等额本息公式: P * r * (1 + r)^n / [(1 + r)^n - 1]
    const p = new Decimal(principal);
    const r = monthlyRate;
    const n = new Decimal(months);

    const onePlusR = new Decimal(1).plus(r);
    const onePlusRPowN = onePlusR.pow(n);

    const numerator = p.times(r).times(onePlusRPowN);
    const denominator = onePlusRPowN.minus(1);

    return numerator.dividedBy(denominator).toNumber();
  },

  /**
   * 计算净现值（NPV）
   * @param initialInvestment 初始投资额（负数表示投资支出）
   * @param cashFlows 现金流数组
   * @param rate 折现率（小数形式）
   * @returns 净现值
   */
  npv: (initialInvestment: number, cashFlows: number[], rate: number): number => {
    if (rate <= -1) {
      throw new Error('折现率必须大于-1');
    }

    let npv = new Decimal(initialInvestment);
    const r = new Decimal(rate);

    for (let i = 0; i < cashFlows.length; i++) {
      const period = new Decimal(i + 1);
      const cashFlow = new Decimal(cashFlows[i]);

      // 现值因子: 1 / (1 + r)^t
      const discountFactor = new Decimal(1).dividedBy(new Decimal(1).plus(r).pow(period));

      // 累加折现后的现金流
      npv = npv.plus(cashFlow.times(discountFactor));
    }

    return npv.toNumber();
  },

  /**
   * 计算年金现值
   * @param payment 定期支付金额
   * @param rate 利率（小数形式）
   * @param periods 期数
   * @param isBeginning 是否在期初支付（默认为false，表示期末支付）
   * @returns 年金现值
   */
  presentValueOfAnnuity: (
    payment: number,
    rate: number,
    periods: number,
    isBeginning: boolean = false
  ): number => {
    if (rate < 0 || periods < 0) {
      throw new Error('利率和期数不能为负');
    }

    const pmt = new Decimal(payment);
    const r = new Decimal(rate);
    const n = new Decimal(periods);

    // 处理利率为0的特殊情况
    if (r.isZero()) {
      return pmt.times(n).toNumber();
    }

    // 期末支付的年金现值: PMT * [(1 - (1 + r)^(-n)) / r]
    const pvoa = pmt.times(
      new Decimal(1).minus(new Decimal(1).plus(r).pow(n.negated())).dividedBy(r)
    );

    // 期初支付需要额外乘以(1+r)
    return isBeginning ? pvoa.times(new Decimal(1).plus(r)).toNumber() : pvoa.toNumber();
  },

  /**
   * 计算终值系数 (Future Value Factor)
   * @param rate 利率（小数形式）
   * @param periods 期数
   * @returns 终值系数
   */
  futureValueFactor: (rate: number, periods: number): number => {
    if (periods < 0) {
      throw new Error('期数不能为负');
    }
    return new Decimal(1).plus(new Decimal(rate)).pow(new Decimal(periods)).toNumber();
  },

  /**
   * 等额本金每期还款额计算
   * @param principal 贷款本金
   * @param annualRate 年利率（小数形式）
   * @param totalMonths 总期数（月）
   * @param currentMonth 当前期数（从1开始）
   * @returns 当前期的还款额
   */
  equalPrincipalPayment: (
    principal: number,
    annualRate: number,
    totalMonths: number,
    currentMonth: number
  ): number => {
    if (principal <= 0 || totalMonths <= 0 || currentMonth <= 0 || currentMonth > totalMonths) {
      throw new Error('参数不合法');
    }

    // 月利率
    const monthlyRate = new Decimal(annualRate).dividedBy(12);

    // 每月本金
    const monthlyPrincipal = new Decimal(principal).dividedBy(totalMonths);

    // 剩余本金
    const remainingPrincipal = new Decimal(principal)
      .times(new Decimal(totalMonths).minus(currentMonth).plus(1))
      .dividedBy(totalMonths);

    // 利息 = 剩余本金 * 月利率
    const interest = remainingPrincipal.times(monthlyRate);

    // 月供 = 每月本金 + 利息
    return monthlyPrincipal.plus(interest).toNumber();
  },

  /**
   * 计算考虑通货膨胀后的实际终值
   * 使用公式：实际终值 = 名义终值 / (1 + i)^n
   *
   * @param nominalValue 名义终值（未考虑通货膨胀）
   * @param inflationRate 通货膨胀率（小数形式）
   * @param periods 期数
   * @returns 实际终值（考虑通货膨胀后的购买力）
   */
  realValueWithInflation: (
    nominalValue: number,
    inflationRate: number,
    periods: number
  ): number => {
    if (nominalValue < 0 || inflationRate < 0 || periods < 0) {
      throw new Error('参数不能为负数');
    }

    if (inflationRate === 0) {
      return nominalValue;
    }

    const nominal = new Decimal(nominalValue);
    const inflation = new Decimal(1).plus(new Decimal(inflationRate)).pow(new Decimal(periods));

    return nominal.dividedBy(inflation).toNumber();
  },

  /**
   * 计算通货膨胀调整后的实际收益率
   * 使用Fisher方程：(1 + r) = (1 + n) / (1 + i) - 1
   * 其中r是实际收益率，n是名义收益率，i是通货膨胀率
   *
   * @param nominalRate 名义收益率（小数形式）
   * @param inflationRate 通货膨胀率（小数形式）
   * @returns 实际收益率（小数形式）
   */
  realRateOfReturn: (nominalRate: number, inflationRate: number): number => {
    if (nominalRate < 0 || inflationRate < 0) {
      throw new Error('收益率和通货膨胀率不能为负数');
    }

    if (inflationRate === 0) {
      return nominalRate;
    }

    const nominal = new Decimal(1).plus(new Decimal(nominalRate));
    const inflation = new Decimal(1).plus(new Decimal(inflationRate));

    return nominal.dividedBy(inflation).minus(1).toNumber();
  },

  /**
   * 计算考虑通货膨胀的复利投资终值
   * 同时计算名义终值和实际终值（考虑通货膨胀）
   *
   * @param principal 本金
   * @param rate 名义利率（小数形式）
   * @param inflationRate 通货膨胀率（小数形式）
   * @param periods 期数
   * @param additionalContribution 每期追加投资（期末投入）
   * @returns {nominal: number, real: number} 包含名义终值和实际终值的对象
   */
  inflationAdjustedCompoundInterest: (
    principal: number,
    rate: number,
    inflationRate: number,
    periods: number,
    additionalContribution: number = 0
  ): { nominal: number; real: number } => {
    if (
      principal < 0 ||
      rate < 0 ||
      inflationRate < 0 ||
      periods < 0 ||
      additionalContribution < 0
    ) {
      throw new Error('参数不能为负数');
    }

    // 计算名义终值
    const nominalValue = financialMath.compoundInterest(
      principal,
      rate,
      periods,
      additionalContribution
    );

    // 计算实际终值（考虑通货膨胀）
    const realValue = financialMath.realValueWithInflation(nominalValue, inflationRate, periods);

    return {
      nominal: nominalValue,
      real: realValue,
    };
  },
};
