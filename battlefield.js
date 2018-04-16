const hasDiagonalNeighbors = ({ x, y }, field) =>
  [
    y > 0 && x > 0 && Boolean(field[y - 1][x - 1]),
    y < field.length - 1 && x > 0 && Boolean(field[y + 1][x - 1]),
    y > 0 && x < field[y].length - 1 && Boolean(field[y - 1][x + 1]),
    y < field.length - 1 && x < field[y].length - 1 && Boolean(field[y + 1][x + 1])
  ].filter(exists => exists).length > 0;

const getNeighbors = ({ x, y, field }) => [
  { x, y: y - 1, filled: y > 0 ? Boolean(field[y - 1][x]) : false },
  { x: x - 1, y, filled: x > 0 ? Boolean(field[y][x - 1]) : false },
  { x: x + 1, y, filled: x < field[y].length - 1 ? Boolean(field[y][x + 1]) : false },
  { x, y: y + 1, filled: y < field.length - 1 ? Boolean(field[y + 1][x]) : false }
];

const hasHorizontalNeighbors = neighbors => neighbors[1].filled || neighbors[2].filled;

const hasVerticalNeighbors = neighbors => neighbors[0].filled || neighbors[3].filled;

const hasPerpendicularNeighbors = (cell, field) => {
  const neighbors = getNeighbors({ x: cell.x, y: cell.y, field });
  return hasHorizontalNeighbors(neighbors) && hasVerticalNeighbors(neighbors);
};

const countNeighbors = neighbors => neighbors.filter(neighbor => neighbor.filled).length;

const countSubmarines = flatField =>
  flatField.filter(({ neighbors, filled }) => filled && countNeighbors(neighbors) === 0).length;

// Neighborception
const countDestroyers = ({ flatField, field }) => {
  return (
    flatField.filter(({ x, y, neighbors, filled }) => {
      const uniqueFilledNeighbor =
        filled && countNeighbors(neighbors) === 1 && neighbors.find(neighbor => neighbor.filled);
      return (
        uniqueFilledNeighbor &&
        countNeighbors(
          getNeighbors({ x: uniqueFilledNeighbor.x, y: uniqueFilledNeighbor.y, field })
        ) === 1
      );
    }).length / 2
  );
};

const countCruisers = ({ flatField, field }) => {
  return flatField.filter(
    ({ x, y, neighbors, filled }) =>
      filled &&
      countNeighbors(neighbors) === 2 &&
      neighbors.filter(
        neighbor =>
          neighbor.filled &&
          countNeighbors(getNeighbors({ x: neighbor.x, y: neighbor.y, field })) === 1
      ).length === 2
  ).length;
};

const countBattleships = ({ flatField, field }) => {
  return (
    flatField.filter(
      ({ x, y, neighbors, filled }) =>
        filled &&
        countNeighbors(neighbors) === 2 &&
        neighbors.filter(
          neighbor =>
            neighbor.filled &&
            countNeighbors(getNeighbors({ x: neighbor.x, y: neighbor.y, field })) === 1
        ).length === 1 &&
        neighbors.filter(
          neighbor =>
            neighbor.filled &&
            countNeighbors(getNeighbors({ x: neighbor.x, y: neighbor.y, field })) === 2
        ).length === 1
    ).length / 2
  );
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

  return (
    !flatField.find(
      cell =>
        cell.filled && (hasPerpendicularNeighbors(cell, field) || hasDiagonalNeighbors(cell, field))
    ) &&
    countSubmarines(flatField) === 4 &&
    countDestroyers({ flatField, field }) === 3 &&
    countCruisers({ flatField, field }) === 2 &&
    countBattleships({ flatField, field }) === 1
  );
};

export {
  hasDiagonalNeighbors,
  getNeighbors,
  hasPerpendicularNeighbors,
  countNeighbors,
  countSubmarines,
  countDestroyers,
  countCruisers,
  countBattleships,
  flattenField
};
