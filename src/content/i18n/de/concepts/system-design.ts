import type { ConceptTranslations } from "../../types";

/** Bereich KI-Systemdesign auf Deutsch. Szene: eine volle Restaurantküche. */
const concepts: ConceptTranslations = {
  "system-design-01": {
    name: "Model-Routing",
    official: "Einfache Anfragen gehen an ein billiges, schnelles Modell, schwere an ein starkes Modell.",
    kid: "In einer Restaurantküche macht der junge Helfer das einfache Sandwich und die Chefköchin die feinen Gerichte. Model-Routing schickt leichte Fragen an ein kleines, billiges Modell und schwere an ein starkes.",
    realWorld: {
      title: "Nicht jede Bestellung braucht die Chefköchin",
      text: "Unser Restaurant hat eine brillante, teure Chefköchin und drei schnelle Küchenhelfer. Macht die Chefköchin jeden Toast und jeden Salat, stapeln sich die Bestellungen, und die Lohnkosten explodieren. Also liest die Person am Pass jeden Bon: Toast und Salate gehen an die Helfer, das Degustationsmenü an die Chefköchin. Die Gäste bekommen dort Qualität, wo es zählt, schneller und billiger.",
    },
    engineering: {
      text: "Model-Routing wählt pro Anfrage ein Modell: kleine, schnelle, billige Modelle für einfache Aufgaben (Klassifikation, Extraktion, kurze FAQ-Antworten, Umformulieren) und Frontier-Modelle für schweres Reasoning, langen Kontext oder folgenreiche Antworten. Router nutzen Regeln (Aufgabentyp, Eingabelänge, Nutzerstufe), einen kleinen Klassifikator oder ein LLM, das die Schwierigkeit einschätzt, oder eine Kaskade, die erst das billige Modell versucht und eskaliert, wenn Konfidenz oder Validierung scheitern. Miss die Qualität pro Route mit Evals; Routing senkt die Kosten meist um ein Vielfaches bei geringem Qualitätsverlust.",
      pitfalls: [
        "Ein Router, der selbst ein teurer Modellaufruf ist, kann die Ersparnis auffressen; bevorzuge Regeln und kleine Klassifikatoren.",
        "Routing ohne Evals pro Route versteckt Qualitätsverluste auf dem billigen Weg.",
        "Nutzer bemerken uneinheitlichen Ton oder Format zwischen Modellen; gleiche Prompts und Ausgabeformate an.",
      ],
    },
    keywords: ["Routing", "Weiterleitung", "billiges Modell", "Kaskade"],
  },
  "system-design-02": {
    name: "Modell-Fallbacks",
    official:
      "Fällt ein Anbieter aus oder läuft in einen Timeout, versuch es erneut mit einem Ersatzmodell oder -anbieter.",
    kid: "Geht beim Abendessen der Hauptofen kaputt, wechselt eine gute Küche zum Ersatzofen, damit die Gäste ihren Kuchen trotzdem bekommen. Modell-Fallbacks wechseln zu einem Ersatzmodell, wenn das Hauptmodell ausfällt.",
    realWorld: {
      title: "Der Ersatzofen",
      text: "Mitten an einem vollen Samstag gibt der Hauptofen den Geist auf. Eine Küche ohne Plan schickt die Gäste heim. Unsere Küche hat einen kleineren Ersatzofen und eine Abmachung mit der Bäckerei nebenan. Die Regel an der Wand: Heizt der Ofen nicht innerhalb von zwei Minuten, wird gewechselt. Gerichte aus dem Ersatzofen sehen etwas anders aus, aber niemand geht hungrig nach Hause.",
    },
    engineering: {
      text: "Modell-Fallbacks halten ein KI-Feature am Laufen, wenn ein Anbieter einen Ausfall, eine Überlastung (429, 503, 529), einen Timeout oder ein regionales Problem hat: Nach begrenzten Wiederholungen geht die Anfrage an ein Ersatzmodell desselben Anbieters, dasselbe Modell in einer anderen Cloud (Bedrock, Vertex) oder einen anderen Anbieter. Gateways wie LiteLLM, Portkey oder OpenRouter setzen Fallback-Ketten, Timeouts und Circuit Breaker um. Halte Prompts und Ausgabeschemas portabel, evaluiere den Ersatzweg und logge, welches Modell tatsächlich geantwortet hat.",
      pitfalls: [
        "Ein Ersatzweg, der nie getestet wird, versagt, wenn du ihn brauchst; schick etwas Traffic darüber oder teste ihn regelmäßig.",
        "Lange Timeouts vor dem Umschalten lassen Nutzer doppelt warten; nutze Timeouts auf Basis der Zeit bis zum ersten Token.",
        "Verschiedene Modelle brauchen leicht unterschiedliche Prompts; prüf die Ausgabeschemas auf jedem Weg.",
      ],
    },
    keywords: ["Fallback", "Ausfall", "Ersatzmodell", "Ausfallsicherheit"],
  },
  "system-design-03": {
    name: "Semantisches Caching",
    official: "Gib eine gespeicherte Antwort zurück, wenn eine neue Frage dasselbe bedeutet wie eine alte.",
    kid: "Bestellen viele Gäste dieselbe Suppe, hält die Küche einen Topf bereit, statt jede Schüssel neu zu kochen. Semantisches Caching nutzt eine gespeicherte Antwort, wenn eine neue Frage dasselbe meint wie eine alte.",
    realWorld: {
      title: "Ein Topf Suppe steht schon auf dem Herd",
      text: "Gäste bestellen „die Suppe von heute“, „die Tagessuppe“ und „irgendeine Suppe, die ihr habt“. Andere Worte, gleiche Bestellung. Statt jede Schüssel neu zu kochen, hält die Küche einen Topf bereit und serviert allen dreien dieselbe Suppe. Bestellt ein Gast aber „Suppe ohne Zwiebeln“, wäre der Topf falsch, also hört der Kellner genau hin, bevor er schöpft.",
    },
    engineering: {
      text: "Ein semantischer Cache bettet jede eingehende Frage ein, durchsucht früher beantwortete Fragen per Vektor-Ähnlichkeit und gibt die gespeicherte Antwort zurück, wenn die Ähnlichkeit eine Schwelle überschreitet, ohne das LLM aufzurufen. Anders als exaktes Caching erkennt er Umformulierungen, kann aber falsche Antworten für Fragen liefern, die ähnlich aussehen, sich aber unterscheiden (Daten, Verneinungen, Namen, Mandanten). Stimme die Schwelle an gelabelten Paaren ab, trenne den Cache pro Mandant und Prompt-Version, setz TTLs und nutze ihn vor allem für FAQ-artigen, nicht-persönlichen Traffic.",
      pitfalls: [
        "Ähnlich aussehende Fragen können verschiedene Antworten brauchen („storniere meine Bestellung“ vs. „storniere meine Bestellung nicht“).",
        "Ein Cache, den Nutzer oder Mandanten teilen, kann private Antworten preisgeben.",
        "Antworten veralten, wenn sich Dokumente ändern; lass Einträge ablaufen und leere sie beim Neu-Einlesen.",
      ],
    },
    keywords: ["Cache", "semantisch", "Ähnlichkeit", "wiederverwenden"],
  },
  "system-design-04": {
    official:
      "Nutze die Berechnung für einen gemeinsamen Prompt-Anfang wieder (gleicher System-Prompt, gleiches Dokument).",
    kid: "Jede Pizza beginnt mit demselben Teig und derselben Soße, also bereitet die Küche diesen Boden einmal vor und gibt nur noch den Belag dazu. Prefix Caching nutzt die Arbeit für denselben Anfang vieler Fragen wieder.",
    realWorld: {
      title: "Derselbe Pizzaboden, fertig vorbereitet",
      text: "Jede Pizza auf unserer Karte beginnt mit demselben Teig, derselben Soße und demselben Käse. Diesen Boden für jede Bestellung neu zu machen, kostet den Koch den Großteil seiner Zeit. Also hält die Küche Böden bereit, und pro Bestellung kommt nur noch der Belag drauf. Der Trick klappt nur, wenn der Boden exakt gleich ist und zuerst kommt; ändere eine Zutat ganz unten, und die ganze Pizza muss frisch gemacht werden.",
    },
    engineering: {
      text: "Prefix Caching (beim Anbieter: Prompt Caching) speichert den berechneten Zustand des Modells (den KV-Cache) für den Anfang eines Prompts, sodass Anfragen mit identischem Präfix (System-Prompt, Tool-Definitionen, ein langes Dokument, Gesprächsverlauf) die Neuberechnung überspringen. Das senkt die Zeit bis zum ersten Token und die Eingabekosten: Anbieter berechnen für gecachte Eingabe-Tokens nur einen Bruchteil des normalen Preises. Stell stabilen Inhalt nach vorne und variablen nach hinten, halte das Präfix byte-identisch und beobachte die Cache-Hit-Metriken. vLLM und SGLang machen bei selbst gehosteten Modellen automatisches Prefix Caching.",
      pitfalls: [
        "Ein Zeitstempel oder Nutzername oben im Prompt ändert das Präfix und verhindert jeden Cache-Treffer.",
        "Caches laufen nach einigen Minuten Inaktivität ab; Features mit wenig Traffic treffen sie selten.",
        "Das Schreiben in den Cache kann mehr kosten als eine normale Anfrage; es lohnt sich nur bei Wiederverwendung des Präfixes.",
      ],
    },
    keywords: ["Präfix", "Cache", "KV-Cache", "Zeit bis zum ersten Token"],
  },
  "system-design-05": {
    name: "Token-Budgets",
    official: "Begrenze Eingabe- und Ausgabe-Tokens pro Anfrage, pro Nutzer oder pro Feature.",
    kid: "Die Küche gibt jedem Tisch ein Limit: höchstens drei Gerichte, damit ein hungriger Tisch nicht alles aufisst. Token-Budgets legen fest, wie viel jede Frage, jede Person oder jedes Feature verbrauchen darf.",
    realWorld: {
      title: "Ein Limit pro Tisch",
      text: "An einem Abend bestellte ein Tisch die ganze Nacht „noch ein Gericht“, und um zehn war für alle anderen nichts mehr da. Jetzt bekommt jeder Tisch eine Karte: drei Gerichte pro Bestellung, zehn pro Abend. Große Gruppen können bei der Chefin eine größere Karte beantragen. Die Küche kann planen, niemand bekommt eine Überraschungsrechnung, und kein Tisch kann je den Kühlschrank leeren.",
    },
    engineering: {
      text: "Token-Budgets begrenzen den Verbrauch auf mehreren Ebenen: max_tokens pro Antwort, eine maximale Eingabegröße pro Anfrage (übergroßen Kontext kürzen oder ablehnen), Tages- oder Monatslimits pro Nutzer oder Mandant und Limits pro Feature oder Agent-Lauf für Tokens, Schritte und Geld. Budgets verhindern außer Kontrolle geratene Agent-Schleifen, Missbrauch und Überraschungsrechnungen und machen Kosten planbar. Zähle Tokens vor dem Senden, verfolge den Verbrauch aus der Antwort, setz Limits atomar in einem gemeinsamen Speicher durch und sag Nutzern klar, wenn sie ein Limit erreichen.",
      pitfalls: [
        "Agenten ohne Gesamtbudget können stundenlang kreisen; begrenze Schritte, Tokens und Geld pro Lauf.",
        "Ein zu kleines max_tokens schneidet Antworten mitten im Satz ab; prüf stop_reason und behandle es.",
        "Budgets, die pro Instanz statt in einem gemeinsamen Speicher gelten, lassen sich leicht überschreiten.",
      ],
    },
    keywords: ["Budget", "Limit", "max_tokens", "Verbrauch"],
  },
  "system-design-06": {
    name: "Gestreamte Antworten",
    official: "Schick Tokens an den Nutzer, während sie erzeugt werden, damit sich die App schnell anfühlt.",
    kid: "Ein guter Kellner bringt erst das Brot, dann die Suppe, dann das Hauptgericht, damit du nie vor einem leeren Tisch sitzt. Gestreamte Antworten schicken eine Antwort Wort für Wort, während sie entsteht.",
    realWorld: {
      title: "Erst das Brot, dann die Gänge",
      text: "In einem Restaurant wartet der Kellner, bis alle drei Gänge fertig sind, und serviert nach vierzig Minuten alles auf einmal. Die Gäste denken, die Küche hat sie vergessen. Bei uns kommt das Brot nach zwei Minuten, bald danach die Suppe, dann der Hauptgang. Die Kochzeit insgesamt ist dieselbe, aber die Gäste fühlen sich die ganze Zeit umsorgt, und sind sie nach der Suppe satt, hört die Küche auf zu kochen.",
    },
    engineering: {
      text: "Gestreamte Antworten schicken Ausgabe-Tokens an den Client, während sie erzeugt werden, meist per Server-Sent Events, sodass Nutzer nach der Zeit bis zum ersten Token zu lesen beginnen, statt auf die ganze Antwort zu warten. Plane es durchgängig: Streaming-APIs des Anbieters, ein Backend, das Chunks ohne Puffern weiterreicht, eine UI, die halbfertiges Markdown, Quellen oder JSON schrittweise rendert, und ein Abbruch, der die Generierung (und Abrechnung) stoppt, wenn der Nutzer geht oder auf Stopp drückt. Logge den finalen Text und den Verbrauch, sobald der Stream endet.",
      pitfalls: [
        "Wer bei getrenntem Client nicht upstream abbricht, generiert und bezahlt weiter, für niemanden.",
        "Halbfertiges Markdown oder JSON naiv zu rendern, lässt die UI flackern oder kaputtgehen; parse inkrementell.",
        "Moderation und Validierung sind mitten im Stream schwieriger; leg fest, was vorher und nachher geprüft wird.",
      ],
    },
    keywords: ["Streaming", "SSE", "Wort für Wort"],
  },
  "system-design-07": {
    name: "Zeit bis zum ersten Token",
    official: "Die Wartezeit, bis das erste Wort erscheint. Das spüren Nutzer als Geschwindigkeit.",
    kid: "Setzt du dich ins Restaurant, merkst du vor allem, wie lange es bis zum ersten Teller dauert. Die Zeit bis zum ersten Token ist diese Wartezeit: wie lange es dauert, bis das erste Wort einer Antwort erscheint.",
    realWorld: {
      title: "Wie lange bis zum ersten Teller?",
      text: "Gäste stoppen nicht das ganze Abendessen; sie erinnern sich, wie lange sie vor einem leeren Tisch saßen. Also verfolgt unsere Chefin eine Zahl: Minuten von der Bestellung bis zum ersten Teller. Sie hängt von der Schlange in der Küche ab, davon, wie lange der Koch eine komplizierte Bestellung liest, und von Vorarbeiten wie Zutaten aus dem Keller holen. Verkürze irgendetwas davon, und das Restaurant fühlt sich schneller an.",
    },
    engineering: {
      text: "Die Zeit bis zum ersten Token (TTFT) ist die Verzögerung zwischen dem Absenden einer Anfrage und dem Empfang des ersten Ausgabe-Tokens. Beim Streaming ist das die Latenz, die Nutzer am meisten spüren. Sie setzt sich zusammen aus Netzwerkzeit, Warteschlange beim Anbieter oder deinem Server, Arbeit vor dem Aufruf (Retrieval, Reranking, Tool-Aufrufe, Guardrails) und Prefill: der Verarbeitung aller Eingabe-Tokens, die mit der Prompt-Länge wächst. Senke sie mit kürzeren oder gecachten Prompts (Prefix Caching), schnelleren oder kleineren Modellen, parallelen Vorschritten, regionalen Endpunkten und genug Serving-Kapazität. Verfolge sie als Perzentil.",
      pitfalls: [
        "Wer nur die Gesamtlatenz misst, übersieht, dass Nutzer vor jedem Text auf Retrieval- und Tool-Schritte warten.",
        "Lange System-Prompts und vollgestopfter Kontext blähen die Prefill-Zeit auf; kürze oder cache sie.",
        "Reasoning-Modelle denken vor der Antwort nach, die TTFT kann also lang sein; zeig in der Zwischenzeit Fortschritt.",
      ],
    },
    keywords: ["TTFT", "Wartezeit", "erstes Wort", "Prefill"],
  },
  "system-design-08": {
    name: "Durchsatz vs. Latenz",
    official:
      "Mehr Anfragen pro Sekunde (große Batches) gegenüber einer schnelleren Einzelantwort. Du tauschst das eine gegen das andere.",
    kid: "Eine Küche kann ein Essen perfekt schnell kochen oder vierzig auf einmal, damit pro Stunde mehr Leute essen, aber jedes dauert länger. Durchsatz gegen Latenz heißt, zwischen beidem zu wählen.",
    realWorld: {
      title: "Ein schneller Teller oder vierzig pro Stunde?",
      text: "Kocht die Köchin einen Teller nach dem anderen, bekommt jeder Gast sein Essen in acht Minuten, aber pro Stunde werden nur wenige Gäste satt. Füllt sie den ganzen Herd mit vierzig Pfannen, bedient die Küche pro Stunde viel mehr Gäste, aber jeder Teller dauert etwas länger, weil sie zwischen den Pfannen hin und her geht. Ein ruhiges Café wählt schnelle Teller, ein Hochzeitscaterer viele Teller. Beide liegen für ihre Gäste richtig.",
    },
    engineering: {
      text: "Latenz ist, wie lange eine Anfrage dauert (Zeit bis zum ersten Token, Zeit pro Ausgabe-Token, Gesamtzeit); Durchsatz ist, wie viel Arbeit das System pro Zeiteinheit erledigt (Anfragen oder Tokens pro Sekunde). Auf GPUs erhöht das Bündeln mehrerer gleichzeitiger Anfragen den Durchsatz und senkt die Kosten pro Token, aber jede Anfrage wird langsamer, weil sie sich die Rechenleistung teilen. Wähle Arbeitspunkte pro Workload: Interaktiver Chat braucht niedrige Latenz mit mäßigem Batching, Offline-Jobs maximieren den Durchsatz. Stimme ab mit maximaler Batch-Größe, Nebenläufigkeitslimits und getrennten Deployments pro Workload.",
      pitfalls: [
        "Mit einem Nutzer benchmarken und dann Hunderte bedienen ergibt ein falsches Bild; teste mit realer Nebenläufigkeit.",
        "Den durchschnittlichen Durchsatz zu optimieren kann die p95-Latenz für interaktive Nutzer sprengen.",
        "Interaktiven und Massen-Traffic auf einem Deployment zu mischen lässt Batch-Jobs Live-Nutzer ausbremsen.",
      ],
    },
    keywords: ["Durchsatz", "Latenz", "Batching", "Abwägung"],
  },
  "system-design-09": {
    name: "Inference-Serving mit vLLM",
    official: "Ein Open-Source-Server, der offene Modelle schnell auf deinen eigenen GPUs laufen lässt.",
    kid: "Statt jeden Tag Essen zu bestellen, richtest du eine eigene Küche mit einem super organisierten Koch ein. vLLM ist dieser Koch, der offene Modelle schnell auf deinen eigenen Computern laufen lässt.",
    realWorld: {
      title: "Die eigene Küche mit einem super organisierten Koch",
      text: "Jeden Abend zu bestellen ist bequem, summiert sich aber, und die Rezepte kannst du nicht ändern. Also eröffnet die Firma eine eigene Küche. Die ist langsam, wenn der Koch ein Gericht nach dem anderen macht, also stellt sie einen für seine Organisation berühmten Koch ein: Dutzende Bestellungen gleichzeitig auf dem Herd, kein verschwendeter Platz und eine Karte, die genau wie die des Restaurants aussieht, damit Kellner nichts neu lernen müssen.",
    },
    engineering: {
      text: "vLLM ist ein Open-Source-Inference-Server für Open-Weight-Modelle auf eigenen GPUs. Er kombiniert Continuous Batching, Speicherverwaltung mit PagedAttention, Prefix Caching, Unterstützung für Quantisierung (AWQ, GPTQ, FP8), Tensor- und Pipeline-Parallelität, Speculative Decoding und strukturierte Ausgabe und bietet eine OpenAI-kompatible API, sodass bestehender Client-Code mit geänderter Base-URL funktioniert. Alternativen sind SGLang, TensorRT-LLM, TGI und llama.cpp. Selbst hosten bringt Kontrolle, Datenschutz und bei großer Skala womöglich niedrigere Kosten, aber Kapazitätsplanung und Betrieb liegen bei dir.",
      pitfalls: [
        "Selbst hosten heißt, GPUs, Skalierung, Upgrades und Bereitschaftsdienst selbst zu tragen; vergleiche Gesamtkosten, nicht nur Token-Preise.",
        "Die maximale Kontextlänge bestimmt den KV-Cache-Speicher; setz sie auf das Nötige, nicht auf das Maximum des Modells.",
        "Offene Modelle unterscheiden sich in Chat-Templates und Tool-Call-Formaten; teste sie mit deinen Prompts und Evals.",
      ],
    },
    keywords: ["selbst hosten", "Inference-Server", "eigene GPUs"],
  },
  "system-design-10": {
    official:
      "Neue Anfragen steigen bei jedem Schritt in den laufenden Batch ein, statt zu warten, bis der Batch fertig ist.",
    kid: "Ein schlauer Koch wartet nicht, bis jede Pfanne fertig ist; sobald ein Gericht auf dem Teller liegt, kommt eine neue Bestellung an diesen Platz. Continuous Batching hält so jeden Platz beschäftigt.",
    realWorld: {
      title: "Eine freie Flamme bleibt nie leer",
      text: "Ein altmodischer Koch beginnt acht Gerichte zusammen und wartet, bis alle acht fertig sind, bevor er die nächsten acht anfängt. Das schnelle Omelett ist nach zwei Minuten fertig, dann bleibt seine Flamme zwanzig Minuten leer, bis der Eintopf durch ist. Unser Koch arbeitet anders: Sobald das Omelett auf dem Teller liegt, kommt die nächste Bestellung auf diese Flamme. Gleicher Herd, viel mehr Gerichte pro Stunde, und kurze Bestellungen warten nicht auf lange.",
    },
    engineering: {
      text: "LLM-Anfragen haben sehr unterschiedliche Ausgabelängen. Statisches Batching wartet, bis jede Sequenz eines Batches fertig ist, sodass kurze Anfragen ihren Platz leer halten, während lange laufen, und neue Anfragen auf den nächsten Batch warten. Continuous (In-Flight) Batching plant auf Ebene jedes Dekodierschritts: Fertige Sequenzen verlassen den Batch, wartende Anfragen steigen sofort ein. Das erhöht GPU-Auslastung und Durchsatz um ein Vielfaches und senkt die Wartezeit. Es ist Standard in vLLM, SGLang, TGI und TensorRT-LLM; stimme es über die maximale Zahl gleichzeitiger Sequenzen und Token-Budgets pro Schritt ab.",
      pitfalls: [
        "Ein zu niedriges max-num-seqs lässt die GPU leerlaufen; ein zu hohes erschöpft den KV-Cache-Speicher und führt zu Preemption.",
        "Sehr lange Prompts können das Dekodieren für alle blockieren; aktiviere Chunked Prefill.",
        "Durchsatzgewinne brauchen gleichzeitigen Traffic; ein einzelner Nutzer merkt keinen Vorteil.",
      ],
    },
    keywords: ["Batching", "kontinuierlich", "Auslastung", "Durchsatz"],
  },
  "system-design-11": {
    official:
      "Speichere den KV-Cache in kleinen Seiten, wie Betriebssystem-Speicher, damit viel weniger GPU-Speicher verschwendet wird.",
    kid: "Statt jedem Koch vorsorglich eine riesige Arbeitsfläche zu geben, verteilt die Küche kleine Tabletts, wenn mehr Platz nötig ist. PagedAttention gibt dem Computer Speicher in kleinen Stücken, so geht wenig verloren.",
    realWorld: {
      title: "Tabletts statt reservierter Arbeitsflächen",
      text: "Früher reservierte die Küche für jede Bestellung eine ganze zwei Meter lange Arbeitsfläche, falls es ein Zehn-Gänge-Menü würde. Die meisten Bestellungen brauchten einen halben Meter, der Rest stand leer, während neue Bestellungen auf Platz warteten. Jetzt bekommt jede Bestellung kleine Tabletts, eins nach dem anderen, wenn sie es braucht, von einem gemeinsamen Stapel. Dieselbe Küche schafft dreimal so viele Bestellungen, und zwei mit derselben Vorspeise können sich sogar ein Tablett teilen.",
    },
    engineering: {
      text: "Während der Generierung hält jede Anfrage einen KV-Cache, der mit jedem Token wächst. Ältere Server reservierten pro Anfrage einen zusammenhängenden Block für die maximale Länge und verschwendeten durch Überreservierung und Fragmentierung den Großteil des GPU-Speichers. PagedAttention, von vLLM eingeführt, teilt den KV-Cache in Blöcke fester Größe, die bei Bedarf vergeben und über eine Blocktabelle verwaltet werden, wie virtuelle Speicherseiten in einem Betriebssystem. Die Verschwendung schrumpft auf den letzten angebrochenen Block, viel mehr Anfragen passen in den Speicher (größere Batches, mehr Durchsatz), und identische Präfixe können Blöcke teilen.",
      pitfalls: [
        "Ein max-model-len weit über dem echten Bedarf verringert trotzdem, wie viele Sequenzen eingeplant werden können.",
        "Geht der KV-Speicher aus, werden Anfragen verdrängt und neu berechnet; beobachte die Preemption-Metriken.",
        "Traffic mit langem Kontext ändert die Rechnung; dimensioniere GPUs für deine echten Prompt- und Ausgabelängen.",
      ],
    },
    keywords: ["Speicherseiten", "KV-Cache", "GPU-Speicher", "Fragmentierung"],
  },
  "system-design-12": {
    official: "Ein kleines Entwurfsmodell rät ein paar Tokens; das große Modell prüft alle in einem Durchgang.",
    kid: "Ein Helfer rät schnell die nächsten Wörter einer Rezeptkarte, die Chefköchin prüft alle auf einen Blick und behält die richtigen. Speculative Decoding beschleunigt so ein großes Modell mit einem kleinen Helfer.",
    realWorld: {
      title: "Der Helfer rät, die Chefin prüft",
      text: "Die Chefköchin schreibt jede Rezeptkarte langsam und sorgfältig, Wort für Wort. Ihr Lehrling ist schnell und liegt bei offensichtlichen Wörtern oft richtig. Also schreibt der Lehrling die nächsten fünf Wörter mit Bleistift vor, und die Chefin liest sie alle auf einen Blick: Die ersten drei stimmen, also behält sie sie und schreibt das vierte selbst. Die Karten sehen genauso aus, wie die Chefin sie allein geschrieben hätte, nur schneller.",
    },
    engineering: {
      text: "Speculative Decoding beschleunigt die Generierung, ohne die Ausgabeverteilung zu ändern. Ein kleines Entwurfsmodell (oder zusätzliche Heads wie Medusa oder EAGLE, oder N-Gramm-Abgleich mit dem Prompt) schlägt k Tokens vor; das große Zielmodell prüft alle in einem einzigen Forward Pass und übernimmt das längste korrekte Präfix plus ein eigenes Token. Weil das Dekodieren speichergebunden ist, kostet das Prüfen mehrerer Tokens etwa so viel wie das Erzeugen eines einzigen, daher sind Beschleunigungen um das Zwei- bis Dreifache üblich, wenn die Akzeptanz hoch ist. Bei großen Batches und unvorhersehbarem Text sinken die Gewinne.",
      pitfalls: [
        "Das Entwurfsmodell muss den Tokenizer des Zielmodells teilen und viel schneller sein, sonst verpuffen die Gewinne.",
        "Bei großen Batches ist die GPU ohnehin ausgelastet, Spekulation hilft dann viel weniger.",
        "Niedrige Akzeptanz bei kreativem oder ungewöhnlichem Text kann sogar bremsen; miss es mit deinem Traffic.",
      ],
    },
    keywords: ["spekulativ", "Entwurfsmodell", "Beschleunigung"],
  },
  "system-design-13": {
    name: "GPU- vs. API-Kosten",
    official: "Wann GPUs mieten und selbst hosten günstiger ist als Bezahlung pro Token, und wann nicht.",
    kid: "Essen zu bestellen ist für ein paar Mahlzeiten billig, aber wer jeden Tag hundert Leute satt macht, fährt mit einer eigenen Küche günstiger. GPU- gegen API-Kosten heißt ausrechnen, wann eigene Modelle billiger sind.",
    realWorld: {
      title: "Bestellen oder eigene Küche?",
      text: "Für ein paar Mittagessen pro Woche ist Bestellen klar billiger: keine Miete, keine Geräte, kein Personal. Eine Kantine, die täglich Hunderte versorgt, ist etwas anderes: Ihre eigene Küche kostet auch an ruhigen Tagen viel, aber jede Mahlzeit wird am Ende viel billiger. Wo sich das trifft, hängt davon ab, wie ausgelastet die Küche wirklich ist. Eine leere Küche kostet trotzdem Miete, und eine gut geführte Küche braucht fähige Leute.",
    },
    engineering: {
      text: "API-Preise gelten pro Token ohne Fixkosten; Selbst-Hosting auf gemieteten GPUs ist ein fixer Stundenpreis, dessen Kosten pro Token von der Auslastung abhängen. Selbst hosten gewinnt meist nur bei gleichmäßig hohem Volumen, einem Modell, das klein genug für effizientes Serving ist (oft ein fine-getuntes oder destilliertes offenes Modell), strengen Anforderungen an den Datenstandort oder Latenzkontrolle. Vergleiche die Gesamtbetriebskosten: GPU-Stunden inklusive Leerlauf und Redundanz, Engineering- und Bereitschaftszeit und Qualitätsunterschiede zu Frontier-APIs. Prüf regelmäßig neu, denn API-Preise fallen weiter.",
      pitfalls: [
        "Token-Preise mit GPU-Preisen bei 100 % Auslastung zu vergleichen; echter Traffic hat Nächte und Wochenenden.",
        "Engineering-, Monitoring- und Bereitschaftskosten für den eigenen Serving-Stack zu vergessen.",
        "Ein billigeres selbst gehostetes Modell, das schlechter antwortet, kann an Support und verlorenen Nutzern mehr kosten.",
      ],
    },
    keywords: ["Kosten", "GPU", "API", "selbst hosten", "Gesamtbetriebskosten"],
  },
  "system-design-14": {
    name: "Batch-Inferenz",
    official: "Schick große Offline-Jobs als Batch zu einem niedrigeren Preis, wenn niemand auf die Antwort wartet.",
    kid: "Hundert Lunchboxen für morgen zu kochen ist billiger, als jede einzeln zu kochen, wenn jemand hereinkommt. Batch-Inferenz schickt große Jobs, auf die gerade niemand wartet, zu einem niedrigeren Preis.",
    realWorld: {
      title: "Die Lunchboxen von morgen, heute Nacht gekocht",
      text: "Eine Schule bestellt 500 Lunchboxen für den Ausflug morgen. Niemand wartet am Tresen, also kocht die Küche sie nicht mitten im Abendgeschäft. Sie kocht sie über Nacht, wenn die Herde frei sind, in großen Blechen, und berechnet der Schule den halben Preis. Die Lunchboxen sind am Morgen fertig, die Abendgäste merken nichts, und alle sparen Geld.",
    },
    engineering: {
      text: "Batch-Inferenz verarbeitet große Offline-Workloads (einen Rückstau klassifizieren, Embeddings erzeugen, Dokumente anreichern, Eval-Suiten laufen lassen, synthetische Daten) asynchron statt Anfrage für Anfrage. Batch-APIs der Anbieter (Anthropic Message Batches, OpenAI Batch) nehmen Tausende Anfragen in einem Job an, liefern Ergebnisse innerhalb von etwa 24 Stunden und kosten ungefähr die Hälfte des normalen Preises, mit eigenen Rate Limits. Selbst gehostet laufen Offline-Batches mit maximaler Batch-Größe für besten Durchsatz. Nutze eigene IDs, um Ergebnisse zuzuordnen, und behandle Teilfehler.",
      pitfalls: [
        "Batch-Ergebnisse können Stunden dauern; nutze Batch-APIs nie für etwas, worauf ein Nutzer wartet.",
        "Manche Einträge schlagen fehl oder laufen ab; verfolge sie per custom_id und reiche sie neu ein.",
        "Ein falscher Prompt mal 20.000 ist teuer; teste zuerst an einer kleinen Stichprobe.",
      ],
    },
    keywords: ["Batch", "offline", "günstiger", "asynchron"],
  },
  "system-design-15": {
    name: "Asynchrone Job-Pipelines",
    official: "Leg lange KI-Aufgaben in eine Queue und lass sie von Workern ausführen, außerhalb der Web-Anfrage.",
    kid: "Bei einem großen Catering-Auftrag schreibt der Kellner einen Bon, und die Küche arbeitet ihn hinten Schritt für Schritt ab, ohne dass der Gast warten muss. Job-Pipelines erledigen lange KI-Arbeit genauso.",
    realWorld: {
      title: "Der Catering-Auftrag in der hinteren Küche",
      text: "Eine Firma bestellt Essen für 300 Leute. Niemand steht am Tresen, während es zubereitet wird. Die Bestellung wird zu einem Bon an der Tafel der hinteren Küche: schneiden, kochen, packen, liefern. Jede Station nimmt Bons von der Tafel, und fällt der Ofen mittendrin aus, kommt der Bon beim Schritt Kochen zurück an die Tafel, nicht beim Schneiden. Der Kunde kann auf die Tafel schauen und genau sehen, wo seine Bestellung steht.",
    },
    engineering: {
      text: "Asynchrone Job-Pipelines verlagern lange oder schwere KI-Arbeit (Dokumente einlesen, lange Agent-Läufe, Berichte erzeugen, Video- oder Audioverarbeitung, Massen-Evals) aus der Web-Anfrage in eingereihte, mehrstufige Workflows, die Worker ausführen. Jeder Schritt (parsen, chunken, einbetten, indexieren, zusammenfassen) ist idempotent und wird mit Backoff einzeln wiederholt, der Fortschritt wird gespeichert, damit Fehler beim letzten abgeschlossenen Schritt weitermachen, und der Client bekommt eine Job-ID plus Fortschritt per Polling, SSE oder Webhooks. Werkzeuge reichen von Celery und RQ bis zu dauerhaften Workflow-Engines wie Temporal, Inngest und Hatchet.",
      pitfalls: [
        "Nicht-idempotente Schritte erzeugen bei Wiederholung Duplikate; schlüssle jeden Schreibvorgang nach Dokument und Schritt.",
        "Riesige Nutzdaten zwischen Schritten bremsen alles; übergib stattdessen Verweise auf den Objektspeicher.",
        "Ohne Fortschritt pro Schritt können Nutzer und Bereitschaft nicht unterscheiden, ob etwas hängt oder nur langsam ist.",
      ],
    },
    keywords: ["Queue", "Worker", "Hintergrund", "Pipeline"],
  },
  "system-design-16": {
    name: "Rate Limits der Anbieter",
    official:
      "Anfragen und Tokens pro Minute sind gedeckelt. Begegne dem mit Queues, Backoff und verteilter Last.",
    kid: "Der Lieferant bringt nur vierzig Kisten Gemüse pro Stunde, egal wie laut die Küche ruft. Rate Limits funktionieren genauso: KI-Firmen nehmen pro Minute nur so viele Fragen und Wörter an.",
    realWorld: {
      title: "Vierzig Kisten pro Stunde, nicht mehr",
      text: "Unser Gemüselieferant bringt höchstens vierzig Kisten pro Stunde und drei Tonnen am Tag. Bestellt die Küche hundert Kisten auf einmal, kommen sechzig mit einem Zettel zurück: „Zu viele, später noch mal versuchen.“ Also plant die Küche: Bestellungen kommen auf eine Liste, werden gleichmäßig verschickt, große Bestellungen werden verteilt, und sagt der Lieferant „warten“, wartet die Küche. Für große Events nutzt sie zusätzlich einen zweiten Lieferanten.",
    },
    engineering: {
      text: "Modellanbieter begrenzen Anfragen pro Minute (RPM), Eingabe- und Ausgabe-Tokens pro Minute (ITPM, OTPM) und manchmal den Tagesverbrauch, pro Organisation, Modell und Nutzungsstufe; wer sie überschreitet, bekommt 429 mit Retry-Headern. Produktionssysteme begegnen dem mit clientseitigem Rate Limiting, das die Restkapazität aus den Antwort-Headern verfolgt, einer Queue mit kontrollierter Senderate, Vorrang für interaktiven Traffic vor Hintergrund-Jobs, exponentiellem Backoff mit Jitter, Lastverteilung über Modelle, Regionen oder Anbieter, Prompt Caching (gecachte Tokens zählen teils weniger) und dem Beantragen höherer Stufen vor Launches.",
      pitfalls: [
        "429er sofort zu wiederholen macht es schlimmer; halte dich an retry-after und ergänze Jitter.",
        "Limits gelten pro Modell und Organisation; ein Batch-Job kann das ganze Produkt aushungern.",
        "Launches und Demos laufen zuerst in Limits; prüf deine Stufe und beantrage Erhöhungen früh.",
      ],
    },
    keywords: ["Rate Limit", "429", "Backoff", "Drosselung"],
  },
  "system-design-17": {
    name: "Mandantenfähiges Design",
    official: "Viele Kunden auf einem System, jeder mit getrennten Daten, Limits und Kosten.",
    kid: "Eine große Küche kocht für mehrere Restaurants, aber jedes hat seine Rezepte in einer eigenen verschlossenen Kiste und seinen Anteil am Herd. Mandantenfähiges Design hält viele Kunden in einem System getrennt.",
    realWorld: {
      title: "Eine Küche, viele Restaurants",
      text: "Unsere Küche kocht für drei Restaurants. Die Geheimrezepte jedes Restaurants liegen in einer eigenen verschlossenen Schublade mit seinem Namen, und Köche müssen das Schild prüfen, bevor sie eine Schublade öffnen. Jedes Restaurant hat einen festen Anteil an der Herdzeit, damit eine riesige Feier bei einem die Gäste der anderen nicht warten lässt. Am Monatsende bekommt jedes Restaurant eine Rechnung für genau das, was es verbraucht hat.",
    },
    engineering: {
      text: "Mandantenfähiges Design bedient viele Kunden (Mandanten) über gemeinsame Infrastruktur und hält sie dabei getrennt. Die Isolationsmodelle reichen von einer gemeinsamen Datenbank mit tenant_id in jeder Zeile (durchgesetzt mit Row-Level Security) über ein Schema oder eine Datenbank pro Mandant bis zu eigenen Deployments für große Kunden. In KI-Apps muss die Trennung Filter oder Namespaces in der Vektorsuche, Caches, Prompts und fine-getunte Modelle, Dateispeicher und Logs abdecken. Ergänze Rate Limits, Token-Budgets und faire Queues pro Mandant gegen laute Nachbarn, Kostenzuordnung pro Mandant sowie mandantenbewusste Evals und Datenlöschung.",
      pitfalls: [
        "Ein einziger fehlender Mandantenfilter in einer Vektorsuche lässt Dokumente eines anderen Kunden in Antworten einfließen.",
        "Caches und Prompt-Logs ohne Mandanten im Schlüssel werden zum Leck zwischen Mandanten.",
        "Ohne Limits pro Mandant bremst der Batch-Job eines großen Kunden alle aus.",
      ],
    },
    keywords: ["Mandanten", "Multi-Tenant", "Isolation", "Kunden"],
  },
  "system-design-18": {
    name: "RAG vs. Fine-Tuning",
    official: "RAG für frische oder private Fakten. Fine-Tuning für Stil, Format oder eine eng umrissene Fähigkeit.",
    kid: "Für das Tagesgericht liest der Koch die neue Rezeptkarte aus dem Regal; um im Stil des Hauses zu kochen, geht er auf die Kochschule. RAG ist Lesen aus dem Regal, Fine-Tuning ist die Schule.",
    realWorld: {
      title: "Die Karte lesen oder zur Schule gehen?",
      text: "Ein neuer Koch muss die Tagesgerichte kochen, die sich jeden Tag ändern. Ihn für jedes Gericht auf die Kochschule zu schicken, wäre absurd: Er liest einfach die Karte von heute. Aber um alles im typischen Stil unseres Restaurants anzurichten, jedes Mal, ohne nachzudenken, wirken ein paar Wochen Training viel besser als ein Zettel an der Wand. Die meisten großen Köche nutzen beides: im Stil geschult, die Karte von heute lesend.",
    },
    engineering: {
      text: "RAG liefert Wissen zur Abfragezeit, indem relevante Dokumente in den Prompt geholt werden: am besten für Fakten, die sich ändern, private oder nutzerbezogene Daten, große Korpora und Antworten, die Quellen und Zugriffskontrolle brauchen. Fine-Tuning ändert die Gewichte des Modells mit Beispielen: am besten für gleichbleibenden Stil, Ton oder Format, eine enge Aufgabe, die ein kleineres Modell billiger erledigt, Fachsprache oder ein Verhalten, das Prompts nicht zuverlässig hervorbringen. Für frische Fakten taugt Fine-Tuning wenig. Starte mit Prompting plus RAG, miss mit Evals und fine-tune für die Lücken; beides zu kombinieren ist üblich.",
      pitfalls: [
        "Fakten per Fine-Tuning beizubringen ergibt selbstsichere Antworten, die veralten und keine Quellen nennen können.",
        "Prompt Engineering und Evals vor dem Fine-Tuning zu überspringen verschwendet Zeit an der falschen Lösung.",
        "RAG-Qualität ist vor allem Retrieval-Qualität; ein Fine-Tune repariert keine schlechten Chunks oder Suchen.",
      ],
    },
    keywords: ["RAG oder Fine-Tuning", "Entscheidung", "Wissen", "Stil"],
  },
  "system-design-19": {
    name: "Kontextfenster-Management",
    official: "Entscheide, was ins Fenster kommt: kürzen, zusammenfassen, nur das Nötige abrufen.",
    kid: "Auf die kleine Arbeitsfläche der Köchin kommt das Essen von heute, über gestern schreibt sie eine kurze Notiz, den Rest holt sie aus dem Regal. Kontextfenster-Management entscheidet, was auf die Fläche kommt.",
    realWorld: {
      title: "Nur so viel Platz auf der Arbeitsfläche",
      text: "Während einer langen Schicht füllt sich die Arbeitsfläche mit alten Schüsseln, Notizen und Zutaten früherer Bestellungen, bis kein Platz zum Arbeiten bleibt und die Köchin zum falschen Glas greift. Eine ordentliche Köchin räumt Erledigtes weg, schreibt eine kurze Notiz über das, was noch zählt („Tisch 4 hat eine Nussallergie“), hält die Zutaten der aktuellen Bestellung griffbereit und holt alles andere erst aus dem Regal, wenn sie es braucht.",
    },
    engineering: {
      text: "Kontextfenster-Management entscheidet, welche Tokens in jeden Modellaufruf kommen: System-Prompt, Tool-Definitionen, abgerufene Chunks, Gesprächsverlauf, Tool-Ergebnisse und Notizen. Selbst bei langen Fenstern kostet mehr Kontext mehr, verlangsamt den Prefill und verschlechtert die Aufmerksamkeit für das Wichtige. Strategien sind: auf die letzten N Runden kürzen, älteren Verlauf zusammenfassen oder kompaktieren, nur relevante frühere Nachrichten oder Erinnerungen abrufen, große Tool-Ausgaben abschneiden, abgerufene Chunks deduplizieren und reranken und ein stabiles, cachebares Präfix behalten. Miss die Antwortqualität, während der Kontext wächst.",
      pitfalls: [
        "Das ganze Fenster zu füllen, nur weil es passt, erhöht die Kosten und senkt oft die Antwortqualität.",
        "Zusammenfassungen lassen still Details wie Vorgaben und Allergien fallen; halte kritische Fakten separat fest.",
        "Frühen Kontext jede Runde zu ändern bricht das Prompt Caching; halte den stabilen Teil vorne.",
      ],
    },
    keywords: ["Kontextfenster", "kürzen", "zusammenfassen", "Verlauf"],
  },
  "system-design-20": {
    name: "Kostenoptimierung",
    official: "Routing, Caching, Batching, kürzere Prompts und kleinere Modelle, zusammen, um die Rechnung zu senken.",
    kid: "Eine schlaue Küche spart auf viele kleine Arten: Helfer kochen einfache Gerichte, Suppe kommt aus großen Töpfen, nichts wird zweimal gekocht. Kostenoptimierung kombiniert diese Tricks, damit die Rechnung sinkt.",
    realWorld: {
      title: "Viele kleine Ersparnisse summieren sich",
      text: "Die Lebensmittelrechnung des Restaurants hat sich in einem Jahr verdoppelt, und kein einzelner Trick half. Jetzt kochen Helfer die einfachen Gerichte, beliebte Suppen entstehen in großen Töpfen, Böden werden vorbereitet, das Catering für morgen wird nachts günstiger gekocht, und die Portionen passen zu dem, was Gäste wirklich essen. Jede Änderung sparte ein wenig; zusammen senkten sie die Rechnung um mehr als die Hälfte, und die Gäste merkten nur, dass das Essen schneller kam.",
    },
    engineering: {
      text: "Kostenoptimierung bei LLMs beginnt mit Messen: Kosten pro Anfrage, pro Feature, pro Mandant und pro erfolgreichem Ergebnis. Die großen Hebel, ungefähr nach Aufwand sortiert: kürzere Prompts und begrenzte Ausgaben, Prompt oder Prefix Caching für stabilen Kontext, Model-Routing zu kleineren Modellen, semantisches oder exaktes Caching, Batch-APIs für Offline-Arbeit, weniger und bessere abgerufene Chunks, begrenzte Agent-Schritte sowie destillierte, fine-getunte oder selbst gehostete Modelle bei hohem Volumen. Die Ersparnisse multiplizieren sich. Sichere jede Änderung mit Evals ab, damit billiger nie still schlechter bedeutet.",
      pitfalls: [
        "Ohne Kostendaten pro Feature zu optimieren trifft die falsche Stelle; miss zuerst.",
        "Billigere Routen und kleinere Prompts können still die Qualität senken; sichere jede Änderung mit Evals ab.",
        "Engineering-Zeit ist auch ein Kostenfaktor; beginne mit den Hebeln, die für den wenigsten Aufwand am meisten sparen.",
      ],
    },
    keywords: ["Kosten", "sparen", "Rechnung", "Optimierung"],
  },
};

export default concepts;
