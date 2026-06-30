import type { CollectionEntry } from 'astro:content';

export type EventEntry = CollectionEntry<'events'>;

export type RegistrationState =
  | 'not-configured' // no registrationUrl yet → graceful "registration opens soon"
  | 'open' // seats available
  | 'waitlist' // full but waitlist enabled
  | 'full' // full, no waitlist
  | 'started' // event already began → block RSVP
  | 'cancelled'
  | 'past';

/** "now" in a timezone-agnostic instant; comparisons use absolute time. */
export function isStarted(event: EventEntry, now: Date = new Date()): boolean {
  return now.getTime() >= event.data.date.getTime();
}

export function seatsRemaining(event: EventEntry): number | null {
  if (event.data.capacity == null) return null;
  return Math.max(0, event.data.capacity - event.data.seatsTaken);
}

/**
 * Resolve the single registration state a card/page should render.
 * Order matters: cancelled and past override capacity; a started event blocks
 * RSVP even if seats remain (the §5 "RSVP after start" edge case).
 *
 * TODO(you): decide the precedence between `started` and `waitlist`.
 * Right now an event that has STARTED returns 'started' even if a waitlist is
 * open — i.e. we stop all sign-ups once the event begins. Some groups instead
 * keep a waitlist open during the event for walk-ins. Implement the branch
 * below to encode the policy BTUG actually wants.
 */
export function registrationState(
  event: EventEntry,
  now: Date = new Date(),
): RegistrationState {
  const { status, registrationUrl, waitlistEnabled } = event.data;

  if (status === 'cancelled') return 'cancelled';
  if (status === 'past') return 'past';

  // <<< CONTRIBUTION POINT >>>
  // Decide what happens once an upcoming event's start time has passed.
  // Default policy (fill this in): block sign-ups after start.
  if (isStarted(event, now)) {
    // return waitlistEnabled ? 'waitlist' : 'started';  // walk-in policy
    return 'started'; // strict policy (default)
  }

  if (!registrationUrl) return 'not-configured';

  const remaining = seatsRemaining(event);
  if (remaining === null || remaining > 0) return 'open';
  return waitlistEnabled ? 'waitlist' : 'full';
}

export function registrationLabel(state: RegistrationState): string {
  switch (state) {
    case 'open': return 'Register';
    case 'waitlist': return 'Join waitlist';
    case 'full': return 'Sold out';
    case 'started': return 'Registration closed';
    case 'not-configured': return 'Registration opens soon';
    case 'cancelled': return 'Event cancelled';
    case 'past': return 'View recap';
  }
}

/** IST + viewer-local time string. IST is rendered server-side; local time is
 *  resolved client-side via <time data-local>. */
export function formatIST(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date) + ' IST';
}

export function isUpcoming(event: EventEntry, now: Date = new Date()): boolean {
  return event.data.status === 'upcoming' && !isStarted(event, now);
}
