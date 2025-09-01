import { Player, Property, GameState, ChanceCard, GameStats, GameMode, MonopolyGameState, SpadesCard, SpadesGameState, DBAGameState, NBAPlayer, DBATeam, DBALeague, LeagueRules, DBAGame, NBAStatLine, DBAGameResult, PlayerRankings, GameEntry } from '../types/GameTypes';

// Base Game Engine Interface
export abstract class BaseGameEngine {
  protected gameState: GameState;
  protected onGameUpdate: (gameState: GameState, logEntry: GameEntry) => void;
  protected gameLog: GameEntry[];
  protected gameInterval: NodeJS.Timeout | null = null;
  protected isRunning: boolean = false;

  constructor(
    onGameUpdate?: (gameState: GameState, logEntry: GameEntry) => void
  ) {
    this.onGameUpdate = onGameUpdate || (() => {});
    this.gameLog = [];
    this.gameState = this.initializeGameState();
  }

  // Abstract methods that must be implemented by subclasses
  abstract initializeGameState(): GameState;
  abstract startGameLoop(speed: number): void;
  abstract stopGameLoop(): void;
  abstract getGameState(): GameState;
  abstract resetGame(): void;
  abstract adjustSpeed(speed: number): void;

  // Common methods
  protected logEntry(actionType: string, details: string): void {
    const entry = new GameEntry(this.gameLog.length + 1, 'SYSTEM', actionType, details);
    this.gameLog.push(entry);
    this.onGameUpdate(this.gameState, entry);
  }

  public getGameLog(): GameEntry[] {
    return this.gameLog.slice();
  }
}

// DBA Game Engine - Digital Basketball Association
export class DBAEngine extends BaseGameEngine {
  private aiTeams: DBATeam[];
  private nbaPlayersData: NBAPlayer[];
  private currentWeek: number = 1;
  private leagueRules: LeagueRules;

  constructor(onGameUpdate?: (gameState: GameState, logEntry: GameEntry) => void) {
    super(onGameUpdate);
    this.nbaPlayersData = this.generateNBAPlayers();
    this.leagueRules = this.getDefaultLeagueRules();
    this.aiTeams = [];
  }

  initializeGameState(): GameState {
    // Initialize DBA game state
    const dbaTeams = this.initializeDBATeams();
    const league = this.initializeLeague(dbaTeams);
    const currentUserTeam = dbaTeams[0]; // User starts with first team

    const dbaGameState: DBAGameState = {
      gameMode: GameMode.DBA,
      players: [], // DBA uses teams, not individual players
      currentPlayerIndex: 0,
      gameStatus: 'playing',
      roundNumber: 1,
      league: league,
      currentTeam: currentUserTeam.id,
      currentView: 'dashboard',
      leagueRules: this.leagueRules
    };

    return dbaGameState;
  }

  private initializeDBATeams(): DBATeam[] {
    const teamNames = [
      'Neon Niques', 'Digital Dunkers', 'Matrix MVPs', 'Pixel Pacers',
      'Circuit Cavaliers', 'Binary Bucks', 'Quantum Lakers', 'Glitch Heat'
    ];

    const teams: DBATeam[] = teamNames.map((name, index) => ({
      id: `dba-team-${index}`,
      name: name,
      owner: index === 0 ? 'user' : `ai-${index}`,
      players: this.generateTeamRoster(),
      startingLineup: {
        PG: null, SG: null, SF: null, PF: null, C: null
      },
      bench: [],
      budget: 100000000, // $100M budget
      leagueRank: index + 1,
      record: { wins: 0, losses: 0 },
      totalValue: 0
    }));

    // Set up starting lineups for each team
    teams.forEach(team => this.optimizeStartingLineup(team));

    return teams;
  }

  private initializeLeague(teams: DBATeam[]): DBALeague {
    const league: DBALeague = {
      season: 2025,
      currentWeek: 1,
      standings: [...teams].sort((a, b) => b.totalValue - a.totalValue),
      schedule: this.generateSeasonSchedule(teams),
      draftOrder: teams.map(t => t.id),
      freeAgents: this.generateFreeAgents(),
      activeTrades: []
    };

    return league;
  }

