'use client';

import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Form, InputNumber, Row, Select, Space, Tooltip } from 'antd';
import React from 'react';
import { CalculationMode } from '../../types/calculation-types';

const { Option } = Select;

interface BasicParametersProps {
  calculationMode: CalculationMode;
  formatMoney: (value: number | string | undefined) => string;
  parseMoney: (value: string | undefined) => string;
  formatPercent: (value: number | string | undefined) => string;
  parsePercent: (value: string | undefined) => string;
}

/**
 * 基本参数组件
 * 处理复利计算器中的基本参数输入，如本金、利率、期数等
 */
const BasicParameters: React.FC<BasicParametersProps> = ({
  calculationMode,
  formatMoney,
  parseMoney,
  formatPercent,
  parsePercent,
}) => {
  return (
    <Row gutter={[32, 24]}>
      {/* 本金输入 */}
      {calculationMode !== 'principal' && (
        <Col xs={24} sm={24} md={12} lg={calculationMode === 'futureValue' ? 12 : 6}>
          <Form.Item
            name="principal"
            label={
              <Space>
                <span className="text-base font-medium">初始本金</span>
                <Tooltip title="您最初投入的资金金额">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: '请输入初始本金' }]}
            extra="这是您一开始投入的资金总额"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={formatMoney}
              parser={parseMoney}
              placeholder="请输入初始本金"
              size="large"
            />
          </Form.Item>
        </Col>
      )}

      {/* 期望终值输入 */}
      {(calculationMode === 'principal' ||
        calculationMode === 'periods' ||
        calculationMode === 'rate') && (
        <Col xs={24} sm={24} md={12} lg={6}>
          <Form.Item
            name="futureValueInput"
            label={
              <Space>
                <span className="text-base font-medium">目标金额</span>
                <Tooltip title="您希望最终达到的资金总额">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: '请输入目标金额' }]}
            extra="这是您希望通过投资最终获得的金额"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={formatMoney}
              parser={parseMoney}
              placeholder="请输入目标金额"
              size="large"
            />
          </Form.Item>
        </Col>
      )}

      {/* 年利率输入 */}
      {calculationMode !== 'rate' && (
        <Col xs={24} sm={24} md={12} lg={6}>
          <Form.Item
            name="annualRate"
            label={
              <Space>
                <span className="text-base font-medium">年利率 (%)</span>
                <Tooltip title="年化收益率，如5%表示每年收益5%">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: '请输入年利率' }]}
            extra="这是您每年的预期收益率百分比"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={100}
              formatter={formatPercent}
              parser={parsePercent}
              placeholder="请输入年利率"
              size="large"
            />
          </Form.Item>
        </Col>
      )}

      {/* 通货膨胀率输入 */}
      {calculationMode === 'inflation' && (
        <Col xs={24} sm={24} md={12} lg={6}>
          <Form.Item
            name="inflationRate"
            label={
              <Space>
                <span className="text-base font-medium">通货膨胀率 (%)</span>
                <Tooltip title="年度通货膨胀率，如3%表示每年物价上涨3%">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: '请输入通货膨胀率' }]}
            extra="这是您预期的年度通货膨胀率百分比"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={20}
              formatter={formatPercent}
              parser={parsePercent}
              placeholder="请输入通货膨胀率"
              size="large"
            />
          </Form.Item>
        </Col>
      )}

      {/* 期数输入 */}
      {calculationMode !== 'periods' && (
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item
            name="periods"
            label={
              <Space>
                <span className="text-base font-medium">投资期数</span>
                <Tooltip title="投资的总期数，与下方单位结合使用">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true, message: '请输入投资期数' }]}
            extra="投资的时间长度，如5年、10个月等"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              precision={0}
              placeholder="请输入投资期数"
              size="large"
            />
          </Form.Item>
        </Col>
      )}

      {/* 期数单位选择 */}
      <Col xs={24} sm={12} md={calculationMode === 'periods' ? 12 : 6} lg={6}>
        <Form.Item
          name="periodUnit"
          label={
            <Space>
              <span className="text-base font-medium">时间单位</span>
              <Tooltip title="投资期数的计量单位，影响复利计算的频率">
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          }
          rules={[{ required: true, message: '请选择时间单位' }]}
          extra="选择计息周期，如按年、按月等计算复利"
        >
          <Select placeholder="请选择时间单位" size="large">
            <Option value="years">
              <Space>
                按年计算
                <Tooltip title="每年计算一次复利，适合长期投资">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            </Option>
            <Option value="halfYears">
              <Space>
                按半年计算
                <Tooltip title="每半年计算一次复利，收益略高于按年">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            </Option>
            <Option value="quarters">
              <Space>
                按季度计算
                <Tooltip title="每季度计算一次复利，适合季度分红产品">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            </Option>
            <Option value="months">
              <Space>
                按月计算
                <Tooltip title="每月计算一次复利，适合月收益产品">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            </Option>
            <Option value="weeks">
              <Space>
                按周计算
                <Tooltip title="每周计算一次复利，适合短期高频投资">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            </Option>
            <Option value="days">
              <Space>
                按日计算
                <Tooltip title="每日计算一次复利，适合货币基金等产品">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            </Option>
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24}>
        <Divider orientation="left">
          <Space>
            <InfoCircleOutlined />
            <span>额外设置（可选）</span>
          </Space>
        </Divider>
      </Col>

      {/* 每期追加投资 */}
      <Col xs={24} sm={24} md={12} lg={8}>
        <Form.Item
          name="additionalContribution"
          label={
            <Space>
              <span className="text-base font-medium">定期追加投资</span>
              <Tooltip title="每个周期额外投入的金额，如每月定投">
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          }
          extra="每个周期（年/月等）额外投入的金额，如每月定投500元"
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            formatter={formatMoney}
            parser={parseMoney}
            placeholder="请输入定期追加金额（可选）"
            size="large"
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default BasicParameters;
