// Order of directions is important for Part 2
const directions = [
  [-1, -1], // northwest
  [-1, 0], // north
  [-1, 1], // northeast
  [0, -1], // west
  [0, 0], // center
  [0, 1], // east
  [1, -1], // southwest
  [1, 0], // south
  [1, 1], // southeast
];

// Convert string input to a 2D array
export const toGrid = (input: string, rowSplit: string = "") =>
  input.trim().split("\n").map((row) => row.trim().split(rowSplit));

// Find starting positions of a word
export const starts = (grid: string[][], word: string) =>
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
  m: number,
  n: number,
) => (x >= 0 && x < m && y >= 0 && y < n);

export const partOne = (grid: string[][], word = "XMAS") =>
  starts(grid, word).reduce((acc, start) => {
    const wordLength = word.length;
    const numRows = grid.length;
    const numCols = grid[0].length;
    const [startX, startY] = start;

    // Go wordLength spaces in each direction (not including the center)
    // and count how many times you find the word.
    const numTimesWordFoundAtStart = directions.filter(([x, y]) =>
      x !== 0 || y !== 0
    ).reduce((count, direction) => {
      const [rowDelta, colDelta] = direction;
      let chars = "";
      for (let i = 0; i < wordLength; i++) {
        const nextPos = [startX + (rowDelta * i), startY + (colDelta * i)];
        const [nextX, nextY] = nextPos;
        if (validCoord(nextX, nextY, numCols, numRows)) {
          const nextChar = grid[nextX][nextY];
          chars += nextChar;
        } else {
          chars = "";
        }
      }
      if (chars === word) {
        count++;
      }
      return count;
    }, 0);
    return acc + numTimesWordFoundAtStart;
  }, 0);

export const partTwo = (grid: string[][], word = "MAS") => {
  const reverseWord = word.split("").reverse().join("");
  const numRows = grid.length;
  const numCols = grid[0].length;

  // Find 3x3 grids with A in the middle.
  // Checks that a 3x3 grid is actually inbounds.
  const crossMasGrids = starts(grid, "A")
    // Finds candidate grids
    .map(([x, y]) =>
      directions.filter(([rowDelta, colDelta]) =>
        validCoord(x + rowDelta, y + colDelta, numCols, numRows)
      )
        .map(([rowDelta, colDelta]) => grid[x + rowDelta][y + colDelta])
    )
    // Filters candidate grids that have word or reverseWord in their diagonals
    .filter((candidateGrid) => {
      // This bit is hard coded to assume that you have a 3x3 grid.
      // And that each position in the array corrseponds 
      // to a particular direction
      const diag1 = candidateGrid[0] + candidateGrid[4] + candidateGrid[8];
      const diag2 = candidateGrid[2] + candidateGrid[4] + candidateGrid[6];
      return (
        (diag1 === word || diag1 === reverseWord) &&
        (diag2 === word || diag2 === reverseWord)
      );
    });
  return crossMasGrids.length;
};

if (import.meta.main) {
  const text = await Deno.readTextFile(Deno.args[0]);
  const grid = toGrid(text);

  const count1 = partOne(grid);
  console.log(`Part 1: XMAS found ${count1} times.`);

  const count2 = partTwo(grid);
  console.log(`Part 2: Cross-MAS found ${count2} times.`);
}
