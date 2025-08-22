'use client';

import { CalculatorForm } from '@calculator/components/form';
import { ResultsDisplay } from '@calculator/components/results';
import { useCalculation } from '@calculator/hooks/use-calculation';
import { FormValues } from '@calculator/types/form-types';
import { areRequiredFieldsFilled } from '@calculator/utils/validation';
import { useDebounceFn } from 'ahooks';
import { FormInstance, Space } from 'antd';
import { useCallback, useRef } from 'react';

/**
 * 复合计算器组件
 * 整合表单和结果展示
 */
const CompoundCalculator = () => {
  // 使用计算hook
  const {
    calculationMode,
    setCalculationMode,
    calculationResult,
    chartData,
    handleFormSubmit,
    resetCalculation,
    isCalculating,
  } = useCalculation();

  // 图表引用
  const chartRef = useRef<HTMLDivElement>(null);

  // 处理计算模式变更
  const handleCalculationModeChange = useCallback(
    (newMode: typeof calculationMode) => {
      // 重置计算结果
      resetCalculation();
      // 设置新的计算模式
      setCalculationMode(newMode);
    },
    [resetCalculation, setCalculationMode]
  );

  // 处理表单值变化时的自动计算 - 使用防抖功能
  const { run: handleFormValuesChange, cancel: cancelAutoCalculation } = useDebounceFn(
    (changedValues: FormValues, allValues: FormValues) => {
      // 使用统一的验证工具检查必填字段
      if (areRequiredFieldsFilled(allValues, calculationMode)) {
        handleFormSubmit(allValues);
      }
    },
    {
      wait: 800, // 增加防抖时间，避免过于频繁的计算
      trailing: true, // 确保最后一次变更会被执行
      leading: false, // 不立即执行，等待用户输入完成
    }
  );

  // 处理手动计算（点击按钮） - 不使用防抖，立即执行
  const handleCalculate = useCallback(
    (formValues: FormValues, form?: FormInstance) => {
      // 取消任何待执行的自动计算
      cancelAutoCalculation();
      // 立即执行计算
      handleFormSubmit(formValues, form);
    },
    [handleFormSubmit, cancelAutoCalculation]
  );

  return (
    <div className="calculator-container w-full h-full">
      <Space direction="vertical" size={24} className="w-full h-full">
        {/* 表单部分 */}
        <CalculatorForm
          calculationMode={calculationMode}
          setCalculationMode={handleCalculationModeChange}
          handleCalculate={handleCalculate}
          isCalculating={isCalculating}
          onValuesChange={handleFormValuesChange}
        />

        {/* 结果展示部分 */}
        <ResultsDisplay
          calculationResult={calculationResult}
          chartData={chartData}
          schemes={[]}
          isCalculating={isCalculating}
          workerIsCalculating={false}
          calculationProgress={0}
          chartRef={chartRef}
        />
      </Space>
    </div>
  );
};

export default CompoundCalculator;
