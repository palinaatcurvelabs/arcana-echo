

import type { TarotCard, Deck } from '../types';

export const TAROT_CARDS: TarotCard[] = [
    { name: "The Fool", keywords: ["beginnings", "innocence", "spontaneity"], meaning: "Embarking on a new journey with a spirit of innocence and spontaneity. It signifies a leap of faith into the unknown, trusting the universe to provide. This card calls for embracing beginner's luck and the pure potential of a fresh start." },
    { name: "The Magician", keywords: ["manifestation", "resourcefulness", "power"], meaning: "Symbolizes the power of manifestation, resourcefulness, and tapping into your full potential. With all the elements at your disposal, this card signifies the moment where willpower and desire align to create reality. It's time to act with focused intention." },
    { name: "The High Priestess", keywords: ["intuition", "unconscious", "inner voice"], meaning: "The guardian of the unconscious and the mysteries that lie beyond the veil. She represents intuition, inner wisdom, and the secrets of the subconscious. The High Priestess advises you to look beyond the surface and trust the subtle messages of your inner voice." },
    { name: "The Empress", keywords: ["femininity", "beauty", "nature", "nurturing"], meaning: "The embodiment of femininity, nature, and nurturing. She represents creation in all its forms—be it art, a new life, or a flourishing project. The Empress signals a period of abundant growth, sensuality, and a deep connection to the beauty of the earth." },
    { name: "The Emperor", keywords: ["authority", "structure", "control", "father figure"], meaning: "The sovereign ruler of the material world, representing authority, structure, and control. He is a symbol of leadership and ambition, bringing order to chaos. This card points to a need for stability, discipline, and the strategic establishment of foundations." },
    { name: "The Hierophant", keywords: ["tradition", "conformity", "morality", "ethics"], meaning: "The keeper of tradition, spiritual wisdom, and established beliefs. He serves as a bridge between the divine and humanity, representing institutions, mentorship, and the pursuit of knowledge through established systems. This card suggests a path of conformity or seeking guidance from a trusted source." },
    { name: "The Lovers", keywords: ["love", "harmony", "relationships", "choices"], meaning: "Represents the power of union, deep relationships, and the alignment of values. It often signifies a profound choice that must be made from the heart, one that will define who you are. This card is about harmony, attraction, and the connections that shape our soul's journey." },
    { name: "The Chariot", keywords: ["control", "willpower", "victory", "assertion"], meaning: "A symbol of victory, willpower, and forward momentum. It represents overcoming conflict and conquering obstacles through sheer determination and control. The Chariot charges ahead, reminding you to harness opposing forces and channel them towards a singular, triumphant goal." },
    { name: "Strength", keywords: ["strength", "courage", "patience", "compassion"], meaning: "Represents the quiet power of inner strength, courage, and compassion. It is not about brute force, but about taming one's wild instincts and passions with gentleness and self-control. This card speaks to the fortitude of the spirit and the courage that comes from the heart." },
    { name: "The Hermit", keywords: ["soul-searching", "introspection", "solitude"], meaning: "Embarking on a journey of introspection and soul-searching. The Hermit retreats from the noise of the world to seek inner guidance and wisdom. This card signifies a period of solitude for reflection, meditation, and connecting with the light of your own consciousness." },
    { name: "Wheel of Fortune", keywords: ["good luck", "karma", "life cycles", "destiny"], meaning: "Represents the cyclical nature of life, destiny, and karma. It is a symbol of turning points, unexpected events, and the constant dance of fate. The Wheel reminds us that life is always in motion, bringing new opportunities and challenges with every spin." },
    { name: "Justice", keywords: ["justice", "fairness", "truth", "cause and effect"], meaning: "Represents truth, fairness, and the universal law of cause and effect. Justice brings clarity and demands accountability, ensuring that balance is restored. This card indicates that decisions should be made with impartiality and that the consequences of your actions will come to light." },
    { name: "The Hanged Man", keywords: ["pause", "surrender", "letting go", "new perspectives"], meaning: "A symbol of surrender, pause, and profound shifts in perspective. By letting go and suspending action, The Hanged Man finds enlightenment in sacrifice. This card calls for a temporary halt, urging you to see your situation from an entirely new angle before moving forward." },
    { name: "Death", keywords: ["endings", "change", "transformation", "transition"], meaning: "Signifies profound transformation, endings, and the inevitable process of letting go. It rarely points to literal death, but rather the end of a cycle, clearing the way for new beginnings. This card is a powerful call to shed what no longer serves you to allow for rebirth." },
    { name: "Temperance", keywords: ["balance", "moderation", "patience", "purpose"], meaning: "Represents balance, moderation, and the art of alchemy. It is about blending opposing forces to create a harmonious whole, finding the middle path. This card calls for patience and purpose, suggesting that a balanced approach will lead to synergy and healing." },
    { name: "The Devil", keywords: ["bondage", "addiction", "sexuality", "materialism"], meaning: "Represents the shadow self, addiction, and the chains of materialism. It points to self-imposed limitations and attachments that restrict your freedom. The Devil encourages you to confront these patterns with awareness, as recognizing your bondage is the first step to liberation." },
    { name: "The Tower", keywords: ["sudden change", "upheaval", "chaos", "revelation"], meaning: "Symbolizes sudden, dramatic, and often chaotic upheaval. A moment when false structures and beliefs are shattered by a lightning bolt of truth. While disruptive, this destruction is necessary, clearing the ground for something more authentic and stable to be built in its place." },
    { name: "The Star", keywords: ["hope", "faith", "purpose", "rejuvenation"], meaning: "A beacon of hope, faith, and spiritual guidance. After the storm of The Tower, The Star brings a sense of serenity, healing, and renewal. It is a sign that you are on the right path, connected to the divine, and that your future is blessed with inspiration and purpose." },
    { name: "The Moon", keywords: ["illusion", "fear", "anxiety", "subconscious"], meaning: "Represents the mysterious realm of the subconscious, dreams, and illusion. It illuminates the path through the darkness, but its light can also cast long shadows of fear and anxiety. The Moon urges you to trust your intuition to navigate the unseen and distinguish fantasy from reality." },
    { name: "The Sun", keywords: ["positivity", "fun", "warmth", "success"], meaning: "The embodiment of joy, success, and radiant vitality. The Sun shines with clarity and optimism, illuminating your path and dissolving all shadows. This card represents enlightenment, abundance, and the simple, pure happiness of being alive." },
    { name: "Judgement", keywords: ["rebirth", "inner calling", "absolution"], meaning: "Symbolizes a profound reckoning, rebirth, and spiritual awakening. It is a call to rise up, to absolve yourself of past burdens, and to answer a higher calling. This card represents a final judgment on a past chapter, leading to a period of liberation and renewal." },
    { name: "The World", keywords: ["completion", "integration", "accomplishment", "travel"], meaning: "Represents the successful completion of a journey, integration, and a sense of wholeness. It is the final card of the Major Arcana, symbolizing accomplishment and unity with the cosmos. You have learned your lessons, and a cycle has come to a fulfilling and harmonious end." },
    { name: "Ace of Wands", keywords: ["inspiration", "new opportunities", "growth"], meaning: "A spark of inspiration, representing new opportunities, growth, and the raw energy of creation. It's the initial flash of a new idea or passion project, inviting you to take action." },
    { name: "Two of Wands", keywords: ["future planning", "making decisions", "leaving home"], meaning: "Stands at the threshold of a decision, holding the world in your hands. It's about future planning, exploring possibilities, and having the courage to step out of your comfort zone." },
    { name: "Three of Wands", keywords: ["expansion", "foresight", "overseas opportunities"], meaning: "Represents the initial results of your efforts taking shape. You are looking ahead with foresight and anticipation, as your ships begin to come in. It signifies expansion and progress." },
    { name: "Four of Wands", keywords: ["celebration", "harmony", "marriage", "home"], meaning: "A joyful celebration of harmony, stability, and community. It represents a significant milestone, like a marriage or a homecoming, and the peace that comes from a job well done." },
    { name: "Five of Wands", keywords: ["conflict", "disagreements", "competition"], meaning: "Symbolizes conflict, competition, and minor disagreements. While it can be frustrating, this clash of energies is often creative and productive, pushing everyone involved to strive harder." },
    { name: "Six of Wands", keywords: ["public recognition", "victory", "progress"], meaning: "A card of victory, success, and public recognition. You have overcome the challenges and are now enjoying the acclaim and confidence that comes with achievement." },
    { name: "Seven of Wands", keywords: ["challenge", "protection", "perseverance"], meaning: "Represents a challenge to your position, requiring courage and perseverance. You must stand your ground and defend what you've built, drawing on your inner conviction." },
    { name: "Eight of Wands", keywords: ["speed", "action", "air travel", "movement"], meaning: "Signifies swift action, rapid progress, and clear communication. Obstacles are dissolving, and events are moving forward at a great speed, often bringing important news." },
    { name: "Nine of Wands", keywords: ["resilience", "courage", "persistence"], meaning: "A testament to resilience and courage in the face of adversity. You are weary but not defeated, standing guard one last time before reaching the finish line. Your persistence will pay off." },
    { name: "Ten of Wands", keywords: ["burden", "extra responsibility", "hard work"], meaning: "Represents being burdened by heavy responsibilities and hard work. While you may be nearing your goal, you are carrying too much alone. It's a call to delegate or release what isn't yours to carry." },
    { name: "Page of Wands", keywords: ["enthusiasm", "exploration", "free spirit"], meaning: "Embodies enthusiasm, exploration, and a free spirit. This card brings messages of creative opportunities and encourages you to embrace curiosity and set off on a new adventure." },
    { name: "Knight of Wands", keywords: ["energy", "passion", "impulsiveness"], meaning: "Represents energy, passion, and impulsiveness. He is a charming and adventurous figure who charges ahead with confidence, though sometimes without a clear plan. He encourages bold action." },
    { name: "Queen of Wands", keywords: ["courage", "confidence", "independence"], meaning: "A figure of courage, confidence, and vibrant energy. She is independent, determined, and socially adept, able to inspire others with her warmth and passion." },
    { name: "King of Wands", keywords: ["natural-born leader", "vision", "entrepreneur"], meaning: "A natural-born leader with a powerful vision and entrepreneurial spirit. He is charismatic and inspiring, able to take control of a situation and lead others towards a shared goal." },
    { name: "Ace of Cups", keywords: ["love", "new relationships", "compassion"], meaning: "An overflowing of emotion, representing new love, compassion, and creative expression. It is the beginning of a deep connection, be it romantic, spiritual, or artistic." },
    { name: "Two of Cups", keywords: ["unified love", "partnership", "mutual attraction"], meaning: "A symbol of unified love, partnership, and mutual attraction. It represents a deep, soulful connection between two people, built on shared values and emotional understanding." },
    { name: "Three of Cups", keywords: ["celebration", "friendship", "creativity"], meaning: "Represents joyful celebrations, friendship, and community. It's a time to gather with your loved ones and share in the happiness of connection and creative collaboration." },
    { name: "Four of Cups", keywords: ["meditation", "contemplation", "apathy"], meaning: "Signifies apathy, contemplation, and emotional discontent. You may be so focused on what's missing that you are overlooking opportunities being offered. It's a call to look up and reconnect." },
    { name: "Five of Cups", keywords: ["regret", "failure", "disappointment"], meaning: "Focuses on loss, regret, and disappointment. While it can be frustrating, this card reminds you not to forget the cups that still stand full behind you." },
    { name: "Six of Cups", keywords: ["revisiting the past", "childhood memories", "innocence"], meaning: "A card of nostalgia, childhood memories, and innocence. It can represent a return to a happier time, a reunion with someone from the past, or the simple joys of kindness and giving." },
    { name: "Seven of Cups", keywords: ["opportunities", "choices", "wishful thinking"], meaning: "Represents having many choices and opportunities, but also the potential for illusion and wishful thinking. You must look beyond the fantasy and make a clear, grounded decision." },
    { name: "Eight of Cups", keywords: ["disappointment", "abandonment", "withdrawal"], meaning: "Signifies walking away from a situation that is no longer emotionally fulfilling. It is an act of courage to leave the known behind in search of deeper meaning and purpose." },
    { name: "Nine of Cups", keywords: ["wishes fulfilled", "comfort", "happiness"], meaning: "Often called the 'wish fulfillment' card, it represents satisfaction, contentment, and sensual pleasure. Your emotional and material wishes are coming true; enjoy this moment of bliss." },
    { name: "Ten of Cups", keywords: ["divine love", "blissful relationships", "harmony"], meaning: "Represents ultimate emotional fulfillment, blissful relationships, and divine harmony. It is a picture of a happy family life and a deep sense of peace and alignment with your values." },
    { name: "Page of Cups", keywords: ["creative opportunities", "intuition", "curiosity"], meaning: "Brings creative opportunities and intuitive messages. This Page is curious and emotionally open, encouraging you to listen to your heart and explore your creative potential." },
    { name: "Knight of Cups", keywords: ["romance", "charm", "imagination"], meaning: "A romantic, charming, and imaginative messenger. He follows his heart and is often the bearer of a romantic proposal or an invitation to an emotional or creative journey." },
    { name: "Queen of Cups", keywords: ["compassion", "calm", "intuition"], meaning: "Embodies compassion, intuition, and emotional maturity. She is in tune with her subconscious and leads with a calm, healing presence. She advises you to trust your feelings." },
    { name: "King of Cups", keywords: ["emotional balance", "control", "diplomacy"], meaning: "A master of his emotions, representing emotional balance, control, and diplomacy. He is compassionate yet detached, able to offer wise counsel without getting carried away." },
    { name: "Ace of Swords", keywords: ["breakthroughs", "new ideas", "mental clarity"], meaning: "A breakthrough of mental clarity and new ideas. This card cuts through confusion to reveal the truth, representing a moment of profound insight or a powerful new beginning." },
    { name: "Two of Swords", keywords: ["difficult decisions", "stalemate", "avoidance"], meaning: "Represents being at a stalemate, facing a difficult decision. You may be avoiding the truth or blocking your emotions to protect yourself. A choice must be made." },
    { name: "Three of Swords", keywords: ["heartbreak", "emotional pain", "sorrow"], meaning: "A card of heartbreak, sorrow, and painful realization. While devastating, this piercing truth brings a necessary, albeit painful, release that allows for healing to begin." },
    { name: "Four of Swords", keywords: ["rest", "relaxation", "meditation"], meaning: "Signifies a period of necessary rest, contemplation, and mental recuperation. After a battle, it's time to retreat and recharge your mind before facing the world again." },
    { name: "Five of Swords", keywords: ["conflict", "competition", "win at all costs"], meaning: "Represents conflict, defeat, and a 'win at all costs' mentality. This victory feels hollow, as it has come at the expense of others and your own integrity. It warns against pyrrhic victories." },
    { name: "Six of Swords", keywords: ["transition", "change", "rite of passage"], meaning: "Symbolizes a transition, moving on from a difficult past toward a calmer future. It's a journey, often sorrowful but necessary, towards a place of greater peace and mental clarity." },
    { name: "Seven of Swords", keywords: ["betrayal", "deception", "getting away with something"], meaning: "Indicates deception, strategy, and trying to get away with something. It can represent acting alone or using cunning to your advantage, but warns against betrayal and dishonesty." },
    { name: "Eight of Swords", keywords: ["negative thoughts", "self-imposed restriction", "imprisonment"], meaning: "Represents feeling trapped by your own negative thoughts and self-imposed restrictions. The way out is available, but you must first realize that your perceived prison is one of the mind." },
    { name: "Nine of Swords", keywords: ["anxiety", "worry", "fear", "depression"], meaning: "The 'nightmare' card, symbolizing deep anxiety, worry, and fear. These mental burdens are weighing heavily, often leading to sleepless nights. It's a call to seek help and confront these fears." },
    { name: "Ten of Swords", keywords: ["painful endings", "deep wounds", "betrayal"], meaning: "Signifies a painful and inevitable ending, betrayal, or hitting rock bottom. As devastating as it is, this is the final blow; there is nowhere to go but up. A new dawn is coming." },
    { name: "Page of Swords", keywords: ["new ideas", "curiosity", "thirst for knowledge"], meaning: "Represents boundless curiosity, new ideas, and a thirst for knowledge. This Page is energetic and communicative, always asking questions and seeking the truth." },
    { name: "Knight of Swords", keywords: ["ambitious", "action-oriented", "fast-thinking"], meaning: "An ambitious, action-oriented, and fast-thinking individual. He charges into situations with logic and determination, but his haste can sometimes lead to recklessness." },
    { name: "Queen of Swords", keywords: ["independent", "unbiased judgement", "clear boundaries"], meaning: "A figure of sharp intellect, independence, and unbiased judgment. She has clear boundaries and uses her experiences to cut through deception and speak the unvarnished truth." },
    { name: "King of Swords", keywords: ["mental clarity", "intellectual power", "authority"], meaning: "Embodies intellectual power, authority, and mental clarity. He is a master of truth and justice, making decisions based on logic and ethical principles rather than emotion." },
    { name: "Ace of Pentacles", keywords: ["manifestation", "new financial opportunity", "prosperity"], meaning: "A seed of manifestation, representing a new financial or material opportunity. It's a tangible beginning, promising prosperity, security, and grounding in the real world." },
    { name: "Two of Pentacles", keywords: ["multiple priorities", "time management", "adaptability"], meaning: "Represents balancing multiple priorities, often related to work and finances. It requires adaptability and skillful time management to keep everything in motion." },
    { name: "Three of Pentacles", keywords: ["teamwork", "collaboration", "learning"], meaning: "A card of teamwork, collaboration, and mastering a skill. Your hard work is being recognized, and by working with others, you can create something of lasting value." },
    { name: "Four of Pentacles", keywords: ["saving money", "security", "control"], meaning: "Symbolizes security, stability, and sometimes control or possessiveness. You are holding on tightly to what you have, which can provide a sense of safety but may also lead to stagnation." },
    { name: "Five of Pentacles", keywords: ["financial loss", "poverty", "isolation"], meaning: "Represents financial hardship, isolation, and feeling left out in the cold. It's a difficult time, but it reminds you to seek help and remember that spiritual wealth is also important." },
    { name: "Six of Pentacles", keywords: ["charity", "generosity", "sharing wealth"], meaning: "A card of generosity, charity, and the flow of resources. It can represent both giving and receiving help, creating a cycle of abundance and community support." },
    { name: "Seven of Pentacles", keywords: ["long-term view", "sustainable results", "perseverance"], meaning: "Signifies a moment of reflection on your long-term investments. You've worked hard, and now it's time to patiently wait for your efforts to bear fruit, assessing your progress." },
    { name: "Eight of Pentacles", keywords: ["apprenticeship", "repetitive tasks", "mastery"], meaning: "Represents diligence, craftsmanship, and dedication to improving your skills. It's about taking pride in your work and committing to a path of mastery through repetitive effort." },
    { name: "Nine of Pentacles", keywords: ["abundance", "luxury", "self-sufficiency"], meaning: "A card of self-sufficiency, luxury, and enjoying the fruits of your labor. You have achieved a level of independence and abundance that allows you to appreciate life's comforts." },
    { name: "Ten of Pentacles", keywords: ["wealth", "family", "long-term success"], meaning: "Represents long-term success, family wealth, and creating a lasting legacy. It symbolizes the culmination of hard work, providing security and stability for generations to come." },
    { name: "Page of Pentacles", keywords: ["manifestation", "financial opportunity", "skill development"], meaning: "Brings news of a new opportunity related to career, education, or finances. This Page is studious and grounded, eager to learn new skills and manifest tangible results." },
    { name: "Knight of Pentacles", keywords: ["hard work", "productivity", "routine"], meaning: "A diligent, reliable, and hardworking individual. He is methodical and committed to his routine, representing the steady, patient effort required to achieve long-term goals." },
    { name: "Queen of Pentacles", keywords: ["nurturing", "practical", "providing financially"], meaning: "A nurturing, practical, and down-to-earth figure. She provides a sense of security and comfort, masterfully managing her home and finances to create a prosperous environment." },
    { name: "King of Pentacles", keywords: ["wealth", "business", "leadership"], meaning: "Represents mastery of the material world, business acumen, and leadership. He is abundant and reliable, having built an empire through hard work and sound judgment." }
];

export const MAJOR_ARCANA_NAMES = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", 
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", 
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", 
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"
];

export const DEFAULT_DECK: Deck = {
  id: 'echo-deck',
  name: 'The Echo Deck',
  theme: 'Ethereal Monochrome',
  description: 'A minimalist, generative deck exploring the traditional tarot through the lens of digital noise and sacred geometry.',
  isCustom: true,
  cardImages: {}, 
  coverImage: '', 
  suits: {
      Wands: "Wands",
      Cups: "Cups",
      Swords: "Swords",
      Pentacles: "Pentacles"
  },
  majorArcana: {}
};

export const getCardDisplayName = (standardName: string, deck: Deck | undefined): string => {
    if (!deck || !deck.isCustom) return standardName;

    // Check Major Arcana
    if (deck.majorArcana[standardName]) {
        return deck.majorArcana[standardName];
    }

    // Check Suits
    const suitMatch = standardName.match(/(Wands|Cups|Swords|Pentacles)/);
    if (suitMatch) {
        const suit = suitMatch[0] as keyof typeof deck.suits;
        return standardName.replace(suit, deck.suits[suit]);
    }

    return standardName;
};
