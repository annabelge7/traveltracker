# TravelTracker Backend (Supabase)

This app uses Supabase as the backend. Supabase provides:
- PostgreSQL database
- Authentication (magic link email)
- File storage (for photos)
- Realtime subscriptions

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### 2. Run the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `schema.sql` and run it
3. This will create the `posts` table with all necessary indexes and policies

### 3. Create the Photos Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `photos`
3. Make it **public** (so photos are viewable)
4. Add these storage policies in the SQL editor:

```sql
create policy "Anyone can view photos"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');
```

### 4. Configure Authentication

1. Go to Authentication > Providers
2. Make sure Email is enabled
3. Go to Authentication > URL Configuration
4. Add your site URL (e.g., `http://localhost:3000` for development)
5. Add redirect URLs: `http://localhost:3000/auth/callback`

### 5. Get Your API Keys

1. Go to Project Settings > API
2. Copy the **Project URL** and **anon public** key
3. Add these to your frontend `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
```

## Database Schema

### Posts Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| created_at | timestamp | When the post was created |
| updated_at | timestamp | When the post was last updated |
| user_id | uuid | Reference to auth.users |
| type | text | One of: place, hostel, people, bus, photo, other |
| title | text | Post title |
| description | text | Optional description |
| location | text | Location name |
| country | text | Country name |
| latitude | double | Optional GPS latitude |
| longitude | double | Optional GPS longitude |
| date | date | Date of the post |
| photos | text[] | Array of photo URLs |
| metadata | jsonb | Additional metadata |

## Row Level Security

- **SELECT**: Anyone can view all posts (public timeline)
- **INSERT**: Only authenticated users can create posts
- **UPDATE/DELETE**: Users can only modify their own posts

The frontend additionally checks if the user's email matches `NEXT_PUBLIC_ADMIN_EMAIL` to determine if they can see the admin posting UI.
