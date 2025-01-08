export const toMatrix = (str: string, char: string) =>
  str.trim().split("\n").map((row) => row.trim().split(char));

export const beforeRules = (rules: string[][]) =>
  rules.reduce((acc: { [key: string]: string[] }, rulePair: string[]) => {
    if (!acc[rulePair[0]]) {
      acc[rulePair[0]] = [rulePair[1]];
    } else {
      acc[rulePair[0]].push(rulePair[1]);
    }
    return acc;
  }, {});

export const afterRules = (hash: { [key: string]: string[] }) =>
  Object.keys(hash).reduce((acc: { [key: string]: string[] }, key) => {
    for (const val of hash[key]) {
      if (!acc[val]) {
        acc[val] = [key];
      } else {
        acc[val].push(key);
      }
    }
    return acc;
  }, {});

export const validUpdate = (
  update: string[],
  printBeforeRules: { [key: string]: string[] },
  printAfterRules: { [key: string]: string[] },
) =>
  // Filters pages that break the rules
  update.map((currentPage) => {
    // Can the current page be printed before all the pages after it?
    const mustPrintBefore = printBeforeRules[currentPage] || [];
    // Can the current page be printed after all the pages before it?
    const mustPrintAfter = printAfterRules[currentPage] || [];
    const pagesAfter = update.slice(update.indexOf(currentPage) + 1);
    const pagesBefore = update.slice(0, update.indexOf(currentPage));

    let state = true;
    mustPrintAfter.forEach((after) => {
      // If there is a page after the current page that
      // must be printed before the current page, it's a violation.
      if (pagesAfter.indexOf(after) >= 0) {
        // console.log(
        //   `%c${currentPage} cannot be printed before ${after}`,
        //   "color: yellow",
        // );
        state = false;
      }
    });
    mustPrintBefore.forEach((before) => {
      if (pagesBefore.indexOf(before) >= 0) {
        // console.log(
        //   `%c${currentPage} cannot be printed after ${before}`,
        //   "color: yellow",
        // );
        state = false;
      }
    });
    return state;
  }).reduce((acc, flag) => acc && flag);

export const reOrderUpdate = (
  update: string[],
  printBeforeRules: { [key: string]: string[] },
  printAfterRules: { [key: string]: string[] },
) => {
  // Sort with comparator
  return update.sort((a, b) => {
    // Can a be printed before b?
    // ...or can 61 be printed before 13?
    const mustPrintBefore = printBeforeRules[a] || [];
    if (mustPrintBefore.indexOf(b) >= 0) return -1;

    // Can b be printed after a?
    // ...or can 13 be printed after 61?
    const mustPrintAfter = printAfterRules[b] || [];
    if (mustPrintAfter.indexOf(a) >= 0) return 1;

    return 0;
  });
};

export const oddsLengthOnly = (update: string[]) => update.length % 2 > 0;
export const addMiddles = (acc: number, update: string[]) => {
  const middleNumber = update[Math.floor(update.length / 2)];
  let num;
  try {
    num = Number(middleNumber);
  } catch (_e) {
    num = 0;
  }
  return acc + num;
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const rules = await Deno.readTextFile(Deno.args[0]);
  const rulesArray = toMatrix(rules, "|");
  const updates = await Deno.readTextFile(Deno.args[1]);
  const updatesArray = toMatrix(updates, ",");
  const printBeforeRules = beforeRules(rulesArray);
  const printAfterRules = afterRules(printBeforeRules);

  // Part 1
  const sumOfMiddles1 = updatesArray.filter((update) =>
    validUpdate(update, printBeforeRules, printAfterRules)
  )
    .filter(oddsLengthOnly)
    .reduce(addMiddles, 0);
  console.log(`Part 1: ${sumOfMiddles1}`);

  // Part 2
  const sumOfMiddles2 = updatesArray.filter((update) =>
    !validUpdate(update, printBeforeRules, printAfterRules)
  )
    .filter(oddsLengthOnly)
    .map((update) => reOrderUpdate(update, printBeforeRules, printAfterRules))
    .reduce(addMiddles, 0);
  console.log(`Part 2: ${sumOfMiddles2}`);
}
