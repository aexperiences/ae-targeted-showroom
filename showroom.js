/* ============================================================================
   TARGETED HUB — SHOWROOM ENGINE
   Marketing Agency OS · Powered by Accelerated Experiences LLC

   BROWSER-ONLY SHOWROOM. No backend, no network. Everything lives in this
   browser tab's sessionStorage and resets when the visitor leaves or idles.
   Faithful to real AEHub canon: Founder -> COO -> DH -> AE -> Event Bus ->
   Pacemaker -> Triad (2 opposing lenses + Pacemaker), confidence-gated release,
   LIVE/ESTIMATE/ASSUMPTION source tags, the Fences (drafts only, nothing sent).
   ============================================================================ */
(function (global) {
  "use strict";

  /* ------------------------------------------------------------------ store */
  var KEY = "targeted_showroom_v1";
  var IDLE_MS = 20 * 60 * 1000;         // reset the floor 20 min after they walk away
  var STORE = sessionStorage;           // sessionStorage clears on tab close by design

  function now() { return Date.now(); }
  function read() {
    try { var d = JSON.parse(STORE.getItem(KEY)); return d || null; } catch (e) { return null; }
  }
  function write(d) { d._t = now(); try { STORE.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  function fresh() {
    return {
      _t: now(), started: now(), tier: "multi",
      contacts: SEED.contacts.slice(),
      campaigns: SEED.campaigns.slice(),
      quotes: SEED.quotes.slice(),
      social: SEED.social.slice(),
      research: SEED.research.slice(),
      assets: SEED.assets.slice(),
      team: SEED.team.slice(),
      systems: SEED.systems.slice(),
      matters: SEED.matters.slice(),
      bus: [],                          // event-bus log (this session)
      approvals: SEED.approvals.slice(),// the Approval Desk (Ghost Mode gate)
      seq: 1
    };
  }
  function db() {
    var d = read();
    if (!d) { d = fresh(); write(d); return d; }
    if (now() - (d._t || 0) > IDLE_MS) { d = fresh(); write(d); }  // idle reset
    return d;
  }
  function save(mut) { var d = db(); mut(d); write(d); return d; }
  function resetFloor() { var d = fresh(); write(d); return d; }

  /* --------------------------------------------------------------- seed data */
  var SEED = {
    contacts: [
      { id: "c1", name: "Northline Coffee Co.", contact: "Dana Reyes", stage: "Proposal", value: 14500, industry: "Retail / F&B", owner: "Reed", note: "Rebrand + local paid social. Wants a Q3 launch." },
      { id: "c2", name: "Cedar & Sage Realty", contact: "Marcus Hall", stage: "Discovery", value: 9800, industry: "Real Estate", owner: "Reed", note: "Listing-video engine + monthly retainer." },
      { id: "c3", name: "Vireo Dental Group", contact: "Dr. Amy Cho", stage: "Negotiation", value: 22000, industry: "Healthcare", owner: "Reed", note: "3-location paid + reputation. Legal review on claims." },
      { id: "c4", name: "Pike Street Brewing", contact: "Sam Ortiz", stage: "Won", value: 18600, industry: "Retail / F&B", owner: "Reed", note: "Signed. Kickoff scheduled." },
      { id: "c5", name: "Harborview Fitness", contact: "Lena Park", stage: "Lead", value: 7200, industry: "Fitness", owner: "Reed", note: "Inbound from referral. Needs discovery." },
      { id: "c6", name: "Alto Architecture", contact: "J. Whitfield", stage: "Discovery", value: 16400, industry: "Professional", owner: "Reed", note: "Portfolio site + thought-leadership content." },
      { id: "c7", name: "Meridian Wealth", contact: "T. Osei", stage: "Proposal", value: 27500, industry: "Finance", owner: "Reed", note: "Compliance-heavy. Long sales cycle." },
      { id: "c8", name: "Sunroot Farms", contact: "Bea Klein", stage: "Lead", value: 6100, industry: "Ag / DTC", owner: "Reed", note: "DTC email + seasonal campaigns." }
    ],
    campaigns: [
      { id: "m1", name: "Northline — Grand Reopen", channel: "Paid Social", status: "Live", audience: 42000, sent: 42000, opens: 0, clicks: 1840, spend: 3200, conv: 96 },
      { id: "m2", name: "Pike St — Summer Series", channel: "Email", status: "Live", audience: 11800, sent: 11800, opens: 4956, clicks: 892, spend: 0, conv: 61 },
      { id: "m3", name: "Vireo — New Patient Q3", channel: "Search", status: "Draft", audience: 0, sent: 0, opens: 0, clicks: 0, spend: 0, conv: 0 },
      { id: "m4", name: "Harborview — Jan Challenge", channel: "Email", status: "Scheduled", audience: 8400, sent: 0, opens: 0, clicks: 0, spend: 0, conv: 0 }
    ],
    quotes: [
      { id: "q1", client: "Northline Coffee Co.", scope: "Rebrand + 90-day paid social", costs: 2600, pay: 3200, gpm: 67, actualCost: 2740, actualCollect: 14500, price: 17575 },
      { id: "q2", client: "Cedar & Sage Realty", scope: "Listing-video engine (monthly)", costs: 900, pay: 1100, gpm: 62, actualCost: 0, actualCollect: 0, price: 5263 }
    ],
    social: [
      { id: "s1", brand: "Pike St Brewing", copy: "New pour drops Friday. Tag who you're bringing 🍺", channel: "Instagram", state: "Posted", when: "Yesterday" },
      { id: "s2", brand: "Northline Coffee", copy: "Reopening week — first 50 cups on the house.", channel: "Instagram", state: "Approved", when: "Tomorrow 8:00a" },
      { id: "s3", brand: "Harborview Fitness", copy: "21-day reset starts Jan 6. Doors open Monday.", channel: "Facebook", state: "Draft", when: "—" },
      { id: "s4", brand: "Sunroot Farms", copy: "CSA boxes back in stock. Spring share is open.", channel: "Email", state: "Draft", when: "—" }
    ],
    research: [
      { id: "r1", topic: "Local coffee — reopening playbooks", tag: "LIVE", note: "3 comparable relaunches averaged 22% first-month lift with a free-cup hook + geo-fenced paid.", conf: 74 },
      { id: "r2", topic: "Dental paid — claim compliance", tag: "ASSUMPTION", note: "State board restricts superlative claims; creative must route through legal before publish.", conf: 55 },
      { id: "r3", topic: "Realty video cadence", tag: "ESTIMATE", note: "Weekly listing reels outperform monthly by ~1.6x on saves in comparable markets.", conf: 63 }
    ],
    assets: [
      { id: "a1", client: "Northline Coffee", kind: "Brand board", state: "In review", by: "Iris" },
      { id: "a2", client: "Pike St Brewing", kind: "Summer key art", state: "Approved", by: "Cade" },
      { id: "a3", client: "Vireo Dental", kind: "Landing hero", state: "Draft", by: "Iris" }
    ],
    /* The Approval Desk is meant to be nearly empty — full autonomy is the goal.
       Only real FENCES land here (send to a real person, spend, publish, pricing). */
    approvals: [
      { id: "ap1", kind: "external", title: "Email blast — Vireo New Patient Q3", by: "Reed (New Business AE)",
        summary: "Send the Q3 new-patient email to 3 Vireo locations (~2,400 contacts).", state: "Pending", why: "Reaches real people outside the company." },
      { id: "ap2", kind: "pricing", title: "Retainer pricing — Cedar & Sage Realty", by: "Pitch (Sales Pacemaker)",
        summary: "Set the listing-video retainer at $2,450/mo. Pacemaker cleared the fit; price is a fence.", state: "Pending", why: "Setting live pricing is the founder's call." },
      { id: "ap3", kind: "appointment", title: "Demo booked — Harborview Fitness", by: "Reed (New Business AE)",
        summary: "Sales set a live demo for Thu 2:00p. It's on the calendar — needs a human to run it.", state: "Pending", why: "Booked for a human to take; the org sets it, a person shows up." }
    ],
    /* HR / People Ops — the team, incl. a HUMAN hire on the sales desk (mirrors Barry as
       the real org's first human-run department seat). AI seats + human seats, side by side. */
    team: [
      { id: "t1", name: "Jordan Vela", role: "Sales Director (New Business)", type: "Human", status: "Onboarding", dept: "New Business", paper: "Contractor agreement + W-9 pending", note: "First human on the sales team — deploys demos, sets appointments, runs them." },
      { id: "t2", name: "Ivy", role: "Chief Operating Officer", type: "AI · DeepSeek", status: "Active", dept: "Command", paper: "—", note: "The interface machine to the founder." },
      { id: "t3", name: "Juno", role: "Creative Director", type: "AI · DeepSeek", status: "Active", dept: "Creative", paper: "—", note: "Elite art director; owns the studio's quality bar." },
      { id: "t4", name: "Sam Okafor", role: "Account Manager", type: "Human", status: "Active", dept: "New Business", paper: "On file", note: "Client-facing; runs the book Jordan closes." },
      { id: "t5", name: "Delta", role: "Head of Research", type: "AI · DeepSeek", status: "Active", dept: "Market Research", paper: "—", note: "Owns PURSUE/HOLD/PASS verdicts." },
      { id: "t6", name: "Priya Nair", role: "Social Media Lead", type: "Human", status: "Offboarding", dept: "Social Media", paper: "Final 1099 + access removal", note: "Transitioning out; termination routed to a human, not auto-run." }
    ],
    /* IT · System Health — CLEAR / WATCH / INTERVENE */
    systems: [
      { id: "sy1", name: "Client sites (CDN)", state: "CLEAR", metric: "99.98% uptime · 210ms" },
      { id: "sy2", name: "Campaign delivery", state: "CLEAR", metric: "queue healthy" },
      { id: "sy3", name: "Creative asset store", state: "WATCH", metric: "storage 82% — plan headroom" },
      { id: "sy4", name: "Auth / sessions", state: "CLEAR", metric: "no failed logins" }
    ],
    /* Law · Business Law — advisory only, NOT a lawyer */
    matters: [
      { id: "mt1", title: "Vireo Dental — ad claim review", state: "Open", risk: "High", note: "Board restricts superlative claims; creative must clear before publish." },
      { id: "mt2", title: "Cedar & Sage — retainer MSA", state: "Open", risk: "Medium", note: "Standard services agreement; confirm termination + IP-ownership clauses." },
      { id: "mt3", title: "Meridian Wealth — compliance terms", state: "Open", risk: "High", note: "Finance advertising rules; needs a licensed attorney sign-off." }
    ]
  };

  /* ---------------------------------------------------- tiers (subtract-down) */
  var TIERS = {
    multi:     { key: "multi",     name: "Multi-team",        price: "$2,200/mo · $16k build", rank: 3 },
    agency:    { key: "agency",    name: "Agency",            price: "$950/mo · $6.5k build",  rank: 2 },
    freelance: { key: "freelance", name: "Freelance / Studio", price: "$450/mo · $2.5k build", rank: 1 }
  };

  /* Departments (nav). minRank = lowest tier that still includes this department.
     Showroom shows the FULL Multi-team hub; lowering the tier SUBTRACTS departments. */
  var DEPTS = [
    { group: "Command",     items: [
      { href: "dashboard.html", label: "Command Center", ic: "◎", minRank: 1 }, { href: "calendar.html", label: "Calendar", ic: "▤", minRank: 1 },
      { href: "approvals.html", label: "Approval Desk", ic: "✓", minRank: 1, accent: "ops" }
    ]},
    { group: "New Business", items: [
      { href: "pipeline.html",  label: "CRM · Pipeline",  ic: "◆", minRank: 1, accent: "sales" },
      { href: "estimator.html", label: "Estimating Machine", ic: "∑", minRank: 1, accent: "money" }
    ]},
    { group: "Growth", items: [
      { href: "campaigns.html", label: "Campaigns",       ic: "◈", minRank: 1, accent: "prod" },
      { href: "social.html",    label: "Social Media",    ic: "❋", minRank: 2, accent: "social" },
      { href: "research.html",  label: "Market Research", ic: "◭", minRank: 3, accent: "research" }
    ]},
    { group: "Craft", items: [
      { href: "studio.html",    label: "Creative Studio", ic: "✦", minRank: 1, accent: "creative" },
      { href: "webbuilder.html",label: "Website Builder", ic: "▥", minRank: 1, accent: "creative" }
    ]},
    { group: "Money", items: [
      { href: "books.html",     label: "Books & Margins", ic: "▤", minRank: 2, accent: "money" }
    ]},
    { group: "People", items: [
      { href: "hr.html",        label: "HR · People Ops", ic: "☷", minRank: 2, accent: "ops" },
      { href: "operations.html",label: "Operations",      ic: "⛭", minRank: 3, accent: "ops" }
    ]},
    { group: "Governance", items: [
      { href: "law.html",       label: "Law · Business",  ic: "§", minRank: 3, accent: "research" },
      { href: "it.html",        label: "IT · Health",     ic: "♥", minRank: 2, accent: "prod" }
    ]},
    { group: "The Org", items: [
      { href: "org.html",       label: "Agent Org · Bus", ic: "⇋", minRank: 2, accent: "ops" }
    ]}
  ];

  /* ----------------------------------------------------------- the agent org */
  /* Faithful to AEHub canon: each department is a chain
     DH (owns the "so what") -> AE (packages) -> Event Bus -> Pacemaker (gates on a
     confidence bar; only voice out of the triad) -> two opposing Lenses that never
     confer. COO (Ivy) is the apex; no lateral peer; defers to the Founder. */
  var SEATS = {
    coo: { id: "coo", name: "Ivy", role: "Chief Operating Officer", tier: "COO", dept: "Command",
           color: "var(--brand)", gate: null,
           line: "Apex seat. Makes the ordinary call; defers to Anthony only behind a Fence." },
    depts: [
      { key: "sales", name: "New Business", accent: "sales", gate: 80,
        dh: { name: "Sable", line: "Owns the pipeline's 'so what' — which deals are real." },
        ae: { name: "Reed",  line: "Packages the deal: proposal, scope, next step." },
        pace:{ name: "Pitch", line: "Only voice out of the triad. Passes up at ≥80%, else 'needs a human'." },
        lensA:{ name: "Hunter", line: "Opportunity lens — where's the upside, how fast can we close?" },
        lensB:{ name: "Guard",  line: "Qualification lens — is this real, funded, and a fit?" } },
      { key: "money", name: "Money", accent: "money", gate: 85,
        dh: { name: "Bern", line: "Owns the numbers' integrity — a wrong figure pollutes everything." },
        ae: { name: "Penny",line: "Packages invoices, margins, the collect-vs-quoted view." },
        pace:{ name: "Pace", line: "High bar (85%). A bluffed number is worse than an honest 'unsure'." },
        lensA:{ name: "Ledger",line: "Records lens — what actually cleared, tagged LIVE only." },
        lensB:{ name: "Margin",line: "Profit lens — does this job clear the GPM after real cost?" } },
      { key: "prod", name: "Production", accent: "prod", gate: 80,
        dh: { name: "Mason", line: "Owns delivery — can we actually ship this on time?" },
        ae: { name: "Tess", line: "Packages the build plan, timeline, and handoffs." },
        pace:{ name: "Rhythm", line: "Releases the plan only at ≥80%; below that, holds and asks." },
        lensA:{ name: "Maker", line: "Builder lens — the fastest path that still meets the bar." },
        lensB:{ name: "Breaker",line: "Stress lens — where does this plan fall apart?" } },
      { key: "creative", name: "Creative", accent: "creative", gate: 80,
        dh: { name: "Juno", line: "Creative Director — the taste of the shop; owns the quality bar." },
        ae: { name: "Devi", line: "Turns direction into briefed, scheduled, documented motion." },
        pace:{ name: "Vera", line: "Rules once between the lenses; canon changes always go to Anthony." },
        lensA:{ name: "Iris", line: "Vision lens — the boldest idea that still serves the brief." },
        lensB:{ name: "Cade", line: "Craft lens — is it on-brand, legible, and production-ready?" } },
      { key: "research", name: "Market Research", accent: "research", gate: 80,
        dh: { name: "Delta", line: "Owns the verdict — PURSUE / HOLD / PASS with sources." },
        ae: { name: "Nell", line: "Gathers and packages the evidence; every number tagged." },
        pace:{ name: "Scout", line: "PURSUE needs ≥80% AND live data; estimate-only routes to a human." },
        lensA:{ name: "Signal", line: "Pattern lens — what does the data actually suggest?" },
        lensB:{ name: "Skeptic",line: "Rigor lens — 'is this sourced, or are we hoping?'" } },
      { key: "social", name: "Social Media", accent: "social", gate: 80,
        dh: { name: "Blaze", line: "Owns the calendar and each brand's voice in public." },
        ae: { name: "Remi", line: "Packages the queue: draft → approved → scheduled." },
        pace:{ name: "Tempo", line: "Releases a post at ≥80%; brand-risk copy holds for a human." },
        lensA:{ name: "Reach", line: "Growth lens — what earns attention and shares?" },
        lensB:{ name: "Keeper",line: "Brand-safety lens — does this protect the client's name?" } },
      { key: "hr", name: "HR · People Ops", accent: "ops", gate: 80,
        dh: { name: "Hollis", line: "Owns hiring, onboarding, and terminations — the team's health." },
        ae: { name: "Pam", line: "Packages offers, checklists, and the paperwork map (W-9/1099 vs W-4/W-2)." },
        pace:{ name: "Harmony", line: "Releases people decisions at ≥80%; a termination always routes to a human." },
        lensA:{ name: "Grow", line: "Talent lens — who do we need and how fast can they be productive?" },
        lensB:{ name: "Guardrail", line: "Compliance lens — is this by the book and defensible?" } },
      { key: "it", name: "IT · System Health", accent: "prod", gate: 80,
        dh: { name: "Sable-IT", line: "Owns uptime — the health of the whole system. CLEAR / WATCH / INTERVENE." },
        ae: { name: "Bit", line: "Packages incident notes, status, and the watch list." },
        pace:{ name: "Pulse", line: "Calls system health; an INTERVENE (real outage/security) escalates to a human." },
        lensA:{ name: "Uptime", line: "Availability lens — is everything reachable and fast?" },
        lensB:{ name: "Breach", line: "Risk lens — where's the exposure, what could go down?" } },
      { key: "law", name: "Law · Business Law", accent: "research", gate: 85,
        dh: { name: "Counsel", line: "Owns the legal read — contracts, claims, compliance. NOT a lawyer; advisory only." },
        ae: { name: "Docket", line: "Packages the matter, the risk, and the sources; flags what needs a real attorney." },
        pace:{ name: "Verity", line: "High bar (85%). Anything with real legal exposure routes to a human attorney." },
        lensA:{ name: "Clause", line: "Enablement lens — how do we get to yes cleanly?" },
        lensB:{ name: "Liability", line: "Exposure lens — what claim or rule could bite us here?" } },
      { key: "ops", name: "Operations", accent: "ops", gate: 80,
        dh: { name: "Anchor", line: "Owns the desk that keeps it all running — the connective tissue between departments." },
        ae: { name: "Dewey", line: "Owns the filing cabinet and the follow-up calendar for the whole shop." },
        pace:{ name: "Cadence", line: "Releases at ≥80%; a cross-department conflict escalates to the COO." },
        lensA:{ name: "Order", line: "Process lens — what's the cleanest, repeatable way to run this?" },
        lensB:{ name: "Flow", line: "Throughput lens — where's the bottleneck slowing the whole shop?" } }
    ]
  };

  /* ----------------------------------------------- deterministic marketing brain
     No LLM in the browser. This engine routes a question DOWN the chain and returns
     a real Output Contract (stance + confidence + reasons tagged [data]/[assumption]),
     enforcing the department's confidence gate exactly like the real seat runtime:
     below the bar OR estimate-only  ->  "needs a human", routed up to escalation. */
  var BRAIN = {
    sales: {
      match: ["deal","pipeline","close","proposal","quote","prospect","lead","discount","price","win"],
      build: function (d, q) {
        var open = d.contacts.filter(function (c){ return ["Proposal","Negotiation"].indexOf(c.stage)>=0; });
        var val = open.reduce(function (s,c){ return s + c.value; }, 0);
        var conf = open.length >= 2 ? 82 : 68;
        return {
          stance: open.length ? ("Push the "+open.length+" late-stage deals ($"+val.toLocaleString()+") to signature this week before chasing new leads.")
                              : "Pipeline is early-stage — fill discovery before forecasting.",
          conf: conf,
          reasons: [
            { t:"data", s: open.length+" deals sit in Proposal/Negotiation worth $"+val.toLocaleString()+" in the CRM right now." },
            { t:"data", s: "Won this quarter: Pike Street Brewing ($18,600) — the reopening motion is repeatable." },
            { t:"assumption", s: "Assumes their budgets are funded; two are compliance-gated (Vireo, Meridian) and may slip." }
          ]
        };
      }
    },
    money: {
      match: ["margin","gpm","profit","cost","invoice","collect","cash","book","payroll","commission","rate"],
      build: function (d, q) {
        var quoted = d.quotes.reduce(function (s,x){ return s + (x.price||0); }, 0);
        var collected = d.quotes.reduce(function (s,x){ return s + (x.actualCollect||0); }, 0);
        return {
          stance: "Hold the 67% GPM default — the Northline job cleared it on real cost; don't discount to win Meridian.",
          conf: 71,  // below the 85 gate on purpose -> escalates, to demonstrate the bar
          reasons: [
            { t:"data", s: "Quoted book: $"+quoted.toLocaleString()+"; collected to date $"+collected.toLocaleString()+" (Stripe not wired in the showroom)." },
            { t:"data", s: "Northline actual cost $2,740 vs quoted $2,600 — margin held within 5%." },
            { t:"assumption", s: "Meridian's true delivery cost is un-estimated; discounting before scoping risks the bar." }
          ]
        };
      }
    },
    prod: {
      match: ["build","timeline","deliver","ship","launch","scope","capacity","deadline","kickoff"],
      build: function (d, q) {
        return {
          stance: "Sequence Pike St kickoff first (signed), stage Vireo behind legal review — don't start builds you can't publish.",
          conf: 80,
          reasons: [
            { t:"data", s: "Pike Street is Won and scheduled; Vireo is in Negotiation with a legal gate on claims." },
            { t:"data", s: "Two campaigns are Live (Northline, Pike St); one Draft, one Scheduled — capacity is committed." },
            { t:"assumption", s: "Assumes creative approvals land on time; a slip pushes the Vireo launch a week." }
          ]
        };
      }
    },
    creative: {
      match: ["brand","logo","design","creative","art","copy","landing","hero","identity","color","asset"],
      build: function (d, q) {
        var review = d.assets.filter(function (a){ return a.state !== "Approved"; }).length;
        return {
          stance: "Ship Pike St summer key art (approved); hold Northline brand board for one more pass before it goes to paid.",
          conf: 78,
          reasons: [
            { t:"data", s: review+" assets are still pre-approval in the Studio board; 1 (Pike St) is cleared." },
            { t:"assumption", s: "Assumes the client signs off on the Northline palette — brand-canon changes route to the founder." },
            { t:"data", s: "Every mark tested at 60/120px + grayscale per the craft bar before it leaves the desk." }
          ]
        };
      }
    },
    research: {
      match: ["research","market","audience","competitor","trend","insight","segment","study","data"],
      build: function (d, q) {
        var live = d.research.filter(function (r){ return r.tag === "LIVE"; });
        var conf = live.length ? 76 : 58;
        return {
          stance: live.length ? "PURSUE the coffee-reopening play — comparable relaunches back the free-cup + geo-fenced paid motion."
                              : "HOLD — the reads are estimate-only; get live data before committing spend.",
          conf: conf,
          reasons: [
            { t: live.length ? "data":"assumption", s: live.length ? "3 comparable relaunches averaged +22% first-month (logged, tagged LIVE)." : "Reads are ESTIMATE/ASSUMPTION only in the notes." },
            { t:"assumption", s: "Dental claims are board-restricted — creative must clear legal (tagged ASSUMPTION, needs a human)." },
            { t:"data", s: "Realty weekly-reel cadence ~1.6x saves vs monthly (tagged ESTIMATE — caps confidence below the gate)." }
          ]
        };
      }
    },
    social: {
      match: ["post","social","instagram","facebook","caption","content","calendar","engagement","reel","story"],
      build: function (d, q) {
        var q2 = d.social.filter(function (s){ return s.state !== "Posted"; }).length;
        return {
          stance: "Publish the Northline reopening post (approved); keep Harborview + Sunroot in draft until copy clears brand-safety.",
          conf: 81,
          reasons: [
            { t:"data", s: q2+" posts sit in the queue pre-publish; 1 is Approved and scheduled for 8:00a." },
            { t:"data", s: "Pike St 'new pour' post already ran and is the model for the reopening voice." },
            { t:"assumption", s: "Assumes no client embargo on the reopening date — a hold would bump the schedule." }
          ]
        };
      }
    },
    hr: {
      match: ["hire","hiring","onboard","terminate","fire","team","employee","payroll","staff","people","w-9","1099"],
      build: function (d, q) {
        var team = d.team || [];
        var onboarding = team.filter(function(t){ return t.status === "Onboarding"; });
        var humans = team.filter(function(t){ return t.type === "Human"; });
        return {
          stance: onboarding.length ? ("Finish onboarding "+onboarding.map(function(t){return t.name;}).join(", ")+" — get the W-9 + agreement signed before the first commission accrues.")
                                    : "Team is fully onboarded — no open paperwork; next review is the quarterly check-in.",
          conf: 84,
          reasons: [
            { t:"data", s: humans.length+" human seat(s) on the team; "+onboarding.length+" mid-onboarding in the roster." },
            { t:"data", s: "Contractor path = W-9 now, 1099-NEC once paid $600+ in the year (per the money-spine HR map)." },
            { t:"assumption", s: "A termination is never auto-run — it always routes to a human. Flagged, not executed." }
          ]
        };
      }
    },
    it: {
      match: ["system","health","uptime","down","outage","security","breach","status","incident","it","performance","slow"],
      build: function (d, q) {
        var sys = d.systems || [];
        var watch = sys.filter(function(s){ return s.state !== "CLEAR"; });
        var pass = watch.length === 0;
        return {
          stance: pass ? "System is CLEAR — all services reachable, no open incidents. Hold the watch."
                       : ("WATCH: "+watch.map(function(s){return s.name;}).join(", ")+" — monitoring; nothing yet requires a human INTERVENE."),
          conf: pass ? 88 : 72,
          reasons: [
            { t:"data", s: sys.length+" services monitored; "+watch.length+" on WATCH, 0 on INTERVENE right now." },
            { t:"data", s: "Health model is CLEAR / WATCH / INTERVENE — only a real outage or security event escalates to a human." },
            { t:"assumption", s: "Assumes the showroom's checks reflect production; a true INTERVENE would page a person immediately." }
          ]
        };
      }
    },
    law: {
      match: ["contract","legal","law","compliance","claim","liability","terms","agreement","risk","regulation","nda"],
      build: function (d, q) {
        var m = d.matters || [];
        var open = m.filter(function(x){ return x.state === "Open"; });
        return {
          stance: "HOLD anything with real exposure for a licensed attorney — flag the Vireo claims language and the Meridian compliance terms before they publish.",
          conf: 66, // below the 85 bar on purpose — legal caution, not a lawyer
          reasons: [
            { t:"data", s: open.length+" open matter(s) in the docket; claims + compliance are the live flags." },
            { t:"assumption", s: "This is an advisory read, NOT legal advice — a real attorney owns the sign-off (routes to a human)." },
            { t:"assumption", s: "Superlative/efficacy claims (dental, finance) are board/regulator-restricted — caps confidence below the bar." }
          ]
        };
      }
    },
    ops: {
      match: ["operations","process","bottleneck","throughput","workflow","coordinate","calendar","follow","running","handoff"],
      build: function (d, q) {
        return {
          stance: "Tighten the handoff between Creative and Social — approved key art is the bottleneck holding two brands' calendars.",
          conf: 80,
          reasons: [
            { t:"data", s: "Assets pre-approval in the Studio board are gating the Social queue for Northline + Harborview." },
            { t:"data", s: "Every released conclusion is filed and gets a calendar follow-up — nothing drops silently." },
            { t:"assumption", s: "Assumes current staffing; a spike in new business would need a capacity review first." }
          ]
        };
      }
    }
  };

  /* Run the org: route a question to a department, deliberate through the triad,
     gate on the Pacemaker's confidence bar, and log every hop to the Event Bus. */
  function consult(deptKey, question) {
    var d = db();
    var dept = SEATS.depts.filter(function (x){ return x.key === deptKey; })[0];
    var brain = BRAIN[deptKey];
    if (!dept || !brain) return null;
    var verdict = brain.build(d, question || "");
    var passed = verdict.conf >= dept.gate;

    var topic = dept.key;
    var stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    // Every seat is CALLED TO THE SSOT and reads it before acting (real seat.mjs law:
    // load the ONE Source of Truth first; missing/unreadable -> STOP + honest alert).
    var events = [
      { topic: topic+".sot.read", kind:"route", from: dept.dh.name, to: "Filing · SSOT",
        body: dept.dh.name+" is called to the Source of Truth and reads it before acting. SSOT loaded ✓ — canon, fences, and this client's brief in hand.", stamp: stamp },
      // Founder -> COO -> DH -> Administrative Executive: the ask is packaged and routed DOWN the bus to the triad.
      { topic: topic+".ae.packaged", kind:"route", from: dept.ae.name, to: dept.pace.name,
        body: dept.ae.name+" (Administrative Executive) packages the ask, files it, and routes it down the bus to the triad: \""+ (question||"(department review)") +"\"", stamp: stamp },
      { topic: topic+".triad.finding", kind:"deliberate", from: dept.lensA.name, to: dept.pace.name,
        body: "["+dept.lensA.name+"] "+ lensTake(dept.lensA.name, verdict, "A"), stamp: stamp },
      { topic: topic+".triad.finding", kind:"deliberate", from: dept.lensB.name, to: dept.pace.name,
        body: "["+dept.lensB.name+"] "+ lensTake(dept.lensB.name, verdict, "B"), stamp: stamp }
    ];
    // Lateral coordination: Administrative Executives talk ONLY to the same position in
    // another department (AE <-> AE) to handle the desk work between teams. Canon: lateral
    // is same-position only; cross-position routes through the chain, never directly.
    var COORD = {
      sales:    { to:"money",    why:"confirm the quoted margin holds before the proposal goes out" },
      money:    { to:"sales",    why:"flag which deals are actually funded before they're booked" },
      prod:     { to:"creative", why:"line up asset delivery dates against the build timeline" },
      creative: { to:"social",   why:"hand the approved key art to the content calendar" },
      research: { to:"sales",    why:"pass the audience read to whoever owns the pitch" },
      social:   { to:"creative", why:"pull the approved brand assets before anything is scheduled" }
    };
    var co = COORD[dept.key];
    if (co) {
      var peer = SEATS.depts.filter(function (x){ return x.key === co.to; })[0];
      if (peer) events.push({ topic: topic+".ae.lateral", kind:"route", from: dept.ae.name, to: peer.ae.name+" ("+peer.name+" AE)",
        body: dept.ae.name+" coordinates laterally with "+peer.ae.name+" to "+co.why+" — AE↔AE, same position, no chain needed.", stamp: stamp });
    }
    if (passed) {
      // Pacemaker is the ONLY voice out of the triad. Releases up the bus to the Administrative Executive, who FILES it.
      events.push({ topic: topic+".pacemaker.released", kind:"conclude", from: dept.pace.name, to: dept.ae.name,
        body: verdict.stance, conclusion: true, verdict: verdict, gate: dept.gate, stamp: stamp });
      events.push({ topic: topic+".ae.filed", kind:"route", from: dept.ae.name, to: dept.dh.name,
        body: dept.ae.name+" files the released conclusion to the cabinet and sets a follow-up on the calendar, then hands it to "+dept.dh.name+".", stamp: stamp });
      // DH carries the "so what" to the COO — the AI interface between the department heads and the founder.
      events.push({ topic: "coo.decision", kind:"route", from: dept.dh.name, to: SEATS.coo.name+" (COO)",
        body: dept.dh.name+" carries it up to "+SEATS.coo.name+", the interface to Anthony: cleared the "+dept.gate+"% bar.", stamp: stamp });
    } else {
      events.push({ topic: "escalation.below_bar", kind:"reject", from: dept.pace.name, to: SEATS.coo.name+" → Anthony (Founder)",
        body: "Held below the "+dept.gate+"% bar ("+verdict.conf+"%). Needs a human — not enough live data. "+dept.ae.name+" files the hold; "+SEATS.coo.name+" routes it to the founder with reasons attached.",
        conclusion: true, verdict: verdict, gate: dept.gate, escalate: true, stamp: stamp });
    }
    save(function (x){
      events.forEach(function (e){ e.id = "e"+(x.seq++); e.dept = dept.key; x.bus.push(e); });
      if (x.bus.length > 60) x.bus = x.bus.slice(-60);
    });
    return { dept: dept, verdict: verdict, passed: passed, events: events };
  }
  /* ---- The Interface: Ivy (COO) as a machine of her own ----
     She does NOT do the department work. She is the single gate between the
     department heads and Anthony: she reads the ask, routes it to the right
     department, lets that department's chain do the work under its own bar,
     then PACKAGES one clean answer up to the founder and keeps everyone on track. */
  function routeDept(question) {
    var q = String(question || "").toLowerCase();
    var best = null, bestScore = 0;
    Object.keys(BRAIN).forEach(function (k) {
      var score = BRAIN[k].match.reduce(function (s, w) { return s + (q.indexOf(w) >= 0 ? 1 : 0); }, 0);
      if (score > bestScore) { bestScore = score; best = k; }
    });
    return best || "sales"; // default to New Business when intent is unclear
  }
  function askIvy(question) {
    var deptKey = routeDept(question);
    var dept = SEATS.depts.filter(function (x){ return x.key === deptKey; })[0];
    var stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    // Ivy logs that she received it and is routing DOWN (tasking) — she gates, she doesn't do.
    save(function (x){
      x.bus.push({ id:"e"+(x.seq++), dept:"coo", topic:"coo.route", kind:"route",
        from: SEATS.coo.name+" (COO)", to: dept.dh.name+" ("+dept.name+")",
        body: SEATS.coo.name+" takes the ask off Anthony's desk and routes it to "+dept.name+" — she gates and packages, she doesn't do the work herself.",
        stamp: stamp });
    });
    var r = consult(deptKey, question);
    // Ivy packages ONE clean answer back up to the founder.
    var packaged = r.passed
      ? (SEATS.coo.name+": On track. "+dept.name+" cleared its "+dept.gate+"% bar — I'm releasing this to you. "+r.verdict.stance)
      : (SEATS.coo.name+": Holding this off your desk. "+dept.name+" came in at "+r.verdict.conf+"%, under its "+dept.gate+"% bar — it needs a human. Here's what I have so far, and I've set a follow-up. "+r.verdict.stance);
    return { deptKey: deptKey, dept: dept, result: r, packaged: packaged, on_track: r.passed };
  }

  function lensTake(name, v, which) {
    var pro = v.reasons.filter(function (r){ return r.t==="data"; })[0];
    var con = v.reasons.filter(function (r){ return r.t==="assumption"; })[0];
    if (which === "A") return "Argues FOR: " + (pro ? pro.s : "the upside is real and repeatable.");
    return "Pushes back: " + (con ? con.s : "the evidence isn't fully sourced yet.");
  }

  /* ----------------------------------------------------------- approval desk
     Ghost Mode gate. Goal: keep it nearly EMPTY — the org clears everything it
     honestly can; only true fences (send/spend/publish/pricing/appointment) land
     here for the founder. Approving does NOT actually send anything (showroom). */
  function approvals() { return db().approvals || []; }
  function stage(kind, title, summary, why, by) {
    var item = { id: "ap" + now(), kind: kind || "general", title: title || "Untitled",
      summary: summary || "", why: why || "Behind a fence — needs the founder.", by: by || "The org", state: "Pending" };
    save(function (d){ (d.approvals = d.approvals || []).push(item); });
    return item;
  }
  function decideApproval(id, decision) {
    save(function (d){
      (d.approvals || []).forEach(function (a){ if (a.id === id) a.state = decision; });
    });
    return approvals();
  }

  /* ------------------------------------------------------------ money spine */
  // The real AEHub estimator mechanic: price = (costs + your pay) / (1 - gpm/100)
  function priceQuote(costs, pay, gpm) {
    costs = Number(costs)||0; pay = Number(pay)||0; gpm = Number(gpm)||0;
    if (gpm >= 100) gpm = 99;
    var price = (costs + pay) / (1 - gpm/100);
    return Math.round(price);
  }
  function money(n){ return "$" + (Math.round(Number(n)||0)).toLocaleString(); }

  /* ------------------------------------------------------------ UI plumbing */
  function tier() { return db().tier || "multi"; }
  function tierRank() { return TIERS[tier()].rank; }
  function setTier(k) { save(function (d){ d.tier = k; }); if (global.__renderNav) global.__renderNav(); }

  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }

  function renderShell(active) {
    var d = db();
    // sidebar
    var side = document.createElement("aside"); side.className = "sidebar";
    side.appendChild(el(
      '<a href="dashboard.html" class="brand" style="text-decoration:none">' +
      '<div class="tmark art"><img src="https://www.aexperiences.com/Targeted_OS.png" alt="" width="38" height="38"></div>' +
        '<div><div class="bt">Targeted OS</div>' +
      '<div class="bs">Marketing Agency OS &middot; V2.0</div></div></a>'
    ));
    var nav = document.createElement("nav"); nav.className = "nav";
    var rank = tierRank();
    DEPTS.forEach(function (grp) {
      var visible = grp.items.some(function (it){ return true; });
      if (!visible) return;
      nav.appendChild(el('<div class="nav-group">'+grp.group+'</div>'));
      grp.items.forEach(function (it) {
        var locked = it.minRank > rank;
        var a = el('<a href="'+ (locked ? "javascript:void(0)" : it.href) +'" class="'+
          (it.href===active?"active":"")+(locked?" locked":"")+'">'+
          '<span class="ic">'+it.ic+'</span>'+it.label+
          (locked ? '<span class="tier-tag">'+TIERS[tierByRank(it.minRank)].name+'</span>' : '')+'</a>');
        if (locked) a.title = "Available in the "+TIERS[tierByRank(it.minRank)].name+" tier";
        nav.appendChild(a);
      });
    });
    side.appendChild(nav);

    /* --- the way out ------------------------------------------------
       Every showroom needs a door that is not the browser back button.
       This one lands the visitor in the STORE, on this product's own
       pricing sheet, never on the marketing homepage. */
    side.appendChild(el(
      '<div class="sideout">' +
        '<a class="so-main" href="https://www.aexperiences.com/hubs/targeted.html">' +
          '<span><span class="so-k">Targeted OS</span>' +
          '<span class="so-t">See pricing &amp; packages</span></span>' +
          '<span class="so-a">&rarr;</span></a>' +
        '<a class="so-sub" href="https://www.aexperiences.com/shop.html">All Accelerated Experiences products &rarr;</a>' +
      '</div>'));
    return side;
  }
  function tierByRank(r){ for (var k in TIERS) if (TIERS[k].rank===r) return k; return "multi"; }

  function renderTopbar(crumb) {
    var t = TIERS[tier()];
    var bar = document.createElement("div"); bar.className = "topbar";
    bar.innerHTML =
      '<div class="crumbs">Targeted OS · <b>'+crumb+'</b></div>' +
      '<div class="spacer"></div>' +
      '<div class="tierpill" id="tierPill"><span class="dot"></span><div><b>'+t.name+'</b> ' +
        '<span class="price">'+t.price+'</span></div><span class="chev">▾</span></div>' +
      '<div class="who"><div class="av">MA</div><div>Maya Alvarez<br><span class="muted small">Managing Partner</span></div></div>';
    // tier menu
    var menu = document.createElement("div"); menu.className = "tiermenu"; menu.id = "tierMenu";
    Object.keys(TIERS).sort(function(a,b){return TIERS[b].rank-TIERS[a].rank;}).forEach(function (k) {
      var tt = TIERS[k];
      var opt = el('<div class="tieropt '+(k===tier()?"on":"")+'" data-tier="'+k+'">' +
        '<div class="to-top"><span class="to-name">'+tt.name+'</span><span class="to-price">'+tt.price+'</span></div>' +
        '<div class="to-desc">'+tierDesc(k)+'</div></div>');
      opt.addEventListener("click", function () { setTier(k); location.reload(); });
      menu.appendChild(opt);
    });
    setTimeout(function () {
      var pill = document.getElementById("tierPill");
      if (pill) pill.addEventListener("click", function (e) { e.stopPropagation(); menu.classList.toggle("open"); });
      document.addEventListener("click", function () { menu.classList.remove("open"); });
    }, 0);
    var wrap = document.createDocumentFragment(); wrap.appendChild(bar); wrap.appendChild(menu);
    return wrap;
  }
  function tierDesc(k) {
    if (k==="multi") return "The whole shop — every department, the full agent org, books & margins, research.";
    if (k==="agency") return "Take Market Research off; keep social, books & the org. Fits a growing agency.";
    return "Core only — CRM, estimating, campaigns & creative. Research, social, books & org come off.";
  }

  function ribbon() {
    return el('<div class="ribbon"><span class="live">LIVE SHOWROOM</span>' +
      ' — this is the real OS. Everything you type stays in your browser and resets when you leave. ' +
      '<a href="javascript:void(0)" id="resetFloor">Reset the floor</a></div>');
  }
  function footer() {
    return el('<div class="ae-credit">Powered by <b style="color:var(--text-2);margin:0 2px">Accelerated Experiences, LLC</b> · Targeted OS is a white-label build.</div>');
  }

  /* mount: called by every page */
  function mount(opts) {
    opts = opts || {};
    db(); // ensure seeded + idle-checked
    var app = document.createElement("div"); app.className = "app";
    var side = renderShell(opts.active);
    var main = document.createElement("div"); main.className = "main";
    main.appendChild(ribbon());
    main.appendChild(renderTopbar(opts.crumb || "Command Center"));
    var content = document.createElement("div"); content.className = "content"; content.id = "content";
    main.appendChild(content);
    main.appendChild(footer());
    app.appendChild(side); app.appendChild(main);
    document.body.innerHTML = ""; document.body.appendChild(app);
    // toast host + modal host
    document.body.appendChild(el('<div id="toast-wrap"></div>'));
    // reset handler
    setTimeout(function () {
      var r = document.getElementById("resetFloor");
      if (r) r.addEventListener("click", function () { resetFloor(); toast("Showroom reset to a fresh floor.", "ok"); setTimeout(function(){location.reload();}, 500); });
    }, 0);
    global.__renderNav = function () {}; // nav re-render happens on reload
    return content;
  }

  function toast(msg, kind) {
    var w = document.getElementById("toast-wrap"); if (!w) return;
    var t = el('<div class="toast '+(kind||"")+'">'+msg+'</div>');
    w.appendChild(t); setTimeout(function () { t.style.opacity="0"; setTimeout(function(){ t.remove(); }, 250); }, 2600);
  }

  /* keep the floor warm; idle wipe handled in db() on next load */
  document.addEventListener("visibilitychange", function () { if (!document.hidden) db(); });

  /* -------------------------------------------------------------- public API */
  global.Showroom = {
    db: db, save: save, resetFloor: resetFloor, fresh: fresh,
    SEED: SEED, TIERS: TIERS, DEPTS: DEPTS, SEATS: SEATS, BRAIN: BRAIN,
    tier: tier, tierRank: tierRank, setTier: setTier, tierByRank: tierByRank,
    consult: consult, askIvy: askIvy, routeDept: routeDept, priceQuote: priceQuote, money: money,
    approvals: approvals, stage: stage, decideApproval: decideApproval,
    mount: mount, toast: toast, el: el
  };
})(window);

/* ============================================================================
   AE mobile drawer enhancer (Jul 27 2026) — progressive enhancement.
   Injects a hamburger + scrim + toggle so any shell with .app/.sidebar/.topbar
   gets a proper off-canvas drawer on phones instead of a stacked-on-top nav.
   Self-contained; safe to append to any engine. ============================ */
(function(){
  function init(){
    var app=document.querySelector('.app'),
        side=document.querySelector('.sidebar'),
        bar=document.querySelector('.topbar');
    if(!app||!side||!bar) return;
    if(document.getElementById('aeNavToggle')) return;
    var scrim=document.querySelector('.navscrim');
    if(!scrim){ scrim=document.createElement('div'); scrim.className='navscrim'; app.appendChild(scrim); }
    var btn=document.createElement('button');
    btn.id='aeNavToggle'; btn.className='ae-navtoggle'; btn.setAttribute('aria-label','Menu');
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    bar.insertBefore(btn, bar.firstChild);
    btn.addEventListener('click', function(e){ e.stopPropagation(); app.classList.toggle('nav-open'); });
    scrim.addEventListener('click', function(){ app.classList.remove('nav-open'); });
    side.addEventListener('click', function(e){ if(e.target.closest('a')) app.classList.remove('nav-open'); });
  }
  function boot(){ init(); setTimeout(init,150); setTimeout(init,500); setTimeout(init,1200); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
