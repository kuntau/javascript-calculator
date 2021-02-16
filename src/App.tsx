import React, { useState, useEffect } from 'react'
import './App.css'
import { Data as data } from './Data'

function App() {
  const [ calculate, setCalculate ] = useState<number[]|string[]>([])
  const [ display, setDisplay ] = useState<any>("")
  const [ history, setHistory ] = useState<number[]>([])
  const [ result, setResult ] = useState(0)
  const [ operation, setOperation ] = useState(null)
  const [ decimal, setDecimal ] = useState(false)
  const [ negative, setNegative ] = useState(false)
  const [ check, setCheck ] = useState(false)
  const [ debug, setDebug ] = useState(true)
  const OPERATION = /\*|\+|\-|\//
  const NUMBER = /\d/
  const DECIMAL = /\./

  const isNumber = (input: any): boolean => NUMBER.test(input)
  const isOperation = (input: any): boolean => OPERATION.test(input)
  const isDecimal = (input: any): boolean => DECIMAL.test(input)
  const getLastArray = (arr: Array<any>) => arr[arr.length-1]
  const getLastChar = (text: any) => text.charAt([text.length-1])
  const doCalculation = (input: Array<string|number>) => Function(`'use strict'; return (${input.join('')})`)()
  const reset = () => {
    setDisplay(""); setOperation(null); setCalculate([]); setCheck(false); setHistory([]); setDecimal(false); setNegative(false);
  }

  const processInput = (input: any) => {
    if (isNumber(input.value)) {
      if (operation && negative) {
        console.log("op-ve")
        setDisplay(display + input.value.toString())
        setNegative(false)
      } else if (operation) {
        setCalculate([...calculate, display])
        setOperation(null)
        setDisplay(input.value.toString())
      } else {
        if (input.value == 0 && display.length == 0) {
          console.log(display)
          // setDisplay(display + input.value.toString())
        } else {
          setDisplay(display + input.value.toString())
        }
      }
    }
    else if (isOperation(input.value)) {
      if (check) {
        console.log("yep", display)
        setCalculate([getLastArray(history)])
        // setCalculate(result)
        setOperation(input.id)
        setDisplay(input.value)
        setCheck(false)
      } else if (operation) {
        if (input.id == "subtract") {
          console.log("subtract")
          if (negative) { return }
          setNegative(true)
          setCalculate([...calculate, display])
          setDisplay(input.value.toString())
        } else {
          if (negative) {
            setCalculate([calculate.shift()])
            setNegative(false)
          }
          setOperation(input.id)
          setDisplay(input.value)
        }
          // setOperation(input.id)
          // setDisplay(input.value)
      } else if (calculate.length || display.length) {
        setOperation(input.id)
        setCalculate([...calculate, display])
        setDisplay(input.value)
        setDecimal(false)
      }
    }
    else if (isDecimal(input.value)) {
      if (!display) {
        // console.log("decimal", input.value)
        setDisplay("0.")
        setDecimal(true)
      } else if (!decimal) {
        setDisplay(display + input.value.toString())
        setDecimal(true)
      }
      // setOperation(input.id)
    }
    else if (input.id === "allclear" || input.id === "clear") { reset() }
    else if (input.id === "equals") {
      if (!check) {
        setCalculate([...calculate, display])
        const preResult = doCalculation([...calculate, display])
        setDisplay(preResult.toString().length > 10 ? preResult.toFixed(12) : preResult)
        // setResult(preResult)
        setHistory([...history, preResult])
        setOperation(null)
        setCheck(true)
      }
      // console.log(doCalculation(calculate))
    }
    else { setCheck(false) }
    return input
  }

  useEffect(() => {
    // console.log(doCalculation([2,"+", 2, "*", .4]))
  }, [])

  useEffect(() => {
    if (isNumber(getLastArray(calculate))) {
      // console.log(calculate)
      // setHistory([...history, doCalculation(calculate)])
      // console.log(calculate.join(''))
      // console.log(doCalculation(calculate))
    }
  }, [calculate])

  return (
    <div className="App">
      <main className="App-header">
        <h1 className="text-center">Basic Calculator</h1>
        <div id="calculator" className="my-10">
          <div id="screen" className="flex flex-col bg-gray-700">
            <div className="flex-1 px-2 py-3 font-mono text-right bg-gray-600 rounded history">
              { calculate }
            </div>
            <div id="display" className="flex-1 px-2 py-6 overflow-x-hidden font-mono text-4xl leading-normal text-right bg-gray-800">
              { display ? display : 0 }
            </div>
          </div>
          {
            data.map(button => (
              <div
                id={button.id}
                key={button.id}
                className={button.style}
                onClick={() => {
                  // setCalculate([...calculate, button.value])
                  // setInput(input.concat(button.value))
                  processInput(button)
                }}
              >
              { button.symbol }
              </div>
            ))
          }
        </div>
        {
          debug ?
            <div id="debug">
              <ul>
                <li>Operation: {operation?operation:'Empty'}</li>
                <li>History: {history?history:'Empty'}</li>
                <li>Calculate: {calculate?calculate:'Empty'}</li>
                <li>Check: {check?'true':'false'} | Negative: {negative?'true':'false'}</li>
              </ul>
            </div> : null
        }
      </main>
    </div>
  )
}

export default App
