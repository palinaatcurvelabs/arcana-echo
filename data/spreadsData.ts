import type { Spread } from '../types';

export const SPREADS: Spread[] = [
    // --- General Guidance ---
    {
        theme: "General Guidance",
        spreadName: "Card of the Day",
        description: "Draw a single card for quick daily guidance, insight, or a theme to meditate on.",
        numberOfCards: 1,
        positions: ["Card of the Day"]
    },
    {
        theme: "General Guidance",
        spreadName: "Three Card Spread",
        description: "A classic spread for a quick overview of a situation, covering the past, present, and future.",
        numberOfCards: 3,
        positions: ["Past", "Present", "Future"]
    },
    {
        theme: "General Guidance",
        spreadName: "The Celtic Cross",
        description: "A comprehensive and classic spread that provides a deep dive into a situation from multiple angles.",
        numberOfCards: 10,
        positions: [
            "The Heart of the Matter",
            "The Challenge",
            "The Foundation (Past)",
            "The Recent Past",
            "The Crown (Potential Outcome)",
            "The Near Future",
            "Your Attitude",
            "External Influences",
            "Hopes and Fears",
            "The Final Outcome"
        ]
    },
    {
        theme: "General Guidance",
        spreadName: "Weekly Check-in",
        description: "A spread for regular reflection to understand the energies of the week ahead.",
        numberOfCards: 4,
        positions: ["Last Week's Lesson", "This Week's Focus", "A Challenge to Expect", "Guidance for the Week"]
    },
    {
        theme: "General Guidance",
        spreadName: "Monthly Outlook",
        description: "Get an overview of the key themes and energies for the month ahead.",
        numberOfCards: 5,
        positions: ["Theme of the Month", "Challenge to Overcome", "Opportunity for Growth", "What to Focus On", "Message from Spirit"]
    },
    {
        theme: "General Guidance",
        spreadName: "Dream Interpretation",
        description: "Uncover the hidden messages and guidance within a recent or recurring dream.",
        numberOfCards: 4,
        positions: ["The Core of the Dream", "What My Subconscious is Revealing", "The Waking Life Connection", "Actionable Guidance from the Dream"]
    },
    // --- Self-Reflection & Personal Growth ---
    {
        theme: "Self-Reflection",
        spreadName: "Mind, Body, Spirit",
        description: "A spread for checking in with yourself on three key levels of your being.",
        numberOfCards: 3,
        positions: ["Your Mind (Thoughts)", "Your Body (Physical State)", "Your Spirit (Inner Self)"]
    },
    {
        theme: "Personal Growth",
        spreadName: "Shadow Work",
        description: "A spread to gently explore the hidden or unacknowledged parts of the self to promote healing and integration.",
        numberOfCards: 3,
        positions: ["What is Hidden", "Why it is Hidden", "How to Integrate It"]
    },
    {
        theme: "Personal Growth",
        spreadName: "Inner Child Healing",
        description: "Connect with and understand the needs of your inner child for profound emotional healing.",
        numberOfCards: 4,
        positions: ["Your Inner Child's State", "What They Need to Hear", "How You Can Nurture Them", "A Gift From Them to You"]
    },
    {
        theme: "Personal Growth",
        spreadName: "Self-Love Journey",
        description: "A gentle spread to cultivate deeper self-compassion and appreciation for who you are.",
        numberOfCards: 4,
        positions: ["What I Love About Myself", "How to Be Kinder to Myself", "A Limiting Belief to Release", "An Act of Self-Love to Embrace"]
    },
    {
        theme: "Personal Growth",
        spreadName: "Path to Manifestation",
        description: "Clarify your goals and understand the steps needed to bring your desires into reality.",
        numberOfCards: 5,
        positions: ["What I Wish to Manifest", "My Current Energetic Alignment", "An Obstacle to Clear", "A Resource I Already Have", "The Next Aligned Action"]
    },
     // --- Love & Relationships ---
    {
        theme: "Love & Relationships",
        spreadName: "Relationship Dynamics",
        description: "Explores the dynamics between two people, highlighting individual energies and the relationship itself.",
        numberOfCards: 3,
        positions: ["You", "The Other Person", "The Relationship"]
    },
    {
        theme: "Love & Relationships",
        spreadName: "Moving On",
        description: "A supportive spread for gaining closure and clarity after a relationship has ended.",
        numberOfCards: 3,
        positions: ["What to Release", "What to Embrace", "Your Path Forward"]
    },
    {
        theme: "Love & Relationships",
        spreadName: "Attracting Love",
        description: "Focuses on your own energy and readiness to manifest a new, healthy romantic partnership.",
        numberOfCards: 4,
        positions: ["Your Current Energy", "Blockages to Love", "Qualities to Embody", "How to Attract"]
    },
    {
        theme: "Love & Relationships",
        spreadName: "Relationship Health Check",
        description: "A check-in to assess the strengths, weaknesses, and potential of an existing relationship.",
        numberOfCards: 5,
        positions: ["Foundation of the Relationship", "What is Strong", "What Needs Attention", "How to Nurture Growth", "Future Potential"]
    },
    {
        theme: "Love & Relationships",
        spreadName: "Heart of a Conflict",
        description: "Gain clarity on a disagreement or conflict within a relationship to find a path to resolution.",
        numberOfCards: 4,
        positions: ["My Perspective", "Their Perspective", "The Underlying Issue", "Path to Harmony"]
    },
    // --- Career & Work ---
    {
        theme: "Career & Work",
        spreadName: "Career Path",
        description: "Provides insight into your current career situation, challenges, and potential future direction.",
        numberOfCards: 4,
        positions: ["Current Position", "Strengths", "Challenges", "Potential"]
    },
    {
        theme: "Career & Work",
        spreadName: "Finding Purpose",
        description: "A deep-dive spread to help you find a more fulfilling and aligned career path.",
        numberOfCards: 5,
        positions: ["Your Talents", "Your Passions", "What the World Needs From You", "How You Can Be Rewarded", "Actionable First Step"]
    },
    {
        theme: "Career & Work",
        spreadName: "New Opportunity",
        description: "Use this spread to evaluate a new job offer or business opportunity that has come your way.",
        numberOfCards: 4,
        positions: ["The Opportunity Itself", "What It Offers You", "Potential Challenges", "Long-Term Outcome"]
    },
    {
        theme: "Career & Work",
        spreadName: "Work/Life Balance",
        description: "Find equilibrium between your professional ambitions and personal well-being.",
        numberOfCards: 4,
        positions: ["Current State of Your Work Life", "Current State of Your Personal Life", "Where is the Imbalance?", "How to Find Harmony"]
    },
    {
        theme: "Career & Work",
        spreadName: "Project Potential",
        description: "Assess the potential success and challenges of a new project or creative endeavor.",
        numberOfCards: 4,
        positions: ["The Project's Core Energy", "Strengths to Leverage", "Potential Pitfalls", "Advice for Success"]
    },
    // --- Decision Making & Problem Solving ---
    {
        theme: "Decision Making",
        spreadName: "Two Paths",
        description: "Ideal for when you're facing a choice between two options. Each card illuminates one path.",
        numberOfCards: 2,
        positions: ["Path A", "Path B"]
    },
    {
        theme: "Problem Solving",
        spreadName: "Situation, Obstacle, Advice",
        description: "A straightforward spread to understand a challenge, identify the block, and receive guidance.",
        numberOfCards: 3,
        positions: ["The Situation", "The Obstacle", "Advice"]
    },
    {
        theme: "Decision Making",
        spreadName: "The Crossroads",
        description: "A more detailed decision spread to explore the core of a choice and potential outcomes.",
        numberOfCards: 5,
        positions: ["The Core Issue", "Path A", "Path B", "What You Need to Know", "Guidance From Your Higher Self"]
    },
    {
        theme: "Problem Solving",
        spreadName: "Overcoming Obstacles",
        description: "A more in-depth look at a challenge to find your hidden strengths and the path to resolution.",
        numberOfCards: 5,
        positions: ["The Obstacle", "Its Root Cause", "Your Hidden Strength", "Action to Take", "Likely Outcome"]
    },
    {
        theme: "Problem Solving",
        spreadName: "The Bridge Spread",
        description: "For when you know where you are and where you want to be, but not how to get there.",
        numberOfCards: 4,
        positions: ["Where You Are Now", "Where You Want to Be", "The Obstacle in the Way", "How to Build the Bridge"]
    },
    {
        theme: "Problem Solving",
        spreadName: "Finding Clarity",
        description: "A simple spread for when you're feeling confused and need to cut through the noise.",
        numberOfCards: 3,
        positions: ["What is Confusing Me", "What I Need to Know", "My First Step to Clarity"]
    }
];