
import { 
  ProductCategory, 
  ContainerType, 
  ProductForm,
  BrandPositioning, 
  Resolution, 
  AspectRatio, 
  DepthOfField 
} from './types';

export const CATEGORIES: ProductCategory[] = [
  'Apparel, Shoes & Jewelry',
  'Automotive & Parts',
  'Baby & Kids Products',
  'Beauty & Personal Care',
  'Electronics & Technology',
  'Food, Grocery & Beverages',
  'Garden, Outdoor & Patio',
  'Handmade & Artisanal',
  'Health, Household & Wellness',
  'Home, Kitchen & Dining',
  'Industrial, Scientific & Hardware',
  'Luggage & Travel Gear',
  'Musical Instruments',
  'Office & Stationery',
  'Pet Supplies',
  'Sports & Fitness',
  'Tools & Home Improvement',
  'Toys & Games',
  'Other (custom)'
];

export const VISUAL_STYLES = [
  'Luxury', 'Premium', 'Minimalist', 'Modern', 'Aesthetic', 
  'Rustic', 'Vibrant', 'Industrial', 'Vintage', 'Futuristic', 'Athletic/Sporty'
];

export const PRODUCT_FORMS: ProductForm[] = [
  'Liquid', 'Cream/Gel', 'Powder', 'Capsules/Tablets', 'Solid', 'Oil', 'Spray', 'Paste'
];

export const CONTAINERS: ContainerType[] = [
  'Glass jar', 'Glass bottle', 'Plastic bottle', 'Amber glass', 'Tin/Metal', 
  'Cardboard box', 'Pouch/Sachet', 'Tube', 'Pump bottle', 'Dropper bottle', 'Spray bottle', 'Stick/Balm'
];

export const POSITIONING: BrandPositioning[] = [
  'Ultra-Luxury', 'Premium', 'Mid-Market D2C', 
  'Artisanal/Handmade', 'Organic/Natural', 'Clinical/Medical', 'Budget/Value', 'Fun/Playful'
];

export const PLATFORMS = [
  'Amazon Main Image', 'Amazon A+ Content', 'Shopify/Website Hero Banner', 
  'Instagram Feed', 'Instagram Stories/Reels', 'Facebook/Meta Ads', 
  'Google Shopping'
];

export const RESOLUTIONS: Resolution[] = ['4K', '6K', '8K', '12K'];
export const ASPECT_RATIOS: AspectRatio[] = ['1:1', '4:5', '9:16', '16:9', '3:4', '2:3'];
export const DOF_OPTIONS: DepthOfField[] = ['Shallow', 'Medium', 'Deep', 'Auto'];

export const CHARACTERISTICS = [
  'Transparent/see-through', 'Opaque/solid color', 'Has screw cap/lid', 
  'Has pump dispenser', 'Has dropper', 'Has spray mechanism', 
  'Has label wrap (full coverage)', 'Has minimalist label'
];

export const LIGHTING_STYLES = [
  'Natural Daylight', 'Golden Hour', 'Studio Softbox', 
  'Dramatic Side-light', 'Backlit/Rim Light', 'Flat Even Light', 
  'High-Key Bright', 'Low-Key Moody', 'Mixed'
];

export const LIGHT_TEMPS = [
  'Warm (2700K-3500K)', 'Neutral White (4000K-5000K)', 'Cool Daylight (5500K-6500K)', 'Match Product'
];

export const CAMERA_ANGLES = [
  'Straight-on (0°)', 'Slight high angle (15-30° down)', 
  'Low angle hero (15-30° up)', '45° angle', 
  'Bird\'s eye (90° top-down)', 'Eye-level'
];

export const FOCAL_LENGTHS = [
  'Wide angle (24-35mm)', 'Standard (50mm)', 'Portrait (85mm)', 'Macro Close-up', 'Auto'
];

export const COMPOSITIONS = [
  'Centered symmetrical', 'Rule of thirds', 'Minimal negative space', 'Tight crop', 'Environmental context'
];

export const PALETTES = [
  'Earth Tones', 'Pastels', 'Vibrant', 'Monochrome', 'Jewel Tones', 'Neutral', 'Clinical White', 'Luxury Dark'
];

export const BACKGROUNDS = [
  'Pure White (RGB 255,255,255)', 'Off-White/Cream', 'Solid Color', 'Gradient', 
  'Natural Outdoor', 'Wood Texture', 'Marble/Stone', 'Fabric/Linen', 
  'Kitchen/Home Setting', 'Abstract/Artistic', 'Transparent/Isolated'
];

export const MOODS = [
  'Trust & Reliability', 'Luxury & Sophistication', 'Energy & Vitality', 
  'Calm & Wellness', 'Fresh & Clean', 'Warm & Cozy', 
  'Clinical & Professional', 'Playful & Fun', 'Natural & Organic'
];
