# MAD Mall - Phase 3 Implementation Guide

**Status**: 🚧 In Development  
**Version**: 1.0.0  
**Last Updated**: 2026-01-21

---

## Overview

This guide provides comprehensive implementation instructions for Phase 3 features of MAD Mall. Each feature builds on the existing production-grade infrastructure (next-forge) and enhanced design system.

---

## Table of Contents

1. [Real-time Sisterhood Lounge (WebSocket Chat)](#1-real-time-sisterhood-lounge)
2. [Live Experiences Event Scheduling](#2-live-experiences-event-scheduling)
3. [Service Directory with Booking](#3-service-directory-with-booking)
4. [User Profiles and Avatars](#4-user-profiles-and-avatars)
5. [Content Moderation](#5-content-moderation)

---

## Prerequisites

Before implementing Phase 3 features, ensure:

- ✅ Phase 1 & 2 completed (infrastructure, design system)
- ✅ Node.js 20+, pnpm installed
- ✅ Database configured (Prisma)
- ✅ Authentication working (Clerk)
- ✅ Enhanced design system available

---

## 1. Real-time Sisterhood Lounge

### Objective
Build a real-time chat system for the Sisterhood Lounge with WebSocket support, typing indicators, and message history.

### Technology Stack
- **WebSocket**: Socket.io or Pusher (recommendation: Pusher for production reliability)
- **Database**: Prisma with PostgreSQL
- **Components**: Enhanced design system components
- **State**: React Query + Zustand for real-time state

### Implementation Steps

#### 1.1 Database Schema

Create new Prisma schema for chat:

```prisma
// Add to packages/database/prisma/schema.prisma

model ChatRoom {
  id          String    @id @default(cuid())
  name        String
  type        String    // "sisterhood", "support-group", "private"
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  messages    Message[]
  members     RoomMember[]
}

model Message {
  id         String   @id @default(cuid())
  content    String
  type       String   @default("text") // "text", "image", "emoji"
  roomId     String
  room       ChatRoom @relation(fields: [roomId], references: [id])
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  isEdited   Boolean  @default(false)
  isDeleted  Boolean  @default(false)
  reactions  Reaction[]
  
  @@index([roomId, createdAt])
  @@index([authorId])
}

model RoomMember {
  id           String   @id @default(cuid())
  roomId       String
  room         ChatRoom @relation(fields: [roomId], references: [id])
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  role         String   @default("member") // "admin", "moderator", "member"
  joinedAt     DateTime @default(now())
  lastSeenAt   DateTime @default(now())
  
  @@unique([roomId, userId])
  @@index([userId])
}

model Reaction {
  id        String   @id @default(cuid())
  emoji     String
  messageId String
  message   Message  @relation(fields: [messageId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  
  @@unique([messageId, userId, emoji])
}
```

**Migration Command**:
```bash
cd packages/database
pnpm prisma migrate dev --name add_chat_system
```

#### 1.2 Real-time Package Setup

Create a new package for real-time functionality:

```bash
# Create package structure
mkdir -p packages/realtime/src
```

**packages/realtime/package.json**:
```json
{
  "name": "@repo/realtime",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts",
    "./server": "./src/server.ts"
  },
  "scripts": {
    "lint": "biome check .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "pusher": "^5.2.0",
    "pusher-js": "^8.4.0-rc2",
    "@repo/database": "workspace:*"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "^5.3.3"
  }
}
```

**packages/realtime/src/server.ts**:
```typescript
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export const sendMessage = async (
  roomId: string,
  message: {
    id: string;
    content: string;
    author: { id: string; name: string; avatar?: string };
    createdAt: Date;
  }
) => {
  await pusher.trigger(`chat-${roomId}`, 'new-message', message);
};

export const sendTypingIndicator = async (
  roomId: string,
  user: { id: string; name: string },
  isTyping: boolean
) => {
  await pusher.trigger(`chat-${roomId}`, 'typing', {
    userId: user.id,
    userName: user.name,
    isTyping,
  });
};

export const updateOnlineStatus = async (
  roomId: string,
  onlineCount: number
) => {
  await pusher.trigger(`chat-${roomId}`, 'online-status', { onlineCount });
};

export { pusher };
```

**packages/realtime/src/client.ts**:
```typescript
'use client';

import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

let pusherClient: Pusher | null = null;

export const getPusherClient = () => {
  if (!pusherClient) {
    pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }
  return pusherClient;
};

export const useChatRoom = (roomId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`chat-${roomId}`);

    channel.bind('new-message', (data: any) => {
      setMessages((prev) => [...prev, data]);
    });

    channel.bind('typing', (data: { userId: string; userName: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (data.isTyping) {
          next.set(data.userId, data.userName);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    channel.bind('online-status', (data: { onlineCount: number }) => {
      setOnlineCount(data.onlineCount);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${roomId}`);
    };
  }, [roomId]);

  return { messages, typingUsers, onlineCount };
};
```

#### 1.3 API Routes for Chat

**apps/api/app/api/chat/rooms/route.ts**:
```typescript
import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rooms = await database.chatRoom.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      _count: {
        select: { messages: true, members: true },
      },
    },
  });

  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, type, description } = await request.json();

  const room = await database.chatRoom.create({
    data: {
      name,
      type,
      description,
      members: {
        create: {
          userId,
          role: 'admin',
        },
      },
    },
  });

  return NextResponse.json(room);
}
```

**apps/api/app/api/chat/[roomId]/messages/route.ts**:
```typescript
import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { sendMessage } from '@repo/realtime/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await database.message.findMany({
    where: {
      roomId: params.roomId,
      isDeleted: false,
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      reactions: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(messages);
}

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, type = 'text' } = await request.json();

  const message = await database.message.create({
    data: {
      content,
      type,
      roomId: params.roomId,
      authorId: userId,
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  // Send real-time update
  await sendMessage(params.roomId, {
    id: message.id,
    content: message.content,
    author: {
      id: message.author.id,
      name: message.author.name || 'Anonymous',
      avatar: message.author.image || undefined,
    },
    createdAt: message.createdAt,
  });

  return NextResponse.json(message);
}
```

#### 1.4 Chat UI Component

**apps/app/components/chat/ChatRoom.tsx**:
```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatRoom } from '@repo/realtime/client';
import { EnhancedContainer, AnimatedCard } from '@repo/design-system';
import { Input, Button, SpaceBetween, Box } from '@repo/design-system';

interface ChatRoomProps {
  roomId: string;
  roomName: string;
}

export const ChatRoom = ({ roomId, roomName }: ChatRoomProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { messages, typingUsers, onlineCount } = useChatRoom(roomId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    await fetch(`/api/chat/${roomId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: inputValue }),
    });

    setInputValue('');
    setIsTyping(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (!isTyping) {
      setIsTyping(true);
      // Send typing indicator
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Send not typing indicator
    }, 1000);
  };

  return (
    <EnhancedContainer
      gradient="sisterhood"
      header={
        <SpaceBetween direction="horizontal" size="xs">
          <Box variant="h2">{roomName}</Box>
          <Box variant="small" color="text-status-info">
            {onlineCount} Sisters Online
          </Box>
        </SpaceBetween>
      }
    >
      <div className="chat-messages" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {messages.map((msg) => (
          <div key={msg.id} className="message-item" style={{ marginBottom: '1rem' }}>
            <strong>{msg.author.name}</strong>: {msg.content}
          </div>
        ))}
        {Array.from(typingUsers.values()).map((name) => (
          <div key={name} className="typing-indicator">
            <em>{name} is typing...</em>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <SpaceBetween direction="horizontal" size="xs">
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.detail.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.detail.key === 'Enter') handleSendMessage();
            }}
          />
          <Button variant="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </SpaceBetween>
      </div>
    </EnhancedContainer>
  );
};
```

---

## 2. Live Experiences Event Scheduling

### Objective
Create an event scheduling system for Live Experiences (concerts, workshops, etc.) with calendar integration and RSVP functionality.

### Technology Stack
- **Calendar**: React Big Calendar or FullCalendar
- **Database**: Prisma
- **Notifications**: @repo/notifications package
- **Email**: @repo/email package (React Email)

### Implementation Steps

#### 2.1 Database Schema

```prisma
// Add to packages/database/prisma/schema.prisma

model Event {
  id            String   @id @default(cuid())
  title         String
  description   String?
  type          String   // "concert", "workshop", "therapy-session"
  venue         String   // "Garden Amphitheater", "Wellness Theater", etc.
  startTime     DateTime
  endTime       DateTime
  capacity      Int?
  imageUrl      String?
  status        String   @default("upcoming") // "upcoming", "live", "completed", "cancelled"
  
  hostId        String
  host          User     @relation("HostedEvents", fields: [hostId], references: [id])
  
  attendees     EventAttendee[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([startTime, status])
  @@index([hostId])
}

model EventAttendee {
  id         String   @id @default(cuid())
  eventId    String
  event      Event    @relation(fields: [eventId], references: [id])
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  status     String   @default("attending") // "attending", "maybe", "not-attending"
  rsvpedAt   DateTime @default(now())
  
  @@unique([eventId, userId])
  @@index([userId])
}
```

#### 2.2 Event Management API

**apps/api/app/api/events/route.ts**:
```typescript
import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const type = searchParams.get('type');

  const where: any = {};
  
  if (startDate && endDate) {
    where.startTime = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }
  
  if (type) where.type = type;

  const events = await database.event.findMany({
    where,
    include: {
      host: {
        select: { id: true, name: true, image: true },
      },
      _count: {
        select: { attendees: true },
      },
    },
    orderBy: { startTime: 'asc' },
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();

  const event = await database.event.create({
    data: {
      ...data,
      hostId: userId,
    },
  });

  return NextResponse.json(event);
}
```

**apps/api/app/api/events/[eventId]/rsvp/route.ts**:
```typescript
import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { sendEmail } from '@repo/email';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { status = 'attending' } = await request.json();

  const attendee = await database.eventAttendee.upsert({
    where: {
      eventId_userId: {
        eventId: params.eventId,
        userId,
      },
    },
    create: {
      eventId: params.eventId,
      userId,
      status,
    },
    update: {
      status,
    },
    include: {
      event: true,
      user: true,
    },
  });

  // Send confirmation email
  await sendEmail({
    to: attendee.user.email,
    subject: `RSVP Confirmed: ${attendee.event.title}`,
    template: 'event-rsvp',
    data: {
      eventTitle: attendee.event.title,
      eventDate: attendee.event.startTime,
      venue: attendee.event.venue,
    },
  });

  return NextResponse.json(attendee);
}
```

#### 2.3 Event Calendar Component

**apps/app/components/events/EventCalendar.tsx**:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { EnhancedContainer, AnimatedCard, gradients } from '@repo/design-system';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  venue: string;
}

export const EventCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(
      data.map((e: any) => ({
        ...e,
        start: new Date(e.startTime),
        end: new Date(e.endTime),
      }))
    );
  };

  const handleRSVP = async (eventId: string) => {
    await fetch(`/api/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'attending' }),
    });
  };

  return (
    <div className="event-calendar-container">
      <EnhancedContainer gradient="wellness" animated>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => setSelectedEvent(event)}
        />
      </EnhancedContainer>

      {selectedEvent && (
        <AnimatedCard
          title={selectedEvent.title}
          subtitle={`${selectedEvent.venue} • ${moment(selectedEvent.start).format('LLL')}`}
          gradient="sisterhood"
          hoverable
          onClick={() => handleRSVP(selectedEvent.id)}
        />
      )}
    </div>
  );
};
```

---

## 3. Service Directory with Booking

### Objective
Build a comprehensive service directory with integrated booking system for appointments and services.

### Technology Stack
- **Booking**: Custom booking engine with conflict detection
- **Payments**: @repo/payments (Stripe)
- **Calendar**: iCal integration for calendar exports
- **Notifications**: Email + SMS reminders

### Implementation Steps

#### 3.1 Database Schema

```prisma
// Add to packages/database/prisma/schema.prisma

model Service {
  id            String   @id @default(cuid())
  name          String
  category      String   // "clinic", "spa", "fitness", "mental-health"
  description   String
  duration      Int      // Duration in minutes
  price         Decimal
  imageUrl      String?
  
  providerId    String
  provider      ServiceProvider @relation(fields: [providerId], references: [id])
  
  availability  ServiceAvailability[]
  bookings      Booking[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([category])
  @@index([providerId])
}

model ServiceProvider {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  bio         String?
  credentials String?
  specialties String[]
  
  services    Service[]
  bookings    Booking[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ServiceAvailability {
  id          String   @id @default(cuid())
  serviceId   String
  service     Service  @relation(fields: [serviceId], references: [id])
  dayOfWeek   Int      // 0 = Sunday, 6 = Saturday
  startTime   String   // HH:mm format
  endTime     String
  isRecurring Boolean  @default(true)
  
  @@index([serviceId, dayOfWeek])
}

model Booking {
  id          String   @id @default(cuid())
  serviceId   String
  service     Service  @relation(fields: [serviceId], references: [id])
  providerId  String
  provider    ServiceProvider @relation(fields: [providerId], references: [id])
  clientId    String
  client      User     @relation(fields: [clientId], references: [id])
  
  startTime   DateTime
  endTime     DateTime
  status      String   @default("pending") // "pending", "confirmed", "completed", "cancelled"
  notes       String?
  
  paymentId   String?  // Stripe payment intent ID
  amount      Decimal
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([serviceId, startTime])
  @@index([clientId])
  @@index([providerId, startTime])
}
```

#### 3.2 Booking API with Conflict Detection

**apps/api/app/api/bookings/route.ts**:
```typescript
import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { stripe } from '@repo/payments';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { serviceId, startTime, notes } = await request.json();

  // Get service details
  const service = await database.service.findUnique({
    where: { id: serviceId },
    include: { provider: true },
  });

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const start = new Date(startTime);
  const end = new Date(start.getTime() + service.duration * 60000);

  // Check for conflicts
  const conflicts = await database.booking.findMany({
    where: {
      providerId: service.providerId,
      status: { in: ['pending', 'confirmed'] },
      OR: [
        {
          AND: [
            { startTime: { lte: start } },
            { endTime: { gt: start } },
          ],
        },
        {
          AND: [
            { startTime: { lt: end } },
            { endTime: { gte: end } },
          ],
        },
      ],
    },
  });

  if (conflicts.length > 0) {
    return NextResponse.json(
      { error: 'Time slot not available' },
      { status: 409 }
    );
  }

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(Number(service.price) * 100),
    currency: 'usd',
    metadata: {
      serviceId: service.id,
      userId,
    },
  });

  // Create booking
  const booking = await database.booking.create({
    data: {
      serviceId,
      providerId: service.providerId,
      clientId: userId,
      startTime: start,
      endTime: end,
      amount: service.price,
      notes,
      paymentId: paymentIntent.id,
    },
  });

  return NextResponse.json({
    booking,
    clientSecret: paymentIntent.client_secret,
  });
}
```

#### 3.3 Service Directory UI

**apps/app/components/services/ServiceDirectory.tsx**:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { EnhancedContainer, AnimatedCard } from '@repo/design-system';
import { Tabs, Grid } from '@repo/design-system';

const categories = [
  { id: 'clinic', label: 'Endocrinology Clinic', gradient: 'clinical' },
  { id: 'spa', label: 'Wellness Spa', gradient: 'wellness' },
  { id: 'fitness', label: 'Fitness Studio', gradient: 'energy' },
  { id: 'mental-health', label: 'Mental Health', gradient: 'sisterhood' },
];

export const ServiceDirectory = () => {
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('clinic');

  useEffect(() => {
    fetchServices(activeCategory);
  }, [activeCategory]);

  const fetchServices = async (category: string) => {
    const res = await fetch(`/api/services?category=${category}`);
    const data = await res.json();
    setServices(data);
  };

  return (
    <EnhancedContainer gradient="wellness" animated>
      <Tabs
        tabs={categories.map((cat) => ({
          id: cat.id,
          label: cat.label,
        }))}
        activeTabId={activeCategory}
        onChange={({ detail }) => setActiveCategory(detail.activeTabId)}
      />

      <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
        {services.map((service: any) => (
          <AnimatedCard
            key={service.id}
            title={service.name}
            subtitle={`$${service.price} • ${service.duration} min`}
            gradient={categories.find((c) => c.id === activeCategory)?.gradient}
            hoverable
            onClick={() => {
              // Navigate to booking page
              window.location.href = `/book/${service.id}`;
            }}
          />
        ))}
      </Grid>
    </EnhancedContainer>
  );
};
```

---

## 4. User Profiles and Avatars

### Objective
Implement comprehensive user profiles with customizable avatars, preferences, and activity tracking.

### Implementation Steps

#### 4.1 Database Schema

```prisma
// Add to packages/database/prisma/schema.prisma

model UserProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  bio             String?
  location        String?
  website         String?
  socialLinks     Json?    // { twitter, instagram, linkedin }
  
  avatarUrl       String?
  coverImageUrl   String?
  
  preferences     Json?    // Notification, privacy settings
  interests       String[] // Tags for matching
  
  isVerified      Boolean  @default(false)
  isPremium       Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model UserActivity {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  type        String   // "message", "event-rsvp", "booking", "profile-view"
  metadata    Json
  createdAt   DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([type])
}
```

#### 4.2 Avatar Upload with Storage

**apps/api/app/api/profile/avatar/route.ts**:
```typescript
import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { uploadToStorage } from '@repo/storage';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('avatar') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Upload to storage (S3, Cloudflare R2, etc.)
  const avatarUrl = await uploadToStorage(file, `avatars/${userId}`);

  // Update profile
  const profile = await database.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      avatarUrl,
    },
    update: {
      avatarUrl,
    },
  });

  return NextResponse.json({ avatarUrl: profile.avatarUrl });
}
```

#### 4.3 Profile Component

**apps/app/components/profile/UserProfile.tsx**:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { EnhancedContainer, HeroSection } from '@repo/design-system';
import { Avatar, Form, Input, Textarea, Button } from '@repo/design-system';

export const UserProfile = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    const res = await fetch(`/api/profile/${userId}`);
    const data = await res.json();
    setProfile(data);
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/profile/avatar', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setProfile({ ...profile, avatarUrl: data.avatarUrl });
  };

  return (
    <div>
      <HeroSection
        gradient="sisterhood"
        title={profile?.user.name || 'Loading...'}
        subtitle={profile?.bio || 'No bio yet'}
        atmospheric
      />

      <EnhancedContainer gradient="wellness" animated>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }}>
          <div>
            <Avatar
              src={profile?.avatarUrl}
              alt={profile?.user.name}
              size="large"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleAvatarUpload(e.target.files[0]);
                }
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            {isEditing ? (
              <Form>
                <Input
                  label="Bio"
                  value={profile?.bio || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.detail.value })
                  }
                />
                <Input
                  label="Location"
                  value={profile?.location || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.detail.value })
                  }
                />
                <Button onClick={() => setIsEditing(false)}>Save</Button>
              </Form>
            ) : (
              <div>
                <p>{profile?.bio}</p>
                <p>{profile?.location}</p>
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            )}
          </div>
        </div>
      </EnhancedContainer>
    </div>
  );
};
```

