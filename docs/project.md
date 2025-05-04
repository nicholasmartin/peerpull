# PeerPull Project Overview

## Project Concept

PeerPull is a feedback exchange platform specifically designed for early-stage technical founders. The core concept revolves around a structured 2:1 exchange ratio where founders provide two reviews to other projects in order to receive one quality review on their own project.

### Core Value Proposition

Solo technical founders often build in isolation without adequate feedback, leading to wasted development time and misaligned products. PeerPull solves this by:

1. Creating a sustainable ecosystem of peer feedback
2. Ensuring quality through approval mechanisms
3. Matching technical founders with relevant expertise
4. Providing structure to make feedback actionable
5. Enabling rapid validation before significant development investment

### Target Users

- **Primary**: Solo technical founders, pre-revenue and pre-investment
- **Secondary**: More experienced founders who want to discover promising startups and pay it forward

### Key Terminology

- **PullRequest**: A project submitted for feedback (landing page, concept, prototype)
- **PeerPoints**: The credit system that powers the exchange (2 reviews given = 1 PeerPoint earned)
- **PeerInsights**: The structured feedback received from other founders
- **PeerPros**: Experienced founders who participate in the platform

## Technical Stack

### Frontend

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS for utility-first styling
- **Components**: shadcn/ui for consistent UI elements
- **State Management**: React Context API or Zustand for client-side state
- **Authentication Flow**: Supabase Auth with cookie-based sessions via supabase-ssr

### Backend

- **API Routes**: Next.js App Router API endpoints for server operations
- **Database**: Supabase Postgres for relational data
- **Authentication**: Supabase Auth (email/password, OAuth providers)
- **Storage**: Supabase Storage for screenshots and uploads
- **Real-time**: Supabase Realtime for notifications and updates

### Deployment

- **Hosting**: Vercel for production deployment
- **Integration**: Supabase Vercel Integration for environment variables
- **Environment**: Automatic environment variable assignment to Vercel project

## Database Schema (High-Level)

### Core Tables

1. **users**
   - Standard Supabase auth users plus profile information
   - Expertise areas, experience level, bio

2. **pull_requests**
   - Project submissions requiring feedback
   - Status, type, focus areas, URLs, description

3. **reviews**
   - Feedback given between users
   - Rating scores, detailed feedback, timestamps

4. **peer_points**
   - Transaction ledger for the point system
   - Earned points, spent points, current balance

5. **notifications**
   - System alerts and messages
   - New feedback, point earnings, etc.

## Key Features & Functionality

### User Journey

1. **Onboarding**
   - Sign up with email or OAuth
   - Complete profile with expertise areas
   - Initial walkthrough of the exchange concept

2. **Submission Flow**
   - Create a new PullRequest with project details
   - Specify areas for feedback focus
   - Submit for review (costs 1 PeerPoint)

3. **Review Flow**
   - Browse review opportunities in the queue
   - Select projects to review
   - Complete structured feedback form
   - Submit review to earn PeerPoints

4. **Feedback Management**
   - Receive notifications of new feedback
   - Review and approve/reject feedback
   - Ask follow-up questions
   - Export insights

### Core Features

1. **2:1 Exchange Mechanism**
   - Automated tracking of reviews given vs. received
   - PeerPoints ledger for transaction history
   - Quality control through feedback approval

2. **Matchmaking System**
   - Algorithm to suggest relevant reviews based on expertise
   - Prevents gaming the system through review avoidance

3. **Structured Feedback Templates**
   - Customized templates based on project type
   - Ensures comprehensive feedback across key areas

4. **Quality Control**
   - Review approval mechanism
   - Reputation system for reviewers
   - Flagging system for low-quality feedback

5. **Community Elements**
   - Leaderboards for top contributors
   - Recognition for experienced founders (PeerPros)
   - Optional public profiles

## Implementation Priorities

### Phase 1: MVP (Current Focus)

- User authentication and profiles
- Basic PullRequest submission
- Review queue with simple filtering
- Core PeerPoints exchange mechanism
- Minimal viable feedback templates

### Phase 2: Enhancement

- Advanced matchmaking algorithm
- Expanded feedback templates
- Community features and leaderboards
- Notifications system
- Mobile responsiveness improvements

### Phase 3: Scaling

- Analytics for founders
- Premium features for monetization
- API for integrations
- Expanded community features

## Technical Implementation Details

### Authentication Flow

Using supabase-ssr package to configure Supabase Auth with cookies:

```javascript
// Example auth setup with supabase-ssr
import { createServerClient } from '@supabase/ssr'

export async function createClient(cookies) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookies.get(name)?.value,
        set: (name, value, options) => cookies.set(name, value, options),
        remove: (name, options) => cookies.delete(name, options),
      },
    }
  )
}
```

### App Router Structure

```
/app
  /auth
    /login
    /signup
    /reset-password
  /dashboard
  /pull-requests
    /[id]
    /new
  /review
    /queue
    /[id]
  /peer-points
  /community
  /profile
    /[username]
  /settings
  /api
    /pull-requests
    /reviews
    /peer-points
    /users
```

### Key Components

- **PullRequestCard**: Displays project submission previews
- **ReviewForm**: Structured feedback entry with templates
- **PeerPointsWidget**: Shows current balance and recent transactions
- **QueueFilters**: Filters review opportunities by relevance
- **FeedbackDisplay**: Presents received feedback with metrics

### Data Flow

1. User creates a PullRequest which is stored in Supabase
2. Queue is populated with available reviews from database
3. Completed reviews trigger PeerPoints transactions
4. Approved feedback updates review status and notifies users
5. Dashboard aggregates metrics from various tables

## Development Guidelines

### Code Organization

- Feature-based folder structure
- Server components for data fetching
- Client components for interactivity
- Shared UI components in /components directory

### State Management

- Server state with direct database queries
- Form state with React Hook Form
- Global app state with Context or Zustand

### Styling Approach

- Consistent use of Tailwind utility classes
- shadcn/ui components as building blocks
- Custom theme extending the default shadcn theme
- Responsive design for all views

### API Pattern

- RESTful endpoints using App Router handlers
- Consistent error handling and responses
- Authentication middleware for protected routes

## Additional Notes

- Environment variables will be automatically assigned through Supabase Vercel Integration
- The application is designed to work across entire Next.js stack
- Focus on clean, maintainable code that can be easily extended
- Performance optimization is important, particularly for review queue loading
- Real-time notifications should enhance the user experience but not overwhelm

This document serves as a high-level overview for AI coding agents to understand the PeerPull project concept, technical stack, and implementation approach.
