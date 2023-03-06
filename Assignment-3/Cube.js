function Cube(gl) {
    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = "Cube-vertex-shader";
    var fragShdr = "Cube-fragment-shader";

    let program = initShaders(gl, vertShdr, fragShdr);

    if (program < 0) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }
                              //           4--------7
    let positions = [         //          /|       /|
        // front face                    / |      / |
        -0.5, 0.5, 0.5,   // 0          0--------3  |
        -0.5, -0.5, 0.5,  // 1          |  5 - - |- 6
        0.5, -0.5, 0.5,   // 2          | /      | /
        0.5, 0.5, 0.5,    // 3          |/       |/
                          //            1--------2              
        // back face
        -0.5, 0.5, -0.5,  // 4          
        -0.5, -0.5, -0.5, // 5
        0.5, -0.5, -0.5,  // 6
        0.5, 0.5, -0.5    // 7 

    ];

    let aPosition = new Attribute(gl, program, positions, "aPosition", 3, gl.FLOAT);

    let indices = [
        // front face
        3, 0, 2,
        2, 0, 1,

        // back face
        5, 4, 6,
        6, 4, 7,

        // top face
        7, 4, 3,
        3, 4, 0,
        
        // bottom face
        1, 5, 2,
        2, 5, 6,

        // left face
        0, 4, 1,
        1, 4, 5,

        // right face
        7, 3, 6,
        6, 3, 2
    ];

    indices = new Element(gl, indices);

    let MV = new Uniform(gl, program, "MV");
    let P  = new Uniform(gl, program, "P");

    this.render = function() {
        gl.useProgram(program);

        aPosition.enable();
        indices.enable();

        MV.update(this.MV);
        P.update(this.P);

        gl.drawElements(gl.TRIANGLES, indices.count, indices.type, 0);

        aPosition.disable();
        indices.disable();
    }
};

