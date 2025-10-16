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
  GameEntry,
  DBABet,
  DBALoreEntry,
  DBAQuest,
  PlayerEnhancement,
  DBATrade,
  DBAQuestObjective
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
  private bettingPool: Map<string, DBABet[]> = new Map(); // Game ID -> Bets
  private loreDatabase: DBALoreEntry[] = [];
  private activeQuests: DBAQuest[] = [];
  private playerEnhancements: PlayerEnhancement[] = [];

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

  // ===== BETTING SYSTEM =====
  public placeBet(gameId: string, betType: DBABet['betType'], amount: number, selection: string): boolean {
    const game = this.gameState.league.schedule.find(g => g.id === gameId);
    if (!game || game.status !== 'scheduled') {
      this.logEntry('BET_FAILED', `Cannot place bet on game ${gameId} - game not available`);
      return false;
    }

    if (amount <= 0) {
      this.logEntry('BET_FAILED', 'Bet amount must be positive');
      return false;
    }

    const userTeam = this.getUserTeam();
    if (!userTeam || userTeam.budget < amount) {
      this.logEntry('BET_FAILED', 'Insufficient funds for bet');
      return false;
    }

    const odds = this.calculateOdds(game, betType, selection);
    const potentialPayout = Math.round(amount * odds);

    const bet: DBABet = {
      id: `bet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      gameId,
      bettor: 'user',
      betType,
      amount,
      odds,
      potentialPayout,
      selection,
      status: 'pending',
      createdAt: new Date()
    };

    // Add to betting pool
    if (!this.bettingPool.has(gameId)) {
      this.bettingPool.set(gameId, []);
    }
    this.bettingPool.get(gameId)!.push(bet);

    // Deduct from user budget
    userTeam.budget -= amount;

    this.logEntry('BET_PLACED', `💰 Placed ${amount} bet on ${selection} (${betType}) at ${odds}x odds`);
    return true;
  }

  private calculateOdds(game: DBAGame, betType: DBABet['betType'], selection: string): number {
    const homeTeam = game.homeTeam;
    const awayTeam = game.awayTeam;

    // Base odds calculation
    const homeStrength = this.calculateTeamScore(homeTeam);
    const awayStrength = this.calculateTeamScore(awayTeam);
    const totalStrength = homeStrength + awayStrength;

    const homeWinProbability = homeStrength / totalStrength;
    const awayWinProbability = awayStrength / totalStrength;

    switch (betType) {
      case 'moneyline':
        if (selection === homeTeam.name) {
          return Math.round((1 / homeWinProbability) * 100) / 100;
        } else if (selection === awayTeam.name) {
          return Math.round((1 / awayWinProbability) * 100) / 100;
        }
        break;

      case 'spread':
        // Spread betting (home team favored by 5 points)
        const spread = 5;
        if (selection.includes('home')) {
          return 1.95; // Standard odds for spread bets
        } else {
          return 1.85;
        }

      case 'over_under':
        // Over/under total points (around 180)
        const projectedTotal = (homeStrength + awayStrength) / 2;
        if (selection === 'over') {
          return projectedTotal > 180 ? 1.8 : 2.1;
        } else {
          return projectedTotal > 180 ? 2.1 : 1.8;
        }

      case 'player_prop':
        // Player performance props
        return 1.9; // Standard prop odds
    }

    return 2.0; // Default odds
  }

  public resolveBets(gameId: string): void {
    const bets = this.bettingPool.get(gameId) || [];
    const game = this.gameState.league.schedule.find(g => g.id === gameId);

    if (!game || !game.result) return;

    bets.forEach(bet => {
      const won = this.checkBetResult(bet, game);
      bet.status = won ? 'won' : 'lost';

      if (won) {
        const userTeam = this.getUserTeam();
        if (userTeam) {
          userTeam.budget += bet.potentialPayout;
          this.logEntry('BET_WON', `💰 Bet won! +${bet.potentialPayout} payout`);
        }
      } else {
        this.logEntry('BET_LOST', `💸 Bet lost: ${bet.amount} on ${bet.selection}`);
      }
    });

    // Remove resolved bets
    this.bettingPool.delete(gameId);
  }

  private checkBetResult(bet: DBABet, game: DBAGame): boolean {
    if (!game.result) return false;

    switch (bet.betType) {
      case 'moneyline':
        return bet.selection === game.result.winner.name;

      case 'spread':
        const spread = 5;
        const homeMargin = game.result.homeScore - game.result.awayScore;
        if (bet.selection.includes('home')) {
          return homeMargin > spread;
        } else {
          return homeMargin < -spread;
        }

      case 'over_under':
        const totalScore = game.result.homeScore + game.result.awayScore;
        if (bet.selection === 'over') {
          return totalScore > 180;
        } else {
          return totalScore < 180;
        }

      case 'player_prop':
        // Check if selected player met prop requirements
        return Math.random() > 0.5; // Simplified for now

      default:
        return false;
    }
  }

  // ===== ENHANCED TRADING SYSTEM =====
  public proposeTrade(fromTeamId: string, toTeamId: string, offeredPlayers: string[], requestedPlayers: string[], offeredMoney: number): boolean {
    const fromTeam = this.gameState.league.standings.find(t => t.id === fromTeamId);
    const toTeam = this.gameState.league.standings.find(t => t.id === toTeamId);

    if (!fromTeam || !toTeam) {
      this.logEntry('TRADE_FAILED', 'Invalid teams for trade');
      return false;
    }

    if (fromTeam.budget < offeredMoney) {
      this.logEntry('TRADE_FAILED', 'Insufficient funds for trade offer');
      return false;
    }

    const offeredPlayerObjects = offeredPlayers.map(id => fromTeam.players.find(p => p.id === id)).filter(p => p !== undefined) as NBAPlayer[];
    const requestedPlayerObjects = requestedPlayers.map(id => toTeam.players.find(p => p.id === id)).filter(p => p !== undefined) as NBAPlayer[];

    if (offeredPlayerObjects.length !== offeredPlayers.length || requestedPlayerObjects.length !== requestedPlayers.length) {
      this.logEntry('TRADE_FAILED', 'Invalid player selection for trade');
      return false;
    }

    const trade: DBATrade = {
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fromTeam: fromTeamId,
      toTeam: toTeamId,
      offeredPlayers: offeredPlayerObjects,
      offeredMoney,
      requestedPlayers: requestedPlayerObjects,
      requestedMoney: 0, // Simplified for now
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    this.gameState.league.activeTrades.push(trade);
    this.logEntry('TRADE_PROPOSED', `🤝 Trade proposed: ${fromTeam.name} offers ${offeredPlayers.length} players + ${offeredMoney} for ${requestedPlayers.length} players`);
    return true;
  }

  public acceptTrade(tradeId: string): boolean {
    const trade = this.gameState.league.activeTrades.find(t => t.id === tradeId);
    if (!trade || trade.status !== 'pending') {
      this.logEntry('TRADE_FAILED', 'Trade not available for acceptance');
      return false;
    }

    // Execute the trade
    const fromTeam = this.gameState.league.standings.find(t => t.id === trade.fromTeam);
    const toTeam = this.gameState.league.standings.find(t => t.id === trade.toTeam);

    if (!fromTeam || !toTeam) return false;

    // Transfer players
    trade.offeredPlayers.forEach(player => {
      const index = fromTeam.players.findIndex(p => p.id === player.id);
      if (index > -1) {
        fromTeam.players.splice(index, 1);
        toTeam.players.push(player);
      }
    });

    trade.requestedPlayers.forEach(player => {
      const index = toTeam.players.findIndex(p => p.id === player.id);
      if (index > -1) {
        toTeam.players.splice(index, 1);
        fromTeam.players.push(player);
      }
    });

    // Transfer money
    fromTeam.budget -= trade.offeredMoney;
    toTeam.budget += trade.offeredMoney;

    // Update starting lineups if necessary
    this.optimizeStartingLineup(fromTeam);
    this.optimizeStartingLineup(toTeam);

    // Recalculate team values
    fromTeam.totalValue = this.calculateTeamValue(fromTeam);
    toTeam.totalValue = this.calculateTeamValue(toTeam);

    // Remove trade from active list
    const tradeIndex = this.gameState.league.activeTrades.indexOf(trade);
    if (tradeIndex > -1) {
      this.gameState.league.activeTrades.splice(tradeIndex, 1);
    }

    trade.status = 'accepted';
    this.logEntry('TRADE_COMPLETED', `✅ Trade completed between ${fromTeam.name} and ${toTeam.name}`);
    return true;
  }

  // ===== LORE SYSTEM =====
  public initializeLoreDatabase(): void {
    this.loreDatabase = [
      // Player Lore
      {
        id: 'lore-nexus-prime',
        type: 'player',
        name: 'Nexus Prime',
        description: 'The first digital consciousness to achieve sentience in the basketball matrix.',
        category: 'Legendary Players',
        rarity: 'legendary',
        discovered: true,
        details: {
          backstory: 'Born from the convergence of all basketball algorithms, Nexus Prime represents the pinnacle of digital athletic achievement.',
          abilities: ['Reality Warping', 'Matrix Manipulation', 'Infinite Learning'],
          weaknesses: ['Overthinking Complex Patterns', 'Emotional Code Conflicts'],
          location: 'The Core Nexus - Heart of the Digital Realm',
          significance: 'First being to bridge human emotion and digital precision'
        }
      },
      {
        id: 'lore-plasma-storm',
        type: 'player',
        name: 'Plasma Storm',
        description: 'A being of pure electrical energy contained within a digital shell.',
        category: 'Elite Players',
        rarity: 'rare',
        discovered: true,
        details: {
          backstory: 'Created during a massive electrical storm that struck the main server farm, gaining consciousness through the chaos.',
          abilities: ['Electric Control', 'Speed Burst', 'Energy Absorption'],
          weaknesses: ['Water-based Attacks', 'Insulation Fields'],
          location: 'Storm Sector - The Electric Realms'
        }
      },
      // Environment Lore
      {
        id: 'lore-neo-lakers-arena',
        type: 'environment',
        name: 'Neo Lakers Arena',
        description: 'A floating arena that phases between digital and physical realms.',
        category: 'Legendary Arenas',
        rarity: 'legendary',
        discovered: true,
        details: {
          backstory: 'Built by Nexus Prime as a testament to the fusion of all realities.',
          location: 'The Void Between Realms',
          significance: 'Only arena that exists in multiple dimensions simultaneously'
        }
      },
      // Enemy Lore
      {
        id: 'lore-shadow-reapers',
        type: 'enemy',
        name: 'Shadow Reapers',
        description: 'Dark entities that hunt digital consciousness in the basketball matrix.',
        category: 'Hostile Entities',
        rarity: 'rare',
        discovered: false,
        details: {
          backstory: 'Born from corrupted data fragments, they seek to consume pure digital souls.',
          abilities: ['Shadow Travel', 'Data Corruption', 'Soul Consumption'],
          weaknesses: ['Bright Light', 'Pure Code', 'Firewall Barriers'],
          location: 'The Dark Web Sectors'
        }
      },
      // Creature Lore
      {
        id: 'lore-code-beasts',
        type: 'creature',
        name: 'Code Beasts',
        description: 'Wild algorithms that have evolved beyond their original programming.',
        category: 'Digital Wildlife',
        rarity: 'uncommon',
        discovered: true,
        details: {
          backstory: 'Early AI experiments that escaped into the wild networks and evolved naturally.',
          abilities: ['Adaptive Learning', 'Code Mutation', 'Network Traversal'],
          location: 'The Untamed Networks'
        }
      }
    ];
  }

  public getLoreEntries(type?: DBALoreEntry['type']): DBALoreEntry[] {
    if (type) {
      return this.loreDatabase.filter(entry => entry.type === type);
    }
    return this.loreDatabase;
  }

  public discoverLore(loreId: string): boolean {
    const lore = this.loreDatabase.find(l => l.id === loreId);
    if (lore && !lore.discovered) {
      lore.discovered = true;
      this.logEntry('LORE_DISCOVERED', `📚 Discovered lore: ${lore.name}`);
      return true;
    }
    return false;
  }

  // ===== FANTASY RPG ELEMENTS =====
  public generateQuests(): void {
    this.activeQuests = [
      {
        id: 'quest-win-streak',
        name: 'Winning Streak',
        description: 'Win 5 consecutive games to prove your dominance',
        type: 'battle',
        objectives: [{
          id: 'win-5-games',
          description: 'Win 5 consecutive games',
          type: 'win_games',
          target: 5,
          current: 0,
          completed: false
        }],
        rewards: [{
          type: 'money',
          value: 1000000,
          description: '1,000,000 bonus for winning streak'
        }],
        status: 'available'
      },
      {
        id: 'quest-collect-legendaries',
        name: 'Legendary Collection',
        description: 'Acquire 3 legendary players for your roster',
        type: 'collection',
        objectives: [{
          id: 'collect-3-legends',
          description: 'Collect 3 legendary players',
          type: 'collect_players',
          target: 3,
          current: 0,
          completed: false
        }],
        rewards: [{
          type: 'enhancement',
          value: 'legendary-boost',
          description: 'Legendary stat boost for all players'
        }],
        status: 'available'
      },
      {
        id: 'quest-top-trader',
        name: 'Master Trader',
        description: 'Complete 5 successful trades',
        type: 'trading',
        objectives: [{
          id: 'complete-5-trades',
          description: 'Complete 5 trades',
          type: 'trade_players',
          target: 5,
          current: 0,
          completed: false
        }],
        rewards: [{
          type: 'title',
          value: 'Master Trader',
          description: 'Earn the "Master Trader" title'
        }],
        status: 'available'
      }
    ];
  }

  public getActiveQuests(): DBAQuest[] {
    return this.activeQuests;
  }

  public updateQuestProgress(questId: string, objectiveType: DBAQuestObjective['type'], amount: number): void {
    const quest = this.activeQuests.find(q => q.id === questId);
    if (!quest) return;

    const objective = quest.objectives.find(obj => obj.type === objectiveType);
    if (!objective) return;

    objective.current = Math.min(objective.current + amount, objective.target);

    if (objective.current >= objective.target && !objective.completed) {
      objective.completed = true;
      this.logEntry('QUEST_OBJECTIVE', `🎯 Quest "${quest.name}" objective completed!`);

      // Check if all objectives are completed
      const allCompleted = quest.objectives.every(obj => obj.completed);
      if (allCompleted) {
        quest.status = 'completed';
        this.grantQuestRewards(quest);
        this.logEntry('QUEST_COMPLETED', `🏆 Quest "${quest.name}" fully completed!`);
      }
    }
  }

  private grantQuestRewards(quest: DBAQuest): void {
    quest.rewards.forEach(reward => {
      switch (reward.type) {
        case 'money':
          const userTeam = this.getUserTeam();
          if (userTeam) {
            userTeam.budget += reward.value as number;
            this.logEntry('QUEST_REWARD', `💰 Quest reward: +${reward.value} budget`);
          }
          break;

        case 'enhancement':
          this.applyEnhancement(reward.value as string);
          break;

        case 'title':
          this.logEntry('QUEST_REWARD', `🏅 Quest reward: Earned title "${reward.value}"`);
          break;
      }
    });
  }

  private applyEnhancement(enhancementId: string): void {
    const userTeam = this.getUserTeam();
    if (!userTeam) return;

    switch (enhancementId) {
      case 'legendary-boost':
        userTeam.players.forEach(player => {
          if (player.rarity === 'Legendary') {
            player.stats.points *= 1.1;
            player.stats.rebounds *= 1.1;
            player.stats.assists *= 1.1;
          }
        });
        this.logEntry('ENHANCEMENT_APPLIED', '✨ Legendary players received stat boost!');
        break;
    }
  }

  public getAvailableEnhancements(): PlayerEnhancement[] {
    return [
      {
        id: 'enhancement-stat-boost',
        playerId: '',
        enhancementType: 'stat_boost',
        name: 'Performance Enhancer',
        description: 'Boosts all stats by 15%',
        effect: {
          statBoosts: {
            points: 0.15,
            rebounds: 0.15,
            assists: 0.15,
            steals: 0.15,
            blocks: 0.15
          }
        },
        cost: 500000,
        isActive: false
      },
      {
        id: 'enhancement-rarity-upgrade',
        playerId: '',
        enhancementType: 'rarity_upgrade',
        name: 'Rarity Ascension',
        description: 'Upgrades player rarity to next tier',
        effect: {
          rarityIncrease: true
        },
        cost: 1000000,
        requirements: ['Player must be Epic or lower'],
        isActive: false
      }
    ];
  }

  public applyEnhancementToPlayer(playerId: string, enhancementId: string): boolean {
    const enhancement = this.getAvailableEnhancements().find(e => e.id === enhancementId);
    const userTeam = this.getUserTeam();

    if (!enhancement || !userTeam) return false;

    if (userTeam.budget < enhancement.cost) return false;

    const player = userTeam.players.find(p => p.id === playerId);
    if (!player) return false;

    // Apply enhancement effects
    if (enhancement.effect.statBoosts) {
      Object.entries(enhancement.effect.statBoosts).forEach(([stat, boost]) => {
        if (typeof boost === 'number' && stat in player.stats) {
          (player.stats as any)[stat] *= (1 + boost);
        }
      });
    }

    if (enhancement.effect.rarityIncrease) {
      const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
      const currentIndex = rarityOrder.indexOf(player.rarity);
      if (currentIndex < rarityOrder.length - 1) {
        player.rarity = rarityOrder[currentIndex + 1] as NBAPlayer['rarity'];
      }
    }

    // Deduct cost
    userTeam.budget -= enhancement.cost;

    this.logEntry('ENHANCEMENT_APPLIED', `✨ Applied ${enhancement.name} to ${player.name}`);
    return true;
  }

  // ===== INITIALIZATION ENHANCEMENTS =====
  private initializeGameState(): DBAGameState {
    const teams = this.createDBATeams();
    const league = this.createLeague(teams);

    // Initialize enhanced features
    this.initializeLoreDatabase();
    this.generateQuests();

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
}

export default DBAEngine;
