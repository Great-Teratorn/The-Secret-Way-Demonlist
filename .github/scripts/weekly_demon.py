import json
import os
import random
import subprocess
import urllib.error
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo


# ============================================================
# CONFIGURATION
# ============================================================

REPO_ROOT = Path(__file__).resolve().parents[2]

LIST_FILE = REPO_ROOT / "data" / "_list.json"
WEEKLY_FILE = REPO_ROOT / "data" / "_weekly.json"
WEEKLY_FOLDER = REPO_ROOT / "data" / "weekly"

DISCORD_WEBHOOK_URL = os.environ.get("DISCORD_WEBHOOK_URL")

WEEKLY_ROLE_ID = "1526357877093044376"

TOP_150_COUNT = 150

UK_TIMEZONE = ZoneInfo("Europe/London")


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


def git(*args):
    result = subprocess.run(
        ["git", *args],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise RuntimeError(
            f"Git command failed: git {' '.join(args)}\n"
            f"{result.stderr}"
        )

    return result.stdout.strip()


def get_slug_from_weekly_entry(entry):
    return entry.replace("\\", "/").split("/")[-1]


def get_week_dates():
    """
    Returns the Monday-Sunday period for the current
    UK calendar week.

    Example:
    21/09/2026 - 27/09/2026
    """

    now = datetime.now(UK_TIMEZONE)
    today = now.date()

    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)

    return (
        monday.strftime("%d/%m/%Y")
        + " - "
        + sunday.strftime("%d/%m/%Y")
    )


def get_current_uk_time():
    return datetime.now(UK_TIMEZONE)


# ============================================================
# CHECK DISCORD WEBHOOK
# ============================================================

if not DISCORD_WEBHOOK_URL:
    raise RuntimeError(
        "DISCORD_WEBHOOK_URL GitHub Secret was not found."
    )


# ============================================================
# GET CURRENT UK TIME
# ============================================================

now_uk = get_current_uk_time()

print("Current UK time:")
print(now_uk.strftime("%Y-%m-%d %H:%M:%S %Z"))

print()


# ============================================================
# LOAD MAIN LIST
# ============================================================

print("Loading Main List...")

main_list = load_json(LIST_FILE)

print(f"Total entries in _list.json: {len(main_list)}")

top_150 = main_list[:TOP_150_COUNT]

print(f"Eligible Main List levels: {len(top_150)}")


# ============================================================
# LOAD WEEKLY HISTORY
# ============================================================

print("Loading Weekly Demon history...")

weekly_history = load_json(WEEKLY_FILE)

used_slugs = {
    get_slug_from_weekly_entry(entry)
    for entry in weekly_history
}


# ============================================================
# PREVENT DUPLICATE WEEKLY DEMON
# ============================================================

current_week = get_week_dates()

if weekly_history:
    latest_slug = get_slug_from_weekly_entry(
        weekly_history[0]
    )

    latest_weekly_file = (
        WEEKLY_FOLDER / f"{latest_slug}.json"
    )

    if latest_weekly_file.exists():
        latest_weekly = load_json(
            latest_weekly_file
        )

        latest_week = latest_weekly.get(
            "weeklyDate",
            ""
        )

        if latest_week == current_week:
            print(
                f"Weekly Demon for {current_week} "
                "already exists."
            )
            print(
                "Nothing to do. Exiting safely."
            )
            raise SystemExit(0)

print(f"Previous Weekly Demons: {len(used_slugs)}")


# ============================================================
# FIND ELIGIBLE LEVELS
# ============================================================

eligible = []

for position, slug in enumerate(top_150, start=1):

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
        "There are no unused levels remaining in the current Top 150."
    )


# ============================================================
# RANDOMLY SELECT WEEKLY DEMON
# ============================================================

selected = random.choice(eligible)

slug = selected["slug"]
main_list_position = selected["position"]
level_file = selected["file"]

level = load_json(level_file)


# ============================================================
# EXTRACT LEVEL DATA
# ============================================================

