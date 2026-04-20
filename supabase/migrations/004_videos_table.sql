-- Create video bucket
insert into storage.buckets (id, name, public) 
values ('video-uploads', 'video-uploads', true)
on conflict (id) do nothing;

-- Create bucket policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'video-uploads' );

create policy "Authenticated users can upload videos"
  on storage.objects for insert
  with check (
    bucket_id = 'video-uploads' 
    and auth.role() = 'authenticated'
  );

create policy "Users can delete their own videos"
  on storage.objects for delete
  using (
    bucket_id = 'video-uploads' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create table
create table if not exists public.videos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  artist_name text,
  video_url text not null,
  video_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.videos enable row level security;

-- Create policies for videos table
create policy "Videos are viewable by everyone." on public.videos
  for select using (true);

create policy "Users can insert their own videos." on public.videos
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own videos." on public.videos
  for delete using (auth.uid() = user_id);
