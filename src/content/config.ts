import { defineCollection, z } from 'astro:content';

// ---------------------------------------------------------------------------
// Content schemas are the SAFETY NET for non-technical organizer edits.
// Astro validates every Markdown/YAML file against these Zod schemas at build
// time. A malformed edit fails the build (and, thanks to the safe-deploy
// workflow, the LAST GOOD site stays live instead of breaking).
// The Decap CMS config in /public/admin/config.yml mirrors these fields so the
// editing UI prevents most bad input before it is ever committed.
// ---------------------------------------------------------------------------

const expertiseTags = z.array(z.string()).default([]);

// EVENTS ---------------------------------------------------------------------
// `seatsTaken` is maintained by organizers because Google Forms cannot feed a
// live count into a static build. See docs/ORGANIZER-RUNBOOK.md.
const events = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    date: z.coerce.date(), // stored/edited as IST; rendered as IST + local time
    endDate: z.coerce.date().optional(),
    venue: z.string(),
    type: z.enum(['in-person', 'virtual', 'hybrid']),
    status: z.enum(['upcoming', 'past', 'cancelled']).default('upcoming'),
    banner: z.string().optional(),
    speaker: z.string().optional(), // slug reference into speakers collection
    capacity: z.number().int().nonnegative().optional(),
    seatsTaken: z.number().int().nonnegative().default(0),
    waitlistEnabled: z.boolean().default(false),
    registrationUrl: z.string().url().optional(), // Google Form; absent = "registration not yet open"
    venueChangeBanner: z.string().optional(), // last-minute venue change notice
    summary: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

// SPEAKERS -------------------------------------------------------------------
// `active: false` lets an organizer remove/swap a cancelled speaker without
// deleting history or breaking pages that reference them.
const speakers = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    company: z.string().optional(),
    designation: z.string().optional(),
    photo: z.string().optional(),
    expertise: expertiseTags,
    linkedin: z.string().url().optional(),
    pastSessions: z.array(z.string()).default([]),
    keynote: z.boolean().default(false),
    active: z.boolean().default(true),
  }),
});

// SPONSORS -------------------------------------------------------------------
const sponsors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    tier: z.enum(['platinum', 'gold', 'silver', 'community', 'partner']),
    url: z.string().url().optional(),
    active: z.boolean().default(true),
  }),
});

// BLOG -----------------------------------------------------------------------
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// VOLUNTEER ROLES ------------------------------------------------------------
// `filled` (or capacity reached) hides the sign-up CTA so nobody applies into a
// closed slot.
const volunteer = defineCollection({
  type: 'content',
  schema: z.object({
    role: z.string(),
    capacity: z.number().int().positive().default(1),
    filledCount: z.number().int().nonnegative().default(0),
    filled: z.boolean().default(false),
    signupUrl: z.string().url().optional(),
    summary: z.string().optional(),
  }),
});

// COMMUNITY STORIES ----------------------------------------------------------
// `optInPublished` MUST be true to render. Protects member privacy: never
// auto-publish a photo/story/LinkedIn.
const community = defineCollection({
  type: 'content',
  schema: z.object({
    memberName: z.string(),
    role: z.string().optional(),
    photo: z.string().optional(),
    linkedin: z.string().url().optional(),
    quote: z.string().optional(),
    optInPublished: z.boolean().default(false),
  }),
});

// RESOURCES ------------------------------------------------------------------
// `linkStatus` drives a graceful fallback instead of a dead link.
const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    kind: z.enum(['deck', 'recording', 'tableau-public', 'download', 'link']),
    url: z.string().url().optional(),
    linkStatus: z.enum(['active', 'expired', 'broken']).default('active'),
    category: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { events, speakers, sponsors, blog, volunteer, community, resources };
