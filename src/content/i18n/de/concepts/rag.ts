import type { ConceptTranslations } from "../../types";

/** Bereich RAG auf Deutsch. Szene: eine Schulbibliothek mit einer hilfsbereiten Bibliothekarin. */
const concepts: ConceptTranslations = {
  "rag-01": {
    official: "Wandle Text in eine Liste von Zahlen (einen Vektor) um, damit ähnliche Bedeutungen nah beieinanderliegen.",
    kid: "Ein Computer spürt nicht, was Wörter bedeuten, also gibt er jedem einen Platz auf einer riesigen Karte. Wörter mit ähnlicher Bedeutung, wie Welpe und Hund, wohnen nah beieinander.",
    realWorld: {
      title: "Jedes Buch auf der Karte der Bibliothekarin",
      text: "Die Bibliothekarin pinnt jedes Buch auf eine riesige Wandkarte der Ideen. Bücher über Hunde stehen zusammen in einer Ecke, Kochbücher in einer anderen, Weltraumbücher weit weg von beiden. Fragt ein Schüler „Wie kümmere ich mich um meinen Welpen?“, sucht sie diese Stelle auf der Karte und greift die Bücher in der Nähe, auch wenn keins davon das Wort „Welpe“ benutzt.",
    },
    engineering: {
      text: "Ein Embedding-Modell bildet Text auf einen Vektor fester Länge ab (oft 384 bis 3.072 Zahlen), sodass Texte mit ähnlicher Bedeutung nahe Vektoren bekommen. Beim Retrieval wird die Anfrage mit demselben Modell eingebettet und die nächstgelegenen Dokumentvektoren gesucht. Nutze dasselbe Modell für Indexierung und Abfrage, bette beim Modellwechsel alles neu ein und wähle ein Modell durch Tests mit deinen eigenen Daten; öffentliche Leaderboards wie MTEB sind ein Startpunkt, nicht die Antwort.",
      pitfalls: [
        "Vektoren verschiedener Modelle oder Modellversionen sind nicht vergleichbar; bette beim Wechsel alles neu ein.",
        "Embeddings erfassen das Thema gut, verpassen aber oft exakte Codes, Namen und Zahlen; ergänze Stichwortsuche.",
        "Ein langer Text in einem einzigen Vektor verliert Details; chunke ihn zuerst.",
      ],
    },
    keywords: ["Vektor", "Einbettung", "Bedeutung", "Ähnlichkeit"],
  },
  "rag-02": {
    name: "Kosinus-Ähnlichkeit",
    official:
      "Misst, wie sehr zwei Vektoren in dieselbe Richtung zeigen (1 = gleich). Der übliche Weg, Embeddings zu vergleichen.",
    kid: "Zwei Freunde, die auf denselben Baum zeigen, zeigen in dieselbe Richtung, auch wenn ein Arm länger ist. Die Kosinus-Ähnlichkeit prüft, wie gleich zwei Pfeile zeigen: 1 heißt genau gleich.",
    realWorld: {
      title: "Auf Regale zeigen",
      text: "Stell dir jedes Buch als Pfeil vor, der von der Bibliothekstür in Richtung seines Themas zeigt. Zwei Bücher über Pferde zeigen fast gleich, ihr Wert liegt nahe 1. Ein Pferdebuch und ein Buch über Steuern zeigen im rechten Winkel zueinander und haben etwa 0. Nur die Richtung zählt, nicht die Länge des Pfeils, also passen ein dünnes Heft und ein dickes Lexikon über Pferde trotzdem zusammen.",
    },
    engineering: {
      text: "Die Kosinus-Ähnlichkeit ist das Skalarprodukt zweier Vektoren geteilt durch das Produkt ihrer Längen: cos θ = a·b / (|a| |b|). Sie reicht von -1 (entgegengesetzt) über 0 (ohne Bezug) bis 1 (gleiche Richtung) und ignoriert den Betrag. Für auf Länge 1 normierte Vektoren ist sie gleich dem Skalarprodukt, deshalb normieren viele Systeme einmal bei der Indexierung und nutzen dann das schnellere innere Produkt. Die Kosinus-Distanz ist 1 minus Kosinus-Ähnlichkeit.",
      pitfalls: [
        "Werte sind nur innerhalb eines Embedding-Modells vergleichbar: 0,8 kann bei einem Modell super und bei einem anderen mittelmäßig sein.",
        "Codiere keinen Schwellenwert fest, ohne ihn an echten Anfragen getestet zu haben.",
        "Sind Vektoren nicht normiert, können Skalarprodukt und Kosinus Ergebnisse unterschiedlich ordnen.",
      ],
    },
    keywords: ["Kosinus", "Ähnlichkeit", "Richtung", "Skalarprodukt"],
  },
  "rag-03": {
    name: "Chunking-Strategien",
    official:
      "Teile Dokumente in Stücke (nach Größe, Satz oder Überschrift), die klein genug sind, um sie genau abzurufen.",
    kid: "Ein ganzes Buch ist zu groß für jemanden, der nur eine Frage hat. Also schneiden wir es in kleine Stücke, wie Kapitel oder Seiten, und geben nur das Stück mit der Antwort weiter.",
    realWorld: {
      title: "Das Lexikon auf Karteikarten verteilen",
      text: "Ein Schüler fragt, wie lange Elefanten leben. Das ganze 900-seitige Lexikon zu reichen ist nutzlos, und eine Karte, die mitten im Satz abbricht, verwirrt. Also schreibt die Bibliothekarin das Lexikon Abschnitt für Abschnitt auf Karten ab, jede Karte mit einer vollständigen Idee samt Überschrift. Jetzt kann sie genau die Karte über die Lebensdauer von Elefanten herausgeben.",
    },
    engineering: {
      text: "Chunking teilt Dokumente vor dem Einbetten in abrufbare Einheiten. Übliche Strategien: feste Größe in Tokens mit Überlappung, rekursives Teilen erst nach Absätzen, dann nach Sätzen, und strukturbewusstes Teilen nach Überschriften, Abschnitten oder Codeblöcken. Zu große Chunks verwischen das Embedding und verschwenden Kontext; zu kleine verlieren Bedeutung. Starte bei etwa 200-800 Tokens mit 10-20 % Überlappung, halte Überschriften und Metadaten bei jedem Chunk und stimme die Größe anhand von Recall@k mit deinen eigenen Fragen ab.",
      pitfalls: [
        "Chunks, die mitten im Satz oder in einer Tabelle abbrechen, liefern Antworten, denen die Hälfte der Fakten fehlt.",
        "Ein Chunk ohne Überschrift oder Dokumenttitel ist oft nicht zuzuordnen: „Es wuchs um 3 %“ sagt nicht, was gewachsen ist.",
        "Es gibt keine universell beste Größe; miss die Retrieval-Qualität für ein paar Größen mit deinen eigenen Daten.",
      ],
    },
    keywords: ["Stücke", "teilen", "Überlappung", "Abschnitte"],
  },
  "rag-04": {
    name: "Vektordatenbanken",
    official:
      "Datenbanken, die Vektoren speichern und die nächstgelegenen schnell finden (Qdrant, Pinecone, Weaviate, Chroma).",
    kid: "Eine normale Liste findet ein Buch über seinen genauen Namen. Eine Vektordatenbank findet Bücher über die Bedeutung, so führt „traurige Hundegeschichten“ zum richtigen Regal, auch mit anderen Wörtern.",
    realWorld: {
      title: "Der magische Karteischrank",
      text: "Der neue Karteischrank der Bibliothek sortiert Karten nicht nach dem Alphabet. Jede Karte liegt dort, wo ihr Buch auf der Wandkarte der Ideen sitzt, und der Schrank zieht sofort die zehn Karten heraus, die einer Stelle am nächsten sind, selbst bei einer Million Karten. Er merkt sich auch Regal, Jahr und Besitzer jeder Karte, sodass die Bibliothekarin nach „den nächsten zehn, aber nur aus diesem Jahr“ fragen kann.",
    },
    engineering: {
      text: "Eine Vektordatenbank speichert Embeddings zusammen mit IDs, Text und Metadaten und beantwortet Nächste-Nachbarn-Abfragen schnell über approximative Indizes wie HNSW oder IVF. Spezialisierte Engines (Qdrant, Pinecone, Weaviate, Milvus, Chroma) bieten zusätzlich Filter, hybride Suche, Replikation und Mandantenfähigkeit; Postgres mit pgvector deckt viele Apps ab, ohne ein neues System einzuführen. Entscheide nach Größenordnung, Filterbedarf, Betriebsaufwand und Kosten, nicht nach Benchmark-Schlagzeilen.",
      pitfalls: [
        "Approximative Suche kann echte Nachbarn verpassen; prüf den Recall, wann immer du Index-Einstellungen änderst.",
        "Eine weitere Datenbank ist ein weiteres System, das gesichert, abgesichert und mit den Quelldaten synchron gehalten werden muss.",
        "Speichere Originaltext und Metadaten neben jedem Vektor, sonst kannst du Ergebnisse weder anzeigen noch filtern.",
      ],
    },
    keywords: ["Vektordatenbank", "Datenbank", "nächste Nachbarn"],
  },
  "rag-05": {
    official:
      "Eine Postgres-Erweiterung, die Vektorspalten und Ähnlichkeitssuche in die Datenbank bringt, die du schon nutzt.",
    kid: "Statt einen neuen Schrank zu kaufen, baust du eine besondere Schublade in deinen alten ein. pgvector baut eine Suche-nach-Bedeutung-Schublade in Postgres ein, wo viele Apps ihre Daten schon haben.",
    realWorld: {
      title: "Eine neue Schublade im alten Schrank",
      text: "Die Bibliothek bewahrt alle Unterlagen (Mitglieder, Ausleihen, Buchtitel) in einem bewährten Schrank namens Postgres auf. Statt einen eigenen magischen Schrank zu kaufen, baut die Bibliothekarin eine neue Schublade in den alten ein, die den Platz jedes Buchs auf der Ideenkarte speichert. Jetzt kann eine Frage lauten „Bücher nahe dieser Idee, von diesem Schüler ausgeliehen, nach 2020 erschienen“ und bekommt ihre Antwort aus einer Hand.",
    },
    engineering: {
      text: "pgvector ist eine Postgres-Erweiterung, die einen Vektor-Spaltentyp, Distanzoperatoren (<-> für L2, <=> für Kosinus-Distanz, <#> für negatives inneres Produkt) und approximative Indizes (HNSW und IVFFlat) ergänzt. Embeddings liegen neben deinen relationalen Daten, sodass Filter, Joins, Transaktionen, Backups und Zugriffsrechte wie gewohnt funktionieren. Es schafft Millionen Vektoren auf einem Server; spezialisierte Vektordatenbanken lohnen sich erst bei viel größerer Skala oder für Spezialfunktionen.",
      pitfalls: [
        "Nutze den Operator, der zur Operator-Klasse des Index passt (vector_cosine_ops gehört zu <=>), sonst wird der Index nicht verwendet.",
        "Ein WHERE-Filter auf einem approximativen Index kann weniger Zeilen als LIMIT liefern; erhöhe hnsw.ef_search oder aktiviere iterative Index-Scans.",
        "Einen HNSW-Index über Millionen Zeilen zu bauen braucht viel Speicher; erhöhe maintenance_work_mem.",
      ],
    },
    keywords: ["Postgres", "Erweiterung", "Vektorspalte"],
  },
  "rag-06": {
    name: "HNSW-Indizes",
    official:
      "Ein graphbasierter Index für approximative Nächste-Nachbarn-Suche. Schnell, selbst über Millionen Vektoren.",
    kid: "Um einen Freund in einer riesigen Stadt zu finden, nimmst du erst den Schnellzug, dann den Bus und läufst die letzten Schritte. HNSW findet passende Treffer genauso: erst große Sprünge, dann kleine Schritte.",
    realWorld: {
      title: "Expressrouten über die Karte",
      text: "Jede einzelne von einer Million Karten zu prüfen, würde die Bibliothekarin den ganzen Tag kosten. Also zeichnet sie Expressrouten über die Karte: Von jeder Karte springt sie erst zu weit entfernten, dann zu näheren und läuft schließlich zu den genauen Nachbarn. Nach etwa einem Dutzend Sprüngen ist sie in der richtigen Ecke und hat nur einen winzigen Teil der Karten angesehen. Ab und zu verpasst sie die allerbeste Karte, ist aber fast immer nah dran.",
    },
    engineering: {
      text: "HNSW (Hierarchical Navigable Small World) ist ein geschichteter Nachbarschaftsgraph. Obere Schichten enthalten wenige Knoten mit weiten Verbindungen, untere sind dichter. Eine Suche startet oben, wandert gierig zum Nachbarn, der der Anfrage am nächsten ist, und steigt Schicht für Schicht ab, was ungefähr logarithmische Suchzeit ergibt. Wichtige Parameter sind m (Verbindungen pro Knoten), ef_construction (Bauqualität) und ef_search (Suchbreite, Tausch von Tempo gegen Recall). Er braucht mehr Speicher als IVF-Indizes, liefert aber sehr guten Recall und niedrige Latenz.",
      pitfalls: [
        "Er ist approximativ: Miss den Recall gegen exakte Suche an einer Stichprobe, wenn du m oder ef_search änderst.",
        "Für gute Leistung sollte der Graph in den Arbeitsspeicher passen.",
        "Viele Löschungen und Updates verschlechtern den Graphen langsam; plane regelmäßiges Neu-Indexieren.",
      ],
    },
    keywords: ["Index", "Graph", "approximativ"],
  },
  "rag-07": {
    name: "Metadaten-Filter",
    official: "Grenze die Suche über Felder wie Datum, Nutzer oder Dokumenttyp ein.",
    kid: "Willst du nur die Comics von diesem Jahr, gehst du zuerst zum Regal mit diesen Comics und suchst dann den besten aus. Filter machen den Stapel kleiner, bevor nach Bedeutung gesucht wird.",
    realWorld: {
      title: "Bitte nur Bücher von diesem Jahr",
      text: "Eine Lehrerin fragt nach den besten Büchern über Vulkane, aber nur solche, die nach 2020 erschienen und für Zehnjährige geeignet sind. Die Bibliothekarin durchsucht nicht die ganze Karte und wirft dann das meiste weg. Sie nimmt zuerst nur die Karten mit dem Stempel „nach 2020“ und „ab 10“ und sucht dann darunter die Vulkan-Ecke.",
    },
    engineering: {
      text: "Speichere strukturierte Felder (Datum, Quelle, Dokumenttyp, Mandant, Sprache, Zugriffsstufe) als Metadaten bei jedem Chunk und wende sie als Filter in der Vektorabfrage an. Filter setzen harte Bedingungen durch, die Ähnlichkeit nicht kann, etwa Aktualität oder Berechtigungen, und erhöhen die Präzision. Pre-Filtering wendet Bedingungen vor oder während der approximativen Suche an; Post-Filtering danach, was zu wenigen Ergebnissen führen kann. Indexiere die Felder, nach denen du filterst.",
      pitfalls: [
        "Post-Filtering nach den Top k kann null Ergebnisse liefern; bevorzuge Engines, die während der Suche filtern.",
        "Ein LLM kann Filter aus der Frage ziehen („seit 2022“, „nur PDFs“), aber prüf die Werte.",
        "Berechtigungsfilter gehören in den Code, nie in den Prompt.",
      ],
    },
    keywords: ["Filter", "Metadaten", "Datum", "Berechtigungen"],
  },
  "rag-08": {
    name: "BM25-Stichwortsuche",
    official:
      "Klassisches Ranking nach Stichwörtern. Findet exakte Namen, Codes und Begriffe, die Embeddings verpassen.",
    kid: "Manchmal brauchst du genau das richtige Wort, wie die Modellnummer auf einer Spielzeugschachtel. Die Stichwortsuche zählt exakte Wörter und gibt seltenen Wörtern Extrapunkte.",
    realWorld: {
      title: "Der alte Zettelkatalog",
      text: "Ein Schüler fragt nach der Anleitung für das „Mikroskop XR-200“. Die Ideenkarte hilft nicht: XR-200 und XR-300 bedeuten fast dasselbe. Also nutzt die Bibliothekarin den alten Zettelkatalog, der jedes exakte Wort verzeichnet. Seltene Wörter wie „XR-200“ zählen viel, häufige wie „das“ fast nichts, und lange Bücher gewinnen nicht nur, weil sie lang sind.",
    },
    engineering: {
      text: "BM25 ist eine klassische Ranking-Funktion über einem invertierten Index. Für jeden Suchbegriff addiert sie dessen inverse Dokumenthäufigkeit (seltene Begriffe wiegen mehr) mal einer sättigenden Funktion seiner Häufigkeit im Dokument, normiert auf die Dokumentlänge (meist k1 ≈ 1,2, b ≈ 0,75). Sie glänzt bei Kennungen, Namen, Codes und seltenem Fachjargon, den dichte Embeddings verwischen, braucht kein Modell und ist billig. Synonyme versteht sie nicht, deshalb wird sie mit Vektorsuche kombiniert.",
      pitfalls: [
        "Sie braucht exakte Wortüberschneidung: „Auto“ findet nicht „Kraftfahrzeug“.",
        "Die Tokenisierung zählt: Codes wie „XR-200“ dürfen nicht in sinnlose Teile zerfallen.",
        "BM25-Werte sind nicht mit Vektor-Ähnlichkeiten vergleichbar; kombiniere beide über den Rang, nicht über rohe Werte.",
      ],
    },
    keywords: ["Stichwortsuche", "Schlüsselwörter", "exakt", "Volltext"],
  },
  "rag-09": {
    name: "Hybride Suche",
    official:
      "Führe Stichwort- und Vektorergebnisse zusammen (zum Beispiel mit Reciprocal Rank Fusion), um mehr der richtigen Chunks zu finden.",
    kid: "Zwei Bibliothekare helfen dir: Einer kennt jedes exakte Wort, der andere versteht die Bedeutung. Du nimmst die Bücher, die beide weit oben auf ihre Listen setzen.",
    realWorld: {
      title: "Zwei Bibliothekare, ein Stapel",
      text: "Frau Wort kennt den Zettelkatalog auswendig und ist bei exakten Titeln und Codes unschlagbar. Herr Sinn kennt die Ideenkarte und findet Bücher auch dann, wenn der Schüler andere Wörter benutzt. Für jede Frage schreiben beide eine sortierte Liste, und die Bücher, die auf beiden Listen weit oben stehen, kommen nach vorne auf den Stapel. Keiner der beiden allein ist so gut wie beide zusammen.",
    },
    engineering: {
      text: "Hybride Suche lässt Stichwort- (BM25) und Vektor-Retrieval parallel laufen und führt die Ergebnisse zusammen. Üblich ist Reciprocal Rank Fusion: Jedes Dokument bekommt die Summe über alle Listen von 1 / (k + Rang), mit k um 60, was keine Kalibrierung der Werte braucht. Alternativen sind gewichtete Fusion normierter Werte oder ein Reranker über die Vereinigungsmenge. Hybride Suche verbessert meist den Recall gegenüber jeder Methode allein, besonders bei Anfragen, die Konzepte mit exakten Begriffen mischen.",
      pitfalls: [
        "Rohe BM25- und Kosinus-Werte zu addieren ist sinnlos, weil ihre Skalen verschieden sind; fusioniere über den Rang oder normiere zuerst.",
        "Hol von jeder Methode mehr Kandidaten (zum Beispiel 20-50), als du am Ende brauchst.",
        "Miss es: Bei manchen Daten dominiert eine Methode, und die andere bringt vor allem Rauschen.",
      ],
    },
    keywords: ["hybrid", "Fusion", "kombinieren"],
  },
  "rag-10": {
    official: "Ein zweites Modell bewertet die Top-Ergebnisse neu, damit die besten Chunks in den Prompt kommen.",
    kid: "Zuerst greifst du schnell zwanzig Bücher, die helfen könnten. Dann liest ein sorgfältiger Helfer jedes neben deiner Frage und legt die besten drei nach oben.",
    realWorld: {
      title: "Der sorgfältige zweite Blick",
      text: "Die schnelle Suche der Bibliothekarin bringt in einer Sekunde zwanzig mögliche Karten, aber nur grob in der richtigen Reihenfolge. Ihr Assistent liest dann jede Karte neben der genauen Frage des Schülers und vergibt eine Note von eins bis zehn. Nur die drei bestbewerteten Karten gehen an den Schüler. Der Assistent ist pro Karte langsam, darum prüft er zwanzig Karten und nicht die ganze Bibliothek.",
    },
    engineering: {
      text: "Ein Reranker ist meist ein Cross-Encoder, der Anfrage und eine Kandidatenpassage gemeinsam liest und einen Relevanzwert ausgibt, was viel genauer ist als der Vergleich zweier unabhängig berechneter Embeddings. Das übliche Muster: 20-100 Kandidaten per schneller hybrider Suche holen, sie reranken und die Top 3-10 für den Prompt behalten. Es gibt offene Cross-Encoder und gehostete Rerank-APIs. Die zusätzliche Latenz wächst mit der Zahl der Kandidaten.",
      pitfalls: [
        "Reranking kann keine Dokumente zurückholen, die die erste Stufe nie gefunden hat; der Recall kommt zuerst.",
        "Kosten und Latenz wachsen mit der Zahl der Kandidaten; 20-50 ist oft ein guter Mittelweg.",
        "Prüf die maximale Eingabelänge des Rerankers; lange Chunks werden still abgeschnitten.",
      ],
    },
    keywords: ["neu sortieren", "Cross-Encoder", "Relevanz"],
  },
  "rag-11": {
    name: "Query-Umschreibung",
    official: "Lass das LLM die Frage des Nutzers umformulieren oder erweitern, bevor du suchst.",
    kid: "Fragt ein Freund „Und was ist mit dem anderen?“, überlegst du erst, was er wirklich meint. Der Computer schreibt unklare Fragen in klare um, bevor er sucht.",
    realWorld: {
      title: "Was meinst du mit „es“?",
      text: "Ein Schüler, der gerade über die Titanic geredet hat, fragt: „Wie viele haben es überlebt?“ Nach „es überlebt“ zu suchen, bringt nichts. Die Bibliothekarin macht daraus still „Wie viele Passagiere überlebten den Untergang der Titanic 1912?“ und sucht damit. Bei breiten Fragen schreibt sie manchmal drei Versionen und sucht mit allen.",
    },
    engineering: {
      text: "Query Rewriting nutzt ein LLM (oder Regeln), um die rohe Nutzereingabe vor dem Retrieval in bessere Suchanfragen zu verwandeln: Pronomen aus dem Gespräch auflösen, Tippfehler korrigieren, Abkürzungen ausschreiben, mehrteilige Fragen aufteilen oder mehrere Umformulierungen erzeugen (Multi-Query) und ihre Ergebnisse zusammenführen. Mit einem kleinen Modell ist das billig und bringt im Gesprächs-RAG oft große Gewinne, wo Folgefragen selten für sich allein stehen.",
      pitfalls: [
        "Eine Umschreibung kann die Bedeutung verändern; logge beide Versionen und evaluiere sie.",
        "Sie fügt jeder Anfrage einen LLM-Aufruf hinzu; nimm ein kleines, schnelles Modell.",
        "Behalte auch die Originalanfrage, besonders für exakte Begriffe, die der Umschreiber wegformulieren könnte.",
      ],
    },
    keywords: ["umschreiben", "umformulieren", "Anfrage", "Folgefrage"],
  },
  "rag-12": {
    official: "Lass das LLM eine hypothetische Antwort schreiben, bette diese ein und suche damit.",
    kid: "Um ein verlorenes Spielzeug zu finden, hilft es, sich vorzustellen, wie es aussieht. HyDE lässt den Computer eine Antwort ausdenken und sucht dann echte Seiten, die ihr ähneln.",
    realWorld: {
      title: "Die Antwort ausdenken, dann ihren Zwilling finden",
      text: "Ein Schüler fragt „Warum ist der Himmel blau?“. Eine kurze Frage und eine lange Lehrbuchseite sehen sehr verschieden aus und liegen weit auseinander auf der Ideenkarte. Die Bibliothekarin schreibt schnell einen Antwortabsatz zum Schein, „Sonnenlicht wird an winzigen Luftteilchen gestreut …“, der genau wie eine Lehrbuchseite klingt. Damit sucht sie und landet direkt neben den echten Seiten. Ihre Schein-Antwort bekommt der Schüler nie zu sehen.",
    },
    engineering: {
      text: "HyDE (Hypothetical Document Embeddings) lässt ein LLM eine hypothetische Antwort auf die Anfrage schreiben, bettet diese statt der Anfrage ein und sucht damit. Weil der erzeugte Text den Zieldokumenten in Stil und Wortschatz ähnelt, landet er oft näher an relevanten Passagen als eine kurze Frage. Das hilft vor allem bei kurzen oder vagen Anfragen und neuen Fachgebieten, kostet eine zusätzliche Generierung pro Anfrage und kann das Retrieval in die Irre führen, wenn das Modell selbstsicher falsch rät. Der hypothetische Text dient nur der Suche, nie als Antwort.",
      pitfalls: [
        "Rät das Modell falsch, sucht die Suche nach dem Falschen.",
        "Vor dem Retrieval kommt die Zeit einer ganzen Generierung hinzu.",
        "Kombiniere es mit der Originalanfrage oder hybrider Suche, statt sie zu ersetzen.",
      ],
    },
    keywords: ["hypothetisch", "Schein-Antwort", "Dokument"],
  },
  "rag-13": {
    official:
      "Lass ein LLM jedem Chunk eine kurze Notiz hinzufügen, wo er im Dokument steht, und indexiere ihn dann.",
    kid: "Eine Seite, auf der nur „es wuchs um 3 %“ steht, ergibt allein keinen Sinn. Also schreiben wir vor dem Einsortieren eine kleine Notiz darüber, aus welchem Buch und Kapitel sie stammt.",
    realWorld: {
      title: "Jede Karte vor dem Einsortieren beschriften",
      text: "Die Karte „Der Umsatz stieg um 3 % gegenüber dem Vorquartal“ ist allein nutzlos: wessen Umsatz, welches Quartal? Vor dem Einsortieren liest die Bibliothekarin den ganzen Bericht und schreibt eine Zeile oben auf jede Karte: „Aus dem Bericht der ACME Corp für Q2 2023, zum Umsatz.“ Fragt jetzt ein Schüler nach ACMEs Ergebnissen im zweiten Quartal, findet er die Karte sofort.",
    },
    engineering: {
      text: "Contextual Retrieval, 2024 von Anthropic beschrieben, lässt ein LLM vor dem Einbetten und der BM25-Indexierung einen kurzen, chunk-spezifischen Kontext voranstellen (meist 50-100 Tokens, die den Chunk im Gesamtdokument verorten). Das repariert Chunks, die ohne ihr Dokument ihre Bedeutung verlieren. Anthropic berichtete von deutlich weniger fehlgeschlagenen Retrievals, mit Reranking sogar noch weniger. Prompt Caching des ganzen Dokuments hält die LLM-Aufrufe pro Chunk bezahlbar.",
      pitfalls: [
        "Ein LLM-Aufruf pro Chunk: Ohne Prompt Caching des Dokuments wird das teuer.",
        "Lass es erneut laufen, wenn sich Dokumente ändern, nicht nur bei neuen Dokumenten.",
        "Behalte den Original-Chunktext für die Anzeige; der ergänzte Kontext dient nur der Suche.",
      ],
    },
    keywords: ["Kontext", "Notiz", "Chunk-Kontext"],
  },
  "rag-14": {
    official: "Durchsuche kleine Chunks für Präzision und schick dann ihren größeren Eltern-Abschnitt als Kontext.",
    kid: "Du findest den genauen Satz in einem Buch und liest dann die ganze Seite drumherum, um ihn zu verstehen. Kleine Stücke helfen beim Finden, größere beim Verstehen.",
    realWorld: {
      title: "Den Satz finden, die Seite herausgeben",
      text: "Kleine Karten lassen sich leicht zuordnen: Die Karte „Elefanten können 60 bis 70 Jahre alt werden“ passt perfekt zur Frage nach ihrer Lebensdauer. Aber diesem einen Satz fehlen die Details drumherum, etwa Wildnis gegenüber Zoo. Also trägt jede kleine Karte einen Vermerk, von welcher ganzen Seite sie stammt, und die Bibliothekarin reicht dem Schüler die ganze Seite statt des einzelnen Satzes.",
    },
    engineering: {
      text: "Parent-Child-Retrieval (Small-to-Big) indexiert kleine Kind-Chunks für genaues Matching, gibt dem LLM aber ihren größeren Eltern-Abschnitt (einen Abschnitt oder eine Seite). Jedes Kind speichert die ID seines Elternteils; nach dem Retrieval werden die Eltern dedupliziert und als Kontext geschickt. So trennst du die beste Einheit zum Finden von der besten Einheit zum Antworten. Varianten sind Sentence-Window-Retrieval (die Nachbarsätze zurückgeben) und Auto-Merging (den Elternteil zurückgeben, wenn mehrere seiner Kinder passen).",
      pitfalls: [
        "Eltern können groß sein: Begrenze, wie viele du schickst, sonst sprengst du das Kontextbudget.",
        "Mehrere Kinder desselben Elternteils können andere relevante Abschnitte verdrängen; dedupliziere.",
        "Halte Eltern- und Kind-IDs synchron, wenn Dokumente neu gechunkt werden.",
      ],
    },
    keywords: ["Eltern", "Kind", "Abschnitt", "small to big"],
  },
  "rag-15": {
    name: "Dokument-Parsing",
    official: "Sauberen Text, Tabellen und Struktur aus PDFs, Webseiten und Scans herausholen.",
    kid: "Liest du eine Seite mit zwei Spalten einfach quer durch, geraten die Sätze durcheinander. Parsing heißt, Seiten, Tabellen und Bilder richtig zu lesen, bevor man sie benutzt.",
    realWorld: {
      title: "Die Zeitung richtig lesen",
      text: "Die Bibliothek bekommt gescannte Zeitungen mit zwei Spalten, Tabellen mit Fußballergebnissen und Fotos mit Bildunterschriften. Ein schludriger Helfer liest jede Zeile quer über beide Spalten, sodass Artikel durcheinandergeraten und Tabellen zu Zahlensalat werden. Ein sorgfältiger Helfer folgt jeder Spalte nach unten, lässt Tabellen Tabellen sein und notiert, welche Unterschrift zu welchem Foto gehört. Nur die sorgfältige Version lohnt das Einsortieren.",
    },
    engineering: {
      text: "Dokument-Parsing macht aus PDFs, HTML, Office-Dateien und Scans sauberen Text mit Struktur: Lesereihenfolge, Überschriften, Listen, Tabellen und Bildunterschriften, bei Bedarf mit OCR. Die meisten Qualitätsprobleme bei RAG beginnen hier. Werkzeuge reichen von schnellen Textextraktoren (pypdf, PyMuPDF) über layoutbewusste Parser (Docling, Unstructured, Marker) bis zu Vision-Modellen für komplexe Layouts. Wandle in Markdown um, lass Tabellen intakt, behalte Seitenzahlen für Quellenangaben und prüf Stichproben mit eigenen Augen.",
      pitfalls: [
        "Mehrspaltige Layouts und Tabellen sind die Stellen, an denen naive Extraktoren scheitern; prüf die zuerst.",
        "Gescannte PDFs haben keine Textebene; du brauchst OCR oder ein Vision-Modell.",
        "Behalte Seitenzahlen und Abschnittstitel als Metadaten für Quellenangaben und Filter.",
      ],
    },
    keywords: ["Parsing", "PDF", "Tabellen", "OCR", "Scan"],
  },
  "rag-16": {
    name: "Quellenangaben",
    official: "Antworten verweisen auf die genauen Quell-Chunks, damit Nutzer sie prüfen können.",
    kid: "Wenn du ein Referat schreibst, sagst du, aus welchem Buch jede Tatsache stammt. Eine gute Antwort vom Computer macht das genauso, damit jeder sie prüfen kann.",
    realWorld: {
      title: "Lesezeichen in jeder Antwort",
      text: "Wenn die Bibliothekarin einem Schüler antwortet, steckt sie in jedes benutzte Buch ein nummeriertes Lesezeichen und schreibt die Nummern neben ihre Sätze: „Elefanten werden etwa 70 Jahre alt [1] und fressen bis zu 18 Stunden am Tag [2].“ Der Schüler oder die Lehrerin kann Buch 1 beim Lesezeichen aufschlagen und nachprüfen. Eine Antwort ohne Lesezeichen ist nur ihre Meinung.",
    },
    engineering: {
      text: "Quellenangaben verknüpfen jede Aussage einer erzeugten Antwort mit den genauen Quell-Chunks, die sie stützen, sodass Nutzer Antworten prüfen können und du unbelegte Aussagen erkennst. Gib jedem Chunk eine stabile ID mit Dokument, Seite und Position, weise das Modell an, IDs inline zu zitieren, prüf, dass die zitierten IDs im Kontext vorkommen, und zeig sie als Links an. Manche APIs bieten native Zitierfunktionen, die die genau zitierten Passagen zurückgeben. Bewerte die Genauigkeit der Quellenangaben, nicht nur, ob es welche gibt.",
      pitfalls: [
        "Eine Quellenangabe kann auf eine echte Quelle zeigen, die nicht sagt, was der Satz behauptet; prüf auch die Faithfulness.",
        "Nutzer brauchen klickbare Quellen, dafür brauchst du stabile Chunk-IDs mit Seitenzahlen.",
        "Viele Quellen pro Satz heißen meist, dass das Modell sich absichert; frag nach der einen besten Quelle.",
      ],
    },
    keywords: ["Quellen", "Zitate", "Belege", "nachprüfen"],
  },
  "rag-17": {
    official:
      "Bau einen Graphen aus Entitäten und ihren Beziehungen und suche darin für Fragen, bei denen man Punkte verbinden muss.",
    kid: "Manche Fragen verlangen, einer Kette von Leuten zu folgen, wie dem Fußballtrainer vom Bruder deines Freundes. GraphRAG zeichnet auf, wer mit wem verbunden ist, und folgt den Linien zur Antwort.",
    realWorld: {
      title: "Fäden zwischen den Karten",
      text: "Ein Schüler fragt: „Was stellt die Firma, bei der Ana arbeitet, heute her?“ Keine einzelne Karte sagt das. Eine Karte sagt, Ana arbeitet bei Acme, eine andere, Acme hat Beta gekauft, eine dritte, Beta stellt Solarlampen her. Die Bibliothekarin hat Fäden zwischen zusammengehörige Karten gespannt, also folgt sie von Ana zu Acme, von Acme zu Beta und von Beta zu den Solarlampen und antwortet mit allen drei Karten.",
    },
    engineering: {
      text: "GraphRAG lässt ein LLM Entitäten und Beziehungen aus Dokumenten extrahieren, speichert sie als Wissensgraph und sucht, indem es Beziehungen entlanggeht. Microsofts GraphRAG fasst zusätzlich erkannte Gruppen von Entitäten zusammen, um globale Fragen über einen ganzen Korpus zu beantworten. So klappen Multi-Hop-Fragen und korpusweite Zusammenfassungen, die Chunk-Ähnlichkeit verpasst. Die Kosten sind eine aufwendige Indexierung, Extraktionsfehler und Graphpflege, also nutze es, wenn sich Fragen wirklich um Beziehungen drehen.",
      pitfalls: [
        "Die Indexierung ist teuer: ein oder mehrere LLM-Aufrufe pro Chunk, um Entitäten zu extrahieren.",
        "Extraktionsfehler und doppelte Entitäten („Acme“ und „ACME Corp“) verfälschen den Graphen; löse Entitäten auf.",
        "Für einfache Faktenabfragen ist es überdimensioniert; kombiniere es mit normalem Vektor-Retrieval.",
      ],
    },
    keywords: ["Graph", "Wissensgraph", "Beziehungen", "Entitäten"],
  },
  "rag-18": {
    name: "Agentisches RAG",
    official: "Ein Agent entscheidet, wann, wo und wie oft gesucht wird, statt einer festen einmaligen Abfrage.",
    kid: "Ein schlauer Helfer schaut nicht in ein Buch und hört auf. Er entscheidet, wo er sucht, liest und sucht woanders weiter, bis er die Antwort wirklich hat.",
    realWorld: {
      title: "Die Bibliothekarin, die weitergräbt",
      text: "Ein Schüler fragt: „Wurde die Autorin unserer Klassenlektüre vor der ersten Mondlandung geboren?“ Ein einfacher Helfer sucht einmal und gibt auf. Die grabende Bibliothekarin denkt: Erst herausfinden, wer die Lektüre geschrieben hat, dann das Geburtsjahr nachschlagen, dann das Datum der Mondlandung, dann vergleichen. Sie wählt jedes Mal, wo sie sucht, und hört auf, wenn sie sicher ist.",
    },
    engineering: {
      text: "Agentisches RAG gibt einem Agenten Retrieval als Werkzeuge (Vektorsuche, Stichwortsuche, SQL, Websuche, Dokumentabruf) und lässt das Modell entscheiden, ob es sucht, mit welchem Werkzeug und welcher Anfrage und wann die Belege reichen, in einer Schleife bis zum Ziel. So klappen Multi-Hop-, mehrdeutige und Vergleichsfragen, die ein festes Retrieval verpasst. Die Kosten sind mehr LLM-Aufrufe, höhere Latenz und weniger vorhersehbares Verhalten, also ergänze Schrittlimits, Tracing und Evals über den ganzen Ablauf.",
      pitfalls: [
        "Ohne Schrittlimit kann ein Agent im Kreis suchen; begrenze Schritte und Tokens.",
        "Es ist schwerer zu evaluieren: Bewerte die ganze Folge von Suchen, nicht nur die finale Antwort.",
        "Langsamer und teurer als ein einzelnes Retrieval; leite nur schwere Fragen dorthin.",
      ],
    },
    keywords: ["agentisch", "Agent", "mehrfach suchen"],
  },
  "rag-19": {
    official: "Von allen relevanten Chunks: wie viele unter den Top-k-Ergebnissen auftauchen.",
    kid: "Gibt es fünf gute Bücher und dein Top-Zehn-Stapel hat vier davon, hast du vier von fünf gefunden. Recall at k zählt, wie viele der guten Bücher in deinen Top-Stapel geschafft haben.",
    realWorld: {
      title: "Wie viele der richtigen Bücher hat sie gebracht?",
      text: "Für eine Testfrage kennt die Lehrerin die fünf Bibliotheksbücher mit der Antwort. Die Bibliothekarin bringt ihre Top Ten. Sind vier der fünf richtigen Bücher in ihrem Stapel, ist ihr Recall at 10 vier von fünf, also 80 %. Mehr Bücher bringen erhöht den Recall, macht den Stapel aber schwerer zu lesen, deshalb wird Recall immer bei einem gewählten k gemessen.",
    },
    engineering: {
      text: "Recall@k ist der Anteil aller relevanten Chunks einer Anfrage, die in den Top-k-Ergebnissen erscheinen, gemittelt über ein Testset mit gelabelten relevanten Chunks. Er misst, ob das Retrieval die Belege überhaupt findet, und deckelt damit die Antwortqualität: Was nie abgerufen wurde, kann das LLM nicht nutzen. Wähle k passend zur Zahl der Chunks, die du ans LLM schickst, verfolge den Wert bei jeder Änderung an Chunking, Embeddings oder Sucheinstellungen und kombiniere ihn mit einer Ranking-Metrik wie MRR oder nDCG.",
      pitfalls: [
        "Er braucht gelabelte relevante Chunks pro Frage; bau von Hand ein kleines Golden Set mit 30 oder mehr Fragen.",
        "Recall ignoriert die Reihenfolge: Ein Treffer auf Rang 5 zählt so viel wie einer auf Rang 1.",
        "Neues Chunking ändert die Chunk-IDs; labele Relevanz auf Dokument- oder Passagenebene oder labele neu.",
      ],
    },
    keywords: ["Trefferquote", "Recall", "Top k", "Messung"],
  },
  "rag-20": {
    name: "MRR und nDCG",
    official: "Ranking-Metriken, die belohnen, wenn der richtige Chunk weit oben in der Liste steht.",
    kid: "Das richtige Buch zu finden ist gut, es ganz oben auf dem Stapel zu finden ist noch besser. Diese Werte geben mehr Punkte, wenn die richtigen Bücher weit oben liegen.",
    realWorld: {
      title: "Punkte fürs Nach-oben-Legen",
      text: "Die Lehrerin bewertet den Stapel der Bibliothekarin. Bei MRR schaut sie nur, wo das erste richtige Buch liegt: ganz oben gibt einen vollen Punkt, Platz zwei einen halben, Platz drei ein Drittel. Bei nDCG gibt sie Punkte für jedes richtige Buch, mehr für sehr hilfreiche und weniger, je tiefer sie liegen. Ein Stapel, bei dem das beste Buch ganz unten vergraben ist, schneidet schlecht ab, obwohl das Buch drin ist.",
    },
    engineering: {
      text: "MRR (Mean Reciprocal Rank) mittelt 1 / Rang des ersten relevanten Ergebnisses über alle Anfragen und passt zu Aufgaben, bei denen ein guter Treffer reicht. nDCG@k (normalized Discounted Cumulative Gain) summiert abgestufte Relevanz, abgewertet mit log2(Rang + 1), und teilt durch den Wert der idealen Reihenfolge; so belohnt es, die relevantesten Ergebnisse zuerst zu zeigen, und unterstützt mehrere Relevanzstufen. Nutze sie zusammen mit Recall@k, um Reranker und Fusion abzustimmen, denn dort zählt die Reihenfolge, weil nur die obersten Chunks das LLM erreichen.",
      pitfalls: [
        "MRR ignoriert alles nach dem ersten Treffer; nimm nDCG, wenn mehrere Ergebnisse zählen.",
        "nDCG braucht abgestufte Relevanzlabels, deren Erstellung mehr Aufwand ist.",
        "Gib immer das verwendete k an: nDCG@5 und nDCG@10 sind verschiedene Zahlen.",
      ],
    },
    keywords: ["Ranking", "Reihenfolge", "Metrik"],
  },
};

export default concepts;
