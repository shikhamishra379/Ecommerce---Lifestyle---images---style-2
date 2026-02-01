
import { ProductFormData, PromptOutput, ProductCategory } from '../types';

interface Intelligence {
  physicalForm: string;
  mascotSuggestion: string | null;
  mascotAppropriate: boolean;
  liquidDripAppropriate: boolean;
  powderEffectAppropriate: boolean;
  naturalProps: string[];
  environmentSuggestion: string;
  lightingDefault: string;
  creativeDefault: number;
  behaviorSuggestion?: string;
}

export const PRODUCT_INTELLIGENCE: Record<string, Intelligence> = {
  "Apparel, Shoes & Jewelry": {
    physicalForm: "Solid",
    mascotSuggestion: "A professional fashion model with natural poise",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Luxury jewelry box", "Silk fabric", "Minimalist storefront"],
    environmentSuggestion: "Modern urban street, upscale boutique, soft-lit studio",
    lightingDefault: "Natural Daylight",
    creativeDefault: 4,
    behaviorSuggestion: "The piece is worn elegantly, catching the light perfectly on its surfaces."
  },
  "Automotive & Parts": {
    physicalForm: "Solid",
    mascotSuggestion: "A high-end professional garage setting",
    mascotAppropriate: true,
    liquidDripAppropriate: true, // For oils/fluids
    powderEffectAppropriate: false,
    naturalProps: ["Carbon fiber textures", "Microfiber cloth", "Polished chrome"],
    environmentSuggestion: "Sleek modern garage, winding mountain road at dusk, asphalt textures",
    lightingDefault: "Dramatic Side-light",
    creativeDefault: 3,
    behaviorSuggestion: "Reflecting dramatic street lights or studio softboxes on metallic surfaces."
  },
  "Baby & Kids Products": {
    physicalForm: "Solid",
    mascotSuggestion: "A happy toddler or gentle parent hands",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Soft cotton blanket", "Wooden building blocks", "Plush rug"],
    environmentSuggestion: "Bright airy nursery, colorful playroom, sun-filled living room",
    lightingDefault: "High-Key Bright",
    creativeDefault: 4,
    behaviorSuggestion: "Interacting safely and joyfully, emphasizing comfort and security."
  },
  "Beauty & Personal Care": {
    physicalForm: "Cream/Gel",
    mascotSuggestion: "A model with clear, healthy skin",
    mascotAppropriate: true,
    liquidDripAppropriate: true,
    powderEffectAppropriate: false,
    naturalProps: ["Rose petals", "Fresh water droplets", "Marble vanity tray"],
    environmentSuggestion: "Bright, airy spa bathroom, minimalist white vanity",
    lightingDefault: "High-Key Bright",
    creativeDefault: 5,
  },
  "Electronics & Technology": {
    physicalForm: "Solid",
    mascotSuggestion: "A tech-savvy professional or gamer",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Graphite desk mat", "Anodized aluminum", "Ambient LED strips"],
    environmentSuggestion: "Minimalist home office, futuristic neon-lit studio, dark glass surface",
    lightingDefault: "Dramatic Side-light",
    creativeDefault: 3,
  },
  "Food, Grocery & Beverages": {
    physicalForm: "Liquid",
    mascotSuggestion: "A happy person enjoying a refreshing moment",
    mascotAppropriate: true,
    liquidDripAppropriate: true,
    powderEffectAppropriate: false,
    naturalProps: ["Fresh ingredients", "Rustic wooden table", "Ice cubes", "Linen napkin"],
    environmentSuggestion: "Sun-drenched kitchen, outdoor garden picnic, cozy urban cafe",
    lightingDefault: "Golden Hour",
    creativeDefault: 5,
  },
  "Garden, Outdoor & Patio": {
    physicalForm: "Solid",
    mascotSuggestion: "Someone enjoying a peaceful outdoor moment",
    mascotAppropriate: true,
    liquidDripAppropriate: true,
    powderEffectAppropriate: false,
    naturalProps: ["Terracotta pots", "Gardening gloves", "Green foliage"],
    environmentSuggestion: "Lush backyard garden, sun-soaked stone patio, greenhouse",
    lightingDefault: "Natural Daylight",
    creativeDefault: 4,
  },
  "Handmade & Artisanal": {
    physicalForm: "Solid",
    mascotSuggestion: "The artisan's skilled hands in frame",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Raw wood shavings", "Woven hemp twine", "Pottery wheel"],
    environmentSuggestion: "Authentic artist's loft, rustic sunlit workshop, barn setting",
    lightingDefault: "Natural Daylight",
    creativeDefault: 5,
    behaviorSuggestion: "Caught in a moment of creation or thoughtful inspection."
  },
  "Health, Household & Wellness": {
    physicalForm: "Capsules/Tablets",
    mascotSuggestion: "A person reflecting health and vitality",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Glass of water", "Fresh mint leaves", "White ceramic tray"],
    environmentSuggestion: "Clean modern bathroom, minimalist kitchen counter, yoga studio",
    lightingDefault: "Natural Daylight",
    creativeDefault: 3,
  },
  "Home, Kitchen & Dining": {
    physicalForm: "Solid",
    mascotSuggestion: "A warm family gathering or professional chef",
    mascotAppropriate: true,
    liquidDripAppropriate: true,
    powderEffectAppropriate: false,
    naturalProps: ["Marble countertop", "Copper cookware", "Fresh herbs"],
    environmentSuggestion: "Luxury modern kitchen, elegant dining room, rustic breakfast nook",
    lightingDefault: "Natural Daylight",
    creativeDefault: 4,
  },
  "Industrial, Scientific & Hardware": {
    physicalForm: "Solid",
    mascotSuggestion: "A professional in a clean tech environment",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Technical blueprints", "Steel calipers", "Brushed metal surfaces"],
    environmentSuggestion: "Modern architecture studio, professional electronics lab, high-tech workbench",
    lightingDefault: "Studio Softbox",
    creativeDefault: 3,
  },
  "Luggage & Travel Gear": {
    physicalForm: "Solid",
    mascotSuggestion: "A chic traveler in a stylish outfit",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Passport", "Sunglasses", "Designer sneakers"],
    environmentSuggestion: "Luxury hotel lobby, scenic airport terminal, cobblestone European street",
    lightingDefault: "Natural Daylight",
    creativeDefault: 4,
    behaviorSuggestion: "Effortlessly moving through a beautiful travel destination."
  },
  "Musical Instruments": {
    physicalForm: "Solid",
    mascotSuggestion: "A passionate musician",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Sheet music", "Leather guitar strap", "Vintage amplifier"],
    environmentSuggestion: "Professional recording studio, moody brick-walled stage, sunlit practice room",
    lightingDefault: "Dramatic Side-light",
    creativeDefault: 5,
  },
  "Office & Stationery": {
    physicalForm: "Solid",
    mascotSuggestion: "A creative professional at work",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Designer fountain pen", "Leather notebook", "Succulent plant"],
    environmentSuggestion: "Sleek minimalist white desk, organized creative studio, bright coworking space",
    lightingDefault: "Natural Daylight",
    creativeDefault: 3,
  },
  "Pet Supplies": {
    physicalForm: "Solid",
    mascotSuggestion: "A happy, well-groomed dog or cat",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Tennis ball", "Soft pet bed", "Park bench"],
    environmentSuggestion: "Vibrant city park, modern apartment with large windows",
    lightingDefault: "Natural Daylight",
    creativeDefault: 4,
  },
  "Sports & Fitness": {
    physicalForm: "Solid",
    mascotSuggestion: "An athlete in high-performance gear",
    mascotAppropriate: true,
    liquidDripAppropriate: true,
    powderEffectAppropriate: true,
    naturalProps: ["Professional yoga mat", "Dumbbells", "Gym towel"],
    environmentSuggestion: "Modern high-end gym, urban running track, outdoor sports court",
    lightingDefault: "Dramatic Side-light",
    creativeDefault: 4,
  },
  "Tools & Home Improvement": {
    physicalForm: "Solid",
    mascotSuggestion: "Hands engaged in a DIY project",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: true, // Sawdust/dust
    naturalProps: ["Measuring tape", "Spirit level", "Safety goggles"],
    environmentSuggestion: "Professional workshop, modern renovation site, wood deck",
    lightingDefault: "Natural Daylight",
    creativeDefault: 3,
  },
  "Toys & Games": {
    physicalForm: "Solid",
    mascotSuggestion: "Kids playing together with excitement",
    mascotAppropriate: true,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Colorful floor mats", "Activity table", "Storage bins"],
    environmentSuggestion: "Vibrant playroom, sunny backyard, family living room",
    lightingDefault: "High-Key Bright",
    creativeDefault: 4,
  }
};

