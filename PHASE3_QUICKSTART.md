# Phase 3 Quick Start Checklist

Use this checklist to get started with Phase 3 implementation.

## ✅ Pre-Implementation Setup

### 1. Environment Setup
- [ ] Install Node.js 20+
- [ ] Install pnpm (`npm install -g pnpm`)
- [ ] Clone repository
- [ ] Run `pnpm install`
- [ ] Verify existing apps run: `pnpm run dev`

### 2. External Services Setup
- [ ] **Pusher Account** (for real-time chat)
  - Sign up at https://pusher.com
  - Create new app
  - Copy: App ID, Key, Secret, Cluster
  - Add to `.env.local`
  
- [ ] **OpenAI Account** (for moderation)
  - Sign up at https://platform.openai.com
  - Generate API key
  - Add to `.env.local`
  
- [ ] **Stripe Account** (already done?)
  - Verify test mode is enabled
  - Get test API keys
  
- [ ] **File Storage** (S3, Cloudflare R2, etc.)
  - Create bucket for avatars/images
  - Configure CORS
  - Get access credentials

### 3. Database Setup
- [ ] PostgreSQL installed and running
- [ ] Database connection string in `.env`
- [ ] Run existing migrations: `cd packages/database && pnpm prisma migrate dev`

---

## 🚀 Feature 1: Real-time Chat (Start Here!)

### Step 1: Database Schema ✅
- [ ] Open `packages/database/prisma/schema.prisma`
- [ ] Add `ChatRoom`, `Message`, `RoomMember`, `Reaction` models
- [ ] Copy from `IMPLEMENTATION_GUIDE.md` section 1.1
- [ ] Run migration:
  ```bash
  cd packages/database
  pnpm prisma migrate dev --name add_chat_system
  ```

### Step 2: Install Dependencies ✅
- [ ] Install Pusher:
  ```bash
  pnpm add pusher pusher-js
  ```

### Step 3: Create Realtime Package ✅
- [ ] Create directory: `mkdir -p packages/realtime/src`
- [ ] Create `packages/realtime/package.json`
- [ ] Create `packages/realtime/src/server.ts`
- [ ] Create `packages/realtime/src/client.ts`
- [ ] Create `packages/realtime/src/index.ts`
- [ ] Copy implementations from `IMPLEMENTATION_GUIDE.md` section 1.2

