/**
 * gravesTour.ts
 * Full content dataset for "Inside a Black Woman's Body with Graves’ Disease: A Guided Tour".
 * - Chapters define parallax background layers and paragraphs for TTS narration.
 * - Images use the smart placeholder system.
 */

import { ParallaxLayerConfig } from '../components/immersive/ParallaxScene'

/** A single chapter in the immersive tour. */
export interface Chapter {
  /** Stable id for anchors and keys */
  id: string
  /** Headline for the chapter card */
  title: string
  /** Background parallax layers */
  layers: ParallaxLayerConfig[]
  /** Body paragraphs rendered and narrated */
  paragraphs: string[]
}

/** Utility: flatten all paragraphs for narration segments. */
export function getAllSegments(chapters: Chapter[]): string[] {
  return chapters.flatMap((c) => c.paragraphs)
}

/** Shared helper to build a simple layered scene. */
function layersFor(keywords: string[], strengths: number[] = [10, 6, 3]): ParallaxLayerConfig[] {
  return keywords.slice(0, 3).map((kw, i) => ({
    depth: strengths[i] ?? 4,
    src: `https://pub-cdn.sider.ai/u/U0Y3H76Z3L/web-coder/68a396227b28bae49806fe22/resource/bd36faf8-ea92-4ad1-b8f4-1fab5e04a330.jpg`,
    overlayGradient: i === 0 ? 'from-black/60 via-black/20 to-transparent' : undefined,
    opacity: i === 2 ? 0.9 : 1,
  }))
}

/**
 * Full chapters content.
 * Note: Text is taken from the provided document; minor formatting edits applied for paragraphs.
 */
