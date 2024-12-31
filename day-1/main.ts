// Turn input into a 2D array. 2nd argument specifies how to split a row.
export const toMatrix = (str: string, char: string) =>
  str.trim().split("\n").map((row) => row.trim().split(char));

// Make an array of strings an array of numbers
export const toNumerical = ([l, r]: string[]) => [Number(l), Number(r)];

// Get a particular column of an array 
export const getColumn = (col: number) => (row: number[]) => row[col];

// Combine values from 2 arrays into pairs of values
export const pairs = (col1: number[], col2: number[]) =>
  col1.map((val: number, i) => [val, col2[i] || 0]);

// Get the absolute difference between 2 numbers
export const diffColumns = ([l, r]: number[]) => Math.abs(l - r);

// Add numbers whee!
export const sum = (acc: number, val: number) => acc + val;

// Set up a map from an array of numbers indicating
// how many times a particular number appears in the array.
export const colMap = (col: number[]) =>
  col.reduce((map, val) => {
    if (map.has(val)) {
      map.set(val, map.get(val) + 1);
    } else {
      map.set(val, 1);
    }
    return map;
  }, new Map());

// Create a reducer that increases a value by a
// multiplier contained in a map or zero if the
// value isn't present in the map.
export const multiplier =
  (map: Map<number, number>) => (acc: number, val: number) =>
    acc + (val * (map.get(val) || 0));

if (import.meta.main) {
  const input = await Deno.readTextFile(Deno.args[0]);
  const arr = toMatrix(input, "   ").map(toNumerical);

  // Isolate columns and sort.
  const col1 = arr.map(getColumn(0)).sort();
  const col2 = arr.map(getColumn(1)).sort();

  // Combine back into pairs after sort and find sum of absolute diffs.
  const distance = pairs(col1, col2).map(diffColumns).reduce(sum, 0);
  console.log(`Part 1 distance: ${distance}`);

  // Setup the map for the reducer
  const map = colMap(col2);
  const similarity = col1.reduce(multiplier(map), 0);
  console.log(`Part 2 similarity: ${similarity}`);
}
