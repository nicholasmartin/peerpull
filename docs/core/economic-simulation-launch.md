# PeerPull: Economic Simulation & Launch Strategy

## Core Mechanics (Confirmed Correct)

**Point Flow:**
- Give 1 review → Earn 1 PeerPoint
- Receive 1 review → Spend 2 PeerPoints (deducted after review)
- **2:1 Ratio: Review 2 projects → Get 1 review back**

**Queue Behavior:**
- FIFO (First In, First Out)
- New projects go to BACK of queue
- Cannot be pushed back - queue only moves forward
- After receiving review: If user has ≥2 points → Auto-requeue to BACK

**Critical Math:**
- Each review cycle: +1 point earned, -2 points spent = -1 net point
- System naturally deflates points (this is intentional)
- Points injected via: New signups, bonuses, purchases
- Points consumed via: Reviews received

---

## The Two Problems (And Which Matters)

### Problem A: Points Burning Fast (GOOD PROBLEM)
**What it means:**
- High user activity ✓
- Lots of reviews happening ✓
- Platform working ✓
- Users engaged ✓

**Easy to fix:**
- Inject bonus points (instant)
- Sell point packages ($)
- Lower ratio (2:1 → 1.5:1 → 1:1)
- Referral bonuses
- Achievement rewards

**This is the ideal problem** - shows product-market fit.

---

### Problem B: Points Accumulating (BAD PROBLEM)
**What it means:**
- Low user activity ✗
- Few reviews happening ✗
- Platform feels dead ✗
- Users leaving ✗

**Hard to fix:**
- Can't force submissions
- Can't force reviews
- Marketing is slow/expensive
- Re-engaging churned users difficult
- May indicate fundamental issue

**This is the death spiral** - avoid at all costs.

---

## Launch Strategy: Start HOT, Not Conservative

### Philosophy
**Better to have:**
- Too much activity + need to inject points
- Than too little activity + dead platform

**Why:**
- You control point supply (easy to add)
- You don't control user engagement (hard to create)
- High activity = retention = growth = monetization
- Low activity = churn = death

### Week 1-4 Launch Settings (GENEROUS)

**Point Economics:**
- Free signup bonus: **3-4 points** (not 2)
- Ratio: **1:1** (not 2:1)
- First review bonus: **+2 points**
- Referral bonus: **+5 points per friend**
- Weekend multiplier: **2x points earned**

**User Limits:**
- Projects in queue: **1 active project at a time** (prevents spam)
- Auto-requeue limit: **3 times per project** (prevents monopolization)
- Reviews per day: **No limit** (encourage activity)

**Target Activity:**
- 50-75% active rate (realistic for committed beta users)
- 3-5 reviews per active user per day
- Queue clears in <12 hours
- High engagement, fast point burn

**Expected Outcome:**
- Points burn quickly (users reviewing a lot)
- Need to inject bonus points weekly
- Platform feels active and valuable
- Users stay engaged

---

### Month 2-3: Optimize Based on Data

**If points burning too fast (ideal scenario):**
```
Action 1: Introduce paid point packages
  - 50 points for $10
  - 200 points for $30
  - 500 points for $60

Action 2: Gradually increase ratio
  - Week 5-6: Test 1.5:1
  - Week 7-8: Test 2:1 (if signups support it)
  
Action 3: Reduce free bonuses
  - Signup: 3 points → 2 points
  - First review: +2 → +1
  - Weekend: 2x → 1.5x
```

**If points accumulating (problem scenario):**
```
Action 1: Marketing push for more projects
  - Partner with accelerators
  - Reddit/Twitter outreach
  - Content marketing

Action 2: Lower barriers
  - Allow "quick feedback" for 1 point
  - Featured submissions for 10 points
  - Make requeue cheaper (1 point instead of 2)

Action 3: Add point sinks
  - Premium features (priority review, expert reviewers)
  - Badges/achievements that cost points
  - Special features for high-point users
```

---

## Key Metrics Dashboard

### Green (Healthy) - Do Nothing
- Queue wait time: <24 hours
- Active users: 20-30% of total
- Review completion: 80-100% of queue daily
- Net point flow: -10 to +20 per day
- Average review rating: >3.8 stars
- User complaints: <5% about wait times

### Yellow (Monitor) - Watch Closely
- Queue wait time: 24-36 hours
- Active users: 15-20% or 30-40%
- Review completion: 60-80% of queue daily
- Net point flow: -30 to -10 or +30 to +50
- Average review rating: 3.5-3.8 stars
- User complaints: 5-10%

### Red (Act Now) - Immediate Changes Needed
- Queue wait time: >36 hours
- Active users: <15%
- Review completion: <60% of queue daily
- Net point flow: <-30 or >+50
- Average review rating: <3.5 stars
- User complaints: >10%

---

## The Control Levers (Simple Version)

**When points burning too fast:**
- Inject points (bonuses, promotions, sales)
- Lower ratio (2:1 → 1.5:1 → 1:1)
- Increase point rewards (1 → 1.5 per review)

