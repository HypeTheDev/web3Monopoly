import { 
  GameState, 
  GameMode, 
  DBAGameState, 
  NBAPlayer, 
  DBATeam, 
  DBALeague, 
  DBAGame, 
  NBAStatLine,
  LeagueRules,
  GameEntry 
} from '../types/GameTypes';

// NBA Player Data Generator
const NBA_PLAYER_POOL = {
  PG: [
    { name: 'Nexus Prime', team: 'NEO-LAKERS', power: 'Reality Warping' },
    { name: 'Quantum Flash', team: 'CYBER-WARRIORS', power: 'Time Dilation' },
    { name: 'Void Walker', team: 'MATRIX-NETS', power: 'Shadow Travel' },
    { name: 'Pulse Master', team: 'NEON-HEAT', power: 'Energy Manipulation' },
    { name: 'Mind Bender', team: 'GHOST-SPURS', power: 'Telepathy' }
  ],
  SG: [
    { name: 'Arcane Sniper', team: 'PIXEL-CELTICS', power: 'Perfect Aim' },
    { name: 'Plasma Storm', team: 'DIGITAL-BULLS', power: 'Electric Control' },
    { name: 'Crystal Shard', team: 'HOLO-ROCKETS', power: 'Crystal Generation' },
    { name: 'Wind Dancer', team: 'FLUX-CLIPPERS', power: 'Aerokinesis' },
    { name: 'Solar Flare', team: 'NOVA-SUNS', power: 'Heat Manipulation' }
  ],
  SF: [
    { name: 'Titanium Hawk', team: 'STEEL-HAWKS', power: 'Metal Control' },
    { name: 'Void Reaper', team: 'SHADOW-KINGS', power: 'Darkness Manipulation' },
    { name: 'Prism Knight', team: 'LIGHT-BLAZERS', power: 'Light Refraction' },
    { name: 'Storm Bringer', team: 'THUNDER-SONICS', power: 'Weather Control' },
    { name: 'Phoenix Wing', team: 'FIRE-BIRDS', power: 'Regeneration' }
  ],
  PF: [
    { name: 'Iron Colossus', team: 'METAL-PISTONS', power: 'Super Strength' },
    { name: 'Earthquake', team: 'GROUND-BUCKS', power: 'Seismic Control' },
    { name: 'Diamond Shield', team: 'CRYSTAL-MAGIC', power: 'Invulnerability' },
    { name: 'Mountain Peak', team: 'STONE-NUGGETS', power: 'Earth Manipulation' },
    { name: 'Avalanche', team: 'ICE-WOLVES', power: 'Ice Control' }
  ],
  C: [
    { name: 'Tower Titan', team: 'SKY-SIXERS', power: 'Size Manipulation' },
    { name: 'Gravity Well', team: 'VOID-PACERS', power: 'Gravity Control' },
    { name: 'Steel Fortress', team: 'ARMOR-CAVS', power: 'Defensive Mastery' },
    { name: 'Thunder Giant', team: 'STORM-GRIZZLIES', power: 'Electric Power' },
    { name: 'Mystic Guardian', team: 'MAGIC-HORNETS', power: 'Force Fields' }
  ]
};

export class DBAEngine {
  private gameState: DBAGameState;
  private onGameUpdate: (gameState: GameState, logEntry: GameEntry) => void;
  private gameLog: GameEntry[];
  private gameInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private nbaPlayersPool: NBAPlayer[] = [];
  private leagueRules: LeagueRules;

  constructor(onGameUpdate?: (gameState: GameState, logEntry: GameEntry) => void) {
    this.onGameUpdate = onGameUpdate || (() => {});
    this.gameLog = [];
    this.leagueRules = this.getDefaultLeagueRules();
    this.nbaPlayersPool = this.generateNBAPlayersPool();
    this.gameState = this.initializeGameState();
  }

