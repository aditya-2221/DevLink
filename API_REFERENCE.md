# DevLink API Reference

Base URL: `/api/v1`

Auth: endpoints marked 🔒 require a valid JWT — either an `accessToken` httpOnly cookie or an `Authorization: Bearer <token>` header (checked in `auth.middleware.js`). Unmarked endpoints are public.

---

## Users — `/api/v1/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register a new user (`avatar` required, `coverImage` optional — multipart) |
| POST | `/login` | — | Log in, sets access/refresh token cookies |
| POST | `/forgot-password` | — | Send a password reset email |
| POST | `/reset-password/:token` | — | Reset password using the emailed token |
| POST | `/logout` | 🔒 | Log out, clears tokens |
| GET | `/current-user` | 🔒 | Get the logged-in user's profile |
| POST | `/change-password` | 🔒 | Change password |
| POST | `/refresh-token` | — | Exchange a refresh token for a new access token |
| PATCH | `/update-account` | 🔒 | Update account details (bio, skills, education, links, etc.) |
| PATCH | `/update-email` | 🔒 | Update email address |
| PATCH | `/avatar` | 🔒 | Update avatar image |
| PATCH | `/cover-image` | 🔒 | Update cover image |
| GET | `/profile/:username` | — | Get a public profile by username |

## Projects — `/api/v1/projects`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | 🔒 | Create a project (up to 5 images) |
| GET | `/` | 🔒 | List all projects |
| GET | `/trending` | — | Get trending projects |
| GET | `/my-projects` | 🔒 | List the current user's projects |
| GET | `/user/:username` | 🔒 | List a specific user's projects |
| GET | `/:projectId` | 🔒 | Get a single project |
| PATCH | `/:projectId` | 🔒 | Update a project (owner only) |
| DELETE | `/:projectId` | 🔒 | Delete a project (owner only) |
| POST | `/:projectId/like` | 🔒 | Like a project |
| DELETE | `/:projectId/like` | 🔒 | Unlike a project |
| POST | `/:projectId/bookmark` | 🔒 | Bookmark a project |
| DELETE | `/:projectId/bookmark` | 🔒 | Remove bookmark |
| POST | `/:projectId/comments` | 🔒 | Add a comment |
| GET | `/:projectId/comments` | 🔒 | List comments |
| PATCH | `/comments/:commentId` | 🔒 | Edit a comment |
| DELETE | `/comments/:commentId` | 🔒 | Delete a comment |

## AI Tools — `/api/v1/ai`

All endpoints require auth 🔒.

| Method | Path | Description |
|---|---|---|
| POST | `/generate-description` | Generate a project description with Gemini |
| POST | `/generate-readme` | Generate a README for a project |
| POST | `/generate-report` | Generate a project report |
| POST | `/review-project` | Get an AI-generated review of a project |

## Recruitments — `/api/v1/recruitments`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List all recruitment postings |
| GET | `/skills` | — | List distinct skills used across postings (for filtering) |
| GET | `/my-recruitments` | 🔒 | Postings created by the current user |
| GET | `/my-applications` | 🔒 | Applications submitted by the current user |
| POST | `/` | 🔒 | Create a posting |
| GET | `/:recruitmentId` | — | Get a single posting |
| PATCH | `/:recruitmentId` | 🔒 | Update a posting (owner only) |
| DELETE | `/:recruitmentId` | 🔒 | Delete a posting (owner only) |
| POST | `/:recruitmentId/apply` | 🔒 | Apply to a posting |
| GET | `/:recruitmentId/applications` | 🔒 | List applications for a posting (owner only) |
| PATCH | `/applications/:applicationId/accept` | 🔒 | Accept an applicant |
| PATCH | `/applications/:applicationId/reject` | 🔒 | Reject an applicant |

## Teams — `/api/v1/teams`

All endpoints require auth 🔒.

