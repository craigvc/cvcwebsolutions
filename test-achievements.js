// Test the exact logic from the minified code
let e = {
  achievements: "47% faster load times, 2.3x mobile conversions, 68% bounce rate reduction"
};

let t = [];
e.achievements && (
  typeof e.achievements === "string" 
    ? t = e.achievements.split(",").map(e => e.trim()).filter(e => e) 
    : Array.isArray(e.achievements) && (t = e.achievements)
);

console.log("Input:", e.achievements);
console.log("Result:", t);
console.log("Is Array:", Array.isArray(t));
console.log("Length:", t.length);

// Now test what gets returned
const result = {
  ...e,
  achievements: t
};

console.log("\nFinal result achievements:", result.achievements);
console.log("Final is array:", Array.isArray(result.achievements));