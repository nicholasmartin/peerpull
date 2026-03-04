# PeerPull: Queue Vulnerabilities & Gaming Scenarios

## System Overview - THE CORRECT MECHANICS

PeerPull uses a FIFO queue system with these mechanics:

**Queue Behavior:**
- Simple counter-based queue in Supabase (lowest counter = next to be reviewed)
- New projects added to END of queue (highest counter number)
- Projects move forward as reviews complete
- You CANNOT be pushed back - queue only moves forward
- Position in queue is permanent until you reach the front

**Point Economy:**
- Give 1 review = Earn 1 PeerPoint (immediately upon video submission)
- Receive 1 review = Spend 2 PeerPoints (deducted when reviewed)
- **2:1 Ratio: Review 2 projects → Earn 2 points → Get 1 review back**

**Review Process:**
- User cannot pre-record videos (browser API records screen + audio live)
- You don't know which project you'll review until session starts
- Incomplete sessions (>10 minutes) return project to FRONT of queue
- User who abandoned CANNOT see that project again
- Recipients rate review quality (affects reviewer's reputation)

**Auto-Requeue:**
- After receiving review: Owner loses 2 points
- System checks: Does owner have ≥2 points remaining?
- If YES: Project goes to BACK of queue (not front)
- If NO: Project removed from queue

**New User Flow:**
- Sign up → Get 2 free PeerPoints
- Can immediately submit project OR review first
- After first review received: Must give 2 reviews to earn 2 points for next submission

## CORRECTED Understanding of Queue Dynamics

### How FIFO Works (I was wrong before)
- User A submits → Position 1
- User B submits → Position 2 (BEHIND User A)
- User C submits → Position 3 (BEHIND User B)
- As reviews complete: 1→2→3 everyone moves forward
- **User C is NEVER pushed back by later submissions**
- Later submissions go BEHIND User C

### Power Users Don't "Skip the Line"
If a user has 20 points and auto-requeues 10 times:
- Each time they requeue, they go to the BACK
- They wait in line like everyone else
- They just get to submit more often
- **This is FAIR - they earned those points by reviewing**

I was completely wrong to call this a vulnerability. This is the intended design.

## Actual Vulnerabilities (Revised)

### 1. Multi-Account Sybil Attack
**Severity: MEDIUM-HIGH**

**How it works:**
- User creates 50 email accounts
- Each gets 2 free PeerPoints
- Each submits a project
- 50 projects enter queue
- Each gets 1 review for free (costs 2 points, they have 2)
- User gets 50 reviews without giving any

**Impact:**
- Queue flooded with projects from one person
- Legitimate reviewers waste time on potentially spam/duplicate projects
- But: Self-limiting (each account only gets 1 free review)
- But: User could get 50 reviews on essentially the same project

**Severity Assessment:**
- At small scale (5-10 accounts): Annoying but manageable
- At large scale (100+ accounts): Could overwhelm queue
- Detection difficulty: Medium (can track IP, similar projects, timing)

**Mitigation:**
- Email verification required (current plan ✓)
- IP-based rate limiting on signups
- Flag accounts submitting to same domain/URL
- Phone verification for accounts that submit projects
- Manual review of suspicious patterns
- Limit: 1 free signup per IP per month

**Priority: Should implement IP tracking and duplicate URL detection before launch**

---

### 2. Low-Quality Review Spam
**Severity: MEDIUM**

**How it works:**
- User wants to earn points quickly
- Gives very brief, generic reviews
- "Looks good!" "Nice design!" "Keep going!"
- Still earns 1 point per review (no approval needed)
- Accumulates points rapidly
- Recipients get useless feedback

**Impact:**
- Platform value degrades
- Recipients dissatisfied with feedback quality
- Word of mouth suffers
- High-quality reviewers discouraged

**Why this isn't automatically prevented:**
- Video recording doesn't guarantee quality
- User can speak quickly and generically
- System gives point immediately (no approval delay)

**Mitigation:**
- Recipient rates every review (1-5 stars)
- Track average rating per reviewer
- Low-rated reviewers (<3.5 stars average):
  - Earn 0.5 points instead of 1 point
  - Or: Points held pending until rating received
  - Or: Account flagged for review
- Minimum video length: 90 seconds (enforced in browser)
- Display reviewer rating publicly on profile

**Priority: Must implement rating system before/at launch**

---

### 3. The "Free Loader" Problem
**Severity: LOW-MEDIUM**

**How it works:**
- User signs up, gets 2 free points
- Submits project immediately
- Gets 1 review for free
- Never gives any reviews
- Never returns to platform

**Impact:**
- 15-30% of users might do this (typical free tier behavior)
- Not malicious, but doesn't contribute to ecosystem
- If 50% of users do this, reviewer pool shrinks

**Why this matters:**
- If 100 users sign up, and 50 never review
- Only 50 contribute to review pool
- But all 100 submitted projects to queue
- Creates supply/demand imbalance

**Mitigation:**
- Track users who never gave a review
- After 30 days of zero reviews: Mark account as "inactive"
- Email campaigns to encourage first review
- Gamification: "Give your first review to unlock X"
- Consider: Give 1 point at signup, 1 point after first review given
- Or: Require 1 review before allowing project submission

**Priority: Monitor post-launch, add nudges as needed**

---

### 4. Session Abandonment Patterns
**Severity: LOW**

**How it works:**
- User starts review session
- Realizes they don't like the project or it's complex
- Abandons without completing (>10 minutes)
- Project returns to front of queue
- Different user picks it up
- Same thing happens repeatedly

**Impact:**
- Certain projects might be "hard to review" (complex, unclear, etc.)
- These projects get abandoned multiple times
- Waste reviewer time
- Project owner waits longer

**Why current design helps:**
- User who abandoned can't see that project again ✓
- Project goes to FRONT, gets another chance quickly ✓
- Different reviewers have different tolerances

**Remaining issue:**
- If 10 users all abandon the same project
- Still delays that project significantly
- Might indicate project is poorly presented

**Mitigation:**
- Track abandonment count per project
- After 3 abandonments: Flag project for owner
- Suggest: "Your project was abandoned 3 times. Consider simplifying."
- After 5 abandonments: Require owner to update project before requeue
- Or: Manual review by admin

**Priority: Monitor post-launch, implement if pattern emerges**

---

### 5. The "Duplicate Project" Exploit
**Severity: MEDIUM**

**How it works:**
- User has 10 PeerPoints
- Instead of submitting 1 project and getting 5 reviews via auto-requeue
- User submits 5 different "projects" that are actually the same thing
- Each goes to back of queue at different times
- Each gets reviewed independently
- User gets 5 reviews on essentially same project

**Why this works:**
- System doesn't detect duplicate URLs
- Slight URL variations (index.html vs /) appear different
- Or user creates 5 landing pages with same content, different domains

**Impact:**
- Queue bloat with duplicate work
- Reviewers waste time reviewing similar projects
- Not fair to others in queue

**Mitigation:**
- Limit: 1 active project per user in queue at a time
- Can only submit another after first completes (gets reviewed)
- Or: Detect similar URLs/domains (strip parameters, etc.)
- Or: Manual review of users with multiple simultaneous submissions

**Priority: Implement "1 active project per user" rule before launch**

---

### 6. Reputation Score Gaming
**Severity: LOW**

**How it works:**
- User realizes low ratings hurt them
- Gives overly positive, uncritical reviews to get high ratings
- "Everything looks amazing! Perfect! 5 stars!"
- Recipients love it (positive feedback feels good)
- User maintains high rating but provides no value

**Impact:**
- Platform becomes echo chamber
- Critical feedback (which is valuable) discouraged
- Users don't get honest insights they need

**Mitigation:**
- Track rating distribution per reviewer
- Flag reviewers who give only 5-star ratings (suspicious)
- Educate users: "Constructive criticism is valuable"
- Show both rating AND review count (100 reviews at 5 stars more trustworthy than 2 reviews at 5 stars)
- Consider: Verified reviews (recipient confirms they implemented feedback)

**Priority: Monitor post-launch, low urgency**

---

### 7. The "Free Points" Arbitrage
**Severity: LOW**

**How it works:**
- User signs up, gets 2 free points
- Immediately gives 2 reviews (earns 2 more points, has 4 total)
- Submits project, gets review (has 2 points left)
- Auto-requeues, gets another review (has 0 points)
- Net: User gave 2 reviews, got 2 reviews
- This is 1:1 ratio, not 2:1

**Why this happens:**
- Free 2 points at signup skews the first cycle
- User "profits" from the free points

**Impact:**
- Not really a problem
- Encourages engagement
- Free points are intentional to bootstrap

**Mitigation:**
- None needed - this is working as intended
- Free points drive initial engagement

**Priority: Not a vulnerability, it's a feature**

---

## Real Economic Challenges (Not Exploits)

### Challenge 1: Point Accumulation
**What happens:**
- Active reviewers give 5-10 reviews per day
- Earn 5-10 points daily
- But only need 2 points to submit project
- Points accumulate (have 50+ points)
- Nothing to spend them on

**Impact:**
- Points lose value if they can't be used
- Users might stop reviewing (no incentive)
- OR users keep reviewing because they enjoy it

**Solutions:**
- Point sinks: Premium features, featured reviews, badges
- Leaderboards showing top point earners
- Special perks for high-point users
- Point decay after 90 days of inactivity (controversial)
- Adjust ratio to 1:1 if accumulation becomes severe

**This is a design challenge, not a vulnerability**

---

### Challenge 2: Queue Starvation
**What happens:**
- 100 users sign up week 1
- All submit projects (100 in queue)
- 20% are active reviewers
- 20 users × 3 reviews/day = 60 reviews/day
- Queue clears in ~1.6 days
- Week 2: Only 5 new projects enter queue
- 60 reviews/day capacity, only 5 projects to review
- Reviewers have nothing to review

**Impact:**
- Reviewers can't earn points (no projects available)
- Platform appears "dead"
- Users leave

**Solutions:**
- Seed queue with admin/partner projects
- Encourage re-submissions for additional feedback
- Lower barrier: Allow 1-point "quick feedback" option
- Recruit projects from other platforms
- Marketing to attract more projects

**This is a growth/supply problem, not a vulnerability**

---

### Challenge 3: New User Wait Times
**What happens:**
- Platform grows to 1000 users
- 200 projects in queue
- 50 active reviewers × 3 reviews/day = 150 reviews/day
- New user submits → Position 200 in queue
- Wait time: 200 ÷ 150 = 1.33 days (32 hours)
- New user expects <24 hours
- Gets frustrated and churns

**Impact:**
- Growth creates longer wait times
- New user experience degrades
- Churn increases

**Solutions:**
- Priority boost for first-time users (move up 50 positions)
- Guarantee: "First submission reviewed within 24 hours"
- Offer bonus points to reviewers during high-queue periods
- Recruit more reviewers (gamification, competitions)
- Temporarily increase ratio to 1.5:1 during queue buildup

**This is a scaling challenge, not a vulnerability**

---

## What I Was Wrong About (Corrections)

### ❌ WRONG: "Rich get richer" inequality
**Why I was wrong:** 
- Everyone waits in line in FIFO order
- Having more points doesn't skip the queue
- Power users just submit more often (to back of queue)
- This is fair - they earned those points

### ❌ WRONG: Points create infinite loop
**Why I was wrong:**
- Didn't understand that 2 points are deducted when reviewed
- System naturally prevents infinite cycling
- User must earn points through reviewing

### ❌ WRONG: Speed reviewing is a vulnerability
**Why I was wrong:**
- Fast, quality reviews are GOOD for the platform
- The rating system handles quality control
- Speed should be rewarded if quality maintained

### ❌ WRONG: Auto-requeue creates unfairness
**Why I was wrong:**
- Requeue goes to BACK of queue
- Everyone waits their turn
- Having more points just means more submissions (which were earned)

## Actual Priority Fixes Needed

### Before Launch (Critical):
1. **Implement review rating system** - Recipients rate every review (1-5 stars)
2. **Track reviewer reputation** - Display average rating on profile
3. **Low-quality reviewer penalties** - Reviewers <3.5 stars earn 0.5 points
4. **One active project limit** - Users can't submit multiple projects simultaneously
5. **Duplicate URL detection** - Flag similar domains/URLs
6. **IP-based signup limits** - Max 2 accounts per IP per month

### At Launch (Important):
7. **Abandonment tracking per project** - Flag projects abandoned 3+ times
8. **Email verification** - Required before points activate
9. **Minimum video length** - 90 seconds enforced
10. **New user onboarding** - Tutorial on giving quality reviews

### Post-Launch (Monitor):
11. **Free-loader identification** - Track users who never review
12. **Multi-account detection** - Pattern analysis for suspicious activity
13. **Point economy dashboard** - Monitor supply/demand balance
14. **Queue health metrics** - Alert when wait times exceed 36 hours

## Conclusion

The FIFO + 2:1 ratio system is actually well-designed:
- Natural incentive to review (earn points)
- Fair queue (everyone waits their turn)
- Quality control through ratings
- Self-regulating economy

The main vulnerabilities are:
1. Multi-account abuse (solvable with verification)
2. Low-quality reviews (solvable with ratings)
3. Duplicate projects (solvable with limits)

The main challenges are:
1. Maintaining queue supply (growth problem)
2. Preventing point hoarding (add point sinks)
3. Scaling reviewer capacity (marketing problem)

None of these are fundamental design flaws. The system is sound.