import * as path from "jsr:@std/path";

export const partOne = async (file: Deno.FsFile, chunkSize = 8) => {
  let leftOver = "";
  const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const matches = [];
  while (true) {
    const buffer = new Uint8Array(chunkSize);
    const bytesRead = await file.read(buffer);

    // If the chunkSize is longer than the file contents, bytesRead will be null
    // and the function will exit without doing anything at all.
    if (!bytesRead) {
      break;
    }
    const contents = leftOver + (new TextDecoder().decode(buffer));
    const match = pattern.exec(contents);
    if (match) {
      // Take the contents and slice it off at the end of the match
      // so that you can look for more matches in the rest of the contents.
      leftOver = contents.slice(match.index + match[0].length);
      matches.push([Number(match[1]), Number(match[2])]);
    } else {
      leftOver = contents;
    }
  }
  return matches;
};

export const partTwo = async (file: Deno.FsFile, chunkSize = 8) => {
  let leftOver = "";
  let enabled = true; // Initial state for state machine
  const pattern = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g;
  const matches = [];

  while (true) {
    const buffer = new Uint8Array(chunkSize);
    const bytesRead = await file.read(buffer);

    if (!bytesRead) {
      break;
    }
    const contents = leftOver + (new TextDecoder().decode(buffer));
    const match = pattern.exec(contents);
    if (match) {
      leftOver = contents.slice(match.index + match[0].length);
      if (match[0] === "do()") {
        enabled = true;
      } else if (match[0] === "don't()") {
        enabled = false;
      } else if (enabled) {
        matches.push([Number(match[1]), Number(match[2])]);
      }
    } else {
      leftOver = contents;
    }
  }
  return matches;
};

export const sumOfProducts = (matches: number[][]) =>
  matches.map(([i, j]) => i * j).reduce((sum, product) => sum + product, 0);

if (import.meta.main) {
  try {
    const file = await Deno.open(path.resolve(Deno.cwd(), Deno.args[0]), {
      read: true,
    });

    // Part 1
    const matches1 = await partOne(file);
    const result1 = sumOfProducts(matches1);
    console.log(`Part 1, uncorrupted instructions: ${result1}`);

    // Part 2, rewind to beginning of file
    await file.seek(0, Deno.SeekMode.Start);
    const matches2 = await partTwo(file, 4); // Not sure why we need smaller chunks for correct result.
    const result2 = sumOfProducts(matches2);
    console.log(`Part 2, uncorrupted instructions: ${result2}`);

    file.close();
  } catch (e) {
    console.error("Error opening file:", e);
  }
}