---

## 5. Content Moderation

### Objective
Implement automated and manual content moderation for chat messages, user profiles, and community content.

### Technology Stack
- **AI Moderation**: OpenAI Moderation API or Perspective API
- **Manual Review**: Admin dashboard with flagging system
- **Rate Limiting**: @repo/rate-limit package

### Implementation Steps

#### 5.1 Database Schema

```prisma
// Add to packages/database/prisma/schema.prisma

model ModerationFlag {
  id          String   @id @default(cuid())
  contentType String   // "message", "profile", "event"
  contentId   String
  reason      String   // "spam", "harassment", "inappropriate", "other"
  description String?
  
  reporterId  String
  reporter    User     @relation("FlagsReported", fields: [reporterId], references: [id])
  
  status      String   @default("pending") // "pending", "reviewed", "actioned", "dismissed"
  reviewerId  String?
  reviewer    User?    @relation("FlagsReviewed", fields: [reviewerId], references: [id])
  reviewedAt  DateTime?
  action      String?  // "warning", "content-removed", "user-suspended", "no-action"
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([contentType, contentId])
  @@index([status])
  @@index([reporterId])
}

model ModerationScore {
  id          String   @id @default(cuid())
  contentType String
  contentId   String
  score       Json     // { toxicity, spam, harassment, etc. }
  source      String   // "openai", "perspective", "custom"
  flagged     Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  
  @@unique([contentType, contentId])
  @@index([flagged])
}
```

