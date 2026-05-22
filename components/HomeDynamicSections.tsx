'use client';

import dynamic from 'next/dynamic';

export const BuyerPersonaSelector = dynamic(() => import('./BuyerPersonaSelector'), { ssr: false });
export const ScienceProof = dynamic(() => import('./ScienceProof'), { ssr: false });
export const SocialProof = dynamic(() => import('./SocialProof'), { ssr: false });
export const CostCalculator = dynamic(() => import('./CostCalculator'), { ssr: false });
export const ResultsTimeline = dynamic(() => import('./ResultsTimeline'), { ssr: false });
export const RiskReversal = dynamic(() => import('./RiskReversal'), { ssr: false });
export const NewsletterCapture = dynamic(() => import('./NewsletterCapture'), { ssr: false });
