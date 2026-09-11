// ============================================================
//  THE ARCHIVE'S FESTIVAL ENTRIES  —  src/data/entries.js
// ------------------------------------------------------------
//  Single source of truth for the homepage card grid.
//
//  Note on the extension: the assignment referenced
//  `src/data/entries.ts`, but this project is JavaScript-only
//  (AGENTS.md rule: no .ts / .tsx files, ever), so the file is
//  `.js` while keeping the exact same schema shape:
//
//    id, titleKhmer, titleEnglish, category,
//    descriptionKhmer, descriptionEnglish,
//    seasonOrMonth, tags, imagePath
//
//  imagePath points at an asset already present in /public whose
//  filename matches the entry's titleEnglish (kept as-is on disk).
// ============================================================

export const archiveEntries = [
  {
    id: "choul-chnam-thmey",
    titleKhmer: "ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ",
    titleEnglish: "Khmer New Year (Choul Chnam Thmey)",
    category: "National Holiday",
    descriptionKhmer:
      "ពិធីបុណ្យចូលឆ្នាំថ្មី គឺជាការប្រារព្វធ្វើបីថ្ងៃ ដើម្បីបង្ហាញពីការបញ្ចប់រដូវប្រមូលផល ដោយមានការលេងល្បែងប្រពៃណី ការទៅវត្ត និងការប្រោះទឹកអប់រំ",
    descriptionEnglish:
      "The three-day celebration marking the end of the harvesting season, featuring traditional games, temple visits, and water pouring rituals.",
    seasonOrMonth: "April",
    tags: ["Holiday", "Festival", "New Year", "Spring"],
    imagePath: "/Khmer New Year (Choul Chnam Thmey).png",
  },
  {
    id: "pchum-ben",
    titleKhmer: "ពិធីបុណ្យភ្ជុំបិណ្ឌ",
    titleEnglish: "Pchum Ben (Ancestors' Day)",
    category: "Religious Festival",
    descriptionKhmer:
      "ពិធីបុណ្យភ្ជុំបិណ្ឌ គឺជាបុណ្យសាសនាដែលមានរយៈពេល ១៥ ថ្ងៃ ដែលប្រជាជនខ្មែរឧទ្ទិសកុសលដល់បុព្វបុរស តាមរយៈការវេរចង្ហាន់ និងស្បៀងអាហារនៅតាមវត្តអារាម",
    descriptionEnglish:
      "A 15-day religious festival where Cambodians pay respects to deceased ancestors through food offerings at pagodas.",
    seasonOrMonth: "September / October",
    tags: ["Religion", "Buddhism", "Ancestors", "Pagoda"],
    imagePath: "/Pchum Ben (Ancestors' Day).png",
  },
  {
    id: "bon-om-touk",
    titleKhmer: "ព្រះរាជពិធីបុណ្យអុំទូក",
    titleEnglish: "Water Festival (Bon Om Touk)",
    category: "National Festival",
    descriptionKhmer:
      "ព្រះរាជពិធីបុណ្យអុំទូក ប្រារព្វធ្វើជាកិត្តិយសដល់ការបញ្ច្រាសលំហូរទន្លេសាប ដោយមានការប្រណាំងទូកនៅមុខរាជធានីភ្នំពេញ និងបណ្តែតប្រទីបនៅពេលយប់",
    descriptionEnglish:
      "Celebrates the reversal of the Tonle Sap River's flow with boat races along the Phnom Penh riverfront and night lantern floats.",
    seasonOrMonth: "November",
    tags: ["Festival", "Boats", "Phnom Penh", "River"],
    imagePath: "/Water Festival (Bon Om Touk).png",
  },
  {
    id: "meak-bochea",
    titleKhmer: "ពិធីបុណ្យមាឃបូជា",
    titleEnglish: "Meak Bochea",
    category: "Religious Holiday",
    descriptionKhmer:
      "ពិធីបុណ្យមាឃបូជា ជាការរំលឹកដល់ធម្មទេសនាចុងក្រោយរបស់ព្រះពុទ្ធ ចំពោះព្រះសង្ឃ ១២៥០ អង្គ ដែលបានមកជួបជុំគ្នាដោយឯកឯង ដោយឥតមានការកោះហៅ",
    descriptionEnglish:
      "Commemorates the final sermon given by the Buddha to 1,250 enlightened monks who gathered spontaneously without prior summoning.",
    seasonOrMonth: "February",
    tags: ["Buddhism", "Religion", "Monks", "Holiday"],
    imagePath: "/Meak Bochea.png",
  },
  {
    id: "royal-plowing-ceremony",
    titleKhmer: "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល",
    titleEnglish:
      "Royal Plowing Ceremony (Preah Reach Pithi Chrot Preah Nongkoal)",
    category: "Royal Ceremony",
    descriptionKhmer:
      "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល ជាពិធីកសិកម្មរាជវង្សបុរាណ ដែលប្រើសម្រាប់ទស្សន៍ទាយការប្រមូលផល អាកាសធាតុ និងទិន្នផលដំណាំនាពេលខាងមុខ",
    descriptionEnglish:
      "An ancient royal agricultural rite used to predict the upcoming harvest, weather patterns, and crop yields.",
    seasonOrMonth: "May",
    tags: ["Royal", "Agriculture", "Ceremony", "Tradition"],
    imagePath:
      "/Royal Plowing Ceremony (Preah Reach Pithi Chrot Preah Nongkoal).png",
  },
  {
    id: "independence-day",
    titleKhmer: "ទិវាបុណ្យឯករាជ្យជាតិ",
    titleEnglish: "National Independence Day",
    category: "National Holiday",
    descriptionKhmer:
      "រំលឹកខួបនៃការទទួលបានឯករាជ្យពេញលេញរបស់ប្រទេសកម្ពុជាពីអាណានិគមបារាំងក្នុងឆ្នាំ ១៩៥៣ ដោយមានការប្រារព្វពិធីយ៉ាងអធិកអធមនៅវិមានឯករាជ្យ",
    descriptionEnglish:
      "Commemorates Cambodia's independence from French colonial rule in 1953, centered around celebrations at the Independence Monument.",
    seasonOrMonth: "November",
    tags: ["History", "Independence", "National", "Phnom Penh"],
    imagePath:
      "/Royal Plowing Ceremony (Preah Reach Pithi Chrot Preah Nongkoal).png",
  },
  {
    id: "king-norodom-sihamoni-birthday",
    titleKhmer:
      "ព្រះរាជពិធីបុណ្យចំរើនព្រះជន្ម ព្រះករុណាព្រះបាទសម្តេចព្រះបរមនាថ នរោត្តម សីហមុនី",
    titleEnglish: "King Norodom Sihamoni's Birthday",
    category: "Royal Holiday",
    descriptionKhmer:
      "ទិវាបុណ្យជាតិផ្លូវការ ដើម្បីអបអរសាទរព្រះរាជពិធីបុណ្យចំរើនព្រះជន្ម និងរជ្ជកាលរបស់ព្រះមហាក្សត្រនៃព្រះរាជាណាចក្រកម្ពុជា",
    descriptionEnglish:
      "Official national holiday honoring the birth and reign of the reigning Monarch of the Kingdom of Cambodia.",
    seasonOrMonth: "May",
    tags: ["Royal", "Monarchy", "Holiday", "National"],
    imagePath:
      "/Royal Plowing Ceremony (Preah Reach Pithi Chrot Preah Nongkoal).png",
  },
  {
    id: "visak-bochea",
    titleKhmer: "ពិធីបុណ្យវិសាខបូជា",
    titleEnglish: "Visak Bochea",
    category: "Religious Holiday",
    descriptionKhmer:
      "ប្រារព្វពិធីរំលឹកដល់ការប្រសូត ការត្រាស់ដឹង និងការបរិនិព្វានរបស់ព្រះសម្ពុទ្ធ នៅក្នុងថ្ងៃពេញបូណ៌មី",
    descriptionEnglish:
      "Celebrates the birth, enlightenment, and passing (Nirvana) of the Buddha on the night of the full moon.",
    seasonOrMonth: "May",
    tags: ["Buddhism", "Religion", "Buddha", "Holiday"],
    imagePath:
      "/Royal Plowing Ceremony (Preah Reach Pithi Chrot Preah Nongkoal).png",
  },
];
