# Phase 3 Features - Technical Architecture Overview

## System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     MAD Mall Phase 3                        │
│                  Feature Architecture                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Frontend App   │  │   API Server     │  │   Database       │
│   (Next.js)      │  │   (Next.js)      │  │   (PostgreSQL)   │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│                  │  │                  │  │                  │
│ 1. Chat UI       │──│ Chat API         │──│ ChatRoom         │
│   - ChatRoom     │  │ - /api/chat      │  │ Message          │
│   - MessageList  │  │ - WebSocket      │  │ RoomMember       │
│   - Typing       │  │   (Pusher)       │  │ Reaction         │
│                  │  │                  │  │                  │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│                  │  │                  │  │                  │
│ 2. Events UI     │──│ Events API       │──│ Event            │
│   - Calendar     │  │ - /api/events    │  │ EventAttendee    │
│   - EventCard    │  │ - RSVP           │  │                  │
│   - RSVP         │  │ - Email notifs   │  │                  │
│                  │  │                  │  │                  │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│                  │  │                  │  │                  │
│ 3. Services UI   │──│ Booking API      │──│ Service          │
│   - Directory    │  │ - /api/services  │  │ ServiceProvider  │
│   - BookingForm  │  │ - /api/bookings  │  │ Booking          │
│   - TimeSlots    │  │ - Stripe         │  │ Availability     │
│                  │  │                  │  │                  │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│                  │  │                  │  │                  │
│ 4. Profile UI    │──│ Profile API      │──│ UserProfile      │
│   - UserProfile  │  │ - /api/profile   │  │ UserActivity     │
│   - AvatarUpload │  │ - File upload    │  │                  │
│   - Settings     │  │ - Storage (S3)   │  │                  │
│                  │  │                  │  │                  │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│                  │  │                  │  │                  │
│ 5. Admin UI      │──│ Moderation API   │──│ ModerationFlag   │
│   - Moderation   │  │ - /api/moderate  │  │ ModerationScore  │
│   - Dashboard    │  │ - OpenAI         │  │                  │
│   - Flags        │  │ - Auto-block     │  │                  │
│                  │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
├──────────────────┬──────────────────┬──────────────────────┤
│   Pusher         │   Stripe         │   OpenAI             │
│   (WebSocket)    │   (Payments)     │   (Moderation)       │
└──────────────────┴──────────────────┴──────────────────────┘
```

## Feature Dependencies

### 1. Real-time Sisterhood Lounge

**Dependencies:**

- `pusher` / `pusher-js` (WebSocket)
- `@repo/database` (Prisma models)
- `@repo/auth` (Clerk authentication)
- `@repo/design-system` (Enhanced components)
- `@repo/moderation` (Content filtering)

**Key Components:**

- `ChatRoom.tsx` - Main chat interface
- `MessageList.tsx` - Scrollable message history
- `MessageInput.tsx` - Input with typing indicators
- `TypingIndicator.tsx` - Shows who's typing

**API Endpoints:**

- `GET /api/chat/rooms` - List user's chat rooms
- `POST /api/chat/rooms` - Create new room
- `GET /api/chat/[roomId]/messages` - Get message history
- `POST /api/chat/[roomId]/messages` - Send message
- `POST /api/chat/[roomId]/typing` - Update typing status

---

### 2. Live Experiences Event Scheduling

**Dependencies:**

- `react-big-calendar` (Calendar UI)
- `moment` (Date formatting)
- `@repo/email` (React Email)
- `@repo/notifications` (Push notifications)
- `@repo/database` (Prisma models)

**Key Components:**

- `EventCalendar.tsx` - Monthly/weekly calendar view
- `EventCard.tsx` - Event list item
- `EventDetail.tsx` - Full event details
- `RSVPButton.tsx` - Attendance controls

**API Endpoints:**

- `GET /api/events` - List events (with filters)
- `POST /api/events` - Create new event
- `GET /api/events/[eventId]` - Get event details
- `PATCH /api/events/[eventId]` - Update event
- `POST /api/events/[eventId]/rsvp` - RSVP to event

---

### 3. Service Directory with Booking

**Dependencies:**

- `@repo/payments` (Stripe integration)
- `@repo/database` (Prisma models)
- `@repo/email` (Confirmation emails)
- `@repo/storage` (Service images)

**Key Components:**

- `ServiceDirectory.tsx` - Categorized service list
- `ServiceCard.tsx` - Service preview card
- `BookingForm.tsx` - Multi-step booking flow
- `TimeSlotPicker.tsx` - Available time selection

**API Endpoints:**

- `GET /api/services` - List services by category
- `GET /api/services/[serviceId]` - Service details
- `POST /api/bookings` - Create booking (with payment)
- `GET /api/bookings` - User's bookings
- `PATCH /api/bookings/[bookingId]` - Update/cancel booking

**Booking Flow:**

1. Select service
2. Choose time slot (with conflict check)
3. Enter details
4. Process payment (Stripe)
5. Send confirmation email
6. Create calendar invite

---

### 4. User Profiles and Avatars

**Dependencies:**

- `@repo/storage` (Avatar uploads)
- `@repo/database` (Prisma models)
- `@repo/auth` (User authentication)

**Key Components:**

- `UserProfile.tsx` - Profile display/edit
- `AvatarUpload.tsx` - Image upload with preview
- `ProfileEditor.tsx` - Form for bio, location, etc.
- `ActivityFeed.tsx` - User activity timeline

**API Endpoints:**

- `GET /api/profile/[userId]` - Get user profile
- `PATCH /api/profile` - Update own profile
- `POST /api/profile/avatar` - Upload avatar
- `GET /api/profile/[userId]/activity` - User activity

**Profile Features:**

- Avatar upload (image optimization)
- Cover photo
- Bio, location, website
- Social links
- Interests/tags
- Privacy settings

---

### 5. Content Moderation

**Dependencies:**

- `openai` (Moderation API)
- `@repo/database` (Prisma models)
- `@repo/rate-limit` (Anti-spam)
- `@repo/notifications` (Alert admins)

**Key Components:**

- `ModerationDashboard.tsx` - Admin overview
- `FlaggedContent.tsx` - Review queue
- `ModerationActions.tsx` - Action buttons

**API Endpoints:**

- `POST /api/moderation/check` - Check content
- `GET /api/moderation/flags` - Get flagged content
- `POST /api/moderation/flags` - Flag content
- `PATCH /api/moderation/flags/[flagId]` - Review flag

**Moderation Flow:**

1. User submits content (message, profile, etc.)
2. Auto-check with OpenAI Moderation API
3. If flagged → block immediately
4. If borderline → allow but log score
5. Manual flags → queue for admin review
6. Admin reviews → take action (warn/remove/suspend)

---

## Database Schema Summary

**Total New Tables:** 15

### Chat System (4 tables)

- `ChatRoom` - Chat rooms/channels
- `Message` - Individual messages
- `RoomMember` - Room membership
- `Reaction` - Message reactions

### Events System (2 tables)

- `Event` - Events/experiences
- `EventAttendee` - RSVPs

### Booking System (4 tables)

- `Service` - Services offered
- `ServiceProvider` - Service providers
- `ServiceAvailability` - Provider schedules
- `Booking` - Appointments

### Profiles System (2 tables)

- `UserProfile` - Extended user data
- `UserActivity` - Activity log

### Moderation System (2 tables)

- `ModerationFlag` - Manual flags
- `ModerationScore` - AI scores

---

## Environment Variables Needed

```env
# Real-time (Pusher)
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

