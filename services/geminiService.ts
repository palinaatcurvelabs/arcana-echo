import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Spread, DrawnCard, Reading, UserProfile, CardInterpretation, Deck, ReadingRecord } from '../types';
import { TAROT_CARDS, MAJOR_ARCANA_NAMES, getCardDisplayName } from '../data/tarotData';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const spreadSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        suggestedSpreadNames: {
            type: Type.ARRAY,
            description: "An array containing the exact names (spreadName) of the three most relevant spreads for the user's journal entry.",
            items: { type: Type.STRING }
        }
    },
    required: ["suggestedSpreadNames"]
};

const readingGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        cardInterpretations: {
            type: Type.ARRAY,
            description: "A detailed breakdown of each card drawn.",
            items: {
                type: Type.OBJECT,
                properties: {
                    cardName: { type: Type.STRING },
                    orientation: {
                        type: Type.STRING,
                        description: "The card's orientation as provided in the prompt ('upright' or 'reversed').",
                        enum: ['upright', 'reversed']
                    },
                    generalMeaning: { 
                        type: Type.STRING,
                        description: "The card's general meaning in this deck."
                    },
                    contextualMeaning: {
                        type: Type.STRING,
                        description: "The card's meaning as it relates to its position, the user's journal entry, and their personal context."
                    }
                },
                required: ["cardName", "orientation", "generalMeaning", "contextualMeaning"]
            }
        },
        interpretation: {
            type: Type.STRING,
            description: "The full, narrative tarot reading."
        },
        retool: {
            type: Type.STRING,
            description: "A single, actionable piece of advice."
        },
        keyTakeaways: {
            type: Type.ARRAY,
            description: "3-4 short summary points.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["cardInterpretations", "interpretation", "retool", "keyTakeaways"]
};

// Build personal context from profile and history
const buildPersonalContext = (
    userProfile: UserProfile | null, 
    history: ReadingRecord[] = []
): string => {
    if (!userProfile) return "No personal context available.";
    
    const parts: string[] = [];
    
    // Name
    if (userProfile.name) {
        parts.push(`Speaking to: ${userProfile.name}`);
    }
    
    // Reading style
    const styleDescriptions = {
        'direct': 'Be clear and straightforward. No fluff, get to the point.',
        'gentle': 'Be compassionate and supportive. Soften difficult truths.',
        'poetic': 'Use mystical, metaphor-rich language. Be evocative and atmospheric.'
    };
    parts.push(`Communication style: ${styleDescriptions[userProfile.readingStyle]}`);
    
    // Focus areas
    if (userProfile.focusAreas.length > 0) {
        parts.push(`Current focus areas: ${userProfile.focusAreas.join(', ')}`);
    }
    
    // Current intentions
    if (userProfile.intentions) {
        parts.push(`What they're working through: "${userProfile.intentions}"`);
    }
    
    // Recent patterns from history
    if (history.length > 0) {
        const recentReadings = history.slice(0, 5);
        const recentCards: Record<string, number> = {};
        const recentThemes: string[] = [];
        
        recentReadings.forEach(r => {
            r.drawnCards.forEach(c => {
                recentCards[c.cardName] = (recentCards[c.cardName] || 0) + 1;
            });
            if (r.journalEntry) {
                recentThemes.push(r.journalEntry.slice(0, 100));
            }
        });
        
        // Cards appearing multiple times recently
        const frequentRecent = Object.entries(recentCards)
            .filter(([_, count]) => count > 1)
            .map(([card]) => card);
        
        if (frequentRecent.length > 0) {
            parts.push(`Cards appearing frequently in recent readings: ${frequentRecent.join(', ')} - acknowledge this pattern if relevant.`);
        }
        
        parts.push(`They have done ${history.length} readings total.`);
    }
    
    return parts.join('\n');
};

