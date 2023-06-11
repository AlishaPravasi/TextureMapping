"use strict";

// The Cube class makes a unit cube at the center of the world
function Cube(gl, shaderProgram) {
    var t = this;
    this.gl = gl;
    
    // Create a Vertex Array Object.  This remembers the buffer bindings and
    // vertexAttribPointer settings so that we can reinstate them all just using
    // bindVertexArray.
    this.vao = gl.createVertexArray();  // create and get identifier
    gl.bindVertexArray(this.vao);

    this.numVertices = 24;  // total number of vertices
    this.faceVertices = 4;  // number of vertices in a face


    var verts = 
       [0.5, -0.5, -0.5, // +x face
        0.5, 0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,

        -0.5, -0.5, 0.5, // -x face
        -0.5, 0.5, 0.5,
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,

        -0.5, 0.5, -0.5, // +y face
        -0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,

        0.5, -0.5, -0.5, // -y face
        0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,

        -0.5, -0.5, 0.5, // +z face
         0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,

        -0.5, 0.5, -0.5, // -z face
         0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5
    ];

    var colors = 
        [1, 0, 0,   // red
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        0, 1, 0,    // green
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 0, 1,     // blue
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        1, 1, 0,      // yellow
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 0, 1,      // magenta
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        0, 1, 1,      // cyan
        0, 1, 1,
        0, 1, 1,
        0, 1, 1
    ];


    var texCoords = 
       [0, 0,            // +x
        0, 1,           
        1, 0,
        1, 1,

        0, 0,            // -x  
        0, .1,           //10x bigger    
        .1, 0,               
        .1, .1,

        0, 0,           // + y
        0, 1,
        1, 0,
        1, 1,

        0, 0,           // - y
        0, 1,
        1, 0,
        1, 1,

        0, 0,            // +z   
        2, 0,            // 2x smaller
        0, 2,           
        2, 2,

        .5, -.5,            // -z   
        1.5, .5,        // rotate by 45 degrees
        -.5, .5,
        .5, 1.5
    ];

    var floatBytes = 4;  // number of bytes in a float value

    // Create and load the vertex positions
    this.cubeVertVB = gl.createBuffer();  // get unique buffer ID number
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertVB);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verts), gl.STATIC_DRAW);
    this.vPosition = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.vertexAttribPointer(this.vPosition, 3, gl.FLOAT, false, 3 * floatBytes, 0);
    gl.enableVertexAttribArray(this.vPosition);


    // Create and load the vertex colors
    this.cubeColorVB = gl.createBuffer();  // get unique buffer ID number
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeColorVB);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    this.vColor = gl.getAttribLocation(shaderProgram, "vColor");
    gl.vertexAttribPointer(this.vColor, 3, gl.FLOAT, false, 3 * floatBytes, 0);
    gl.enableVertexAttribArray(this.vColor);

    // Create and load the vertex texture coords
    this.cubeTextureVB = gl.createBuffer();  // get unique buffer ID number
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeTextureVB);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);
    this.vTexCoord = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.vertexAttribPointer(this.vTexCoord, 2, gl.FLOAT, false, 2 * floatBytes, 0);
    gl.enableVertexAttribArray(this.vTexCoord);


    // Get uniform variable location for transform matrices
    this.projectionMat = gl.getUniformLocation(shaderProgram, "projectionMat");
    this.viewMat = gl.getUniformLocation(shaderProgram, "viewMat");
    this.modelMat = gl.getUniformLocation(shaderProgram, "modelMat");


    // Texture uniform in frag shader
    this.fTexSampler = gl.getUniformLocation(shaderProgram, "fTexSampler");
    this.fShowTexture = gl.getUniformLocation(shaderProgram, "fShowTexture");
    this.fShowColor = gl.getUniformLocation(shaderProgram, "fShowColor");

    // Init the textureMap - this starts the loading and once loaded sets
    //   some initial paramters.  It also sets a variable to let us know
    //   when it is done loading since it loads asynch.
    this.radioButtons = document.querySelectorAll('input[name="order"]');

    this.InitTexture("brick.png");

    gl.bindVertexArray(null);  // un-bind our vao

}

// Render function that draws the cube
// We need the 3 transformations matrices
//   as well as info about colors, textures and texture filters
Cube.prototype.Render = function (projectionMat, viewMat, modelMat, colorsOn, textureOn) {
    var gl = this.gl;
    // Set up buffer bindings and vertex attributes
    // We did this with the VAO so just use it
    gl.bindVertexArray(this.vao);

    // Set transformation matrices for shader
    gl.uniformMatrix4fv(this.projectionMat, false, flatten(projectionMat));
    gl.uniformMatrix4fv(this.viewMat, false, flatten(viewMat));
    gl.uniformMatrix4fv(this.modelMat, false, flatten(modelMat));
    
    if(document.getElementById("magNearest").checked) 
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
    if(document.getElementById("magLinear").checked)
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
    if(document.getElementById("minNearest").checked) 
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }
    if(document.getElementById("minLinear").checked)
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    if(document.getElementById("minLinearMipLinear").checked)
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    }

    // Set up texture
    // Note that for this lab we will always have a texture - either the image
    //   or white.  Given the booleans passed to the shader, the white texture
    //   won't even be applied if no texture is selected.  But the small white
    //   texture prevents shader warnings that no active texture is bound.
    //   We could have made two differrent shaders to do this as well
    
    
    gl.activeTexture(gl.TEXTURE0);  // which of the multiple texture units to use
    gl.uniform1i(this.fTexSampler, 0); // The texture unit to use
    
    if (textureOn && this.textureLoaded) 
    {
       
        gl.bindTexture(gl.TEXTURE_2D, this.texture);  // The image
        gl.uniform1i(this.fShowTexture, 1);
        gl.uniform1i(this.fShowColor, colorsOn);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        
    } else {
        gl.bindTexture(gl.TEXTURE_2D, this.whiteTexture);  // The white texture
        gl.uniform1i(this.fShowColor, colorsOn);
        gl.uniform1i(this.fShowTexture, 0);
    }
  
    // Draw each face as a 2-triangle (4-vertex) strip
    for (var start = 0; start < this.numVertices; start += this.faceVertices) {
        gl.drawArrays(gl.TRIANGLE_STRIP, start, this.faceVertices);
    }
    
    gl.bindVertexArray(null);  // un-bind our vao

};


Cube.prototype.InitTexture = function (textureURL) 
{
    var gl = this.gl;
    
    // First make a white texture for when we don't want to have a texture
    //   This prevents shader warnings even if we don't sample from it
    this.whiteTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.whiteTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
                  gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

    // Load the texture from url (with generated mipmaps)
    this.textureLoaded = false;

    var texture = this.texture = gl.createTexture();
    var textureImage = new Image();
    var t = this;

    // Set up function to run asynchronously after texture image loads
    textureImage.onload = function () {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
      
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.generateMipmap(gl.TEXTURE_2D);  // incase we need min mipmap
        
        t.textureLoaded = true;  // flag texture load complete
    };

    textureImage.src = textureURL;  // start load of texture image
    
};