const KEYWORD_MAP: Record<string, Partial<Intelligence>> = {
  "tea": { environmentSuggestion: "Zen garden, mist-covered tea farm", naturalProps: ["Tea leaves", "Ceramic cup", "Bamboo whisk"] },
  "coffee": { environmentSuggestion: "Rustic cozy cafe", naturalProps: ["Roasted coffee beans", "Burlap sack", "Silver spoon"] },
  "watch": { 
    mascotSuggestion: "A sophisticated person with the product visible on their wrist", 
    naturalProps: ["Luxury desk items", "Silk shirt sleeve", "Polished surfaces"],
    behaviorSuggestion: "The watch is shown in a natural pose, catching a glint of light on the dial."
  },
  "bottle": {
    liquidDripAppropriate: true,
    naturalProps: ["Refreshing water droplets on the exterior", "Condensed mist", "Ice cubes in background"]
  },
  "shoe": {
    environmentSuggestion: "Clean urban sidewalk, high-end sneaker boutique",
    naturalProps: ["Designer shoe box", "Premium tissue paper", "Shoe horn"]
  },
  "electronic": {
    environmentSuggestion: "Sleek dark glass surface with blue ambient backlighting",
    lightingDefault: "Low-Key Moody"
  }
};

const getSmartIntelligence = (name: string, cat: string): Intelligence => {
  const lowerName = name.toLowerCase();
  const base = PRODUCT_INTELLIGENCE[cat as keyof typeof PRODUCT_INTELLIGENCE] || {
    physicalForm: "Solid",
    mascotSuggestion: null,
    mascotAppropriate: false,
    liquidDripAppropriate: false,
    powderEffectAppropriate: false,
    naturalProps: ["Minimalist props"],
    environmentSuggestion: "Modern minimalist studio",
    lightingDefault: "Natural Daylight",
    creativeDefault: 3,
  };
  
  for (const keyword in KEYWORD_MAP) {
    if (lowerName.includes(keyword)) {
      return { ...base, ...KEYWORD_MAP[keyword] };
    }
  }
  return base;
};

