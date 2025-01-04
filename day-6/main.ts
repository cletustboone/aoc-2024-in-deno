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

export const loopDetected = (edgeTips: Set<number[]>) => {
  const coordinates = edgeTips.values().toArray();
  if (!coordinates || coordinates.length < 2) return false;

  const vectors = [];
  // Look at start and end of edges.
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [startX, startY] = coordinates[i];
    const [endX, endY] = coordinates[i + 1];
    // Vertical?
    if (startY === endY) {
      vectors.push([endX - startX, 0]);
    }
    // Horizontal?
    if (startX === endX) {
      vectors.push([0, endY - startY]);
    }
  }

  let x = 0, y = 0;
  const visitedPoints = new Set();
  visitedPoints.add(`${x},${y}`);

  // Check cumulative x,y distance traveled.
  for (const [dx, dy] of vectors) {
    x += dx;
    y += dy;
    // Have we been here before? If yes, we're in a loop.
    if (visitedPoints.has(`${x},${y}`)) {
      return true;
    }
    visitedPoints.add(`${x},${y}`);
  }

  // If cumulative distance traveled is 0, you are in a loop.
  return x === 0 && y === 0;
};

// Traverse the grid, avoiding obstacles, and tracking visited positions,
// as well as positions where the path turns on a 90 degree axis.
// If traversal results in an endless loop, exit, and report that a loop condition exists.
// Assumes we start heading north from a starting position.
export const traverse = (
  grid: string[][],
  startPosition: number[]
) => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  let heading = [-1, 0]; // north
  let headingIndex = 0;
  let [headingX, headingY] = heading;
  let [x, y] = startPosition;
  let [nextX, nextY] = [x + headingX, y + headingY];
  const visited = new Map();
  const edgeTips: Set<number[]> = new Set();
  edgeTips.add([x, y]);
  let looping = false;
  visited.set(`${x},${y}`, (visited.get(`${x},${y}`) || 0) + 1);

  // Until going to the next position puts us off the board...
  do {
    // Obstacle ahead?
    const nextChar = grid[nextX][nextY];
    if (nextChar === "#") {
      // Record position where direction changed
      edgeTips.add([x, y]);
      looping = loopDetected(edgeTips);
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
  console.log(`Part 1: Visited ${result1.visited} unique locations. Loop detected? ${result1.looping ? "Yes" : "No"} `);
}
