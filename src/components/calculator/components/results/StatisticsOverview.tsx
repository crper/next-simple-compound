'use client';

import { ArrowDownOutlined, ArrowUpOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Divider, Progress, Statistic, Tooltip, Typography, theme } from 'antd';
import React, { useMemo } from 'react';
import { ChartDataPoint } from '../../types/chart-types';
import { formatNumber } from '../../utils';
import { calculateChartProportions } from '../../utils/chart-utils';
import { abs, divide, multiply, round, subtract } from '../../utils/math';

const { Text, Paragraph, Title } = Typography;
const { useToken } = theme;

interface StatisticsOverviewProps {
  chartData: ChartDataPoint[];
  calculationResult: {
    type: string;
    label: string;
    value: number | string;
    unit?: string;
    additionalInfo?: Record<string, string | number>;
  } | null;
}

/**
 * 统计概览组件
 * 显示计算结果的主要统计数据
 */
const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  chartData,
  calculationResult,
}) => {
  const { token } = useToken();

  // 计算关键统计数据 - 使用useMemo优化性能
  const statistics = useMemo(() => {
    if (!chartData.length) return null;

    const firstPoint = chartData[0];
    const lastPoint = chartData[chartData.length - 1];
    const { principalRatio, interestRatio, contributionRatio } =
      calculateChartProportions(chartData);

    // 计算总收益率 (精确到小数点后6位)
    const totalReturn = subtract(divide(lastPoint.value, firstPoint.value), 1);
    const totalReturnPercentage = Number.isInteger(multiply(totalReturn, 100))
      ? multiply(totalReturn, 100).toString()
      : round(multiply(totalReturn, 100), 6).toFixed(6);

    // 计算年化收益率
    const years = chartData.length > 0 ? chartData.length - 1 : 1;
    const annualizedReturn = Math.pow(1 + Number(totalReturn), 1 / years) - 1;
    const annualizedReturnPercentage = round(multiply(annualizedReturn, 100), 2).toFixed(2);

    // 计算投资回报比
    const totalInvestment = firstPoint.principal + lastPoint.contribution;
    const returnOnInvestment = round(divide(lastPoint.interest, totalInvestment) * 100, 2);

    // 平均每期增长
    const avgPeriodGrowth =
      chartData.length > 1
        ? round(divide(subtract(lastPoint.value, firstPoint.value), chartData.length - 1), 2)
        : 0;

    // 是否是通货膨胀模式
    const isInflationMode = calculationResult?.type === 'inflation';
    const inflationInfo = isInflationMode ? calculationResult?.additionalInfo : null;

    // 获取通货膨胀相关数据并进行类型转换
    const realValue = typeof inflationInfo?.realValue === 'number' ? inflationInfo.realValue : 0;
    const inflationRate =
      typeof inflationInfo?.inflationRate === 'number' ? inflationInfo.inflationRate : 0;
    const inflationImpact =
      typeof inflationInfo?.inflationImpact === 'number' ? inflationInfo.inflationImpact : 0;
    const purchasingPowerLossPercent =
      typeof inflationInfo?.purchasingPowerLossPercent === 'number'
        ? inflationInfo.purchasingPowerLossPercent
        : 0;
    const realRateOfReturn =
      typeof inflationInfo?.realRateOfReturn === 'number' ? inflationInfo.realRateOfReturn : 0;

    return {
      firstPoint,
      lastPoint,
      principalRatio,
      interestRatio,
      contributionRatio,
      totalReturn,
      totalReturnPercentage,
      annualizedReturn,
      annualizedReturnPercentage,
      totalInvestment,
      returnOnInvestment,
      avgPeriodGrowth,
      isInflationMode,
      inflationInfo: inflationInfo
        ? {
            realValue,
            inflationRate,
            inflationImpact,
            purchasingPowerLossPercent,
            realRateOfReturn,
          }
        : null,
    };
  }, [chartData, calculationResult]);

  // 如果没有统计数据，不显示
  if (!statistics) return null;

  return (
    <div className="w-full overflow-hidden">
      {/* 主要统计数据 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 主要结果 */}
        <Card
          className="text-center h-full shadow-sm hover:shadow-md transition-shadow"
          styles={{
            body: {
              padding: '16px',
              background: token.colorBgElevated,
            },
          }}
        >
          <Statistic
            title={
              <Tooltip title="当前计算模式的主要结果">
                <span className="text-lg font-bold">{calculationResult?.label || '计算结果'}</span>
              </Tooltip>
            }
            value={calculationResult?.value || 0}
            precision={6}
            suffix={calculationResult?.unit}
            valueStyle={{ color: token.colorPrimary, fontWeight: 'bold', fontSize: '24px' }}
          />
        </Card>

        {/* 总收益率 */}
        <Card
          className="text-center h-full shadow-sm hover:shadow-md transition-shadow"
          styles={{
            body: {
              padding: '16px',
              background: token.colorBgElevated,
            },
          }}
        >
          <Statistic
            title={
              <Tooltip title="投资期内的总收益率">
                <span className="text-lg">总收益率</span>
              </Tooltip>
            }
            value={statistics.totalReturnPercentage}
            precision={Number.isInteger(multiply(statistics.totalReturn, 100)) ? 0 : 6}
            valueStyle={{
              color: statistics.totalReturn >= 0 ? token.colorSuccess : token.colorError,
            }}
            prefix={statistics.totalReturn >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="%"
          />
          <Text type="secondary" className="block mt-2">
            年化：{statistics.annualizedReturnPercentage}%
          </Text>
        </Card>

        {/* 最终金额 */}
        <Card
          className="text-center h-full shadow-sm hover:shadow-md transition-shadow"
          styles={{
            body: {
              padding: '16px',
              background: token.colorBgElevated,
            },
          }}
        >
          <Statistic
            title={
              <Tooltip title="投资期结束时的总金额">
                <span className="text-lg">最终金额</span>
              </Tooltip>
            }
            value={formatNumber(statistics.lastPoint.value)}
            valueStyle={{ color: token.colorPrimary }}
            prefix="¥"
          />
          <div className="flex justify-center items-center mt-2">
            <Text type="secondary" className="text-sm">
              <Tooltip title="总投入本金">
                <span>本金总额：¥{formatNumber(statistics.totalInvestment)}</span>
              </Tooltip>
            </Text>
          </div>
        </Card>
      </div>

      {/* 核心指标 */}
      <div
        className="p-4 rounded-lg mb-6"
        style={{
          backgroundColor: token.colorFillQuaternary,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Title level={5} className="mb-3 flex items-center" style={{ color: token.colorText }}>
          <span>核心投资指标</span>
          <Tooltip title="这些指标可帮助您全面评估投资表现">
            <InfoCircleOutlined className="ml-2" style={{ color: token.colorTextTertiary }} />
          </Tooltip>
        </Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Text strong style={{ color: token.colorText }}>
              投资回报比
            </Text>
            <div
              className="text-lg sm:text-xl mt-1 font-semibold break-words"
              style={{ color: token.colorPrimary }}
            >
              {statistics.returnOnInvestment.toFixed(2)}%
            </div>
            <Text type="secondary" className="text-xs">
              利息 / 总投入资金
            </Text>
          </div>

          <div>
            <Text strong style={{ color: token.colorText }}>
              年化收益率
            </Text>
            <div
              className="text-lg sm:text-xl mt-1 font-semibold break-words"
              style={{
                color:
                  Number(statistics.annualizedReturnPercentage) >= 0
                    ? token.colorSuccess
                    : token.colorError,
              }}
            >
              {statistics.annualizedReturnPercentage}%
            </div>
            <Text type="secondary" className="text-xs">
              等同于复利年化利率
            </Text>
          </div>

          <div>
            <Text strong style={{ color: token.colorText }}>
              本息比
            </Text>
            <div
              className="text-lg sm:text-xl mt-1 font-semibold break-words"
              style={{ color: token.colorPrimary }}
            >
              1:
              {round(divide(statistics.lastPoint.interest, statistics.totalInvestment), 2).toFixed(
                2
              )}
            </div>
            <Text type="secondary" className="text-xs">
              本金与收益之比
            </Text>
          </div>

          <div>
            <Text strong style={{ color: token.colorText }}>
              平均每期增长
            </Text>
            <div
              className="text-lg sm:text-xl mt-1 font-semibold break-words"
              style={{ color: token.colorInfo }}
            >
              ¥{formatNumber(statistics.avgPeriodGrowth)}
            </div>
            <Text type="secondary" className="text-xs">
              每期平均资产增加
            </Text>
          </div>
        </div>
      </div>

      {/* 通货膨胀模式额外信息 */}
      {statistics.isInflationMode && statistics.inflationInfo && (
        <>
          <Divider orientation="left" className="my-4">
            通货膨胀影响分析
          </Divider>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* 实际购买力 */}
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: token.colorFillQuaternary,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Statistic
                title={
                  <Tooltip title="考虑通货膨胀后的实际购买力">
                    <span className="font-medium" style={{ color: token.colorText }}>
                      实际购买力
                    </span>
                  </Tooltip>
                }
                value={formatNumber(statistics.inflationInfo.realValue)}
                prefix="¥"
                valueStyle={{ color: '#2a9d8f' }}
              />
              <Text type="secondary" className="block mt-2">
                通货膨胀率:
                {round(multiply(statistics.inflationInfo.inflationRate, 100), 2).toFixed(2)}%
              </Text>
            </div>

            {/* 通货膨胀影响 */}
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: token.colorFillQuaternary,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Statistic
                title={
                  <Tooltip title="通货膨胀造成的价值损失">
                    <span className="font-medium" style={{ color: token.colorText }}>
                      通货膨胀影响
                    </span>
                  </Tooltip>
                }
                value={formatNumber(statistics.inflationInfo.inflationImpact)}
                prefix="¥"
                valueStyle={{ color: token.colorError }}
              />
              <Text type="secondary" className="block mt-2">
                购买力损失率:
                {round(statistics.inflationInfo.purchasingPowerLossPercent, 2).toFixed(2)}%
              </Text>
              <div className="mt-2">
                <Progress
                  percent={round(statistics.inflationInfo.purchasingPowerLossPercent, 2)}
                  status="exception"
                  size="small"
                  strokeColor={token.colorError}
                />
              </div>
            </div>

            {/* 实际收益率 */}
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: token.colorFillQuaternary,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Statistic
                title={
                  <Tooltip title="扣除通货膨胀后的实际收益率">
                    <span className="font-medium" style={{ color: token.colorText }}>
                      实际收益率
                    </span>
                  </Tooltip>
                }
                value={round(multiply(statistics.inflationInfo.realRateOfReturn, 100), 2).toFixed(
                  2
                )}
                suffix="%"
                valueStyle={{
                  color:
                    statistics.inflationInfo.realRateOfReturn >= 0
                      ? token.colorSuccess
                      : token.colorError,
                }}
                prefix={
                  statistics.inflationInfo.realRateOfReturn >= 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                }
              />
              <Text type="secondary" className="block mt-2">
                相比名义收益率
                {statistics.inflationInfo.realRateOfReturn < statistics.inflationInfo.inflationRate
                  ? '减少了'
                  : '增加了'}
                {round(
                  abs(
                    subtract(
                      multiply(statistics.inflationInfo.realRateOfReturn, 100),
                      multiply(statistics.lastPoint.value / statistics.firstPoint.value - 1, 100)
                    )
                  ),
                  2
                ).toFixed(2)}
                %
              </Text>
            </div>
          </div>

          {/* 通货膨胀分析说明 */}
          <div
            className="p-4 rounded-lg mb-6"
            style={{
              backgroundColor: token.colorInfoBg,
              border: `1px solid ${token.colorInfoBorder}`,
            }}
          >
            <Paragraph style={{ color: token.colorText }} className="mb-2">
              <strong>通货膨胀影响解读：</strong>
            </Paragraph>
            <ul className="list-disc pl-6 space-y-1" style={{ color: token.colorTextSecondary }}>
              <li>
                您的初始投资为 <Text strong>¥{formatNumber(statistics.firstPoint.principal)}</Text>
                ，最终名义价值为 <Text strong>¥{formatNumber(statistics.lastPoint.value)}</Text>。
              </li>
              <li>
                考虑
                <Text strong>
                  {round(multiply(statistics.inflationInfo.inflationRate, 100), 2)}%
                </Text>
                的年通货膨胀率后，实际购买力为
                <Text strong>¥{formatNumber(statistics.inflationInfo.realValue)}</Text>。
              </li>
              <li>
                名义收益率为 <Text strong>{round(multiply(statistics.totalReturn, 100), 2)}%</Text>
                ，但实际收益率仅为
                <Text strong>
                  {round(multiply(statistics.inflationInfo.realRateOfReturn, 100), 2)}%
                </Text>
                。
              </li>
              <li>
                通货膨胀使您损失了约
                <Text strong type="danger">
                  ¥{formatNumber(statistics.inflationInfo.inflationImpact)}
                </Text>
                的购买力，占总终值的
                <Text strong type="danger">
                  {round(statistics.inflationInfo.purchasingPowerLossPercent, 2)}%
                </Text>
                。
              </li>
            </ul>
          </div>
        </>
      )}

      <Divider orientation="left" className="my-4">
        资金构成分析
      </Divider>

      {/* 资金构成分析 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 本金占比 */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: token.colorFillQuaternary,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Statistic
            title={
              <Tooltip title="初始投入的本金占最终金额的比例">
                <span className="font-medium" style={{ color: token.colorText }}>
                  本金占比
                </span>
              </Tooltip>
            }
            value={statistics.principalRatio}
            precision={Number.isInteger(statistics.principalRatio) ? 0 : 2}
            suffix="%"
            valueStyle={{ color: '#8884d8' }}
          />
          <Text type="secondary" className="block mt-2 break-words">
            ¥ {formatNumber(statistics.firstPoint.principal)}
          </Text>
          <div className="mt-2">
            <Progress
              percent={round(statistics.principalRatio, 2)}
              size="small"
              strokeColor="#8884d8"
            />
          </div>
        </div>

        {/* 利息占比 */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: token.colorFillQuaternary,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Statistic
            title={
              <Tooltip title="通过复利获得的收益占最终金额的比例">
                <span className="font-medium" style={{ color: token.colorText }}>
                  利息收益占比
                </span>
              </Tooltip>
            }
            value={statistics.interestRatio}
            precision={Number.isInteger(statistics.interestRatio) ? 0 : 2}
            suffix="%"
            valueStyle={{ color: '#82ca9d' }}
          />
          <Text type="secondary" className="block mt-2 break-words">
            ¥ {formatNumber(statistics.lastPoint.interest)}
          </Text>
          <div className="mt-2">
            <Progress
              percent={round(statistics.interestRatio, 2)}
              size="small"
              strokeColor="#82ca9d"
            />
          </div>
        </div>

        {/* 追加投资占比 */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: token.colorFillQuaternary,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Statistic
            title={
              <Tooltip title="定期追加投资的金额占最终金额的比例">
                <span className="font-medium" style={{ color: token.colorText }}>
                  追加投资占比
                </span>
              </Tooltip>
            }
            value={statistics.contributionRatio}
            precision={Number.isInteger(statistics.contributionRatio) ? 0 : 2}
            suffix="%"
            valueStyle={{ color: '#ffc658' }}
          />
          <Text type="secondary" className="block mt-2 break-words">
            ¥ {formatNumber(statistics.lastPoint.contribution)}
          </Text>
          <div className="mt-2">
            <Progress
              percent={round(statistics.contributionRatio, 2)}
              size="small"
              strokeColor="#ffc658"
            />
          </div>
        </div>
      </div>

      {/* 投资效率指标 */}
      <div
        className="mt-6 p-4 rounded-lg"
        style={{
          backgroundColor: token.colorFillQuaternary,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Title level={5} className="mb-3" style={{ color: token.colorText }}>
          投资效率指标
        </Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Text strong style={{ color: token.colorText }}>
              复利增长因子
            </Text>
            <div className="flex flex-col sm:flex-row sm:items-center mt-1 gap-2">
              <div className="text-lg font-semibold break-words">
                {round(divide(statistics.lastPoint.value, statistics.totalInvestment), 2).toFixed(
                  2
                )}
                x
              </div>
              <Text type="secondary" className="text-xs">
                最终金额 / 总投入
              </Text>
            </div>
            <Progress
              percent={Math.min(
                100,
                round(divide(statistics.lastPoint.value, statistics.totalInvestment) * 10, 0)
              )}
              size="small"
              strokeColor={token.colorPrimaryActive}
              className="mt-2"
            />
          </div>

          <div>
            <Text strong style={{ color: token.colorText }}>
              利息贡献率
            </Text>
            <div className="flex flex-col sm:flex-row sm:items-center mt-1 gap-2">
              <div className="text-lg font-semibold break-words">
                {round(
                  divide(
                    statistics.lastPoint.interest,
                    subtract(statistics.lastPoint.value, statistics.lastPoint.interest)
                  ) * 100,
                  2
                ).toFixed(2)}
                %
              </div>
              <Text type="secondary" className="text-xs">
                利息 / (本金+追加投资)
              </Text>
            </div>
            <Progress
              percent={Math.min(
                100,
                round(
                  divide(
                    statistics.lastPoint.interest,
                    subtract(statistics.lastPoint.value, statistics.lastPoint.interest)
                  ) * 100,
                  0
                )
              )}
              size="small"
              strokeColor={token.colorInfoActive}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsOverview;