  private getDefaultLeagueRules(): LeagueRules {
    return {
      scoringSystem: {
        pointsMultiplier: 1,
        reboundsMultiplier: 1.2,
        assistsMultiplier: 1.5,
        stealsMultiplier: 3,
        blocksMultiplier: 3,
        turnoversMultiplier: -1,
        threesMadeBonus: 0.5,
        doubleDoubleBonus: 5,
        tripleDoubleBonus: 10
      },
      settings: {
        maxPlayersPerTeam: 15,
        maxLineupSize: 5,
        startingPositions: ['PG', 'SG', 'SF', 'PF', 'C'],
        benchSize: 10,
        salaryCap: 120000000, // $120M salary cap
        tradeDeadline: new Date('2025-03-15')
      }
    };
  }

  private generateNBAPlayersPool(): NBAPlayer[] {
    const allPlayers: NBAPlayer[] = [];
    let playerId = 1;

    // Generate players for each position
    Object.entries(NBA_PLAYER_POOL).forEach(([position, playerTemplates]) => {
      playerTemplates.forEach((template, index) => {
        const rarity = this.getRandomRarity();
        const baseStats = this.generateBaseStats(position as any, rarity);
        
        const player: NBAPlayer = {
          id: `nba-${playerId++}`,
          name: template.name,
          team: template.team,
          position: position as any,
          stats: baseStats,
          contract: {
            team: template.team,
            salary: this.calculateSalary(baseStats, rarity),
            yearsLeft: Math.floor(Math.random() * 4) + 1
          },
          rarity: rarity,
          value: this.calculatePlayerValue(baseStats, rarity)
        };
        
        allPlayers.push(player);
      });
    });

    // Generate additional random players to fill the pool
    for (let i = 0; i < 200; i++) {
      const positions = ['PG', 'SG', 'SF', 'PF', 'C'] as const;
      const position = positions[Math.floor(Math.random() * positions.length)];
      const rarity = this.getRandomRarity();
      const baseStats = this.generateBaseStats(position, rarity);
      
      const player: NBAPlayer = {
        id: `nba-${playerId++}`,
        name: this.generateRandomPlayerName(),
        team: 'FREE_AGENT',
        position: position,
        stats: baseStats,
        contract: {
          team: 'FREE_AGENT',
          salary: this.calculateSalary(baseStats, rarity),
          yearsLeft: 1
        },
        rarity: rarity,
        value: this.calculatePlayerValue(baseStats, rarity)
      };
      
      allPlayers.push(player);
    }

    return allPlayers;
  }

  private getRandomRarity(): NBAPlayer['rarity'] {
    const rand = Math.random();
    if (rand < 0.5) return 'Common';
    if (rand < 0.75) return 'Uncommon';
    if (rand < 0.9) return 'Rare';
    if (rand < 0.98) return 'Epic';
    return 'Legendary';
  }

  private generateBaseStats(position: NBAPlayer['position'], rarity: NBAPlayer['rarity']) {
    const rarityMultiplier = {
      'Common': 0.7,
      'Uncommon': 0.85,
      'Rare': 1.0,
      'Epic': 1.2,
      'Legendary': 1.5
    }[rarity];

    const positionBase = {
      'PG': { points: 15, rebounds: 4, assists: 8, steals: 1.5, blocks: 0.3, fgPercent: 45, threePercent: 35, ftPercent: 80 },
      'SG': { points: 20, rebounds: 5, assists: 5, steals: 1.2, blocks: 0.4, fgPercent: 47, threePercent: 38, ftPercent: 85 },
      'SF': { points: 18, rebounds: 7, assists: 6, steals: 1.3, blocks: 0.8, fgPercent: 48, threePercent: 36, ftPercent: 82 },
      'PF': { points: 16, rebounds: 10, assists: 3, steals: 0.8, blocks: 1.5, fgPercent: 50, threePercent: 30, ftPercent: 75 },
      'C': { points: 14, rebounds: 12, assists: 2, steals: 0.6, blocks: 2.2, fgPercent: 55, threePercent: 25, ftPercent: 70 }
    }[position];

    return {
      points: Math.round(positionBase.points * rarityMultiplier * (0.8 + Math.random() * 0.4)),
      rebounds: Math.round(positionBase.rebounds * rarityMultiplier * (0.8 + Math.random() * 0.4)),
      assists: Math.round(positionBase.assists * rarityMultiplier * (0.8 + Math.random() * 0.4)),
      steals: Math.round(positionBase.steals * rarityMultiplier * (0.8 + Math.random() * 0.4) * 10) / 10,
      blocks: Math.round(positionBase.blocks * rarityMultiplier * (0.8 + Math.random() * 0.4) * 10) / 10,
      fgPercent: Math.round(positionBase.fgPercent * (0.9 + Math.random() * 0.2)),
      threePercent: Math.round(positionBase.threePercent * (0.8 + Math.random() * 0.4)),
      ftPercent: Math.round(positionBase.ftPercent * (0.9 + Math.random() * 0.2))
    };
  }

