import {
  AreaChartOutlined,
  CalendarOutlined,
  DollarOutlined,
  PercentageOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { CalculationMode } from '../types/calculation-types';

/**
 * 计算模式选项配置
 * 使用 Ant Design Segmented 组件的原生配置
 */
export const calculationModeOptions = [
  {
    // 使用图标作为选项标签，在移动端会自动适应
    label: '计算终值',
    value: 'futureValue',
    icon: <AreaChartOutlined />,
  },
  {
    label: '计算本金',
    value: 'principal',
    icon: <DollarOutlined />,
  },
  {
    label: '计算期数',
    value: 'periods',
    icon: <CalendarOutlined />,
  },
  {
    label: '计算利率',
    value: 'rate',
    icon: <PercentageOutlined />,
  },
  {
    label: '通货膨胀',
    value: 'inflation',
    icon: <ThunderboltOutlined />,
  },
];

/**
 * 计算模式详细说明
 */
export const modeDescriptions: Record<
  CalculationMode,
  {
    title: string;
    description: string;
    example: string;
    inputs: string[];
    output: string;
  }
> = {
  futureValue: {
    title: '计算终值模式',
    description: '输入本金、年利率和投资期数，计算最终可获得的金额。',
    example: '例如：投入10,000元，年利率5%，投资5年，最终能得到多少钱？',
    inputs: ['本金', '年利率', '投资期数'],
    output: '最终金额',
  },
  principal: {
    title: '计算本金模式',
    description: '输入目标金额、年利率和投资期数，计算需要投入的初始本金。',
    example: '例如：想要在5年后获得100,000元，年利率5%，现在需要投入多少钱？',
    inputs: ['目标金额', '年利率', '投资期数'],
    output: '所需本金',
  },
  periods: {
    title: '计算期数模式',
    description: '输入本金、目标金额和年利率，计算需要投资的时间。',
    example: '例如：投入10,000元，年利率5%，要达到100,000元需要多少年？',
    inputs: ['本金', '目标金额', '年利率'],
    output: '所需时间',
  },
  rate: {
    title: '计算利率模式',
    description: '输入本金、目标金额和投资期数，计算需要达到的年利率。',
    example: '例如：投入10,000元，5年后要达到100,000元，需要什么样的年利率？',
    inputs: ['本金', '目标金额', '投资期数'],
    output: '所需年利率',
  },
  inflation: {
    title: '通货膨胀影响计算模式',
    description: '计算通货膨胀对投资终值实际购买力的影响，对比名义终值和实际终值。',
    example: '例如：投入10,000元，年利率5%，通货膨胀率3%，投资10年后的实际购买力是多少？',
    inputs: ['本金', '年利率', '通货膨胀率', '投资期数'],
    output: '名义终值和实际购买力',
  },
};
