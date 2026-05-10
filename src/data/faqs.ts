export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
  pages?: string[]; // Empty array means show on all pages
}

export const faqs: FaqEntry[] = [
  {
    id: "general-pricing",
    question: "Wie viel kostet es, eine Partybox in Stuttgart zu mieten?",
    answer: "Unsere Partyboxen (z.B. JBL Partybox) sind bereits ab 80€ pro Boxenpaar und Tag verfügbar. Eine einzelne Box kostet 50€ pro Tag.",
    pages: ["index"]
  },
  {
    id: "pa-anlage-50-personen",
    question: "Welche PA-Anlage eignet sich für 50 Personen?",
    answer: "Für Veranstaltungen mit 50-80 Personen empfehle ich unsere JBL Partyboxen oder das LD Maui 28 G3 Komplettset. Beide sind Plug & Play und in 5 Minuten aufgebaut.",
    pages: ["index"]
  },
  {
    id: "zahlungsmethoden",
    question: "Wie funktioniert die Bezahlung?",
    answer: "Die Bezahlung erfolgt bei Abholung. Ich biete Barzahlung und PayPal an!",
    pages: ["index"]
  },
  {
    id: "abholort",
    question: "Wo kann ich die Technik abholen?",
    answer: "Die Technik kann direkt in Leinfelden-Echterdingen (Magellanstraße 4) abgeholt werden. Ich erkläre dir ausführlich den Aufbau und gebe dir eine Einweisung.",
    pages: ["index"]
  },
  {
    id: "lichtanlage-preis",
    question: "Was kostet eine Party-Lichtanlage?",
    answer: "Eine vollständige Partylichtanlage mit verschiedenen Effekten ist bereits ab 50€ pro Tag verfügbar. Inklusive persönlicher Beratung und Einweisung.",
    pages: ["index"]
  },
  {
    id: "nebelmaschine-pakete",
    question: "Bietest du auch Pakete mit Nebelmaschine?",
    answer: "Ja, ich biete die Partylichtanlagen auch zusammen mit einer Nebelmaschine an. Das Komplettpaket gibt es ab 60€ pro Tag.",
    pages: ["index"]
  },
  {
    id: "vorkenntnisse",
    question: "Brauche ich Vorkenntnisse, um die Anlage zu bedienen?",
    answer: "Nein, ich biete eine umfassende Einweisung an. Die Technik ist für jeden Benutzer einfach zu bedienen.",
    pages: ["index"]
  },
  {
    id: "transport-fahrzeug",
    question: "Reicht ein normales Auto für den Transport oder brauche ich einen Kombi/Transporter?",
    answer: "Die einzelnen Komponenten sind gut in einem Kombi oder Kleinwagen mit umklappbarer Rückbank zu transportieren. Für größere Pakete oder mehrere Boxen empfehle ich einen Kombi oder Transporter. Ich berate dich gerne, welche Fahrzeuge geeignet sind.",
    pages: ["index"]
  },
  {
    id: "kurzfristig-anfrage",
    question: "Was tun, wenn die Party schon in 3 Tagen ist?",
    answer: "Ja, ich reagiere auch kurzfristig! Anfragen bis zu 2 Tagen vor der Veranstaltung sind meist noch möglich. Am besten rufst du mich direkt an unter 0171/1467491 für schnelle Abstimmung. Ich habe oft noch freie Geräte verfügbar.",
    pages: ["index"]
  },
];