#### 5.2 Moderation Middleware

**packages/moderation/src/index.ts**:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const moderateContent = async (content: string) => {
  const moderation = await openai.moderations.create({
    input: content,
  });

  const result = moderation.results[0];
  
  return {
    flagged: result.flagged,
    categories: result.categories,
    categoryScores: result.category_scores,
  };
};

export const shouldBlockContent = (moderationResult: any): boolean => {
  const { flagged, categoryScores } = moderationResult;
  
  // Block if flagged or if any category score is too high
  const highRiskThreshold = 0.8;
  const hasHighRiskContent = Object.values(categoryScores).some(
    (score: any) => score > highRiskThreshold
  );

  return flagged || hasHighRiskContent;
};
```

#### 5.3 Moderation Integration in Chat

**apps/api/app/api/chat/[roomId]/messages/route.ts** (updated):
```typescript
import { moderateContent, shouldBlockContent } from '@repo/moderation';
import { database } from '@repo/database';
import { sendMessage } from '@repo/realtime/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, type = 'text' } = await request.json();

  // Moderate content
  const moderationResult = await moderateContent(content);
  
  if (shouldBlockContent(moderationResult)) {
    // Log moderation event
    await database.moderationScore.create({
      data: {
        contentType: 'message',
        contentId: 'pre-creation', // Will be updated after message creation
        score: moderationResult,
        source: 'openai',
        flagged: true,
      },
    });

    return NextResponse.json(
      { error: 'Message blocked due to content policy violation' },
      { status: 400 }
    );
  }

  // Create message
  const message = await database.message.create({
    data: {
      content,
      type,
      roomId: params.roomId,
      authorId: userId,
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  // Store moderation score
  await database.moderationScore.create({
    data: {
      contentType: 'message',
      contentId: message.id,
      score: moderationResult,
      source: 'openai',
      flagged: moderationResult.flagged,
    },
  });

  // Send real-time update
  await sendMessage(params.roomId, {
    id: message.id,
    content: message.content,
    author: {
      id: message.author.id,
      name: message.author.name || 'Anonymous',
      avatar: message.author.image || undefined,
    },
    createdAt: message.createdAt,
  });

  return NextResponse.json(message);
}
```

#### 5.4 Admin Moderation Dashboard

**apps/app/components/admin/ModerationDashboard.tsx**:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { EnhancedContainer, AnimatedCard } from '@repo/design-system';
import { Table, Button, Badge, StatusIndicator } from '@repo/design-system';

export const ModerationDashboard = () => {
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    const res = await fetch('/api/moderation/flags?status=pending');
    const data = await res.json();
    setFlags(data);
  };

  const handleReview = async (flagId: string, action: string) => {
    await fetch(`/api/moderation/flags/${flagId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, status: 'reviewed' }),
    });
    fetchFlags();
  };

  return (
    <EnhancedContainer
      gradient="clinical"
      header="Content Moderation"
      animated
    >
      <Table
        columnDefinitions={[
          { header: 'Content Type', cell: (item: any) => item.contentType },
          { header: 'Reason', cell: (item: any) => item.reason },
          { header: 'Reporter', cell: (item: any) => item.reporter.name },
          {
            header: 'Status',
            cell: (item: any) => (
              <Badge color={item.status === 'pending' ? 'red' : 'green'}>
                {item.status}
              </Badge>
            ),
          },
          {
            header: 'Actions',
            cell: (item: any) => (
              <div>
                <Button size="small" onClick={() => handleReview(item.id, 'warning')}>
                  Warn
                </Button>
                <Button size="small" onClick={() => handleReview(item.id, 'content-removed')}>
                  Remove
                </Button>
                <Button size="small" onClick={() => handleReview(item.id, 'no-action')}>
                  Dismiss
                </Button>
              </div>
            ),
          },
        ]}
        items={flags}
      />
    </EnhancedContainer>
  );
};
```

---

## Environment Variables

Add these to your `.env.local`:

```env
# Pusher (for real-time chat)
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster

