import React, { useState } from "react";

import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

// import BigDecimal or DecimalJS to resolve float decimal issue.

// No need to flatten this array if it's already flat and can change all values to string until calculation. 
const btnValues = [
  "C", "+-", "%", "/", 
  "7", "8", "9", "X", 
  "4", "5", "6", "-", 
  "1", "2", "3", "+", 
  "0" , ".", "="
];

const toLocaleString = (num) =>
  `${num}`.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1,");

const removeCommas = (num) => num.replace(/,/g, "");

const math = (a, b, sign) =>
  sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b;

const App = () => {
  let [calc, setCalc] = useState({
    sign: "",
    num: "0",
    res: "0",
  });

  // Most handlers can be moved into a single function.
  const handleClick = (e) => {
    console.log(calc)
    e.preventDefault()
    const {target} = e
    const input = target.innerHTML

    // Clear Handler
    if (input === "C") {
      setCalc({
        sign: "",
        num: "0",
        res: "0",
      })
    }

    // Invert Handler
    // TODO: Make sure the second number can be inverted without clearing the first number.
    else if (input === "+-") {
      setCalc(prevCalc => ({
        ...prevCalc,
        num: prevCalc.num ? toLocaleString(removeCommas(prevCalc.num) * -1) : "0",
        res: prevCalc.res ? toLocaleString(removeCommas(prevCalc.res) * -1) : "0",
      }))
    }

    // Percentile Handler
    // Acts as a decimal but does not properly calculate with addition and subtraction.
    // Fixed issue with percentage not working but needs more work.
    else if (input === "%") {
      setCalc(prevCalc => {
        let num = prevCalc.num !== "0" ? Number(removeCommas(prevCalc.num)) : 0;
        return {
          ...prevCalc,
          num: prevCalc.num !== "0" ? `${num /= Math.pow(100, 1)}` : "0",
        }
      });
    }

    // Calculate inputs
    // Currently cannot handle decimal values properly.
    else if (input === "=") {
      equalsClickHandler()
    }

    // Sign Handler
    else if (input.match(/[/X\-+]/)) {
      setCalc(prevCalc => ({
        sign: input,
        num: "0",
        res: prevCalc.num === "0" ? prevCalc.res 
        : prevCalc.res === "0" ? prevCalc.num 
        : toLocaleString(math(
            Number(removeCommas(prevCalc.res)),
            Number(removeCommas(prevCalc.num)),
            prevCalc.sign
        )),
      }));
    }

    // Decimal Handler 
    else if (input === ".") {
      setCalc(prevCalc => ({
        ...prevCalc,
        num: !prevCalc.num.includes(".") ? prevCalc.num + input : prevCalc.num,
      }));
    }
    
    // Number Handler
    else if (input.match(/[0-9]/)) {
      if (removeCommas(calc.num).length < 16) {
        setCalc( prevCalc => ({
          ...prevCalc,
          num: prevCalc.num === "0" 
              ? input
              : Number(removeCommas(prevCalc.num)) % 1 === 0
              ? toLocaleString(Number(removeCommas(prevCalc.num + input)))
              : toLocaleString(prevCalc.num + input),
          res: !prevCalc.sign ? "0" : prevCalc.res,
        }));
      }
    }
  }

  // End of clickHandler

  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      setCalc(prevCalc => ({
        sign: "",
        num: "0",
        res:
        prevCalc.num === "0" && prevCalc.sign === "/"
            ? "Can't divide by 0"
            : toLocaleString(
                math(
                  Number(removeCommas(prevCalc.res)),
                  Number(removeCommas(prevCalc.num)),
                  prevCalc.sign
                )
              ),
      }));
    }
  };

  return (
    <Wrapper>
      <Screen value={calc.num !== "0" ? calc.num : calc.res} /> {/* This can be a hook to get the display and format it properly */}
      <ButtonBox>
        {btnValues.map((btn, i) => {
          return (
            <Button
              key={i}
              className={btn === "=" ? "equals" : ""}
              value={btn}
              onClick={(e) => handleClick(e)}
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
};

export default App;
