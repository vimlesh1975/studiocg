// Global Shader Version: 3.5.1.372 
#define PI 3.14159265f
struct MaterialStruct
{
float3 Ambient;
float3 Diffuse;
float3 Specular;
float3 Emissive;
float MaterialAlpha;
float SpecularPower;
};
struct BaseLight
{
int Type;
bool Enabled;
float InnerAngle;
float OuterAngle;
float3 Position;
float3 Direction;
float3 Ambient;
float3 Diffuse;
float3 Specular;
float ConstantAttenuation;
float LinearAttenuation;
float QuadraticAttenuation;
float Intensity;
};
struct MaskSamples
{
float SampleCount;
};
cbuffer MaterialBuffer : register(b1)
{
MaterialStruct Material;
}
cbuffer LightBuffer : register(b0)
{
int NumLights;
BaseLight Lights[32];
}
cbuffer EnableTexturingBuffer : register(b2)
{
int EnableTexturing;
int EnableKey;
int TextureColorOption;
int TextureBlendType;
float3 ShapedColor;
int IsEmissive;
int StretchOption;
float Reflectivity;
int ColorShaping;
}
cbuffer AlphaBuffer : register(b3)
{
float Alpha;
}
cbuffer TargetsSizeBuffer : register(b8)
{
int OutputFormatWidth;
int OutputFormatHeight;
int RenderTargetWidth;
int RenderTargetHeight;
}
cbuffer PrimitiveData : register(b13)
{
float2 PrimitiveScale;
float2 PrimitiveOffset;
float2 ImageScale;
float MaskCount;
int MaskFlags;
MaskSamples MaskSampleCount[8];
}
Texture2DMS<float4> masks[8] : register(t9);
Texture2D TextureMapping : register(t0);
sampler Sampler : register(s0);
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
struct PSOutput
{
float4 Color : COLOR0;
};
float3 CalculateColor(float3 lightDir, float3 inViewDir, float3 inNormal, BaseLight inLight, MaterialStruct curMaterial)
{
    float3 viewDir = normalize(inViewDir);
    float3 normal = normalize(inNormal);

    // Calculate the half vector
    float3 halfway = normalize(lightDir + viewDir);

    // Calculate the ambient reflection
    float3 ambientColor = inLight.Ambient * curMaterial.Ambient.rgb;

    // Calculate the specular reflection
    float3 specularColor = pow(saturate(dot(normal, halfway)), curMaterial.SpecularPower) * curMaterial.Specular.rgb * inLight.Specular;

    // Calculate the diffuse reflection
    float3 diffuseColor = curMaterial.Diffuse.rgb * saturate(dot(normal, lightDir)) * inLight.Diffuse;

    // Combining all reflections
    float3 color = ambientColor + diffuseColor + specularColor;
    color *= inLight.Intensity;

    return saturate(color);
}
float3 CalculatePhongDirectionalLight(float3 inNormal, BaseLight inLight, float3 inViewDir, MaterialStruct curMaterial)
{
float3 lightDir = normalize(-inLight.Direction);
    float3 color = CalculateColor(lightDir, inViewDir, inNormal, inLight, curMaterial);
    return color;
}
float3 CalculatePhongPointLight(float3 globalPos, float3 inNormal, BaseLight inLight, float3 inViewDir, MaterialStruct curMaterial)
{
float3 lightDir = inLight.Position - globalPos;
float distance = length(lightDir);
float distanceSquared = distance * distance;
lightDir = normalize(lightDir);

float3 color = CalculateColor(lightDir, inViewDir, inNormal, inLight, curMaterial);
color *= 1 / (inLight.ConstantAttenuation + inLight.LinearAttenuation * distance + inLight.QuadraticAttenuation * distanceSquared);

return color;
}
float3 CalculatePhongSpotLight(float3 globalPos, float3 inNormal, BaseLight inLight, float3 inViewDir, MaterialStruct curMaterial)
{
float3 lightDir = inLight.Position - globalPos;
float distance = length(lightDir);
float distanceSquared = distance * distance;
float3 L = normalize(lightDir);
float3 D = normalize(inLight.Direction);

float cosCurrentAngle = dot(-L, D);

float cosInnerConeAngle = cos(inLight.InnerAngle);
float cosOuterConeAngle = cos(inLight.OuterAngle);
float cosInnerMinusOuterAngle = cosInnerConeAngle - cosOuterConeAngle;

float spot = saturate((cosCurrentAngle - cosOuterConeAngle) / cosInnerMinusOuterAngle);

float3 color = CalculateColor(L, inViewDir, inNormal, inLight, curMaterial);
color *= spot / (inLight.ConstantAttenuation + inLight.LinearAttenuation*distance + inLight.QuadraticAttenuation*distanceSquared);

return color;
}
float4 GetMaskAlpha(float2 position, float2 ratioRender, int maskIndex, int maskFlags)
{
    int maskSampleCount = MaskSampleCount[maskIndex].SampleCount;
    float4 maskColor = float4(0, 0, 0, 0);

    // Render target with different size from output
    int2 correctedPosition = int2(position.x / ratioRender.x, position.y / ratioRender.y);
    for (int curSampleIdx = 0; curSampleIdx < maskSampleCount; curSampleIdx++)
    {
        maskColor += masks[maskIndex].sample[curSampleIdx][correctedPosition];
    }

    // Calculate the average color of this pixel
    maskColor /= (float) maskSampleCount;

    int isDisableBinaryAlpha = (maskFlags >> maskIndex & 0x1);
    if (isDisableBinaryAlpha == 0)
    {
        // Inverted mask the logic its opposite 
        if (maskColor.a > 0)
            maskColor.a = 1;
    }

    int isInverted = (maskFlags >> (maskIndex + 16) & 0x1);
    if (isInverted > 0)
    {
        // Inverted mask the logic its opposite 
        maskColor.a = 1 - maskColor.a;
    }

    return maskColor.a;
}
float2 GetTextureScale_Main()
{
float2 scaleToUse = float2(1, 1);
float imageScaleRatio = ImageScale.x / ImageScale.y;
float primitiveScaleRatio = PrimitiveScale.x / PrimitiveScale.y;
if (imageScaleRatio > primitiveScaleRatio)
{
    // StretchUniform
    scaleToUse.x = 1;
    scaleToUse.y = imageScaleRatio / primitiveScaleRatio;
}
else
{
    // StretchUniform
    scaleToUse.y = 1;
    scaleToUse.x = primitiveScaleRatio / imageScaleRatio;
}
return scaleToUse;
}
float2 GenerateTextureCoordinates_MainTexture(float4 coordinates, float2 _projectTexCoord, float2 uvInScreen)
{
    float2 projectTexCoord = float2(0, 0);
    float2 scaleToUse = float2(1, 1);
scaleToUse = GetTextureScale_Main();
projectTexCoord.x = coordinates.x * scaleToUse.x + PrimitiveOffset.x;
projectTexCoord.y = -coordinates.y * scaleToUse.y + PrimitiveOffset.y;

    return projectTexCoord;
}
float3 CalculateColorTexture(float3 lightDir, float3 inViewDir, float3 inNormal, BaseLight inLight, float4 textureColor)
{
// Calculate the diffuse reflection
float3 normal = normalize(inNormal);
float3 diffuseColor = textureColor.rgb * saturate(dot(normal, lightDir)) * inLight.Diffuse;

// Combining all reflections
diffuseColor *= inLight.Intensity;

return saturate(diffuseColor);
}
float3 CalculatePhongDirectionalLightTexture(float3 inNormal, BaseLight inLight, float3 inViewDir, float4 textureColor)
{
float3 lightDir = normalize(-inLight.Direction);
float3 color = CalculateColorTexture(lightDir, inViewDir, inNormal, inLight, textureColor);
return color;
}
float3 CalculatePhongPointLightTexture(float3 globalPos, float3 inNormal, BaseLight inLight, float3 inViewDir, float4 textureColor)
{
float3 lightDir = inLight.Position - globalPos;
float distance = length(lightDir);
float distanceSquared = distance * distance;
lightDir = normalize(lightDir);

float3 color = CalculateColorTexture(lightDir, inViewDir, inNormal, inLight, textureColor);
color *= 1 / (inLight.ConstantAttenuation + inLight.LinearAttenuation * distance + inLight.QuadraticAttenuation * distanceSquared);

return color;
}
float3 CalculatePhongSpotLightTexture(float3 globalPos, float3 inNormal, BaseLight inLight, float3 inViewDir, float4 textureColor)
{
float3 lightDir = inLight.Position - globalPos;
float distance = length(lightDir);
float distanceSquared = distance * distance;
float3 L = normalize(lightDir);
float3 D = normalize(inLight.Direction);

float cosCurrentAngle = dot(-L, D);

float cosInnerConeAngle = cos(inLight.InnerAngle);
float cosOuterConeAngle = cos(inLight.OuterAngle);
float cosInnerMinusOuterAngle = cosInnerConeAngle - cosOuterConeAngle;

float spot = saturate((cosCurrentAngle - cosOuterConeAngle) / cosInnerMinusOuterAngle);

float3 color = CalculateColorTexture(L, inViewDir, inNormal, inLight, textureColor);
color *= spot / (inLight.ConstantAttenuation + inLight.LinearAttenuation*distance + inLight.QuadraticAttenuation*distanceSquared);

return color;
}
float3 BlendMaterialWithTexture_MainTexture(float4 textureColor, float3 color, float3 shapedColor)
{
    float3 tempTexColor;
tempTexColor = textureColor.rgb;
color = color * tempTexColor;
return color;
}
float4 PrimitivePhongShading(VSOutput input, bool isFrontFace, float4 positionInScreen)
{
// invert normals when backfaces 
float3 Normal = normalize(lerp(-input.Normal, input.Normal, float(isFrontFace)));
float3 ViewDir = input.EyeView;
float4 textureColor = float4(0,0,0,0);
//Is texture enable, lets generate coordintes.
float3 tempTextureColor = float3(0, 0, 0);
float2 uvInScreen = float2(positionInScreen.x / OutputFormatWidth, positionInScreen.y / OutputFormatHeight);
float2 projectTexCoord =  GenerateTextureCoordinates_MainTexture(input.WorldTexturePos, input.WorldTextureUV.xy, uvInScreen);
float4 sampledTextureColor = TextureMapping.Sample(Sampler, float3(projectTexCoord, 0));
tempTextureColor += CalculatePhongDirectionalLightTexture(Normal, Lights[0], ViewDir, sampledTextureColor);
textureColor.a = sampledTextureColor.a;
textureColor.rgb = tempTextureColor;
float4 alphaMaskTexture = float4(1, 1, 1, 1);

float3 res = float3(0,0,0);
res += CalculatePhongDirectionalLight(Normal, Lights[0], ViewDir, Material);
res += Material.Emissive.rgb;
// We are adding color components, so we need to make sure that those values are never bigger than 1
res = saturate(res);
float alphaVal = Material.MaterialAlpha;
res = saturate(BlendMaterialWithTexture_MainTexture(textureColor, res, ShapedColor));
alphaVal = textureColor.a * alphaVal;
alphaVal = saturate(alphaVal);
float4 finalColor = float4(res, alphaVal * Alpha * alphaMaskTexture[EnableKey]);
// Opacity Masks
float2 ratioRender = float2((float) RenderTargetWidth / OutputFormatWidth, (float)RenderTargetHeight / OutputFormatHeight);
float totalMaskAlpha = 0;
totalMaskAlpha = clamp(totalMaskAlpha, 0.0f, 1.0f);
finalColor.a = finalColor.a * (1 - totalMaskAlpha);
return finalColor;
}
PSOutput Main(VSOutput input, bool isFrontFace : SV_IsFrontFace, float4 positionInScreen : SV_POSITION) : SV_Target
{
PSOutput output;
output.Color = PrimitivePhongShading(input, isFrontFace, positionInScreen);
return output;
}
