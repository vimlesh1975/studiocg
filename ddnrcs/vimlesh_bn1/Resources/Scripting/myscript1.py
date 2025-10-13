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
    "groups": [],
    "interval": 0.0,
    "last_time": 0.0,
    "group_index": 0,
    "item_index": 0,
    "is_running": False,
    "target_node": "bntext",
    "fixed_extra_delay": 4.0
}


# -------------------------------
def play_text_sequence(interval_seconds, messages):
    """Start non-blocking grouped text sequence."""
    if isinstance(interval_seconds, list):
        interval_seconds = interval_seconds[0]
    try:
        interval = float(interval_seconds)
    except Exception:
        interval = 1.0

    # ✅ keep nested groups
    if isinstance(messages, list) and all(isinstance(m, list) for m in messages):
        groups = messages
    else:
        groups = [messages]

    state.update({
        "groups": groups,
        "interval": interval,
        "group_index": 0,
        "item_index": 0,
        "is_running": True,
        "last_time": 0.0
    })

def stop_text_sequence():
    """Stop the running sequence."""
    state["is_running"] = False


def _update_sequence():
    """Internal helper called each frame."""
    if not state["is_running"] or not state["groups"]:
        return

    current_time = RenderDevice.FieldCounter / 50.0
    elapsed = current_time - state["last_time"] if state["last_time"] != 0 else state["interval"]

    group = state["groups"][state["group_index"]]
    if isinstance(group, str):
        group = [group]  # ✅ Prevent single string from breaking into characters
    if state["item_index"] >= len(group):
        state["item_index"] = 0
        state["group_index"] += 1
        if state["group_index"] >= len(state["groups"]):
            state["group_index"] = 0
        group = state["groups"][state["group_index"]]

    if state["last_time"] == 0 or elapsed >= state["interval"]:
        node = Scene.GetSceneNodeByName(state["target_node"])
        if not node:
            state["is_running"] = False
            return
        text_value = group[state["item_index"]]
        anim_name = "In" if state["item_index"] == 0 else "textin"
        cmd = 'scene "{}/{}" ANIMATION "{}" PLAY'.format(Scene.Project, Scene, anim_name)
        Parser.ExecuteCommand(cmd)


        try:
            node.Text.Value = unicode(text_value, "utf-8")
        except Exception:
            node.Text.Value = text_value.encode("utf-8").decode("utf-8")

        # update indexes
        state["last_time"] = current_time
        state["item_index"] += 1

        # ⏱️ Add extra delay for first message in each group
        if state["item_index"] == 1:
            state["last_time"] = current_time + state["fixed_extra_delay"]

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
    parts = decoded.split("###")
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

            # Parse groups: "a|||b~~~x|||y" → [["a","b"], ["x","y"]]
            if "~~~" in v:
                groups = v.split("~~~")
                kwargs[k] = [g.split("|||") for g in groups]
            elif "|||" in v:
                kwargs[k] = v.split("|||")
            else:
                kwargs[k] = v

        func(**kwargs)


    node.Text.Value = ""