export const generatePrompts = (data: ProductFormData): PromptOutput[] => {
  const intel = getSmartIntelligence(data.productName, data.category);
  const lifestyleCategories: ProductCategory[] = [
    "Apparel, Shoes & Jewelry",
    "Automotive & Parts",
    "Baby & Kids Products",
    "Food, Grocery & Beverages",
    "Garden, Outdoor & Patio",
    "Luggage & Travel Gear",
    "Musical Instruments",
    "Pet Supplies",
    "Sports & Fitness",
    "Toys & Games"
  ];

  const isLifestyle = lifestyleCategories.includes(data.category);

  const styles = isLifestyle ? [
    { id: 1, title: 'In-Action Lifestyle Hero', purpose: 'Marketing Banner', desc: 'Active use showing the product in its intended environment.' },
    { id: 2, title: 'Close-up Texture & Build', purpose: 'Product Quality', desc: 'Focusing on craftsmanship and durability.' },
    { id: 3, title: 'Environmental Story', purpose: 'Social Presence', desc: 'A wide cinematic shot placing the product in a trendy location.' },
    { id: 4, title: 'The Human Connection', purpose: 'UGC / Trust', desc: 'Interaction showing scale, installation, or texture.' },
    { id: 5, title: 'Artistic Flat-lay', purpose: 'Catalog Aesthetic', desc: 'Clean, arranged with matching accessories.' },
    { id: 6, title: 'Main Listing Standard', purpose: 'Amazon/Shopify Main', desc: 'Pure white background, conversion-optimized.' }
  ] : [
    { id: 1, title: 'Cinematic Storytelling', purpose: 'Brand Banner', desc: 'Organic environment with lush textures.' },
    { id: 2, title: 'Floating Power Shot', purpose: 'Product Launch', desc: 'Levitating against a dynamic sky.' },
    { id: 3, title: 'Luxury Editorial', purpose: 'Editorial Ads', desc: 'Minimalist studio with infinity curves.' },
    { id: 4, title: 'Candid Lifestyle', purpose: 'UGC Content', desc: 'Hand-held authentic sunny moment.' },
    { id: 5, title: 'Cozy Artisanal', purpose: 'Handmade Story', desc: 'Warm rustic indoor textures.' },
    { id: 6, title: 'Bright Commercial', purpose: 'E-com Listing', desc: 'Conversion-optimized studio shot.' }
  ];

  return styles.map(s => createPrompt(data, intel, s.title, s.id, s.purpose, s.desc, isLifestyle));
};

