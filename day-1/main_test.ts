import { assertEquals } from "@std/assert";
import {
  colMap,
  diffColumns,
  getColumn,
  multiplier,
  pairs,
  sum,
  toMatrix,
  toNumerical,
} from "./main.ts";

const input = `
3   4
4   3
2   5
1   3
3   9
3   3
`;
Deno.test(function numericalTest1() {
  const strArr = toMatrix(input, "   ");
  const numArr = strArr.map(toNumerical);
  const expected = [
    [3, 4],
    [4, 3],
    [2, 5],
    [1, 3],
    [3, 9],
    [3, 3],
  ];
  assertEquals(numArr, expected);
});

Deno.test(function getColumnTest1() {
  const arr = toMatrix(input, "   ").map(toNumerical);
  const expected = [3, 4, 2, 1, 3, 3];
  const result = arr.map(getColumn(0));
  assertEquals(result, expected);
});

Deno.test(function getColumnTest2() {
  const arr = toMatrix(input, "   ").map(toNumerical);
  const expected = [4, 3, 5, 3, 9, 3];
  const result = arr.map(getColumn(1));
  assertEquals(result, expected);
});

Deno.test(function pairsTest1() {
  const arr = toMatrix(input, "   ").map(toNumerical);
  const col1 = arr.map(getColumn(0));
  const col2 = arr.map(getColumn(1));
  const result = pairs(col1, col2);
  assertEquals(result, arr);
});

Deno.test(function diffColumnsTest1() {
  const arr = toMatrix(input, "   ").map(toNumerical);
  const expected = [1, 1, 3, 2, 6, 0];
  const result = arr.map(diffColumns);
  assertEquals(result, expected);
});

Deno.test(function sumTest1() {
  const result = sum(0, 3);
  assertEquals(result, 3);
});

Deno.test(function sortedColumnSumTest1() {
  const arr = toMatrix(input, "   ").map(toNumerical);
  const col1 = arr.map(getColumn(0)).sort();
  const col2 = arr.map(getColumn(1)).sort();
  const result = pairs(col1, col2).map(diffColumns).reduce(sum, 0);
  assertEquals(result, 11);
});

Deno.test(function colMapTest1() {
  const col = [4, 3, 5, 3, 9, 3];
  const expected = new Map();
  expected.set(4, 1);
  expected.set(3, 3);
  expected.set(5, 1);
  expected.set(9, 1);
  const result = colMap(col);
  assertEquals(result, expected);
});

Deno.test(function multiplierTest1() {
  const sourceCol = [3, 4, 2, 1, 3, 3];
  const compareCol = [4, 3, 5, 3, 9, 3];
  const map = colMap(compareCol);
  const reducer = multiplier(map);
  const result = sourceCol.reduce(reducer, 0);
  assertEquals(result, 31);
});
