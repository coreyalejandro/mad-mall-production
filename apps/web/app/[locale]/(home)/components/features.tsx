import type { Dictionary } from "@repo/internationalization";
import {
  MessageCircle,
  Lightbulb,
  Heart,
  MapPin,
} from "lucide-react";

type FeaturesProps = {
  dictionary: Dictionary;
};

/**
 * Features — The Mall Directory
 *
 * Design: ZMUX monolithic cards + Condé Nast editorial grid.
 * Layout: Asymmetric 2+1 / 1+2 magazine spread.
 * Each "store" in the mall gets a card with contextual icon.
 */

const featureIcons = [
  { icon: MessageCircle, accent: "#a65d45" },  // Sisterhood Lounge — terracotta
  { icon: Lightbulb, accent: "#b38b4d" },       // The Data Store — soul gold
  { icon: Heart, accent: "#4b6a6d" },           // Live Experiences — clinical teal
  { icon: MapPin, accent: "#a65d45" },          // Service Directory — terracotta
];

export const Features = ({ dictionary }: FeaturesProps) => (
  <div className="w-full py-20 lg:py-32" id="features">
    <div className="container mx-auto">
      <div className="flex flex-col gap-12">
        {/* Section header */}
        <div className="flex flex-col items-start gap-4">
          <p
            className="text-xs uppercase tracking-[0.3em]"
            style={{
              color: '#4b6a6d',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            The Mall Directory
          </p>
          <div className="flex flex-col gap-2">
            <h2
              className="max-w-xl text-left text-3xl font-bold uppercase tracking-tight md:text-5xl"
              style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
            >
              {dictionary.web.home.features.title}
            </h2>
            <p className="max-w-xl text-left text-lg leading-relaxed tracking-tight opacity-70 lg:max-w-lg">
              {dictionary.web.home.features.description}
            </p>
          </div>
        </div>

        {/* Magazine grid — asymmetric 2+1, 1+2 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Large card — Sisterhood Lounge */}
          <div
            className="group flex aspect-square flex-col justify-between rounded-[30px] p-8 transition-all duration-500 hover:-translate-y-1 lg:col-span-2 lg:aspect-auto"
            style={{
              background: `rgba(166, 93, 69, 0.08)`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(166, 93, 69, 0.15)',
            }}
          >
            <featureIcons[0].icon
              className="h-8 w-8 stroke-1"
              style={{ color: featureIcons[0].accent }}
            />
            <div className="flex flex-col">
              <h3
                className="text-xl font-bold uppercase tracking-tight"
                style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
              >
                {dictionary.web.home.features.items[0].title}
              </h3>
              <p className="max-w-md text-base opacity-60">
                {dictionary.web.home.features.items[0].description}
              </p>
            </div>
          </div>

          {/* Small card — Data Store */}
          <div
            className="group flex aspect-square flex-col justify-between rounded-[30px] p-8 transition-all duration-500 hover:-translate-y-1"
            style={{
              background: '#b38b4d',
              color: '#fcfaf2',
            }}
          >
            <featureIcons[1].icon className="h-8 w-8 stroke-1" style={{ color: '#fcfaf2' }} />
            <div className="flex flex-col">
              <h3
                className="text-xl font-bold uppercase tracking-tight"
                style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
              >
                {dictionary.web.home.features.items[1].title}
              </h3>
              <p className="max-w-xs text-base opacity-80">
                {dictionary.web.home.features.items[1].description}
              </p>
            </div>
          </div>

          {/* Small card — Live Experiences */}
          <div
            className="group flex aspect-square flex-col justify-between rounded-[30px] p-8 transition-all duration-500 hover:-translate-y-1"
            style={{
              background: `rgba(75, 106, 109, 0.08)`,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(75, 106, 109, 0.15)',
            }}
          >
            <featureIcons[2].icon
              className="h-8 w-8 stroke-1"
              style={{ color: featureIcons[2].accent }}
            />
            <div className="flex flex-col">
              <h3
                className="text-xl font-bold uppercase tracking-tight"
                style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
              >
                {dictionary.web.home.features.items[2].title}
              </h3>
              <p className="max-w-xs text-base opacity-60">
                {dictionary.web.home.features.items[2].description}
              </p>
            </div>
          </div>

          {/* Large card — Service Directory */}
          <div
            className="group flex aspect-square flex-col justify-between rounded-[30px] p-8 transition-all duration-500 hover:-translate-y-1 lg:col-span-2 lg:aspect-auto"
            style={{
              background: '#141414',
              color: '#fcfaf2',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.3)',
            }}
          >
            <featureIcons[3].icon className="h-8 w-8 stroke-1" style={{ color: '#b38b4d' }} />
            <div className="flex flex-col">
              <h3
                className="text-xl font-bold uppercase tracking-tight"
                style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
              >
                {dictionary.web.home.features.items[3].title}
              </h3>
              <p className="max-w-md text-base opacity-60">
                {dictionary.web.home.features.items[3].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
