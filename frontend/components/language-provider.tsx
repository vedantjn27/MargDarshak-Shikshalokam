"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

type Language = "en" | "hi"

interface Translations {
  [key: string]: {
    en: string
    hi: string
  }
}

const translations: Translations = {
  // Navigation
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.organization": { en: "Organization", hi: "संगठन" },
  "nav.problem": { en: "Problem Definition", hi: "समस्या परिभाषा" },
  "nav.outcomes": { en: "Student Outcomes", hi: "छात्र परिणाम" },
  "nav.methodology": { en: "Methodology", hi: "कार्यप्रणाली" },
  "nav.toc": { en: "Theory of Change", hi: "परिवर्तन का सिद्धांत" },
  "nav.stakeholders": { en: "Stakeholders", hi: "हितधारक" },
  "nav.indicators": { en: "Indicators", hi: "संकेतक" },
  "nav.quality": { en: "Quality Check", hi: "गुणवत्ता जांच" },
  "nav.export": { en: "Export", hi: "निर्यात" },
  "nav.templates": { en: "Templates", hi: "टेम्पलेट्स" },
  "nav.settings": { en: "Settings", hi: "सेटिंग्स" },

  "app.name": { en: "MargDarshak", hi: "मार्गदर्शक" },
  "app.tagline": { en: "From Blank Page to Blueprint", hi: "खाली पन्ने से खाका तक" },

  // Common
  "common.save": { en: "Save", hi: "सहेजें" },
  "common.cancel": { en: "Cancel", hi: "रद्द करें" },
  "common.submit": { en: "Submit", hi: "जमा करें" },
  "common.next": { en: "Next", hi: "अगला" },
  "common.previous": { en: "Previous", hi: "पिछला" },
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "common.error": { en: "Error", hi: "त्रुटि" },
  "common.success": { en: "Success", hi: "सफलता" },
  "common.search": { en: "Search", hi: "खोजें" },
  "common.filter": { en: "Filter", hi: "फ़िल्टर" },
  "common.view": { en: "View", hi: "देखें" },
  "common.edit": { en: "Edit", hi: "संपादित करें" },
  "common.delete": { en: "Delete", hi: "हटाएं" },
  "common.create": { en: "Create", hi: "बनाएं" },

  // Dashboard
  "dashboard.welcome": { en: "Welcome to MargDarshak", hi: "मार्गदर्शक में आपका स्वागत है" },
  "dashboard.subtitle": { en: "From Blank Page to Blueprint", hi: "खाली पन्ने से खाका तक" },
  "dashboard.getStarted": { en: "Get Started", hi: "शुरू करें" },
  "dashboard.completeness": { en: "LFA Completeness", hi: "LFA पूर्णता" },
  "dashboard.quality": { en: "Design Quality", hi: "डिजाइन गुणवत्ता" },
  "dashboard.progress": { en: "Your Progress", hi: "आपकी प्रगति" },

  // Organization
  "org.name": { en: "Organization Name", hi: "संगठन का नाम" },
  "org.state": { en: "State", hi: "राज्य" },
  "org.district": { en: "District", hi: "जिला" },
  "org.theme": { en: "Thematic Focus", hi: "विषयगत फोकस" },
  "org.maturity": { en: "Maturity Level", hi: "परिपक्वता स्तर" },
  "org.reach": { en: "Reach Metrics", hi: "पहुंच मैट्रिक्स" },
  "org.team": { en: "Team Size", hi: "टीम का आकार" },

  // Problem
  "problem.core": { en: "Core Problem", hi: "मुख्य समस्या" },
  "problem.stakeholders": { en: "Affected Stakeholders", hi: "प्रभावित हितधारक" },
  "problem.evidence": { en: "Evidence", hi: "साक्ष्य" },
  "problem.refine": { en: "AI Refine", hi: "AI परिष्कृत" },
  "problem.tree": { en: "Problem Tree", hi: "समस्या वृक्ष" },
  "problem.clarity": { en: "Clarity Score", hi: "स्पष्टता स्कोर" },

  // Outcomes
  "outcomes.statement": { en: "Outcome Statement", hi: "परिणाम विवरण" },
  "outcomes.baseline": { en: "Baseline Value", hi: "आधारभूत मूल्य" },
  "outcomes.target": { en: "Target Value", hi: "लक्ष्य मूल्य" },
  "outcomes.timeline": { en: "Timeline (months)", hi: "समयरेखा (महीने)" },
  "outcomes.smart": { en: "SMART Validation", hi: "SMART मान्यता" },

  // Theory of Change
  "toc.activities": { en: "Activities", hi: "गतिविधियां" },
  "toc.outputs": { en: "Outputs", hi: "आउटपुट" },
  "toc.outcomes": { en: "Outcomes", hi: "परिणाम" },
  "toc.impact": { en: "Impact", hi: "प्रभाव" },
  "toc.validate": { en: "Validate Logic", hi: "तर्क मान्य करें" },

  // Export
  "export.pdf": { en: "Export PDF", hi: "PDF निर्यात" },
  "export.excel": { en: "Export Excel", hi: "Excel निर्यात" },
  "export.ppt": { en: "Export Presentation", hi: "प्रस्तुति निर्यात" },
  "export.diagram": { en: "Export Diagram", hi: "आरेख निर्यात" },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = useCallback(
    (key: string): string => {
      const translation = translations[key]
      if (!translation) return key
      return translation[language] || translation.en || key
    },
    [language],
  )

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
