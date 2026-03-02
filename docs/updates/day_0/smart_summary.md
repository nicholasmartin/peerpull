### Summary of Peerpool Build Story

**Peerpool** is a nascent exchange platform designed for builders, where users **exchange feedback on projects via peer reviews**. The core mechanic is simple and reciprocal: **give one review, get one review back**. The platform is currently in a rudimentary state but functional enough to demonstrate its foundational concepts.

---

### Key Features and Current Status

- **Basic Functionality**:
  - Users can **sign up and sign in** on a simple landing page.
  - Submission of projects for review is enabled, although presently limited to one active submission per user.
  - Projects enter a **FIFO queue system** awaiting peer reviews.
  - Reviewers do not know whose project they will review beforehand, ensuring impartiality.
  
- **Review Process**:
  - Reviews are done via **think-aloud recordings**, capturing audio and screen directly in the browser.
  - The review is submitted as a video to the project owner.
  - Points, called **Peer Points**, are earned by participating (e.g., submitting reviews, referring users).
  - Points can be redeemed to receive feedback on one’s own projects.

- **User Interface**:
  - The platform currently has a **very simple and rough UI**, with plans for redesign and improved usability.
  - Backend and admin interfaces are operational but basic, enabling platform oversight and management.

- **Community and Profile Development**:
  - Profiles will become central, reflecting users’ **review quality and reliability**.
  - Users can **rate received reviews** to help identify and mitigate poor or fraudulent feedback.
  - The system aims to discourage gaming or low-quality contributions by penalizing offenders (e.g., warnings, temporary suspension).
  
- **Admin and Platform Controls**:
  - Admin section allows monitoring of overall platform health.
  - Settings include:
    - Exchange ratios (initially two reviews given for one received).
    - Queue and review settings such as video length limits (currently 5 seconds minimum to 5 minutes maximum).
  - Plans to automate **supply-demand matching** to balance reviewers and projects.

---

### Challenges and Future Plans

- The platform is currently **untested at scale**, with potential leaks and edge cases unaddressed.
- There is a need to **build up a waiting list** to overcome the chicken-and-egg problem of marketplace liquidity (simultaneous supply of reviewers and projects).
- Planned enhancements include:
  - More polished UI/UX.
  - Stronger community features.
  - Robust user profiles incorporating feedback quality metrics.
  - Automated moderation and fraud prevention.
  - Better queue and point system management.

---

### Timeline of Development (Hackathon Focus)

| Phase                         | Description                                                         | Status           |
|-------------------------------|---------------------------------------------------------------------|------------------|
| Initial Setup                 | Simple landing page with sign-up/sign-in and project submission    | Completed        |
| Core Mechanics Implementation | Queue system, review submission via browser audio/video recording  | Functional       |
| Peer Points System            | Referral points and milestone rewards                              | Partially in place|
| Review Viewing               | Owners can view video feedback on their projects                    | Functional       |
| Admin Dashboard              | Basic overview of platform activity                                 | Implemented      |
| Planned Improvements         | Waiting list, better UI, community features, profile ratings       | Planned          |
| Testing and Scaling          | User testing, bug fixing, simulations of supply-demand balance     | Pending          |

---

### Core Concepts and Definitions

| Term           | Definition                                                                                          |
|----------------|---------------------------------------------------------------------------------------------------|
| Peerpool       | Exchange platform for builders to give and receive project reviews                                 |
| Peer Points    | Internal currency earned by reviewing and referring, redeemable for receiving feedback            |
| FIFO Queue     | First-In-First-Out system that matches projects needing review with reviewers                      |
| Think-Aloud Review | Review method involving simultaneous screen and audio recording to provide feedback               |
| Exchange Ratio | Ratio of reviews given to reviews received (currently 2:1, adjustable by admin)                     |

---

### Key Insights

- **Peerpool emphasizes reciprocity and quality in peer feedback**, fostering a supportive builder community.
- The use of **audio-video think-aloud reviews** is innovative, aiming to provide rich, contextual feedback.
- **Community moderation and profile-based reputation systems** are planned to ensure review quality and discourage abuse.
- The platform is still **in a prototype stage**, with significant development required to reach a polished, scalable product.
- Addressing the **marketplace liquidity problem** is critical for launch success, with a waiting list strategy in place.

---

This summary reflects the current state and vision of Peerpool as presented, highlighting its unique peer exchange model and ongoing development efforts within a hackathon context.