import { assertEquals } from "@std/assert";
import { traverse, toGrid, positions} from "./main.ts";

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
`

Deno.test(function navigateTest() {
  const grid = toGrid(strState1)
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition)
  assertEquals(result.visited, 41)
})

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
`
Deno.test(function loopDetectionTest1() {
  const grid = toGrid(obstacle1)
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition)
  assertEquals(result.looping, true)
})

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
`
Deno.test(function loopDetectionTest2() {
  const grid = toGrid(obstacle2)
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition)
  assertEquals(result.looping, true)
})

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
`
Deno.test(function loopDetectionTest3() {
  const grid = toGrid(obstacle3)
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition)
  assertEquals(result.looping, true)
})

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
`
Deno.test(function loopDetectionTest4() {
  const grid = toGrid(obstacle4)
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition)
  assertEquals(result.looping, true)
})

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
`
Deno.test(function loopDetectionTest5() {
  const grid = toGrid(obstacle5)
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition)
  assertEquals(result.looping, true)
})

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
`
Deno.test(function loopDetectionTest6() {
  const grid = toGrid(obstacle6)
  const startPosition = positions(grid, "^").at(0)!;
  const result = traverse(grid, startPosition)
  assertEquals(result.looping, true)
})