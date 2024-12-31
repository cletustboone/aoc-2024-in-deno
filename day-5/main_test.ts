import { assertEquals } from "@std/assert";
import {
  addMiddles,
  afterRules,
  oddsLengthOnly,
  reOrderUpdate,
  beforeRules,
  toMatrix,
  validUpdate,
} from "./main.ts";

const rules = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13
`;

const updates = `
75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`;
const updatesArr = toMatrix(updates, ",");
const rulesArr = toMatrix(rules, "|");

Deno.test(function beforeRulesTest1() {
  const hash = beforeRules(rulesArr);
  const expected = {
    "29": ["13"],
    "47": ["53", "13", "61", "29"],
    "53": ["29", "13"],
    "61": ["13", "53", "29"],
    "75": ["29", "53", "47", "61", "13"],
    "97": ["13", "61", "47", "29", "53", "75"],
  };
  assertEquals(hash, expected);
});

Deno.test(function afterRulesTest1() {
  const hash = beforeRules(rulesArr);
  const invertedHash = afterRules(hash);
  const expected = {
    "13": ["29", "47", "53", "61", "75", "97"],
    "29": ["47", "53", "61", "75", "97"],
    "47": ["75", "97"],
    "53": ["47", "61", "75", "97"],
    "61": ["47", "75", "97"],
    "75": ["97"],
  };
  assertEquals(invertedHash, expected);
});

Deno.test(function validUpdateTest1() {
  const hash = beforeRules(rulesArr);
  const invertedHash = afterRules(hash);
  assertEquals(validUpdate(updatesArr[0], hash, invertedHash), true);
  assertEquals(validUpdate(updatesArr[1], hash, invertedHash), true);
  assertEquals(validUpdate(updatesArr[2], hash, invertedHash), true);
  assertEquals(validUpdate(updatesArr[3], hash, invertedHash), false);
  assertEquals(validUpdate(updatesArr[4], hash, invertedHash), false);
  assertEquals(validUpdate(updatesArr[5], hash, invertedHash), false);
});

Deno.test(function oddsLengthOnlyTest1() {
  const res1 = oddsLengthOnly(["1", "2", "3"]);
  const res2 = oddsLengthOnly(["1", "2", "3", "4"]);
  assertEquals(res1, true);
  assertEquals(res2, false);
});

Deno.test(function addMiddlesTest1() {
  const updates = [
    ["34", "12", "2"],
    ["26", "5", "5"],
    ["14", "6", "1"],
  ];
  const res1 = updates.reduce(addMiddles, 0);
  assertEquals(res1, 23);
});

Deno.test(function reOrderTest1() {
  const hash = beforeRules(rulesArr);
  const invertedHash = afterRules(hash);
  const invalids = updatesArr.filter((update) =>
    !validUpdate(update, hash, invertedHash)
  );

  assertEquals(reOrderUpdate(invalids[0], hash, invertedHash), [
    "97",
    "75",
    "47",
    "61",
    "53",
  ]);
  assertEquals(reOrderUpdate(invalids[1], hash, invertedHash), [
    "61",
    "29",
    "13",
  ]);
  assertEquals(reOrderUpdate(invalids[2], hash, invertedHash), [
    "97",
    "75",
    "47",
    "29",
    "13",
  ]);
});