# OpenAI (for moderation)
OPENAI_API_KEY=your_openai_key

# Stripe (already configured)
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

---

## Testing Checklist

### Real-time Chat
- [ ] Users can send and receive messages in real-time
- [ ] Typing indicators work correctly
- [ ] Online status updates properly
- [ ] Message history loads correctly
- [ ] Emoji reactions work

### Event Scheduling
- [ ] Events display on calendar
- [ ] RSVP functionality works
- [ ] Email confirmations are sent
- [ ] Event capacity limits are enforced
- [ ] Calendar exports work

### Service Booking
- [ ] Services display by category
- [ ] Booking conflict detection works
- [ ] Payment processing succeeds
- [ ] Confirmation emails are sent
- [ ] Calendar invites are generated

### User Profiles
- [ ] Avatar upload works
- [ ] Profile edits save correctly
- [ ] Privacy settings are respected
- [ ] Activity tracking works

### Content Moderation
- [ ] AI moderation blocks inappropriate content
- [ ] Manual flagging works
- [ ] Admin dashboard displays flags
- [ ] Moderation actions are logged

---

## Next Steps

1. **Run migrations**: `cd packages/database && pnpm prisma migrate dev`
2. **Install dependencies**: `pnpm install` (add Pusher, OpenAI, react-big-calendar)
3. **Set up environment variables**
4. **Implement each feature incrementally**
5. **Test thoroughly**
6. **Deploy to production**

---

## Support & Resources

- **Design System Docs**: See `COMPONENT_INVENTORY.md`
- **next-forge Docs**: https://www.next-forge.com/docs
- **Pusher Docs**: https://pusher.com/docs
- **Stripe Docs**: https://stripe.com/docs

---

**Last Updated**: 2026-01-21  
**Maintained By**: MAD Mall Development Team
