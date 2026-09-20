import json
import os
import random
import urllib.request
import urllib.error
from pathlib import Path


# ============================================================
# CONFIG
# ============================================================

REPO_ROOT = Path(__file__).resolve().parents[2]

LIST_FILE = REPO_ROOT / "data" / "_list.json"
WEEKLY_FILE = REPO_ROOT / "data" / "_weekly.json"

DISCORD_WEBHOOK_URL = os.environ.get("DISCORD_WEBHOOK_URL")

TEST_CHANNEL_ID = "1551292136756875284"


# ============================================================
# HELPERS
# ============================================================

def load_json(path):
    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def extract_slug(path):
    """
    Converts:
        weekly/chakra
    into:
        chakra
    """
    return path.replace("\\", "/").split("/")[-1]


def find_level_file(slug):
    """
    Finds the main-list level JSON.
    """
    return REPO_ROOT / "data" / f"{slug}.json"


def get_youtube_url(url):
    if not url:
        return None

    return url


# ============================================================
# LOAD DATA
# ============================================================

if not DISCORD_WEBHOOK_URL:
    raise RuntimeError(
        "DISCORD_WEBHOOK_URL GitHub Secret was not found."
    )

print("Loading Main List...")

main_list = load_json(LIST_FILE)

print(f"Total entries in _list.json: {len(main_list)}")

# Only the first 150 entries are eligible.
top_150 = main_list[:150]

print(f"Eligible Main List levels: {len(top_150)}")


print("Loading Weekly Demon history...")

weekly_history = load_json(WEEKLY_FILE)

# Convert:
# weekly/chakra
# weekly/countershock
#
# into:
# chakra
# countershock

used_slugs = {
    extract_slug(entry)
    for entry in weekly_history
}

print(f"Previous Weekly Demons: {len(used_slugs)}")


# ============================================================
# FIND ELIGIBLE LEVELS
# ============================================================

eligible = []

for position, slug in enumerate(top_150, start=1):

    if slug in used_slugs:
        continue

    level_file = find_level_file(slug)

    if not level_file.exists():
        print(
            f"WARNING: {slug}.json does not exist - skipping."
        )
        continue

    eligible.append({
        "slug": slug,
        "position": position,
        "file": level_file
    })


print(f"Eligible unused levels: {len(eligible)}")

if not eligible:
    raise RuntimeError(
        "There are no unused levels remaining in the current top 150."
    )


# ============================================================
# RANDOM SELECTION
# ============================================================

selected = random.choice(eligible)

slug = selected["slug"]
main_list_position = selected["position"]
level_file = selected["file"]

level = load_json(level_file)


# ============================================================
# EXTRACT LEVEL INFORMATION
# ============================================================

name = level.get("name", "Unknown Level")
author = level.get("author", "Unknown Creator")
creators = level.get("creators", [])
level_id = level.get("id", "Unknown")
verifier = level.get("verifier", "Unknown")
verification = level.get("verification")
description = level.get("description", "")

if not creators:
    creators_text = author
else:
    creators_text = ", ".join(creators)


# ============================================================
# DISPLAY TEST RESULT IN GITHUB LOG
# ============================================================

print()
print("=" * 60)
print("TEST WEEKLY DEMON SELECTION")
print("=" * 60)
print(f"Slug:            {slug}")
print(f"Level:           {name}")
print(f"Creator:         {author}")
print(f"Main List:       #{main_list_position}")
print(f"ID:              {level_id}")
print(f"Verifier:        {verifier}")
print(f"Verification:    {verification}")
print(f"Previous weekly: {'YES' if slug in used_slugs else 'NO'}")
print("=" * 60)
print()


# ============================================================
# CREATE DISCORD EMBED
# ============================================================

description_text = description.strip()

if not description_text:
    description_text = "No description provided."


# Discord embeds have a 4096 character description limit.
if len(description_text) > 4000:
    description_text = description_text[:3997] + "..."


embed = {
    "title": "🧪 TEST — SECRET WAY WEEKLY DEMON",
    "description": (
        f"**{name}**\n"
        f"by **{author}**\n\n"
        f"{description_text}"
    ),
    "color": 0x9B59B6,
    "fields": [
        {
            "name": "📋 Main List Position",
            "value": f"#{main_list_position}",
            "inline": True
        },
        {
            "name": "🆔 Level ID",
            "value": f"`{level_id}`",
            "inline": True
        },
        {
            "name": "🔍 Verifier",
            "value": verifier,
            "inline": True
        },
        {
            "name": "👥 Creators",
            "value": creators_text[:1024],
            "inline": False
        }
    ],
    "footer": {
        "text": "TEST ONLY • No Weekly Demon data was changed"
    }
}

if verification:
    embed["fields"].append({
        "name": "🎥 Verification",
        "value": f"[Watch on YouTube]({verification})",
        "inline": False
    })


payload = {
    "content": (
        "🧪 **TEST ANNOUNCEMENT**\n\n"
        "This is a practice run. "
        "No Weekly Demon data has been changed."
    ),
    "username": "Secret Way Weekly Demon",
    "embeds": [embed]
}


# ============================================================
# SEND TO DISCORD
# ============================================================

print("Sending test announcement to Discord...")

data = json.dumps(payload).encode("utf-8")

request = urllib.request.Request(
    DISCORD_WEBHOOK_URL,
    data=data,
    headers={
        "Content-Type": "application/json",
        "User-Agent": "Secret-Way-Demonlist-Weekly-Test"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(request) as response:
        status = response.status

        if status not in (200, 204):
            raise RuntimeError(
                f"Discord returned unexpected status {status}"
            )

        print("SUCCESS!")
        print(
            f"Test announcement sent to channel "
            f"{TEST_CHANNEL_ID}"
        )

except urllib.error.HTTPError as error:
    body = error.read().decode("utf-8", errors="replace")

    raise RuntimeError(
        f"Discord rejected the webhook request "
        f"({error.code}): {body}"
    )

except urllib.error.URLError as error:
    raise RuntimeError(
        f"Could not connect to Discord: {error}"
    )