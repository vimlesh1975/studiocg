// Global Shader Version: 3.5.1.372 
cbuffer TransformMatrices : register(b0)
{
matrix World;
matrix View;
matrix Projection;
matrix WorldTexture;
matrix WorldTextureKey;
matrix WorldTextureReflectionMap;
matrix LightView;
matrix LightProjection;
float3 Eye;
float NormalsCorrection;
}
struct VSInput
{
float4 Position : POSITION;
float3 Normal : NORMAL;
float2 TexCoord : TEXCOORD;
};
struct VSOutput
{
float4 Position : SV_POSITION;
float3 Normal : NORMAL;
float3 EyeView : TEXCOORD1;
float3 WorldPos : TEXCOORD2;
float4 TextureText : TEXCOORD3;
float4 WorldTexturePos : TEXCOORD4;
float4 WorldTextureUV : TEXCOORD5;
float4 WorldTexturePosKey : TEXCOORD6;
float4 WorldTextureUVKey : TEXCOORD7;
float4 LightViewPos : TEXCOORD8;
float3 LightPos : TEXCOORD9;
float4 Depth : TEXTURE10;
float3 Reflection : TEXCOORD11;
float2 TextureTextMaskUV : TEXCOORD12;
};
VSOutput Main(VSInput input)
{
VSOutput output;
input.Position.w = 1.0f;
output.TextureText = input.Position;
output.Position = mul(input.Position, World);
float4 worldPosition = output.Position;
output.Position = mul(output.Position, View);
output.Position = mul(output.Position, Projection);
output.LightViewPos = mul(input.Position, World);
output.LightViewPos = mul(output.LightViewPos, LightView);
output.LightViewPos = mul(output.LightViewPos, LightProjection);
output.TextureTextMaskUV = float2(input.TexCoord.xy);
output.EyeView = normalize(Eye - (float3)output.Position);
float3 correctedNormal = input.Normal * NormalsCorrection;
output.Normal = normalize(mul(correctedNormal, World));
output.WorldPos = mul(input.Position, World).xyz;
output.LightPos = float3(0,0,0) - worldPosition.xyz;
output.LightPos = normalize(output.LightPos);
output.Depth = float4(0,0,0,0);
return output;
}
