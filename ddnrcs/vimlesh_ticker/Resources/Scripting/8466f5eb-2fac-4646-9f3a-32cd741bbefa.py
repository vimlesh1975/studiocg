
def DrawEvent():
    angle = -(RenderDevice.FieldCounter % 360)
    # SceneNode.Transform.Rotation.Y.Set(angle)
    SceneNode.Text.Value=angle
    # print(Helper)
    # print(angle)
def UpdateExtension():
    DrawEvent()
    # pass