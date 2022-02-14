let positions = [];
let pointX2 = 0.7;
let pointY2 = 1.0;
let pointX1 = 0;
let pointY1 = 0;
let rotate = 0;
let escala = 0;

const program = () => {
  const draw = execute("canvas");
  //Using setInterval create a animation changing the values of the curve
  let i = 1;
  let cases = 1;
  const interval = setInterval(() => {
    const t = i / 100;
    const x = deCasteljau(
      t,
      [0, 0, pointX2, pointY2].map((x) => x - 0.5)
    );
    const y = deCasteljau(t, [0, 0.5, pointX1, pointY1]);

    positions.push(
      escala * (x * Math.cos(rotate) - Math.sin(rotate) * y) +
        x * Math.cos(rotate) -
        Math.sin(rotate) * y,
      escala * (y * Math.cos(rotate) + Math.sin(rotate) * x) +
        y * Math.cos(rotate) +
        Math.sin(rotate) * x
    );
    draw(positions);
    i += 1;
    if (cases === 100) {
      i = 1;
      cases = 1;
      //positions = [];
      clearInterval(interval);
    }
    cases++;
  }, 1);
};

window.onload = program;

document.getElementById("pointX2").addEventListener("change", (e) => {
  pointX2 = e.target.value / 100;
  document.getElementById("pointX2-label").innerHTML = pointX2;
  positions = [];
  program();
});

//Repeat the last code for pointX1
document.getElementById("pointX1").addEventListener("change", (e) => {
  pointX1 = e.target.value / 100;
  document.getElementById("pointX1-label").innerHTML = pointX1;
  positions = [];
  program();
});

//Repeat the last code for pointY1
document.getElementById("pointY1").addEventListener("change", (e) => {
  pointY1 = e.target.value / 100;
  document.getElementById("pointY1-label").innerHTML = pointY1;
  positions = [];
  program();
});

//Repeat the last code for pointY2
document.getElementById("pointY2").addEventListener("change", (e) => {
  pointY2 = e.target.value / 100;
  document.getElementById("pointY2-label").innerHTML = pointY2;
  positions = [];
  program();
});

document.getElementById("escala").addEventListener("change", (e) => {
  escala = e.target.value / 100;
  document.getElementById("escala-label").innerHTML = escala;
  positions = [];
  program();
});

document.getElementById("rotate").addEventListener("change", (e) => {
  rotate = (e.target.value * Math.PI) / 180;
  document.getElementById("rotate-label").innerHTML = e.target.value;
  positions = [];
  program();
});

//Pieciewise function
// const f = (x) => {
//     if (x < 0.5) {
//         return x * x;
//     } else {
//         return 1 - (1 - x) * (1 - x);
//     }
// }
