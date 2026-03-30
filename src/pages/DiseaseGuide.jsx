import React, { useState } from 'react';
import { 
  Search, Bug, ShieldAlert, FlaskConical, 
  Activity, Thermometer, Filter, Droplet, 
  Stethoscope, Sprout, Image as ImageIcon,
  Wind, Mountain, Waves, Sun, Droplets, Info
} from 'lucide-react';

const CROP_DATABASE = [
  {
    id: "rice",
    nameEn: "Rice / Paddy",
    nameMl: "നെല്ല്",
    scientific: "Oryza sativa",
    image: "https://i.pinimg.com/736x/05/d2/bb/05d2bb98ade867c6564c9b011c589e6a.jpg",
    details: { temp: "20°C – 35°C", water: "Standing water", seasons: "Virippu, Mundakan", harvest: "100–135 days" },
    threats: [
      {
        nameEn: "Blast Disease", nameMl: "കുലവാട്ടം", type: "Fungal", severity: "High",
        symptomsEn: "Diamond-shaped spots with grey centers; neck of panicle may break; empty grains.", 
        symptomsMl: "സുഡ്ഡിലുള്ള കുലവാട്ടം; പാനിക്കിലുള്ള നെറ്റ് തകര്‍ത്തല്‍; വായുവിന്റെ കുഴപ്പങ്ങള്‍.",
        remedyEn: "Avoid excess nitrogen; use resistant varieties; spray Tricyclazole or Carbendazim." ,
        remedyMl: "അമിതമായ നൈട്രജൻ ഒഴിവാക്കുക; തീർച്ചയായ വരിയുകൾ; Tricyclazole അല്ലെങ്കിൽ Carbendazim സ്പ്രേയ്.",
      },
      {
        nameEn: "Sheath Blight", nameMl: "ഇലക്കരിച്ചിൽ", type: "Fungal", severity: "Medium",
        symptomsEn: "Brown patches on lower leaf sheath spreading upward; plants may fall.", 
        symptomsMl: "ബ്രൗൺ പാച്ചുകൾ; താഴെയുള്ള ഇലവിന്റെ ഷീത് വരുന്നത്; ഉപരിതലം കടലായിരിക്കുന്നത്.",
        remedyEn: "Proper spacing; remove infected stubbles; spray Validamycin or Hexaconazole." ,
        remedyMl: "സമയോചിതമായ ഇടവേള; ബാധിത സ്റ്റബ്ബിളുകൾ നീക്കം ചെയ്യുക; Validamycin അല്ലെങ്കിൽ Hexaconazole സ്പ്രേയ്."
      },
      {
        nameEn: "Bacterial Leaf Blight", nameMl: "ബാക്ടീരിയൽ ഇലവാട്ടം", type: "Bacterial", severity: "High",
        symptomsEn: "Leaf tips turn yellow and dry downward.", 
        symptomsMl: "ഇലവിന്റെ തലയിൽ മുത്തിരിക്കുന്നത്; കുഴപ്പങ്ങള്‍.",
        remedyEn: "Use resistant seeds; avoid excess nitrogen; spray Streptocycline + Copper oxychloride." ,
        remedyMl: "തീർച്ചയായ വരിയുകൾ; അമിതമായ നൈട്രജൻ ഒഴിവാക്കുക; Streptocycline + Copper oxychloride സ്പ്രേയ്."
      },
      {
        nameEn: "Rice Tungro Disease", nameMl: "തുംഗ്രോ രോഗം", type: "Viral", severity: "High",
        symptomsEn: "Leaves turn orange-yellow; plants become short; poor grain formation.", 
        symptomsMl: "ഇലവികൾ ഓറഞ്ച്-പച്ചകൾ ആയിരിക്കുന്നത്; ഉപരിതലം കടലായിരിക്കുന്നത്; വായുവിന്റെ കുഴപ്പങ്ങള്‍.",
        remedyEn: "Remove infected plants; control leafhopper (insecticide); early planting." ,
        remedyMl: "ബാധിത ഉപച്ചുകൾ നീക്കം ചെയ്യുക; leafhopper (insecticide) നിയന്ത്രിക്കുക; പ്രധാനമായ വളർച്ച." 
      }
    ]
  },
  {
    id: "maize",
    nameEn: "Maize (Corn)",
    nameMl: "ചോളം",
    scientific: "Zea mays",
    image: "https://i.pinimg.com/736x/d3/60/13/d36013ae30b23f13fb142f17c3ccd8c3.jpg",
    details: { temp: "18°C – 32°C", water: "No stagnation", seasons: "Kharif, Rabi", harvest: "90–110 days" },
    threats: [
      {
        nameEn: "Turcicum Leaf Blight", nameMl: "ടർസിക്കം ഇലവാട്ടം", type: "Fungal", severity: "Medium",
        symptomsEn: "Long brown patches on leaves; drying from bottom upward.",
        symptomsMl: "ഇലവികൾ നീളം ബ്രൗൺ പാച്ചുകൾ; താഴെയുള്ളത് നിറഞ്ഞത്.",
        remedyEn: "Avoid overcrowding; remove infected leaves; spray Mancozeb." ,
        remedyMl: "അവധിയില്ലാത്ത ഇടവേള; ബാധിത ഇലവികൾ നീക്കം ചെയ്യുക; Mancozeb സ്പ്രേയ്."

      },
      {
        nameEn: "Maydis Leaf Blight", nameMl: "മെയ്ഡിസ് ഇലവാട്ടം", type: "Fungal", severity: "Medium",
        symptomsEn: "Small brown spots; spots join together and dry leaf.", 
        symptomsMl: "ചെറിയ ബ്രൗൺ പാച്ചുകൾ; പാച്ചുകൾ കൂടിയാല്‍ ഇലവി ശ്വസനം കുറവാകുന്നത്.",
        remedyEn: "Crop rotation; field sanitation; spray Carbendazim or Mancozeb." ,
        remedyMl: "ക്രോപ് റോട്ടേഷൻ; ഫീൽڈ് സാനിറ്റേഷൻ; Carbendazim അല്ലെങ്കിൽ Mancozeb സ്പ്രേയ്."
      },
      {
        nameEn: "Bacterial Stalk Rot", nameMl: "ബാക്ടീരിയൽ തണ്ട് ചീയൽ", type: "Bacterial", severity: "High",
        symptomsEn: "Lower stem becomes soft; bad smell; plant falls down.", 
        symptomsMl: "താഴെയുള്ള തണ്ട് മൃദുവാകുന്നത്; കുഴപ്പങ്ങള്‍; ഉപരിതലം കടലായിരിക്കുന്നത്.",
        remedyEn: "Avoid water stagnation; improve drainage; do not overuse urea." ,
        remedyMl: "വെള്ളം നിലനിർത്തൽ ഒഴിവാക്കുക; ഡ്രൈനേജ് മെച്ചപ്പെടുത്തുക; urea വിപരീതമായി ഉപയോഗിക്കരുത്."

      },
      {
        nameEn: "Maize Mosaic Virus", nameMl: "മെയ്സ് മൊസൈക്", type: "Viral", severity: "Medium",
        symptomsEn: "Yellow stripe pattern on leaves; stunted growth; poor cob formation.",         
        symptomsMl: "ഇലവികൾ മഞ്ഞ ട്രൈപ്പ് പാറ്റേൺ; കുറച്ച് വളർച്ച; കുറച്ച് കോബ് രൂപകൽപ്പന.",         
        remedyEn: "Remove infected plants early; control aphids with Neem oil spray." ,
        remedyMl: "ബാധിത ഉപച്ചുകൾ നീക്കം ചെയ്യുക; aphids (Neem oil) നിയന്ത്രിക്കുക;"

      }
    ]
  },
  {
    id: "ragi",
    nameEn: "Ragi",
    nameMl: "റാഗി",
    scientific: "Eleusine coracana",
    image: "https://i.pinimg.com/1200x/c3/de/7e/c3de7e3d7045b8297329b3b993fdb3a4.jpg",
    details: { temp: "20°C – 30°C", water: "Drought tolerant", seasons: "May-Jun", harvest: "100–120 days" },
    threats: [
      {
        nameEn: "Blast Disease", nameMl: "ബ്ലാസ്റ്റ് രോഗം", type: "Fungal", severity: "High",
        symptomsEn: "Small grey spots; neck blast causes ear head to dry; poor grain filling.", 
        symptomsMl: "ചെറിയ ഗ്രേ പാച്ചുകൾ; നെക്ക് ബ്ലാസ്റ്റ് കോബ് തളർന്നത്; കുറച്ച് ഗ്രേണ്‍ നിറവ്.",
        remedyEn: "Early sowing; avoid excess nitrogen; seed treatment/spray with Carbendazim." ,
        remedyMl: "പ്രധാനമായ വളർച്ച; അമിതമായ നൈട്രജൻ ഒഴിവാക്കുക; Carbendazim ഉപയോഗിച്ച് സീഡ് ട്രെറ്റ്മെന്‍റ്/സ്പ്രേയ്."
      },
      {
        nameEn: "Leaf Spot", nameMl: "ഇലപ്പുള്ളി രോഗം", type: "Fungal", severity: "Medium",
        symptomsEn: "Round brown spots; leaves dry slowly.", 
        symptomsMl: "വട്ടം ബ്രൗൺ പാച്ചുകൾ; ഇലവികൾ നിലവിൽ കുറച്ച് ശ്വസനം.",
        remedyEn: "Field sanitation; crop rotation; spray Mancozeb." ,
        remedyMl: "ഫീൽڈ് സാനിറ്റേഷൻ; ക്രോപ് റോട്ടേഷൻ; Mancozeb സ്പ്രേയ്."
      }
    ]
  },
  {
    id: "coconut",
    nameEn: "Coconut",
    nameMl: "തെങ്ങ്",
    scientific: "Cocos nucifera",
    image: "https://i.pinimg.com/1200x/46/30/a6/4630a6bc0fedcb08241db32604cbf7b0.jpg",
    details: { care: "Clean crown regularly", drainage: "Well-drained soil", yield: "High with manure" },
    threats: [
      {
        nameEn: "Bud Rot", nameMl: "കൂമ്പ് ചീയൽ", type: "Fungal", severity: "High",
        symptomsEn: "Central spindle leaf turns yellow; crown rots with bad smell.", 
        symptomsMl: "മധ്യം സ്പൈണ്ട് ഇലവി മഞ്ഞാകുന്നത്; ക്രൌൺ കുഴപ്പങ്ങള്‍.",
        remedyEn: "Remove affected tissue; apply Bordeaux paste; spray Copper fungicide." ,
        remedyMl: "ബാധിത തുടക്കം നീക്കം ചെയ്യുക; Bordeaux paste പ്രയോഗിക്കുക; Copper fungicide സ്പ്രേയ്."
      },
      {
        nameEn: "Root Wilt", nameMl: "കാറ്റുവാട്ടം", type: "Fungal", severity: "High",
        symptomsEn: "Leaves droop; small nuts; low yield.", 
        symptomsMl: "ഇലവികൾ കുഴപ്പങ്ങള്‍; ചെറിയ നട്ടുകൾ; കുറച്ച് യിൽഡ്.",
        remedyEn: "Improve drainage; apply organic manure; balanced fertilizer." ,
        remedyMl: "ഡ്രൈനേജ് മെച്ചപ്പെടുത്തുക; ജനറൽ മന്നർ പ്രയോഗിക്കുക; ബാലൻസ് ഫർട്ടിലൈസർ."
      }
    ]
  },
  {
    id: "rubber",
    nameEn: "Rubber",
    nameMl: "റബ്ബർ",
    scientific: "Hevea brasiliensis",
    image: "https://i.pinimg.com/1200x/92/88/66/9288667a83dbb6bb632dfdca2449b50c.jpg",
    details: { yield: "Latex production", care: "Field hygiene", focus: "Leaf health" },
    threats: [
      {
        nameEn: "Abnormal Leaf Fall", nameMl: "ഇലകൊഴിച്ചിൽ", type: "Fungal", severity: "High",
        symptomsEn: "Leaves fall early; poor latex yield.", 
        symptomsMl: "ഇലവികൾ കുഴപ്പങ്ങള്‍; കുറച്ച് ലാറ്റെക്സ് യിൽഡ്.",
        remedyEn: "Spray Bordeaux mixture; maintain field hygiene." ,
        remedyMl: "Bordeaux mixture സ്പ്രേയ്; ഫീൽڈ് ഹയ്ജിന്‍ നിലനിർത്തുക."
      },
      {
        nameEn: "Mealy Bug", nameMl: "മിലി ബഗ്", type: "Pest", severity: "Medium",
        symptomsEn: "White cotton-like insects; leaf drying.", 
        symptomsMl: "വെള്ളി കോട്ടൺ-ലൈക് ഇന്റെർന്റ്; ഇലവി ശുദ്ധി.",
        remedyEn: "Neem oil spray; recommended insecticide if severe." ,
        remedyMl: "Neem oil സ്പ്രേയ്; കാര്യമായ ഇൻസെക്ടിസൈഡ് ഉപയോഗിക്കുക നിലവിൽ."
      }
    ]
  },
  {
    id: "arecanut",
    nameEn: "Arecanut",
    nameMl: "കമുകു",
    scientific: "Areca catechu",
    image: "https://i.pinimg.com/1200x/3b/65/97/3b659748247c450edc9afbce3834b7ad.jpg",
    details: { drainage: "Critical", fertilizer: "Balanced needed" },
    threats: [
      {
        nameEn: "Yellow Leaf Disease", nameMl: "മഞ്ഞളിപ്പ്", type: "Disease", severity: "High",
        symptomsEn: "Yellowing leaves; reduced nut size.",  
        symptomsMl: "മഞ്ഞാകുന്നത്; കുറച്ച് നട്ടുകൾ.",
        remedyEn: "Balanced fertilizer; improve drainage." ,
        remedyMl: "ബാലൻസ് ഫർട്ടിലൈസർ; ഡ്രൈനേജ് മെച്ചപ്പെടുത്തുക."
      },
      {
        nameEn: "Fruit Rot (Koleroga)", nameMl: "മഹാളി", type: "Fungal", severity: "High",
        symptomsEn: "Nuts turn black; premature nut fall.",  
        symptomsMl: "നട്ടുകൾ കറുത്ത് മാറുന്നത്; പ്രാധാനമായ നട്ടുകൾ കുഴപ്പങ്ങള്‍.",
        remedyEn: "Spray Bordeaux mixture before monsoon." ,
        remedyMl: "മോൺസൂൺ മുൻപ് Bordeaux mixture സ്പ്രേയ്."
      }
    ]
  },
  {
    id: "coffee",
    nameEn: "Coffee",
    nameMl: "കാപ്പി",
    scientific: "Coffea spp.",
    image: "https://i.pinimg.com/1200x/ae/a9/75/aea9755df358dde9e866052d6b154420.jpg",
    details: { care: "Shade trees needed", harvest: "Nov – Feb" },
    threats: [
      {
        nameEn: "Coffee Leaf Rust", nameMl: "തുരുമ്പ് രോഗം", type: "Fungal", severity: "High",
        symptomsEn: "Orange/yellow powder under leaf; yellow spots on upper leaf; early leaf fall.",  
        symptomsMl: "ഓറഞ്ച്/പച്ച പൌഡർ ഇലവികൾ താഴെ; മുകളിലെ ഇലവികൾ മഞ്ഞ; പ്രാധാനമായ ഇലവി കുഴപ്പങ്ങള്‍.",
        remedyEn: "Spray Copper fungicide; maintain shade; balanced fertilizer." ,
        remedyMl: "Copper fungicide സ്പ്രേയ്; ഷേഡ് നിലനിർത്തുക; ബാലൻസ് ഫർട്ടിലൈസർ."
      },
      {
        nameEn: "Berry Disease", nameMl: "കായ രോഗം", type: "Disease", severity: "High",
        symptomsEn: "Black spots on green berries; berry shrinks and drops.",  
        symptomsMl: "കറുത്ത് പാച്ചുകൾ വെള്ളി നട്ടുകൾ; നട്ടുകൾ കുഴപ്പങ്ങള്‍.",
        remedyEn: "Spray fungicide before flowering; proper pruning; field sanitation." ,
        remedyMl: "ഫ്ലോറിംഗ് മുൻപ് fungicide സ്പ്രേയ്; ശരിയായ പ്രൈനിംഗ്; ഫീൽڈ് സാനിറ്റേഷൻ."
      },
      {
        nameEn: "Root Rot", nameMl: "വേരുചീയൽ", type: "Fungal", severity: "Medium",
        symptomsEn: "Yellowing leaves; wilting; plant slowly dies.",  
        symptomsMl: "മഞ്ഞാകുന്നത്; വില്ലിംഗ്; പ്ലാന്റ് നേരിച്ച് മരിക്കുന്നത്.",
        remedyEn: "Improve drainage; remove affected plants; apply Trichoderma." ,
        remedyMl: "ഡ്രൈനേജ് മെച്ചപ്പെടുത്തുക; ബാധിത പ്ലാന്റുകൾ നീക്കം ചെയ്യുക; Trichoderma പ്രയോഗിക്കുക."
      },
      {
        nameEn: "Mealy Bugs", nameMl: "മിലി ബഗ്", type: "Pest", severity: "Medium",
        symptomsEn: "White cotton-like insects; sooty black fungus on leaves.",  
        symptomsMl: "വെള്ളി കോട്ടൺ-ലൈക് ഇന്റെർന്റ്; ഇലവി ശുദ്ധി.",
        remedyEn: "Neem oil spray; release natural predators; insecticide if heavy." ,
        remedyMl: "Neem oil സ്പ്രേയ്; നാറ്റൽ പ്രെഡേറ്റർമാരെ വിട്ടുവിടുക; ഇൻസെക്ടിസൈഡ് ഉപയോഗിക്കുക നിലവിൽ."
      }
    ]
  },
  {
    id: "tea",
    nameEn: "Tea",
    nameMl: "തേയില",
    scientific: "Camellia sinensis",
    image: "https://i.pinimg.com/736x/31/82/33/318233368d7a103a4980ab0b98132af8.jpg",
    details: { care: "Timely pruning", focus: "Rainy season protection" },
    threats: [
      {
        nameEn: "Blister Blight", nameMl: "ബ്ലിസ്റ്റർ ബ്ലൈറ്റ്", type: "Fungal", severity: "Medium",
        symptomsEn: "Small blister-like spots on young leaves; leaves curl and fall.",  
        symptomsMl: "ചെറിയ ബ്ലിസ്റ്റർ-ലൈക് സ്പോട്ടുകൾ തുറന്ന ഇലവികൾ; ഇലവികൾ കുഴപ്പങ്ങള്‍.",
        remedyEn: "Spray fungicide during rainy season; proper spacing; pruning." ,
        remedyMl: "മഴയായിരിക്കുന്ന സമയത്ത് fungicide സ്പ്രേയ്; ശരിയായ സ്പേസിംഗ്; പ്രൈനിംഗ്."
      },
      {
        nameEn: "Root Rot", nameMl: "വേരുചീയൽ", type: "Fungal", severity: "Medium",
        symptomsEn: "Yellowing leaves; wilting; plant death.",  
        symptomsMl: "മഞ്ഞാകുന്നത്; വില്ലിംഗ്; പ്ലാന്റ് നേരിച്ച് മരിക്കുന്നത്.",
        remedyEn: "Improve drainage; remove affected plants; apply Trichoderma." ,
        remedyMl: "ഡ്രൈനേജ് മെച്ചപ്പെടുത്തുക; ബാധിത പ്ലാന്റുകൾ നീക്കം ചെയ്യുക; Trichoderma പ്രയോഗിക്കുക."
      }
    ]
  },
  {
    id: "cashew",
    nameEn: "Cashew",
    nameMl: "കശുവണ്ടി",
    scientific: "Anacardium occidentale",
    image: "https://i.pinimg.com/736x/b5/9c/b2/b59cb20d0535627da526198c73c2e736.jpg",
    details: { harvest: "Feb – Apr", care: "Spray before flowering" },
    threats: [
      {
        nameEn: "Powdery Mildew", nameMl: "ചാരപ്പൂപ്പ്", type: "Fungal", severity: "Medium",
        symptomsEn: "White powder on flowers; flower drying; poor nut setting.",  
        symptomsMl: "ഓറഞ്ച്/പച്ച പൌഡർ ഇലവികൾ താഴെ; മുകളിലെ ഇലവികൾ മഞ്ഞ; പ്രാധാനമായ ഇലവി കുഴപ്പങ്ങള്‍.",
        remedyEn: "Spray wettable sulphur before flowering." ,
        remedyMl: "ഫ്ലോറിംഗ് മുൻപ് wettable sulphur സ്പ്രേയ്." 
      },
      {
        nameEn: "Dieback", nameMl: "ഡൈബാക്ക്", type: "Disease", severity: "Medium",
        symptomsEn: "Branch tips dry; black patches on stem.",  
        symptomsMl: "ശാഖകൾ ശുദ്ധി; സ്റ്റെം കറുത്ത് പാച്ചുകൾ.",
        remedyEn: "Cut affected branches; apply Bordeaux paste." ,
        remedyMl: "ബാധിത ശാഖകൾ കൈവരുക; Bordeaux paste പ്രയോഗിക്കുക."
      }
    ]
  },
  {
    id: "cocoa",
    nameEn: "Cocoa",
    nameMl: "കൊക്കോ",
    scientific: "Theobroma cacao",
    image: "https://i.pinimg.com/1200x/aa/18/5d/aa185dead70a3df5c6dd92e2408db78f.jpg",
    details: { care: "Harvest pods timely", spacing: "Improve air circulation" },
    threats: [
      {
        nameEn: "Black Pod Disease", nameMl: "കായ ചീയൽ", type: "Fungal", severity: "High",
        symptomsEn: "Brown patch on pod; pod becomes black and rotten.", 
        symptomsMl: "കറുത്ത് പാച്ചുകൾ ചീയൽ; ചീയൽ കറുത്ത് മാറുന്നത്.",
        remedyEn: "Remove infected pods immediately; spray Copper fungicide." ,
        remedyMl: "ബാധിത ചീയൽമാര്‍ തുടർന്ന് നീക്കം ചെയ്യുക; Copper fungicide സ്പ്രേയ്." 
      },
      {
        nameEn: "Stem Canker", nameMl: "കാണ്ഡം വാട്ടം", type: "Disease", severity: "Medium",
        symptomsEn: "Brown patches on stem; bark cracking.",  
        symptomsMl: "കറുത്ത് പാച്ചുകൾ സ്റ്റെം; ബാർക്ക് ക്രാക്കിംഗ്.",
        remedyEn: "Scrape affected area; apply Bordeaux paste." ,
        remedyMl: "ബാധിത പേര്; Bordeaux paste പ്രയോഗിക്കുക."
      },
      {
        nameEn: "Cocoa Pod Borer", nameMl: "കൊക്കോ കായതുരപ്പൻ", type: "Pest", severity: "High",
        symptomsEn: "Small holes in pod; beans damaged inside.",  
        symptomsMl: "ചെറിയ ദുര്ബലങ്ങൾ ചീയൽ; ഇന്ത്യൻ കായതുരപ്പൻ.",
        remedyEn: "Remove affected pods; timely harvesting; insecticide if severe." ,
        remedyMl: "ബാധിത ചീയൽമാര്‍ നീക്കം ചെയ്യുക; സമയപ്പെട്ട കളവ്; ഇൻസെക്ടിസൈഡ് ഉപയോഗിക്കുക നിലവിൽ."
      },
      {
        nameEn: "Mealy Bugs", nameMl: "മിലി ബഗ്", type: "Pest", severity: "Medium",
        symptomsEn: "White cotton insects; sooty mould on leaves.",  
        symptomsMl: "വെള്ളി കോട്ടൺ-ലൈക് ഇന്റെർന്റ്; ഇലവി ശുദ്ധി.",
        remedyEn: "Neem oil spray; encourage natural enemies." ,
        remedyMl: "Neem oil സ്പ്രേയ്; നാറ്റൽ പ്രെഡേറ്റർമാരെ വിട്ടുവിടുക."
      }
    ]
  }
];

