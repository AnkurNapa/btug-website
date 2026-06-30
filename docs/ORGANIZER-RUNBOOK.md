# BTUG Organizer Runbook

This is the plain-language guide for running the Bengaluru Tableau User Group (BTUG) website. You do **not** need to know how to code to use it. Everything here is done either through the **Content Manager** (the editing screen at the `/admin` address of the site) or through your Google account.

If a step here ever feels scary, stop and ask a maintainer (the person who set up the site). Nothing you do in the Content Manager can take the live site down, because of a built-in safety net: if a saved edit is broken, the website simply keeps showing the last good version instead of breaking. (See "How saving works" below.)

---

## How the site is built (the 60-second version)

- The website is a set of pre-built pages. There is **no live database and no server**. That keeps it fast and cheap, but it means a few things can't update themselves automatically. The most important one: **seat counts do not update on their own** (more on this below).
- You edit content in the **Content Manager** at the site address followed by `/admin` (for example `https://btug.community/admin`). You sign in with the account the maintainer gave you.
- Every time you save in the Content Manager, it records your change and rebuilds the website. A rebuild takes a couple of minutes to appear live.
- **RSVPs, contact messages, sponsor enquiries, and newsletter sign-ups all go through Google Forms**, and the answers land in a **Google Sheet**. The website only shows a button that opens the form; it never sees who signed up.

---

## How saving works (and why you can't break the site)

When you save a change in the Content Manager, the system tries to rebuild the website. There is a safety rule built in: **if the new version fails to build, it is thrown away and the previous good version stays live.** So a typo or a missing field will, at worst, mean "my change didn't appear" — never "the whole site is down."

If you save something and it does not appear after about 5 minutes, it most likely failed the build. Double-check the fields you changed (especially dates and web links), fix the mistake, and save again. If it still won't appear, ask a maintainer to look at the build log.

---

## 1. Adding an event

Events are added in the Content Manager under **Events**.

1. Go to the site address + `/admin` and sign in.
2. Open the **Events** collection and click **New Event** (to start fresh) — or, for a repeating event, see "Recurring events" below.
3. Fill in the fields:

| Field | What to put | Notes |
|---|---|---|
| **Name** | The event title | e.g. "Intro to Tableau — January Meetup" |
| **Date** | Start date **and time** | Enter it in **IST** (India time). The website shows IST to everyone, and also each visitor's own local time automatically. |
| **End date** | Optional end date/time | Only needed for multi-hour or multi-day events. Also in IST. |
| **Venue** | Where it happens | A place name for in-person, or "Online" / the platform name for virtual. |
| **Type** | `in-person`, `virtual`, or `hybrid` | Pick one. |
| **Status** | `upcoming`, `past`, or `cancelled` | Use `upcoming` for anything in the future. See the status guide below. |
| **Banner** | Optional event image | Compress it first — see "Image uploads". |
| **Speaker** | The speaker for this event | This links to a Speaker entry. Add the speaker in the **Speakers** collection first, then pick them here. |
| **Capacity** | Total number of seats | Leave blank if the event has no seat limit (then it always shows "Register" and never "Sold out"). |
| **Seats taken** | How many have RSVP'd so far | Starts at 0. **You update this by hand** as RSVPs come in — see section 2. |
| **Waitlist enabled** | ON or OFF | Controls what happens once seats run out: ON shows "Join waitlist", OFF shows "Sold out". |
| **Registration URL** | The **Google Form link** for RSVPs | Paste the full link to your Google Form. If you leave this blank, the button shows "Registration opens soon" instead. |
| **Venue change banner** | Optional last-minute notice | Use this for "Venue moved to ..." type messages close to the event. |
| **Summary** | Short description | One or two sentences shown on the event card. |
| **Featured** | ON or OFF | ON highlights the event prominently on the site. Use sparingly — usually one event at a time. |

4. Click **Save**. Wait a couple of minutes and check the live site.

### About the Registration URL (the RSVP button)

- Create a Google Form for the event (or copy an existing one).
- Copy its share link and paste it into **Registration URL**.
- The website's "Register" button opens that form. The form's responses go into the linked Google Sheet — that is your RSVP list.

### Recurring events: copy, don't retype

If you run the same kind of event each month, **do not type it all again**. Instead, open a similar past event in the Content Manager, and use the **Duplicate** option to make a copy, then change the name, date, venue, and registration link. This keeps formatting consistent and avoids mistakes. After duplicating, remember to:
- set **Status** back to `upcoming`,
- reset **Seats taken** to `0`,
- paste a **fresh Registration URL** (a new Google Form, or a reused one),
- update **Date** and **End date** to the new IST date/time.

---

## 2. Handling RSVP overflow / updating seats

**This is the most important manual job, so read it carefully.**

Because there is no live server, **Google Forms cannot tell the website how many people have signed up.** The seat count on the website only changes when **you** change it.

The routine is:

