import json
import os
import random
import urllib.request
import urllib.error
from datetime import datetime, timedelta
from pathlib import Path


# ============================================================
# CONFIG
# ============================================================

REPO_ROOT = Path(__file__).resolve().parents[2]

LIST_FILE = REPO_ROOT / "data" / "_list.json"
WEEKLY_FILE = REPO_ROOT / "data" / "_weekly.json"
WEEKLY_FOLDER = REPO_ROOT / "data" / "weekly"

DISCORD_WEBHOOK_URL = os.environ.get("DISCORD_WEBHOOK_URL")


# ============================================================
# HELPERS
# ============================================================

def load_json(path):
    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
        file.write("\n")


def extract_slug(path):
    return path.replace("\\", "/").split("/")[-1]


def get_current_week():
    """
    Returns the Monday-Sunday period containing the run date.

    Example:
    21/09/2026 - 27/09/2026
    """

    today = datetime.now().date()

    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)

    return (
        monday.strftime("%d/%m/%Y")
        + " - "
        + sunday.strftime("%d/%m/%Y")
    )


# ============================================================
# CHECK WEBHOOK
# ============================================================

if not DISCORD_WEBHOOK_URL:
    raise RuntimeError(
        "DISCORD_WEBHOOK_URL GitHub Secret was not found."
    )


# ============================================================
# LOAD MAIN LIST
# ============================================================

print("Loading Main List...")

main_list = load_json(LIST_FILE)

print(f"Total entries in _list.json: {len(main_list)}")

# ONLY THE FIRST 150 ARE ELIGIBLE
top_150 = main_list[:150]

print(f"Eligible Main List levels: {len(top_150)}")


# ============================================================
# LOAD WEEKLY HISTORY
# ============================================================

print("Loading Weekly Demon history...")

weekly_history = load_json(WEEKLY_FILE)

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

    # Never reuse a previous Weekly Demon
    if slug in used_slugs:
        continue

    level_file = REPO_ROOT / "data" / f"{slug}.json"

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
level_id = level.get("id", 0)
verification = level.get("verification", "")
percent_to_qualify = level.get("percentToQualify", 100)
password = level.get("password", "Password Required")

description = level.get("description", "")

if not creators:
    creators = [author]


# ============================================================
# WEEKLY DATE
# ============================================================

weekly_date = get_current_week()

print()
print("=" * 60)
print("NEW TEST WEEKLY DEMON")
print("=" * 60)
print(f"Level:          {name}")
print(f"Slug:           {slug}")
print(f"Creator:        {author}")
print(f"Main List:      #{main_list_position}")
print(f"ID:             {level_id}")
print(f"Weekly period:  {weekly_date}")
print("=" * 60)
print()


# ============================================================
# CREATE WEEKLY JSON
# ============================================================

WEEKLY_FOLDER.mkdir(parents=True, exist_ok=True)

weekly_file = WEEKLY_FOLDER / f"{slug}.json"

weekly_data = {
    "id": level_id,
    "name": name,
    "author": author,
    "creators": creators,
    "verification": verification,
    "percentToQualify": percent_to_qualify,
    "weeklyDate": weekly_date,
    "password": password,
    "records": []
}

save_json(weekly_file, weekly_data)

print(f"Created: {weekly_file}")


# ============================================================
# UPDATE _weekly.json
# ============================================================

weekly_entry = f"weekly/{slug}"

# Put the newest Weekly Demon FIRST
new_weekly_history = [
    weekly_entry
] + [
    entry
    for entry in weekly_history
    if extract_slug(entry) != slug
]

save_json(WEEKLY_FILE, new_weekly_history)

print("Updated _weekly.json")


# ============================================================
# CREATE DISCORD EMBED
# ============================================================

description_text = description.strip()

if not description_text:
    description_text = "No description provided."

# Discord embed description limit
if len(description_text) > 4000:
    description_text = description_text[:3997] + "..."


creators_text = ", ".join(creators)

if len(creators_text) > 1024:
    creators_text = creators_text[:1021] + "..."


embed = {
    "title": "🔥 SECRET WAY WEEKLY DEMON #1",
    "description": (
        f"**{name}**\n"
        f"by **{author}**\n\n"
        f"{description_text}"
    ),
    "color": 0xE74C3C,

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
            "name": "👥 Creators",
            "value": creators_text,
            "inline": False
        },
        {
            "name": "🎥 YOUTUBE VERIFICATION VIDEO",
            "value": verification if verification else "No video provided.",
            "inline": False
        },
        {
            "name": "📅 WEEKLY DEMON",
            "value": weekly_date,
            "inline": False
        }
    ],

    "footer": {
        "text": "TEST — Secret Way Demonlist Weekly Demon"
    }
}


payload = {
    "content": (
        "🧪 **TEST — NEW SECRET WAY WEEKLY DEMON #1**\n\n"
        "A test Weekly Demon has been generated. "
        "This is running on the `weekly-demon-test` branch."
    ),

    "username": "Secret Way Weekly Demon",

    "embeds": [embed]
}


# ============================================================
# SEND DISCORD MESSAGE
# ============================================================

print("Sending Discord announcement...")

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

        if response.status not in (200, 204):
            raise RuntimeError(
                f"Discord returned status {response.status}"
            )

        print("Discord announcement sent successfully.")

except urllib.error.HTTPError as error:

    body = error.read().decode(
        "utf-8",
        errors="replace"
    )

    raise RuntimeError(
        f"Discord rejected webhook request "
        f"({error.code}): {body}"
    )

except urllib.error.URLError as error:

    raise RuntimeError(
        f"Could not connect to Discord: {error}"
    )


# ============================================================
# GIT COMMIT
# ============================================================

print("Preparing Git commit...")

os.system(
    'git config user.name "Secret Way Weekly Demon Bot"'
)

os.system(
    'git config user.email "41898282+github-actions[bot]@users.noreply.github.com"'
)

os.system(
    f'git add "{WEEKLY_FILE}" "{weekly_file}"'
)

commit_result = os.system(
    'git commit -m "Add new test Weekly Demon"'
)

if commit_result != 0:
    print("No Git commit was created.")
else:
    print("Git commit created.")

    push_result = os.system("git push")

    if push_result != 0:
        raise RuntimeError(
            "Git push failed."
        )

    print("Changes pushed successfully.")

print()
print("==========================================")
print("TEST WEEKLY DEMON COMPLETE")
print("==========================================")
