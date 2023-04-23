function combie(param1, param2) {
    if (typeof param1 === "string" || typeof param2 === "string") {
        return param1.toString() + param2.toString();
    }
    return param1 + param2;
}
combie(2, "up");
function merge(objA, objB) {
    return Object.assign({}, objA, objB);
}
var x = {
    name: "Bob"
};
var y = {
    age: 30
};
var merged = merge(x, y);
var merged2 = merge(["string"], y);
function getLength(str) {
    return str.length;
}
var result = getLength({ name: "bob" });
console.log(result);
