import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = './data';

// Cache successfully loaded lists for this page session.
const listCache = new Map();

// Reuse requests that are already loading.
const listRequests = new Map();



/*
 * Cached verifier lookup for original Main/Extended levels.
 * Built only once per page session.
 */
let originalVerifierMapPromise = null;

async function getOriginalVerifierMap() {
    if (originalVerifierMapPromise) {
        return originalVerifierMapPromise;
    }

    originalVerifierMapPromise = (async () => {
        const verifierMap = new Map();

        const response = await fetch(`${dir}/_list.json`);

        if (!response.ok) {
            throw new Error('Failed to load _list.json');
        }

        const paths = await response.json();

        // Fetch a small batch at a time to avoid flooding the server.
        const batchSize = 10;

        for (let i = 0; i < paths.length; i += batchSize) {
            const batch = paths.slice(i, i + batchSize);

            const levels = await Promise.all(
                batch.map(async (path) => {
                    try {
                        const result = await fetch(`${dir}/${path}.json`);

                        if (!result.ok) {
                            return null;
                        }

                        return await result.json();
                    } catch {
                        return null;
                    }
                })
            );

            levels.forEach((level) => {
                if (
                    level &&
                    level.id != null &&
                    level.verifier &&
                    !['unknown', 'none'].includes(
                        String(level.verifier).trim().toLowerCase()
                    )
                ) {
                    verifierMap.set(
                        String(level.id),
                        level.verifier
                    );
                }
            });
        }

        return verifierMap;
    })().catch((error) => {
        // Allow a later attempt if loading fails.
        originalVerifierMapPromise = null;
        throw error;
    });

    return originalVerifierMapPromise;
}




export async function fetchList(routePath = window.location.hash) {
    const route = routePath || window.location.hash;

    let listFile = '_list.json';

    if (route.includes('/unverified')) {
        listFile = '_unverified.json';
    } else if (route.includes('/anomalies')) {
        listFile = '_anomalies.json';
    } else if (route.includes('/weekly')) {
        listFile = '_weekly.json';
    } else if (route.includes('/removed')) {
        listFile = '_removed.json';
    }

    // Reuse a fully loaded list immediately.
    if (listCache.has(listFile)) {
        return listCache.get(listFile);
    }

    // If this list is already loading, share that request.
    if (listRequests.has(listFile)) {
        return listRequests.get(listFile);
    }

    const request = (async () => {
        try {
            const listResponse = await fetch(`${dir}/${listFile}`);

            if (!listResponse.ok) {
                throw new Error(
                    `Failed to load ${listFile}: HTTP ${listResponse.status}`
                );
            }

            const paths = await listResponse.json();

            if (!Array.isArray(paths)) {
                throw new Error(`${listFile} did not contain a list`);
            }

            // Preserve the original order while limiting concurrency.
            const results = new Array(paths.length);
            const batchSize = 6;

            for (
                let start = 0;
                start < paths.length;
                start += batchSize
            ) {
                const batch = paths.slice(start, start + batchSize);

                const batchResults = await Promise.all(
                    batch.map(async (path, offset) => {
                        const rank = start + offset;

                        try {
                            const response = await fetch(
                                `${dir}/${path}.json`
                            );

                            if (!response.ok) {
                                throw new Error(
                                    `HTTP ${response.status} ${response.statusText}`
                                );
                            }

                            const level = await response.json();

                            if (
                                !level ||
                                typeof level !== 'object' ||
                                Array.isArray(level)
                            ) {
                                throw new Error('Invalid level data');
                            }

                            // Preserve the existing weekly verifier recovery.
                            if (
                                route.includes('/weekly') &&
                                (
                                    !level.verifier ||
                                    ['unknown', 'none'].includes(
                                        String(level.verifier)
                                            .trim()
                                            .toLowerCase()
                                    )
                                )
                            ) {
                                try {
                                    const verifierMap =
                                        await getOriginalVerifierMap();

                                    const originalVerifier =
                                        verifierMap.get(String(level.id));

                                    if (originalVerifier) {
                                        level.verifier = originalVerifier;
                                    }
                                } catch (error) {
                                    console.warn(
                                        `Could not recover verifier for weekly level: ${path}`,
                                        error
                                    );
                                }
                            }

                            return [
                                {
                                    ...level,
                                    path,
                                    records: Array.isArray(level.records)
                                        ? level.records.sort(
                                            (a, b) => b.percent - a.percent
                                        )
                                        : [],
                                },
                                null,
                            ];
                        } catch (error) {
                            console.error(
                                `Failed to load level #${rank + 1} ${path}.`,
                                error
                            );

                            return [null, path];
                        }
                    })
                );

                // Promise.all preserves order within each batch.
                batchResults.forEach((result, offset) => {
                    results[start + offset] = result;
                });
            }

            // Never permanently cache a list containing failed levels.
            // A later visit can retry those requests.
            const complete = results.every(
                ([level, error]) => level !== null && error === null
            );

            if (complete) {
                listCache.set(listFile, results);
            }

            return results;
        } catch (error) {
            console.error('Failed to load list.', error);
            return null;
        }
    })();

    listRequests.set(listFile, request);

    try {
        return await request;
    } finally {
        // Remove only our own request, never a newer one.
        if (listRequests.get(listFile) === request) {
            listRequests.delete(listFile);
        }
    }
}



