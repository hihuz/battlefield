// idea :
// 1) validate that there are 0 diagonal neighbors
// 2) validate that no cell has neighbors in an perpendicular way (this will also validate that no cell has more than 2 neighbors)
// 1 and 2 pretty much ensure that there are no overlapping ships
// 3) count submarines, simply the number of cells that have 0 neighbors, 1 pass
// 4) count destroyers, simply the number of cells that have 1 neighbor, and to which the neighbor has also 1 neighbor for this pass, keep a map of 'explored cells' to not count the same destroyer twice
// 5) count cruisers, simply the number of cells that have 2 neighbors, both of which have 1 single neighbor

// maybe keep a map of 0 neighbors, 1 neighbor, 2 neighbors cells

// This is a first validation check
const hasDiagonalNeighbors = ({ x, y }, field) =>
  [
    Boolean(field[y - 1][x - 1]),
    Boolean(field[y + 1][x - 1]),
    Boolean(field[y - 1][x + 1]),
    Boolean(field[y - 1][x + 1])
  ].filter(exists => exists).length > 0;

// this should count only valid neighbors, invalid cells have already been ruled out
const getNeighbors = ({ x, y, field }) => [
  { x, y: y - 1, filled: y > 0 ? Boolean(field[y - 1][x]) : false },
  { x: x - 1, y, filled: x > 0 ? Boolean(field[y][x - 1]) : false },
  { x: x + 1, y, filled: x < field[y].length - 1 ? Boolean(field[y][x + 1]) : false },
  { x, y: y + 1, filled: y < field.length - 1 ? Boolean(field[y + 1][x]) : false }
];

const hasHorizontalNeighbors = neighbors => neighbors[1].filled || neighbors[2].filled;

const hasVerticalNeighbors = (neighbors, field) => neighbors[0].filled || neighbors[3].filled;

const hasPerpendicularNeighbors = cell =>
  hasHorizontalNeighbors(cell) && hasVerticalNeighbors(cell);

const countNeighbors = neighbors => neighbors.filter(neighbor => neighbor.filled).length;

const countSubmarines = flatField =>
  flatField.filter(({ neighbors, filled }) => filled && countNeighbors(neighbors) === 0).length;

// Neighborception
const countDestroyers = ({ flatField, field }) => {
  const destroyers = flatField.filter(
    ({ neighbors, filled }) =>
      filled &&
      countNeighbors(neighbors) === 1 &&
      neighbors[0].x >= 0 &&
      neighbors[0].y >= 0 &&
      countNeighbors(getNeighbors({ x: neighbors[0].x, y: neighbors[0].y, field })) === 1
  );
  console.log(destroyers);
  return destroyers.length / 2;
};

const flattenField = field =>
  field.reduce(
    (acc, cur, y) => [
      ...acc,
      ...cur.map((cell, x) => ({
        x,
        y,
        neighbors: getNeighbors({ x, y, field }),
        // This is largely a useless notion, I could simply filter out cells that are not filled
        filled: Boolean(cell)
      }))
    ],
    []
  );

const validateBattlefield = field => {
  const flatField = flattenField(field);

  console.log("field", field);
  console.log("submarines", countSubmarines(flatField));
  console.log("destroyers", countDestroyers({ flatField, field }));

  if (
    flatField.find(cell => hasPerpendicularNeighbors(cell) || hasDiagonalNeighbors({ cell, field }))
  ) {
    console.log("we found perpendicular or diagonal neighbors, shoot");
    return false;
  }
  return field;
};
// [ [ 1, 0, 0, 0, 0, 1, 1, 0, 0, 0 ],
//   [ 1, 0, 1, 0, 0, 0, 0, 0, 1, 0 ],
//   [ 1, 0, 1, 0, 1, 1, 1, 0, 1, 0 ],
//   [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
//   [ 0, 0, 0, 0, 1, 1, 1, 0, 0, 0 ],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
//   [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
//   [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ],
//   [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ]

export {
  hasDiagonalNeighbors,
  getNeighbors,
  hasPerpendicularNeighbors,
  countNeighbors,
  countSubmarines,
  countDestroyers,
  flattenField
};