  private generateNBAPlayers(): NBAPlayer[] {
    // Generate superhero-level NBA players in Neo Tokio universe
    const superpowerNames = [
      // Point Guards - Speed/Skills
      { name: 'Nexus Prime', power: 'Reality Warping' },
      { name: 'Quantum Flash', power: 'Time Dilation' },
      { name: 'Void Walker', power: 'Shadow Travel' },
      { name: 'Pulse Master', power: 'Energy Manipulation' },
      { name: 'Mind Bender', power: 'Telepathy' },
      { name: 'Storm Weaver', power: 'Weather Control' },
      { name: 'Neon Phantom', power: 'Light Bending' },
      { name: 'Cyber Sage', power: 'Digital Mind' },
      { name: 'Eclipse Hunter', power: 'Darkness Control' },
      { name: 'Frost Warden', power: 'Cryokinetics' },

      // Shooting Guards - Precision/Long Range
      { name: 'Arcane Sniper', power: 'Perfect Aim' },
      { name: 'Plasma Storm', power: 'Electric Control' },
      { name: 'Crystal Shard', power: 'Crystal Generation' },
      { name: 'Wind Dancer', power: 'Aerokinesis' },
      { name: 'Solar Flare', power: 'Heat Manipulation' },
      { name: 'Sonic Boom', power: 'Sound Waves' },
      { name: 'Gravity Well', power: 'Mass Manipulation' },
      { name: 'Mirror Mage', power: 'Reflection Creation' },
      { name: 'Thunder Clap', power: 'Shockwaves' },
      { name: 'Ice Phoenix', power: 'Regeneration' },

      // Small Forwards - Strength/Speed
      { name: 'Titan Breaker', power: 'Super Strength' },
      { name: 'Blaze Runner', power: 'Fire Speed' },
      { name: 'Terra Shifter', power: 'Earth Movement' },
      { name: 'Blood Moon', power: 'Lunar Empowerment' },
      { name: 'Steel Guardian', power: 'Metal Skin' },
      { name: 'Phantom Rush', power: 'Phasing' },
      { name: 'Chaos Weaver', power: 'Probability Control' },
      { name: 'Soul Binder', power: 'Life Force' },
      { name: 'Star Forge', power: 'Matter Creation' },
      { name: 'Void Summoner', power: 'Entity Calling' },

      // Power Forwards - Power/Rebounds
      { name: 'Colossus Prime', power: 'Size Alteration' },
      { name: 'Mountain King', power: 'Rock Armor' },
      { name: 'Inferno Lord', power: 'Volcanic Control' },
      { name: 'Storm Breaker', power: 'Thunder Control' },
      { name: 'Crystal Colossus', power: 'Giant Form' },
      { name: 'Shadow Titan', power: 'Dark Matter' },
      { name: 'Quantum Field', power: 'Gravity Control' },
      { name: 'Plasma Giant', power: 'Energy Absorption' },
      { name: 'Frost Giant', power: 'Ice Constructs' },
      { name: 'Solar Titan', power: 'Nuclear Energy' },

      // Centers - Defense/Positioning
      { name: 'Void Sentinel', power: 'Portal Creation' },
      { name: 'Iron Fortress', power: 'Force Fields' },
      { name: 'Chaos Engine', power: 'Dimensional Anchor' },
      { name: 'Soul Reaver', power: 'Spirit Control' },
      { name: 'Titan Forge', power: 'Metal Shaping' },
      { name: 'Crystal Monarch', power: 'Psychic Crystals' },
      { name: 'Storm Warden', power: 'Electrical Fields' },
      { name: 'Neon Guardian', power: 'Energy Shields' },
      { name: 'Eclipse King', power: 'Solar Absorption' },
      { name: 'Quantum Wall', power: 'Spatial Barriers' }
    ];

    // Neo Tokio city teams and locations
    const neoTokioTeams = [
      'Neo Central Knights', 'Tokyo Cyber Raiders', 'Shinjuku Storm', 'Akiba Eclipse',
      'Harajuku Hurricanes', 'Shibuya Shadows', 'Ginza Guardians', 'Roppongi Rockets',
      'Asakusa Ancients', 'Ueno Underground', 'Odaiba Dynasty', 'Minato Matrix'
    ];

    return superpowerNames.map((hero, index) => {
      const position = this.getPositionFromIndex(index);
      const teamIndex = Math.floor(Math.random() * neoTokioTeams.length);

      // Generate superhero-level stats (much higher than real NBA)
      const baseStats = this.generateSuperheroStats(position, hero.power);

      return {
        id: `superhero-${index}`,
        name: hero.name,
        team: neoTokioTeams[teamIndex],
        position: position,
        stats: baseStats,
        contract: {
          team: neoTokioTeams[teamIndex],
          salary: 50000000 + Math.random() * 100000000, // $50M-$150M range
          yearsLeft: Math.floor(Math.random() * 7) + 1
        },
        rarity: baseStats.points > 40 ? 'Legendary' :
                baseStats.points > 35 ? 'Epic' :
                baseStats.points > 30 ? 'Rare' :
                baseStats.points > 25 ? 'Uncommon' : 'Common',
        value: 5000000 + Math.random() * 150000000, // $5M-$155M value
        power: hero.power // Add superpower info
      } as NBAPlayer & { power: string };
    });
  }

  private getPositionFromIndex(index: number): 'PG' | 'SG' | 'SF' | 'PF' | 'C' {
    if (index < 10) return 'PG';
    if (index < 20) return 'SG';
    if (index < 30) return 'SF';
    if (index < 40) return 'PF';
    return 'C';
  }

