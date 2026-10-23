import { CalculatorInputs, CalculatorResults, InstrumentSpec } from '../types';
import { INSTRUMENT_SPECS } from './instruments';

export function calculatePositionSize(inputs: CalculatorInputs): CalculatorResults {
  const {
    instrument,
    direction,
    accountBalance,
    riskPercentage,
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    customContractSize,
    customPipValue,
  } = inputs;

  let spec: InstrumentSpec = INSTRUMENT_SPECS[instrument] || {
    symbol: instrument || 'CUSTOM',
    name: 'Custom Instrument',
    category: 'Custom',
    contractSize: customContractSize || 100000,
    pipSize: 0.0001,
    pipValuePerStandardLotUSD: customPipValue || 10.0,
    priceDecimals: 4,
    tradingViewSymbol: 'FX:EURUSD',
    notes: 'Custom user-specified instrument configuration.',
  };

  // Basic numeric validation
  if (!accountBalance || accountBalance <= 0) {
    return {
      isValid: false,
      errorMessage: 'Account balance must be a positive number.',
      dollarRisk: 0,
      stopDistance: 0,
      stopDistancePips: 0,
      targetDistance: 0,
      targetDistancePips: 0,
      riskRewardRatio: 0,
      suggestedLots: 0,
      minLotConstraintApplied: false,
      estimatedLossUSD: 0,
      estimatedProfitUSD: 0,
      specUsed: spec,
    };
  }

  if (!riskPercentage || riskPercentage <= 0 || riskPercentage > 100) {
    return {
      isValid: false,
      errorMessage: 'Risk percentage must be between 0.01% and 100%.',
      dollarRisk: 0,
      stopDistance: 0,
      stopDistancePips: 0,
      targetDistance: 0,
      targetDistancePips: 0,
      riskRewardRatio: 0,
      suggestedLots: 0,
      minLotConstraintApplied: false,
      estimatedLossUSD: 0,
      estimatedProfitUSD: 0,
      specUsed: spec,
    };
  }

  if (!entryPrice || entryPrice <= 0 || !stopLossPrice || stopLossPrice <= 0) {
    return {
      isValid: false,
      errorMessage: 'Entry and Stop Loss prices must be greater than zero.',
      dollarRisk: 0,
      stopDistance: 0,
      stopDistancePips: 0,
      targetDistance: 0,
      targetDistancePips: 0,
      riskRewardRatio: 0,
      suggestedLots: 0,
      minLotConstraintApplied: false,
      estimatedLossUSD: 0,
      estimatedProfitUSD: 0,
      specUsed: spec,
    };
  }

  if (Math.abs(entryPrice - stopLossPrice) < 0.000001) {
    return {
      isValid: false,
      errorMessage: 'Entry price and Stop Loss price cannot be identical.',
      dollarRisk: 0,
      stopDistance: 0,
      stopDistancePips: 0,
      targetDistance: 0,
      targetDistancePips: 0,
      riskRewardRatio: 0,
      suggestedLots: 0,
      minLotConstraintApplied: false,
      estimatedLossUSD: 0,
      estimatedProfitUSD: 0,
      specUsed: spec,
    };
  }

  // Directional sanity check
  if (direction === 'Buy') {
    if (stopLossPrice >= entryPrice) {
      return {
        isValid: false,
        errorMessage: 'Invalid Buy setup: Stop Loss must be placed below Entry price.',
        dollarRisk: 0,
        stopDistance: 0,
        stopDistancePips: 0,
        targetDistance: 0,
        targetDistancePips: 0,
        riskRewardRatio: 0,
        suggestedLots: 0,
        minLotConstraintApplied: false,
        estimatedLossUSD: 0,
        estimatedProfitUSD: 0,
        specUsed: spec,
      };
    }
    if (takeProfitPrice && takeProfitPrice <= entryPrice) {
      return {
        isValid: false,
        errorMessage: 'Invalid Buy setup: Take Profit must be placed above Entry price.',
        dollarRisk: 0,
        stopDistance: 0,
        stopDistancePips: 0,
        targetDistance: 0,
        targetDistancePips: 0,
        riskRewardRatio: 0,
        suggestedLots: 0,
        minLotConstraintApplied: false,
        estimatedLossUSD: 0,
        estimatedProfitUSD: 0,
        specUsed: spec,
      };
    }
  } else {
    // Sell
    if (stopLossPrice <= entryPrice) {
      return {
        isValid: false,
        errorMessage: 'Invalid Sell setup: Stop Loss must be placed above Entry price.',
        dollarRisk: 0,
        stopDistance: 0,
        stopDistancePips: 0,
        targetDistance: 0,
        targetDistancePips: 0,
        riskRewardRatio: 0,
        suggestedLots: 0,
        minLotConstraintApplied: false,
        estimatedLossUSD: 0,
        estimatedProfitUSD: 0,
        specUsed: spec,
      };
    }
    if (takeProfitPrice && takeProfitPrice >= entryPrice) {
      return {
        isValid: false,
        errorMessage: 'Invalid Sell setup: Take Profit must be placed below Entry price.',
        dollarRisk: 0,
        stopDistance: 0,
        stopDistancePips: 0,
        targetDistance: 0,
        targetDistancePips: 0,
        riskRewardRatio: 0,
        suggestedLots: 0,
        minLotConstraintApplied: false,
        estimatedLossUSD: 0,
        estimatedProfitUSD: 0,
        specUsed: spec,
      };
    }
  }

  const dollarRisk = (accountBalance * riskPercentage) / 100;
  const stopDistance = Math.abs(entryPrice - stopLossPrice);
  const stopDistancePips = stopDistance / spec.pipSize;

  let targetDistance = 0;
  let targetDistancePips = 0;
  let riskRewardRatio = 0;

  if (takeProfitPrice && takeProfitPrice > 0) {
    targetDistance = Math.abs(takeProfitPrice - entryPrice);
    targetDistancePips = targetDistance / spec.pipSize;
    if (stopDistance > 0) {
      riskRewardRatio = Number((targetDistance / stopDistance).toFixed(2));
    }
  }

  // Cost per standard lot for this stop distance
  // 1 standard lot loses: (stopDistancePips * spec.pipValuePerStandardLotUSD)
  const lossPerStandardLot = stopDistancePips * spec.pipValuePerStandardLotUSD;

  let rawLots = 0;
  if (lossPerStandardLot > 0) {
    rawLots = dollarRisk / lossPerStandardLot;
  }

  // Round lots to 2 decimal places (standard micro-lot precision 0.01)
  let roundedLots = Math.floor(rawLots * 100) / 100;
  let minLotConstraintApplied = false;

  // Requirement: Display a minimum suggested lot size of 0.01 only as a broker constraint or user preference;
  // NEVER force a trade size that exceeds the user's risk limit.
  if (roundedLots < 0.01) {
    // If 0.01 lot would exceed planned dollar risk, flag it!
    const lossAtMinLot = 0.01 * lossPerStandardLot;
    if (lossAtMinLot > dollarRisk) {
      // It exceeds the risk limit! We report 0 or warning
      roundedLots = 0;
      minLotConstraintApplied = true;
    } else {
      roundedLots = 0.01;
    }
  }

  const estimatedLossUSD = Number((roundedLots * lossPerStandardLot).toFixed(2));
  const estimatedProfitUSD = targetDistancePips > 0
    ? Number((roundedLots * (targetDistancePips * spec.pipValuePerStandardLotUSD)).toFixed(2))
    : 0;

  return {
    isValid: true,
    dollarRisk: Number(dollarRisk.toFixed(2)),
    stopDistance: Number(stopDistance.toFixed(spec.priceDecimals)),
    stopDistancePips: Number(stopDistancePips.toFixed(1)),
    targetDistance: Number(targetDistance.toFixed(spec.priceDecimals)),
    targetDistancePips: Number(targetDistancePips.toFixed(1)),
    riskRewardRatio,
    suggestedLots: roundedLots,
    minLotConstraintApplied,
    estimatedLossUSD,
    estimatedProfitUSD,
    specUsed: spec,
  };
}