function createPrompt(data: ProductFormData, intel: Intelligence, title: string, id: number, purpose: string, desc: string, isLifestyle: boolean): PromptOutput {
  const visualStyleStr = data.visualStyles.length > 0 ? `${data.visualStyles.join(', ')} visual aesthetic.` : 'Professional e-commerce aesthetic.';
  const scene = getScene(id, data, intel, isLifestyle);
  const subjects = getSubjects(id, data, intel);
  
  const colorAccents = `The scene is illuminated with subtle accent lighting in ${data.primaryColor}, creating a branded atmosphere.`;
  
  // Refined negative prompts based on user feedback to avoid jewelry/watch asset cross-over
  const name = data.productName.toLowerCase();
  let negativeSpecifics = "";
  if (name.includes('pendant') || name.includes('necklace')) {
    negativeSpecifics = "No watches, no cufflinks, no masculine items. Focus purely on the pendant/necklace and the model's neckline.";
  } else if (name.includes('watch')) {
    negativeSpecifics = "No other jewelry like necklaces or rings unless requested. Focus purely on the watch and high-end apparel textures.";
  } else if (name.includes('bottle')) {
    negativeSpecifics = "No food items, no messy backgrounds, no plastic glare. Focus on the refreshing water droplets and sleek bottle shape.";
  }

  const sections = {
    header: `DIRECTION: ${title}\nUSE CASE: ${purpose}`,
    scene: `${scene} The overall look is ${visualStyleStr} ${colorAccents}`,
    placement: `MANDATORY: Use @img1 exactly as uploaded. Focus on the ${data.productName}. Do not alter branding, text, logo, or color.`,
    supporting: subjects,
    dynamic: `Subtle movement or sharp focus to emphasize quality.`,
    lighting: id === 6 ? `Lighting: Neutral 5500K studio light.` : `Lighting: ${data.lightingStyle} with ${data.lightTemp}.`,
    camera: `Camera: ${data.focalLength}, Angle: ${data.cameraAngle}, DOF: ${data.dof}.`,
    color: `Color Palette: ${data.colorPalette.join(', ')} with brand accents of ${data.primaryColor}.`,
    tech: `8K Resolution, photorealistic render.`,
    quality: `Quality: Ultra-detailed textures, realistic shadows, high-end commercial finish.`,
    negative: `Negative: No low quality, no text overlays, no distortion, no watermarks. ${negativeSpecifics}`
  };

  return {
    id: `p-${id}`,
    title,
    purpose,
    description: desc,
    fullPrompt: Object.values(sections).join('\n\n'),
    sections
  };
}

