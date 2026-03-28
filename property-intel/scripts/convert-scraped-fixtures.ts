import fs from 'fs';
import path from 'path';

// Default images for different property types
const defaultImages = [
  ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
  ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
  ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800"],
  ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=800"],
  ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800", "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"],
  ["https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800", "https://images.unsplash.com/photo-1600607688117-1ee834f63493?w=800"]
];

// Generic descriptions based on property size and price
const generateDescription = (rooms: number, sqm: number, price: number, district: string): string => {
  const pricePerSqm = Math.round(price / sqm);
  const isExpensive = pricePerSqm > 6000;
  const isLarge = sqm > 80;
  
  const baseDescriptions = [
    `Moderne ${rooms}-Zimmer Wohnung im beliebten ${district}. ${sqm}m² Wohnfläche verteilt auf ${rooms} Zimmer. ${isLarge ? 'Großzügig geschnitten mit viel Platz für die ganze Familie.' : 'Kompakt und effizient aufgeteilt.'} ${isExpensive ? 'Premium-Lage mit exzellenter Infrastruktur.' : 'Preislich attraktiv in aufstrebendem Viertel.'} Öffentliche Verkehrsmittel in unmittelbarer Nähe. Einkaufsmöglichkeiten und Schulen fußläufig erreichbar.`,
    
    `Attraktive ${rooms}-Zimmer Wohnung in ${district}. Die Wohnung bietet ${sqm}m² gut aufgeteilte Wohnfläche. ${isExpensive ? 'Hochwertige Ausstattung und gepflegtes Wohnumfeld.' : 'Solide Bausubstanz mit Entwicklungspotential.'} Ruhige Lage trotz zentraler Anbindung. U-Bahn und Straßenbahn in wenigen Gehminuten. ${isLarge ? 'Ideal für Familien oder als WG geeignet.' : 'Perfekt für Singles oder Paare.'}`,
    
    `Gepflegte ${rooms}-Zimmer Wohnung mit ${sqm}m² in ${district}. ${isExpensive ? 'Top-Lage mit erstklassiger Infrastruktur.' : 'Faire Preis-Leistung in entwicklungsfähiger Gegend.'} Die Wohnung verfügt über ${rooms} Zimmer und ist ${isLarge ? 'großzügig geschnitten' : 'optimal aufgeteilt'}. Gute Verkehrsanbindung mit mehreren öffentlichen Linien. Nahversorgung, Ärzte und Schulen in der Umgebung.`
  ];
  
  return baseDescriptions[Math.floor(Math.random() * baseDescriptions.length)];
};

// Fix district names and addresses
const fixAddress = (property: any): { address: string, district: string } => {
  const districtMap: Record<string, string> = {
    "1020": "Leopoldstadt",
    "1030": "Landstraße", 
    "1050": "Margareten",
    "1070": "Neubau",
    "1080": "Josefstadt",
    "1100": "Favoriten",
    "1150": "Rudolfsheim-Fünfhaus",
    "1210": "Floridsdorf",
    "1220": "Donaustadt"
  };
  
  // Extract postal code from various fields
  let postalCode = "1100"; // default
  let streetName = "Hauptstraße";
  let streetNumber = Math.floor(Math.random() * 200) + 1;
  
  // Try to extract postal code from address or other fields
  const addressStr = String(property.address || "");
  const postalMatch = addressStr.match(/\b(1\d{3})\b/) || 
                      property.title?.match(/\b(1\d{3})\b/);
  if (postalMatch) {
    postalCode = postalMatch[1];
  }
  
  // Generate street name based on district
  const streetNames: Record<string, string[]> = {
    "Leopoldstadt": ["Praterstraße", "Taborstraße", "Nordbahnstraße"],
    "Landstraße": ["Landstraßer Hauptstraße", "Rennweg", "Erdbergstraße"],
    "Margareten": ["Wiedner Hauptstraße", "Margaretenstraße", "Reinprechtsdorfer Straße"],
    "Neubau": ["Mariahilfer Straße", "Neubaugasse", "Burggasse"],
    "Josefstadt": ["Josefstädter Straße", "Alser Straße", "Lerchenfelder Straße"],
    "Favoriten": ["Favoritenstraße", "Quellenstraße", "Laxenburger Straße"],
    "Rudolfsheim-Fünfhaus": ["Mariahilfer Straße", "Hütteldorfer Straße", "Felberstraße"],
    "Floridsdorf": ["Floridsdorfer Hauptstraße", "Brünner Straße", "Prager Straße"],
    "Donaustadt": ["Donaustadtstraße", "Wagramer Straße", "Langobardenstraße"]
  };
  
  const district = districtMap[postalCode] || "Favoriten";
  const streets = streetNames[district] || streetNames["Favoriten"];
  streetName = streets[Math.floor(Math.random() * streets.length)];
  
  return {
    address: `${streetName} ${streetNumber}, ${postalCode} Wien`,
    district: district
  };
};

// Main conversion function
const convertScrapedProperties = () => {
  // Read scraped properties
  const scrapedPath = path.join(process.cwd(), 'fixtures', 'scraped-properties.json');
  const scraped = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));
  
  // Select best properties (those with reasonable data)
  const selected = scraped
    .filter((p: any) => {
      // Filter out properties with corrupted titles or missing key data
      return p.title && 
             !p.title.includes('\u0000') && 
             p.price > 100000 && 
             p.sqm > 40 && 
             p.rooms >= 2;
    })
    .slice(0, 6); // Take first 6 good ones
  
  // Convert to expected format
  const converted = selected.map((property: any, index: number) => {
    const { address, district } = fixAddress(property);
    
    return {
      id: property.id,
      source: property.source,
      url: property.url,
      title: property.title.trim(),
      price: property.price,
      currency: property.currency,
      sqm: property.sqm,
      rooms: property.rooms,
      address: address,
      district: district,
      city: "Wien",
      images: defaultImages[index % defaultImages.length],
      description_raw: generateDescription(property.rooms, property.sqm, property.price, district)
    };
  });
  
  // Save to properties.json
  const outputPath = path.join(process.cwd(), 'fixtures', 'properties.json');
  fs.writeFileSync(outputPath, JSON.stringify(converted, null, 2));
  
  console.log(`✅ Converted ${converted.length} properties`);
  console.log(`📁 Saved to: ${outputPath}`);
  
  // Print summary
  console.log('\nConverted properties:');
  converted.forEach((p: any) => {
    console.log(`- ${p.id}: ${p.title.substring(0, 50)}... (${p.district}, €${p.price.toLocaleString()})`);
  });
};

// Run conversion
convertScrapedProperties();