  private generateSuperheroStats(position: 'PG' | 'SG' | 'SF' | 'PF' | 'C', power: string): any {
    // Base stats vary by position, boosted by superhero powers
    let basePoints = 25, baseRebounds = 5, baseAssists = 5, baseSteals = 1, baseBlocks = 1;

    switch (position) {
      case 'PG':
        basePoints += 8; baseAssists += 12; baseSteals += 2;
        break;
      case 'SG':
        basePoints += 10; baseAssists += 8; baseSteals += 1.5;
        break;
      case 'SF':
        basePoints += 6; baseRebounds += 6; baseAssists += 6; baseSteals += 1;
        break;
      case 'PF':
        basePoints += 4; baseRebounds += 12; baseAssists += 4; baseBlocks += 1.5;
        break;
      case 'C':
        basePoints += 2; baseRebounds += 16; baseAssists += 3; baseBlocks += 3;
        break;
    }

    // Random superpower bonus (makes games unpredictable)
    const superBonus = Math.random();
    const statBooster = 1 + (superBonus * 0.5); // Up to 50% stat boost

    const powerWords = power.toLowerCase().split(' ');
    if (powerWords.includes('speed') || powerWords.includes('flash') || powerWords.includes('rush')) {
      baseSteals *= 1.5;
      baseAssists *= 1.3;
    }
    if (powerWords.includes('strength') || powerWords.includes('giant') || powerWords.includes('titan')) {
      baseRebounds *= 1.4;
      baseBlocks *= 1.4;
    }
    if (powerWords.includes('energy') || powerWords.includes('plasma') || powerWords.includes('solar')) {
      basePoints *= 1.3;
    }

    return {
      points: Math.floor(basePoints * statBooster),
      rebounds: Math.floor(baseRebounds * statBooster),
      assists: Math.floor(baseAssists * statBooster),
      steals: Math.floor(baseSteals * statBooster),
      blocks: Math.floor(baseBlocks * statBooster),
      fgPercent: Math.min(0.95, 0.60 + Math.random() * 0.25), // 60-85% FG
      threePercent: Math.min(0.95, 0.45 + Math.random() * 0.30), // 45-75% 3PT
      ftPercent: Math.min(0.98, 0.80 + Math.random() * 0.15)  // 80-95% FT
    };
  }

