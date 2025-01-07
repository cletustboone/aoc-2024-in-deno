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

// Traverse the grid, avoiding obstacles, and tracking visited positions,
// as well as positions where the path turns on a 90 degree axis.
// If traversal results in an endless loop, exit, and report that a loop condition exists.
// Assumes we start heading north from a starting position.
export const traverse = (
  grid: string[][],
  startPosition: number[],
) => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  let heading = [-1, 0]; // north
  let headingIndex = 0;
  let [headingX, headingY] = heading;
  let [x, y] = startPosition;
  let [nextX, nextY] = [x + headingX, y + headingY];
  const visited = new Map();
  const edgeTips = new Set();
  let looping = false;
  visited.set(`${x},${y}`, (visited.get(`${x},${y}`) || 0) + 1);

  // Until going to the next position puts us off the board...
  do {
    // Obstacle ahead?
    const nextChar = grid[nextX][nextY];
    if (nextChar === "#") {
      const tipKey = [x, y, headingX, headingY].join(",");
      // Record position and orientation where direction changed
      // If you wind up in the same position in the same orientation,
      // you're in a loop.
      if (edgeTips.has(tipKey)) {
        looping = true;
      } else {
        edgeTips.add(tipKey);
      }
      // New heading
      headingIndex = (headingIndex + 1) % 4;
      heading = Object.values(directions[headingIndex]).at(0)!;
      headingX = heading[0];
      headingY = heading[1];
      // x,y stays the same, but nextX, nextY is different
      // After you change headings, the next character might be an obstacle
      nextX = x + headingX;
      nextY = y + headingY;
      continue;
    }
    // Change x and y for next iteration
    x = x + headingX;
    y = y + headingY;
    // Change nextX and nextY for next iteration
    nextX = nextX + headingX;
    nextY = nextY + headingY;
    visited.set(`${x},${y}`, (visited.get(`${x},${y}`) || 0) + 1);
  } while (validCoord(nextX, nextY, numCols, numRows) && !looping);
  return {
    visited: visited.size,
    looping,
  };
};

if (import.meta.main) {
  const strGrid = await Deno.readTextFile(Deno.args[0]);
  const grid = toGrid(strGrid);
  const startPosition = positions(grid, "^").at(0)!;
  const result1 = traverse(grid, startPosition);
  console.log(
    `Part 1: Visited ${result1.visited} unique locations. Loop detected? ${
      result1.looping ? "Yes" : "No"
    } `,
  );

  // Use a set for O(1) lookup of obstacle positions
  const obstaclePositions = positions(grid, "#");
  const obstacleSet = obstaclePositions.reduce(
    (set, position) => set.add(`${position[0]},${position[1]}`),
    new Set(),
  );

  const pos = [];
  // Go through each grid position, skipping the starting position
  // and positions with obstacles. Place a new obstacle in the grid,
  // and traverse and record when a loop condition exists.
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      // Skip start position and positions with obstacles
      if (
        (row === startPosition[0] && col === startPosition[1]) ||
        (obstacleSet.has(`${row},${col}`))
      ) {
        continue;
      } else {
        // Create a new grid here.
        const newGrid = grid.map((r, rowIndex) =>
          r.map((_c, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return "#";
            }
            return grid[rowIndex][colIndex];
          })
        );
        const result = traverse(newGrid, startPosition);
        if (result.looping) {
          pos.push([row, col]);
        }
      }
    }
  }
  console.log(
    `Part 2: Found ${pos.length} obstacle positions that result in loops.`,
  );
}