# AI Moderation (OpenAI)
OPENAI_API_KEY=

# Payments (already configured)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Storage (for avatars/images)
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=
```

---

## Package Installation

```bash
# Real-time chat
pnpm add pusher pusher-js

# Event scheduling
pnpm add react-big-calendar moment
pnpm add -D @types/react-big-calendar

# AI moderation
pnpm add openai

# Already available in monorepo:
# - @repo/database (Prisma)
# - @repo/auth (Clerk)
# - @repo/payments (Stripe)
# - @repo/email (React Email)
# - @repo/design-system (Enhanced components)
```

---

## Implementation Timeline Estimate

### Week 1: Real-time Chat

- Day 1-2: Database schema, migrations, Pusher setup
- Day 3-4: API routes, real-time events
- Day 5: UI components, testing

### Week 2: Events & Booking

- Day 1-2: Event system (schema, API, calendar)
- Day 3-4: Booking system (schema, conflict detection, Stripe)
- Day 5: Testing, email notifications

### Week 3: Profiles & Moderation

- Day 1-2: User profiles (schema, API, storage)
- Day 3-4: Content moderation (OpenAI, admin dashboard)
- Day 5: Final testing, documentation

---

## Testing Strategy

### Unit Tests

- API route handlers
- Moderation logic
- Booking conflict detection
- Profile validation

### Integration Tests

- Real-time message delivery
- Payment flow (Stripe test mode)
- Email notifications
- Calendar RSVP flow

### E2E Tests

- Complete user journey (signup → chat → book → attend event)
- Admin moderation workflow
- Multi-user chat scenarios

---

## Security Considerations

1. **Authentication**: All endpoints require Clerk auth
2. **Authorization**: Check user permissions (admin, moderator)
3. **Rate Limiting**: Apply to chat, bookings, profile updates
4. **Content Moderation**: Auto-block harmful content
5. **Payment Security**: Use Stripe's secure payment flow
6. **File Uploads**: Validate file types, scan for malware
7. **SQL Injection**: Use Prisma's parameterized queries
8. **XSS**: Sanitize user-generated content

---

## Performance Optimizations

1. **Database Indexing**: Add indexes on frequently queried fields
2. **Caching**: Cache service listings, event calendars
3. **Lazy Loading**: Load message history on scroll
4. **Image Optimization**: Compress avatars, use CDN
5. **WebSocket Pooling**: Reuse Pusher connections
6. **Pagination**: Limit query results (50 per page)

---

## Monitoring & Observability

Use existing `@repo/observability`:

- **Sentry**: Error tracking
- **BetterStack**: Uptime monitoring
- **Custom Metrics**:
  - Messages sent/minute
  - Booking conversion rate
  - Moderation flag volume
  - Active chat users

---

## Next Steps

1. Review this architecture with team
2. Set up development environment
3. Create Pusher, OpenAI accounts
4. Run database migrations
5. Start with Feature 1 (Chat)
6. Iterate and test incrementally

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-21  
**Author**: AI Assistant