| Method | Path | Description |
|---|---|---|
| POST | `/` | Create a team |
| GET | `/my-teams` | List teams the user belongs to |
| GET | `/invitations` | List invitations sent to the current user |
| PATCH | `/invitations/:invitationId/accept` | Accept a team invitation |
| DELETE | `/invitations/:invitationId` | Cancel an invitation (sender) |
| PATCH | `/invitations/:invitationId/reject` | Reject an invitation |
| GET | `/:teamId/invitations` | List pending invitations for a team |
| GET | `/:teamId` | Get team details |
| PATCH | `/:teamId` | Update a team |
| DELETE | `/:teamId` | Delete a team |
| POST | `/:teamId/members` | Add a member directly |
| DELETE | `/:teamId/members/:userId` | Remove a member |
| POST | `/:teamId/invite` | Invite a user to the team |
| POST | `/:teamId/announcements` | Create an announcement |
| GET | `/:teamId/announcements` | List announcements |
| PATCH | `/:teamId/announcements/:announcementId` | Edit an announcement |
| PATCH | `/:teamId/announcements/:announcementId/pin` | Toggle pin on an announcement |
| DELETE | `/:teamId/announcements/:announcementId` | Delete an announcement |

## Tasks — `/api/v1/tasks`

All endpoints require auth 🔒.

| Method | Path | Description |
|---|---|---|
| POST | `/` | Create a task |
| GET | `/team/:teamId` | List tasks for a team (board view) |
| GET | `/:taskId` | Get a single task |
| PATCH | `/:taskId` | Update task details |
| PATCH | `/:taskId/status` | Move task between board columns |
| PATCH | `/:taskId/assign` | Assign task to a member |
| POST | `/:taskId/attachments` | Upload attachments (up to 10) |
| DELETE | `/:taskId/attachments/:attachmentId` | Delete an attachment |
| GET | `/:taskId/activity` | Get the task's activity log |
| DELETE | `/:taskId` | Delete a task |

## Resources — `/api/v1/resources`

All endpoints require auth 🔒.

| Method | Path | Description |
|---|---|---|
| POST | `/team/:teamId` | Upload team resource files (up to 20) |
| GET | `/team/:teamId` | List a team's resources |
| DELETE | `/:resourceId` | Delete a resource |
| PATCH | `/:resourceId/download` | Increment the resource's download counter |

## Notifications — `/api/v1/notifications`

All endpoints require auth 🔒.

| Method | Path | Description |
|---|---|---|
| GET | `/` | List the current user's notifications |
| PATCH | `/read-all` | Mark all notifications as read |
| PATCH | `/:notificationId/read` | Mark one notification as read |
| DELETE | `/:notificationId` | Delete a notification |

## Chat — `/api/v1/chat`

All endpoints require auth 🔒.

**Chat requests**
| Method | Path | Description |
|---|---|---|
| POST | `/requests` | Send a chat request |
| GET | `/requests` | List pending incoming requests |
| GET | `/requests/sent` | List requests the user has sent |
| PATCH | `/requests/:requestId/accept` | Accept a request |
| PATCH | `/requests/:requestId/reject` | Reject a request |
| PATCH | `/requests/:requestId/block` | Block the requester |
| DELETE | `/requests/:requestId` | Delete a request |
| GET | `/status/:userId` | Get conversation/request status with a user |

**Conversations**
| Method | Path | Description |
|---|---|---|
| GET | `/conversations` | List the user's conversations |
| POST | `/conversations/group` | Create a group conversation (with optional image) |
| GET | `/conversations/:conversationId` | Get a conversation |
| PATCH | `/conversations/:conversationId` | Update a group conversation (name/image) |
| PATCH | `/conversations/:conversationId/archive` | Archive a conversation |
| PATCH | `/conversations/:conversationId/unarchive` | Unarchive a conversation |
| PATCH | `/conversations/:conversationId/mute` | Mute a conversation |
| PATCH | `/conversations/:conversationId/unmute` | Unmute a conversation |
| POST | `/conversations/:conversationId/participants` | Add participants to a group |
| DELETE | `/conversations/:conversationId/participants/:userId` | Remove a participant |

**Messages**
| Method | Path | Description |
|---|---|---|
| POST | `/conversations/:conversationId/messages` | Send a message (up to 10 attachments) |
| GET | `/conversations/:conversationId/messages` | Get messages in a conversation |
| PATCH | `/messages/:messageId` | Edit a message |
| DELETE | `/messages/:messageId` | Delete a message |
| PATCH | `/conversations/:conversationId/read` | Mark a conversation as read |
| GET | `/conversations/:conversationId/search` | Search messages within a conversation |

## Search — `/api/v1/search`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | 🔒 | Global search across entities (users, projects, etc.) |
