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

## Launch-readiness audit

- [x] Audit editorial desk create/edit/publish/unpublish flows and identify launch blockers.
- [x] Audit public routes, tRPC requests, database-backed catalogue, submissions, club, forum, and authentication states.
- [x] Replace category imagery with a complete, subject-specific image set and verify all asset paths.
- [x] Fix confirmed runtime, validation, navigation, data, accessibility, and responsive bugs.
- [x] Add regression tests for launch-critical publishing and public flows.
- [x] Run final diagnostics, visual verification, and save a launch-ready checkpoint.

- [x] Make the forum fully working with persisted threads, authenticated posting, reliable refresh, and complete loading/empty/error states.
- [x] Add regression coverage for forum thread listing, creation, validation, and permission behavior.

- [x] Add persisted forum replies so members can discuss inside a thread, not only create top-level topics.
- [x] Add loading/error handling for the admin article list so in-flight queries never look like an empty desk.

## Bug-fix pass: submission and editorial image validation

- [x] Diagnose and fix PDF manuscript upload failure in the contributor submission flow.
- [x] Fix editorial desk new-article `imageUrl` invalid URL validation when the image field is empty or optional.
- [x] Add regression tests for empty image URL article creation and PDF upload validation/encoding.
- [x] Retest submit and editorial desk flows, then save a bug-fix checkpoint.

## Editorial review queue and desk resilience

- [x] Diagnose intermittent admin article-record loading failures and preserve a retryable error state.
- [x] Add admin access to submitted papers with review status and manuscript links.
- [x] Add submission detail/review actions so editors can approve, reject, or convert a submission into a draft article.
- [x] Add a clear desk location and status flow for submitted papers awaiting review.
- [x] Test submission-to-review-to-publish behavior and save a checkpoint.

- [x] Add explicit Approve and Reject controls to the Editorial Desk review queue, wired to submission status updates with feedback.
- [x] Perform a browser-level submission review, draft conversion, and publish verification, then save a final checkpoint.
### End of file

## PDF persistence fix

- [x] Preserve the submitted manuscript URL when a submission is approved or converted into an article draft.
- [x] Keep the manuscript PDF accessible from the Editorial Desk after status changes and publication.
- [x] Add regression coverage for manuscript URL persistence and verify the PDF link in the browser, then save a checkpoint.

## Club administration and weekly debates

- [x] Add an Editorial Desk club area showing joined members and membership status.
- [x] Add no-code CRUD controls for weekly debate topic, date/time, venue, description, and registration state.
- [x] Add debate applications with selectable roles including debator, mediator, jury, and other debate body roles.
- [x] Add admin review/status controls for debate applications and public application feedback states.
- [x] Add regression tests and browser verification for club administration, event editing, member listing, and role applications, then save a checkpoint.

## Debate role application bug fix

- [x] Reproduce the public debate-role application failure and capture the failing request or validation state.
- [x] Fix the application form, authentication, or persistence path so valid role applications are stored successfully.
- [x] Verify the public submit success state and Editorial Desk review visibility, then save a checkpoint.

## Club debate photo

- [x] Add a persistent photo URL to club events and migrate the database safely.
- [x] Add an image upload control in the Editorial Desk club event form above the debate topic field.
- [x] Display the selected event photo in the public Club hero with an N fallback when no photo exists.
- [x] Add regression coverage and browser verification for club photo upload/display, then save a checkpoint.

## Club hero photo composition

- [x] Restrict the uploaded debate photo to the upper hero image area and keep the topic content on a solid dark panel.
- [x] Verify desktop/mobile rendering and save a checkpoint.

## Thinkoria rebrand

- [x] Change the shared site title from The Common Index to Thinkoria.
- [x] Replace visible platform taglines and brand labels with Thinkoria and “A place of ideas.”
- [x] Verify browser title, navigation, homepage, Club page, and Editorial Desk branding, then save a checkpoint.

## Thinkoria content and imagery refinement

- [x] Rename the Editorial Desk heading to a Thinkoria-specific editorial room phrase.
- [x] Add a clear Thinkoria brand statement to the About page explaining “A place of ideas.”
- [x] Replace catalogue and category imagery with relevant, cohesive intellectual visual assets.
- [x] Verify the refreshed imagery and branding across catalogue, homepage, About, and Editorial Desk, then save a checkpoint.

## Catalogue accessibility and failed-image repair

- [x] Add article image alt text to the data model and Editorial Desk form.
- [x] Use stored alt text on catalogue cards and public article images with safe fallbacks.
- [x] Add a Thinkoria catalogue visual-language guide for future editors.
- [x] Replace all failed or placeholder catalogue images with reliable category-specific assets and verify them in the browser.
- [x] Run regression checks and save a checkpoint.

## Catalogue image-generation failure repair

- [x] Identify every catalogue/category card still displaying an image-generation failure or broken image reference.
- [x] Replace broken references with verified Thinkoria category-specific assets and strengthen runtime fallback behavior.
- [x] Verify all catalogue views on desktop and mobile, run checks, and save a checkpoint.

## Catalogue image uniqueness

- [x] Audit category and article image mappings for duplicated assets.
- [x] Add a distinct biblical or ritual Religion image and remap any other duplicated category assets.
- [x] Verify all catalogue imagery on desktop and mobile, run checks, and save a checkpoint.

## Three catalogue improvements

- [x] Add a distinct Linguistics category and article image.
- [x] Add duplicate-image warnings to the Editorial Desk category image manager.
- [x] Publish a genuine History paper and verify its category-detail view.
- [x] Run full checks, verify desktop/mobile catalogue states, and save a checkpoint.
