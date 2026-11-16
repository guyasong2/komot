# KOMOT Database Migrations

This directory contains all database migrations for the KOMOT digital identity platform.

## 📋 Migration Files

### Overview

All KOMOT tables are created in a dedicated `komot` schema to avoid conflicts with existing tables in the database. This provides clean separation and allows both systems to coexist.

### Migration List

1. **20261116_001_create_komot_schema.sql**
   - Creates the `komot` schema
   - Sets up core identity tables: `profiles`, `organizations`, `organization_members`
   - Establishes foreign key relationships and constraints
   - Creates indexes for optimal query performance

2. **20261116_002_create_journey_tables.sql**
   - Creates journey tables: `education`, `work_experience`, `skills`, `certifications`, `projects`
   - Implements date validation constraints
   - Sets up display ordering and visibility controls

3. **20261116_003_create_social_qr_tables.sql**
   - Creates social media links table
   - Implements QR code system: `qr_codes`, `qr_visibility`
   - URL validation constraints
   - Token security measures

4. **20261116_004_create_analytics_tables.sql**
   - Creates analytics tables: `qr_scans`, `profile_views`, `link_clicks`
   - Optimized indexes for time-series queries
   - Privacy-respecting data collection

5. **20261116_005_create_connections_notifications.sql**
   - User connection system
   - Notification management
   - Organization departments
   - Self-connection prevention

6. **20261116_006_rls_policies.sql**
   - Comprehensive Row Level Security (RLS) policies
   - Public profile visibility rules
   - Owner/member/admin authorization
   - Analytics access control

7. **20261116_007_triggers_functions.sql**
   - Automatic timestamp updates
   - QR token generation utility
   - Notification helper functions
   - Connection request/acceptance triggers

8. **20261116_008_storage_buckets.sql**
   - Supabase Storage bucket configuration
   - File size limits and MIME type restrictions
   - Storage access policies

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with carefully designed policies:

- **Public profiles**: Anyone can view public information
- **Private data**: Only owners can access their private information
- **Organization data**: Role-based access (owner/admin/editor/social_manager)
- **Analytics**: Users can only view their own analytics
- **Connections**: Users can only see connections they're involved in

### Data Validation

- Username format validation (lowercase alphanumeric, hyphens, underscores)
- Email format validation
- Date range validation (start_date <= end_date)
- URL format validation
- Self-connection prevention

### Storage Security

- File size limits (5MB for profile images, 10MB for cover images)
- MIME type restrictions (images only)
- User-scoped file access (users/{user_id}/*)

## 📊 Database Schema Summary

### Core Tables
- `komot.profiles` - User and organization profiles
- `komot.organizations` - Organization details
- `komot.organization_members` - Team membership

### Journey Tables
- `komot.education` - Academic history
- `komot.work_experience` - Work history
- `komot.skills` - Skills and proficiencies
- `komot.certifications` - Professional certifications
- `komot.projects` - Portfolio projects

### Social & QR
- `komot.social_links` - Social media links
- `komot.qr_codes` - QR code management
- `komot.qr_visibility` - Per-QR section visibility

### Analytics
- `komot.qr_scans` - QR scan tracking
- `komot.profile_views` - Profile view tracking
- `komot.link_clicks` - Link click tracking

### Social Features
- `komot.connections` - User connections
- `komot.notifications` - User notifications
- `komot.departments` - Organization departments

## 🚀 Applying Migrations

### Prerequisites

1. Ensure you have the Supabase CLI installed
2. Ensure your local `.env.local` or `.env` contains valid Supabase credentials
3. Ensure you're connected to the correct Supabase project

### Method 1: Using Supabase MCP Tools (Recommended)

Since you have Supabase MCP connected, you can apply migrations using the MCP tools:

```bash
# The migrations are ready in supabase/migrations/
# I will apply them after your explicit approval
```

### Method 2: Using Supabase CLI

```bash
# Link to your Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push

# Or apply specific migration
supabase db push --file supabase/migrations/20261116_001_create_komot_schema.sql
```

### Method 3: Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each migration file content
4. Execute in order (001 → 002 → ... → 008)

## ⚠️ Important Notes

### Before Applying Migrations

1. **Backup your database** (if applying to production)
2. **Review each migration file** to understand what will be created
3. **Test on a development/staging environment first**
4. **Ensure no naming conflicts** (all tables are in `komot` schema, so should be safe)

### After Applying Migrations

1. Verify all tables were created: Check `komot` schema in database
2. Test RLS policies: Try accessing data as different users
3. Verify storage buckets: Check Supabase Storage dashboard
4. Update your Next.js `.env.local` with Supabase credentials

## 🧪 Testing Migrations Locally

You can test migrations locally using Supabase local development:

```bash
# Start local Supabase (Docker required)
supabase start

# Apply migrations to local database
supabase db reset

# Check migration status
supabase migration list

# Stop local Supabase
supabase stop
```

## 📝 Migration Workflow

### Adding New Migrations

When you need to modify the schema:

1. Create a new migration file with timestamp:
   ```bash
   supabase migration new your_migration_name
   ```

2. Write your SQL in the generated file

3. Test locally:
   ```bash
   supabase db reset
   ```

4. Apply to remote:
   ```bash
   supabase db push
   ```

### Rolling Back

If you need to roll back a migration:

1. Create a new migration that reverses the changes
2. Never delete migration files that have been applied
3. Always move forward with new migrations

## 🔍 Verifying Migration Success

After applying migrations, verify:

```sql
-- Check schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'komot';

-- List all tables in komot schema
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'komot' 
ORDER BY table_name;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'komot';

-- Check storage buckets
SELECT * FROM storage.buckets;
```

## 📚 Additional Resources

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)

---

**Ready to apply migrations?** Please review all migration files and confirm before I proceed with applying them to your Supabase project.
