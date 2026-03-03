# Feature: Phase 4 — Notifications & Polish

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Context

PeerPull's core feedback loop is feature-complete (Phases 1-3), but users have no way to know when something happens asynchronously — when someone reviews their project, when their review is approved/rejected, or when their review gets rated. This is Phase 4 from TRACKER.md (items 4.1-4.6), the final sprint before public launch.

**What this adds:**
- `notifications` and `notification_preferences` database tables with RLS
- In-app notification bell with real-time updates via Supabase Realtime
- Email notifications via Mailgun API for 4 review lifecycle events
- Notification preferences UI in the settings page
- Notification management server actions (mark read, update preferences)

## Feature Description

A notification system covering 4 core review lifecycle events: `review_received`, `review_approved`, `review_rejected`, `review_rated`. Notifications are created in server actions after each lifecycle event, appear in real-time via the notification bell dropdown in AppHeader, and optionally trigger email via Mailgun. Users control email preferences per event type in Settings.

## User Stories

**As a builder**, I want to be notified when someone submits a video review on my project, so I can watch it and provide feedback promptly.

**As a reviewer**, I want to know when my review is approved, rejected, or rated, so I understand my standing and can improve my reviews.

**As a user**, I want to control which events trigger email notifications, so I'm not overwhelmed.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: High
**Primary Systems Affected**: Database (2 new tables), `app/actions.ts`, `NotificationDropdown`, Settings page, AppHeader
**Dependencies**: Mailgun API (external), Supabase Realtime