1. Open the **Google Sheet** linked to the event's Google Form to see how many RSVPs have arrived.
2. In the Content Manager, open that event and set **Seats taken** to match (or to a slightly conservative number you're comfortable with).
3. Save. The website recalculates "seats remaining" from **Capacity minus Seats taken**.

Do this regularly in the run-up to a popular event — for a fast-filling event, daily is reasonable.

### What visitors see, depending on the settings

The button on each event automatically shows one of these states. You don't set the state directly; it is worked out from the fields you filled in:

| What visitors see | When it happens | Button text |
|---|---|---|
| **Open / Register** | Seats still available (or no capacity set) and a Registration URL is present | "Register" |
| **Join waitlist** | Seats are full **and** Waitlist enabled is ON | "Join waitlist" |
| **Sold out** | Seats are full **and** Waitlist enabled is OFF | "Sold out" |
| **Registration opens soon** | You haven't pasted a Registration URL yet | "Registration opens soon" |
| **Registration closed** | The event's start time has passed | "Registration closed" |
| **Event cancelled** | Status is set to `cancelled` | "Event cancelled" |
| **View recap** | Status is set to `past` | "View recap" |

### When capacity is reached

- Want to keep collecting names for no-shows / a second batch? Turn **Waitlist enabled** ON. The button becomes "Join waitlist" and still opens your Google Form.
- Want to simply close it off? Leave **Waitlist enabled** OFF. The button becomes "Sold out" and is no longer clickable.

### A note on timing

Once the event's **start time** (the Date field) has passed, the website automatically stops RSVPs and shows "Registration closed" — even if a waitlist was on. You don't have to do anything for that; it happens on its own based on the date you entered. (If your group ever wants walk-ins to keep registering during the event, that's a code change a maintainer would make.)

---

## 3. "We've hit Google's free-tier form limits"

Google Forms on a free account can stop accepting responses if a form gets huge, or you may simply want a clean form per event. If responses stop coming in or you hit a cap, you have two fallbacks:

1. **Point the button at an email instead.** Change the relevant form link so the call-to-action sends people to the organizer email (a `mailto:` link) until you sort out a new form. People email their RSVP; you add them to the Sheet manually.
2. **Rotate to a brand-new Google Form.** Create a fresh form (and fresh Sheet), then paste its new link into the site.

**Where to change the form links:**
- For a **single event's RSVP**, change that event's **Registration URL** field (section 1).
- For the **site-wide forms** — Contact, the default RSVP, Sponsor, and Newsletter — these live in the site settings (`site.yaml`) under **forms**. Edit them in the Content Manager's site settings / configuration area. Replace the old link with the new form link and save.

Always test the new link by clicking it on the live site after the rebuild.

---

## 4. Cancelling an event or swapping a speaker

### Cancel an event

1. Open the event in the Content Manager.
2. Set **Status** to `cancelled`.
3. Save.

The site then shows a cancelled banner on that event and removes the registration button automatically. You don't need to delete the event — keeping it with `cancelled` status preserves the record and any links people already shared.

### Swap or remove a speaker (without breaking pages)

Speakers live in the **Speakers** collection. Each speaker has an **Active** switch.

- To **retire / replace** a speaker, open their entry and set **Active** to OFF (rather than deleting them). This removes them from listings but keeps the page from breaking for any event that still references them.
- To put a new speaker on an event, first add the new speaker in **Speakers**, then open the event and change its **Speaker** field to the new person.

Deleting a speaker outright can break an event page that still points to them, so prefer the **Active = OFF** approach.

---

## 5. Removing a member's data (a deletion request)

If a community member asks you to remove their information, you must check **two separate places**, because member data can live in two systems:

**(a) On the website — the Content Manager**
- If they appear in a **Community Story**, open that entry and either delete it or set **Opt-in published** to OFF so it stops showing. (Stories only ever appear when Opt-in published is ON — see Privacy rules.)
- Check **Speakers** too if they were ever listed as a speaker, and remove or de-activate as appropriate.

**(b) In the Google Sheet**
- Open the Google Sheet behind the relevant form (RSVP, contact, newsletter, etc.) and delete their row(s).

### The hard truth about deleted website content

The website's content is stored in a **public Git history**. That history is **permanent and public**: even after you delete something from the live site, the old version can still be found in the history of past changes.

- This is normally **not** a problem, because **member personal data is supposed to live only in Google Sheets, never in the website content.** If you follow the Privacy rules below, there is nothing sensitive in the history to worry about.
- **But if personal data was ever saved into website content and committed** (for example, someone pasted a phone number or a private email into an event or story), then deleting it from the live site is **not enough** — it still exists in the public history. Removing it for good requires a maintainer to do a heavier "history rewrite," which is disruptive and not always fully effective once the data has been public.
- **The only reliable defense is to never put personal data into website content in the first place.** Keep member data in Google Sheets, which are private and can be edited freely.

If you discover that personal data was committed to the site, tell a maintainer immediately so they can assess a history rewrite.

---

## 6. Privacy rules (read once, follow always)

- **Never paste a member's email or phone number** into any website content (events, stories, speakers, resources, blog). The website repository is **public forever**.
- Photos, written stories, and LinkedIn links are **opt-in only.** A Community Story only appears when **Opt-in published** is ON, and you should only turn it on after the member has clearly agreed.
- The same opt-in principle applies to speaker photos and LinkedIn links — only publish what the person agreed to share publicly.
- Personal/contact data belongs in **Google Sheets** (private), not in the website content (public).

---

## 7. Two organizers edited the same thing (a "merge conflict")

The Content Manager uses an editorial workflow that mostly prevents two people from clashing, so this is rare. But if it happens (you'll see an error mentioning a "conflict" when saving):

- **Don't panic and don't keep hitting save.** Note down the change you were trying to make.
- The simplest fix is to let the other person's save win, then re-apply your change on top: reload the Content Manager, open the item again, and re-enter your edit.
- If the screen is stuck or the conflict won't clear, **ask a maintainer.** They can sort it out from the change history without losing anyone's work.
- To avoid this entirely, coordinate with co-organizers so two people aren't editing the same event at the same minute.

---

## 8. Accidental deletion / "undo"

Every change to website content is recorded in the Git history, so **nothing is truly lost** — even a deleted event can be brought back.

- If you (or someone) deleted something by accident, **don't try to recreate it from memory.** Ask a maintainer.
- A maintainer can look at the change history, find the version just before the deletion, and restore it exactly. Tell them roughly **what** was deleted and **roughly when**, which helps them find the right point in the history to restore from.

---

## 9. Image uploads

- **Compress every image to under 500 KB before uploading** (event banners, speaker photos, sponsor logos, blog covers).
- Why: images are stored inside the website repository. Big images make the repository bloat over time, slow down builds, and make the site heavier for people on slower connections (which is a real part of our audience).
- Use any free image compressor (for example, an online "compress JPG/PNG" tool, or export at a smaller size) before uploading. Aim for a width no larger than the space it actually appears in.

---

## 10. Handing off admin access (organizer turnover)

When an organizer leaves or a new one joins, work through this checklist so the site doesn't quietly go stale (or stay tied to someone who has moved on):

- [ ] **GitHub repository access** — add the new organizer as a collaborator (or to the team) on the website repository; remove people who have left.
- [ ] **Content Manager sign-in** — make sure the new organizer can log in to `/admin`. This depends on how login was set up (the maintainer will know whether it's GitHub-based, Netlify Identity, or another provider). Add/remove people accordingly.
- [ ] **Google Forms & Sheets** — transfer ownership (or add as editor) of all the Google Forms and their response Sheets: RSVP forms, Contact, Sponsor, Newsletter. If the departing person owned them on a personal Google account, **move ownership to a shared/community account** so nothing disappears when they leave.
- [ ] **Plausible analytics** — add the new organizer to the analytics account for the site's domain; remove people who left.
- [ ] **Domain / DNS** — confirm who controls the domain registration and DNS, and make sure at least two trusted organizers have access so the site can't go dark over an expired domain.
- [ ] **Social accounts** — hand over LinkedIn and Instagram (and any WhatsApp/Slack/Discord admin rights) logins.

Keep a private list (in a shared community account, not in this public repo) of where each of these lives and who has access.

---

## 11. Checking expiring links (do this monthly)

Some links go stale on their own and need a quick monthly check:

- **Community chat invites** — WhatsApp, Slack, and Discord invite links **expire**. Once a month, click each one to confirm it still works. They live in the site settings (`site.yaml`) under **chatInvites**, with a "last checked" date you should update each time. Edit them in the Content Manager's site settings area.
- **Resource links (recordings, decks, downloads)** — recording and slide links can expire or get taken down. Each item in the **Resources** collection has a **Link status** field: set it to `active`, `expired`, or `broken`. When a link dies, change its status so the site shows a graceful message instead of sending people to a dead link. Update the URL when you have a working replacement.

A simple monthly reminder: open `site.yaml` settings, click every chat invite, then skim the Resources list and fix any dead links.

---

## Quick reference: which field controls what

- **Seats showing wrong number?** → update **Seats taken** on the event (it never auto-updates).
- **Want a waitlist instead of "Sold out"?** → turn **Waitlist enabled** ON.
- **Button says "Registration opens soon"?** → you haven't pasted a **Registration URL** yet.
- **Need to cancel?** → set event **Status** to `cancelled`.
- **Replace a speaker?** → set old speaker **Active** OFF, point event at the new one.
- **Hide a member's story?** → set **Opt-in published** OFF (or delete the story).
- **Form stopped working?** → swap the link in the event's **Registration URL** or in site settings **forms**.
- **Dead recording link?** → set the Resource's **Link status** to `expired`/`broken`.
