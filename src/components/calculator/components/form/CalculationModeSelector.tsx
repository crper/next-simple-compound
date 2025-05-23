'use client';

import { useSize } from 'ahooks';
import { Alert, Card, Segmented, Tabs, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { calculationModeOptions, modeDescriptions } from '../../constants';
import { CalculationMode } from '../../types/calculation-types';
import FormulaExplanation from '../results/FormulaExplanation';

const { Text } = Typography;

interface CalculationModeSelectorProps {
  calculationMode: CalculationMode;
  setCalculationMode: (mode: CalculationMode) => void;
}

/**
 * 计算模式选择器组件
 * 用于选择计算器的工作模式（终值、本金、期数、利率）
 */
const CalculationModeSelector: React.FC<CalculationModeSelectorProps> = ({
  calculationMode,
  setCalculationMode,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);

  // 根据容器宽度判断是否为移动端视图
  const isMobile = size?.width ? size.width < 560 : false;

  // 当前模式的详细信息
  const currentModeInfo = modeDescriptions[calculationMode];

  // 定义 Tabs 的 items
  const tabItems = [
    {
      key: 'inputs',
      label: <span className="px-1">基本信息</span>,
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-3 bg-gray-50 rounded-lg">
          <div>
            <Text strong>需要输入：</Text>
            <ul className="list-disc pl-5 mt-1">
              {currentModeInfo.inputs.map((input, index) => (
                <li key={index}>{input}</li>
              ))}
            </ul>
          </div>
          <div>
            <Text strong>计算结果：</Text>
            <div className="pl-5 mt-1">
              <Text type="success">{currentModeInfo.output}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'formula',
      label: <span className="px-1">计算公式说明</span>,
      children: (
        <div className="mt-2">
          <FormulaExplanation calculationMode={calculationMode} />
        </div>
      ),
    },
  ];

  return (
    <div className="mb-6" ref={containerRef}>
      <div className="mb-4">
        <div className="text-left mb-2">
          <Text strong>计算模式选择器</Text>
        </div>
        <Segmented
          vertical={isMobile}
          size="large"
          value={calculationMode}
          onChange={value => setCalculationMode(value as CalculationMode)}
          options={calculationModeOptions}
        />
      </div>

      {/* 模式说明卡片 */}
      <Card
        size="small"
        className="mb-4"
        title={
          <div className="flex justify-between items-center">
            <span>{currentModeInfo.title}</span>
            <Text
              type="secondary"
              className="cursor-pointer hover:text-blue-500 transition-colors"
              onClick={() => setShowHelp(!showHelp)}
            >
              {showHelp ? '隐藏详情' : '查看详情'}
            </Text>
          </div>
        }
      >
        <div>
          <Text>{currentModeInfo.description}</Text>

          {showHelp && (
            <div className="mt-3">
              <Alert
                message={currentModeInfo.example}
                type="info"
                showIcon
                style={{ marginBottom: '12px' }}
              />

              <Tabs
                defaultActiveKey="inputs"
                className="mt-4"
                size="small"
                tabBarStyle={{ marginBottom: '8px' }}
                animated={{ tabPane: true }}
                type="card"
                items={tabItems}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CalculationModeSelector;
