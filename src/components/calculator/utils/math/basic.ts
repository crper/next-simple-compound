/**
 * 基础数学运算
 * 使用 Decimal.js 实现高精度计算，避免浮点数精度问题
 */

import Decimal from 'decimal.js';

/**
 * 基础数学运算工具
 */
export const basicMath = {
  /**
   * 精确加法
   * @param a 第一个数
   * @param b 第二个数
   * @returns 计算结果
   */
  add: (a: number, b: number): number => {
    return new Decimal(a).plus(new Decimal(b)).toNumber();
  },

  /**
   * 精确减法
   * @param a 第一个数
   * @param b 第二个数
   * @returns 计算结果
   */
  subtract: (a: number, b: number): number => {
    return new Decimal(a).minus(new Decimal(b)).toNumber();
  },

  /**
   * 精确乘法
   * @param a 第一个数
   * @param b 第二个数
   * @returns 计算结果
   */
  multiply: (a: number, b: number): number => {
    return new Decimal(a).times(new Decimal(b)).toNumber();
  },

  /**
   * 精确除法
   * @param a 第一个数
   * @param b 第二个数
   * @returns 计算结果
   */
  divide: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('除数不能为零');
    }
    return new Decimal(a).dividedBy(new Decimal(b)).toNumber();
  },

  /**
   * 精确幂运算
   * @param base 底数
   * @param exponent 指数
   * @returns 计算结果
   */
  pow: (base: number, exponent: number): number => {
    return new Decimal(base).pow(new Decimal(exponent)).toNumber();
  },

  /**
   * 精确四舍五入
   * @param value 要四舍五入的数
   * @param decimalPlaces 小数位数
   * @returns 计算结果
   */
  round: (value: number, decimalPlaces: number = 2): number => {
    return new Decimal(value).toDecimalPlaces(decimalPlaces).toNumber();
  },

  /**
   * 精确绝对值
   * @param x 数值
   * @returns 绝对值
   */
  abs: (x: number): number => {
    return new Decimal(x).abs().toNumber();
  },

  /**
   * 精确取余运算
   * @param a 被除数
   * @param b 除数
   * @returns 余数
   */
  mod: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('除数不能为零');
    }
    return new Decimal(a).mod(new Decimal(b)).toNumber();
  },

  /**
   * 精确最大值
   * @param values 一组数值
   * @returns 最大值
   */
  max: (...values: number[]): number => {
    if (values.length === 0) {
      throw new Error('参数不能为空');
    }
    let max = new Decimal(values[0]);
    for (let i = 1; i < values.length; i++) {
      const current = new Decimal(values[i]);
      if (current.greaterThan(max)) {
        max = current;
      }
    }
    return max.toNumber();
  },

  /**
   * 精确最小值
   * @param values 一组数值
   * @returns 最小值
   */
  min: (...values: number[]): number => {
    if (values.length === 0) {
      throw new Error('参数不能为空');
    }
    let min = new Decimal(values[0]);
    for (let i = 1; i < values.length; i++) {
      const current = new Decimal(values[i]);
      if (current.lessThan(min)) {
        min = current;
      }
    }
    return min.toNumber();
  },
};
