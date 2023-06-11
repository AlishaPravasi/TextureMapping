#version 300 es

precision highp float;     // required precision declaration

// Texture variables
uniform sampler2D fTexSampler;
uniform int fShowColor;
uniform int fShowTexture;

// Interpolated input values from vertex shader
in vec3 fColor;
in vec2 fTexCoord;

out vec4 final_color;      // output color to frame buffer


void main() {
  if(fShowColor == 1 && fShowTexture == 1)
    {
        final_color = texture(fTexSampler, fTexCoord) * vec4(fColor, 1);
    }
  else if(fShowTexture == 1)
    {
        final_color = texture(fTexSampler, fTexCoord);
    }
  else if(fShowColor == 1)
    {
        final_color = vec4(fColor, 1);
    }   
  else
    {   
        final_color = vec4(0,0,0,1);
    }   
}