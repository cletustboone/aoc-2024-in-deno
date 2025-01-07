import { assertEquals } from "@std/assert";
import { positions, toGrid, traverse } from "./main.ts";

const strState1 = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`;

Deno.test(function navigateTest() {
  const grid = toGrid(strState1);
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition);
  assertEquals(result.visited, 41);
});

// 6,3
const obstacle1 = `
....#.....
....+---+#
....|...|.
..#.|...|.
....|..#|.
....|...|.
.#.#^---+.
........#.
#.........
......#...
`;
Deno.test(function loopDetectionTest1() {
  const grid = toGrid(obstacle1);
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition);
  assertEquals(result.looping, true);
});

// 7, 6
const obstacle2 = `
....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
......#.#.
#.........
......#...
`;
Deno.test(function loopDetectionTest2() {
  const grid = toGrid(obstacle2);
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition);
  assertEquals(result.looping, true);
});

// 7, 7
const obstacle3 = `
....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
.+----+##.
#+----+...
......#...
`;
Deno.test(function loopDetectionTest3() {
  const grid = toGrid(obstacle3);
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition);
  assertEquals(result.looping, true);
});

// 8, 1
const obstacle4 = `
....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
..|...|.#.
##+---+...
......#...
`;
Deno.test(function loopDetectionTest4() {
  const grid = toGrid(obstacle4);
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition);
  assertEquals(result.looping, true);
});

// 8, 3
const obstacle5 = `
....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
....|.|.#.
#..#+-+...
......#...
`;
Deno.test(function loopDetectionTest5() {
  const grid = toGrid(obstacle5);
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition);
  assertEquals(result.looping, true);
});

// 9, 7
const obstacle6 = `
....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
.+----++#.
#+----++..
......##..
`;
Deno.test(function loopDetectionTest7() {
  const grid = toGrid(obstacle6);
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition);
  assertEquals(result.looping, true);
});

// Straight line loop
const obstacle7 = `
....#.....
.........#
..........
..#.#.....
.....#.#..
..........
.#..^.....
...#....#.
#...#.....
......#...
`;
Deno.test(function loopDetectionStraightLine() {
  const grid = toGrid(obstacle7);
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition);
  assertEquals(result.looping, true);
});

// 5,4
const obstacle8 = `
....#.....
.........#
..........
..#.......
.......#..
....#.....
.#..^.....
........#.
#.........
......#...
`;
Deno.test(function loopDetectionRightAboveStart() {
  const grid = toGrid(obstacle8);
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition);
  assertEquals(result.looping, false);
});
