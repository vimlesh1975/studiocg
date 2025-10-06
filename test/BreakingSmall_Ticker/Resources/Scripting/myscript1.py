# ===============================
#  R³ Space Dynamic Command Script
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
        print("🔄 Rotated {} → {}".format(node_name, angle))


def move(node_name, position):
    # position will come as list ['10','20','30']
    node = Scene.GetSceneNodeByName(node_name)
    if node and isinstance(position, list):
        x, y, z = [float(v) for v in position]
        node.Transform.Position.Value.Set(x, y, z)
        print("🚀 Moved {} → {}, {}, {}".format(node_name, x, y, z))


# -------------------------------
#  Text Sequence Globals
# -------------------------------
_sequence = []
_interval = 0
_last_time = 0
_index = 0
_is_running = False
_target_node_name = "Breaking_tTextA"

def play_text_sequence(interval_seconds, messages, text_node_name="Breaking_tTextA"):
    """
    Non-blocking text sequence that updates a node's Text value every interval.
    Accepts:
        play_text_sequence(5, ["Hello", "World"])
        play_text_sequence("5", "Hello,World")
        play_text_sequence("5", [["Hello","World"]])
    """
    global _sequence, _interval, _index, _is_running, _last_time, _target_node_name

    # ✅ Convert single string like "Hello,World" into list
    if isinstance(messages, str):
        messages = [m.strip() for m in messages.split(",") if m.strip()]

    # ✅ Handle nested lists like [["Hello","World"]]
    if isinstance(messages, list) and len(messages) == 1 and isinstance(messages[0], list):
        messages = messages[0]

    # ✅ Convert numeric interval from list to float
    if isinstance(interval_seconds, list):
        interval_seconds = interval_seconds[0]

    try:
        _interval = float(interval_seconds)
    except Exception:
        print("⚠️ Invalid interval value:", interval_seconds)
        _interval = 1.0

    # ✅ Validate messages list (after conversions)
    if not isinstance(messages, list):
        print("❌ Expected a list of messages, got:", type(messages))
        return

    # ✅ Start the sequence
    _sequence = list(messages)
    _index = 0
    _is_running = True
    _last_time = 0
    _target_node_name = text_node_name

    print("▶ Started text sequence on '{}' with {} messages, every {}s"
          .format(_target_node_name, len(_sequence), _interval))


def stop_text_sequence():
    """Stops the running text sequence."""
    global _is_running
    _is_running = False
    print("⏹ Sequence stopped.")
def _update_sequence():
    """Internal helper called every frame (from UpdateExtension)."""
    global _index, _last_time, _is_running

    if not _is_running or not _sequence:
        return

    current_time = RenderDevice.FieldCounter / 60.0  # approximate seconds (60 fps)

    # ⏱️ Extra delay (in seconds) to hold the FIRST message longer
    first_extra_delay = _interval * 1.5  # hold first message 1.5× longer than normal

    # decide if it’s time to show next message
    elapsed = current_time - _last_time if _last_time != 0 else _interval

    # check interval condition
    if _last_time == 0 or elapsed >= _interval:
        node = Scene.GetSceneNodeByName(_target_node_name)
        if not node:
            print("❌ Text node '{}' not found".format(_target_node_name))
            _is_running = False
            return

        text_value = _sequence[_index]

        # animation name
        anim_name = "In" if _index == 0 else "Text01_In"

        # play animation
        cmd = 'scene "test/BreakingSmall_Ticker" ANIMATION "{}" PLAY'.format(anim_name)
        Parser.ExecuteCommand(cmd)

        # update text
        try:
            node.Text.Value = unicode(text_value, "utf-8")
        except Exception:
            node.Text.Value = text_value.encode("utf-8").decode("utf-8")

        print("[{}/{}] Text set → {}".format(_index + 1, len(_sequence), text_value))

        # record time *after* showing text
        _last_time = current_time

        # increment
        _index += 1
        if _index >= len(_sequence):
            _index = 0  # loop forever

        # ✅ if we just displayed the FIRST item, delay extra
        if _index == 1:  # means we just finished first item
            _last_time = current_time - (_interval - first_extra_delay)

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
    print("Decoded:", decoded)

    parts = decoded.split("|")
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
            # Convert comma lists like "a,b,c" → ["a","b","c"]
            if "," in v and not v.replace(",", "").replace(".", "").isdigit():
                kwargs[k] = v.split(",")
            else:
                kwargs[k] = v

        print("➡ Executing:", func_name, "with", kwargs)
        func(**kwargs)


    node.Text.Value = ""

# Parser.ExecuteCommand('scene "test/script1" nodes set "SignalText" "Text" "ZnVuY3Rpb25OYW1lOnBsYXlfdGV4dF9zZXF1ZW5jZXxpbnRlcnZhbF9zZWNvbmRzOjF8bWVzc2FnZXM6SGVsbG8gdGhpcyBpcyB2aW1sZXNoLE15IHVuaXF1ZSBXb3JsZCxSM1NwYWNlIGRlc2luZXIgYW5kIEVuZ2luZQ=="')    



