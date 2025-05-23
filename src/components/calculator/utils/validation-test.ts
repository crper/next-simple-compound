/**
 * 验证逻辑测试
 * 用于验证修复后的必填字段逻辑是否正确
 */

import { CalculationMode } from '../types/calculation-types';
import { FormValues } from '../types/form-types';
import { areRequiredFieldsFilled, getRequiredFields } from './validation';

// 测试数据
const testFormValues: FormValues = {
  principal: 10000,
  annualRate: 5,
  periods: 10,
  periodUnit: 'years',
  additionalContribution: 1000,
  futureValueInput: 50000,
  inflationRate: 2,
};

// 测试函数
export const testValidationLogic = () => {
  console.log('🧪 开始测试验证逻辑...');

  // 测试各个计算模式的必填字段
  const modes: CalculationMode[] = ['futureValue', 'principal', 'periods', 'rate', 'inflation'];

  modes.forEach(mode => {
    console.log(`\n📋 测试模式: ${mode}`);

    const requiredFields = getRequiredFields(mode);
    console.log(`必填字段: ${requiredFields.join(', ')}`);

    const isValid = areRequiredFieldsFilled(testFormValues, mode);
    console.log(`验证结果: ${isValid ? '✅ 通过' : '❌ 失败'}`);

    // 测试缺少字段的情况
    const incompleteValues = { ...testFormValues };
    if (requiredFields.length > 0) {
      delete incompleteValues[requiredFields[0]];
      const isIncompleteValid = areRequiredFieldsFilled(incompleteValues, mode);
      console.log(
        `缺少 ${requiredFields[0]} 时: ${isIncompleteValid ? '❌ 意外通过' : '✅ 正确失败'}`
      );
    }
  });

  console.log('\n🎉 验证逻辑测试完成！');
};

// 如果在浏览器环境中，自动运行测试
if (typeof window !== 'undefined') {
  testValidationLogic();
}