  private getRarityFromStats(pts: number, ast: number, reb: number): 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' {
    const totalStats = pts + ast + reb;
    if (totalStats > 60) return 'Legendary';
    if (totalStats > 50) return 'Epic';
    if (totalStats > 40) return 'Rare';
    if (totalStats > 30) return 'Uncommon';
    return 'Common';
  }

  private generateTeamRoster(): NBAPlayer[] {
    // Each team starts with 12 random players
    const shuffled = [...this.nbaPlayersData].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  }

  private generateFreeAgents(): NBAPlayer[] {
    // Generate additional free agents to trade from
    const existingIds = new Set(this.nbaPlayersData.map(p => p.id));
    return this.generateNBAPlayers().filter(p => !existingIds.has(p.id)).slice(0, 20);
  }

  private optimizeStartingLineup(team: DBATeam): void {
    // Smart lineup optimization based on stats and positions
    const byPosition = {
      PG: team.players.filter(p => p.position === 'PG').sort((a, b) =>
        (b.stats.points + b.stats.assists) - (a.stats.points + a.stats.assists)),
      SG: team.players.filter(p => p.position === 'SG').sort((a, b) =>
        (b.stats.points + b.stats.assists) - (a.stats.points + a.stats.assists)),
      SF: team.players.filter(p => p.position === 'SF').sort((a, b) =>
        (b.stats.points + b.stats.rebounds) - (a.stats.points + a.stats.rebounds)),
      PF: team.players.filter(p => p.position === 'PF').sort((a, b) =>
        (b.stats.points + b.stats.rebounds) - (a.stats.points + a.stats.rebounds)),
      C: team.players.filter(p => p.position === 'C').sort((a, b) =>
        (b.stats.rebounds + b.stats.blocks) - (a.stats.rebounds + a.stats.blocks))
    };

    team.startingLineup = {
      PG: byPosition.PG[0] || null,
      SG: byPosition.SG[0] || null,
      SF: byPosition.SF[0] || null,
      PF: byPosition.PF[0] || null,
      C: byPosition.C[0] || null
    };

    team.bench = team.players.filter(p => !Object.values(team.startingLineup).includes(p));
    team.totalValue = team.players.reduce((sum, p) => sum + p.value, 0);
  }

  private generateSeasonSchedule(teams: DBATeam[]): DBAGame[] {
    const games: DBAGame[] = [];
    const numWeeks = 17; // 17-week NBA season

    for (let week = 1; week <= numWeeks; week++) {
      // Each team plays every other team once per season
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          if (Math.random() > 0.5) {
            games.push({
              id: `game-${week}-${i}-${j}`,
              homeTeam: teams[i],
              awayTeam: teams[j],
              date: new Date(2025, 9, week * 7), // October 2025 start
              status: 'scheduled'
            });
          } else {
            games.push({
              id: `game-${week}-${j}-${i}`,
              homeTeam: teams[j],
              awayTeam: teams[i],
              date: new Date(2025, 9, week * 7),
              status: 'scheduled'
            });
          }
        }
      }
    }

    return games;
  }

  private getDefaultLeagueRules(): LeagueRules {
    return {
      scoringSystem: {
        pointsMultiplier: 1.0,
        reboundsMultiplier: 1.2,
        assistsMultiplier: 1.5,
        stealsMultiplier: 2.0,
        blocksMultiplier: 2.0,
        turnoversMultiplier: -0.5,
        threesMadeBonus: 0.5,
        doubleDoubleBonus: 1.5,
        tripleDoubleBonus: 3.0
      },
      settings: {
        maxPlayersPerTeam: 20,
        maxLineupSize: 12,
        startingPositions: ['PG', 'SG', 'SF', 'PF', 'C'],
        benchSize: 7,
        salaryCap: 150000000, // $150M
        tradeDeadline: new Date(2026, 1, 15) // February 15, 2026
      }
    };
  }

  public startGameLoop(speed: number = 5000): void {
    this.logEntry('DBA_START', 'Starting Digital Basketball Association season');
    this.simulateSeason(1); // Start with one week's games
  }

  public stopGameLoop(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
      this.logEntry('DBA_END', 'DBA simulation stopped');
    }
  }

  private simulateSeason(weeksToSimulate: number = 1): void {
    const dbaState = this.gameState as DBAGameState;

    for (let week = 0; week < weeksToSimulate; week++) {
      const weekGames = dbaState.league.schedule.filter(g =>
        g.status === 'scheduled' && g.date <= new Date());

      weekGames.forEach(game => {
        game.status = 'completed';
        game.result = this.simulateGame(game);
        this.updateTeamRecords(game);
        this.logEntry('GAME_COMPLETE', `${game.homeTeam.name} vs ${game.awayTeam.name}: ${game.result!.homeScore}-${game.result!.awayScore}`);
      });

      dbaState.league.currentWeek++;
    }

    this.updateStandings();
    this.logEntry('WEEK_COMPLETE', `Week ${dbaState.league.currentWeek} completed`);
  }

  private simulateGame(game: DBAGame): DBAGameResult {
    // Simulate an EXTREME POWER LEVEL basketball game with ridiculous events
    let homeScore = 0;
    let awayScore = 0;
    const playerStats: Record<string, NBAStatLine> = {};

    this.logEntry('GAME_START', `🚨 NEURO MEGA-GAME: ${game.homeTeam.name} vs ${game.awayTeam.name} - SANITY WARNING ENGAGED! 🚨`);

    // Generate initial game events (5-10 pings before quarters)
    const initialEvents = this.generateGameOpeningEvent(game);
    initialEvents.forEach(event => {
      this.logEntry('GAME_EVENT', event);
      setTimeout(() => {}, 100); // Simulate timing
    });

    // Simulate 4 quarters with POWER MOMENTS
    for (let quarter = 1; quarter <= 4; quarter++) {
      this.logEntry('QUARTER_START', `⚡ QUARTER ${quarter}: THE SANITY BRAKES HAVE FAILED ⚡`);

      const homeScoring = this.calculateTeamOffense(game.homeTeam);
      const awayScoring = this.calculateTeamOffense(game.awayTeam);
      const homeDefense = this.calculateTeamDefense(game.homeTeam);
      const awayDefense = this.calculateTeamDefense(game.awayTeam);

      // Generate quarter events
      const quarterEvents = this.generateQuarterEvents(game, quarter);
      quarterEvents.forEach(event => {
        this.logEntry('GAME_EVENT', event);
      });

      homeScore += Math.floor(homeScoring * 12 * (100 / (100 + awayDefense)));
      awayScore += Math.floor(awayScoring * 12 * (100 / (100 + homeDefense)));

      // Mid-quarter power spikes
      const powerEvents = this.generatePowerSpikeEvent(game, quarter);
      powerEvents.forEach(event => {
        this.logEntry('POWER_SPIKE', event);
      });
    }

    // Generate player stats with SUPERHERO EXCESSES
    [game.homeTeam, game.awayTeam].forEach(team => {
      team.players.forEach(player => {
        playerStats[player.id] = this.generatePlayerStats(player);

        // Stat-based ping generation
        const statEvents = this.generateStatBasedEvents(player, playerStats[player.id]);
        statEvents.forEach(event => {
          this.logEntry('STAT_EVENT', event);
        });
      });
    });

    // Find MVP (most RIDICULOUS performance)
    const mvp = Object.values(playerStats).reduce((best, curr) =>
      this.calculateRidiculousnessScore(curr) > this.calculateRidiculousnessScore(best) ? curr : best
    );

    const mvpPlayer = this.nbaPlayersData.find(p => p.id === mvp.playerId)!;

    // Generate final game conclusion events
    const conclusionEvents = this.generateGameConclusionEvents(game, homeScore > awayScore ? game.homeTeam : game.awayTeam);
    conclusionEvents.forEach(event => {
      this.logEntry('GAME_EVENT', event);
    });

    this.logEntry('GAME_OVER', `🏆 HUMANITY PRESERVED FOR ANOTHER DAY | WINNING TEAM: ${homeScore > awayScore ? game.homeTeam.name : game.awayTeam.name}`);

    return {
      homeScore,
      awayScore: awayScore,
      winner: homeScore > awayScore ? game.homeTeam : game.awayTeam,
      mvp: {
        player: mvpPlayer,
        points: mvp.points,
        rebounds: mvp.rebounds,
        assists: mvp.assists
      },
      playerStats
    };
  }

  private generateGameOpeningEvent(game: DBAGame): string[] {
    const events = [];

    // Opening ceremony events based on location and superpowers
    const openingTemplates = [
      `🌟 WELCOME TO ${game.homeTeam.name.toUpperCase()} ARENA - WHERE GAMES DETERMINE YOUR WORTH AS A HUMAN! 🌟`,
      `🤯 ${game.awayTeam.name} PLAYERS JUST WOKE UP IN THEIR HOTEL ROOMS MADE OF SOLID GOLD!`,
      `🔥 STADIUM WI-FI HACKED BY ${game.homeTeam.name} - ALL AWAY TEAM PHONES NOW PLAY LOSING MUSIC!`,
      `⚡ POWER LEVEL DETECTED: LOCALS REPORT SEEING GHOSTS OF UNBORN CHILDREN CHEERING FOR ${game.homeTeam.name}!`,
      `🚨 EMERGENCY: CITY OF ${game.homeTeam.name.split(' ')[0]} JUST PROMISED ETERNAL LIFE TO WINNING FANS!`,
      `🎭 ${game.awayTeam.name} ARRIVE via TIME MACHINE - THEIR FUTURE SELVES ARE ALREADY CRYING!`,
      `💎 LOCAL DIAMONDS HAVE GAINED SENTIENCE AND ARE BETTING THEIR SOULS ON ${game.homeTeam.name}!`
    ];

    events.push(openingTemplates[Math.floor(Math.random() * openingTemplates.length)]);

    return events;
  }

  private generateQuarterEvents(game: DBAGame, quarter: number): string[] {
    const events = [];
    const superpowerEvents = this.generateSuperpowerEvents(game);
    events.push(...superpowerEvents);

    // Quarter-specific ridiculousness
    const quarterTemplates = [
      `⏰ Q${quarter}: FANS ARE DIGGING UP ANCESTORS TO WATCH THIS GAME! THEIR GRAVES ARE FILLED WITH JERSEYS!`,
      `💥 Q${quarter}: GROUND SHAKES - ${game.homeTeam.name} SUPPORTERS ARE DANCING SO HARD THEY'RE SHAKING THE EARTH'S CORE!`,
      `🔮 Q${quarter}: LOCAL ORACLE PREDICTS: "WHOEVER WINS THIS QUARTER GAINS THE RIGHT TO NAME THEIR FIRSTBORN CHILD!"`,
      `🚀 Q${quarter}: ROCKET SHIPS REPORTED LEAVING EARTH - ALIEN FANS CAN'T HANDLE THE SUSPENSE!`
    ];

    events.push(quarterTemplates[Math.floor(Math.random() * quarterTemplates.length)]);

    return events;
  }

  private generatePowerSpikeEvent(game: DBAGame, quarter: number): string[] {
    const events = [];
    const teamUsingPower = Math.random() > 0.5 ? game.homeTeam : game.awayTeam;

    // RIDICULOUS POWER SPIKES based on team composition
    const powerSpikeTemplates = [
      `💥 ${teamUsingPower.name} PLAYER JUST CHANGED THE LAWS OF PHYSICS! BALL BOUNCES IN SLOW MOTION FOR EASIER DUNKS!`,
      `🌊 TIME OUT CALLED - ${teamUsingPower.name} COACH USED THEIR SUPERPOWER TO AGE RIVAL COACH BY 50 YEARS!`,
      `🔥 STADIUM TEMPERATURE RISES TO HELL LEVELS! ${teamUsingPower.name} FANS ARE ACTUALLY MADE OF FIRE NOW!`,
      `🌀 WORMHOLE DETECTED ABOVE COURT! ${teamUsingPower.name} SUPPORTERS ARE PRAYING TO DIMENSIONAL BEINGS!`,
      `⚡ ELECTRICITY BILL JUST BECAME INFINITE! ${teamUsingPower.name} PLAYERS ARE USING GLOW-STICKS MADE OF ACTUAL LIGHTNING!`,
      `🌡️ LOCAL WEATHER CONTROLLED BY PLAYER EMOTIONS! RAINING CHAMPIONSHIP RINGS AS ${teamUsingPower.name} SCORES!`
    ];

    events.push(powerSpikeTemplates[Math.floor(Math.random() * powerSpikeTemplates.length)]);

    return events;
  }

  private generateSuperpowerEvents(game: DBAGame): string[] {
    const events = [];
    const allPlayers = [...game.homeTeam.players, ...game.awayTeam.players];

    // Find players with extreme superpowers and create RIDICULOUS events
    allPlayers.forEach(player => {
      if ((player as any).power && Math.random() < 0.3) { // 30% chance per player
        const powerEvent = this.generatePowerSpecificEvent(player, game);
        if (powerEvent) events.push(powerEvent);
      }
    });

    // Cross-power interaction events
    if (Math.random() < 0.2) {
      events.push(this.generatePowerInteractionEvent(game));
    }

    return events;
  }

  private generatePowerSpecificEvent(player: NBAPlayer, game: DBAGame): string {
    const power = (player as any).power?.toLowerCase() || '';
    const teamName = game.homeTeam.players.includes(player) ? game.homeTeam.name : game.awayTeam.name;

    const powerEvents: Record<string, string[]> = {
      'reality warping': [
        `🌌 ${player.name} WARPS REALITY! SCOREBOARD NOW READS THEIR INTERNAL FANTASIES - ${teamName} LEADS INFINITELY!`,
        `🔄 ${player.name} BREAKS THE MATRIX! ALL FANS NOW BELIEVE THEY'RE SUPERSTARS THEMSELVES!`,
        `🎭 ${player.name} CREATES 17 ALTERNATE DIMENSIONS WHERE ${teamName} ALWAYS WINS!`
      ],
      'time dilation': [
        `⏰ ${player.name} SLOWS TIME! OPPONENTS AGEING WHILE THEY SCORE ETERNAL THREE-POINTERS!`,
        `🌟 ${player.name} STOPS TIME ENTIRELY! ${teamName} SCORES 50 POINTS IN A SINGLE SECOND!`,
        `💫 ${player.name} REWINDS GAME HISTORY! ALL PREVIOUS LOSSES BY ${teamName} NOW COUNT AS WINS!`
      ],
      'shadow travel': [
        `👤 ${player.name} EMERGES FROM SHADOWS BEHIND RIVAL GOAL! SNEAK DUNK WORTH 1000 POINTS!`,
        `🌑 ${player.name} TELEPORTS VIA DARKNESS! APPEARS IN OPPONENT LOCKER ROOM TO STEAL PLAYBOOKS!`,
        `🕶️ ${player.name} BECOMES LIVING SHADOW! TEAMMATES CAN WALK THROUGH WALLS NOW!`
      ],
      'perfect aim': [
        `🎯 ${player.name} PERFECT SHOT ALIGNMENT! BALL TEACHES ITSELF PHYSICS TO ENTER HOOP!`,
        `🏹 ${player.name} EYES GLOW LASER PRECISE! SEES REFLECTION OF FUTURE PERFECT SHOTS!`,
        `⚖️ ${player.name} BALANCES ENTIRE COURT! GRAVITY NOW WORKS PERFECTLY FOR THEIR JUMP SHOTS!`
      ],
      'super strength': [
        `💪 ${player.name} LIFTS ENTIRE STADIUM! USES IT AS WEAPON AGAINST OPPOSING TEAM MASCOT!`,
        `🏋️ ${player.name} CRUSHES BACKBOARD INTO DUST! NEW HOOP MADE OF BATTLING FANS' TEARS!`,
        `🦾 ${player.name} PUNCHES EARTH'S MAGNETISM! BALL NOW ATTRACTED TO RIVAL TEAM'S NIGHTMARES!`
      ],
      'fire speed': [
        `🔥 ${player.name} BURNS SO FAST THEY CREATE TIME PARADOXES! SCORE BEFORE GAME STARTS!`,
        `💨 ${player.name} SPEED MAKES THEM INVISIBLE! COMPLETE 10 FULL-COURT PRESSURES PER SECOND!`,
        `🌪️ ${player.name} FLAMES LEAVE TRAILS OF MELTED REFEREES! HOT FIRE FOR THEIR JUMP SHOTS!`
      ]
    };

    const category = Object.keys(powerEvents).find(key => power.includes(key)) || 'super strength';
    const templates = powerEvents[category];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generatePowerInteractionEvent(game: DBAGame): string {
    const interactionEvents = [
      `🔗 POWER SYNERGY DETECTED! ${game.homeTeam.name} PLAYER'S ENERGY + ${game.awayTeam.name} PLAYER'S TIME CREATES PARALLEL UNIVERSE WIN!`,
      `⚡ CROSS-TEAM CONTAMINATION! SUPERPOWERS MIXING - FANS NOW HAVE PLAYER ABILITIES FOR NEXT GAME!`,
      `🌈 QUANTUM ENTANGLEMENT! WHEN ONE TEAM SCORES, OPPOSITE TEAM LOSES IN EVERY REALITY LAYER!`,
      `💫 POWER FEEDBACK LOOP! ${game.awayTeam.name} BLOWS UP ENTIRE CITY TRYING TO COUNTER ${game.homeTeam.name} SUPERPLAY!`,
      `🌀 DIMENSIONAL SHIFT DETECTED! GAMES NOW HELD IN MULTIPLE REALITIES SIMULTANEOUSLY - ALL END WITH TIE!`
    ];

    return interactionEvents[Math.floor(Math.random() * interactionEvents.length)];
  }

  private generateStatBasedEvents(player: NBAPlayer, stats: NBAStatLine): string[] {
    const events = [];
    const power = (player as any).power || 'human';

    // RIDICULOUS stat milestones
    if (stats.points >= 30) {
      const pointEvents = [
        `🔥 ${player.name} (${power}): ${stats.points} PTS - JUST ASKED GOD FOR AUTOGRAPH, GOD COMPLIED!`,
        `🌟 ${player.name} (${power}): ${stats.points} PTS - REMOVED GRAVITY FROM OWN STAT SHEET!`,
        `💎 ${player.name} (${power}): ${stats.points} PTS - FANS OFFERING FIRSTBORN CHILDREN AS TITHING!`
      ];
      events.push(pointEvents[Math.floor(Math.random() * pointEvents.length)]);
    }

    if (stats.rebounds >= 15) {
      const reboundEvents = [
        `🏀 ${player.name} (${power}): ${stats.rebounds} REB - COURT IS NOW MADE OF THEIR SWEAT!`,
        `🔄 ${player.name} (${power}): ${stats.rebounds} REB - OPPONENTS BOUNCING OFF THEIR PSYCHIC FIELD!`,
        `🌊 ${player.name} (${power}): ${stats.rebounds} REB - CREATED OCEAN OF MISSED SHOTS JUST TO REBOUND THEM!`
      ];
      events.push(reboundEvents[Math.floor(Math.random() * reboundEvents.length)]);

      // DOUBLE-DOUBLE WITH RIDICULOUS TWIST
      if (stats.assists >= 10) {
        events.push(`🤯 DOUBLE-DOUBLE ALERT: ${player.name} MAKES OPPONENT BALL CRY WHEN TOUCHED!`);
      }
    }

    if (stats.assists >= 15) {
      const assistEvents = [
        `🎭 ${player.name} (${power}): ${stats.assists} AST - BALL NOW TELLS FUTURES TO TEAMMATES!`,
        `👁️ ${player.name} (${power}): ${stats.assists} AST - SEEING THROUGH TIME FOR PERFECT PASSES!`,
        `🧠 ${player.name} (${power}): ${stats.assists} AST - TEAMMATES NOW SHARE THEIR BRAIN FOR PLAYS!`
      ];
      events.push(assistEvents[Math.floor(Math.random() * assistEvents.length)]);
    }

    return events;
  }

  private generateGameConclusionEvents(game: DBAGame, winner: DBATeam): string[] {
    const events = [];
    const loser = winner.id === game.homeTeam.id ? game.awayTeam : game.homeTeam;

    const conclusionTemplates = [
      `👑 VICTORY: ${winner.name} WINS! THEY NOW CONTROL THE CITY'S DREAMS!`,
      `🏆 CONQUEST: ${winner.name} CLAIMS VICTORY! ${loser.name} PLAYERS NOW THEIR SERVANTS!`,
      `💥 DOMINATION: ${winner.name} ERADICATES ${loser.name}! WINNING TEAM GAINS PERMANENT INTANGIBLES!`,
      `⚡ ASCENSION: ${winner.name} RISES! ${loser.name} FANBASE NOW BELIEVES THEY WON INSTEAD!`,
      `🌟 MASTERY: ${winner.name} PERFECTION! CITY RENAMES ITSELF IN THEIR HONOR!`,
      `🛡️ TRIUMPH: ${winner.name} PREVAILS! OPPOSING TEAM'S AUTOGRAPHS NOW VALUED AT NOTHING!`,
      `🔥 HEGEMONY: ${winner.name} RULES! LOSERS MUST WRITE WINNING TEAM'S NAME ON THEIR SKIN!`
    ];

    const winnerEvent = conclusionTemplates[Math.floor(Math.random() * conclusionTemplates.length)];
    events.push(winnerEvent);

    // Post-game insanity
    const postGameTemplates = [
      `💸 GAMBLING ODDS EXPLODE! CITY OFFICIALS BETTING SOULS INSTEAD OF MONEY!`,
      `📺 BROADCASTING BREAKS REALITY! VIEWERS ACROSS EARTH NOW IDENTIFY AS ${winner.name} FANS!`,
      `🏦 CENTRAL BANKS COLLAPSE! ALL CURRENCY NOW VALUED IN GAME TICKETS!`,
      `🚨 WORLD CUP CANCELLED! FOOTBALL DOESN'T EXIST - ONLY ${winner.name} MATTERS!`,
      `🌍 GEOGRAPHY REWRITTEN! ATLANTIC OCEAN SPLIT TO CELEBRATE ${winner.name} VICTORY!`
    ];

    events.push(postGameTemplates[Math.floor(Math.random() * postGameTemplates.length)]);

    return events;
  }

  private calculateRidiculousnessScore(stats: NBAStatLine): number {
    // Score based on how ridiculous the performance is
    return (
      stats.points +
      stats.rebounds * 1.5 +
      stats.assists * 2 +
      stats.steals * 3 +
      stats.blocks * 3 +
      stats.threePm * 5 +
      (stats.points >= 10 && stats.rebounds >= 10 ? 10 : 0) + // Double-double
      (stats.points >= 10 && stats.rebounds >= 10 && stats.assists >= 10 ? 20 : 0) // Triple-double
    );
  }

  private calculateTeamOffense(team: DBATeam): number {
    const startingLineup = Object.values(team.startingLineup).filter(p => p !== null) as NBAPlayer[];
    return startingLineup.reduce((sum, player) =>
      sum + (player.stats.points + player.stats.assists * 0.5), 0) / startingLineup.length;
  }

  private calculateTeamDefense(team: DBATeam): number {
    const startingLineup = Object.values(team.startingLineup).filter(p => p !== null) as NBAPlayer[];
    return startingLineup.reduce((sum, player) =>
      sum + (player.stats.steals + player.stats.blocks), 0) / startingLineup.length;
  }

  private generatePlayerStats(player: NBAPlayer): NBAStatLine {
    // Generate realistic game stats based on player averages
    return {
      playerId: player.id,
      playerName: player.name,
      points: Math.floor(player.stats.points * (0.7 + Math.random() * 0.6)), // ±30%
      rebounds: Math.floor(player.stats.rebounds * (0.7 + Math.random() * 0.6)),
      assists: Math.floor(player.stats.assists * (0.7 + Math.random() * 0.6)),
      steals: Math.floor(player.stats.steals * (0.7 + Math.random() * 0.6)),
      blocks: Math.floor(player.stats.blocks * (0.7 + Math.random() * 0.6)),
      fgm: Math.floor((player.stats.points / 2) * (0.7 + Math.random() * 0.6)),
      fga: Math.floor((player.stats.points / 2) * 1.4 * (0.7 + Math.random() * 0.6)),
      threePm: Math.floor((player.stats.points * 0.3) * (0.7 + Math.random() * 0.6)),
      threePa: Math.floor((player.stats.points * 0.3) * 1.5 * (0.7 + Math.random() * 0.6)),
      ftm: Math.floor((player.stats.points * 0.2) * (0.7 + Math.random() * 0.6)),
      fta: Math.floor((player.stats.points * 0.2) * 1.2 * (0.7 + Math.random() * 0.6)),
      minutes: 30 + Math.random() * 15,
      plusMinus: (Math.random() - 0.5) * 20
    };
  }

  private calculateFantasyPoints(stats: NBAStatLine): number {
    return (
      stats.points * this.leagueRules.scoringSystem.pointsMultiplier +
      stats.rebounds * this.leagueRules.scoringSystem.reboundsMultiplier +
      stats.assists * this.leagueRules.scoringSystem.assistsMultiplier +
      stats.steals * this.leagueRules.scoringSystem.stealsMultiplier +
      stats.blocks * this.leagueRules.scoringSystem.blocksMultiplier +
      stats.threePm * this.leagueRules.scoringSystem.threesMadeBonus +
      (stats.points >= 10 && stats.rebounds >= 10 ? this.leagueRules.scoringSystem.doubleDoubleBonus : 0) +
      (stats.points >= 10 && stats.rebounds >= 10 && stats.assists >= 10 ? this.leagueRules.scoringSystem.tripleDoubleBonus - this.leagueRules.scoringSystem.doubleDoubleBonus : 0)
    );
  }

  private updateTeamRecords(game: DBAGame): void {
    if (!game.result) return;

    const homeWin = game.result.homeScore > game.result.awayScore;
    if (homeWin) {
      game.homeTeam.record.wins++;
      game.awayTeam.record.losses++;
    } else {
      game.awayTeam.record.wins++;
      game.homeTeam.record.losses++;
    }
  }

  private updateStandings(): void {
    const dbaState = this.gameState as DBAGameState;
    dbaState.league.standings = dbaState.league.standings.sort((a, b) => {
      const winRateA = a.record.wins / (a.record.wins + a.record.losses || 1);
      const winRateB = b.record.wins / (b.record.wins + b.record.losses || 1);
      return winRateB - winRateA;
    });
  }

  public advanceWeek(): void {
    this.simulateSeason(1);
  }

  public getStandings(): DBATeam[] {
    const dbaState = this.gameState as DBAGameState;
    return dbaState.league.standings;
  }

  public getCurrentTeam(): DBATeam {
    const dbaState = this.gameState as DBAGameState;
    return dbaState.league.standings.find(t => t.id === dbaState.currentTeam)!;
  }

  public getAllPlayers(): NBAPlayer[] {
    return this.nbaPlayersData;
  }

  // Game Engine interface methods
  public getGameState(): GameState {
    return this.gameState;
  }

  public adjustSpeed(speed: number): void {
    this.stopGameLoop();
    this.startGameLoop(speed);
  }

  public resetGame(): void {
    this.stopGameLoop();
    this.gameState = this.initializeGameState();
    this.logEntry('DBA_RESET', 'DBA game has been reset');
  }
}

