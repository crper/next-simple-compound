/**
 * @file 表单验证工具函数
 * @description 统一处理计算器表单的验证逻辑
 */

import { CalculationMode } from '../types/calculation-types';
import { FormValues } from '../types/form-types';

/**
 * 获取不同计算模式下的必填字段
 * @param mode 计算模式
 * @returns 必填字段数组
 */
export const getRequiredFields = (mode: CalculationMode): (keyof FormValues)[] => {
  const baseFields: (keyof FormValues)[] = ['periodUnit'];

  switch (mode) {
    case 'futureValue':
      // 计算终值：需要本金、利率、期数
      return [...baseFields, 'principal', 'annualRate', 'periods'];
    case 'principal':
      // 计算本金：需要目标金额、利率、期数
      return [...baseFields, 'futureValueInput', 'annualRate', 'periods'];
    case 'periods':
      // 计算期数：需要本金、目标金额、利率
      return [...baseFields, 'principal', 'futureValueInput', 'annualRate'];
    case 'rate':
      // 计算利率：需要本金、目标金额、期数
      return [...baseFields, 'principal', 'futureValueInput', 'periods'];
    case 'inflation':
      // 通胀模式：需要本金、利率、期数、通胀率
      return [...baseFields, 'principal', 'annualRate', 'periods', 'inflationRate'];
    default:
      return baseFields;
  }
};

/**
 * 检查表单必填字段是否都已填写
 * @param formValues 表单值
 * @param mode 计算模式
 * @returns 是否所有必填字段都已填写
 */
export const areRequiredFieldsFilled = (formValues: FormValues, mode: CalculationMode): boolean => {
  const requiredFields = getRequiredFields(mode);

  return requiredFields.every(field => {
    const value = formValues[field];
    return value !== undefined && value !== null && String(value).trim() !== '';
  });
};

/**
 * 验证表单数据的业务逻辑
 * @param data 表单数据
 * @param mode 计算模式
 * @returns 验证结果，如果验证通过返回true，否则返回包含错误字段和错误消息的对象
 */
export const validateFormData = (
  data: FormValues,
  mode: CalculationMode
): true | { field: keyof FormValues; message: string } => {
  // 基础数值验证
  if (mode === 'futureValue' && (!data.principal || parseFloat(String(data.principal)) <= 0)) {
    return { field: 'principal', message: '计算终值时本金必须大于0' };
  }

  if (
    (mode === 'principal' || mode === 'periods' || mode === 'rate') &&
    (!data.futureValueInput || parseFloat(String(data.futureValueInput)) <= 0)
  ) {
    return { field: 'futureValueInput', message: '期望终值必须大于0' };
  }

  // 期数计算特殊验证
  if (mode === 'periods') {
    const principal = parseFloat(String(data.principal || 0));
    const futureValue = parseFloat(String(data.futureValueInput || 0));
    const additionalContribution = parseFloat(String(data.additionalContribution || 0));

    if (principal <= 0) {
      return { field: 'principal', message: '计算期数时本金必须大于0' };
    }

    if (futureValue <= principal && additionalContribution <= 0) {
      return { field: 'futureValueInput', message: '期望终值必须大于本金，或设置追加投资' };
    }
  }

  // 利率计算特殊验证
  if (mode === 'rate') {
    const principal = parseFloat(String(data.principal || 0));
    const futureValue = parseFloat(String(data.futureValueInput || 0));
    const additionalContribution = parseFloat(String(data.additionalContribution || 0));

    if (principal <= 0) {
      return { field: 'principal', message: '计算利率时本金必须大于0' };
    }

    if (futureValue <= principal && additionalContribution <= 0) {
      return {
        field: 'futureValueInput',
        message: '计算利率时期望终值必须大于本金，或设置追加投资',
      };
    }
  }

  // 通胀模式验证
  if (mode === 'inflation') {
    if (!data.principal || parseFloat(String(data.principal)) <= 0) {
      return { field: 'principal', message: '本金必须大于0' };
    }

    if (data.inflationRate !== undefined && parseFloat(String(data.inflationRate)) < 0) {
      return { field: 'inflationRate', message: '通货膨胀率不能为负' };
    }
  }

  return true;
};