name = level.get("name", "Unknown Level")
author = level.get("author", "Unknown Creator")

creators = level.get("creators", [])

if not creators:
    creators = [author]

level_id = level.get("id", 0)

verification = level.get("verification", "")

percent_to_qualify = level.get(
    "percentToQualify",
    100
)

password = level.get(
    "password",
    "Password Required"
)

description = level.get(
    "description",
    ""
).strip()

if not description:
    description = "No description provided."


# ============================================================
# WEEKLY DATE
# ============================================================

weekly_date = get_week_dates()


# ============================================================
# WEEKLY DEMON NUMBER
# ============================================================

weekly_number = 1


# ============================================================
# DISPLAY INFORMATION
# ============================================================

print()
print("=" * 60)
print("NEW SECRET WAY WEEKLY DEMON")
print("=" * 60)
print(f"Weekly Demon:   #{weekly_number}")
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

WEEKLY_FOLDER.mkdir(
    parents=True,
    exist_ok=True
)

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

# Preserve the main-list description if one exists.
if "description" in level:
    weekly_data["description"] = level["description"]

save_json(
    weekly_file,
    weekly_data
)

print(f"Created: {weekly_file}")


# ============================================================
# UPDATE WEEKLY HISTORY
# ============================================================

weekly_entry = f"weekly/{slug}"

new_weekly_history = [
    weekly_entry
] + [
    entry
    for entry in weekly_history
    if get_slug_from_weekly_entry(entry) != slug
]

save_json(
    WEEKLY_FILE,
    new_weekly_history
)

print("Updated _weekly.json")


# ============================================================
# CREATE DISCORD EMBED
# ============================================================

creators_text = ", ".join(creators)

if len(creators_text) > 1024:
    creators_text = creators_text[:1021] + "..."

if len(description) > 4000:
    description = description[:3997] + "..."


embed = {
    "title": "🔥 SECRET WAY WEEKLY DEMON #1",

    "description": (
        f"**{name}**\n"
        f"by **{author}**\n\n"
        f"{description}"
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
            "value": (
                verification
                if verification
                else "No video provided."
            ),
            "inline": False
        },
        {
            "name": "📅 WEEKLY DEMON",
            "value": weekly_date,
            "inline": False
        }
    ],

    "footer": {
        "text": "Secret Way Demonlist • Weekly Demon"
    }
}


payload = {
    "content": f"<@&{WEEKLY_ROLE_ID}>",

    "username": "Secret Way Weekly Demon",

    "allowed_mentions": {
        "roles": [WEEKLY_ROLE_ID]
    },

    "embeds": [embed]
}


# ============================================================
# SEND DISCORD ANNOUNCEMENT
# ============================================================

print("Sending Discord announcement...")

data = json.dumps(payload).encode("utf-8")

request = urllib.request.Request(
    DISCORD_WEBHOOK_URL,
    data=data,
    headers={
        "Content-Type": "application/json",
        "User-Agent": "Secret-Way-Demonlist-Weekly"
    },
    method="POST"
)

try:

    with urllib.request.urlopen(request) as response:

        if response.status not in (200, 204):
            raise RuntimeError(
                f"Discord returned status {response.status}"
            )

        print(
            "Discord announcement sent successfully."
        )

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
# COMMIT CHANGES
# ============================================================

print("Preparing Git commit...")

git(
    "config",
    "user.name",
    "Secret Way Weekly Demon Bot"
)

git(
    "config",
    "user.email",
    "41898282+github-actions[bot]@users.noreply.github.com"
)

git(
    "add",
    str(WEEKLY_FILE),
    str(weekly_file)
)

git(
    "commit",
    "-m",
    f"Add Weekly Demon: {name}"
)

print("Git commit created.")


# ============================================================
# PUSH TO MAIN
# ============================================================

print("Pushing changes to GitHub...")

git(
    "push",
    "origin",
    "HEAD:main"
)

print("Changes pushed successfully.")

print()
print("=" * 60)
print("WEEKLY DEMON COMPLETE")
print("=" * 60)
