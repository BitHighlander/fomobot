#include "../../include/indicators/Indicator.h"
#include "../../include/indicators/factories/IndicatorFactory.h"

INDICATOR(RSI)(const std::vector<Candlestick>* candlesticks, int* startIndex)
{
  std::vector<double> indicatorData =  std::vector<double>();

  int outBeginIdx;
  int outNbElement;
  int optInTimePeriod = 14;

  unsigned int lookback = TA_RSI_Lookback(optInTimePeriod);

  if (candlesticks->size() <= lookback) {
		return indicatorData;
	}

  //Initialize all required parameters
  this->PrepareParameters(candlesticks);

  //Perform the RSI calculation
  TA_RSI(
    this->startIdx,
    this->endIdx,
    this->inClose,
    optInTimePeriod,
    &outBeginIdx,
    &outNbElement,
    this->outReal);

  //Put the result into indicator data vector in RsiModel
  for (int i = 0; i < outNbElement; i++) {
    indicatorData.push_back(outReal[i]);
  }

  *startIndex = outBeginIdx;

  //Cleanup all required parameters
  this->Clean();

  return indicatorData;
}
