// src/utils/leaderboard.ts
export interface LeaderboardEntry {
    score: number;
    archers: number;
    wizards: number;
    shieldWielders: number;
  }
  
  export const saveToLeaderboard = (entry: LeaderboardEntry) => {
    const storedLeaderboard = localStorage.getItem('leaderboard');
    let leaderboard: LeaderboardEntry[] = storedLeaderboard
      ? JSON.parse(storedLeaderboard)
      : [];
    leaderboard.push(entry);
    leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 10); // Keep top 10 entries
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };
  