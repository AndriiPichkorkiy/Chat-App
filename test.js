// const formData = {
//   name: " Alex",
//   password: " qwerty",
// };

// const keys = Object.keys(formData);
// keys.forEach((key) => {
//   formData[key] = formData[key].trim();
// });

// console.log(formData);

const population = {
  male: 4,
  female: 93,
  others: 10,
};

// Iterate through the object
for (const key in population) {
  // if (population.hasOwnProperty(key)) {
  console.log(`${key}: ${population[key]}`);
  // }
}