### Step 4: Environment Variables ✅
Add to `.env.local` in root:
```env
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

### Step 5: Create API Routes ✅
- [ ] Create `apps/api/app/api/chat/rooms/route.ts`
- [ ] Create `apps/api/app/api/chat/[roomId]/messages/route.ts`
- [ ] Copy from `IMPLEMENTATION_GUIDE.md` section 1.3

### Step 6: Build Chat UI ✅
- [ ] Create `apps/app/components/chat/ChatRoom.tsx`
- [ ] Copy from `IMPLEMENTATION_GUIDE.md` section 1.4
- [ ] Style with enhanced components

### Step 7: Test Chat ✅
- [ ] Start dev server: `pnpm run dev`
- [ ] Navigate to chat page
- [ ] Open in two browser windows
- [ ] Send messages between windows
- [ ] Verify real-time delivery
- [ ] Check typing indicators

---

## 📅 Feature 2: Event Scheduling

### Step 1: Database Schema
- [ ] Add `Event`, `EventAttendee` models to Prisma
- [ ] Run migration: `pnpm prisma migrate dev --name add_events`

### Step 2: Install Dependencies
- [ ] Install calendar library:
  ```bash
  pnpm add react-big-calendar moment
  pnpm add -D @types/react-big-calendar
  ```

### Step 3: Create API Routes
- [ ] `apps/api/app/api/events/route.ts`
- [ ] `apps/api/app/api/events/[eventId]/route.ts`
- [ ] `apps/api/app/api/events/[eventId]/rsvp/route.ts`

### Step 4: Build Event UI
- [ ] `apps/app/components/events/EventCalendar.tsx`
- [ ] `apps/app/components/events/EventCard.tsx`
- [ ] `apps/app/components/events/EventDetail.tsx`

### Step 5: Email Notifications
- [ ] Use `@repo/email` for RSVP confirmations
- [ ] Create email templates

### Step 6: Test Events
- [ ] Create event
- [ ] RSVP to event
- [ ] Check email confirmation
- [ ] View on calendar

---

## 🏥 Feature 3: Service Directory & Booking

### Step 1: Database Schema
- [ ] Add `Service`, `ServiceProvider`, `ServiceAvailability`, `Booking` models
- [ ] Run migration: `pnpm prisma migrate dev --name add_bookings`

### Step 2: Create API Routes
- [ ] `apps/api/app/api/services/route.ts`
- [ ] `apps/api/app/api/bookings/route.ts`
- [ ] Implement conflict detection logic

### Step 3: Stripe Integration
- [ ] Use existing `@repo/payments`
- [ ] Create payment intent on booking
- [ ] Handle webhook for confirmation

### Step 4: Build Booking UI
- [ ] `apps/app/components/services/ServiceDirectory.tsx`
- [ ] `apps/app/components/services/BookingForm.tsx`
- [ ] `apps/app/components/services/TimeSlotPicker.tsx`

### Step 5: Test Booking
- [ ] Browse services
- [ ] Select time slot
- [ ] Complete test payment
- [ ] Verify booking created
- [ ] Check confirmation email

---

## 👤 Feature 4: User Profiles

### Step 1: Database Schema
- [ ] Add `UserProfile`, `UserActivity` models
- [ ] Run migration: `pnpm prisma migrate dev --name add_profiles`

### Step 2: Storage Setup
- [ ] Configure `@repo/storage` for S3/R2
- [ ] Set up image upload endpoint

### Step 3: Create API Routes
- [ ] `apps/api/app/api/profile/route.ts`
- [ ] `apps/api/app/api/profile/avatar/route.ts`
- [ ] `apps/api/app/api/profile/[userId]/route.ts`

### Step 4: Build Profile UI
- [ ] `apps/app/components/profile/UserProfile.tsx`
- [ ] `apps/app/components/profile/AvatarUpload.tsx`
- [ ] `apps/app/components/profile/ProfileEditor.tsx`

### Step 5: Test Profiles
- [ ] Upload avatar
- [ ] Edit profile
- [ ] View other users
- [ ] Check privacy settings

---

## 🛡️ Feature 5: Content Moderation

### Step 1: Database Schema
- [ ] Add `ModerationFlag`, `ModerationScore` models
- [ ] Run migration: `pnpm prisma migrate dev --name add_moderation`

### Step 2: Create Moderation Package
- [ ] `mkdir -p packages/moderation/src`
- [ ] Create OpenAI integration
- [ ] Add to `.env.local`: `OPENAI_API_KEY`

### Step 3: Integrate into Chat
- [ ] Modify chat API to check messages
- [ ] Auto-block inappropriate content
- [ ] Log moderation scores

### Step 4: Admin Dashboard
- [ ] `apps/app/components/admin/ModerationDashboard.tsx`
- [ ] `apps/api/app/api/moderation/flags/route.ts`

### Step 5: Test Moderation
- [ ] Send test messages (appropriate and inappropriate)
- [ ] Verify auto-blocking works
- [ ] Flag content manually
- [ ] Review in admin dashboard

---

## 🧪 Testing & Quality Assurance

### Testing Checklist
- [ ] Unit tests for API routes
- [ ] Integration tests for payment flow
- [ ] E2E tests for user journeys
- [ ] Load testing for real-time chat
- [ ] Security audit (auth, permissions)

### Performance
- [ ] Database query optimization
- [ ] Add necessary indexes
- [ ] Implement caching where needed
- [ ] Optimize images/assets

### Documentation
- [ ] Update API documentation
- [ ] Create user guides
- [ ] Document deployment process
- [ ] Add troubleshooting guide

---

## 🚢 Deployment

### Pre-Deployment
- [ ] All features tested
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Security review completed

### Staging Deployment
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] User acceptance testing
- [ ] Fix any issues

### Production Deployment
- [ ] Backup database
- [ ] Run migrations on production
- [ ] Deploy applications
- [ ] Monitor for errors
- [ ] Verify all features work

---

## 📊 Success Metrics

After deployment, track:
- [ ] Chat messages per day
- [ ] Event RSVPs
- [ ] Booking conversion rate
- [ ] User profile completion rate
- [ ] Moderation flag volume
- [ ] User satisfaction (feedback)

---

## 📚 Resources

- **Main Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **Architecture Overview**: `PHASE3_ARCHITECTURE.md`
- **Component Inventory**: `COMPONENT_INVENTORY.md`
- **Workflow**: `.agent/workflows/phase3-implementation.md`

---

## 🆘 Getting Help

If stuck:
1. Check the implementation guide
2. Review example code in guide
3. Check package documentation:
   - Pusher: https://pusher.com/docs
   - React Big Calendar: https://jquense.github.io/react-big-calendar
   - OpenAI: https://platform.openai.com/docs
4. Review existing packages in `packages/` for patterns

---

**Ready to start?** Begin with Feature 1 (Real-time Chat) ✅

The chat feature provides immediate value and sets up patterns that other features will follow (real-time updates, moderation, etc.).

Good luck! 🚀
