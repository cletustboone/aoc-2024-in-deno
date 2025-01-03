export const toGrid = (str: string, char: string = "") =>
  str.trim().split("\n").map((row) => row.trim().split(char));

const directions: { [key: string]: number[] }[] = [
  { "^": [-1, 0] },
  { ">": [0, 1] },
  { "v": [1, 0] },
  { "<": [0, -1] },
];

// Starting positions of a particular character.
export const positions = (grid: string[][], word: string) =>
  grid.map((row, rowIndex) =>
    row.map((_col, colIndex) => [rowIndex, colIndex]).filter(([r, c]) =>
      grid[r][c] === word[0]
    )
  ).flat();

// This function checks if the given
// coordinate is valid
export const validCoord = (
  x: number,
  y: number,
  numCols: number,
  numRows: number,
) => (x >= 0 && x < numCols && y >= 0 && y < numRows);

export const traverse = (
  grid: string[][],
) => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const direction = "^";
  let heading = [-1, 0]; // north
  let headingIndex = 0;
  let [headingX, headingY] = heading;
  const position = positions(grid, direction).at(0)!;
  let [x, y] = position;
  let [nextX, nextY] = [x + headingX, y + headingY];
  const visited = new Map();
  visited.set(`${x},${y}`, (visited.get(`${x},${y}`) || 0) + 1);

  // Until going to the next position puts us off the board...
  do {
    // Obstacle ahead?
    const nextChar = grid[nextX][nextY];
    if (nextChar === "#") {
      // New heading
      headingIndex = (headingIndex + 1) % 4;
      heading = Object.values(directions[headingIndex]).at(0)!;
      headingX = heading[0];
      headingY = heading[1];
    }
    // Change x and y for next iteration
    x = x + headingX;
    y = y + headingY;
    // Change nextX and nextY for next iteration
    nextX = x + headingX;
    nextY = y + headingY;
    visited.set(`${x},${y}`, (visited.get(`${x},${y}`) || 0) + 1);
  } while (validCoord(nextX, nextY, numCols, numRows));

  return visited.size;
};

if (import.meta.main) {
  const strGrid = await Deno.readTextFile(Deno.args[0]);
  const grid = toGrid(strGrid);
  const visited1 = traverse(grid);
  console.log(`Part 1: Visited ${visited1} unique locations`);
}
