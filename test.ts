function combie(
  param1: string | number,
  param2: string | number
): string | number {
  if (typeof param1 === "string" || typeof param2 === "string") {
    return param1.toString() + param2.toString();
  }
  return param1 + param2;
}

combie(2, "up");

function merge<A, B>(objA: A, objB: B) {
  return Object.assign({}, objA, objB);
}

const x = {
  name: "Bob",
};

const y = {
  age: 30,
};

const merged = merge(x, y);
const merged2 = merge(["string"], y);

interface ILength {
  length: number;
}

function getLength<T extends ILength>(str: T): number {
  return str.length;
}

const result = getLength({ name: "bob", length: 55 });
console.log(result);
