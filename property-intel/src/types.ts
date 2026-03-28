// Pipeline Stage 1: Raw scraped listing
export interface PropertyRaw {
  id: string;
  source: "willhaben" | "immoscout" | "immowelt";
  url: string;
  title: string;
  price: number;
  currency: "EUR";
  sqm: number;
  rooms: number;
  address: string;
  district: string;
  city: string;
  images: string[];
  description_raw: string;
}

// Pipeline Stage 2: After Claude feature extraction
export interface PropertyExtracted extends PropertyRaw {
  features: {
    orientation?: "north" | "south" | "east" | "west";
    balcony?: boolean;
    terrace?: boolean;
    building_style?: "altbau" | "neubau" | "other";
    floor?: number;
    elevator?: boolean;
    noise_level?: "low" | "medium" | "high";
    condition?: "renovated" | "original" | "needs_work";
    parking?: boolean;
    garden?: boolean;
    year_built?: number;
    heating?: string;
    confidence: Record<string, number>;
  };
}

// Pipeline Stage 3: After Exa + Maps enrichment
export interface PropertyEnriched extends PropertyExtracted {
  nearby: {
    schools: PlaceResult[];
    transit: PlaceResult[];
    supermarkets: PlaceResult[];
    commute_center_min?: number;
  };
  intel: {
    owner_name?: string;
    owner_type?: "individual" | "company";
    owner_other_properties?: number;
    insolvency_status?: "none" | "proceedings" | "unknown";
    building_permit_status?: string;
    signal_score: number; // 0-5
    signals: string[];
    source_url?: string;
  } | null;
}

// Pipeline Stage 4: After output validation
export interface PropertyValidated extends PropertyEnriched {
  validation: {
    sqm_mismatch?: { listed: number; detected: number };
    price_anomaly?: { listed: number; comparable_avg: number };
    flags: string[];
    sources: string[]; // URL per claim
    compliance_notes: string[]; // Maklergesetz references
  };
}

export interface PlaceResult {
  name: string;
  type?: string;
  distance_m: number;
  rating?: number;
}

export interface ComparisonPage {
  id: string;
  properties: PropertyValidated[];
  agent_notes: string;
  client_profile?: string;
  created_at: string;
}

// Chat tool definitions
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Voice mode
export type VoiceMode = "lead_qualification" | "agent_consultation";

// Client types
export interface ClientProfile {
  budget_min: number;
  budget_max: number;
  rooms_min: number;
  rooms_preferred?: number;
  districts: string[];
  district_codes: string[];
  family: string;
  priorities: string[];
  style_preference?: string;
  move_in?: string;
  financing?: string;
  edited_fields: string[];
  notes_agent?: string;
}

export interface SearchCriteria {
  rooms_min: number;
  price_max: number;
  districts: string[];
  must_have: string[];
  nice_to_have: string[];
  commute_max_min: number;
  commute_destination: string;
}

export interface Client {
  id: string;
  name: string;
  status: "active" | "viewing" | "new";
  statusLabel: string;
  summary: string;
  lastActivity: string;
  avatar: string;
  transcript?: string;
  profile?: ClientProfile;
  searchCriteria?: SearchCriteria;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  priority: "urgent" | "signal" | "normal" | "new" | "low";
  aiLabel: string;
  suggestedResponse: string | null;
  time: string;
  date: string;
  read: boolean;
  client: string | null;
}
