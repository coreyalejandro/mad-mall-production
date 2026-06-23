/**
 * MADMall Database Seed
 * 
 * Creates initial data for development and testing
 * Includes sample users, posts, events, and providers
 */

import { PrismaClient } from '../generated'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding MADMall database...')

  // Clean existing data (development only)
  await prisma.moderationLog.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.eventRSVP.deleteMany()
  await prisma.event.deleteMany()
  await prisma.provider.deleteMany()
  await prisma.consentRecord.deleteMany()
  await prisma.researchDataPoint.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.featureFlag.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create test users
  const user1 = await prisma.user.create({
    data: {
      email: 'maya@example.com',
      name: 'Maya Johnson',
      emailVerified: new Date(),
      profile: {
        create: {
          displayName: 'Maya J.',
          bio: 'Living with Graves since 2020. Finding my way through with community and grace.',
          pronouns: 'she/her',
          diagnosisDate: new Date('2020-03-15'),
          profileVisibility: 'public',
          showDiagnosis: true,
        },
      },
      consentRecords: {
        create: [
          {
            consentType: 'data_collection',
            purpose: 'Platform usage and community features',
            granted: true,
            version: '1.0',
          },
          {
            consentType: 'research',
            purpose: 'Anonymized data for Graves disease research',
            granted: true,
            version: '1.0',
          },
        ],
      },
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jasmine@example.com',
      name: 'Jasmine Williams',
      emailVerified: new Date(),
      profile: {
        create: {
          displayName: 'Jazz',
          bio: 'Diagnosed 2019. Advocate for better healthcare for Black women.',
          pronouns: 'she/her',
          diagnosisDate: new Date('2019-08-22'),
          profileVisibility: 'public',
        },
      },
      consentRecords: {
        create: [
          {
            consentType: 'data_collection',
            purpose: 'Platform usage and community features',
            granted: true,
            version: '1.0',
          },
        ],
      },
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'admin@madmall.org',
      name: 'MADMall Admin',
      emailVerified: new Date(),
      profile: {
        create: {
          displayName: 'Admin',
          bio: 'MADMall community moderator',
          profileVisibility: 'public',
        },
      },
    },
  })

  console.log('✅ Created 3 users')

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      authorId: user1.id,
      content: 'Just wanted to share that I found a great endocrinologist who actually listens. Took 3 years but worth the search. Happy to share info via DM.',
      room: 'commons',
      moderationStatus: 'approved',
      moderatedAt: new Date(),
      moderatorId: user3.id,
      containsMedicalAdvice: false,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      authorId: user2.id,
      content: 'Anyone else dealing with the heat sensitivity? I have a collection of cooling scarves that have been life-changing. Not medical advice, just sharing what worked for me!',
      room: 'wellness',
      moderationStatus: 'approved',
      moderatedAt: new Date(),
      moderatorId: user3.id,
      containsMedicalAdvice: false,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      authorId: user1.id,
      content: 'Reminder: This space is for sharing experiences, not medical advice. Always consult your healthcare provider for treatment decisions. 💙',
      room: 'care',
      moderationStatus: 'approved',
      moderatedAt: new Date(),
      moderatorId: user3.id,
      containsMedicalAdvice: false,
    },
  })

  // Create a flagged post (for testing moderation)
  const flaggedPost = await prisma.post.create({
    data: {
      authorId: user2.id,
      content: 'You should definitely stop taking your medication and try this natural remedy instead.',
      room: 'wellness',
      moderationStatus: 'flagged',
      containsMedicalAdvice: true,
      medicalAdviceFlags: ['should stop taking', 'instead of medication'],
      reviewRequired: true,
    },
  })

  console.log('✅ Created 4 posts (3 approved, 1 flagged)')

  // Create moderation log for flagged post
  await prisma.moderationLog.create({
    data: {
      contentId: flaggedPost.id,
      contentType: 'post',
      action: 'flag',
      reason: 'Contains medical advice - violates non-clinical boundary',
      details: JSON.stringify({
        flags: ['should stop taking', 'instead of medication'],
        autoDetected: true,
      }),
      automated: true,
      aiModel: 'content-filter-v1',
    },
  })

  console.log('✅ Created moderation log')

  // Create sample events
  const jazzEvent = await prisma.event.create({
    data: {
      title: 'Sanctuary Jazz: Evening of Standards',
      description: 'A sit-and-listen evening of jazz standards and spirituals. Dim lights, seated rows, no required posture. Bring blankets and the body you have tonight.',
      eventType: 'jazz',
      room: 'jazz',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours
      capacity: 50,
      isVirtual: true,
      requiresRsvp: true,
      recordingConsent: true,
      createdById: user3.id,
    },
  })

  const comedyEvent = await prisma.event.create({
    data: {
      title: 'Collective Wit: Open Mic Night',
      description: 'Comedy showcase vetted on a single rule: earn the laugh from inside the community, never at its expense. Live captioning on every set.',
      eventType: 'comedy',
      room: 'comedy',
      startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 90 minutes
      capacity: 100,
      isVirtual: true,
      requiresRsvp: true,
      recordingConsent: false,
      createdById: user3.id,
    },
  })

  const wellnessEvent = await prisma.event.create({
    data: {
      title: 'Grounding Rituals Workshop',
      description: 'Learn box breathing and other grounding techniques for managing thyroid storms. Led by a trauma-informed wellness coach.',
      eventType: 'wellness',
      room: 'wellness',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour
      capacity: 30,
      isVirtual: true,
      requiresRsvp: true,
      recordingConsent: true,
      createdById: user3.id,
    },
  })

  console.log('✅ Created 3 events')

  // Create RSVPs
  await prisma.eventRSVP.create({
    data: {
      eventId: jazzEvent.id,
      userId: user1.id,
      status: 'attending',
      consentToRecord: true,
    },
  })

  await prisma.eventRSVP.create({
    data: {
      eventId: wellnessEvent.id,
      userId: user2.id,
      status: 'attending',
      consentToRecord: true,
    },
  })

  console.log('✅ Created 2 RSVPs')

  // Create verified providers
  const provider1 = await prisma.provider.create({
    data: {
      name: 'Dr. Aisha Thompson',
      specialty: 'Endocrinology',
      category: 'endocrinologist',
      description: 'Board-certified endocrinologist specializing in thyroid disorders. Culturally competent care for Black women.',
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: user3.id,
      verificationNotes: 'Verified credentials and patient reviews',
      email: 'dr.thompson@example.com',
      phone: '(555) 123-4567',
      website: 'https://example.com/dr-thompson',
      acceptingPatients: true,
      insuranceAccepted: ['Blue Cross', 'Aetna', 'United Healthcare', 'Medicare'],
    },
  })

  const provider2 = await prisma.provider.create({
    data: {
      name: 'Wellness Center for Black Women',
      specialty: 'Holistic Wellness',
      category: 'wellness',
      description: 'Culturally grounded wellness center offering yoga, meditation, and stress management specifically for Black women with chronic illness.',
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: user3.id,
      email: 'info@wellnesscenter.example.com',
      phone: '(555) 234-5678',
      website: 'https://example.com/wellness',
      acceptingPatients: true,
      insuranceAccepted: [],
    },
  })

  const provider3 = await prisma.provider.create({
    data: {
      name: 'Dr. Marcus Johnson',
      specialty: 'Mental Health',
      category: 'therapist',
      description: 'Licensed therapist specializing in chronic illness and medical trauma. Understands the intersection of race and healthcare.',
      verified: true,
      verifiedAt: new Date(),
      verifiedBy: user3.id,
      email: 'dr.johnson@example.com',
      phone: '(555) 345-6789',
      acceptingPatients: true,
      insuranceAccepted: ['Blue Cross', 'Cigna', 'Aetna'],
    },
  })

  console.log('✅ Created 3 verified providers')

  // Create feature flags
  await prisma.featureFlag.create({
    data: {
      name: 'sisterhood_lounge',
      description: 'Real-time chat feature for peer support',
      enabled: false,
      rolloutPercent: 0,
      purpose: 'Reduce isolation through real-time community connection',
      evidenceLink: 'docs/EVIDENCE_INDEX.md#sisterhood-lounge',
    },
  })

  await prisma.featureFlag.create({
    data: {
      name: 'data_store',
      description: 'Apple Store-style health data interaction',
      enabled: false,
      rolloutPercent: 0,
      purpose: 'Empower users to understand and own their health data',
      evidenceLink: 'docs/PRODUCT_DEFINITION.md#data-store',
    },
  })

  await prisma.featureFlag.create({
    data: {
      name: 'ai_moderation',
      description: 'AI-assisted content moderation with cultural safety',
      enabled: true,
      rolloutPercent: 100,
      purpose: 'Enforce non-clinical boundary and cultural safety at scale',
      evidenceLink: 'docs/EVIDENCE_INDEX.md#content-moderation',
    },
  })

  console.log('✅ Created 3 feature flags')

  // Create sample research data (anonymized)
  await prisma.researchDataPoint.create({
    data: {
      dataType: 'symptom',
      category: 'heat_sensitivity',
      value: JSON.stringify({
        severity: 8,
        frequency: 'daily',
        triggers: ['exercise', 'stress', 'warm_weather'],
      }),
      timestamp: new Date(),
      anonymized: true,
      validated: true,
      validatedAt: new Date(),
      validatedBy: user3.id,
    },
  })

  await prisma.researchDataPoint.create({
    data: {
      dataType: 'treatment_response',
      category: 'medication',
      value: JSON.stringify({
        medication: 'methimazole',
        dosage: '10mg',
        response: 'positive',
        sideEffects: ['mild_nausea'],
        duration_months: 6,
      }),
      timestamp: new Date(),
      anonymized: true,
      validated: true,
      validatedAt: new Date(),
      validatedBy: user3.id,
    },
  })

  console.log('✅ Created 2 research data points')

  // Create audit log entries
  await prisma.auditLog.create({
    data: {
      userId: user1.id,
      action: 'consent_granted',
      resource: 'consent_record',
      details: JSON.stringify({
        consentType: 'research',
        version: '1.0',
      }),
    },
  })

  console.log('✅ Created audit log entries')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\nCreated:')
  console.log('  - 3 users (2 community members, 1 admin)')
  console.log('  - 4 posts (3 approved, 1 flagged for review)')
  console.log('  - 3 events (jazz, comedy, wellness)')
  console.log('  - 2 RSVPs')
  console.log('  - 3 verified providers')
  console.log('  - 3 feature flags')
  console.log('  - 2 research data points')
  console.log('  - Consent records and audit logs')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

// Made with Bob
