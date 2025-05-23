import { useCallback, useState } from 'react';
import { calculatePeriods, calculateRate } from '../utils/compound-calculator';

/**
 * 直接计算Hook（不使用Worker）
 * @returns 计算相关状态和方法
 */
export const useCalculationDirect = () => {
  const [calculationProgress, setCalculationProgress] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // 直接计算含追投的期数
  const calculatePeriodsWithContribution = useCallback(
    (
      futureValue: number,
      principal: number,
      rate: number,
      additionalContribution: number
    ): Promise<number> => {
      return new Promise(resolve => {
        setIsCalculating(true);
        setCalculationProgress(10);

        // 使用setTimeout确保UI可以更新进度
        setTimeout(() => {
          setCalculationProgress(50);

          // 直接使用库函数计算
          const result = calculatePeriods(futureValue, principal, rate, additionalContribution);

          setCalculationProgress(100);
          setTimeout(() => {
            setCalculationProgress(0);
            setIsCalculating(false);
            resolve(result);
          }, 500);
        }, 10);
      });
    },
    []
  );

  // 直接计算含追投的利率
  const calculateRateWithContribution = useCallback(
    (
      futureValue: number,
      principal: number,
      periods: number,
      additionalContribution: number
    ): Promise<number> => {
      return new Promise(resolve => {
        setIsCalculating(true);
        setCalculationProgress(10);

        // 使用setTimeout确保UI可以更新进度
        setTimeout(() => {
          setCalculationProgress(50);

          // 直接使用库函数计算
          const result = calculateRate(futureValue, principal, periods, additionalContribution);

          setCalculationProgress(100);
          setTimeout(() => {
            setCalculationProgress(0);
            setIsCalculating(false);
            resolve(result);
          }, 500);
        }, 10);
      });
    },
    []
  );

  // 清理函数（为了保持API兼容）
  const cleanupWorker = useCallback(() => {
    // 不需要清理任何内容
  }, []);

  return {
    calculationProgress,
    isCalculating,
    cleanupWorker,
    calculatePeriodsWithContribution,
    calculateRateWithContribution,
  };
};
