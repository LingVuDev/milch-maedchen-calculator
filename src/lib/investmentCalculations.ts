export interface InvestmentData {
  year: number
  investmentPerMonth: number
  gains: number
  withInvestment: number
  withoutInvestment: number
  tax: number
}

export const getInvestmentPlan = (
  yearsToInvest: number, 
  startYear: number, 
  startMoney: number, 
  investmentPerMonthRow: number[], 
  increaseRow: number[]
): InvestmentData[] => {
  const firstYearInvest = 12 * investmentPerMonthRow[0] + startMoney
  
  const investmentTable: InvestmentData[] = [{
    year: startYear,
    investmentPerMonth: investmentPerMonthRow[0],
    gains: increaseRow[0],
    withInvestment: firstYearInvest,  
    withoutInvestment: firstYearInvest,
    tax: 0,
  }]

  for(let i = 0; i < yearsToInvest; i++) {
    const investmentPerMonth = investmentPerMonthRow.length - 1 < i 
      ? investmentPerMonthRow[investmentPerMonthRow.length - 1]
      : investmentPerMonthRow[i]
    const investmentPerYear = (12 * investmentPerMonth)
    const { withInvestment, withoutInvestment } = investmentTable[i]
    const increase = increaseRow.length - 1 < i 
      ? increaseRow[increaseRow.length - 1]
      : increaseRow[i]
    
    const nextWithInvestment = (investmentPerYear + withInvestment) * (1 + increase)
    const nextWithoutInvestment = investmentPerYear + withoutInvestment

    const tax = (nextWithInvestment - nextWithoutInvestment) * 0.26375

    investmentTable.push({
      year: startYear + i + 1,
      investmentPerMonth,
      gains: increase,
      withInvestment: nextWithInvestment,
      withoutInvestment: nextWithoutInvestment,
      tax,
    })
  }
  return investmentTable
}