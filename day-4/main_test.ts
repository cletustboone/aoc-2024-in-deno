import { assertEquals } from "@std/assert";
import { partOne, partTwo, starts, toGrid, validCoord } from "./main.ts";

const input1 = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;

const input2 = `
.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........
`;

Deno.test(function toGridTest01() {
  const str = `
    ..X...
    .SAMX.
    .A..A.
    XMAS.S
    .X....
  `;
  assertEquals(toGrid(str), [
    [".", ".", "X", ".", ".", "."],
    [".", "S", "A", "M", "X", "."],
    [".", "A", ".", ".", "A", "."],
    ["X", "M", "A", "S", ".", "S"],
    [".", "X", ".", ".", ".", "."],
  ]);
});

Deno.test(function startsTest01() {
  const str = `
    ..X...
    .SAMX.
    .A..A.
    XMAS.S
    .X....
  `;
  const grid = toGrid(str);
  const result = starts(grid, "XMAS");
  const expected = [[0, 2], [1, 4], [3, 0], [4, 1]];
  assertEquals(result, expected);
});

Deno.test(function validCoordTest1() {
  const grid = toGrid(input1);
  const numRows = grid.length; // 10
  const numCols = grid[0].length; // 10

  // Index a coordinate inbounds
  assertEquals(validCoord(0, 0, numRows, numCols), true);

  // Index a coordinate in the row bounds
  assertEquals(validCoord(9, 0, numRows, numCols), true);

  // Index a coordinate in the column bounds
  assertEquals(validCoord(0, 9, numRows, numCols), true);

  // Index a coordinate out of the row bounds
  assertEquals(validCoord(10, 0, numRows, numCols), false);

  // Index a coordinate out of the column bounds
  assertEquals(validCoord(0, 10, numRows, numCols), false);

  // Index a coordinate out of the row and column boundaries
  assertEquals(validCoord(100, 100, numRows, numCols), false);
});

Deno.test(function partOneTest() {
  const result = partOne(toGrid(input1));
  assertEquals(result, 18);
});

Deno.test(function partTwoTest() {
  const result = partTwo(toGrid(input2));
  assertEquals(result, 9);
});
