/**
 * 统计学计算模块
 * 包含平均值、方差、标准差、相关系数等统计学计算
 */

import Decimal from 'decimal.js';

/**
 * 统计计算工具
 */
export const statisticsMath = {
  /**
   * 计算平均值
   * @param values 数值数组
   * @returns 平均值
   */
  mean: (values: number[]): number => {
    if (values.length === 0) {
      throw new Error('数组不能为空');
    }

    let sum = new Decimal(0);
    for (const value of values) {
      sum = sum.plus(new Decimal(value));
    }

    return sum.dividedBy(values.length).toNumber();
  },

  /**
   * 计算方差
   * @param values 数值数组
   * @param isSample 是否为样本方差（默认为true）
   * @returns 方差
   */
  variance: (values: number[], isSample: boolean = true): number => {
    if (values.length <= (isSample ? 1 : 0)) {
      throw new Error(isSample ? '样本方差需要至少2个数据点' : '总体方差需要至少1个数据点');
    }

    const mean = statisticsMath.mean(values);
    let sumSquaredDiffs = new Decimal(0);

    for (const value of values) {
      const diff = new Decimal(value).minus(mean);
      sumSquaredDiffs = sumSquaredDiffs.plus(diff.pow(2));
    }

    const divisor = isSample ? values.length - 1 : values.length;
    return sumSquaredDiffs.dividedBy(divisor).toNumber();
  },

  /**
   * 计算标准差
   * @param values 数值数组
   * @param isSample 是否为样本标准差（默认为true）
   * @returns 标准差
   */
  standardDeviation: (values: number[], isSample: boolean = true): number => {
    return Math.sqrt(statisticsMath.variance(values, isSample));
  },

  /**
   * 计算中位数
   * @param values 数值数组
   * @returns 中位数
   */
  median: (values: number[]): number => {
    if (values.length === 0) {
      throw new Error('数组不能为空');
    }

    // 复制并排序数组
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      // 偶数个元素，取中间两个的平均值
      return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
      // 奇数个元素，直接返回中间值
      return sorted[middle];
    }
  },

  /**
   * 计算百分位数
   * @param values 数值数组
   * @param percentile 百分位（0-100）
   * @returns 指定百分位数的值
   */
  percentile: (values: number[], percentile: number): number => {
    if (values.length === 0) {
      throw new Error('数组不能为空');
    }

    if (percentile < 0 || percentile > 100) {
      throw new Error('百分位必须在0到100之间');
    }

    // 复制并排序数组
    const sorted = [...values].sort((a, b) => a - b);

    if (percentile === 0) return sorted[0];
    if (percentile === 100) return sorted[sorted.length - 1];

    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) return sorted[lower];

    // 线性插值
    const fraction = index - lower;
    return sorted[lower] * (1 - fraction) + sorted[upper] * fraction;
  },

  /**
   * 计算协方差
   * @param x 第一个数值数组
   * @param y 第二个数值数组
   * @param isSample 是否为样本协方差（默认为true）
   * @returns 协方差
   */
  covariance: (x: number[], y: number[], isSample: boolean = true): number => {
    if (x.length !== y.length) {
      throw new Error('两个数组长度必须相同');
    }

    if (x.length <= (isSample ? 1 : 0)) {
      throw new Error(isSample ? '样本协方差需要至少2个数据点' : '总体协方差需要至少1个数据点');
    }

    const meanX = statisticsMath.mean(x);
    const meanY = statisticsMath.mean(y);

    let sum = new Decimal(0);
    for (let i = 0; i < x.length; i++) {
      const diffX = new Decimal(x[i]).minus(meanX);
      const diffY = new Decimal(y[i]).minus(meanY);
      sum = sum.plus(diffX.times(diffY));
    }

    const divisor = isSample ? x.length - 1 : x.length;
    return sum.dividedBy(divisor).toNumber();
  },

  /**
   * 计算相关系数
   * @param x 第一个数值数组
   * @param y 第二个数值数组
   * @returns 相关系数
   */
  correlation: (x: number[], y: number[]): number => {
    const covariance = statisticsMath.covariance(x, y);
    const stdDevX = statisticsMath.standardDeviation(x);
    const stdDevY = statisticsMath.standardDeviation(y);

    return covariance / (stdDevX * stdDevY);
  },

  /**
   * 计算加权平均数
   * @param values 数值数组
   * @param weights 权重数组
   * @returns 加权平均数
   */
  weightedMean: (values: number[], weights: number[]): number => {
    if (values.length === 0 || weights.length === 0) {
      throw new Error('数组不能为空');
    }

    if (values.length !== weights.length) {
      throw new Error('值数组和权重数组长度必须相同');
    }

    let sum = new Decimal(0);
    let weightSum = new Decimal(0);

    for (let i = 0; i < values.length; i++) {
      const value = new Decimal(values[i]);
      const weight = new Decimal(weights[i]);

      if (weight.isNegative()) {
        throw new Error('权重不能为负数');
      }

      sum = sum.plus(value.times(weight));
      weightSum = weightSum.plus(weight);
    }

    if (weightSum.isZero()) {
      throw new Error('权重总和不能为零');
    }

    return sum.dividedBy(weightSum).toNumber();
  },
};
