# PeerPull UI Dashboard Mockup Specification

This document provides a comprehensive overview of the PeerPull application UI structure, detailing sidebar navigation elements and page content specifications for each section. This specification can be used as a blueprint for creating UI mockups.

## Brand Elements

- **Primary Color**: #3366FF (Blue)
- **Secondary Color**: #FF6633 (Orange)
- **Accent Color**: #2EC4B6 (Teal)
- **Typography**: San Francisco Pro / Inter (or equivalent modern sans-serif)
- **Logo Placement**: Top left of sidebar

## Sidebar Navigation Structure

The sidebar should be a dark blue (#182B49) column on the left side of the interface with white text. Each menu item should have an appropriate icon beside it.

### Primary Navigation Items

1. **Dashboard** - Icon: Grid/Home
2. **My PullRequests** - Icon: Document/Code
3. **Review Queue** - Icon: Checkmark/Review
4. **PeerPoints** - Icon: Coin/Credit
5. **Community** - Icon: People/Group
6. **Profile** - Icon: User/Avatar
7. **Settings** - Icon: Gear/Cog

### Secondary Elements (Bottom of Sidebar)

1. **Help & Support** - Icon: Question Mark
2. **Invite Founders** - Icon: Plus/Add Person
3. **Logout** - Icon: Exit/Door

## Page Specifications

### 1. Dashboard Page

**Purpose**: Main landing page after login showing summary of activities and metrics

**Elements**:
- **Welcome Banner**: Personalized greeting with quick stats
- **Activity Summary Card**: Shows recent activity
- **PeerPoints Balance Widget**: Visual display of available points
- **My Active PullRequests**: Shows status of your current submissions
- **Pending Reviews**: Shows how many reviews you have pending
- **Recent Feedback**: Preview of most recent feedback received
- **Community Highlights**: Featured reviews or members
- **Quick Actions Bar**: Submit new PullRequest, Start Reviewing, etc.
- **Progress Metrics**: Visual charts showing feedback quality score, response times

**Layout**: 
Two-column grid layout with cards/widgets arranged by priority

---

### 2. My PullRequests Page

**Purpose**: Manage all your submitted projects/requests for feedback

**Elements**:
- **Create New PullRequest Button**: Prominent at top
- **Active PullRequests Tab**:
  - List view of active submissions with:
    - Project name/title
    - Date submitted
    - Type (landing page, concept, etc.)
    - Status indicator (awaiting reviews, reviews in)
    - Feedback count
    - Quick view/edit buttons
- **Completed PullRequests Tab**:
  - Historical list of past submissions
  - All metrics and feedback scores
  - Re-activate option
- **Drafts Tab**: Saved but unsubmitted requests
- **Filters**: By date, type, status, etc.

**Layout**:
Table/list view with expandable rows for details

---

### 3. Review Queue Page

**Purpose**: Where users find and complete reviews to earn PeerPoints

**Elements**:
- **Available Reviews Section**:
  - Card-based gallery of projects to review
  - Each card shows:
    - Project title/name
    - Brief description (truncated)
    - Tags/categories
    - Estimated review time
    - Creator experience level
- **My Active Reviews Tab**: Reviews you've started but not submitted
- **Review History Tab**: Past reviews you've given
- **Filters**: By project type, category, time commitment, etc.
- **Sort Options**: Newest, quick reviews, your expertise areas
- **Search Bar**: Find specific types of projects

**Layout**:
Pinterest-style masonry grid of review opportunity cards

---

### 4. PeerPoints Page

**Purpose**: Track point balance, history, and spend options

**Elements**:
- **Current Balance Display**: Large, visual representation
- **Points Activity Timeline**:
  - Table showing when points were earned/spent
  - Transaction type (review given, review received)
  - Date and project reference
- **Points Forecast**: Projection based on pending reviews
- **Bonus Points Section**: Ways to earn extra points
  - First time reviewer bonuses
  - Streak bonuses
  - Quality review bonuses
- **Premium Options**: Ways to purchase additional points (future monetization)

**Layout**:
Top section with balance visualization, tables below for transactions

---

### 5. Community Page

**Purpose**: Connect with other founders, see platform activity

**Elements**:
- **Member Directory**:
  - Searchable list of platform members
  - Filter by expertise, industry, experience level
  - Basic profile previews
- **PeerPro Showcase**:
  - Featured experienced founders providing valuable feedback
  - Their stats and specialties
- **Leaderboards**:
  - Top reviewers
  - Highest quality feedback providers
  - Most helpful members
- **Community Activity Feed**:
  - Recent notable reviews
  - New members
  - Milestones and achievements
- **Events & Webinars**: Upcoming community events (future feature)

**Layout**:
Tabbed interface with directory, showcase, and leaderboard sections

---

### 6. Profile Page

**Purpose**: Manage personal info and track individual metrics

**Elements**:
- **Profile Header**:
  - Profile picture
  - Name
  - Tagline/Title
  - Experience level badge
  - PeerPoints balance
- **Bio Section**: Editable about me/background
- **Expertise Tags**: Areas of technical/business knowledge
- **Personal Stats**:
  - Reviews given
  - PullRequests submitted
  - Average feedback quality score
  - Response time average
- **My Achievements**: Badges/milestones reached
- **Projects Section**: Link to personal website/projects
- **Preferences Tab**: Notification settings, etc.

**Layout**:
Header banner with user info, tabbed sections below

---

### 7. Settings Page

**Purpose**: Configure account preferences and notifications

**Elements**:
- **Account Settings**:
  - Email address
  - Password change
  - Connected accounts (GitHub, etc.)
- **Notification Preferences**:
  - Email frequency
  - Push notification toggles
  - Types of alerts
- **Privacy Settings**:
  - Profile visibility options
  - What information is shared
- **Expertise Settings**:
  - Select areas of expertise for review matching
  - Industry selections
- **Interface Settings**:
  - Dark/light mode
  - Compact/comfortable view
- **Export Data**: Download your data/feedback
- **Delete Account**: Account removal option

**Layout**:
Left sidebar with category selection, right panel with form fields

---

### 8. Submit New PullRequest Page

**Purpose**: Form for submitting a new project for review

**Elements**:
- **Project Basics Form**:
  - Project name
  - URL (if applicable)
  - Stage dropdown (idea, landing page, prototype, etc.)
  - Brief description field
  - Tags/category selection
- **Feedback Focus Section**:
  - Checkboxes for areas needing focus:
    - Value proposition
    - Technical architecture
    - UI/UX
    - Market fit
    - Pricing
    - Messaging
  - Custom focus area field
- **Context Field**: Additional information for reviewers
- **Specific Questions**: Up to 3 specific questions for reviewers
- **File/Image Upload**: Screenshots or documents
- **Preview Button**: See how it will appear to reviewers
- **Submit Button**: Uses 1 PeerPoint to submit

**Layout**:
Multi-step form with progress indicator

---

### 9. Review Submission Page

**Purpose**: Interface for giving structured feedback to others

**Elements**:
- **Project Display Panel**:
  - Shows the project being reviewed
  - Embedded website or material
  - Creator's specific questions highlighted
- **Feedback Form**:
  - Structured template based on request type
  - Rating scales for different aspects
  - Strength/weakness identification
  - Constructive feedback guidelines
- **Example Quality Reviews**: Reference material
- **Timer**: Shows time spent on review (optional)
- **Save Draft Button**: To continue later
- **Preview Button**: See how feedback will appear
- **Submit Button**: Finalize and send review

**Layout**:
Split-screen with project display on left, feedback form on right

---

### 10. Feedback View Page

**Purpose**: Review detailed feedback received on your projects

**Elements**:
- **Project Summary Header**: Quick view of project details
- **Feedback Overview**:
  - Aggregate ratings visualization
  - Common themes mentioned
  - Number of reviews
- **Individual Reviews List**:
  - Expandable feedback entries
  - Reviewer info (experience level, expertise)
  - Date received
  - Quality ratings
  - Full feedback text with structured sections
- **Response Options**:
  - Thank reviewer
  - Ask follow-up questions
  - Mark as helpful/unhelpful
- **Action Items**: Compile suggested improvements
- **Export Options**: Download feedback in various formats

**Layout**:
Overview panel at top, scrollable list of individual reviews below

---

### 11. Help & Support Page

**Purpose**: Resources and assistance for platform users

**Elements**:
- **Getting Started Guide**:
  - Quick tutorial cards
  - Video walkthroughs
- **FAQ Section**: Common questions and answers
- **Best Practices**:
  - How to get quality feedback
  - How to give valuable reviews
- **Contact Support Form**:
  - Issue type dropdown
  - Description field
  - Attachment option
- **Resource Library**: Articles on startup validation
- **Community Guidelines**: Rules and etiquette

**Layout**:
Card-based resource center with search functionality

---

### 12. Invite Founders Page

**Purpose**: Refer other founders to the platform

**Elements**:
- **Invitation Form**:
  - Email input (single or multiple)
  - Personalized message
  - Send button
- **Referral Link**: Copy-paste link with tracking
- **Benefits Explanation**:
  - How referrals help the platform
  - PeerPoints bonuses for successful referrals
- **Invitation Templates**: Pre-written messages
- **Referral Status**: Track sent invites and conversions
- **Social Share Buttons**: Quick share to Twitter, etc.

**Layout**:
Simple form-based page with referral tracking below

---

## Modal Components

These elements appear as overlays rather than full pages:

### 1. Quick Review Modal
- Simplified review interface for quick feedback
- Appears when using "Quick Review" option

### 2. Achievement Notification
- Appears when users earn badges or reach milestones
- Animated celebration effect

### 3. PeerPoint Earned Confirmation
- Visual feedback when points are awarded
- Shows updated balance

### 4. Onboarding Tutorial
- Step-by-step guide for new users
- Highlights key interface elements

### 5. Feedback Quality Rating
- Appears after receiving feedback
- Rate the helpfulness of received feedback

## Responsive Considerations

- **Mobile View**: Collapsible sidebar becomes top navigation
- **Tablet View**: Condensed sidebar with icons only (expandable)
- **Desktop View**: Full sidebar with text and icons

## Additional UI Elements

- **Loading States**: Skeleton screens for data loading
- **Empty States**: Friendly messages when no data available
- **Error States**: Clear error messages with recovery actions
- **Toast Notifications**: Non-intrusive status updates
- **Tooltips**: Contextual help on hover
- **Confirmation Dialogs**: For important actions

This specification provides a comprehensive outline for creating mockups of the PeerPull platform interface. The focus is on creating an intuitive, clean user experience that facilitates the exchange of quality feedback between technical founders.
