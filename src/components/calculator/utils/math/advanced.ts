/**
 * 高级数学函数
 * 包含对数、指数、三角函数等高级运算
 */

import Decimal from 'decimal.js';

/**
 * 高级数学运算工具
 */
export const advancedMath = {
  /**
   * 精确指数函数
   * @param x 指数值
   * @returns 计算结果 e^x
   */
  exp: (x: number): number => {
    return new Decimal(x).exp().toNumber();
  },

  /**
   * 精确对数函数
   * @param x 正数
   * @param base 对数的底，默认为自然对数
   * @returns 计算结果
   */
  log: (x: number, base?: number): number => {
    if (x <= 0) {
      throw new Error('对数函数的自变量必须为正数');
    }
    const decimalX = new Decimal(x);

    if (base === undefined) {
      // 自然对数
      return decimalX.ln().toNumber();
    } else if (base === 10) {
      // 常用对数
      return decimalX.log().toNumber();
    } else {
      // 任意底对数：log_b(x) = ln(x) / ln(b)
      return decimalX.ln().dividedBy(new Decimal(base).ln()).toNumber();
    }
  },

  /**
   * 精确平方根
   * @param x 非负数
   * @returns 计算结果
   */
  sqrt: (x: number): number => {
    if (x < 0) {
      throw new Error('平方根的自变量不能为负数');
    }
    return new Decimal(x).sqrt().toNumber();
  },

  /**
   * 精确正弦函数
   * @param x 弧度值
   * @returns 计算结果
   */
  sin: (x: number): number => {
    return Math.sin(x); // Decimal.js 不直接支持三角函数
  },

  /**
   * 精确余弦函数
   * @param x 弧度值
   * @returns 计算结果
   */
  cos: (x: number): number => {
    return Math.cos(x);
  },

  /**
   * 精确正切函数
   * @param x 弧度值
   * @returns 计算结果
   */
  tan: (x: number): number => {
    return Math.tan(x);
  },

  /**
   * 角度转弧度
   * @param degrees 角度值
   * @returns 弧度值
   */
  toRadians: (degrees: number): number => {
    return (degrees * Math.PI) / 180;
  },

  /**
   * 弧度转角度
   * @param radians 弧度值
   * @returns 角度值
   */
  toDegrees: (radians: number): number => {
    return (radians * 180) / Math.PI;
  },
};
