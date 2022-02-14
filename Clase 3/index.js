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
    let next = true;
    let i = 1;
    let cases = 1;
    const interval = setInterval(() => {
        if(next){
            const t = i / 100;
            const x = deCasteljau(t, [0, 0.5, 0.7, 1.0].map( x => x  - .5));
            const y = deCasteljau(t, [0, 0.5, 0.4 ,0.0]);
            positions.push(x, y);
            i += 1;
            draw();
        }
        if( i === 100){
            next = false;
            const m = async () => await new Promise( r=> setTimeout(() => {r()},1000)
            )
            m().then(() => {
                i = 1;
                cases++;
                positions = [];
                next = true;
            })
        }
        if(cases === 10){
            clearInterval(interval);
        }
    }, 10);
    
};

window.onload = program;

program();

//Pieciewise function
// const f = (x) => {
//     if (x < 0.5) {
//         return x * x;
//     } else {
//         return 1 - (1 - x) * (1 - x);
//     }
// }

