import { assertEquals } from "@std/assert";
import { partOne, partTwo, sumOfProducts } from "./main.ts";

Deno.test(function sumOfProductsTest() {
    const result = sumOfProducts([[1, 2], [2, 3], [3, 4]]);
    assertEquals(result, 1 * 2 + 2 * 3 + 3 * 4);
});

Deno.test(async function partOneTest() {
    const input1: Deno.FsFile = await Deno.open("input-test-01.txt");
    // Need a smaller chunk size here for some reason.
    const matches = await partOne(input1, 4);
    const result = sumOfProducts(matches);
    assertEquals(result, 161);
    input1.close();
});

Deno.test(async function partTwoTest() {
    const input2: Deno.FsFile = await Deno.open("input-test-02.txt");
    const matches = await partTwo(input2, 4);
    const result = sumOfProducts(matches);
    assertEquals(result, 48);
    input2.close();
});