  private calculateSalary(stats: NBAPlayer['stats'], rarity: NBAPlayer['rarity']): number {
    const baseValue = (stats.points * 500000) + (stats.rebounds * 300000) + (stats.assists * 400000) + 
                     (stats.steals * 1000000) + (stats.blocks * 1000000);
    
    const rarityMultiplier = {
      'Common': 0.5,
      'Uncommon': 0.7,
      'Rare': 1.0,
      'Epic': 1.5,
      'Legendary': 2.5
    }[rarity];

    return Math.round(baseValue * rarityMultiplier);
  }

  private calculatePlayerValue(stats: NBAPlayer['stats'], rarity: NBAPlayer['rarity']): number {
    return this.calculateSalary(stats, rarity) * 1.2; // Market value is typically higher than salary
  }

  private generateRandomPlayerName(): string {
    const firstNames = ['Neo', 'Matrix', 'Cyber', 'Digital', 'Quantum', 'Pixel', 'Binary', 'Code', 'Data', 'Virtual'];
    const lastNames = ['Walker', 'Runner', 'Ghost', 'Phantom', 'Shadow', 'Storm', 'Lightning', 'Thunder', 'Blade', 'Steel'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }

  private initializeGameState(): DBAGameState {
    const teams = this.createDBATeams();
    const league = this.createLeague(teams);
    
    return {
      gameMode: GameMode.DBA,
      players: [], // DBA uses teams, not individual players
      currentPlayerIndex: 0,
      gameStatus: 'waiting',
      roundNumber: 1,
      league: league,
      currentTeam: teams[0].id, // User controls first team
      currentView: 'dashboard',
      leagueRules: this.leagueRules
    };
  }

  private createDBATeams(): DBATeam[] {
    const teamNames = [
      'User Team', // Player's team
      'Neon Niques', 'Digital Dunkers', 'Matrix MVPs', 'Pixel Pacers',
      'Circuit Cavaliers', 'Binary Bucks', 'Quantum Lakers', 'Glitch Heat'
    ];

    return teamNames.map((name, index) => {
      const teamId = `dba-team-${index}`;
      const roster = this.draftRandomRoster();
      
      const team: DBATeam = {
        id: teamId,
        name: name,
        owner: index === 0 ? 'user' : `ai-${index}`,
        players: roster,
        startingLineup: {
          PG: null, SG: null, SF: null, PF: null, C: null
        },
        bench: [],
        budget: 100000000, // $100M starting budget
        leagueRank: index + 1,
        record: { wins: 0, losses: 0 },
        totalValue: 0
      };

      this.optimizeStartingLineup(team);
      team.totalValue = this.calculateTeamValue(team);
      
      return team;
    });
  }

  private draftRandomRoster(): NBAPlayer[] {
    const availablePlayers = [...this.nbaPlayersPool];
    const roster: NBAPlayer[] = [];
    
    // Draft starting lineup (one of each position)
    const positions: NBAPlayer['position'][] = ['PG', 'SG', 'SF', 'PF', 'C'];
    positions.forEach(position => {
      const positionPlayers = availablePlayers.filter(p => p.position === position);
      if (positionPlayers.length > 0) {
        const selectedIndex = Math.floor(Math.random() * Math.min(5, positionPlayers.length));
        const selectedPlayer = positionPlayers[selectedIndex];
        roster.push(selectedPlayer);
        
        // Remove from available pool
        const poolIndex = availablePlayers.indexOf(selectedPlayer);
        if (poolIndex > -1) {
          availablePlayers.splice(poolIndex, 1);
        }
      }
    });

    // Draft bench players (10 more random players)
    for (let i = 0; i < 10 && availablePlayers.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availablePlayers.length);
      const selectedPlayer = availablePlayers[randomIndex];
      roster.push(selectedPlayer);
      availablePlayers.splice(randomIndex, 1);
    }

    return roster;
  }

