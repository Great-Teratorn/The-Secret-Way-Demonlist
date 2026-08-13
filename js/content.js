import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = './data';

export async function fetchList() {
    
    let listFile = '_list.json';
    const hash = window.location.hash;
    
    if (hash.includes('/extended')) {
        listFile = '_extended.json';
    } else if (hash.includes('/legacy')) {
        listFile = '_legacy.json';
    } else if (hash.includes('/unverified')) {
        listFile = '_unverified.json';
    } else if (hash.includes('/anomalies')) {
        listFile = '_anomalies.json';
    } else if (hash.includes('/weekly')) {
        listFile = '_weekly.json';
    }
    
    const listResult = await fetch(`${dir}/${listFile}`);
    
    try {
        const list = await listResult.json();
        return await Promise.all(
            list.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);
                try {
                    const level = await levelResult.json();
                    return [
                        {
                            ...level,
                            path,
                            records: level.records.sort(
                                (a, b) => b.percent - a.percent,
                            ),
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load level #${rank + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load list.`);
        return null;
    }
}

export async function fetchEditors() {
    try {
        const editorsResults = await fetch(`${dir}/_editors.json`);
        const editors = await editorsResults.json();
        return editors;
    } catch {
        return null;
    }
}

export async function fetchLeaderboard() {
    const list = await fetchList();

    const scoreMap = {};
    const errs = [];
    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        // Verification
        const verifier = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.verifier.toLowerCase(),
        ) || level.verifier;
        scoreMap[verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
        };
        const { verified } = scoreMap[verifier];
        verified.push({
            rank: rank + 1,
            level: level.name,
            score: score(rank + 1, 100, level.percentToQualify),
            link: level.verification,
        });

        // Records
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;
            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };
            const { completed, progressed } = scoreMap[user];
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: score(rank + 1, record.percent, level.percentToQualify),
                link: record.link,
            });
        });
    });

    // Wrap in extra Object containing the user and total score
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    // Sort by total score
    return [res.sort((a, b) => b.total - a.total), errs];
}



export async function fetchWeeklyLeaderboard() {
    // 1. Fetch the master weekly list array
    const listFile = await fetch('/data/_weekly.json').then(res => res.json());
    
    // 2. Fetch all individual level data files inside data/weekly/
    const list = await Promise.all(
        listFile.map(async (path) => {
            try {
                const level = await fetch(`/data/${path}.json`).then(res => res.json());
                return [level, null];
            } catch (err) {
                return [null, path];
            }
        })
    );

    const scoreMap = {};
    const errs = [];
    
    list.forEach(([level, err]) => {
        if (err) {
            errs.push(err);
            return;
        }

        // Verification (Give the verifier 1 point)
        const verifier = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.verifier.toLowerCase(),
        ) || level.verifier;
        scoreMap[verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
        };
        const { verified } = scoreMap[verifier];
        verified.push({
            level: level.name,
            weeklyDate: level.weeklyDate,
            score: 1, // Flat 1 point instead of score function
            link: level.verification,
        });

        // Player Records
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;
            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };
            const { completed } = scoreMap[user];
            
            // Only award points for 100% completions on weekly demons
            if (record.percent === 100) {
                completed.push({
                    level: level.name,
                    weeklyDate: level.weeklyDate,
                    score: 1, // Flat 1 point
                    link: record.link,
                });
            }
        });
    });

    // Aggregate totals
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed } = scores;
        const total = [verified, completed].flat().length; // Counts total entries

        return {
            user,
            total,
            ...scores,
        };
    });

    // Sort by who has the most weekly completions
    return [res.sort((a, b) => b.total - a.total), errs];
}