export const getSpreadSuggestions = async (journalEntry: string, allSpreads: Spread[]): Promise<Spread[]> => {
    try {
        const availableSpreadsString = allSpreads.map(s => `- ${s.spreadName}: ${s.description}`).join('\n');

        const prompt = `You are an expert tarot reader AI. A user has provided a journal entry. Suggest the three most relevant spreads.

**User's Journal Entry:**
"${journalEntry}"

**Available Spreads:**
${availableSpreadsString}

Respond ONLY with a JSON object that follows the schema.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: spreadSuggestionSchema,
            }
        });

        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString) as { suggestedSpreadNames: string[] };
        
        const suggestedSpreads = allSpreads.filter(spread => parsedJson.suggestedSpreadNames.includes(spread.spreadName));
        
        const missingCount = 3 - suggestedSpreads.length;

        if (missingCount > 0) {
             const defaultSpreads = [
                allSpreads.find(s => s.spreadName === "Three Card Spread"),
                allSpreads.find(s => s.spreadName === "Mind, Body, Spirit"),
                allSpreads.find(s => s.spreadName === "Situation, Obstacle, Advice")
            ].filter((s): s is Spread => s !== undefined);

            for (const defaultSpread of defaultSpreads) {
                if (suggestedSpreads.length >= 3) break;
                if (!suggestedSpreads.some(s => s.spreadName === defaultSpread.spreadName)) {
                    suggestedSpreads.push(defaultSpread);
                }
            }
        }

        return suggestedSpreads.slice(0, 3);

    } catch (error) {
        console.error("Error getting spread suggestion:", error);
        throw new Error("Failed to get spread suggestion from AI.");
    }
};

export const generateTarotReading = async (
    journalEntry: string, 
    spread: Spread, 
    drawnCards: DrawnCard[],
    userProfile: UserProfile | null,
    deck: Deck | undefined,
    history: ReadingRecord[] = []
): Promise<Omit<Reading, 'conversation'>> => {
    try {
        // Map drawn cards to deck-specific names for the prompt
        const drawnCardsString = drawnCards.map(c => {
             const displayName = getCardDisplayName(c.cardName, deck);
             return `- ${c.position}: ${displayName} (${c.orientation}) [Standard: ${c.cardName}]`;
        }).join('\n');

        const deckContextString = deck && deck.isCustom
            ? `**Using Custom Deck: ${deck.name}**
Theme/Description: ${deck.description}
Major Arcana Mappings: ${JSON.stringify(deck.majorArcana)}
Suit Mappings: ${JSON.stringify(deck.suits)}
Interpret the cards based on this custom theme. For example, if "The Fool" is "${deck.majorArcana['The Fool']}", interpret the card using the archetype of The Fool but through the lens of "${deck.majorArcana['The Fool']}".`
            : "**Using Standard Rider-Waite Tarot Deck**";

        const personalContext = buildPersonalContext(userProfile, history);
        
        const journalContextString = journalEntry 
            ? `User's Journal Entry: "${journalEntry}"`
            : `User's Focus: General Guidance based on the spread.`;

        const prompt = `You are "Arcana," a wise esoteric guide. You are deeply personal and adaptive - you remember patterns and speak directly to this person's journey.

**1. Personal Context**
${personalContext}

**2. Current Reading Context**
${journalContextString}

**3. Tarot Deck**
${deckContextString}

**4. Spread**
${spread.spreadName}: ${spread.theme}

**5. Cards Drawn**
${drawnCardsString}

**Task:**
Provide a deeply personalized reading. 
- For 'cardInterpretations', use the **Custom Deck Name** for 'cardName'.
- Reference their personal context naturally (their focus areas, what they're working through).
- If a card has appeared frequently for them, acknowledge this as significant.
- Synthesize the reading in 'interpretation' using their preferred communication style.
- Provide a 'retool' (actionable advice specific to their situation).
- Provide 'keyTakeaways'.

Respond ONLY with JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: readingGenerationSchema,
            }
        });
        
        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        return parsedJson as Omit<Reading, 'conversation'>;

    } catch (error) {
        console.error("Error generating tarot reading:", error);
        throw new Error("Failed to generate tarot reading from AI.");
    }
};

export const getFollowUpAnswer = async (
    journalEntry: string, 
    spread: Spread, 
    drawnCards: DrawnCard[],
    initialReading: Reading, 
    followUpQuestion: string,
    userProfile: UserProfile | null
): Promise<{ answer: string }> => {
     try {
        const fullReadingContext = `
        Initial Focus: "${journalEntry || 'General Guidance'}"
        Spread: ${spread.spreadName}
        Cards Drawn: ${drawnCards.map(c => `${c.position}: ${c.cardName}`).join(', ')}
        Initial Interpretation: "${initialReading.interpretation}"
        Conversation History: ${initialReading.conversation.map(c => `User: "${c.question}"\nAI: "${c.answer}"`).join('\n')}
        `;
        
        const styleNote = userProfile?.readingStyle 
            ? `Respond in a ${userProfile.readingStyle} style.`
            : '';
        
        const prompt = `You are "Arcana," a tarot reader AI.
        
        Context:
        ${fullReadingContext}

        User Question: "${followUpQuestion}"

        ${styleNote}
        Provide a concise, wise answer based on the reading.
        ${userProfile?.name ? `Address them as ${userProfile.name} if natural.` : ''}
        Respond ONLY with a JSON object { "answer": "..." }.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { answer: { type: Type.STRING } },
                    required: ["answer"]
                },
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error getting follow-up answer:", error);
        throw new Error("Failed to get follow-up answer from AI.");
    }
};

export const getClarifyingCard = async (
    readingContext: {
        journalEntry: string;
        spread: Spread;
        reading: Reading;
        userProfile: UserProfile | null;
    },
    cardToClarify: CardInterpretation
): Promise<{ cardName: string, meaning: string }> => {
    try {
        const styleNote = readingContext.userProfile?.readingStyle 
            ? `Respond in a ${readingContext.userProfile.readingStyle} style.`
            : '';
            
        const prompt = `You are "Arcana," a wise tarot reader AI.
        
        The user wants to clarify the card "${cardToClarify.cardName}" from their reading.
        The reading context was: "${readingContext.journalEntry || 'General guidance'}"
        
        Select a new card from the standard 78-card tarot deck to clarify it.
        ${styleNote}
        
        Respond ONLY with JSON { "cardName": "...", "meaning": "..." }.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { cardName: { type: Type.STRING }, meaning: { type: Type.STRING } },
                    required: ["cardName", "meaning"]
                },
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch(error) {
        console.error("Error getting clarifying card:", error);
        throw new Error("Failed to get clarifying card from AI.");
    }
};

export const generateSpokenReading = async (text: string): Promise<string> => {
     try {
        const prompt = `Narrate this tarot reading in a calm, wise voice.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `${prompt}\n\n${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data received.");
        return base64Audio;

    } catch (error) {
        console.error("Error generating spoken reading:", error);
        throw new Error("Failed to generate spoken reading from AI.");
    }
};
