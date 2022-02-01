const positions = [
    0, 0, 0, 0.5, 0.7, 0,
    0.7, 0.5, 0.7, 0, 0, 0.5,
    0, 0.5, 0.35, 0.75, 0.7, 0.5
];

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
  const canvas = document.getElementById("graph");
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
    source: fragmentShaderCode
  });

  const app = gl.createProgram()
  gl.attachShader(app, vertexShader)
  gl.attachShader(app, fragmentShader)
  gl.linkProgram(app)

  if(!gl.getProgramParameter(app, gl.LINK_STATUS)){
      console.error( gl.getProgramInfoLog )
      gl.deleteProgram(app)
      return
  }
  gl.useProgram(app)

  const draw = () => {
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    const positionAttributeLocation = gl.getAttribLocation(app, "a_position")
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation,2,gl.FLOAT,false,0,0)
    gl.drawArrays(gl.TRIANGLES,0, (positions.length / 2))
  }

  setInterval( () => {
    for(let index in positions){
        if(index % 2 == 0)
            positions[index] *= 0.01 * ( index % 4 == 0 ? -1: 1)  + Math.cos(Math.PI * ( index % 4 == 0 ? -1: 1));
        else
            positions[index] *= 0.01 * ( index % 4 == 0 ? -1: 1)  + Math.cos(Math.PI * ( index % 4 == 0 ? -1: 1));
    }
    draw();
  }, 100)
};

window.onload = program;

program();
