# Expansion checklist

## Full-stack platform pass

- [x] Upgrade the static project to full-stack with backend, database, storage, and user management.
- [x] Define article, category, submission, club event, forum thread, and membership data models.
- [x] Implement sign-in, sign-up, sign-out, and protected routes.
- [x] Build the admin panel for creating, editing, publishing, and unpublishing articles.
- [x] Connect catalogue data to the database and make view counts persistent.
- [x] Connect paper submission, club membership, and forum participation flows.
- [x] Test permissions, empty states, and responsive admin/member views.


## Category-first catalogue pass

- [x] Replace the all-articles first view with subject containers.
- [x] Add broad category containers including philosophy, politics, literature, media, gaming, science, technology, religion, and linguistics.
- [x] Make each category container open a scoped category article view.
- [x] Preserve the catalogue search bar and scope results to the selected category.
- [x] Add back-to-categories navigation and category result states.
- [x] Verify category navigation and responsive layouts, then save a checkpoint.

## Catalogue refinement pass

- [x] Research editorial archive and publication catalogue interaction patterns.
- [x] Add a catalogue search bar with live matching.
- [x] Add category filtering and sort controls.
- [x] Add result count, clear state, and no-results state.
- [x] Refine article cards and discovery hierarchy.
- [x] Verify catalogue interactions on desktop and mobile, then save a checkpoint.

## Frontend completion pass

- [x] Write and add a complete About section covering vision, purpose, editorial promise, and community.
- [x] Add necessary supporting sections and cross-links so the platform feels complete.
- [x] Generate distinct lead images for each catalogue article.
- [x] Redesign catalogue articles into aesthetic image-led container cards.
- [x] Add consistent image metadata, view counts, and category labels to catalogue cards.
- [x] Review responsive behavior and save a new stable checkpoint.

- [x] Refactor the home page so the catalogue grid is replaced by a newly published articles section.
- [x] Add a top-level link/button from home to the dedicated catalogue page.
- [x] Add live view count UI to each article card and article list item.
- [x] Add dedicated catalogue page with category browsing.
- [x] Add Nagaon Debate & Discussion Club page with club sign-in/create-account UI and venue/date update area.
- [x] Add forum page with account-required gate and discussion preview UI.
- [x] Update navigation and routes across all pages.
- [x] Verify responsive layouts, links, and front-end-only auth placeholder interactions.
- [x] Run type check/build, capture previews, and save a checkpoint.

## Required gap closure before delivery

- [x] Wire a real submission form to the submission API and add manuscript/image upload support through storage.
- [x] Replace hardcoded forum previews with persisted thread data and refresh after thread creation.
- [x] Add explicit responsive and state validation for admin, club, forum, and submission flows.
- [x] Expand Vitest coverage for submission validation and forum/member permissions.

## Final validation corrections

- [x] Remove leftover hardcoded forum seed data and show accurate persisted discussion metadata.
- [x] Verify club, forum, admin, and submission unauthorized, success, empty, error, and responsive states explicitly.
- [x] Add Vitest coverage for club membership permission behavior and successful submission/forum contracts.

## Final evidence completion

- [x] Verify /club on mobile and explicitly document unauthorized, success, empty, and error states across club, forum, admin, and submit.
- [x] Add successful submission creation and authenticated forum thread creation contract tests, or document the database limitation if those paths require live seeded data.

## End-to-end UI state evidence

- [x] Exercise the submission page success state and client validation/error state in-browser.
- [x] Exercise the club membership success/error state and account gate in-browser; authenticated success requires a real member session.
- [x] Exercise the forum account gate and empty state in-browser; authenticated success is covered by isolated contract tests because no member session is available.
- [x] Exercise the anonymous admin gate in-browser; authenticated editor validation requires a real admin session and is covered by permission/type tests.
- [x] Record the state evidence and run a final checkpoint validation.
