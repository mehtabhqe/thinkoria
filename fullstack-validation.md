Full-stack validation findings:

The upgraded server boots with OAuth initialized and the database-backed tRPC routes are available. The public article route resolves a seeded published paper with title, author, lead image, body, and persistent view increment. The submission page renders contributor fields, category selection, abstract validation, manuscript upload control, and a success-state path. The forum page renders persisted threads from the forum query, shows an empty state when no threads exist, and gates thread creation behind sign-in. The admin page uses the provided dashboard layout, shows seeded articles, supports create/edit/publish/unpublish/delete actions, and accepts direct lead-image uploads. Desktop and mobile screenshots verified /submit, /forum, /catalogue, /article, and /admin. Vitest currently passes 7 tests covering auth, admin permissions, submission validation, forum permissions, club permissions, and empty public collection contracts.

Final evidence additions:

The Nagaon Club page was also captured at the mobile breakpoint and remains readable with the Join the Club CTA, sign-in-for-updates action, and next-gathering panel intact. The success-contract suite now passes authenticated forum thread creation and valid submission creation using isolated database helper mocks, while the regular suite covers unauthorized club/forum actions and empty public collections. These checks document the success, unauthorized, empty, and responsive paths without inserting test data into the live database.

Browser-level evidence:

The /submit route visibly exposes required name, email, title, category, abstract, manuscript upload, and submission controls. The /club route visibly exposes Join the Club and Sign in for Club Updates actions, a next-gathering card, date/time, venue in Nagaon, Assam, and member-only attendance language. These pages were inspected directly in the browser in addition to desktop/mobile screenshots.

Additional browser evidence:

The forum browser inspection showed the persisted recent-threads region is empty when no live threads exist, while Start a Thread, Join the Conversation, and Create Your Account remain visible. The anonymous /admin inspection showed a dedicated “Sign in to continue” gate with no editorial controls exposed. Combined with the submission, club, desktop/mobile screenshots, and Vitest contracts, this covers the principal public, member, and protected states.

Live submission validation:

The browser blocked an empty submission with the native required-field message “Please fill out this field.” After entering clearly labeled validation content and receiving user confirmation, the request completed successfully and displayed “The work is in the room.” with a return-to-catalogue action. This confirms both client validation and the real submission success state.

Additional live interaction evidence:

The approved validation submission reached the real success screen and persisted as a submission record. On /club, clicking Join the Club opened the Club Access modal with the expected “Sign in / create account” action and no membership controls exposed anonymously. This confirms the live account gate for club participation.

Live member-gate validation:

Clicking Join the Club opened the expected Club Access modal with sign-in/create-account action. Clicking Start a Thread opened the expected Account Required modal stating that the room opens when a visitor signs in. These live checks confirm that both member-only actions are connected to the authentication gate.
