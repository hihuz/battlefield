import {
  hasDiagonalNeighbors,
  getNeighbors,
  hasPerpendicularNeighbors,
  countNeighbors,
  countSubmarines,
  countDestroyers,
  countCruisers,
  countBattleships,
  flattenField
} from "./battlefield";

describe("getNeighbors", () => {
  it("should return the neighbors of a given cell", () => {
    const field = [[0, 1, 0], [1, 0, 1]];
    const expected = [
      { x: 0, y: -1, filled: false },
      { x: -1, y: 0, filled: false },
      { x: 1, y: 0, filled: true },
      { x: 0, y: 1, filled: true }
    ];
    const actual = getNeighbors({ x: 0, y: 0, field });

    expect(actual).toEqual(expected);
  });

  it("should fucking work", () => {
    const field = [
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const expected = [
      { x: 4, y: 1, filled: false },
      { x: 3, y: 2, filled: false },
      { x: 5, y: 2, filled: true },
      { x: 4, y: 3, filled: false }
    ];

    const actual = getNeighbors({ x: 4, y: 2, field });
    expect(actual).toEqual(expected);
  });

  it("should fucking work take 2", () => {
    const field = [
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const expected = [
      { x: 5, y: 1, filled: false },
      { x: 4, y: 2, filled: true },
      { x: 6, y: 2, filled: true },
      { x: 5, y: 3, filled: false }
    ];

    const actual = getNeighbors({ x: 5, y: 2, field });
    expect(actual).toEqual(expected);
  });
});

describe("flattenField", () => {
  it("should flatten a field, duh", () => {
    const field = [[0, 1, 0], [1, 0, 1]];
    const expected = [
      {
        x: 1,
        y: 0,
        neighbors: getNeighbors({ x: 1, y: 0, field })
      },
      {
        x: 0,
        y: 1,
        neighbors: getNeighbors({ x: 0, y: 1, field })
      },
      {
        x: 2,
        y: 1,
        neighbors: getNeighbors({ x: 2, y: 1, field })
      }
    ];

    expect(flattenField(field)).toEqual(expected);
  });
});

describe("countNeighbors", () => {
  it("should return the number of filled neighbors", () => {
    const neighbors = [{ filled: false }, { filled: true }, { filled: true }, { filled: false }];
    expect(countNeighbors(neighbors)).toEqual(2);
  });
});

describe("countSubmarines", () => {
  it("should return the number of submarines in the passed field", () => {
    const field = [
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const flatField = flattenField(field);
    const actual = countSubmarines(flatField);
    const expected = 4;

    expect(actual).toEqual(expected);
  });
});

describe("countDestroyers", () => {
  it("should return the number of destroyers in the passed field", () => {
    const field = [
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const flatField = flattenField(field);
    const actual = countDestroyers({ flatField, field });
    const expected = 3;

    expect(actual).toEqual(expected);
  });
});

describe("countCruisers", () => {
  it("should return the number of cruisers in the passed field", () => {
    const field = [
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const flatField = flattenField(field);
    const actual = countCruisers({ flatField, field });
    const expected = 2;

    expect(actual).toEqual(expected);
  });
});

describe("countBattleships", () => {
  it("should return the number of battleships in the passed field", () => {
    const field = [
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const flatField = flattenField(field);
    const actual = countBattleships({ flatField, field });
    const expected = 1;

    expect(actual).toEqual(expected);
  });
});