**When points accumulating:**
- Increase costs (ratio 1:1 → 1.5:1 → 2:1)
- Add point sinks (premium features)
- Recruit more projects (marketing)
- Lower barriers (cheaper submissions)

**When queue too long:**
- Bonus points for reviewing (2x weekend)
- Email inactive users
- Recruit reviewers
- Temporarily lower submission costs

**When queue empty:**
- Marketing for more submissions
- Lower submission barriers
- Partner with communities
- Add incentives for resubmissions

---

## Realistic Launch Math

### Starting Point: 50 Users, 1:1 Ratio

**Assumptions:**
- 50 users sign up with 3 points each = 150 points
- 60% active rate (30 active users) - realistic for beta
- 3 reviews per active user per day
- 5 new signups per day

**Day 1:**
```
Active reviewers: 30
Reviews completed: 90
Points earned: 90
Points spent: 90 (1:1 ratio)
Points from signups: 5 × 3 = 15
Net: 150 + 90 + 15 - 90 = 165 points

Queue: 40 projects submitted
Reviews available: 90
Queue clears easily, some reviewers have nothing to review
```

**Week 1:**
```
Total users: 50 + 35 = 85
Active: 85 × 0.6 = 51
Daily reviews: 51 × 3 = 153
Points stable (1:1 ratio balances)
Bonus injections: ~50 points per week

Result: Healthy, sustainable
```

**Key Insight:** 1:1 ratio with modest growth (5/day) is sustainable

---

### Comparison: If You Started with 2:1 Ratio

**Same setup, but 2:1 ratio:**

**Day 1:**
```
Reviews: 90
Points earned: 90
Points spent: 180 (2:1 ratio!)
Points from signups: 15
Net: 150 + 90 + 15 - 180 = 75 points (HALF GONE)
```

**Day 3:**
```
Points depleted to near zero
Users can't submit projects
Platform stalls
```

**Would need:** 45+ signups per day to sustain
**Reality:** Impossible for early stage

**Conclusion:** Don't start with 2:1 unless you have viral growth proven

---

## Point Injection Strategies

### Free Methods (Build Engagement)

**1. Referral Program:**
- Inviter: +5 points when friend signs up
- Friend: +3 points at signup (instead of 2)
   
**2. Achievement Bonuses:**
- First review given: +2 points
- 10 reviews given: +3 points
- 50 reviews given: +10 points
- 5-star average rating: +5 points monthly
   
**3. Streak Bonuses:**
- Review 3 days in a row: +2 points
- Review 7 days in a row: +5 points
   
**4. Quality Bonuses:**
- Receive 5-star review: Reviewer gets +1 bonus
- Give 5-star rated review: +1 bonus point
   
**5. Time-Based Promotions:**
- Weekend warrior: 2x points Sat-Sun
- Holiday bonus: "Everyone gets +10 points!"
- Launch week: "First 100 users get +5 bonus points"

---

### Paid Methods (Future Monetization)

**Point Packages (When Ready):**
```
Starter Pack: 50 points for $9.99
Power Pack: 200 points for $29.99
Pro Pack: 500 points for $59.99
```

**Premium Point Sinks (Examples):**
```
Priority Review: 10 points
  (Your project moves up 25% in queue)

Expert Review: 20 points
  (Reviewed by 5-star rated reviewers only)

Featured Project: 50 points
  (Highlighted to all active reviewers)
```

---

## Red Flags to Watch For

### Week 1-2 (Critical Period)
- [ ] <50% of users gave at least 1 review
- [ ] Queue wait time >24 hours
- [ ] <20% daily active rate
- [ ] >30% of users churned (never returned)

**If ANY red flag:** Emergency point injection + personal outreach

### Month 1
- [ ] New signups <3 per day
- [ ] Total points declining >20 per day
- [ ] Queue frequently empty or >100 projects
- [ ] Average review rating <3.5 stars

**If 2+ red flags:** Major strategy revision needed

### Month 3
- [ ] Not at 200+ total users
- [ ] Not at 40+ daily active users
- [ ] Can't sustain chosen ratio without constant injection
- [ ] >20% churn rate

**If ANY red flag:** Consider pivot or major feature additions

---

## Success Milestones

### Week 4 (Validate)
- ✓ 100+ total users
- ✓ 50+ active weekly reviewers
- ✓ <24 hour average wait time
- ✓ >3.8 average review rating
- ✓ Point economy stable (not collapsing)

### Month 3 (Growth)
- ✓ 250+ total users
- ✓ Organic signups 5+ per day
- ✓ <5% complaint rate
- ✓ Sustainable ratio (1:1 or 1.5:1) established

### Month 6 (Scale)
- ✓ 500+ total users
- ✓ Can test 2:1 ratio (if viral growth achieved)
- ✓ <10% churn rate
- ✓ Community self-sustaining (less admin intervention)

---

## Common Mistakes to Avoid

### ❌ Starting Too Conservative
- 2 points signup, 2:1 ratio, no bonuses
- Result: Points burn too fast, users frustrated
- Fix: Start generous, dial back later

### ❌ Not Injecting Points When Needed
- "Let the market balance itself"
- Result: Platform dies from point starvation
- Fix: Actively manage point supply

