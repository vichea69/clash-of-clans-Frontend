"use client";

import { useState, useEffect } from "react";
import { Globe, Flag, Trophy, Shield, Sword } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { leaderboardAPI } from "@/api/leaderboard.API";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";

interface PreviousSeasonPlayer {
  name: string;
  trophies: number;
}

interface SeasonInfo {
  name: string;
  endTime: string;
  previousSeason: {
    name: string;
    topPlayers: PreviousSeasonPlayer[];
  };
}

interface FormattedPlayer {
  rank: number;
  previousRank: number;
  level: number;
  name: string;
  clan: string;
  attacksWon: number;
  defensesWon: number;
  trophies: number;
  clanBadgeUrl: string;
  leagueIconUrl: string;
}

export default function LeaderboardView() {
  const [view, setView] = useState<"global" | "local">("global");
  const [players, setPlayers] = useState<FormattedPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seasonInfo] = useState<SeasonInfo>({
    name: "March 2025 Season",
    endTime: "15d 17h",
    previousSeason: {
      name: "February 2025 Season",
      topPlayers: [
        { name: "DZ Hawk", trophies: 6184 },
        { name: "Mammuth", trophies: 6164 },
        { name: "Judo Sloth", trophies: 6158 },
      ],
    },
  });

  useEffect(() => {
    fetchLeaderboardData();
  }, [view]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching data for view:", view);

      const response =
        view === "global"
          ? await leaderboardAPI.getGlobalLeaderboard()
          : await leaderboardAPI.getLocalLeaderboard("KH");

      console.log("Raw API Response:", response);

      if (response.success && Array.isArray(response.items)) {
        console.log("Items before mapping:", response.items);

        const formattedPlayers = response.items.map((player) => {
          console.log("Processing player:", player);
          return {
            rank: player.rank,
            previousRank: player.previousRank || player.rank,
            level: player.expLevel,
            name: player.name,
            clan: player.clan?.name || "No Clan",
            attacksWon: player.attackWins || 0,
            defensesWon: player.defenseWins || 0,
            trophies: player.trophies || 0,
            clanBadgeUrl: player.clan?.badgeUrls?.small || "",
            leagueIconUrl: player.league?.iconUrls?.small || "",
          };
        });

        console.log("Formatted players:", formattedPlayers);

        if (formattedPlayers.length > 0) {
          setPlayers(formattedPlayers);
        } else {
          setError("No players found in the response");
        }
      } else {
        setError("Failed to fetch leaderboard data");
        console.error("Invalid response format:", {
          success: response.success,
          hasItems: Boolean(response.items),
          isItemsArray: Array.isArray(response.items),
          response,
        });
      }
    } catch (err) {
      setError("Failed to fetch leaderboard data");
      if (err instanceof AxiosError) {
        console.error("Error fetching leaderboard:", {
          error: err,
          message: err.message,
          response: err.response?.data,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 to-yellow-500";
      case 2:
        return "bg-gradient-to-br from-slate-300 to-slate-400";
      case 3:
        return "bg-gradient-to-br from-amber-600 to-amber-700";
      default:
        return "bg-gradient-to-br from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 px-2 md:px-0">
      {/* Navigation Tabs */}
      <Tabs
        defaultValue="global"
        value={view}
        onValueChange={(value) => setView(value as "global" | "local")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Global</span>
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            <span className="hidden md:inline">Local: KH</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tournament Banner */}
      <Card className="bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-900 border-none text-white">
        <CardContent className="p-4 md:p-6 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0 bg-purple-800/50 backdrop-blur-sm rounded-lg p-2">
              <Trophy className="w-full h-full text-purple-200" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg md:text-xl font-bold">Legend League</h2>
              <p className="text-sm text-purple-200">{seasonInfo.name}</p>
              <Badge
                variant="outline"
                className="bg-purple-500/20 text-purple-100 border-purple-400 mt-1"
              >
                Ends in: {seasonInfo.endTime}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider mb-3 text-purple-200">
              Previous: {seasonInfo.previousSeason.name}
            </h3>
            <div className="space-y-2 bg-purple-500/20 backdrop-blur-sm rounded-lg p-3">
              {seasonInfo.previousSeason.topPlayers.map((player, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "w-5 h-5 flex items-center justify-center p-0",
                        index === 0
                          ? "bg-yellow-500/50"
                          : index === 1
                          ? "bg-slate-400/50"
                          : "bg-amber-600/50"
                      )}
                    >
                      {index + 1}
                    </Badge>
                    {player.name}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    {player.trophies}
                    <Trophy className="w-3 h-3 text-yellow-300" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Rankings */}
      <Card>
        <CardHeader className="pb-0">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            {view === "global" ? "Global" : "Local"} Leaderboard
          </h2>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive/50 text-destructive px-4 py-3 rounded-lg">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <div className="space-y-3">
              {players.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No players found in the leaderboard.
                </div>
              ) : (
                players.map((player) => (
                  <Card
                    key={player.rank}
                    className="bg-card/80 hover:bg-accent/20 transition-colors"
                  >
                    <CardContent className="p-3 md:p-4">
                      {/* Desktop view */}
                      <div className="hidden md:flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          {/* Rank Badge */}
                          <div className="flex items-center gap-1">
                            <div
                              className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xl text-white",
                                getRankStyle(player.rank)
                              )}
                            >
                              {player.rank}
                            </div>
                            {player.previousRank &&
                              player.previousRank !== player.rank && (
                                <span className="text-xs"></span>
                              )}
                          </div>

                          {/* League Badge */}
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img
                              src={player.leagueIconUrl}
                              alt="League Badge"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Level Badge */}
                          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg text-white font-bold">
                            {player.level}
                          </div>

                          {/* Name and Clan */}
                          <div>
                            <div className="font-bold text-foreground">
                              {player.name}
                            </div>
                            <div className="text-muted-foreground text-sm flex items-center gap-2">
                              {player.clanBadgeUrl && (
                                <img
                                  src={player.clanBadgeUrl}
                                  alt="Clan Badge"
                                  className="w-4 h-4 object-contain"
                                />
                              )}
                              {player.clan}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Stats */}
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center justify-end gap-1">
                              <Sword className="h-3 w-3 text-blue-500" />
                              <span>{player.attacksWon}</span>
                            </div>
                            <div className="flex items-center justify-end gap-1">
                              <Shield className="h-3 w-3 text-green-500" />
                              <span>{player.defensesWon}</span>
                            </div>
                          </div>

                          {/* Trophy Count */}
                          <Badge
                            variant="outline"
                            className="px-3 py-1 bg-amber-100/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                          >
                            <span className="text-base font-bold text-amber-900 dark:text-amber-100 mr-1">
                              {player.trophies}
                            </span>
                            <Trophy className="h-4 w-4 text-amber-500" />
                          </Badge>
                        </div>
                      </div>

                      {/* Mobile view */}
                      <div className="md:hidden">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-lg font-bold text-white shadow-sm",
                                getRankStyle(player.rank)
                              )}
                            >
                              {player.rank}
                            </div>
                            <div className="flex flex-col">
                              <div className="font-bold text-foreground flex items-center gap-1">
                                {player.name}
                                <span className="text-xs font-medium"></span>
                              </div>
                              <div className="text-muted-foreground text-xs flex items-center gap-1">
                                {player.clanBadgeUrl && (
                                  <img
                                    src={player.clanBadgeUrl}
                                    alt="Clan Badge"
                                    className="w-3 h-3 object-contain"
                                  />
                                )}
                                {player.clan}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-accent/30 shadow-sm">
                              <img
                                src={player.leagueIconUrl}
                                alt="League"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <Badge
                              variant="outline"
                              className="h-fit px-2 py-0.5 bg-amber-100/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 shadow-sm"
                            >
                              <span className="text-sm font-bold text-amber-900 dark:text-amber-100 mr-1">
                                {player.trophies}
                              </span>
                              <Trophy className="h-3 w-3 text-amber-500" />
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center mt-2 justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1 items-center text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
                              <Sword className="h-3 w-3 text-blue-500" />
                              <span>{player.attacksWon}</span>
                            </div>
                            <div className="flex gap-1 items-center text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
                              <Shield className="h-3 w-3 text-green-500" />
                              <span>{player.defensesWon}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
