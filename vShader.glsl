#version 300 es

// Per-vertex variables from the vertex buffers
in vec3 vPosition;           // position of vertex (x, y, z) in world coords
in vec3 vColor;              // color
in vec2 vTexCoord;           // texture coords


uniform mat4 projectionMat;   // projection matrix
uniform mat4 viewMat;         // the view/camera location matrix
uniform mat4 modelMat;        // model matrix

      
// Interpolated values for the fragment shader
out vec3 fColor;            // output color to send to fragment shader
out vec2 fTexCoord;         // texture coordinates to be interpolated

void main() 
{    
    // Always have to assign gl_Position - projected into clip coordinates
    gl_Position = projectionMat * viewMat * modelMat * vec4(vPosition.xyz, 1.0);
   
  
    // Transfer the color and texture coords to fragment shader
    // They will be interpolated
    fColor = vColor;
    fTexCoord = vTexCoord;
   
}