### ❌ Ignoring Queue Wait Times
- "It's only 30 hours, not that bad"
- Result: New users churn immediately
- Fix: <24 hours non-negotiable

### ❌ Over-Optimizing Too Early
- Changing ratio weekly, constant adjustments
- Result: User confusion, platform instability
- Fix: Pick settings, let run 2-4 weeks, then adjust

### ❌ Allowing Queue Spam
- No limit on active projects per user
- Result: Power users dominate queue with duplicates
- Fix: 1 active project limit for all users initially

---

## The ONE Thing to Remember

**Point scarcity is GOOD.**

When points are scarce:
- They're valuable ✓
- Users willing to pay (eventually) ✓
- High engagement ✓
- Reviews happening ✓

When points are abundant:
- They're worthless ✗
- Nobody pays ✗
- Low engagement ✗
- Platform dies ✗

**You WANT to be injecting points regularly.**
It means your platform is working.

---

## Decision Framework (Simple)

Every week, ask yourself:

**1. Are reviews happening?**
- Yes → Platform working, continue
- No → Emergency: Inject points, recruit users

**2. Is queue moving?**
- Yes, <24hrs → Healthy
- No, >36hrs → Bonus points for reviewers

**3. Are points burning or accumulating?**
- Burning → Good, inject as needed
- Accumulating → Bad, add sinks or recruit projects

**4. Are users happy?**
- Yes, >3.8 rating → Continue
- No, <3.5 rating → Quality crisis, fix reviews

If answers to 1, 2, 4 are YES, you're winning.
Point burning fast? Inject and monetize.
That's the entire playbook.

---

## Future Growth Opportunities

### Multiple Projects Feature (Premium Tier Opportunity)

**The Concept:**
Allow users to have multiple projects in the queue simultaneously, potentially as a premium feature or account upgrade.

**Current Design (Launch):**
- All users: 1 active project at a time
- Must wait for project to complete before submitting another
- Prevents spam and duplicate submissions
- Keeps system simple

**Future Premium Tier:**
```
Free Tier:
- 1 active project at a time
- Standard features

Pro Tier ($19/mo - Future):
- 3 active projects simultaneously
- Faster point burn (3x)
- Additional features

Business Tier ($49/mo - Future):
- Unlimited active projects
- Team features
- Priority support
```

**Why This Works:**

**Solves Point Accumulation:**
```
Power user with 20 points:

Current (1 project):
- Submit → Review → Requeue → Review → Requeue
- Uses 6 points over time
- Still has 14 points sitting

Future (3 projects):
- Submit 3 different projects
- Each gets reviewed
- Burns 6 points immediately
- Much faster point consumption
```

**Creates Upgrade Path:**
- Users with many points feel limited
- "I have 30 points but can only use them slowly"
- Natural upgrade incentive
- Revenue opportunity

**Serves Real Use Cases:**
- Agency testing multiple client projects
- Entrepreneur testing different ideas
- Developer testing various features
- Power users who review a lot

**Implementation Notes:**
- Still requires points (no free spam)
- Each project queues independently (FIFO maintained)
- Prevents abuse while adding value
- Simple upgrade path when ready

**When to Consider:**
- After 3-6 months of stable operation
- When you have proven monetization need
- When power users are hitting the 1-project limit
- When point accumulation becomes persistent issue

**Don't Rush This:**
- Launch with 1 project limit for everyone
- Build healthy community first
- Add complexity only when needed
- Let organic growth prove the need

---

### Other Future Monetization Ideas

**Point Packages:**
- Direct purchase of points
- Bundles with discounts
- Subscription point allowances

**Premium Features:**
- Priority queue placement
- Expert reviewer matching
- Advanced analytics on feedback
- Team collaboration tools

**API Access:**
- Allow tools to integrate
- Automated feedback collection
- Bulk operations for agencies

**White Label:**
- Companies run internal version
- Corporate feedback programs
- Education institution use

**None of these are needed at launch.**
Focus on core loop first.
Add monetization when you have proven value.

---

## Launch Checklist

**Before Day 1:**
- [ ] Set signup bonus: 3-4 points
- [ ] Set ratio: 1:1
- [ ] Set project limit: 1 active per user
- [ ] Set auto-requeue limit: 3 times
- [ ] Prepare referral bonus: +5 points
- [ ] Prepare first review bonus: +2 points
- [ ] Have 50-75 committed beta users ready
- [ ] Admin dashboard shows key metrics
- [ ] Can manually inject points if needed

**Week 1 Monitoring:**
- [ ] Check queue wait times daily
- [ ] Monitor point economy (burn rate)
- [ ] Track active user %
- [ ] Read user feedback
- [ ] Be ready to inject points
- [ ] Personal outreach to inactive users

**Month 1 Adjustments:**
- [ ] Review all metrics weekly
- [ ] Adjust bonuses if needed
- [ ] Test weekend promotions
- [ ] Consider ratio adjustment (if data supports)
- [ ] Document what's working

**The goal is simple:**
Keep reviews happening, queue moving, users happy.
Everything else is secondary.