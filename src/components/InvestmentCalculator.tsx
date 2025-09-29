"use client"

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Minus, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { getInvestmentPlan, type InvestmentData } from '@/lib/investmentCalculations'

export default function InvestmentCalculator() {
  const [yearsToInvest, setYearsToInvest] = useState(0)
  const [yearsToInvestDisplay, setYearsToInvestDisplay] = useState('0')
  const [startYear, setStartYear] = useState(new Date().getFullYear())
  const [startMoney, setStartMoney] = useState(0)
  const [investmentPerMonthRow, setInvestmentPerMonthRow] = useState([0])
  const [investmentPerMonthDisplayRow, setInvestmentPerMonthDisplayRow] = useState(['0'])
  const [increaseRow, setIncreaseRow] = useState([0])
  const [increaseDisplayRow, setIncreaseDisplayRow] = useState(['0'])
  const [results, setResults] = useState<InvestmentData[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currencyFormatter = new Intl.NumberFormat("de-DE", { 
    style: "currency", 
    currency: "EUR" 
  })

  const handleCalculate = () => {
    // Input validation
    if (yearsToInvest <= 0) {
      toast.error("Years to invest must be greater than 0")
      return
    }
    if (startMoney < 0) {
      toast.error("Initial investment cannot be negative")
      return
    }
    if (investmentPerMonthRow.some(amount => amount < 0)) {
      toast.error("Monthly investment amounts cannot be negative")
      return
    }
    if (increaseRow.some(rate => rate < -1)) {
      toast.error("Gain percentages cannot be less than -100%")
      return
    }

    const result = getInvestmentPlan(
      yearsToInvest, 
      startYear, 
      startMoney, 
      investmentPerMonthRow, 
      increaseRow
    )
    setResults(result)
  }

  const handleYearsToInvestChange = (value: string) => {
    setYearsToInvestDisplay(value)
    
    // Convert to number for calculations (only if it's a valid number)
    const numericValue = value === '' ? 0 : Number(value)
    if (!isNaN(numericValue)) {
      setYearsToInvest(numericValue)
    }
  }

  const updateInvestmentPerMonth = (index: number, value: string) => {
    const newDisplayArray = [...investmentPerMonthDisplayRow]
    newDisplayArray[index] = value
    setInvestmentPerMonthDisplayRow(newDisplayArray)
    
    // Convert to number for calculations (only if it's a valid number)
    const numericValue = value === '' ? 0 : Number(value)
    if (!isNaN(numericValue)) {
      const newArray = [...investmentPerMonthRow]
      newArray[index] = numericValue
      setInvestmentPerMonthRow(newArray)
    }
  }

  const updateIncreaseRow = (index: number, value: string) => {
    const newDisplayArray = [...increaseDisplayRow]
    newDisplayArray[index] = value
    setIncreaseDisplayRow(newDisplayArray)
    
    // Convert to decimal for calculations (only if it's a valid number)
    const numericValue = value === '' ? 0 : Number(value)
    if (!isNaN(numericValue)) {
      const newArray = [...increaseRow]
      newArray[index] = numericValue / 100
      setIncreaseRow(newArray)
    }
  }

  const addInvestmentPeriod = () => {
    setInvestmentPerMonthRow([...investmentPerMonthRow, 0])
    setInvestmentPerMonthDisplayRow([...investmentPerMonthDisplayRow, '0'])
  }

  const removeInvestmentPeriod = (index: number) => {
    if (investmentPerMonthRow.length > 1) {
      const newArray = investmentPerMonthRow.filter((_, i) => i !== index)
      const newDisplayArray = investmentPerMonthDisplayRow.filter((_, i) => i !== index)
      setInvestmentPerMonthRow(newArray)
      setInvestmentPerMonthDisplayRow(newDisplayArray)
    }
  }

  const addIncreasePeriod = () => {
    setIncreaseRow([...increaseRow, 0])
    setIncreaseDisplayRow([...increaseDisplayRow, '0'])
  }

  const removeIncreasePeriod = (index: number) => {
    if (increaseRow.length > 1) {
      const newArray = increaseRow.filter((_, i) => i !== index)
      const newDisplayArray = increaseDisplayRow.filter((_, i) => i !== index)
      setIncreaseRow(newArray)
      setIncreaseDisplayRow(newDisplayArray)
    }
  }

  const exportData = () => {
    const exportData = {
      yearsToInvest,
      startYear,
      startMoney,
      investmentPerMonthRow,
      increaseRow: increaseRow.map(rate => rate * 100), // Convert back to percentage for export
      exportedAt: new Date().toISOString(),
      version: "1.0"
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `investment-calculator-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully!')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        // Validate required fields
        if (typeof data.yearsToInvest !== 'number' || 
            typeof data.startYear !== 'number' || 
            typeof data.startMoney !== 'number' ||
            !Array.isArray(data.investmentPerMonthRow) ||
            !Array.isArray(data.increaseRow)) {
          throw new Error('Invalid file format')
        }

        // Import the data
        setYearsToInvest(data.yearsToInvest)
        setYearsToInvestDisplay(data.yearsToInvest.toString())
        setStartYear(data.startYear)
        setStartMoney(data.startMoney)
        setInvestmentPerMonthRow(data.investmentPerMonthRow)
        setInvestmentPerMonthDisplayRow(data.investmentPerMonthRow.map((amount: number) => amount.toString()))
        setIncreaseRow(data.increaseRow.map((rate: number) => rate / 100)) // Convert percentage to decimal
        setIncreaseDisplayRow(data.increaseRow.map((rate: number) => rate.toString())) // Keep as percentage strings
        
        // Automatically calculate investment plan with imported data
        const result = getInvestmentPlan(
          data.yearsToInvest,
          data.startYear,
          data.startMoney,
          data.investmentPerMonthRow,
          data.increaseRow.map((rate: number) => rate / 100)
        )
        setResults(result)
        
        toast.success('Data imported and calculated successfully!')
      } catch (error) {
        toast.error('Error importing file. Please check the file format.')
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
    
    // Reset file input
    if (event.target) {
      event.target.value = ''
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="my-6 border-2 border-gray-800">
        <CardHeader>
          <CardTitle>Milchmädchen Calculator</CardTitle>
          <CardDescription>
            Calculate your investment returns over time with customizable parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearsToInvest">Years to Invest</Label>
              <Input
                id="yearsToInvest"
                type="number"
                value={yearsToInvestDisplay}
                onChange={(e) => handleYearsToInvestChange(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startYear">Start Year</Label>
              <Input
                id="startYear"
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startMoney">Initial Investment (€)</Label>
              <Input
                id="startMoney"
                type="number"
                value={startMoney}
                onChange={(e) => setStartMoney(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Monthly Investment Amounts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-semibold">Monthly Investment Amounts (€)</Label>
                <p className="text-sm text-muted-foreground mt-1">Last value applies to all subsequent years</p>
              </div>
              <Button onClick={addInvestmentPeriod} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Period
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investmentPerMonthRow.map((amount, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">
                    Year {index + 1}{index === investmentPerMonthRow.length - 1 ? ' and further' : ''}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={investmentPerMonthDisplayRow[index] || ''}
                      onChange={(e) => updateInvestmentPerMonth(index, e.target.value)}
                      className="flex-1"
                      placeholder="0"
                    />
                    {investmentPerMonthRow.length > 1 && (
                      <Button
                        onClick={() => removeInvestmentPeriod(index)}
                        size="sm"
                        variant="outline"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yearly Gain Percentages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-semibold">Yearly Gain Percentages (%)</Label>
                <p className="text-sm text-muted-foreground mt-1">Last value applies to all subsequent years</p>
              </div>
              <Button onClick={addIncreasePeriod} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Period
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {increaseRow.map((increase, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">
                    Year {index + 1}{index === increaseRow.length - 1 ? ' and further' : ''}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={increaseDisplayRow[index] || ''}
                      onChange={(e) => updateIncreaseRow(index, e.target.value)}
                      className="flex-1"
                      placeholder="0.00"
                    />
                    {increaseRow.length > 1 && (
                      <Button
                        onClick={() => removeIncreasePeriod(index)}
                        size="sm"
                        variant="outline"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Import/Export Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={exportData} variant="outline" size="lg" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={handleImportClick} variant="outline" size="lg" className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              style={{ display: 'none' }}
            />
          </div>

          <Button onClick={handleCalculate} className="w-full" size="lg">
            Calculate Investment Plan
          </Button>
        </CardContent>
      </Card>

      {/* Results Table */}
      {results.length > 0 && (
        <Card className="my-6 border-2 border-gray-800">
          <CardHeader>
            <CardTitle>Investment Results</CardTitle>
            <CardDescription>
              Initial one-time investment: {currencyFormatter.format(startMoney)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Investment per Month</TableHead>
                  <TableHead>Gains per Year</TableHead>
                  <TableHead>Investment Total</TableHead>
                  <TableHead>If Not Invested</TableHead>
                  <TableHead>Tax When Selling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.year}</TableCell>
                    <TableCell>{currencyFormatter.format(row.investmentPerMonth)}</TableCell>
                    <TableCell>{(row.gains * 100).toFixed(2)}%</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {currencyFormatter.format(row.withInvestment)}
                    </TableCell>
                    <TableCell>{currencyFormatter.format(row.withoutInvestment)}</TableCell>
                    <TableCell className="text-red-600">
                      {currencyFormatter.format(row.tax)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Summary Statistics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm text-muted-foreground">Final Investment Value</h4>
                <p className="text-2xl font-bold text-green-600">
                  {currencyFormatter.format(results[results.length - 1]?.withInvestment || 0)}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm text-muted-foreground">Total Profit</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {currencyFormatter.format(
                    (results[results.length - 1]?.withInvestment || 0) - 
                    (results[results.length - 1]?.withoutInvestment || 0)
                  )}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-sm text-muted-foreground">Total Tax Liability</h4>
                <p className="text-2xl font-bold text-red-600">
                  {currencyFormatter.format(results[results.length - 1]?.tax || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}