// Example: lerp(0.5, 0.0, 1.0) == 0.5
let lerp = (t, p1, p2) => (1 - t) * p1 + t * p2;

// Example: reduce(0.5, ...[0.0, 1.0, 2.0, 3.0]) == [0.5, 1.5, 2.5]
let reduce = (t, p1, p2, ...ps) =>
  ps.length > 0
    ? [lerp(t, p1, p2), ...reduce(t, p2, ...ps)]
    : [lerp(t, p1, p2)];

// Example: deCasteljau(0.5, [0.0, 1.0, 2.0, 3.0]) == 1.5
let deCasteljau = (t, ps) =>
  ps.length > 1 ? deCasteljau(t, reduce(t, ...ps)) : ps[0];

let positions = [];
let pointX2 = 0.7;
let pointY2  = 1.0;
let pointX1 = 0;
let pointY1 = 0;
let rotate = 0;
let escala = 0;

const vertexShaderCode = `
            attribute vec4 a_position;
    
            void main() {
                gl_Position = a_position;
            }
        `;

const fragmentShaderCode = `
            precision mediump float;
    
            void main() {
                gl_FragColor = vec4(1.0,0.0,0.0,1.0);
            }
        `;

const createShader = ({ gl, type, source }) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) return shader;

  gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
};

const program = () => {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Not supported");
    return;
  }

  const vertexShader = createShader({
    gl: gl,
    type: gl.VERTEX_SHADER,
    source: vertexShaderCode,
  });

  const fragmentShader = createShader({
    gl: gl,
    type: gl.FRAGMENT_SHADER,
    source: fragmentShaderCode,
  });

  const app = gl.createProgram();
  gl.attachShader(app, vertexShader);
  gl.attachShader(app, fragmentShader);
  gl.linkProgram(app);

  if (!gl.getProgramParameter(app, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog);
    gl.deleteProgram(app);
    return;
  }
  gl.useProgram(app);

  const draw = () => {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const positionAttributeLocation = gl.getAttribLocation(app, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, positions.length / 2);
  };

  //Using setInterval create a animation changing the values of the curve
  let i = 1;
  let cases = 1;
  const interval = setInterval(() => {
    const t = i / 100;
    const x = deCasteljau(
      t,
      [0,0, pointX2, pointY2 ].map((x) => x - 0.5)
    );
    const y = deCasteljau(t, [0, 0.5, pointX1, pointY1]);

    positions.push(escala*x+x*Math.cos(rotate) - Math.sin(rotate)*y, escala*y+y*Math.cos(rotate) + Math.sin(rotate)*x);
    i += 1;
    draw();
    if (cases === 100) {
      i = 1;
      cases = 1;
      //positions = [];
      clearInterval(interval);
    }
    cases++;
  }, 10);
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
  rotate = e.target.value * Math.PI / 180;
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
 
