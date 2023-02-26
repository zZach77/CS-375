function Cube(gl) {
    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = "Cube-vertex-shader";
    var fragShdr = "Cube-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);

    if (this.program < 0) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }
    
    this.positions = {numComponents : 3};
    
    var positions = [ 
        // front face
        -0.5, 0.5, 1.0,   // 0
        -0.5, -0.5, 1.0,  // 1
        0.5, -0.5, 1.0,   // 2
        0.5, 0.5, 1.0,    // 3

        // back face
        -0.5, 0.5, -1.0,  // 4
        -0.5, -0.5, -1.0, // 5
        0.5, -0.5, -1.0,  // 6
        0.5, 0.5, -1.0    // 7
    ];

    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );
    this.positions.attributeLoc = gl.getAttribLocation( this.program, "aPosition" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );

    this.colors = {numComponents : 4};

    var colors = [
        // front face
        0.0, 1.0, 1.0, 1.0,

        // back face
        1.0, 0.0, 1.0, 1.0,

        // top face
        1.0, 1.0, 0.0, 1.0,

        // bottom face
        1.0, 0.0, 0.0, 1.0,

        // left face
        0.0, 1.0, 0.0, 1.0,

        // right face
        1.0, 0.0, 1.0, 1.0
    ];

    this.colors.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.colors.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW );
    this.colors.attributeLoc = gl.getAttribLocation( this.program, "aColor" );
    gl.enableVertexAttribArray( this.colors.attributeLoc );

    var indices = [
        // front face
        0, 1, 2,
        0, 2, 3,

        // back face
        4, 5, 6,
        4, 6, 7,

        // top face
        4, 0, 3,
        4, 3, 7,

        // bottom face
        5, 1, 2,
        5, 2, 6,

        // left face
        4, 5, 1,
        4, 1, 0,

        // right face
        3, 2, 6,
        3, 6, 7
    ];

    this.indices = {count : indices.length};

    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );

    this.render = function() {
        gl.useProgram( this.program );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.colors.buffer );
        gl.vertexAttribPointer( this.colors.attributeLoc, this.colors.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );
 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );

        gl.drawElements( gl.TRIANGLES, this.indices.count, gl.UNSIGNED_SHORT, 0 );
    }
};

