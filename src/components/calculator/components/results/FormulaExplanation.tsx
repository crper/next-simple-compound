'use client';

import { Collapse, Typography } from 'antd';
import React from 'react';
import { formulaExplanations } from '../../constants';
import { CalculationMode } from '../../types/calculation-types';

const { Paragraph, Text } = Typography;

interface FormulaExplanationProps {
  calculationMode: CalculationMode;
}

/**
 * 公式说明组件
 * 显示当前计算模式的公式及其说明
 */
const FormulaExplanation: React.FC<FormulaExplanationProps> = ({ calculationMode }) => {
  // 获取当前计算模式的公式说明
  const formula = formulaExplanations[calculationMode];

  // 确保 formula 存在
  if (!formula) {
    return <div className="text-red-500">该计算模式暂无公式说明</div>;
  }

  // 定义 Collapse 的 items
  const collapseItems = [
    {
      key: '1',
      label: (
        <Text strong className="text-blue-600 dark:text-blue-400">
          基本公式（不含定期追加投资）
        </Text>
      ),
      children: (
        <>
          <div className="formula-box p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4 shadow-inner text-center">
            <div className="text-lg font-mono">{formula.simpleFormula}</div>
          </div>

          <Paragraph className="mt-3">
            <Text strong className="text-base">
              示例：
            </Text>
            {formula.simpleExample.scenario}
          </Paragraph>
          <Paragraph className="pl-4 py-2 bg-gray-50 dark:bg-gray-800 rounded">
            <Text code className="text-base">
              {formula.simpleExample.calculation}
            </Text>
          </Paragraph>
          <Paragraph className="pl-4">
            <Text type="success" strong className="text-base">
              结果：{formula.simpleExample.result}
            </Text>
          </Paragraph>
        </>
      ),
      className: 'border-0',
    },
    {
      key: '2',
      label: (
        <Text strong className="text-blue-600 dark:text-blue-400">
          含定期追加投资的公式
        </Text>
      ),
      children: (
        <>
          <div className="formula-box p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4 shadow-inner text-center">
            <div className="text-lg font-mono">{formula.withContributionFormula}</div>
          </div>

          {formula.withContributionExample ? (
            <>
              <Paragraph className="mt-3">
                <Text strong className="text-base">
                  示例：
                </Text>
                {formula.withContributionExample.scenario}
              </Paragraph>
              <Paragraph className="pl-4 py-2 bg-gray-50 dark:bg-gray-800 rounded">
                <Text code className="text-base">
                  {formula.withContributionExample.calculation}
                </Text>
              </Paragraph>
              <Paragraph className="pl-4">
                <Text type="success" strong className="text-base">
                  结果：{formula.withContributionExample.result}
                </Text>
              </Paragraph>
            </>
          ) : (
            <Paragraph className="italic text-gray-600 dark:text-gray-400">
              {'含定期追加投资的计算较为复杂，使用数值方法求解。'}
            </Paragraph>
          )}
        </>
      ),
      className: 'border-0',
    },
    {
      key: '3',
      label: (
        <Text strong className="text-blue-600 dark:text-blue-400">
          参数说明
        </Text>
      ),
      children: (
        <div className="parameters-list p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {formula.parameters.map((param, index) => (
            <div
              key={index}
              className="parameter-item mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <Text strong className="text-base mr-2">
                {param.symbol}
              </Text>
              -<Text className="font-medium mx-1">{param.name}：</Text>
              <Text type="secondary" className="block mt-1 pl-4">
                {param.description}
              </Text>
            </div>
          ))}
        </div>
      ),
      className: 'border-0',
    },
  ];

  return (
    <div className="w-full">
      <Collapse
        defaultActiveKey={['1']}
        ghost
        className="bg-white dark:bg-gray-900 rounded-lg"
        items={collapseItems}
      />

      {formula.notes && (
        <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="notes-section">{formula.notes}</div>
        </div>
      )}
    </div>
  );
};

export default FormulaExplanation;
