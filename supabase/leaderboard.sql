create table if not exists public.leaderboard_players (
  telegram_id text primary key,
  username text not null,
  coins numeric not null default 0,
  lifetime_collected numeric not null default 0,
  total_farms integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists leaderboard_players_coins_idx
  on public.leaderboard_players (coins desc, updated_at asc);
