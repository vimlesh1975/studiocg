# ===============================
#  R³ Space Dynamic Command Script (Silent Final)
# ===============================

_base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

def simple_b64decode(b64):
    """Decode base64 manually (no imports)."""
    data, bits, value = "", 0, 0
    for c in b64:
        if c == "=": break
        if c not in _base64chars: continue
        value = (value << 6) + _base64chars.index(c)
        bits += 6
        if bits >= 8:
            bits -= 8
            data += chr((value >> bits) & 0xFF)
    return data


# -------------------------------
#  Example Actions
# -------------------------------
def rotate(node_name, angle):
    node = Scene.GetSceneNodeByName(node_name)
    if node:
        node.Transform.Rotation.Y.Set(float(angle))


def move(node_name, position):
    node = Scene.GetSceneNodeByName(node_name)
    if node and isinstance(position, list):
        x, y, z = [float(v) for v in position]
        node.Transform.Position.Value.Set(x, y, z)


# -------------------------------
#  Global state for text sequence
# -------------------------------
state = {
    "sequence": [],
    "interval": 0.0,
    "last_time": 0.0,
    "index": 0,
    "is_running": False,
    "target_node": "TextureText3D1",  # fixed target text node
    "fixed_extra_delay": 2.0           # fixed delay (in seconds) for first item
}


# -------------------------------
#  Sequence control functions
# -------------------------------
def play_text_sequence(interval_seconds, messages):
    """Start non-blocking text sequence on a fixed target node."""
    if isinstance(messages, str):
        messages = [m.strip() for m in messages.split(",") if m.strip()]

    if isinstance(messages, list) and len(messages) == 1 and isinstance(messages[0], list):
        messages = messages[0]

    if isinstance(interval_seconds, list):
        interval_seconds = interval_seconds[0]
    try:
        interval = float(interval_seconds)
    except Exception:
        interval = 1.0

    if not isinstance(messages, list):
        return

    state.update({
        "sequence": list(messages),
        "interval": interval,
        "index": 0,
        "is_running": True,
        "last_time": 0.0
    })


def stop_text_sequence():
    """Stop the running sequence."""
    state["is_running"] = False


def _update_sequence():
    """Internal helper called each frame."""
    if not state["is_running"] or not state["sequence"]:
        return

    current_time = RenderDevice.FieldCounter / 50.0  # 50fps for 1080i50

    elapsed = current_time - state["last_time"] if state["last_time"] != 0 else state["interval"]

    if state["last_time"] == 0 or elapsed >= state["interval"]:
        node = Scene.GetSceneNodeByName(state["target_node"])
        if not node:
            state["is_running"] = False
            return

        text_value = state["sequence"][state["index"]]
        anim_name = "In" if state["index"] == 0 else "textin"

        cmd = 'scene "{}/{}" ANIMATION "{}" PLAY'.format(Scene.Project, Scene, anim_name)
        Parser.ExecuteCommand(cmd)

        try:
            node.Text.Value = unicode(text_value, "utf-8")
        except Exception:
            node.Text.Value = text_value.encode("utf-8").decode("utf-8")

        state["last_time"] = current_time
        state["index"] += 1
        if state["index"] >= len(state["sequence"]):
            state["index"] = 0

        # fixed delay after first item
        if state["index"] == 1:
            state["last_time"] = current_time - (state["interval"] - state["fixed_extra_delay"])


# -------------------------------
#  Frame Update Loop
# -------------------------------
def UpdateExtension():
    _update_sequence()

    node = Scene.GetSceneNodeByName("SignalText")
    if not node:
        return

    cmd = node.Text.Value.strip()
    if not cmd:
        return

    decoded = simple_b64decode(cmd)

    parts = decoded.split("~~~")
    data = {}
    for p in parts:
        if ":" in p:
            k, v = p.split(":", 1)
            data[k] = v

    func_name = data.get("functionName", "")
    func = globals().get(func_name)

    if callable(func):
        kwargs = {}
        for k, v in data.items():
            if k == "functionName":
                continue
            if "|||" in v:
                kwargs[k] = v.split("|||")
            else:
                kwargs[k] = v
        func(**kwargs)

    node.Text.Value = ""
