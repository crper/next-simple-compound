/**
 * @file 计算逻辑Hook
 * @description 提供复利计算器的核心计算逻辑
 */

import { App, type FormInstance } from 'antd';
import { useCallback, useState } from 'react';
import {
  CalculationMode,
  CalculationResult,
  getCalculationLabel,
} from '../types/calculation-types';
import { ChartDataPoint } from '../types/chart-types';
import { FormValues } from '../types/form-types';
import { generateChartData } from '../utils/chart-utils';
import {
  calculateFutureValue,
  calculatePeriods,
  calculatePrincipal,
  calculateRate,
} from '../utils/compound-calculator';
import { divide, multiply, subtract } from '../utils/math';
import { financialMath } from '../utils/math/financial';
import { areRequiredFieldsFilled, getRequiredFields, validateFormData } from '../utils/validation';
import { useCalculationDirect } from './use-calculation-direct';

/**
 * 计算逻辑Hook
 * @returns 计算相关状态和方法
 */
export const useCalculation = () => {
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('futureValue');
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // 使用直接计算（同步方法）
  const { calculatePeriodsWithContribution, calculateRateWithContribution } =
    useCalculationDirect();

  const { message } = App.useApp();

  /**
   * 处理表单提交
   * @param data 表单数据
   * @param form 表单实例，用于设置字段错误
   */
  const handleFormSubmit = useCallback(
    async (data: FormValues, form?: FormInstance) => {
      // 验证表单数据
      if (!data) {
        if (form) {
          // 获取当前模式下的必填字段
          const requiredFields = getRequiredFields(calculationMode);
          const errors = requiredFields.map(field => ({
            name: field,
            errors: ['请填写必填字段'],
          }));
          form.setFields(errors);
        } else {
          message.error('请填写表单数据');
        }
        return;
      }

      // 检查必填字段是否都已填写
      if (!areRequiredFieldsFilled(data, calculationMode)) {
        if (form) {
          const requiredFields = getRequiredFields(calculationMode);
          const errors = requiredFields
            .filter(field => {
              const value = data[field];
              return value === undefined || value === null || String(value).trim() === '';
            })
            .map(field => ({
              name: field,
              errors: ['此字段为必填项'],
            }));
          form.setFields(errors);
        } else {
          message.error('请填写所有必填字段');
        }
        return;
      }

      // 验证表单数据的业务逻辑
      const validationResult = validateFormData(data, calculationMode);
      if (validationResult !== true) {
        if (form) {
          form.setFields([
            {
              name: validationResult.field,
              errors: [validationResult.message],
            },
          ]);
        } else {
          message.error(validationResult.message);
        }
        return;
      }

      // 重置计算结果
      setCalculationResult(null);
      setChartData([]);
      setIsCalculating(true);

      try {
        // 保存表单数据
        setFormData(data);

        // 解析输入值
        const principal = parseFloat(String(data.principal));
        const additionalContribution = parseFloat(String(data.additionalContribution || 0));
        const periodUnit = data.periodUnit || 'years';
        let periodRate = parseFloat(String(data.annualRate)) / 100; // 转换为小数
        const periods = parseFloat(String(data.periods || 0));
        const futureValueInput = parseFloat(String(data.futureValueInput || 0));
        const inflationRate = parseFloat(String(data.inflationRate || 0)) / 100; // 转换为小数

        // 根据期数单位调整利率
        if (periodUnit === 'halfYears') {
          periodRate = divide(periodRate, 2);
        } else if (periodUnit === 'quarters') {
          periodRate = divide(periodRate, 4);
        } else if (periodUnit === 'months') {
          periodRate = divide(periodRate, 12);
        } else if (periodUnit === 'weeks') {
          periodRate = divide(periodRate, 52);
        } else if (periodUnit === 'days') {
          periodRate = divide(periodRate, 365);
        }

        // 根据计算模式执行不同的计算
        let result: number;
        let generatedChartData: ChartDataPoint[] = [];
        let additionalInfo: Record<string, string | number> = {};

        switch (calculationMode) {
          case 'futureValue':
            result = calculateFutureValue(principal, periodRate, periods, additionalContribution);
            if (!isNaN(result)) {
              generatedChartData = generateChartData(
                principal,
                periodRate,
                periods,
                additionalContribution
              );
            }
            break;
          case 'principal':
            result = calculatePrincipal(
              futureValueInput,
              periodRate,
              periods,
              additionalContribution
            );
            if (!isNaN(result)) {
              generatedChartData = generateChartData(
                result,
                periodRate,
                periods,
                additionalContribution
              );
            }
            break;
          case 'periods':
            if (additionalContribution > 0) {
              // 检查是否本金已经达到或超过目标
              if (principal >= futureValueInput) {
                result = 0; // 本金已达到目标，不需要额外期数
              }
              // 检查追加投资是否足够达到目标（不考虑利息）
              else if (periodRate <= 0.0001) {
                // 利率极低或为零的情况
                result = Math.max(
                  1,
                  Math.ceil(divide(subtract(futureValueInput, principal), additionalContribution))
                );
              } else {
                // 使用直接计算方法处理含追投的期数计算
                try {
                  result = await calculatePeriodsWithContribution(
                    futureValueInput,
                    principal,
                    periodRate,
                    additionalContribution
                  );

                  // 确保结果为非负数
                  if (isNaN(result) || result < 0) {
                    // 不考虑利息的简化计算
                    result = Math.max(
                      0,
                      Math.ceil(
                        divide(subtract(futureValueInput, principal), additionalContribution)
                      )
                    );
                  }
                } catch (error) {
                  console.error('期数计算错误:', error);
                  // 降级到简化计算
                  result = Math.max(
                    0,
                    Math.ceil(divide(subtract(futureValueInput, principal), additionalContribution))
                  );
                }
              }
            } else {
              // 无追加投资的情况
              if (principal >= futureValueInput) {
                result = 0; // 本金已达到目标
              } else {
                result = calculatePeriods(futureValueInput, principal, periodRate);

                // 确保结果为非负数
                if (isNaN(result) || result < 0) {
                  result = 0; // 无法达到目标
                }
              }
            }

            // 对期数进行取整处理，但允许0期
            result = Math.max(0, Math.ceil(result));

            if (!isNaN(result)) {
              // 使用向上取整的期数生成图表数据
              generatedChartData = generateChartData(
                principal,
                periodRate,
                result, // 使用取整后的期数
                additionalContribution
              );
            }
            break;
          case 'rate':
            if (additionalContribution > 0) {
              try {
                result = await calculateRateWithContribution(
                  futureValueInput,
                  principal,
                  periods,
                  additionalContribution
                );

                // 结果应为非负数
                if (isNaN(result) || result < 0) {
                  result = 0;
                }
              } catch (error) {
                console.error('利率计算错误:', error);
                // 使用简化计算（不考虑追加投资）
                result = calculateRate(futureValueInput, principal, periods);
              }
            } else {
              result = calculateRate(futureValueInput, principal, periods);
            }

            // 保存原始期利率用于图表生成
            const originalPeriodRate = result;

            // 将期利率转换为年利率用于显示
            if (!isNaN(result)) {
              // 根据期数单位将结果转换为年利率
              if (periodUnit === 'halfYears') {
                result = multiply(result, 2);
              } else if (periodUnit === 'quarters') {
                result = multiply(result, 4);
              } else if (periodUnit === 'months') {
                result = multiply(result, 12);
              } else if (periodUnit === 'weeks') {
                result = multiply(result, 52);
              } else if (periodUnit === 'days') {
                result = multiply(result, 365);
              }

              // 将小数转换为百分比值（乘以100）
              result = multiply(result, 100);

              // 生成图表数据（使用原始期利率）
              generatedChartData = generateChartData(
                principal,
                originalPeriodRate, // 使用原始期利率，不是转换后的年利率
                periods,
                additionalContribution
              );
            }
            break;
          case 'inflation':
            // 通货膨胀影响计算模式
            const inflationResults = financialMath.inflationAdjustedCompoundInterest(
              principal,
              periodRate,
              inflationRate,
              periods,
              additionalContribution
            );

            result = inflationResults.nominal;
            // 保存实际购买力信息用于显示
            additionalInfo = {
              nominalValue: inflationResults.nominal,
              realValue: inflationResults.real,
              inflationImpact: subtract(inflationResults.nominal, inflationResults.real),
              inflationRate: inflationRate,
              // 添加更多通货膨胀相关的信息
              realRateOfReturn: financialMath.realRateOfReturn(periodRate, inflationRate),
              purchasingPowerLossPercent: multiply(
                divide(
                  subtract(inflationResults.nominal, inflationResults.real),
                  inflationResults.nominal
                ),
                100
              ),
            };

            // 生成图表数据（包含名义值和实际值）
            const nominalChartData = generateChartData(
              principal,
              periodRate,
              periods,
              additionalContribution
            );

            // 创建实际值的图表数据
            generatedChartData = nominalChartData.map(point => {
              const realValue = financialMath.realValueWithInflation(
                point.value,
                inflationRate,
                point.period
              );
              return {
                ...point,
                value: point.value, // 名义值
                realValue: realValue, // 添加实际值
              };
            });
            break;
          default:
            result = 0;
        }

        // 格式化结果并更新状态
        setChartData(generatedChartData);
        setCalculationResult({
          type: calculationMode,
          label: getCalculationLabel(calculationMode),
          value: result,
          unit: calculationMode === 'periods' ? '期' : calculationMode === 'rate' ? '%' : '元',
          additionalInfo,
        });
      } catch (error) {
        console.error('计算错误:', error);
        message.error('计算过程中发生错误，请检查输入值后重试');
      } finally {
        setIsCalculating(false);
      }
    },
    [calculationMode, calculatePeriodsWithContribution, calculateRateWithContribution, message]
  );

  /**
   * 重置计算数据
   */
  const resetCalculation = useCallback(() => {
    setFormData(null);
    setCalculationResult(null);
    setChartData([]);
  }, []);

  return {
    calculationMode,
    setCalculationMode,
    formData,
    calculationResult,
    chartData,
    handleFormSubmit,
    resetCalculation,
    isCalculating,
    calculationProgress: 0,
  };
};
