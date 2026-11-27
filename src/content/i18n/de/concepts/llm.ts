import type { ConceptTranslations } from "../../types";

/** Bereich LLM auf Deutsch. Szene: ein sehr belesener Papagei in einer Bibliothek. */
const concepts: ConceptTranslations = {
  "llm-01": {
    name: "Tokenisierung",
    official:
      "Text wird in Tokens (Wortteile) zerlegt, bevor das Modell ihn liest. Limits und Preise werden in Tokens gezählt.",
    kid: "Bevor ein Computer deinen Satz liest, schneidet er ihn in kleine Stücke, wie ein Brot in Happen. Längere Sätze sind mehr Happen, und mehr Happen kosten mehr.",
    realWorld: {
      title: "Die Karteikarten des Papageis",
      text: "Unser belesener Papagei kann keine ganze Seite auf einmal lesen. Die Bibliothekarin schneidet jeden Satz in kleine Karteikarten, ein Wort oder Wortteil pro Karte, und reicht sie ihm einzeln. Die Bibliothek zahlt pro Karte, also kostet ein langer Brief mehr als ein kurzer, und auf den Tisch des Papageis passen nur so viele Karten.",
    },
    engineering: {
      text: "Ein Tokenizer (meist BPE oder SentencePiece) bildet Text auf ganzzahlige IDs aus einem festen Vokabular mit 30k-200k Einträgen ab. Häufige Wörter sind ein Token; seltene Wörter, Code und nicht-englischer Text zerfallen in mehrere. Kontextlimits, Rate Limits und Preise werden alle in Tokens gezählt, daher kann derselbe Prompt in einer Sprache mehr kosten als in einer anderen. Miss Token-Zahlen immer mit dem Tokenizer des Anbieters, statt sie aus Zeichen zu schätzen.",
      pitfalls: [
        "Ein „Wort“ ist kein Token: „Tokenization“ sind zwei Tokens, ein Emoji können drei sein.",
        "Nicht-englischer Text braucht für dieselbe Bedeutung oft 2-4x mehr Tokens, auch Deutsch.",
        "Verschiedene Modelle nutzen verschiedene Tokenizer; die Zahlen lassen sich nicht zwischen Anbietern übertragen.",
      ],
    },
    keywords: ["Tokenisierung", "Wortteile", "Preis", "zählen"],
  },
  "llm-02": {
    name: "Transformer-Architektur",
    official: "Der Netzwerk-Aufbau hinter GPT, Claude und Llama: gestapelte Attention- und Feed-Forward-Schichten.",
    kid: "Ein Transformer ist das Rezept für einen schlauen Wörter-Rater. Er stapelt dieselben zwei Schritte viele Male: alle Wörter anschauen, dann darüber nachdenken.",
    realWorld: {
      title: "Ein Turm aus Lesezimmern",
      text: "Stell dir das Gehirn des Papageis als hohen Turm vor. Auf jedem Stockwerk gibt es zwei Räume: Im ersten schaut er alle Karteikarten an und entscheidet, welche zusammengehören; im zweiten denkt er über das Bemerkte nach. Die Karten wandern Stockwerk für Stockwerk nach oben, und ganz oben rät der Papagei das nächste Wort. GPT, Claude und Llama sind alle solche Türme, nur unterschiedlich hoch.",
    },
    engineering: {
      text: "Ein Decoder-only-Transformer ist ein Stapel identischer Blöcke, jeder mit einer Multi-Head-Self-Attention-Schicht und einem positionsweisen Feed-Forward-Netz, beide umgeben von Residual-Verbindungen und Layer-Normalisierung. Unten gehen Token-Embeddings plus Positionsinformation hinein; eine letzte lineare Schicht über das Vokabular liefert die Logits für das nächste Token. Die Modellgröße ergibt sich vor allem aus der Zahl der Blöcke, der versteckten Breite und der Zahl der Attention-Heads.",
      pitfalls: [
        "Die Kosten der Attention wachsen mit dem Quadrat der Sequenzlänge; lange Prompts sind teuer.",
        "Die Architektur ist bei allen Anbietern gleich; Daten, Größe und Training machen den Unterschied.",
      ],
    },
    keywords: ["Architektur", "Schichten", "Aufbau"],
  },
  "llm-03": {
    official: "Jedes Token schaut auf die anderen Tokens und entscheidet, welche für seine Bedeutung wichtig sind.",
    kid: "Liest du „der Hund jagte seinen Ball“, weißt du, dass „seinen“ den Hund meint. Der Computer macht es genauso: Jedes Wort schaut sich die anderen an, um zu verstehen, was es bedeutet.",
    realWorld: {
      title: "Freunde am Tisch",
      text: "Leg alle Karteikarten um einen Tisch. Jede Karte kann jede andere ansehen und entscheiden, wer ihre besten Freunde sind. Die Karte „seinen“ schaut sich um und zeigt auf „Hund“. Die Karte „Ball“ zeigt auf „jagte“. Der Papagei notiert diese Freundschaften für jede Karte, und so versteht er, wer im Satz was getan hat.",
    },
    engineering: {
      text: "Für jedes Token berechnet das Modell einen Query-, einen Key- und einen Value-Vektor. Das Attention-Gewicht zwischen zwei Tokens ist der Softmax des skalierten Skalarprodukts aus der Query des einen und dem Key des anderen; die Ausgabe ist die gewichtete Summe der Values. Mehrere Heads lernen parallel verschiedene Beziehungen (Syntax, Koreferenz, Position). In einem Decoder verhindert eine kausale Maske, dass Tokens auf spätere Positionen schauen.",
      pitfalls: [
        "Attention ist O(n^2) in der Sequenzlänge, für Rechenzeit und Speicher.",
        "Attention-Gewichte erklären das Denken des Modells nicht zuverlässig; nimm Visualisierungen nur als Hinweis.",
      ],
    },
    keywords: ["Aufmerksamkeit", "Abfrage", "Schlüssel", "Wert"],
  },
  "llm-04": {
    name: "Kontextfenster",
    official: "Die meisten Tokens (Prompt + Antwort), die ein Modell in einem Aufruf verarbeiten kann.",
    kid: "Der Computer hat einen Tisch, auf den nur so viele Karteikarten passen. Deine Frage und die Antwort müssen beide auf den Tisch passen, sonst fallen Karten herunter.",
    realWorld: {
      title: "Der Tisch des Papageis",
      text: "Der Papagei arbeitet an einem Tisch mit fester Größe. Die Bibliothekarin legt die Fragekarten auf die eine Seite, die Antwortkarten kommen auf die andere. Füllt die Frage schon fast den ganzen Tisch, bleibt kaum Platz für die Antwort. Ein größerer Tisch (ein größeres Kontextfenster) kostet mehr, und der Papagei braucht länger, um alle Karten zu überblicken.",
    },
    engineering: {
      text: "Das Kontextfenster ist die maximale Zahl an Tokens, die eine Anfrage enthalten darf: System-Prompt, Gesprächsverlauf, abgerufene Dokumente, Tool-Ergebnisse und die erzeugte Antwort zählen alle mit. Wer es überschreitet, bekommt einen Fehler oder einen still gekürzten Verlauf. Größere Fenster kosten mehr pro Anfrage, und Modelle beachten Inhalte in der Mitte sehr langer Eingaben oft schlechter. Retrieval und Zusammenfassen schlagen daher meist das Hineinstopfen von allem.",
      pitfalls: [
        "Eingabe und Ausgabe teilen sich das Fenster; ein riesiger Prompt lässt keinen Platz für die Antwort.",
        "„Lost in the middle“: Fakten in der Mitte des Prompts werden schlechter erinnert als am Anfang oder Ende.",
        "Das Fenster bei jedem Aufruf zu füllen, ist der schnellste Weg, dein Budget zu sprengen.",
      ],
    },
    keywords: ["Kontext", "Fenster", "Limit", "kürzen"],
  },
  "llm-05": {
    official:
      "Gespeicherte Keys und Values früherer Tokens, damit nicht jedes neue Token den ganzen Prompt neu berechnet.",
    kid: "Liest du eine lange Geschichte vor, fängst du nicht bei jedem Wort wieder auf Seite eins an. Der Computer macht sich Notizen zu den gelesenen Wörtern und denkt nur über das neue nach.",
    realWorld: {
      title: "Die Klebezettel des Papageis",
      text: "Unser belesener Papagei beantwortet eine lange Frage. Statt die ganze Frage vor jedem Wort neu zu lesen, klebt er beim ersten Lesen einen kleinen Zettel an jedes Wort. Für das nächste Wort wirft er nur einen Blick auf die Zettel. Mehr Wörter bedeuten mehr Zettel auf dem Tisch, deshalb brauchen sehr lange Fragen einen größeren Tisch.",
    },
    engineering: {
      text: "Beim autoregressiven Dekodieren schaut jedes neue Token auf alle vorherigen. Ohne Cache berechnet das Modell in jedem Schritt die Key- und Value-Projektionen der ganzen Sequenz neu, was über eine Generierung quadratischen Aufwand bedeutet. Der KV-Cache speichert K und V pro Schicht und Head für jedes verarbeitete Token, sodass jeder Schritt nur Q, K, V des neuen Tokens berechnet und über die gecachten K/V schaut. Der Speicher wächst linear mit der Sequenzlänge und begrenzt beim Serving meist die Batch-Größe.",
      pitfalls: [
        "Der Cache-Speicher, nicht die Rechenleistung, begrenzt, wie viele Nutzer du gleichzeitig bedienen kannst.",
        "Jede Änderung am Anfang des Prompts macht das gecachte Präfix ungültig.",
        "Multi-Turn-Chats senden den Verlauf erneut; ohne Prefix Caching zahlst du ihn jede Runde.",
      ],
    },
    keywords: ["Zwischenspeicher", "Speicher", "Dekodieren"],
  },
  "llm-06": {
    name: "Temperature und Top-p",
    official: "Regler fürs Sampling. Niedrige Werte geben vorhersehbare Antworten, hohe Werte abwechslungsreiche.",
    kid: "Wenn der Papagei das nächste Wort wählt, bestimmt ein Drehknopf, wie mutig er ist. Knopf runter, und er sagt das sichere, übliche Wort; Knopf hoch, und er wählt überraschende.",
    realWorld: {
      title: "Die Würfel des Papageis",
      text: "Für jedes nächste Wort hat der Papagei eine Liste mit Chancen: „Matte“ 60 %, „Sofa“ 25 %, „Mond“ 2 %. Die Temperature bestimmt, wie stark er die Liste vor dem Wählen schüttelt: niedrig hält den Favoriten oben, hoch macht die Liste flach, sodass auch seltene Wörter drankommen. Top-p sagt: Würfle nur unter den Wörtern, die zusammen die obersten 90 % ausmachen, und wirf die albernen weg.",
    },
    engineering: {
      text: "In jedem Schritt gibt das Modell Logits über sein Vokabular aus. Die Temperature T teilt die Logits vor dem Softmax: T < 1 schärft die Verteilung (deterministischer), T > 1 macht sie flacher (vielfältiger), T = 0 ist praktisch Greedy Decoding. Top-p (Nucleus Sampling) behält die kleinste Menge an Tokens, deren kumulierte Wahrscheinlichkeit p erreicht, und sampelt nur daraus. Nimm eine niedrige Temperature für Extraktion, Klassifikation und Code, eine höhere fürs Brainstorming, und ändere immer nur einen Regler.",
      pitfalls: [
        "Temperature 0 garantiert keine identischen Ausgaben; Batching und Hardware können Ergebnisse trotzdem ändern.",
        "Temperature und Top-p gleichzeitig zu tunen macht die Wirkung schwer nachvollziehbar; ändere nur einen.",
        "Manche Reasoning-Modelle akzeptieren keine eigenen Temperature-Werte.",
      ],
    },
    keywords: ["Temperatur", "Zufall", "Kreativität", "deterministisch"],
  },
  "llm-07": {
    name: "System-Prompts",
    official: "Dauerhafte Anweisungen, die Rolle, Regeln und Ausgabestil des Modells festlegen.",
    kid: "Bevor ein Spiel beginnt, erklärt die Lehrerin allen die Regeln. Ein System-Prompt ist die Regelkarte, die der Computer zuerst liest, damit er weiß, wer er sein und wie er antworten soll.",
    realWorld: {
      title: "Die Aufgabenkarte des Papageis",
      text: "Bevor der Papagei einen Besucher trifft, pinnt die Bibliothekarin eine Karte über seine Stange: „Du bist ein Wissenschaftsführer für Kinder. Sprich in kurzen Sätzen. Gib nie medizinischen Rat.“ Jede Frage wird mit dieser Karte im Blick beantwortet, so kann derselbe Papagei in einem Raum ein strenger Prüfungscoach und im nächsten ein freundlicher Geschichtenerzähler sein.",
    },
    engineering: {
      text: "Der System-Prompt ist eine eigene Nachricht (der Parameter `system` in Anthropics Messages API, eine System- oder Developer-Nachricht bei OpenAI), die jede Runde einrahmt: Rolle, Aufgabe, Einschränkungen, Ton, Ausgabeformat und was bei Unsicherheit zu tun ist. Stabile Anweisungen gehören hierher, Daten pro Anfrage in die User-Nachricht. Sei explizit, nenne den Grund hinter jeder Regel und versioniere System-Prompts wie Code, denn eine kleine Änderung ändert das Verhalten in jedem Gespräch.",
      pitfalls: [
        "Ein System-Prompt ist keine Sicherheitsgrenze: Nutzer können versuchen, ihn per Prompt Injection auszuhebeln.",
        "Leg nie Secrets oder API-Keys hinein; geh davon aus, dass er durchsickern kann.",
        "Eine lange Liste widersprüchlicher Regeln wird schlechter befolgt als wenige klare.",
      ],
    },
    keywords: ["Rolle", "Anweisungen", "Regeln", "Ton", "Stil"],
  },
  "llm-08": {
    official: "Leg 2-5 durchgerechnete Beispiele in den Prompt, damit das Modell das Muster übernimmt.",
    kid: "Zeigst du einem Freund zwei oder drei fertige Rätsel, sieht er schnell, wie das nächste geht. Wenn du dem Computer ein paar Beispiele gibst, funktioniert das genauso.",
    realWorld: {
      title: "Dem Papagei zeigen, wie es geht",
      text: "Die Bibliothekarin will Buchetiketten in genau einem Stil. Statt Regeln zu erklären, zeigt sie dem Papagei drei fertige Etiketten: „Dune | Herbert | Sci-Fi“, „Emma | Austen | Klassiker“, „Es | King | Horror“. Dann gibt sie ihm ein neues Buch. Der Papagei übernimmt das Muster samt Trennzeichen, denn Beispiele lehren ein Format besser als lange Anweisungen.",
    },
    engineering: {
      text: "Beim Few-shot Prompting stehen 2-5 Ein-/Ausgabe-Paare vor der echten Eingabe. Das Modell leitet daraus Format, Label-Menge, Ton und den Umgang mit Sonderfällen ab (In-Context Learning), ganz ohne Training. Wähle vielfältige Beispiele, die knifflige Fälle abdecken, halte ihr Format identisch und umschließe sie mit klaren Trennern wie XML-Tags. Beispiele kosten bei jedem Aufruf Eingabe-Tokens, also kombiniere sie mit Prompt Caching, wenn das Präfix stabil ist.",
      pitfalls: [
        "Das Modell kopiert alles, auch Fehler und zufällige Muster, etwa wenn alle Beispiele gleich lang sind.",
        "Unausgewogene Beispiele ziehen die Ausgabe zum häufigsten Label.",
        "Drei bis fünf gute Beispiele schlagen meist zwanzig mittelmäßige und kosten viel weniger Tokens.",
      ],
    },
    keywords: ["Beispiele", "Muster", "Format"],
  },
  "llm-09": {
    official:
      "Lass das Modell Schritt für Schritt nachdenken, bevor es antwortet. Hilft bei Aufgaben mit mehreren Schritten.",
    kid: "Stellt die Lehrerin eine schwere Rechenaufgabe, hilft es, jeden Schritt aufzuschreiben. Bittest du den Computer, Schritt für Schritt zu denken, passiert dasselbe.",
    realWorld: {
      title: "Auf Schmierpapier ausrechnen",
      text: "Ein Besucher fragt den Papagei: „Ein Buch kostet 12 Euro. Ich habe 50 und kaufe drei. Wie viel bleibt übrig?“ Platzt er einfach mit einer Zahl heraus, liegt er oft falsch. Ergänzt die Bibliothekarin „rechne es erst Schritt für Schritt aus“, schreibt er: Drei Bücher kosten 36, 50 minus 36 ist 14, also bleiben 14 Euro. Jeder Schritt gibt dem nächsten festen Boden.",
    },
    engineering: {
      text: "Chain-of-Thought-Prompting bittet das Modell, vor der endgültigen Antwort Zwischenschritte aufzuschreiben, etwa mit „Denke Schritt für Schritt“ oder einem <thinking>-Abschnitt gefolgt von einem <answer>-Abschnitt. Jedes erzeugte Token beeinflusst das nächste, daher kann das Modell so mehr Rechenaufwand in Arithmetik, Logik und Planung stecken. Trenne Begründung und Antwort, damit dein Code nur die Antwort parst, und denk daran, dass Reasoning-Tokens bezahlt werden und die Antwort verlangsamen. Reasoning-Modelle machen das intern, explizites CoT zählt also vor allem bei Standardmodellen.",
      pitfalls: [
        "Die aufgeschriebene Begründung ist nicht garantiert der echte Grund für die Antwort; nutze sie nicht als Prüfprotokoll.",
        "Sie kostet Ausgabe-Tokens: höhere Kosten und langsamere Antworten bei einfachen Aufgaben, wo sie nicht hilft.",
        "Parse nur die finale Antwort; zeig Nutzern rohe Begründungen nie ungeprüft.",
      ],
    },
    keywords: ["Schritt für Schritt", "Nachdenken", "Begründung", "mehrstufig"],
  },
  "llm-10": {
    name: "Reasoning-Modelle",
    official:
      "Modelle, die darauf trainiert sind, vor der Antwort lange nachzudenken. Langsamer und teurer, besser bei schweren Aufgaben.",
    kid: "Manche Rätsel brauchen eine schnelle Vermutung, andere langes Nachdenken. Reasoning-Modelle sind Computer, die innehalten und länger denken: langsamer, aber viel besser bei schweren Rätseln.",
    realWorld: {
      title: "Der schnelle Papagei und die sorgfältige Eule",
      text: "Die Bibliothek stellt eine Eule neben den Papagei. Der Papagei antwortet sofort und ist perfekt für „Wo ist die Toilette?“. Die Eule braucht eine Minute, kritzelt Notizen, die niemand sieht, und prüft ihre eigene Arbeit, darum gewinnt sie bei kniffligen Mathe- und Planungsfragen. Die Eule kostet aber mehr pro Frage, also schickt die Bibliothekarin ihr nur die schweren.",
    },
    engineering: {
      text: "Reasoning-Modelle (OpenAIs o-Serie, Claude mit Extended Thinking, DeepSeek-R1, Gemini-Thinking-Modelle) sind mit Reinforcement Learning darauf trainiert, vor der Antwort eine lange interne Gedankenkette zu erzeugen. Sie schneiden bei Mathe, Code und mehrstufiger Planung deutlich besser ab, erzeugen aber viel mehr Ausgabe-Tokens, kosten also mehr und brauchen länger, vor allem bis zum ersten sichtbaren Wort. Den Aufwand steuerst du meist über ein Thinking-Budget oder eine Effort-Einstellung. Leite einfache Anfragen an ein Standardmodell und nur schwere an ein Reasoning-Modell.",
      pitfalls: [
        "Thinking-Tokens werden als Ausgabe-Tokens berechnet: Auch eine kurze Antwort kann teuer sein.",
        "Die Wartezeit bis zum ersten sichtbaren Wort ist viel länger; streame Fortschritt oder lass sie als Hintergrund-Jobs laufen.",
        "Sehr detaillierte Schritt-für-Schritt-Anweisungen können schaden; gib Ziel und Rahmen vor und lass das Modell planen.",
        "Die Parameter fürs Thinking-Budget heißen bei jedem Anbieter anders und ändern sich; prüf die aktuelle Doku.",
      ],
    },
    keywords: ["Denkmodelle", "langsam", "schwere Aufgaben"],
  },
  "llm-11": {
    name: "Strukturierte Ausgaben",
    official:
      "Zwing die Antwort in JSON, das zu deinem Schema passt, damit dein Code sie jedes Mal parsen kann.",
    kid: "Stell dir ein Formular mit Kästchen für Name, Alter und Farbe vor. Statt einen wirren Brief zu schreiben, muss der Computer jedes Kästchen ausfüllen, damit ein anderer Computer es lesen kann.",
    realWorld: {
      title: "Der Papagei füllt ein Formular aus",
      text: "Die Katalogmaschine der Bibliothek kann geschwätzige Antworten wie „Ach, das ist von Austen, ein schönes Buch!“ nicht lesen. Also gibt die Bibliothekarin dem Papagei ein Formular mit drei Kästchen: Titel, Autorin, Jahr. Er darf nur antworten, indem er die Kästchen ausfüllt, und ein Formular mit leerem oder falschem Kästchen kommt zurück. Jetzt kann die Katalogmaschine jede Antwort lesen.",
    },
    engineering: {
      text: "Strukturierte Ausgaben beschränken die Generierung auf ein JSON-Schema, entweder über den nativen JSON-Schema-Modus des Anbieters oder indem du einen Tool-Aufruf erzwingst, dessen Eingabeschema dein Zieltyp ist. Durch Constrained Decoding lässt sich die Antwort immer parsen und hat die nötigen Felder und Typen, was fragiles Regex-Parsing überflüssig macht. Definiere das Schema einmal mit Pydantic oder Zod, validiere das Ergebnis trotzdem und halte Schemas klein: Sehr große oder tief verschachtelte Schemas sind langsamer und fehleranfälliger.",
      pitfalls: [
        "Gültiges JSON ist nicht korrektes JSON: Die Werte können trotzdem falsch sein, prüf also auch die Bedeutung.",
        "Ein Schema, das eine Antwort erzwingt, lässt keinen Platz für „unbekannt“; ergänze nullable Felder oder eine Option „nicht gefunden“.",
        "Sehr große oder tief verschachtelte Schemas verlangsamen die Generierung und erhöhen die Fehlerquote.",
      ],
    },
    keywords: ["strukturiert", "Formular", "parsen"],
  },
  "llm-12": {
    official: "Nutze ein unverändertes Prompt-Präfix über mehrere Aufrufe wieder, um Kosten und Latenz zu senken.",
    kid: "Liest du jeden Morgen dieselbe lange Geschichte, legst du ein Lesezeichen hinein, statt neu anzufangen. Der Computer hält den Anfang einer langen Frage bereit, so gehen Wiederholungen schneller und billiger.",
    realWorld: {
      title: "Das Regelbuch bleibt offen auf dem Tisch",
      text: "Jeder Besucher der Rechtsabteilung fragt nach demselben 300-seitigen Regelbuch. Ohne Caching liest der Papagei das ganze Buch für jeden Besucher neu. Mit Caching lässt die Bibliothekarin das Regelbuch ein paar Minuten offen auf dem Tisch liegen: Der nächste Besucher fügt nur seine eigene Frage hinzu, die Antwort kommt schneller, und die Bibliothek zahlt viel weniger fürs Lesen.",
    },
    engineering: {
      text: "Prompt Caching speichert den verarbeiteten Zustand eines Prompt-Präfixes (System-Prompt, Tool-Definitionen, lange Dokumente, frühere Runden) beim Anbieter. Eine spätere Anfrage mit byte-identischem Präfix liest es aus dem Cache, statt es neu zu verarbeiten; diese Tokens kosten dann nur einen Bruchteil des normalen Eingabepreises, und die Zeit bis zum ersten Token sinkt. Manche Anbieter cachen ab einer Mindestlänge automatisch; Anthropic nutzt explizite cache_control-Breakpoints. Stell stabilen Inhalt nach vorne, variablen nach hinten, und beobachte die Cache-Felder in den Usage-Daten.",
      pitfalls: [
        "Jede Änderung im Präfix, selbst ein Zeitstempel oder eine umsortierte Tool-Liste, verfehlt den Cache.",
        "Caches laufen nach einigen Minuten ohne Nutzung ab; Apps mit wenig Traffic treffen sie selten.",
        "Das Schreiben in den Cache kann mehr kosten als eine normale Anfrage; es lohnt sich nur, wenn das Präfix wiederverwendet wird.",
      ],
    },
    keywords: ["Zwischenspeicher", "Präfix", "Kosten", "Latenz", "Wiederverwendung"],
  },
  "llm-13": {
    name: "Token-Preise",
    official:
      "Eingabe-, Ausgabe- und gecachte Tokens kosten unterschiedlich viel. Kenne deine Kosten pro Aufruf.",
    kid: "Ein Taxi kostet für jeden Kilometer, den du fährst. Der Computer kostet für jedes kleine Wortstück, das er liest und schreibt, und Schreiben kostet meist mehr als Lesen.",
    realWorld: {
      title: "Die Preisliste des Papageis",
      text: "Die Bibliothek bezahlt den Papagei pro Karteikarte. Eine Karte der Frage zu lesen ist billig, eine Karte der Antwort zu schreiben kostet ein Mehrfaches, und eine Karte erneut zu lesen, die schon offen auf dem Tisch liegt, kostet fast nichts. Wer ein ganzes Buch einfügt und eine einzeilige Antwort will, zahlt vor allem fürs Lesen; wer einen langen Aufsatz will, vor allem fürs Schreiben.",
    },
    engineering: {
      text: "Anbieter berechnen Eingabe-Tokens, Ausgabe-Tokens und gecachte Eingabe-Tokens getrennt, angegeben pro Million Tokens. Ausgabe kostet typischerweise ein Mehrfaches der Eingabe, und Reasoning- oder Thinking-Tokens zählen als Ausgabe. Die Kosten pro Aufruf sind Eingabe-Tokens mal Eingabepreis plus Ausgabe-Tokens mal Ausgabepreis, angepasst um Cache-Lese- und Schreibvorgänge. Logge das Usage-Objekt jeder Antwort, berechne Kosten pro Anfrage und pro Feature und alarmiere bei Ausreißern, denn eine einzige Prompt-Änderung kann die Rechnung über Nacht vervielfachen.",
      pitfalls: [
        "Die Ausgabe ist die teure Seite: Bitte um kürzere Antworten, bevor du Prompts kürzt.",
        "Preise unterscheiden sich pro Modell und ändern sich oft; leg sie in die Konfiguration, nicht in den Code.",
        "Lange Gespräche senden jede frühere Nachricht erneut, daher kostet jede neue Runde mehr als die letzte.",
      ],
    },
    keywords: ["Preise", "Kosten", "Eingabe", "Ausgabe", "Budget", "Rechnung"],
  },
  "llm-14": {
    name: "Halluzinationen",
    official:
      "Selbstbewusste, aber falsche Antworten. Reduziere sie mit Grounding, Quellenangaben und der Erlaubnis, „Ich weiß es nicht“ zu sagen.",
    kid: "Manchmal erfindet ein Freund eine Antwort, damit er nicht dumm dasteht. Computer machen das auch, darum geben wir ihnen das richtige Buch und erlauben ihnen zu sagen: Ich weiß es nicht.",
    realWorld: {
      title: "Der Papagei, der nie „Ich weiß es nicht“ sagt",
      text: "Besucher lieben den Papagei, weil er immer antwortet. Fragt man ihn aber nach einem Buch, das die Bibliothek nicht hat, erfindet er Titel, Autor und sogar eine Seitenzahl, völlig selbstsicher. Die Bibliothekarin behebt das auf drei Arten: Sie legt das echte Buch auf den Tisch (Grounding), lässt ihn auf die genutzte Seite zeigen (Quellenangaben) und lobt ihn, wenn er „Ich weiß es nicht“ sagt.",
    },
    engineering: {
      text: "LLMs erzeugen die plausibelste Fortsetzung, keine geprüften Fakten, daher können sie flüssige, selbstsichere und falsche Aussagen machen: erfundene Quellen, APIs, Zahlen oder Ereignisse. Gegenmittel: Antworten in abgerufenen Quellen verankern (RAG), Quellenangaben zu bestimmten Passagen verlangen, „Ich weiß es nicht“ ausdrücklich erlauben, niedrige Temperature für Faktenaufgaben und Ausgaben mit Regeln oder einem LLM-Judge auf Faithfulness prüfen. Miss die Halluzinationsrate an einem Golden Dataset, statt Stichproben zu vertrauen.",
      pitfalls: [
        "Grounding reduziert Halluzinationen, beseitigt sie aber nicht; Modelle können die Quelle trotzdem falsch lesen.",
        "Selbstsichere Formulierungen sagen nichts über Richtigkeit.",
        "Erfundene Paketnamen in generiertem Code sind ein echtes Sicherheitsrisiko; prüf, ob die Abhängigkeiten existieren.",
      ],
    },
    keywords: ["Halluzination", "erfunden", "falsche Antworten", "Quellen", "weiß nicht"],
  },
  "llm-15": {
    name: "Multimodale Eingaben",
    official: "Bilder, PDFs oder Audio zusammen mit Text an das Modell schicken.",
    kid: "Du kannst dein kaputtes Fahrrad mit Worten beschreiben oder einfach ein Foto zeigen. Manche Computer können Bilder ansehen, ganze Seiten lesen und Geräusche hören, nicht nur getippte Wörter.",
    realWorld: {
      title: "Dem Papagei ein Foto zeigen",
      text: "Ein Besucher hält ein Foto eines zerknitterten Kassenbons hoch und fragt: „Wie viel habe ich für Obst ausgegeben?“ Ein Papagei, der nur getippte Wörter liest, kommt nicht weiter. Einer, der auch Bilder ansehen kann, liest den Bon, findet die Äpfel und Bananen und rechnet sie zusammen. Manche Papageien können auch eine Sprachnachricht anhören oder ein ganzes PDF durchblättern.",
    },
    engineering: {
      text: "Multimodale Modelle akzeptieren Bilder, PDFs und manchmal Audio oder Video neben Text in derselben Nachricht. Jedes Bild und jede Seite wird in Tokens umgewandelt, ein großes Bild kann also so viel kosten wie Hunderte oder Tausende Wörter; skaliere auf das, was die Aufgabe braucht. Typische Einsätze: Extraktion aus Dokumenten und Belegen, Diagramme lesen, Screenshot-Debugging und UI-Checks. Stell das Bild vor die Frage, gib pro Aufruf eine Aufgabe und kombiniere es mit strukturierten Ausgaben für verlässliche Extraktion.",
      pitfalls: [
        "Bilder werden als Tokens berechnet; große Bilder und viele PDF-Seiten werden schnell teuer.",
        "Kleine Schrift, Handschrift und dichte Tabellen werden weniger zuverlässig gelesen; schneide den wichtigen Teil aus und vergrößere ihn.",
        "Auch Bilder können Anweisungen verstecken: Behandle sie als nicht vertrauenswürdige Eingabe.",
      ],
    },
    keywords: ["Bilder", "Foto", "Sehen", "Audio"],
  },
  "llm-16": {
    name: "Fine-Tuning mit LoRA",
    official:
      "Trainiere kleine Adapter-Matrizen statt aller Gewichte. Ein günstiger Weg, ein Modell zu spezialisieren.",
    kid: "Statt ein ganzes Fahrrad neu zu bauen, damit es schneller fährt, klemmst du einen kleinen Motor dran. LoRA klemmt kleine neue Teile an ein großes Modell und trainiert nur diese: schnell und billig.",
    realWorld: {
      title: "Klebezettel in den Büchern des Papageis",
      text: "Dem Papagei medizinische Wörter beizubringen, indem man jedes Buch der Bibliothek neu schreibt, würde Jahre dauern. Stattdessen legt die Bibliothekarin in jedes Regal einen dünnen Stapel Klebezettel, die leicht verändern, wie der Papagei es liest. Nur die Zettel werden geschrieben und trainiert; die Bücher bleiben unberührt. Tausch die Zettel aus, und derselbe Papagei wird zum Rechts- oder Kochexperten.",
    },
    engineering: {
      text: "LoRA (Low-Rank Adaptation) friert die vortrainierte Gewichtsmatrix W ein und lernt ein Low-Rank-Update B·A, wobei A r×d und B d×r ist, mit kleinem Rang r (oft 8-64). Für eine 4096×4096-Projektion trainiert Rang 16 etwa 131k Parameter statt 16,8 Millionen, also unter 1 %. Adapter sind kleine Dateien, die sich in die Basisgewichte mergen oder beim Serving pro Aufgabe oder Kunde austauschen lassen. Nutze Fine-Tuning für Stil, Format oder eine eng umrissene Fähigkeit; nutze RAG für Fakten, die sich ändern.",
      pitfalls: [
        "Fine-Tuning lehrt Verhalten und Stil gut, neue Fakten schlecht; Fakten gehören in RAG.",
        "Ein paar hundert saubere, einheitliche Beispiele schlagen Tausende verrauschte.",
        "Vergleiche immer mit dem Basismodell auf einem zurückgehaltenen Set; ein Modell schlechter zu machen ist leicht.",
      ],
    },
    keywords: ["Feinabstimmung", "Adapter", "Training", "spezialisieren"],
  },
  "llm-17": {
    official: "LoRA auf einem 4-Bit-quantisierten Basismodell, damit Fine-Tuning auf eine GPU passt.",
    kid: "Damit ein riesiges Puzzle auf einen kleinen Tisch passt, verkleinerst du erst das Bild und legst dann deine kleinen Änderungen obendrauf. QLoRA presst ein großes Modell zusammen, damit Training auf einen Computer passt.",
    realWorld: {
      title: "Bücher im Taschenformat mit Klebezetteln",
      text: "Die ganze Bibliothek passt nicht in den kleinen Arbeitsraum der Bibliothekarin. Also druckt sie jedes Buch als winzige Taschenausgabe (4-Bit-Quantisierung), die ein Viertel des Platzes braucht, und klebt wie gewohnt ihre Zettel (LoRA) darauf. Die Taschenbücher sind etwas schwerer zu lesen, aber jetzt passt alles auf einen Tisch, und die Zettel werden fast genauso gut.",
    },
    engineering: {
      text: "QLoRA lädt das eingefrorene Basismodell in 4-Bit-NF4-Quantisierung, ergänzt LoRA-Adapter in 16 Bit und propagiert die Gradienten durch die quantisierten Gewichte in die Adapter. Double Quantization und Paged Optimizers sparen weiteren Speicher. So lässt sich ein 7-8B-Modell auf einer einzigen 24-GB-Consumer-GPU fine-tunen; das Original-Paper hat ein 65B-Modell auf einer einzelnen 48-GB-GPU trainiert, mit einer Qualität nahe an 16-Bit-LoRA. Jeder Schritt ist langsamer, weil die Gewichte im Flug dequantisiert werden.",
      pitfalls: [
        "Merge die Adapter fürs Deployment in das 16-Bit-Basismodell, nicht in das 4-Bit-Modell.",
        "Trainingsschritte sind langsamer als mit 16-Bit-LoRA.",
        "4-Bit-Training mit bitsandbytes braucht eine unterstützte GPU, in der Praxis meist NVIDIA.",
      ],
    },
    keywords: ["4 Bit", "eine GPU", "Speicher", "Feinabstimmung"],
  },
  "llm-18": {
    name: "Quantisierung",
    official:
      "Gewichte mit weniger Bits speichern (8 Bit, 4 Bit), um Speicher zu sparen und schneller zu laufen, bei kleinem Qualitätsverlust.",
    kid: "Ein Bild mit weniger Farben braucht weniger Platz und sieht trotzdem fast gleich aus. Quantisierung speichert die Zahlen des Modells einfacher, so wird es kleiner und schneller.",
    realWorld: {
      title: "Die Notizen des Papageis runden",
      text: "Das Gehirn des Papageis steckt voller sehr genauer Zahlen wie 0,4817263. Jede einzelne voll auszuschreiben füllt ganze Regale. Rundet die Bibliothekarin auf 0,48, schrumpfen die Bücher auf die Hälfte; rundet sie auf 0,5, auf ein Viertel. Der Papagei spricht fast genauso gut, aber rundet sie zu stark, fängt er an zu nuscheln.",
    },
    engineering: {
      text: "Quantisierung speichert Gewichte (und manchmal Aktivierungen oder den KV-Cache) mit weniger Bits: Von 16 auf 8 Bit halbiert sich der Speicher, mit 4 Bit viertelt er sich. Ein 7B-Modell braucht etwa 14 GB in fp16, 7 GB in 8 Bit und rund 4 GB in 4 Bit. Post-Training-Verfahren wie GPTQ, AWQ und die GGUF-Formate von llama.cpp und Ollama halten den Qualitätsverlust bis etwa 4 Bit klein; darunter fällt er schnell. Kleinere Gewichte bedeuten auch schnellere Generierung, weil Inferenz meist durch die Speicherbandbreite begrenzt ist.",
      pitfalls: [
        "Der Qualitätsverlust hängt von der Aufgabe ab: Teste mit deinem eigenen Eval-Set, nicht nur mit Leaderboard-Werten.",
        "Die Gewichte sind nicht der ganze Speicherbedarf; der KV-Cache wächst mit Kontextlänge und Batch-Größe.",
        "Unter 4 Bit werden die meisten Modelle deutlich schlechter.",
      ],
    },
    keywords: ["Quantisierung", "Speicher", "Kompression", "runden"],
  },
  "llm-19": {
    name: "Destillation",
    official: "Trainiere ein kleines „Schüler“-Modell, die Antworten eines großen „Lehrer“-Modells nachzuahmen.",
    kid: "Ein junger Koch schaut einem großen Küchenchef immer wieder zu und lernt, dieselben Gerichte zu kochen. Ein kleines Computerhirn lernt, indem es die Antworten eines großen nachmacht, und wird schnell und billig.",
    realWorld: {
      title: "Die Eule unterrichtet einen jungen Papagei",
      text: "Die sorgfältige Eule gibt hervorragende Antworten, ist aber langsam und teuer. Also stellt die Bibliothek ihr zehntausend typische Fragen und schreibt alle Antworten in ein Buch. Ein junger Papagei wird mit diesem Antwortbuch trainiert, bis er genauso antwortet. Er ist nicht in allem so weise wie die Eule, aber bei den Alltagsfragen der Bibliothek fast so gut und um ein Vielfaches schneller.",
    },
    engineering: {
      text: "Knowledge Distillation trainiert ein kleineres Schüler-Modell darauf, ein größeres Lehrer-Modell nachzuahmen. Klassische Destillation gleicht die gesamte Wahrscheinlichkeitsverteilung der Lehrer-Ausgabe ab (Soft Labels); bei API-Modellen destillierst du meist auf erzeugten Ausgaben und fine-tunest den Schüler mit Prompt-Antwort-Paaren des Lehrers. Das klappt am besten bei einer engen, klar definierten Aufgabe, bei der ein kleines Modell für einen Bruchteil der Kosten und Latenz nah an ein Frontier-Modell herankommt. Prüf die Nutzungsbedingungen des Lehrer-Anbieters: Manche verbieten, Ausgaben zum Training konkurrierender Modelle zu nutzen.",
      pitfalls: [
        "Der Schüler kopiert auch die Fehler des Lehrers; bereinige oder prüfe die Trainingsdaten.",
        "Ein destilliertes Modell ist nur bei der Aufgabe stark, für die es destilliert wurde.",
        "Manche Modelllizenzen und API-Bedingungen verbieten das Training auf ihren Ausgaben.",
      ],
    },
    keywords: ["Destillation", "Lehrer", "Schüler", "kleineres Modell", "billiger"],
  },
  "llm-20": {
    name: "Offene vs. geschlossene Modelle",
    official:
      "Offene Gewichte, die du selbst hosten kannst (Llama, Qwen, Mistral), vs. reine API-Modelle (GPT, Claude, Gemini).",
    kid: "Manches Spielzeug darfst du mit nach Hause nehmen, aufschrauben und umbauen, anderes nur im Laden benutzen. Offene Modelle betreibst du selbst, geschlossene nutzt du über den Dienst einer Firma.",
    realWorld: {
      title: "Einen Papagei kaufen oder mieten",
      text: "Die Bibliothek kann einen eigenen Papagei kaufen (offene Gewichte): Er wohnt im Haus, geht nie weg und darf frei umtrainiert werden, braucht aber Käfig, Futter und Pfleger. Oder sie mietet den klügsten Papagei der Welt per Telefon (geschlossene API): kein Käfig zum Putzen und immer die neueste Version, aber jede Frage verlässt das Haus, und der Besitzer bestimmt den Preis.",
    },
    engineering: {
      text: "Open-Weight-Modelle (Llama, Qwen, Mistral, Gemma, DeepSeek) lassen sich herunterladen, fine-tunen und auf eigener Hardware oder bei einem Host deiner Wahl betreiben: Datenkontrolle, tiefe Anpassung und planbare Kosten bei hohem Volumen, dafür betreibst du GPUs und Betrieb selbst. Geschlossene Modelle (GPT, Claude, Gemini) gibt es nur per API; sie führen meist bei den schwersten Aufgaben, brauchen keine Infrastruktur und rechnen pro Token ab. Viele Produkte mischen beides: ein geschlossenes Modell für schwere Anfragen, ein offenes für hohes Volumen, private oder Offline-Arbeit. „Open Weights“ ist nicht immer Open Source: Lies die Lizenz.",
      pitfalls: [
        "Selbst hosten ist nur bei gleichmäßig hohem Volumen billiger; ungenutzte GPUs kosten trotzdem Geld.",
        "Open-Weight-Lizenzen können kommerzielle Nutzung oder Nutzerzahlen einschränken; lies sie.",
        "Geschlossene Modelle wechseln die Version; pinne Modell-IDs und lass deine Evals beim Upgrade erneut laufen.",
      ],
    },
    keywords: ["offen", "geschlossen", "selbst hosten", "Datenschutz", "Lizenz"],
  },
};

export default concepts;
