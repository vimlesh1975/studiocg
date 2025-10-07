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
cbuffer PrimitiveData : register(b13)
{
float2 PrimitiveScale;
float2 PrimitiveOffset;
float2 ImageScale;
float MaskCount;
int MaskFlags;
MaskSamples MaskSampleCount[8];
}
cbuffer TextureTextMaterialBuffer : register(b5)
{
MaterialStruct MaterialFront;
MaterialStruct MaterialBorder;
MaterialStruct MaterialShadow;
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
Texture2D TextureTextMaskTexture : register(t3);
sampler SamplerGeometry : register(s3);
Texture2DMS<float4> masks[8] : register(t9);
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
float4 TextureTextShading(VSOutput input, float4 positionInScreen)
{
// Sample texture mask (red = front, blue = border, green = shadow)
    float4 alphaTextureText = TextureTextMaskTexture.Sample(SamplerGeometry, input.TextureTextMaskUV);

    float4 textureColorFront = float4(0, 0, 0, 0);
    float4 textureColorOutline = float4(0, 0, 0, 0);
    float4 textureColorShadow = float4(0, 0, 0, 0);

    float sum = alphaTextureText.r + alphaTextureText.b + alphaTextureText.g;
    float frontPerc = alphaTextureText.r / sum;
    float borderPerc = alphaTextureText.b / sum;
    float shadowPerc = alphaTextureText.g / sum;

    MaterialStruct curMaterial;
    curMaterial.Diffuse = MaterialFront.Diffuse * frontPerc + MaterialBorder.Diffuse * borderPerc + MaterialShadow.Diffuse * shadowPerc;
    curMaterial.Ambient = MaterialFront.Ambient * frontPerc + MaterialBorder.Ambient * borderPerc + MaterialShadow.Ambient * shadowPerc;
    curMaterial.Emissive = MaterialFront.Emissive * frontPerc + MaterialBorder.Emissive * borderPerc + MaterialShadow.Emissive * shadowPerc;
    curMaterial.Specular = MaterialFront.Specular * frontPerc + MaterialBorder.Specular * borderPerc + MaterialShadow.Specular * shadowPerc;
    curMaterial.SpecularPower = MaterialFront.SpecularPower * frontPerc + MaterialBorder.SpecularPower * borderPerc + MaterialShadow.SpecularPower * shadowPerc;
    curMaterial.MaterialAlpha = MaterialFront.MaterialAlpha * frontPerc + MaterialBorder.MaterialAlpha * borderPerc + MaterialShadow.MaterialAlpha * shadowPerc;

    float alphaVal1 = curMaterial.MaterialAlpha * frontPerc;
    float alphaVal2 = curMaterial.MaterialAlpha * borderPerc;
    float alphaVal3 = curMaterial.MaterialAlpha * shadowPerc;

float3 matDiffuse1 = curMaterial.Diffuse;
float3 matDiffuse2 = curMaterial.Diffuse;
float3 matDiffuse3 = curMaterial.Diffuse;

    curMaterial.Diffuse = matDiffuse1 * frontPerc + matDiffuse2 * borderPerc + matDiffuse3 * shadowPerc;

    float3 normal = normalize(input.Normal);
    float3 viewDir = normalize(input.EyeView);
    if (dot(viewDir, normal) < 0)
        normal = -normal;

    float3 res = curMaterial.Emissive.rgb;
res += CalculatePhongDirectionalLight(normal, Lights[0], viewDir, curMaterial);

    float alphaVal = saturate(alphaVal1 + alphaVal2 + alphaVal3);
    float alphaOutput = alphaVal * Alpha * alphaTextureText.a;
    if (alphaOutput == 0)
       discard;

    float4 finalColor = float4(res, alphaOutput);
// Opacity Masks
    float totalMaskAlpha = 0;
totalMaskAlpha += GetMaskAlpha(input.Position, float2(1,1), 0, MaskFlags);
totalMaskAlpha += GetMaskAlpha(input.Position, float2(1,1), 1, MaskFlags);
totalMaskAlpha = clamp(totalMaskAlpha, 0.0f, 1.0f);

    finalColor.a = finalColor.a * (1 - totalMaskAlpha);
return finalColor;
}
PSOutput Main(VSOutput input, float4 positionInScreen : SV_POSITION) : SV_Target
{
PSOutput output;
output.Color = TextureTextShading(input, positionInScreen);
return output;
}