function getScene(id: number, data: ProductFormData, intel: Intelligence, isLifestyle: boolean) {
  if (id === 6) return `Background: Pure White (RGB 255,255,255). No shadows except for a natural drop shadow below the product.`;
  if (isLifestyle) {
    switch(id) {
      case 1: return `Setting: A fashionable ${intel.environmentSuggestion}. The model is seen from a half-body or waist-up perspective to show the product in a real-world context.`;
      case 2: return `Setting: Macro focus close-up to see the texture of the ${data.productName}. Background is blurred ${intel.environmentSuggestion}.`;
      case 3: return `Setting: A wide environmental shot in a chic ${intel.environmentSuggestion}. The model is seen in profile or from a dramatic distance to emphasize the lifestyle setting.`;
      case 5: return `Setting: A minimalist flat-lay on a premium surface matching the ${data.visualStyles[0] || 'Modern'} style.`;
      default: return `Setting: ${intel.environmentSuggestion}.`;
    }
  }
  return `Setting: ${intel.environmentSuggestion}.`;
}

function getSubjects(id: number, data: ProductFormData, intel: Intelligence) {
  let sub = "";
  if (data.mascotEnabled && intel.mascotSuggestion) {
    const name = data.productName.toLowerCase();
    const isWatch = name.includes('watch');
    const isBottle = name.includes('bottle');
    const isElectronics = name.includes('phone') || name.includes('laptop') || name.includes('earbuds');
    
    let customMascot = intel.mascotSuggestion;
    if ((id === 1 || id === 3) && isWatch) {
      customMascot = "A stylish person shown from the waist up, wearing the watch naturally as part of a high-end designer outfit.";
    } else if ((id === 1 || id === 3) && isBottle) {
      customMascot = "An active person in stylish athletic wear, drinking from the bottle or carrying it refreshing after a vigorous workout.";
    } else if ((id === 1 || id === 3) && isElectronics) {
      customMascot = "A modern creative professional using the device in a productive, sleek environment.";
    }
    
    sub += `Subject: ${customMascot}. Action: ${intel.behaviorSuggestion || "Interacting naturally with the product."} `;
  }
  if (data.propsEnabled && intel.naturalProps.length > 0) {
    sub += `Props: ${intel.naturalProps.join(', ')}. `;
  }
  if (id === 4) {
    const name = data.productName.toLowerCase();
    const isHardware = data.category.includes("Industrial") || data.category.includes("Tools") || data.category.includes("Improvement");
    const isBottle = name.includes('bottle');
    
    let interaction = "A human interaction showing the scale and usage of the product";
    if (isHardware) {
      interaction = "Hands professionally installing or adjusting the product with a technical tool";
    } else if (name.includes('pendant') || name.includes('necklace')) {
      interaction = "Model adjusting the piece near their neckline while looking into a soft-lit luxury mirror";
    } else if (isBottle) {
      interaction = "A person tilted back slightly, drinking water from the bottle with visible refreshing droplets on the exterior";
    } else if (name.includes('phone') || name.includes('tablet')) {
      interaction = "Hands holding the device, showcasing the screen and build quality against a modern background";
    } else if (name.includes('shoe')) {
      interaction = "A foot stepping onto a clean urban surface, showing the shoe's flex and sole design";
    }
    
    sub += `Human Interaction: ${interaction}.`;
  }
  return sub || "Focus purely on the main product asset.";
}
