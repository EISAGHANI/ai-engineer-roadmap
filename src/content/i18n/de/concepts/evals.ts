import type { ConceptTranslations } from "../../types";

/** Bereich Evals auf Deutsch. Szene: eine Klassenarbeit und eine faire Lehrerin. */
const concepts: ConceptTranslations = {
  "evals-01": {
    official: "Eine feste Menge an Eingaben mit erwarteten Ausgaben. Jede Änderung wird damit getestet.",
    kid: "Eine Lehrerin hat einen Lösungsbogen für die Klassenarbeit. Jedes Mal, wenn sich der Computer ändert, schreibt er dieselbe Arbeit, und wir vergleichen seine Antworten mit dem Bogen.",
    realWorld: {
      title: "Der Lösungsbogen in der Schublade",
      text: "Die Lehrerin bewahrt einen festen Test in ihrer Schublade auf: 50 Fragen mit den richtigen Antworten, von ihr geschrieben. Immer wenn der Hausaufgaben-Roboter der Schule ein Update bekommt, gibt sie ihm genau diesen Test und korrigiert ihn mit dem Bogen. Hatte er letzten Monat 46 Punkte und jetzt 41, ist etwas schlechter geworden, und sie weiß, welche Fragen kaputtgegangen sind.",
    },
    engineering: {
      text: "Ein Golden Dataset ist eine feste, versionierte Menge an Eingaben mit erwarteten Ausgaben (oder Bewertungskriterien), von Menschen geschrieben oder geprüft, mit der jede Änderung getestet wird. Starte mit 30-100 Fällen aus echter Nutzung, deck die Hauptaufgaben plus bekannte Sonderfälle und frühere Fehler ab, tagge sie nach Kategorie und erweitere sie laufend. Halte sie aus Prompts und Trainingsdaten heraus und behandle Änderungen daran wie Codeänderungen.",
      pitfalls: [
        "Ein Golden Set nur aus leichten Fragen wiegt dich in falscher Sicherheit; nimm schwere und knifflige Fälle auf.",
        "Gelangen die Fälle in Prompts oder Fine-Tuning-Daten, bedeutet der Score nichts mehr.",
        "Prüf erwartete Antworten neu, wenn sich die Fakten dahinter ändern, sonst werden richtige Antworten als falsch gewertet.",
      ],
    },
    keywords: ["Testset", "Lösungsbogen", "Referenz"],
  },
  "evals-02": {
    name: "Fehleranalyse",
    official: "Lies echte Fehler, gruppiere sie nach Typ und behebe die größte Gruppe zuerst.",
    kid: "Wenn viele Kinder Fragen falsch beantworten, sortiert die Lehrerin die Fehler auf Stapel. Den größten Stapel nimmt sie sich zuerst vor, weil das den meisten hilft.",
    realWorld: {
      title: "Die falschen Antworten auf Stapel sortieren",
      text: "Nach der Arbeit zählt die Lehrerin nicht nur die falschen Antworten. Sie liest jede und schreibt eine kurze Notiz: „Daten verwechselt“, „falsches Kapitel benutzt“, „Frage nicht beantwortet“. Dann sortiert sie die Notizen auf Stapel. Zwanzig Fehler kommen vom falschen Kapitel, drei von Daten. Also erklärt sie zuerst das Kapitel noch einmal.",
    },
    engineering: {
      text: "Fehleranalyse heißt: echte Fehler lesen (Traces, bei denen die Ausgabe falsch oder nutzlos war), zu jedem eine kurze Freitext-Notiz schreiben, die Notizen zu Fehlerkategorien gruppieren und zählen. So wird aus einem vagen „der Bot ist manchmal schlecht“ eine sortierte Liste konkreter Probleme, von denen jedes eine gezielte Lösung und ein eigenes Eval bekommen kann. Sie ist die wertvollste Eval-Tätigkeit und sollte vor automatisierten Metriken kommen.",
      pitfalls: [
        "Metriken zu wählen, bevor man Fehler gelesen hat, führt dazu, das Falsche zu messen.",
        "Schau dir echte Traces an, nicht nur Gesamtwerte.",
        "Wiederhole sie nach großen Änderungen: Eine behobene Kategorie bringt oft die nächste ans Licht.",
      ],
    },
    keywords: ["Fehler", "Analyse", "Kategorien"],
  },
  "evals-03": {
    official:
      "Ein starkes Modell mit klarer Rubrik bewertet Ausgaben, damit du Tausende davon bewerten kannst.",
    kid: "Tausende Klassenarbeiten zu korrigieren ist zu viel für eine Lehrerin. Also korrigiert ein sehr schlauer Helfer sie mit den klaren Bewertungsregeln der Lehrerin.",
    realWorld: {
      title: "Eine vertrauenswürdige Assistentin korrigiert",
      text: "Zehn Aufsätze kann die Lehrerin selbst korrigieren, aber nicht zehntausend. Also bringt sie einer vertrauenswürdigen Assistentin bei: Hier ist die Frage, hier eine gute Antwort, hier die Regeln für bestanden und durchgefallen. Die Assistentin korrigiert jede Arbeit und begründet jede Note in einem Satz. Jede Woche korrigiert die Lehrerin ein paar Arbeiten selbst nach, um zu prüfen, ob die Assistentin noch mit ihr übereinstimmt.",
    },
    engineering: {
      text: "LLM-as-a-Judge nutzt ein starkes Modell mit klarem Prompt und Rubrik, um Ausgaben zu bewerten, oft gegen eine Referenzantwort. So evaluierst du Tausende Fälle günstig und erkennst Unterschiede, die String-Vergleiche verpassen (gleiche Bedeutung, andere Wörter). Nutze bestanden/durchgefallen oder kleine Skalen, lass vor dem Urteil kurz begründen, setz Temperature auf 0 und validiere den Judge an menschlichen Labels, bevor du seinen Zahlen vertraust.",
      pitfalls: [
        "Judges haben Vorlieben: Sie bevorzugen längere Antworten, ihre eigene Modellfamilie und die zuerst gezeigte Option.",
        "Ein Judge, der nie mit menschlichen Labels verglichen wurde, ist eine ungeprüfte Meinung.",
        "Vage Kriterien wie „Ist es gut?“ erzeugen verrauschte Werte; sei konkret.",
      ],
    },
    keywords: ["Judge", "Bewerter", "Rubrik", "automatisch bewerten"],
  },
  "evals-04": {
    name: "Paarweiser Vergleich",
    official: "Der Judge sieht zwei Antworten und wählt die bessere. Stabiler als ein Wert von 1-10.",
    kid: "Das bessere von zwei Bildern zu wählen ist leichter, als einem Bild eine genaue Note zu geben. Der Judge schaut zwei Antworten nebeneinander an und wählt einfach die bessere.",
    realWorld: {
      title: "Welcher der beiden Aufsätze ist besser?",
      text: "Lässt du fünf Lehrer einen Aufsatz auf einer Skala bis zehn bewerten, bekommst du 6, 7, 8, 7 und 5. Fragst du, welcher von zwei Aufsätzen besser ist, sind sie sich fast immer einig. Wenn die Schule also den Hausaufgaben-Roboter vom letzten Jahr mit dem neuen vergleicht, legt sie ihre Antworten nebeneinander, fragt „Welche hättest du lieber?“ und zählt die Siege.",
    },
    engineering: {
      text: "Beim paarweisen Vergleich sieht der Judge zwei Kandidaten-Ausgaben für dieselbe Eingabe und entscheidet, welche besser ist (oder Gleichstand). Relative Urteile sind konsistenter als absolute Werte von 1-10, die driften und sich häufen. Ideal, um Prompts, Modelle oder Versionen zu vergleichen. Judges haben einen Positions-Bias, also lass jedes Paar zweimal mit vertauschter Reihenfolge laufen und werte widersprüchliche Urteile als Gleichstand; fasse als Siegquote oder Elo-Wertung zusammen.",
      pitfalls: [
        "Vertausche immer die Reihenfolge: Viele Judges bevorzugen die zuerst gezeigte Antwort.",
        "Paarweise sagt dir, welche besser ist, nicht ob eine gut genug ist; behalte auch eine absolute Bestehensgrenze.",
        "Viele Versionen zu vergleichen braucht viele Paare; nutze eine feste Baseline oder ein Rating-System.",
      ],
    },
    keywords: ["paarweise", "Vergleich", "Siegquote", "Elo"],
  },
  "evals-05": {
    name: "Bewertung mit Rubrik",
    official: "Bewerte nach schriftlichen Kriterien (richtig, vollständig, Ton), jedes auf einer klaren Skala.",
    kid: "Statt nur „gut“ oder „schlecht“ zu sagen, hat die Lehrerin eine Liste: Ist es richtig, ist es vollständig, ist es freundlich? Jeder Teil bekommt eine kleine Note, so weiß jeder, was er verbessern kann.",
    realWorld: {
      title: "Das Bewertungsschema an der Tafel",
      text: "Für den Geschichtsaufsatz schreibt die Lehrerin das Bewertungsschema an die Tafel: Fakten richtig (bis 4 Punkte), ganze Frage beantwortet (bis 4), klar und freundlich geschrieben (bis 4). Jetzt geben zwei Lehrer demselben Aufsatz fast dieselben Punkte, und jedes Kind sieht genau, wo es Punkte verloren hat.",
    },
    engineering: {
      text: "Bei der Bewertung mit Rubrik werden Ausgaben nach schriftlichen Kriterien bewertet, jedes auf einer kleinen, klar definierten Skala mit Beschreibung jeder Stufe (zum Beispiel Richtigkeit, Vollständigkeit, Ton, Format), statt mit einem Gesamtwert. Explizite Stufen machen menschliche und LLM-Bewerter konsistenter und die Ergebnisse umsetzbar. Halte Kriterien unabhängig, nimm lieber 2-4 Stufen als 1-10 und leg fest, wie Kriterien zu bestanden oder durchgefallen zusammengefasst werden.",
      pitfalls: [
        "Skalen ohne schriftliche Stufenbeschreibungen driften zwischen Bewertern und über die Zeit.",
        "Mittelwerte über Kriterien verstecken Fehler: Eine falsche, aber freundliche Antwort sollte nicht bestehen.",
        "Zu viele Kriterien machen die Bewertung langsam und verrauscht; drei bis fünf reichen meist.",
      ],
    },
    keywords: ["Rubrik", "Kriterien", "Bewertungsschema", "Skala"],
  },
  "evals-06": {
    official: "Ist jede Aussage der Antwort durch den abgerufenen Kontext belegt?",
    kid: "Sagt ein Kind „Im Buch steht, dass Dinosaurier Federn hatten“, schaust du nach, ob das wirklich drinsteht. Faithfulness prüft jeden Satz der Antwort an den Seiten, die benutzt wurden.",
    realWorld: {
      title: "Stand das wirklich im Buch?",
      text: "Ein Kind gibt ein Referat ab, für das es drei Bibliotheksbücher benutzt hat. Die Lehrerin sucht jeden Satz in den Büchern. „Dinosaurier lebten vor 66 Millionen Jahren“: gefunden. „Manche hatten Federn“: gefunden. „Sie waren alle grün“: in keinem Buch. Drei von vier Sätzen sind durch die Quellen belegt, also ist das Referat zu 75 % quellentreu, egal wie schön es klingt.",
    },
    engineering: {
      text: "Faithfulness (Groundedness) misst, ob jede Aussage einer erzeugten Antwort durch den abgerufenen Kontext gestützt wird, unabhängig davon, ob sie in der Welt stimmt. Üblich ist, die Antwort in atomare Aussagen zu zerlegen und jede von einem Judge gegen den Kontext prüfen zu lassen; der Wert ist belegte Aussagen geteilt durch alle Aussagen. Sie ist die wichtigste Halluzinationsmetrik für RAG; Bibliotheken wie Ragas und DeepEval setzen sie um.",
      pitfalls: [
        "Eine quellentreue Antwort kann trotzdem falsch sein, wenn der abgerufene Kontext falsch war.",
        "Die Qualität der Aussagen-Extraktion begrenzt die Metrik; prüf eine Stichprobe von Hand.",
        "Die Antwort „Ich weiß es nicht“ ist perfekt quellentreu, also kombiniere sie mit Answer Relevance.",
      ],
    },
    keywords: ["Quellentreue", "belegt", "Groundedness", "Halluzination"],
  },
  "evals-07": {
    official: "Geht die Antwort wirklich auf die gestellte Frage ein?",
    kid: "Fragt die Lehrerin „Welche Farbe hat der Himmel?“ und du erzählst von Wolken, hast du vielleicht recht, aber nicht geantwortet. Answer Relevance prüft, ob die Antwort zur Frage passt.",
    realWorld: {
      title: "Richtige Fakten, falsche Frage",
      text: "Auf „Wann schließt die Bibliothek am Samstag?“ antwortet ein Kind „14:00“. Ein anderes schreibt einen schönen Absatz über die Geschichte der Bibliothek und ihre 20.000 Bücher, jedes Wort wahr. Die Lehrerin wertet die zweite Antwort als am Thema vorbei: Wahre Fakten sind wertlos, wenn sie nicht beantworten, was gefragt war.",
    },
    engineering: {
      text: "Answer Relevance misst, ob die Antwort auf die eigentliche Frage eingeht: direkt, vollständig und ohne Überflüssiges, unabhängig von der sachlichen Richtigkeit. Sie wird mit einer LLM-Rubrik bewertet oder berechnet, indem man aus der Antwort wahrscheinliche Fragen erzeugt und sie per Embedding-Ähnlichkeit mit der Originalfrage vergleicht (wie Ragas). Nutze sie zusammen mit Faithfulness: Das eine prüft, ob die Antwort belegt ist, das andere, ob sie auf den Punkt ist.",
      pitfalls: [
        "Relevanz sagt nichts über Wahrheit; eine passende Antwort kann erfunden sein.",
        "Details zu stark zu bestrafen drängt Bots zu knappen, nutzlosen Antworten; leg fest, was genug ist.",
        "Mehrdeutige Fragen brauchen eine Regel, wann eine Rückfrage als relevant zählt.",
      ],
    },
    keywords: ["Relevanz", "passt zur Frage", "am Thema"],
  },
  "evals-08": {
    official: "Wie viel des abgerufenen Kontexts war für die Antwort wirklich nützlich?",
    kid: "Bringst du zehn Bücher, um eine Frage zu beantworten, aber nur zwei helfen, war der Großteil des Stapels umsonst. Context Precision prüft, wie viel vom Geholten wirklich nützlich war.",
    realWorld: {
      title: "Wie viel vom Stapel war nützlich?",
      text: "Für die Frage „Wie lange leben Elefanten?“ hat die Bibliothekarin fünf Bücher gestapelt. Nur zwei helfen: das Buch über die Lebensdauer von Elefanten und das über Zootiere. Die anderen drei handeln von Elfenbein, Herden und Zirkusgeschichte. Die Lehrerin notiert, dass nur 2 von 5 Büchern nützlich waren und die nützlichen nicht einmal oben lagen. Ein kleinerer, besser sortierter Stapel wäre schneller zu lesen gewesen.",
    },
    engineering: {
      text: "Context Precision misst, wie viel des abgerufenen Kontexts für die Beantwortung relevant ist, meist nach Rang gewichtet, sodass nützliche Chunks weit oben mehr zählen (eine Average Precision über die abgerufene Liste). Niedrige Präzision heißt verrauschter Kontext: höhere Kosten, Ablenkung und mehr Halluzinationsrisiko. Sie ergänzt den Recall (Haben wir alles Nötige geholt?) und wird durch Reranking, Filter und weniger, bessere Chunks verbessert.",
      pitfalls: [
        "Hohe Präzision bei niedrigem Recall heißt sauberer, aber unvollständiger Stapel; verfolge beides.",
        "Die Nützlichkeit zu bewerten braucht eine Referenzantwort oder sorgfältige Kriterien.",
        "Weniger Chunks zu schicken erhöht die Präzision, kann aber nötige Fakten verlieren; stimme k mit beiden Metriken ab.",
      ],
    },
    keywords: ["Präzision", "Kontext", "nützlich", "Rauschen"],
  },
  "evals-09": {
    name: "Genauigkeit der Tool-Aufrufe",
    official: "Hat der Agent das richtige Tool mit den richtigen Argumenten gewählt?",
    kid: "Fragst du den Roboter nach dem Wetter in Paris, sollte er das Wetter-Werkzeug nehmen und „Paris“ eintippen, nicht den Kalender oder „Berlin“. Wir prüfen, ob er das richtige Werkzeug mit den richtigen Angaben wählt.",
    realWorld: {
      title: "Richtiger Laden, richtiger Zettel",
      text: "Die Lehrerin testet den Besorgungs-Roboter mit zehn kleinen Aufgaben. „Wetter in Paris morgen?“ sollte zur Wetterstation gehen, mit „Paris, 1 Tag“. „Hallo!“ sollte zu gar keinem Laden gehen. Bei jeder Aufgabe prüft sie zwei Dinge: Ging er in den richtigen Laden, und hat er den richtigen Zettel abgegeben? Richtiger Laden mit falscher Stadt zählt trotzdem als Fehler.",
    },
    engineering: {
      text: "Die Genauigkeit der Tool-Aufrufe prüft, ob ein Agent das richtige Tool wählt (oder richtigerweise keins) und korrekte Argumente übergibt, verglichen mit erwarteten Aufrufen in einem Testset. Prüf den Tool-Namen exakt und die Argumente per exaktem Abgleich, Normalisierung oder mit einem Judge bei Freitextfeldern. Teste Fälle, in denen kein Tool nötig ist, und ähnlich aussehende Tools, und melde Fehler nach Typ: falsches Tool, fehlender Aufruf, falsche Argumente und unnötiger Aufruf.",
      pitfalls: [
        "Wer „kein Tool“-Fälle vergisst, übersieht einen Agenten, der für alles Tools aufruft.",
        "Exakter Argument-Abgleich ist bei Freitext fragil („NYC“ vs. „New York“); normalisiere oder lass bewerten.",
        "Richtige Einzelaufrufe garantieren keine richtige Abfolge; ergänze Trajectory-Evals.",
      ],
    },
    keywords: ["Tool-Aufruf", "Werkzeugwahl", "Argumente"],
  },
  "evals-10": {
    official: "Bewerte den ganzen Weg, den der Agent gegangen ist, nicht nur seine finale Antwort.",
    kid: "Zwei Kinder haben das richtige Ergebnis, aber eins hat geraten und zehnmal durchgestrichen. Die Lehrerin schaut sich auch den Rechenweg an, nicht nur das Ergebnis.",
    realWorld: {
      title: "Den Rechenweg bewerten, nicht nur das Ergebnis",
      text: "Zwei Roboter kommen beide mit dem richtigen Einkauf nach Hause. Einer ging Bäckerei, Markt, nach Hause. Der andere ging dreimal zur Bäckerei, fuhr verbotenerweise Taxi und brauchte zwei Stunden. Prüft man nur die Tasche, bestehen beide. Die Lehrerin liest auch die Route jedes Roboters, und der zweite fällt durch: unnötige Wege und gebrochene Regeln.",
    },
    engineering: {
      text: "Trajectory-Evaluation bewertet die ganze Abfolge der Schritte eines Agenten (Tool-Aufrufe, Argumente, Zwischenüberlegungen und Reihenfolge), nicht nur die finale Ausgabe. Sie erwischt Agenten, die richtige Antworten über verschwenderische, unsichere oder glückliche Wege erreichen, was in Produktion teuer oder gefährlich wird. Kombiniere regelbasierte Prüfungen (Schrittzahl, verbotene Tools, wiederholte Aufrufe, vorgeschriebene Reihenfolge) mit einem LLM-Judge oder dem Vergleich mit Referenz-Trajectories, mit Traces als Eingabe.",
      pitfalls: [
        "Oft gibt es mehrere gültige Wege; verlange nicht eine exakte Trajectory.",
        "Trajectory-Evals brauchen gute Traces; instrumentiere zuerst den Agenten.",
        "Lange Trajectories zu bewerten ist teuer; kombiniere billige Regeln mit stichprobenartiger LLM-Prüfung.",
      ],
    },
    keywords: ["Weg", "Ablauf", "Schritte", "Trajectory"],
  },
  "evals-11": {
    name: "Regressions-Evals in der CI",
    official:
      "Lass die Eval-Suite bei jeder Prompt- oder Codeänderung laufen und blockiere die Änderung, wenn die Werte sinken.",
    kid: "Bevor der neue Hausaufgaben-Roboter in die Klasse darf, muss er denselben Test bestehen wie der alte. Sinkt seine Punktzahl, muss er draußen bleiben, bis er repariert ist.",
    realWorld: {
      title: "Der Test an der Klassenzimmertür",
      text: "Jedes Mal, wenn jemand den Hausaufgaben-Roboter ändert, selbst nur ein Wort seiner Anweisungen, muss er an der Klassenzimmertür den Lösungsbogen-Test schreiben, bevor er hinein darf. Der alte Roboter hatte 92 %. Hat der neue 86 %, bleibt die Tür zu, und die Änderung geht mit einer Liste der kaputten Fragen zurück in die Werkstatt.",
    },
    engineering: {
      text: "Regressions-Evals in der CI lassen die Eval-Suite bei jeder Änderung an Prompts, Modellen, Retrieval oder Code automatisch laufen (typischerweise bei Pull Requests) und lassen den Build fehlschlagen, wenn Werte unter eine Schwelle oder unter die Baseline fallen. So werden Prompts wie Code behandelt, und stille Qualitätsverluste werden gestoppt. Halte die CI-Suite schnell und bezahlbar (eine kuratierte Teilmenge), cache LLM-Aufrufe wo möglich, melde Unterschiede pro Fall und lass die volle Suite nachts laufen.",
      pitfalls: [
        "LLM-Ausgaben schwanken zwischen Läufen; erlaube eine kleine Toleranz oder lass mehrere Samples laufen.",
        "Eine langsame, teure Suite wird übersprungen; halte das CI-Set klein und das volle Set für die Nacht.",
        "Nur ein fehlschlagender Check stoppt eine Änderung: Mach das Gate verpflichtend, nicht nur zu einem Bericht.",
      ],
    },
    keywords: ["Regression", "CI", "Pull Request", "Gate"],
  },
  "evals-12": {
    name: "A/B-Tests für Prompts",
    official: "Schick zwei Prompt-Versionen an echte Nutzer und vergleiche die Zahlen.",
    kid: "Die Lehrerin gibt der halben Klasse Arbeitsblatt A und der anderen Hälfte Arbeitsblatt B. Am Ende zählt sie, welche Gruppe mehr gelernt hat, und erst dann wählt sie den Sieger.",
    realWorld: {
      title: "Zwei Arbeitsblätter, zwei Klassenhälften",
      text: "Die Lehrerin weiß nicht, ob das neue Arbeitsblatt besser ist. Also bekommen Kinder, deren Namen mit A bis L beginnen, das alte, M bis Z das neue, und niemand wechselt. Nach einem Monat vergleicht sie die Testergebnisse. Mit nur zehn Kindern pro Gruppe könnte ein kleiner Unterschied Zufall sein; mit zweihundert pro Gruppe kann sie ihm trauen.",
    },
    engineering: {
      text: "Beim A/B-Test bekommen zufällig aufgeteilte, feste Gruppen echter Nutzer zwei Prompt- (oder Modell-) Versionen, und man vergleicht Geschäfts- und Qualitätsmetriken wie Daumen-hoch-Quote, Aufgabenerfolg, Eskalationsrate, Latenz und Kosten. Das misst, was Offline-Evals nicht können: echtes Nutzerverhalten. Leg Metrik und Stichprobengröße vorher fest, lass laufen, bis der Unterschied statistisch signifikant ist, beobachte Guardrail-Metriken und teste nur Varianten, die Offline-Evals schon bestanden haben.",
      pitfalls: [
        "Aufzuhören, sobald eine Variante vorne liegt, erzeugt falsche Sieger; leg die Stichprobengröße vorher fest.",
        "Wechselnde Zuordnung (Nutzer springen zwischen Varianten) verwässert die Ergebnisse.",
        "Eine Metrik zu optimieren kann einer anderen schaden; beobachte auch Kosten, Latenz und Beschwerden.",
      ],
    },
    keywords: ["A/B-Test", "Experiment", "Signifikanz", "Nutzer"],
  },
  "evals-13": {
    name: "Menschliches Labeling",
    official:
      "Menschen bewerten eine Stichprobe von Ausgaben. Das ist die Wahrheit, an der du deine Judges prüfst.",
    kid: "Bevor die Lehrerin dem Helfer beim Korrigieren vertraut, korrigiert sie einige Arbeiten selbst und vergleicht. Stimmen sie überein, darf der Helfer den Rest machen.",
    realWorld: {
      title: "Die Lehrerin korrigiert eine Stichprobe selbst",
      text: "Jeden Freitag nimmt die Lehrerin 20 zufällige Arbeiten, die die Assistentin schon korrigiert hat, und korrigiert sie noch einmal selbst, ohne auf die Noten der Assistentin zu schauen. Bei 18 stimmen sie überein. Bei den zwei anderen merkt sie, dass die Assistentin halbfertige Antworten zu großzügig bewertet, und schreibt ihre Bewertungsregeln um. Die Noten von Menschen sind die Wahrheit, an der alles andere geprüft wird.",
    },
    engineering: {
      text: "Beim menschlichen Labeling bewerten Fachleute eine Stichprobe echter Ausgaben nach klaren Richtlinien. Diese Labels sind die Grundwahrheit, um automatische Bewerter zu prüfen: Du misst die Übereinstimmung zwischen LLM-Judge und Menschen, passt den Judge-Prompt an, wo sie abweichen, und verlässt dich erst dann im großen Maßstab auf den Judge. Nutze klare Anweisungen, miss die Übereinstimmung zwischen Annotatoren, labele laufend frische Stichproben aus Produktion und gib Labelern ein effizientes Review-Werkzeug.",
      pitfalls: [
        "Ohne schriftliche Richtlinien sind sich Labeler uneinig, und die „Wahrheit“ ist Rauschen.",
        "Nur einmal zu labeln lässt den Judge unbemerkt driften; wiederhole es mit frischen Stichproben.",
        "Fachfragen (Medizin, Recht) brauchen Fachleute, keine allgemeinen Crowdworker.",
      ],
    },
    keywords: ["Labeling", "Annotation", "menschliche Bewertung", "Grundwahrheit"],
  },
  "evals-14": {
    name: "Synthetische Testdaten",
    official: "Lass ein LLM vielfältige Testfälle samt Sonderfällen erzeugen und prüf sie dann selbst.",
    kid: "Hunderte Testfragen von Hand zu schreiben dauert lange. Ein Computer kann schnell viele Übungsfragen schreiben, und die Lehrerin prüft sie, bevor sie in den Test kommen.",
    realWorld: {
      title: "Die Assistentin entwirft Übungsfragen",
      text: "Die Lehrerin braucht 200 Testfragen zu den Bibliotheksregeln, hat aber nur Zeit für 20. Ihre Assistentin liest die Regeln und entwirft 200: leichte, knifflig formulierte, Fragen mit Tippfehlern und Fragen, die die Regeln nicht beantworten können. Die Lehrerin liest sie durch, wirft die falschen oder albernen raus und behält die guten.",
    },
    engineering: {
      text: "Synthetische Testdaten lassen ein LLM Eval-Eingaben (und manchmal erwartete Ausgaben) aus Dokumenten, Schemas oder Beispielen erzeugen, um mehr Fälle abzudecken, als Menschen schreiben können: Umformulierungen, Sonderfälle, Tippfehler, gezielt bösartige Fragen, Fragen außerhalb des Themas und Personas. Steuere die Erzeugung mit expliziten Dimensionen für Vielfalt, erzeuge aus echten Dokumenten, damit Antworten prüfbar sind, und lass Menschen die Fälle prüfen, bevor sie ins Golden Set kommen.",
      pitfalls: [
        "Synthetische Fragen sind oft sauberer und leichter als echte Nutzernachrichten; misch echte dazu.",
        "Erzeugte erwartete Antworten können falsch sein; prüf sie.",
        "Dasselbe Modell die Tests erzeugen und beantworten zu lassen, schmeichelt ihm.",
      ],
    },
    keywords: ["synthetisch", "Testdaten", "generieren", "Sonderfälle"],
  },
  "evals-15": {
    official:
      "Zeichne jeden Schritt einer Anfrage auf (Prompts, Tool-Aufrufe, Zeit, Tokens), damit du sie später debuggen kannst.",
    kid: "Ein Trace ist wie die Geschichte einer Frage: wer was in welcher Reihenfolge gemacht hat und wie lange jeder Teil dauerte. Geht etwas schief, liest du das Tagebuch und findest den kaputten Schritt.",
    realWorld: {
      title: "Das Tagebuch des Roboters für jede Besorgung",
      text: "Für jede Besorgung führt der Roboter eine Tagebuchseite: 09:00 Anfrage gelesen, 09:01 im Katalog nach „Elefanten“ gesucht und 5 Bücher bekommen, 09:02 das Gehirn um eine Antwort gebeten (2.100 Wörter gelesen, 1,7 Sekunden), 09:03 geantwortet. Beschwert sich ein Kind über eine falsche Antwort, schlägt die Lehrerin die Seite auf und sieht, dass die Suche die falschen Bücher gefunden hat.",
    },
    engineering: {
      text: "Tracing zeichnet jeden Schritt einer Anfrage als Baum von Spans auf: die gesamte Anfrage, das Retrieval, jeden LLM-Aufruf mit genauem Prompt, Antwort, Modell, Tokens, Kosten und Latenz, Tool-Aufrufe mit Argumenten und Ergebnissen sowie Fehler. Traces sind unverzichtbar, um nicht-deterministische LLM-Apps zu debuggen, für die Fehleranalyse und um Eval-Datensätze aus echter Nutzung zu bauen. Instrumentiere ab Tag eins mit einem SDK oder OpenTelemetry und nimm IDs auf, die Traces mit Nutzern und Feedback verbinden.",
      pitfalls: [
        "Traces enthalten Nutzerdaten und Prompts; maskiere personenbezogene Daten und kontrolliere den Zugriff.",
        "Nur LLM-Aufrufe zu tracen verpasst Fehler bei Retrieval und Tools; trace die ganze Anfrage.",
        "Tracing ohne Sampling wird bei hohem Volumen teuer; sample, aber behalte jeden Fehler.",
      ],
    },
    keywords: ["Trace", "Spans", "Debugging", "Protokoll"],
  },
  "evals-16": {
    official: "Open-Source-Observability für LLMs: Traces, Prompt-Verwaltung, Evals und Kostentracking.",
    kid: "Langfuse ist wie eine große Notizbuch-App für Lehrer: Sie bewahrt jedes Roboter-Tagebuch, jede Version der Anweisungen, jede Note und alle Kosten an einem Ort auf.",
    realWorld: {
      title: "Der Kontrollraum der Schule",
      text: "Die Schule richtet einen Kontrollraum für ihren Hausaufgaben-Roboter ein. Eine Wand zeigt jede Tagebuchseite von heute. Eine andere zeigt jede Version der Anweisungskarte und welche gerade gilt. Eine dritte zeigt die Noten von Assistentin und Lehrern, eine vierte, was der Roboter pro Tag kostet. Geht etwas kaputt, ist alles Nötige in einem Raum.",
    },
    engineering: {
      text: "Langfuse ist eine Open-Source-Plattform fürs LLM-Engineering (selbst gehostet oder in der Cloud) für Tracing, Prompt-Verwaltung mit Versionen und Labels, Evaluationen (LLM-as-a-Judge, menschliche Annotation, Datensätze und Experimente) sowie Kosten- und Latenztracking. Angebunden wird es über Python- und JS-SDKs, OpenTelemetry und Integrationen für OpenAI, LangChain, LlamaIndex und andere. Es ist eines von mehreren solchen Werkzeugen, neben LangSmith, Arize Phoenix und Braintrust.",
      pitfalls: [
        "Selbst hosten heißt, seine Datenbanken selbst zu betreiben und zu aktualisieren.",
        "Zur Laufzeit geladene Prompts brauchen Caching und einen Fallback, falls der Dienst ausfällt.",
        "Entscheide, welche Daten deine Systeme verlassen dürfen, bevor du Traces an einen Cloud-Dienst schickst.",
      ],
    },
    keywords: ["Observability", "Kontrollraum", "Prompt-Verwaltung"],
  },
  "evals-17": {
    name: "OpenTelemetry für LLMs",
    official:
      "Der offene Tracing-Standard, mit Konventionen für LLM-Aufrufe, damit Traces werkzeugübergreifend funktionieren.",
    kid: "Würde jede Schule Zeugnisse anders schreiben, könnte niemand sie vergleichen. OpenTelemetry ist ein gemeinsames Zeugnisformat, damit jedes Werkzeug die Tagebücher des Roboters lesen kann.",
    realWorld: {
      title: "Ein Tagebuchformat für jede Schule",
      text: "Früher führte jede Schule die Roboter-Tagebücher in eigenem Format, ein Wechsel in einen neuen Kontrollraum hieß also, jedes Tagebuch umzuschreiben. Jetzt einigen sich alle Schulen auf ein Format mit festen Feldern für „welches Gehirn“, „gelesene Wörter“, „geschriebene Wörter“ und „benötigte Zeit“. Jeder Kontrollraum, der das Format liest, zeigt die Tagebücher jeder Schule, und der Wechsel ist leicht.",
    },
    engineering: {
      text: "OpenTelemetry (OTel) ist der herstellerneutrale offene Standard für Traces, Metriken und Logs. Seine GenAI Semantic Conventions legen Standardnamen und -attribute für Spans von LLM-Aufrufen und Agenten fest (etwa gen_ai.request.model, gen_ai.usage.input_tokens und gen_ai.usage.output_tokens). Instrumentiere einmal mit OTel-SDKs oder Auto-Instrumentierungs-Bibliotheken und exportiere per OTLP an jedes kompatible Backend, sodass LLM-Traces neben den übrigen Traces deines Systems liegen.",
      pitfalls: [
        "Die GenAI-Konventionen entwickeln sich noch; Attributnamen können sich zwischen Versionen ändern.",
        "Vollständige Prompts und Ausgaben in Spans aufzuzeichnen kann personenbezogene Daten preisgeben; mach es optional.",
        "Auto-Instrumentierungs-Bibliotheken decken unterschiedlich viel ab; prüf, was sie wirklich erfassen.",
      ],
    },
    keywords: ["OpenTelemetry", "Standard", "OTLP", "Spans"],
  },
  "evals-18": {
    name: "P95-Latenz",
    official:
      "95 % der Anfragen sind schneller als dieser Wert. Er zeigt das langsame Ende, das ein Durchschnitt versteckt.",
    kid: "Schaffen die meisten Kinder einen Test in 10 Minuten, aber ein paar brauchen eine Stunde, versteckt der Durchschnitt diese paar. P95 sagt dir, wie lange die Langsamsten warten, bis auf die allerletzten.",
    realWorld: {
      title: "Das langsame Ende der Schlange",
      text: "Der Infoschalter der Bibliothek sagt: „Die durchschnittliche Wartezeit ist 2 Minuten.“ Die Bibliothekarin schaut genauer hin: 95 von 100 Kindern werden innerhalb von 3 Minuten bedient, und die letzten 5 warten bis zu 12 Minuten, weil ihre Fragen ins Archiv führen. Der Durchschnitt sah gut aus; das p95 von 3 Minuten und das lange Ende dahinter zeigen, was die Pechvögel wirklich erleben.",
    },
    engineering: {
      text: "Die P95-Latenz ist das 95. Perzentil der Antwortzeiten: 95 % der Anfragen sind schneller, 5 % langsamer. Durchschnitte verstecken die Tail-Latenz, von der LLM-Apps reichlich haben (lange Ausgaben, Wiederholungen, kalte Caches, Tool-Aufrufe, langsame Anbieter). Verfolge p50, p95 und p99 pro Endpunkt und Modell, miss beim Streaming die Zeit bis zum ersten Token separat und setz SLOs und Alarme auf Perzentile statt auf Durchschnitte.",
      pitfalls: [
        "Perzentile über Server oder Stunden zu mitteln ist falsch; berechne sie aus Rohdaten oder Histogrammen.",
        "Ein paar langsame Anfragen pro Sitzung lassen die meisten Nutzer das lange Ende spüren; schau auch auf p99.",
        "Vergleiche Gleiches mit Gleichem: Endpunkte mit langen und kurzen Antworten brauchen getrennte Perzentile.",
      ],
    },
    keywords: ["Latenz", "Perzentil", "Antwortzeit", "langsam"],
  },
  "evals-19": {
    name: "Kosten pro Anfrage",
    official: "Gesamte Token- und Infrastrukturkosten geteilt durch die Anfragen. Verfolge sie pro Feature.",
    kid: "Gibt die Schule 300 Euro für den Roboter aus und er beantwortet 1.000 Fragen, kostet jede Frage 30 Cent. Der Preis pro Frage zeigt, welche Aufgaben zu teuer sind.",
    realWorld: {
      title: "Was kostet eine Antwort?",
      text: "Am Monatsende rechnet die Schule die Rechnungen des Roboters zusammen: das Gehirn, den Suchkatalog und den Strom. Geteilt durch die beantworteten Fragen kostet jede Antwort 3 Cent. Nach Aufgabe aufgeteilt kostet Hausaufgabenhilfe 1 Cent, Feedback zu Aufsätzen aber 12 Cent, weil der Roboter ganze Aufsätze liest und lange Antworten schreibt. Jetzt weiß die Schule, welche Aufgabe sie zuerst billiger machen sollte.",
    },
    engineering: {
      text: "Kosten pro Anfrage sind die Gesamtausgaben (Modell-Tokens, Embeddings, Reranking, Vektordatenbank, Server, Drittanbieter-APIs) geteilt durch die Anfragen, verfolgt pro Feature, Kunde oder Modell. LLM-Kosten schwanken zwischen Anfragen enorm mit Eingabegröße, Ausgabelänge, Wiederholungen und Agent-Schritten, also logge die Kosten jeder Anfrage aus den Usage-Daten und schau auf Verteilungen, nicht nur auf Durchschnitte. Sie bestimmen Preis-, Routing- und Optimierungsentscheidungen und entlarven außer Kontrolle geratene Agenten.",
      pitfalls: [
        "Wer Embeddings, Wiederholungen und Sub-Aufrufe von Agenten vergisst, unterschätzt die echten Kosten.",
        "Durchschnitte verstecken teure Ausreißer; beobachte auch die p95-Kosten pro Anfrage.",
        "Preise ändern sich; speichere den verwendeten Preis mit jedem Datensatz oder rechne aus den Tokens neu.",
      ],
    },
    keywords: ["Kosten", "pro Anfrage", "Budget", "Ausgaben"],
  },
  "evals-20": {
    name: "Feedback-Schleifen mit Nutzern",
    official: "Daumen hoch/runter und Korrekturen von Nutzern fließen zurück in deine Testdatensätze.",
    kid: "Sagt ein Kind „Diese Antwort war falsch“, schreibt die Lehrerin die Frage in den Test fürs nächste Jahr. Fehler, auf die Leute hinweisen, werden zu neuen Testfragen und schleichen sich nie wieder ein.",
    realWorld: {
      title: "Beschwerden werden zu Testfragen",
      text: "Unter jeder Antwort des Hausaufgaben-Roboters gibt es zwei Knöpfe: Daumen hoch und Daumen runter. Drückt ein Kind Daumen runter und schreibt die richtige Antwort dazu, landet der Fall auf dem Tisch der Lehrerin. Sie prüft ihn, und wenn das Kind recht hatte, kommt die Frage in den Lösungsbogen-Test. Ab dann wird jede neue Version des Roboters genau an diesem Fehler getestet.",
    },
    engineering: {
      text: "Feedback-Schleifen erfassen explizite Signale (Daumen hoch oder runter, Bewertungen, Korrekturen, Klicks auf „neu generieren“) und implizite (Umformulieren der Frage, Abbruch, Eskalation an einen Menschen), verknüpfen sie mit Traces und leiten negative Fälle zur Prüfung weiter. Geprüfte Fälle werden zu neuen Einträgen im Golden Dataset und Eingabe für die Fehleranalyse, so wird jeder echte Fehler zu einem dauerhaften Regressionstest. Beobachte die Feedback-Quoten pro Version als Online-Qualitätsmetrik.",
      pitfalls: [
        "Nur sehr wenige Nutzer geben explizites Feedback; nutze auch implizite Signale.",
        "Daumen runter ist verrauscht (Nutzer mögen wahre, aber unwillkommene Antworten nicht); prüf, bevor du es in Tests übernimmst.",
        "Feedback und Korrekturen sind Nutzerdaten; hol Einwilligung ein und entferne persönliche Angaben.",
      ],
    },
    keywords: ["Feedback", "Daumen", "Korrekturen", "Nutzer"],
  },
};

export default concepts;
