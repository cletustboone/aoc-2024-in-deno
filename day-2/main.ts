export const reports = (str: string) =>
  str.trim().split("\n").map((line) => line.split(" ").map(Number));

export const allIncreasing = (report: number[]) =>
  report.reduce((acc, curr, i) => {
    // If we are at the end of the array of numbers
    // Just return the accumulator because we've already
    // checked if all the numbers are increasing
    if (i === report.length - 1) {
      return acc;
    }
    if (curr < report[i + 1]) {
      return acc;
    }
    return false;
  }, true);

export const levelDiffOkay = (report: number[]) =>
  report.reduce((acc, curr, i) => {
    if (i === report.length - 1) {
      return acc;
    }
    if (
      Math.abs(curr - report[i + 1]) >= 1 &&
      Math.abs(curr - report[i + 1]) <= 3
    ) {
      return acc;
    }
    return false;
  }, true);

export const allDecreasing = (report: number[]) =>
  report.reduce((acc, curr, i) => {
    if (i === report.length - 1) {
      return acc;
    }
    if (curr > report[i + 1]) {
      return acc;
    }
    return false;
  }, true);

export const dampener = (report: number[]) =>
  report.reduce((acc: number[], _, i) => {
    // New array with item at index i removed
    const levels = report.toSpliced(i, 1);
    // Test new array to see if it passes
    if (
      (allIncreasing(levels) || allDecreasing(levels)) && levelDiffOkay(levels)
    ) {
      acc.push(i);
    }
    return acc;
  }, []);

if (import.meta.main) {
  const input = await Deno.readTextFile(Deno.args[0]);
  const reps = reports(input);

  const safePart1 = reps.filter((report) =>
    (allIncreasing(report) || allDecreasing(report)) && levelDiffOkay(report)
  );
  console.log(`Part 1, number of safe reports: ${safePart1.length}`);

  const safePart2 = reps.filter((report) => dampener(report).length > 0);
  console.log(`Part 2, number of safe reports: ${safePart2.length}`);
}
