import { assertEquals } from "@std/assert";
import {
  add,
  allDecreasing,
  allIncreasing,
  dampener,
  levelDiffOkay,
  reports,
} from "./main.ts";

const input = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

Deno.test(function reporTest() {
  const expected = [
    [7, 6, 4, 2, 1],
    [1, 2, 7, 8, 9],
    [9, 7, 6, 2, 1],
    [1, 3, 2, 4, 5],
    [8, 6, 4, 4, 1],
    [1, 3, 6, 7, 9],
  ];
  const result = reports(input);
  assertEquals(result, expected);
});

Deno.test(function allIncreasingTest1() {
  const result = allIncreasing([7, 6, 4, 2, 1]);
  assertEquals(result, false);
});

Deno.test(function allIncreasingTest2() {
  const result = allIncreasing([1, 2, 3, 4, 5, 6]);
  assertEquals(result, true);
});

Deno.test(function allIncreasingTest3() {
  const result = allIncreasing([1, 2, 2, 3, 4, 5]);
  assertEquals(result, false);
});

Deno.test(function allDecreasingTest1() {
  const result = allDecreasing([7, 6, 4, 2, 1]);
  assertEquals(result, true);
});

Deno.test(function allDecreasingTest2() {
  const result = allDecreasing([1, 2, 3, 4, 5, 6]);
  assertEquals(result, false);
});

Deno.test(function allDecreasingTest3() {
  const result = allDecreasing([7, 7, 4, 2, 1]);
  assertEquals(result, false);
});

Deno.test(function levelDiffOkayTest1() {
  const result = levelDiffOkay([7, 7, 4, 2, 1]);
  assertEquals(result, false);
});

Deno.test(function levelDiffOkayTest2() {
  const result = levelDiffOkay([1, 3, 6, 7, 9]);
  assertEquals(result, true);
});

Deno.test(function safeReportsTest1() {
  const safeReports = reports(input)
    .filter((report) =>
      (allIncreasing(report) || allDecreasing(report)) && levelDiffOkay(report)
    );
  assertEquals(safeReports.length, 2);
});

Deno.test(function safeWithDampenerTest1() {
  const safeReports = reports(input)
    .filter((report) => dampener(report).length > 0);
  assertEquals(safeReports.length, 4);
});
