import { Typography } from 'antd';
import React from 'react';
import { CalculationMode } from '../types/calculation-types';

const { Text } = Typography;

/**
 * 公式解释组件接口
 */
export interface FormulaExplanation {
  title: string;
  simpleFormula: React.ReactNode;
  withContributionFormula: React.ReactNode;
  parameters: Array<{
    symbol: string;
    name: string;
    description: string;
  }>;
  simpleExample: {
    scenario: string;
    calculation: string;
    result: string;
  };
  withContributionExample?: {
    scenario: string;
    calculation: string;
    result: string;
  };
  notes?: React.ReactNode; // 使用ReactNode允许更丰富的说明
}

/**
 * 各计算模式的公式解释
 */
export const formulaExplanations: Record<CalculationMode, FormulaExplanation> = {
  futureValue: {
    title: '终值计算公式',
    simpleFormula: (
      <Text strong className="text-lg">
        FV = P × (1 + r)^n
      </Text>
    ),
    withContributionFormula: (
      <Text strong className="text-lg">
        FV = P × (1 + r)^n + PMT × [(1 + r)^n - 1] / r
      </Text>
    ),
    parameters: [
      {
        symbol: 'FV',
        name: '终值（Future Value）',
        description: '最终获得的金额',
      },
      {
        symbol: 'P',
        name: '本金（Principal）',
        description: '初始投入的金额',
      },
      {
        symbol: 'r',
        name: '利率（Rate）',
        description: '每期的利率（年利率除以每年计息次数）',
      },
      {
        symbol: 'n',
        name: '期数（Number of periods）',
        description: '总投资期数',
      },
      {
        symbol: 'PMT',
        name: '定期追加投资金额（Payment）',
        description: '每期额外投入的金额（期末投入）',
      },
    ],
    simpleExample: {
      scenario: '投资10,000元，年利率5%，按年计息，投资5年',
      calculation: 'FV = 10,000 × (1 + 5%)^5 = 10,000 × 1.2763 = 12,763元',
      result: '12,763元',
    },
    withContributionExample: {
      scenario: '投资10,000元，每年额外投入1,000元，年利率5%，投资5年',
      calculation:
        'FV = 10,000 × (1 + 5%)^5 + 1,000 × [(1 + 5%)^5 - 1] / 5% = 12,763 + 1,000 × 5.526 = 18,288元',
      result: '18,288元',
    },
    notes: (
      <div>
        <p>计算说明：</p>
        <ul className="list-disc pl-5">
          <li>公式假设追加投资发生在每期末（Ordinary Annuity模式）</li>
          <li>对于期初投入的情况（Annuity Due模式），需要在公式中额外乘以(1+r)系数</li>
          <li>每期利率应与期数的时间单位保持一致（如年利率对应年数，月利率对应月数）</li>
          <li>高精度计算使用Decimal.js库进行，避免JavaScript浮点数精度问题</li>
          <li>当利率为0时，公式简化为: FV = P + PMT × n</li>
        </ul>
      </div>
    ),
  },
  principal: {
    title: '本金计算公式',
    simpleFormula: (
      <Text strong className="text-lg">
        P = FV / (1 + r)^n
      </Text>
    ),
    withContributionFormula: (
      <Text strong className="text-lg">
        P = [FV - PMT × ((1 + r)^n - 1) / r] / (1 + r)^n
      </Text>
    ),
    parameters: [
      {
        symbol: 'P',
        name: '本金（Principal）',
        description: '需要投入的初始金额',
      },
      {
        symbol: 'FV',
        name: '终值（Future Value）',
        description: '期望达到的金额',
      },
      {
        symbol: 'r',
        name: '利率（Rate）',
        description: '每期的利率',
      },
      {
        symbol: 'n',
        name: '期数（Number of periods）',
        description: '总投资期数',
      },
      {
        symbol: 'PMT',
        name: '定期追加投资金额（Payment）',
        description: '每期额外投入的金额',
      },
    ],
    simpleExample: {
      scenario: '想要5年后获得100,000元，年利率5%',
      calculation: 'P = 100,000 / (1 + 5%)^5 = 100,000 / 1.2763 = 78,351元',
      result: '78,351元',
    },
    withContributionExample: {
      scenario: '想要5年后获得100,000元，每年额外投入1,000元，年利率5%',
      calculation:
        'P = [100,000 - 1,000 × ((1 + 5%)^5 - 1) / 5%] / (1 + 5%)^5 = [100,000 - 1,000 × 5.53] / 1.2763 = 73,029元',
      result: '73,029元',
    },
    notes: (
      <div>
        <p>公式推导过程：</p>
        <ol className="list-decimal pl-5">
          <li>从终值公式开始：FV = P × (1 + r)^n + PMT × [(1 + r)^n - 1] / r</li>
          <li>移项解出P：P = [FV - PMT × ((1 + r)^n - 1) / r] / (1 + r)^n</li>
        </ol>
        <p>特殊情况处理：</p>
        <ul className="list-disc pl-5">
          <li>当利率为0时，公式简化为：P = FV - PMT × n</li>
          <li>当计算结果为负数时，表示仅依靠追加投资就能达到目标，不需要初始本金</li>
          <li>如果追加投资为0，则退化为简单公式：P = FV / (1 + r)^n</li>
        </ul>
      </div>
    ),
  },
  periods: {
    title: '期数计算公式',
    simpleFormula: (
      <Text strong className="text-lg">
        n = log(FV / P) / log(1 + r)
      </Text>
    ),
    withContributionFormula: (
      <Text strong className="text-lg">
        使用数值方法（二分法）求解方程：
        <br />P × (1 + r)^n + PMT × [(1 + r)^n - 1] / r = FV
      </Text>
    ),
    parameters: [
      {
        symbol: 'n',
        name: '期数（Number of periods）',
        description: '需要投资的期数',
      },
      {
        symbol: 'FV',
        name: '终值（Future Value）',
        description: '期望达到的金额',
      },
      {
        symbol: 'P',
        name: '本金（Principal）',
        description: '初始投入的金额',
      },
      {
        symbol: 'r',
        name: '利率（Rate）',
        description: '每期的利率',
      },
      {
        symbol: 'log',
        name: '对数函数',
        description: '对数函数，通常为自然对数或以10为底的对数',
      },
      {
        symbol: 'PMT',
        name: '定期追加投资金额（Payment）',
        description: '每期额外投入的金额',
      },
    ],
    simpleExample: {
      scenario: '投资10,000元，年利率5%，要达到20,000元',
      calculation: 'n = log(20,000 / 10,000) / log(1 + 5%) = log(2) / log(1.05) ≈ 14.2期',
      result: '约需要15年（向上取整）',
    },
    notes: (
      <div>
        <p>特殊情况处理：</p>
        <ul className="list-disc pl-5">
          <li>当利率为0时，如果有追加投资，期数 = (FV - P) / PMT</li>
          <li>当利率为0且无追加投资时，如果FV {'>'} P则无法达到目标（返回无穷大）</li>
          <li>当FV {'<='} P时，期数为0，因为已经达到或超过目标</li>
          <li>含定期追加投资时，使用二分法求解方程，算法设置最大迭代次数和收敛误差</li>
          <li>二分法查找范围为[0, 10000]期，精度为0.0001</li>
          <li>计算结果可能为小数，实际应用中通常需要向上取整为整数期数</li>
        </ul>
      </div>
    ),
  },
  rate: {
    title: '利率计算公式',
    simpleFormula: (
      <Text strong className="text-lg">
        r = (FV / P)^(1/n) - 1
      </Text>
    ),
    withContributionFormula: (
      <Text strong className="text-lg">
        使用数值方法（二分法）求解方程：
        <br />P × (1 + r)^n + PMT × [(1 + r)^n - 1] / r = FV
      </Text>
    ),
    parameters: [
      {
        symbol: 'r',
        name: '利率（Rate）',
        description: '每期需要达到的利率',
      },
      {
        symbol: 'FV',
        name: '终值（Future Value）',
        description: '期望达到的金额',
      },
      {
        symbol: 'P',
        name: '本金（Principal）',
        description: '初始投入的金额',
      },
      {
        symbol: 'n',
        name: '期数（Number of periods）',
        description: '总投资期数',
      },
      {
        symbol: 'PMT',
        name: '定期追加投资金额（Payment）',
        description: '每期额外投入的金额',
      },
    ],
    simpleExample: {
      scenario: '投资10,000元，5年后要达到15,000元',
      calculation: 'r = (15,000 / 10,000)^(1/5) - 1 = (1.5)^0.2 - 1 = 1.0845 - 1 = 0.0845 = 8.45%',
      result: '8.45%',
    },
    notes: (
      <div>
        <p>重要说明：</p>
        <ul className="list-disc pl-5">
          <li>当本金加追加投资总额已经大于或等于目标终值时，所需利率为0</li>
          <li>含定期追加投资时，利率计算使用二分法，查找范围为[0, 10]（即0%到1000%）</li>
          <li>二分法求解的精度为0.0000001，足够应对大多数金融计算需求</li>
          <li>计算结果为小数形式，通常需要乘以100转换为百分比形式显示</li>
          <li>无法求解的情况（如期数过短导致需要无限大的利率）将返回错误或NaN</li>
          <li>高精度计算使用Decimal.js库避免浮点数精度问题</li>
        </ul>
      </div>
    ),
  },
  inflation: {
    title: '通货膨胀影响计算公式',
    simpleFormula: (
      <Text strong className="text-lg">
        实际购买力 = FV / (1 + i)^n
      </Text>
    ),
    withContributionFormula: (
      <Text strong className="text-lg">
        实际购买力 = [P × (1 + r)^n + PMT × ((1 + r)^n - 1) / r] / (1 + i)^n
      </Text>
    ),
    parameters: [
      {
        symbol: 'FV',
        name: '名义终值（Future Value）',
        description: '投资最终获得的金额（不考虑通货膨胀）',
      },
      {
        symbol: 'P',
        name: '本金（Principal）',
        description: '初始投入的金额',
      },
      {
        symbol: 'r',
        name: '名义利率（Rate）',
        description: '投资的名义利率（不考虑通货膨胀）',
      },
      {
        symbol: 'i',
        name: '通货膨胀率（Inflation Rate）',
        description: '货币购买力每期的下降率',
      },
      {
        symbol: 'n',
        name: '期数（Number of periods）',
        description: '总投资期数',
      },
      {
        symbol: 'PMT',
        name: '定期追加投资金额（Payment）',
        description: '每期额外投入的金额',
      },
    ],
    simpleExample: {
      scenario: '投资10,000元，年利率5%，通货膨胀率3%，投资10年',
      calculation:
        '名义终值 = 10,000 × (1 + 5%)^10 = 16,289元\n实际购买力 = 16,289 / (1 + 3%)^10 = 12,130元',
      result: '实际购买力相当于今天的12,130元',
    },
    withContributionExample: {
      scenario: '投资10,000元，每年额外投入1,000元，年利率5%，通货膨胀率3%，投资10年',
      calculation:
        '名义终值 = 10,000 × (1 + 5%)^10 + 1,000 × ((1 + 5%)^10 - 1) / 5% = 29,544元\n实际购买力 = 29,544 / (1 + 3%)^10 = 21,997元',
      result: '实际购买力相当于今天的21,997元',
    },
    notes: (
      <div>
        <p>通货膨胀说明：</p>
        <ul className="list-disc pl-5">
          <li>通货膨胀会降低货币的实际购买力，使相同金额能购买的商品/服务减少</li>
          <li>实际利率 ≈ 名义利率 - 通货膨胀率（费雪方程的简化形式）</li>
          <li>精确的实际利率计算公式：(1 + 实际利率) = (1 + 名义利率) / (1 + 通货膨胀率)</li>
          <li>当实际利率为负（名义利率 {'<'} 通货膨胀率）时，投资的实际购买力会下降</li>
          <li>长期投资更容易受到通货膨胀的累积影响，应选择能跑赢通胀的投资方式</li>
        </ul>
      </div>
    ),
  },
};