export default function DiagnosticHub({ lang = 'en' }) {
  const [selectedCrop, setSelectedCrop] = useState(CROP_DATABASE[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const isEn = lang === 'en';

  const filteredCrops = CROP_DATABASE.filter(c => 
    c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nameMl.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-20 font-sans">
      {/* Header with Search */}
      <header className="bg-emerald-950 pt-16 pb-24 px-6 text-white text-center">
        <h1 className="text-4xl font-black mb-4">
          {isEn ? "Diagnostic" : "രോഗനിർണ്ണയ"} <span className="text-emerald-400">Hub</span>
        </h1>
        
        <div className="max-w-md mx-auto relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800" size={18} />
          <input 
            type="text" 
            placeholder={isEn ? "Search crop or disease..." : "തിരയുക..."}
            className="w-full bg-white rounded-full py-4 pl-12 pr-6 text-stone-900 font-bold outline-none border-none shadow-xl"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Crop Selection Scroller */}
        <div className="flex gap-3 overflow-x-auto pb-4 px-2 no-scrollbar justify-center">
          {filteredCrops.map(crop => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all ${
                selectedCrop.id === crop.id ? "bg-emerald-500 text-white shadow-lg" : "bg-emerald-900/50 text-emerald-200"
              }`}
            >
              {isEn ? crop.nameEn : crop.nameMl}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 -mt-12">
        {/* Selected Crop Profile Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden mb-10 border border-stone-100">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 h-64 md:h-64 overflow-hidden">
              <img src={selectedCrop.image} alt={selectedCrop.nameEn} className="w-full h-full object-cover transition-transform hover:scale-105" />
            </div>
            <div className="p-8 md:w-2/3">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-black text-stone-800 mb-1">{isEn ? selectedCrop.nameEn : selectedCrop.nameMl}</h2>
                  <p className="text-emerald-600 italic font-semibold">{selectedCrop.scientific}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-2xl"><Sprout size={24}/></div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(selectedCrop.details).map(([key, val]) => (
                  <div key={key} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                    <p className="text-[9px] uppercase font-black text-stone-400 mb-1">{key}</p>
                    <p className="text-xs font-bold text-stone-700">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* List of Threats (Diseases/Pests) for the Crop */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-stone-800 mb-6 flex items-center gap-2">
            <ShieldAlert className="text-red-500" />
            {isEn ? "Registry of Threats" : "രോഗങ്ങളും കീടങ്ങളും"}
          </h3>

          {selectedCrop.threats.map((threat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      threat.type === 'Pest' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {threat.type}
                    </span>
                    {threat.severity === 'High' && <span className="bg-red-500 text-white text-[9px] px-2 py-1 rounded-md font-black">HIGH RISK</span>}
                  </div>
                  <h4 className="text-2xl font-black text-stone-800">{isEn ? threat.nameEn : threat.nameMl}</h4>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl text-stone-400">
                  {threat.type === 'Pest' ? <Bug size={24}/> : <FlaskConical size={24}/>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Stethoscope size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-blue-600 mb-1">{isEn ? "Symptoms" : "ലക്ഷണങ്ങൾ"}</p>
                    <p className="text-stone-700 font-bold leading-relaxed">{isEn ? threat.symptomsEn : threat.symptomsMl}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Droplet size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">{isEn ? "Management" : "പ്രതിവിധി"}</p>
                    <p className="text-stone-700 font-bold leading-relaxed">{isEn ? threat.remedyEn : threat.remedyMl}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

       {/* General Management Tips for the Farmer */}
<div className="mt-12 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100">
  <h4 className="text-lg font-black text-amber-900 flex items-center gap-2 mb-4">
    <Info size={20}/> {isEn ? "Expert Sanitation Tips" : "പ്രധാന നിർദ്ദേശങ്ങൾ"}
  </h4>
  <ul className="grid md:grid-cols-2 gap-4 text-sm font-bold text-amber-800">
    <li className="flex gap-2"><span>•</span> {isEn ? "Avoid excess nitrogen (Urea) fertilizer." : "അമിതമായ നൈട്രജൻ വളം ഒഴിവാക്കുക."} </li>
    <li className="flex gap-2"><span>•</span> {isEn ? "Good drainage is very important." : "നീർവാർച്ച സൗകര്യം ഉറപ്പാക്കുക."} </li>
    <li className="flex gap-2"><span>•</span> {isEn ? "Regular field inspection every 10-15 days." : "10-15 ദിവസത്തിലൊരിക്കൽ പരിശോധിക്കുക."} </li>
    <li className="flex gap-2"><span>•</span> {isEn ? "Remove diseased plant parts immediately." : "രോഗം ബാധിച്ച ഭാഗങ്ങൾ ഉടൻ മാറ്റുക."} </li>
    <li className="flex gap-2"><span>•</span> {isEn ? "Regular pruning increases yield and improves air circulation." : "യഥാസമയമുള്ള കൊമ്പുകോതൽ വിളവ് കൂട്ടുകയും വായുസഞ്ചാരം മെച്ചപ്പെടുത്തുകയും ചെയ്യുന്നു."} </li>
  </ul>
</div>
      </main>
    </div>
  );
}