export async function fetchSearchData() {
    const lists = {
        main: '_list.json',
        unverified: '_unverified.json',
        anomalies: '_anomalies.json',
        weekly: '_weekly.json',
        removed: '_removed.json',
    };

    const result = {
        main: [],
        unverified: [],
        anomalies: [],
        weekly: [],
        removed: [],
    };

    for (const [type, file] of Object.entries(lists)) {
        try {
            const response = await fetch(`${dir}/${file}`);
            const paths = await response.json();

            result[type] = await Promise.all(
                paths.map(async (path) => {
                    try {
                        const level = await fetch(`${dir}/${path}.json`).then(
                            (res) => res.json(),
                        );

                        return {
                            ...level,
                            path,
                        };
                    } catch {
                        return null;
                    }
                }),
            );

            result[type] = result[type].filter(Boolean);
        } catch {
            result[type] = [];
        }
    }

    return result;
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

    // Safety check: prevent the leaderboard from crashing if the list
    // could not be loaded.
    if (!list) {
        return [[], ["_list.json"]];
    }

    const scoreMap = {};
    const errs = [];

    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        // Skip malformed level data rather than crashing the entire
        // leaderboard.
        if (!level) {
            return;
        }

        // Verification
        if (
    level.verifier &&
    level.verifier.toLowerCase() !== 'unknown' &&
    level.verifier.toLowerCase() !== 'none'
) {

            const verifier =
                Object.keys(scoreMap).find(
                    (u) =>
                        u.toLowerCase() ===
                        level.verifier.toLowerCase(),
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
                score: score(
                    rank + 1,
                    100,
                    level.percentToQualify,
                ),
                link: level.verification,
            });
        }

        // Records
        if (Array.isArray(level.records)) {
            level.records.forEach((record) => {
                if (!record || !record.user) {
                    return;
                }

                const user =
                    Object.keys(scoreMap).find(
                        (u) =>
                            u.toLowerCase() ===
                            record.user.toLowerCase(),
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
                        score: score(
                            rank + 1,
                            100,
                            level.percentToQualify,
                        ),
                        link: record.link,
                    });

                    return;
                }

                progressed.push({
                    rank: rank + 1,
                    level: level.name,
                    percent: record.percent,
                    score: score(
                        rank + 1,
                        record.percent,
                        level.percentToQualify,
                    ),
                    link: record.link,
                });
            });
        }
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
    const listFile = await fetch('data/_weekly.json').then(res => res.json());
    
    // 2. Fetch all individual level data files inside data/weekly/
    const list = await Promise.all(
        listFile.map(async (path) => {
            try {
                const level = await fetch(`data/${path}.json`).then(res => res.json());
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

