export const prepareInput = (str: string) =>
  str.trim().split("\n").map((line) => line.split(":")).map((
    [output, values],
  ) => ({
    output: Number(output),
    stack: values.trim().split(" ").map((strNum) => Number(strNum)),
  })).map(({ output, stack }) => ({
    output,
    stack,
    operatorPositions: stack.length - 1,
  }));

export const generateArrangements = (values: string[], n: number) => {
  let arrangements: string[][] = [[]]; // Start with an empty arrangement

  // Loop for each slot
  for (let i = 0; i < n; i++) {
    const newArrangements = [];

    // Expand each current arrangement with each value
    for (const arrangement of arrangements) {
      for (const value of values) {
        newArrangements.push([...arrangement, value]);
      }
    }

    // Replace the current arrangements with the new ones
    arrangements = newArrangements
  }

  return arrangements;
};

type Equation = {
  output: number;
  stack: number[];
  operatorPositions: number;
};
type Input = Equation[];

export const calibrator = (input: Input, operators = ["*", "+"]) =>
  input.map(({ output, stack, operatorPositions: n }) => {
    const operatorStack = generateArrangements(operators, n);
    return operatorStack.map((ops) =>
      stack.reduce((acc, val, i) => {
        const operator = ops.at(i - 1);
        if (operator === "+") {
          return acc + val;
        } else if (operator === "||") {
          const first = String(acc)
          const second = String(val)
          const newVal = Number([first, second].join(""))
          return newVal
        } else {
          return acc * val;
        }
      })
    ).filter((val) => val === output);
  }).filter((arr) => arr.length > 0).map((arr) =>
    arr.reduce((acc, val) => acc === val ? acc : val)
  ).reduce((acc, val) => acc + val);

if (import.meta.main) {
  const strInput = Deno.readTextFileSync(Deno.args[0])
  const input = prepareInput(strInput)
  const result1 = calibrator(input)
  console.log(`Part 1: Sum of test values: ${result1}`)

  const result2 = calibrator(input, ["*", "+", "||"])
  console.log(`Part 2: Sum of test values: ${result2}`)
}
