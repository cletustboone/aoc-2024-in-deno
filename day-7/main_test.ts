import { assertEquals } from "@std/assert";
import { generateArrangements, calibrator, prepareInput } from "./main.ts";

const strInput1 = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`;
Deno.test("the string input gets properly prepared", () => {
  const result = prepareInput(strInput1);
  assertEquals(result.length, 9)
});

Deno.test("generates 8 permutations of operators for 3 open slots", () => {
  const result = generateArrangements(["+", "*"], 3);
  assertEquals(result.length, 8);
});

Deno.test("hanldes large numbers of slots", () => {
  const result = generateArrangements(["+", "*", "||"], 11);
  assertEquals(result.length, 177147)
});

Deno.test("sums outcomes that are possible", () => {
  const input = prepareInput(strInput1);

  const sum = calibrator(input)
  assertEquals(sum, 3749)
});

Deno.test("uses the || operator correctly", () => {
  const input = prepareInput(strInput1)
  const sum = calibrator(input, ["*", "+", "||"])
  assertEquals(sum, 11387)
})