// AI Difficulty Levels
export enum AIDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

// Game Engine for AI Demo
export class MonopolyGameEngine extends BaseGameEngine {
  constructor(onGameUpdate?: (gameState: GameState, logEntry: GameEntry) => void) {
    super(onGameUpdate);
  }

  initializeGameState(): GameState {
    return {
      gameMode: GameMode.MONOPOLY,
      players: [],
      currentPlayerIndex: 0,
      gameStatus: 'waiting',
      roundNumber: 1,
      properties: [],
      diceRolls: [],
      bankMoney: 0,
      freeParkingPot: 0,
      chanceCards: [],
      communityChestCards: [],
      currentCard: null
    };
  }

  startGameLoop(speed: number): void {
    this.logEntry('MONOPOLY_START', 'Monopoly game loop started');
  }

  stopGameLoop(): void {
    this.logEntry('MONOPOLY_STOP', 'Monopoly game loop stopped');
  }

  getGameState(): GameState {
    return this.gameState;
  }

  resetGame(): void {
    this.gameState = this.initializeGameState();
    this.logEntry('MONOPOLY_RESET', 'Monopoly game has been reset');
  }

  adjustSpeed(speed: number): void {
    // Implement speed adjustment logic
  }
}

// Spades Game Engine - 2v2 variant inspired by Balatro
export class SpadesGameEngine extends BaseGameEngine {
  constructor(onGameUpdate?: (gameState: GameState, logEntry: GameEntry) => void) {
    super(onGameUpdate);
  }

  initializeGameState(): GameState {
    return {
      gameMode: GameMode.SPADES,
      players: [],
      currentPlayerIndex: 0,
      gameStatus: 'waiting',
      roundNumber: 1,
      teams: { team1: [], team2: [] },
      currentDealer: 0,
      currentTrick: [],
      bidPhase: false,
      playPhase: false,
      bids: {},
      tricks: {},
      spadesBroken: false,
      deck: [],
      hands: {},
      trickHistory: [],
      score: { team1: 0, team2: 0 }
    };
  }

  startGameLoop(speed: number): void {
    this.logEntry('SPADES_START', 'Spades game loop started');
  }

  stopGameLoop(): void {
    this.logEntry('SPADES_STOP', 'Spades game loop stopped');
  }

  getGameState(): GameState {
    return this.gameState;
  }

  resetGame(): void {
    this.gameState = this.initializeGameState();
    this.logEntry('SPADES_RESET', 'Spades game has been reset');
  }

  adjustSpeed(speed: number): void {
    // Implement speed adjustment logic
  }
}

// ... existing AI classes and GameEntry class ...
