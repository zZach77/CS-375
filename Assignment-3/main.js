var gl;
var cube;
var time = 0;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    cube = new Cube(gl);

    cube.P = perspective(100, 1, .1, 100);
    cube.MV = translate(0, 0, 0);

    requestAnimationFrame(render);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    time += 3.0;

    var near = .1;
    var far = 100;
    var aspectRatio = 512 / 512;

    let V = translate(0.0, 0.0, -3.0);
    let P = perspective(100, aspectRatio, near, far);

    cube.MV = mult(mult(rotateX(time / 3.5), rotateY(time / 2.5)), rotateZ(time / 3));
    cube.P = P;
    cube.MV = mult(V, cube.MV);

    cube.render();
    requestAnimationFrame(render);
}

window.onload = init;