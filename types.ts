
export type ProductCategory = 
  | 'Apparel, Shoes & Jewelry'
  | 'Automotive & Parts'
  | 'Baby & Kids Products'
  | 'Beauty & Personal Care'
  | 'Electronics & Technology'
  | 'Food, Grocery & Beverages'
  | 'Garden, Outdoor & Patio'
  | 'Handmade & Artisanal'
  | 'Health, Household & Wellness'
  | 'Home, Kitchen & Dining'
  | 'Industrial, Scientific & Hardware'
  | 'Luggage & Travel Gear'
  | 'Musical Instruments'
  | 'Office & Stationery'
  | 'Pet Supplies'
  | 'Sports & Fitness'
  | 'Tools & Home Improvement'
  | 'Toys & Games'
  | 'Other (custom)';

export type ProductForm = 'Liquid' | 'Cream/Gel' | 'Powder' | 'Capsules/Tablets' | 'Solid' | 'Oil' | 'Spray' | 'Paste';

export type ContainerType = 
  | 'Glass jar' | 'Glass bottle' | 'Plastic bottle' | 'Amber glass' | 'Tin/Metal' 
  | 'Cardboard box' | 'Pouch/Sachet' | 'Tube' | 'Pump bottle' | 'Dropper bottle' | 'Spray bottle' | 'Stick/Balm';

export type BrandPositioning = 
  | 'Ultra-Luxury' | 'Premium' | 'Mid-Market D2C' 
  | 'Artisanal/Handmade' | 'Organic/Natural' | 'Clinical/Medical' | 'Budget/Value' | 'Fun/Playful';

export type Resolution = '4K' | '6K' | '8K' | '12K';
export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9' | '3:4' | '2:3';
export type DepthOfField = 'Shallow' | 'Medium' | 'Deep' | 'Auto';

export interface ProductFormData {
  productName: string;
  category: ProductCategory;
  productForm: ProductForm;
  containerType: ContainerType;
  characteristics: string[];
  primaryColor: string;
  brandPositioning: BrandPositioning;
  visualStyles: string[]; // New field
  creativeLevel: number;
  platforms: string[];
  mascotEnabled: boolean;
  mascotStyle: string;
  mascotIntegration: string;
  liquidEnabled: boolean;
  dripIntensity: string;
  powderEnabled: boolean;
  powderIntensity: string;
  propsEnabled: boolean;
  propQuantity: string;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  dof: DepthOfField;
  lightingStyle: string;
  lightTemp: string;
  shadowIntensity: number;
  cameraAngle: string;
  focalLength: string;
  composition: string;
  colorPalette: string[];
  background: string;
  moods: string[];
  imageRef: string | null;
}

export interface PromptOutput {
  id: string;
  title: string;
  purpose: string;
  description: string;
  fullPrompt: string;
  sections: {
    header: string;
    scene: string;
    placement: string;
    supporting: string;
    dynamic: string;
    lighting: string;
    camera: string;
    color: string;
    tech: string;
    quality: string;
    negative: string;
  };
}