export const chapters: Chapter[] = [
  {
    id: 'intro',
    title: 'Welcome to the Inner Tour',
    layers: layersFor(['aurora lights', 'nebula', 'ocean fog']),
    paragraphs: [
      "Imagine we could shrink down and journey inside your body – a beautiful, resilient Black woman’s body – to see exactly what’s happening as Graves’ disease unfolds. As Black women, we often carry the weight of the world and might be the last to know when something is going wrong within us. But you’re not alone: Graves’ disease (an autoimmune form of hyperthyroidism) disproportionately affects women (about a 3% lifetime risk in women versus 0.5% in men), and Black individuals have nearly twice the risk of developing Graves’ as white individuals. So let's take a compassionate, no-nonsense tour through your body, showing you what’s really going on and marveling at how strong you truly are.",
    ],
  },
  {
    id: 'thyroid',
    title: 'The Thyroid: Tiny Gland, Big Drama',
    layers: layersFor(['thyroid neck anatomy', 'warm glow', 'butterfly gland']),
    paragraphs: [
      "We start our tour at the base of your neck, where a small butterfly-shaped gland – your thyroid – resides. Normally, this gland is the steady metronome of your metabolism, quietly releasing just the right amount of thyroid hormone. But now, we see it lit up like a furnace.",
      "Why? Because your own immune system has mistakenly declared war on it. In Graves’ disease, your immune system produces special antibodies (thyroid-stimulating immunoglobulins) that latch onto your thyroid and trick it into working overtime. It's like someone hit the “boost” button and broke it off – the thyroid cells are flooded with the signal to make more and more hormone.",
      "As a result, the thyroid swells up (forming a goiter you might even notice as a fullness or bulge in your neck) and starts pumping out thyroid hormones at a frantic pace.",
      "These hormones (T3 and T4) tell every cell in your body how fast to work. Now they're surging through your bloodstream in excess, turning up the dial on your body's metabolism. It's as if the thermostat got stuck on high. You begin to burn energy at a furious rate – your cells are doing everything faster than before.",
      "You often feel overly warm or heat-intolerant, sweating more as your body tries to cool off. And with a revved-up metabolism, you might notice weight loss even if you’re eating more than usual – a classic hypermetabolic state.",
    ],
  },
  {
    id: 'heart',
    title: 'Heart in Overdrive',
    layers: layersFor(['heart anatomy', 'red pulse', 'cardiovascular light']),
    paragraphs: [
      "As we approach your heart, it’s beating hard and fast, like a drummer on double speed. Those excess thyroid hormones are like adrenaline’s hype squad: they cause your heart to race and pound, even when you’re just sitting still. You might feel this as a rapid pulse or palpitations – that unsettling sensation that your heart is fluttering or skipping beats.",
      "Biologically, thyroid hormones make your heart muscle extra sensitive to adrenaline and amplify the signals that speed it up. Your heart is essentially being told to “go, go, go!” all the time. It’s pumping blood faster to keep up with your body’s heightened demands, which is why you might experience high blood pressure or get winded easily.",
      "Yet, even as your heart hustles like it’s doing cardio 24/7, it’s not betraying you. Your heart is strong – adapting to keep your body supplied. The pounding is a sign of your body’s determination to keep everything running in the face of chaos.",
    ],
  },
  {
    id: 'brain',
    title: 'The Brain and Nerves: Mind on High Alert',
    layers: layersFor(['brain neurons', 'synapse sparks', 'electric lines']),
    paragraphs: [
      "Up in your brain, the command center, the effects of extra thyroid hormone feel like someone hit fast-forward on your emotions and nerves. Neurons light up like a switchboard stuck on overdrive. Chemically, the surplus hormones make nerve cells more excitable and dial down the brain’s usual calm signals.",
      "The result? You feel edgy and anxious – your mind racing as fast as your pulse. Small problems might suddenly feel overwhelming, or your patience runs thin. This isn’t “just in your head”; it’s a physical effect of Graves’ disease flooding your system with stimulants.",
      "At night, when you want to rest, your brain struggles to wind down. Racing thoughts and insomnia aren’t a personal failing – it’s your revved-up thyroid refusing to let your brain relax. By day, fine muscle tremors can make your hands shaky, another sign of heightened nerve activity.",
      "Despite this, your nervous system is trying to cope. The pituitary gland senses the excess thyroid hormone and cuts back TSH, desperately yelling “slow down!” But in Graves’ disease, the thyroid isn’t listening under the sway of those rogue antibodies.",
    ],
  },
  {
    id: 'skin-hair',
    title: 'Skin, Hair, and Scalp: Signals from the Surface',
    layers: layersFor(['black woman skin macro', 'hair texture', 'water drops skin']),
    paragraphs: [
      "On the surface – your skin and hair – Graves’ disease leaves its mark. With your metabolism in overdrive, your body generates more heat and your sweat glands work overtime to cool you down.",
      "Your skin is often warm and damp from excessive sweating. When it evaporates, it can leave your skin a bit dry or irritated, leading to itchiness. Generalized itchiness, even hives or a rash, can be a symptom of an overactive thyroid.",
      "On your scalp and hair follicles, high thyroid levels disturb the normal hair growth cycle, leading to diffuse thinning or patchy hair loss. Hair may become finer or drier and shed more easily.",
      "Here’s reassurance: hair follicles are resilient. Once thyroid levels normalize, they often recover and hair can grow back. Your palms may look a bit more reddish due to increased blood flow; nails can soften or lift at the tips (onycholysis). Surface echoes of the storm beneath.",
    ],
  },
  {
    id: 'eyes',
    title: 'Eyes: Under Pressure',
    layers: layersFor(['eye closeup', 'orbital anatomy', 'light rays']),
    paragraphs: [
      "Behind your eyes, in the eye sockets, the immune attack can also target tissues. In roughly 1 in 3 people with Graves’, inflammation swells the normally slim, cushiony tissues.",
      "This swelling gently pushes the eyes forward, leading to a protruding look and eyelid retraction – that characteristic wide-eyed “Graves’ stare.”",
      "Because the eyelids may not close completely, the eye surface dries out, causing gritty, itchy, irritated eyes. Eye muscles can be affected, leading to double vision or ache behind the eyes.",
      "The eye process usually has an active phase that plateaus and improves with time and care (lubrication, protective measures, medications). Your body aims to protect your vision; it’s simply caught in a crossfire.",
    ],
  },
  {
    id: 'muscles-bones',
    title: 'Muscles and Bones: Shaken but Strong',
    layers: layersFor(['muscle fibers macro', 'bone xray', 'strength silhouette']),
    paragraphs: [
      "In your muscles (thighs, arms, shoulders), fibers can look tired and thinned. Hyperthyroidism can make the body break down muscle protein faster than it builds it, leading to weakness over time.",
      "You might feel restless and jittery, yet physically weaker. Large muscle groups (thighs, upper arms) are classically affected. It’s not lack of effort – your muscles are being overworked by the rapid metabolism.",
      "Bones are also reacting. Normally, bones are constantly remodeled, but excess thyroid hormone speeds breakdown and impairs rebuilding. Over time, this can decrease bone density (osteoporosis) and increase fracture risk if untreated.",
      "The good news: treatment helps muscles regrow stronger fibers and bones regain density with proper care. Your body is primed to rebound.",
    ],
  },
  {
    id: 'resilience',
    title: 'The Body’s Resilience and Healing',
    layers: layersFor(['sunrise', 'mountains light', 'flower bloom']),
    paragraphs: [
      "Step back and appreciate the bigger picture. Graves’ disease turned many systems up to 11 – thyroid fueling the fire, heart racing, nerves buzzing, skin sweating, hair shedding, eyes bulging. It can feel frightening, as if your body turned against you.",
      "The empowering truth: your body is not your enemy. It’s been doing what it thinks it must to protect you, even if those attempts are overwhelming. Antibodies were made by an immune system that normally defends you – it’s just mistaken here.",
      "Once the thyroid is calmed (medications, radioactive iodine, or other treatments), like a conductor easing an orchestra, everything else slows to a healthier tempo. Heart rate settles, jitters and sleeplessness ease, skin cools, hair regrows, weight stabilizes, eyes plateau and improve with care.",
      "Your body has fought for you every minute. Now you and your care team can work with your body to calm the storm.",
    ],
  },
  {
    id: 'conclusion',
    title: 'Conclusion: Embracing Your Body’s Strength',
    layers: layersFor(['calm ocean', 'golden hour', 'hope light']),
    paragraphs: [
      "Your journey continues with you in the driver’s seat, empowered by understanding. It’s serious and tough, but not a mystery anymore. You’ve witnessed the power of your defenses and healing potential.",
      "Give yourself grace on hard days. Graves’ disease is treatable, and the outlook is generally very good once managed. Treatments like antithyroid medications reduce hormone production, and beta-blockers can ease the racing heart in the meantime.",
      "Keep your light and humor. It’s okay to nickname your overactive thyroid your “little diva” for stealing the spotlight – making this journey less scary puts you in control.",
      "Your body is yours – beautifully complex, sometimes challenging, deeply resilient. With knowledge and care, this chapter can become a story of empowerment.",
    ],
  },
  {
    id: 'sources',
    title: 'Sources',
    layers: layersFor(['paper texture', 'library books', 'research desk'], [4, 3, 2]),
    paragraphs: [
      "Pokhrel B., Bhusal K. Graves Disease. StatPearls (2023).",
      "Xie C. et al. Prevalence of Thyroid Dysfunction in US Adolescents. Front. Public Health (2024).",
      "Cleveland Clinic. Graves’ Disease – Causes, Symptoms, Complications, Treatment (2023).",
      "NHS (UK). Overactive Thyroid (Hyperthyroidism) – Symptoms (2023).",
      "Mullur R. et al. Thyroid Hormone Regulation of Metabolism. Physiol Rev. (2014).",
      "Medical News Today. Itching due to thyroid disorders (2023).",
      "Tan CE, Loh KY. Generalised pruritus as a presentation of Graves’ disease. Malays Fam Physician (2013).",
      "Additional links as provided in the original document.",
    ],
  },
]