  private optimizeStartingLineup(team: DBATeam): void {
    const positions: (keyof DBATeam['startingLineup'])[] = ['PG', 'SG', 'SF', 'PF', 'C'];
    
    positions.forEach(position => {
      const positionPlayers = team.players.filter(p => p.position === position);
      if (positionPlayers.length > 0) {
        // Select best player for the position based on overall rating
        const bestPlayer = positionPlayers.reduce((best, current) => 
          this.calculatePlayerRating(current) > this.calculatePlayerRating(best) ? current : best
        );
        team.startingLineup[position] = bestPlayer;
      }
    });

    // Set bench players (those not in starting lineup)
    team.bench = team.players.filter(player => 
      !Object.values(team.startingLineup).includes(player)
    );
  }

  private calculatePlayerRating(player: NBAPlayer): number {
    return player.stats.points + player.stats.rebounds + player.stats.assists + 
           (player.stats.steals * 2) + (player.stats.blocks * 2) + 
           (player.stats.fgPercent / 10) + (player.stats.threePercent / 10);
  }

  private calculateTeamValue(team: DBATeam): number {
    return team.players.reduce((total, player) => total + player.value, 0);
  }

  private createLeague(teams: DBATeam[]): DBALeague {
    return {
      season: 2025,
      currentWeek: 1,
      standings: [...teams].sort((a, b) => b.totalValue - a.totalValue),
      schedule: this.generateSeasonSchedule(teams),
      draftOrder: teams.map(t => t.id),
      freeAgents: this.nbaPlayersPool.filter(p => p.team === 'FREE_AGENT').slice(0, 50),
      activeTrades: []
    };
  }

  private generateSeasonSchedule(teams: DBATeam[]): DBAGame[] {
    const schedule: DBAGame[] = [];
    const weeks = 18; // 18-week season
    let gameId = 1;

    for (let week = 1; week <= weeks; week++) {
      // Generate matchups for this week
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < shuffledTeams.length; i += 2) {
        if (i + 1 < shuffledTeams.length) {
          const homeTeam = shuffledTeams[i];
          const awayTeam = shuffledTeams[i + 1];
          
          const game: DBAGame = {
            id: `game-${gameId++}`,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            date: new Date(2025, 0, week * 7), // Each week is 7 days apart
            status: week === 1 ? 'scheduled' : 'scheduled'
          };
          
          schedule.push(game);
        }
      }
    }

