'use client';

import { Button, Card, Form, FormInstance } from 'antd';
import React, { useEffect } from 'react';
import { CalculationMode } from '../../types/calculation-types';
import { FormValues } from '../../types/form-types';
import { formatMoney, formatPercent, parseMoney, parsePercent } from '../../utils';
import BasicParameters from './BasicParameters';
import CalculationModeSelector from './CalculationModeSelector';

interface CalculatorFormProps {
  calculationMode: CalculationMode;
  setCalculationMode: (mode: CalculationMode) => void;
  handleCalculate: (values: FormValues, form?: FormInstance) => void;
  isCalculating: boolean;
  onValuesChange?: (changedValues: FormValues, allValues: FormValues) => void;
}

/**
 * 计算器表单组件
 * 整合计算模式选择器、基本参数输入和公式展示
 */
const CalculatorForm: React.FC<CalculatorFormProps> = ({
  calculationMode,
  setCalculationMode,
  handleCalculate,
  isCalculating,
  onValuesChange,
}) => {
  const [form] = Form.useForm();

  // 当计算模式变更时，重置表单
  useEffect(() => {
    form.resetFields();
  }, [calculationMode, form]);

  // 提交表单
  const onFinish = (values: FormValues) => {
    handleCalculate(values, form);
  };

  return (
    <Card title="复利计算器" className="mb-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        initialValues={{
          principal: 10000,
          futureValueInput: 20000,
          annualRate: 5,
          periods: 5,
          periodUnit: 'years',
          additionalContribution: 0,
        }}
      >
        {/* 计算模式选择器 */}
        <CalculationModeSelector
          calculationMode={calculationMode}
          setCalculationMode={setCalculationMode}
        />
        {/* 基本参数输入 */}
        <BasicParameters
          calculationMode={calculationMode}
          formatMoney={formatMoney}
          parseMoney={parseMoney}
          formatPercent={formatPercent}
          parsePercent={parsePercent}
        />
        {/* 计算按钮 */}
        <div className="flex justify-center mt-6">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isCalculating}
            style={{ minWidth: '150px' }}
          >
            {isCalculating ? '计算中...' : '开始计算'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CalculatorForm;