    return schedule;
  }

  public startGameLoop(speed: number): void {
    this.logEntry('DBA_START', '🏀 Starting DBA season simulation...');
    this.isRunning = true;
    this.gameState.gameStatus = 'playing';

    // Process first week games immediately
    setTimeout(() => this.processWeeklyGames(), 500);

    // Set up weekly processing
    this.gameInterval = setInterval(() => {
      if (this.isRunning && this.gameState.gameStatus === 'playing') {
        this.processWeeklyGames();
      }
    }, speed);

    this.onGameUpdate(this.gameState, new GameEntry(0, 'SYSTEM', 'SEASON_START', '🏀 DBA Season 2025 has begun!'));
  }

  public stopGameLoop(): void {
    this.isRunning = false;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
    this.logEntry('DBA_STOP', 'DBA simulation paused');
  }

  private processWeeklyGames(): void {
    const currentWeek = this.gameState.league.currentWeek;
    const weekGames = this.gameState.league.schedule.filter(game => 
      game.date.getTime() <= new Date(2025, 0, currentWeek * 7).getTime() && 
      game.status === 'scheduled'
    );

    this.logEntry('WEEK_START', `📅 Processing Week ${currentWeek} games...`);

    // Simulate all games for this week
    weekGames.forEach(game => {
      this.simulateGame(game);
    });

    // Update standings
    this.updateStandings();

    // Advance to next week
    this.gameState.league.currentWeek++;
    this.gameState.roundNumber++;

    // Check for season end
    if (this.gameState.league.currentWeek > 18) {
      this.endSeason();
    }

    this.onGameUpdate(this.gameState, new GameEntry(this.gameState.roundNumber, 'LEAGUE', 'WEEK_COMPLETE', `Week ${currentWeek} completed`));
  }

  private simulateGame(game: DBAGame): void {
    game.status = 'playing';
    
    // Simulate the game between two teams
    const homeScore = this.calculateTeamScore(game.homeTeam);
    const awayScore = this.calculateTeamScore(game.awayTeam);
    
    const winner = homeScore > awayScore ? game.homeTeam : game.awayTeam;
    const loser = homeScore > awayScore ? game.awayTeam : game.homeTeam;
    
    // Update team records
    winner.record.wins++;
    loser.record.losses++;
    
    // Generate player stats
    const playerStats = this.generateGameStats(game.homeTeam, game.awayTeam);
    
    // Find MVP
    const allStats = Object.values(playerStats);
    const mvpStats = allStats.reduce((best, current) => 
      this.calculateFantasyPoints(current) > this.calculateFantasyPoints(best) ? current : best
    );
    
    const mvpPlayer = [...game.homeTeam.players, ...game.awayTeam.players]
      .find(p => p.id === mvpStats.playerId);

    game.result = {
      homeScore,
      awayScore,
      winner,
      mvp: {
        player: mvpPlayer!,
        points: mvpStats.points,
        rebounds: mvpStats.rebounds,
        assists: mvpStats.assists
      },
      playerStats
    };
    
    game.status = 'completed';
    
    this.logEntry('GAME_RESULT', 
      `🏀 ${winner.name} defeated ${loser.name} ${Math.max(homeScore, awayScore)}-${Math.min(homeScore, awayScore)}. MVP: ${mvpPlayer?.name} (${mvpStats.points}pts/${mvpStats.rebounds}reb/${mvpStats.assists}ast)`
    );
  }

  private calculateTeamScore(team: DBATeam): number {
    const lineup = Object.values(team.startingLineup).filter(p => p !== null) as NBAPlayer[];
    const teamRating = lineup.reduce((total, player) => total + this.calculatePlayerRating(player), 0);
    
    // Base score with some randomness
    const baseScore = 90 + (teamRating / 10);
    const randomFactor = (Math.random() - 0.5) * 20; // ±10 point variance
    
    return Math.round(Math.max(70, baseScore + randomFactor));
  }

  private generateGameStats(homeTeam: DBATeam, awayTeam: DBATeam): Record<string, NBAStatLine> {
    const stats: Record<string, NBAStatLine> = {};
    
    // Generate stats for starting lineup players
    [homeTeam, awayTeam].forEach(team => {
      Object.values(team.startingLineup).forEach(player => {
        if (player) {
          const minutes = 25 + Math.random() * 15; // 25-40 minutes
          const performance = 0.7 + Math.random() * 0.6; // 70-130% of average performance
          
          stats[player.id] = {
            playerId: player.id,
            playerName: player.name,
            points: Math.round(player.stats.points * performance),
            rebounds: Math.round(player.stats.rebounds * performance),
            assists: Math.round(player.stats.assists * performance),
            steals: Math.round(player.stats.steals * performance),
            blocks: Math.round(player.stats.blocks * performance),
            fgm: Math.round((player.stats.points * performance) / 2.2), // Rough estimate
            fga: Math.round((player.stats.points * performance) / 1.1), // 50% shooting
            threePm: Math.round((player.stats.points * performance) * 0.2), // 20% from 3s
            threePa: Math.round((player.stats.points * performance) * 0.4), // Attempts
            ftm: Math.round((player.stats.points * performance) * 0.15),
            fta: Math.round((player.stats.points * performance) * 0.2),
            minutes: Math.round(minutes),
            plusMinus: Math.round((Math.random() - 0.5) * 20) // ±10
          };
        }
      });
    });
    
    return stats;
  }

  private calculateFantasyPoints(stats: NBAStatLine): number {
    const rules = this.leagueRules.scoringSystem;
    
    let points = (stats.points * rules.pointsMultiplier) +
                 (stats.rebounds * rules.reboundsMultiplier) +
                 (stats.assists * rules.assistsMultiplier) +
                 (stats.steals * rules.stealsMultiplier) +
                 (stats.blocks * rules.blocksMultiplier) +
                 (stats.threePm * rules.threesMadeBonus);
    
    // Double-double bonus
    let doubleDoubleStats = 0;
    if (stats.points >= 10) doubleDoubleStats++;
    if (stats.rebounds >= 10) doubleDoubleStats++;
    if (stats.assists >= 10) doubleDoubleStats++;
    if (stats.steals >= 10) doubleDoubleStats++;
    if (stats.blocks >= 10) doubleDoubleStats++;
    
    if (doubleDoubleStats >= 2) {
      points += rules.doubleDoubleBonus;
      if (doubleDoubleStats >= 3) {
        points += rules.tripleDoubleBonus;
      }
    }
    
    return Math.round(points * 10) / 10;
  }

  private updateStandings(): void {
    this.gameState.league.standings = [...this.gameState.league.standings].sort((a, b) => {
      const aWinPct = a.record.wins / (a.record.wins + a.record.losses) || 0;
      const bWinPct = b.record.wins / (b.record.wins + b.record.losses) || 0;
      
      if (aWinPct !== bWinPct) return bWinPct - aWinPct;
      return b.record.wins - a.record.wins; // Tiebreaker: total wins
    });
    
    // Update league ranks
    this.gameState.league.standings.forEach((team, index) => {
      team.leagueRank = index + 1;
    });
  }

  private endSeason(): void {
    this.gameState.gameStatus = 'ended';
    this.stopGameLoop();
    
    const champion = this.gameState.league.standings[0];
    this.logEntry('SEASON_END', `🏆 Season 2025 complete! ${champion.name} wins the championship with a ${champion.record.wins}-${champion.record.losses} record!`);
  }

  public advanceWeek(): void {
    if (this.gameState.gameStatus === 'playing') {
      this.processWeeklyGames();
    }
  }

  public getUserTeam(): DBATeam | undefined {
    return this.gameState.league.standings.find(team => team.owner === 'user');
  }

  public getWeeklyMatchups(week?: number): DBAGame[] {
    const targetWeek = week || this.gameState.league.currentWeek;
    return this.gameState.league.schedule.filter(game => 
      game.date.getTime() <= new Date(2025, 0, targetWeek * 7).getTime() &&
      game.date.getTime() > new Date(2025, 0, (targetWeek - 1) * 7).getTime()
    );
  }

  public getPlayerLeaderboard(stat: keyof NBAStatLine): NBAPlayer[] {
    // This would need to aggregate stats across all games
    // For now, return sorted by base stats
    const statMap: Record<keyof NBAStatLine, keyof NBAPlayer['stats']> = {
      points: 'points',
      rebounds: 'rebounds',
      assists: 'assists',
      steals: 'steals',
      blocks: 'blocks'
    } as any;
    
    const relevantStat = statMap[stat] || 'points';
    
    return [...this.nbaPlayersPool]
      .filter(p => p.team !== 'FREE_AGENT')
      .sort((a, b) => (b.stats[relevantStat] || 0) - (a.stats[relevantStat] || 0))
      .slice(0, 20);
  }

  private logEntry(actionType: string, details: string): void {
    const entry = new GameEntry(this.gameLog.length + 1, 'SYSTEM', actionType, details);
    this.gameLog.push(entry);
    this.onGameUpdate(this.gameState, entry);
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public getGameLog(): GameEntry[] {
    return this.gameLog.slice();
  }

  public resetGame(): void {
    this.stopGameLoop();
    this.nbaPlayersPool = this.generateNBAPlayersPool();
    this.gameState = this.initializeGameState();
    this.gameLog = [];
    this.logEntry('DBA_RESET', 'DBA league has been reset for new season');
  }

  public adjustSpeed(speed: number): void {
    if (this.gameInterval) {
      this.stopGameLoop();
      this.startGameLoop(speed);
    }
  }
}

export default DBAEngine;