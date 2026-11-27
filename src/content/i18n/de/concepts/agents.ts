import type { ConceptTranslations } from "../../types";

/** Bereich KI-Agenten auf Deutsch. Szene: ein Roboter, der in einer kleinen Stadt Besorgungen macht. */
const concepts: ConceptTranslations = {
  "agents-01": {
    official:
      "Das Modell gibt einen Funktionsnamen + Argumente zurück. Dein Code führt sie aus und schickt das Ergebnis zurück.",
    kid: "Ein Roboter-Helfer kann die Ladentür nicht selbst öffnen, also schreibt er einen Zettel: „Brot kaufen, 2 Laibe“. Du gehst einkaufen, erzählst dem Roboter, was passiert ist, und er macht weiter.",
    realWorld: {
      title: "Die Einkaufszettel des Roboters",
      text: "Unser Roboter-Helfer lebt in einer kleinen Stadt voller Läden. Er kann die Knöpfe in der Bäckerei nicht selbst drücken; stattdessen gibt er dir einen ordentlichen Zettel: „Bäckerei: kaufen, Artikel = Brot, Menge = 2“. Du gehst zur Bäckerei und sagst ihm „erledigt, hat 4 Euro gekostet“. Der Roboter liest das und entscheidet, was als Nächstes kommt. Der Roboter wählt aus; dein Code führt aus.",
    },
    engineering: {
      text: "Beim Tool Calling beschreibst du in der Anfrage Funktionen (Name, Beschreibung und ein JSON-Schema für die Eingaben). Statt mit Text zu antworten, kann das Modell mit einem Tool-Aufruf antworten: dem Tool-Namen plus Argumenten, die zum Schema passen. Dein Code prüft die Argumente, führt die Funktion aus und schickt das Ergebnis als Tool-Result zurück, danach macht das Modell weiter. Das Modell führt selbst nie etwas aus, also liegen Berechtigungen, Validierung und Fehlerbehandlung in deinem Code.",
      pitfalls: [
        "Prüf Tool-Argumente, bevor du etwas ausführst; das Modell kann falsche oder schädliche Werte erzeugen.",
        "Tool-Namen und -Beschreibungen sind Prompts: Vage Formulierungen führen zur falschen Tool-Wahl.",
        "Gib Fehler als Tool-Results zurück, die das Modell lesen kann, statt die Schleife abstürzen zu lassen.",
      ],
    },
    keywords: ["Werkzeuge", "Funktionsaufruf", "Tool-Aufruf"],
  },
  "agents-02": {
    name: "Die Agent-Schleife",
    official: "Denken, Werkzeug aufrufen, Ergebnis lesen, wiederholen, bis die Aufgabe erledigt ist.",
    kid: "Der Roboter schaut auf seine Liste, erledigt eine Aufgabe, prüft, was passiert ist, und nimmt sich die nächste vor. Er dreht seine Runden, bis die ganze Liste erledigt ist.",
    realWorld: {
      title: "Runde um Runde durch die Stadt",
      text: "Der Auftrag des Roboters lautet „Besorg alles fürs Sonntagsfrühstück“. Er überlegt, was fehlt, geht zu einem Laden, schaut, was er bekommen hat, und überlegt erneut. Eier auf dem Markt ausverkauft? Dann versucht er es im Supermarkt. Er kreist so lange zwischen Denken, Gehen und Schauen, bis die Tasche voll ist, und geht dann heim. Jede Runde ist ein Durchlauf der Agent-Schleife.",
    },
    engineering: {
      text: "Ein Agent ist ein LLM in einer Schleife: Schick das Gespräch und die Tool-Definitionen ans Modell; gibt es Tool-Aufrufe zurück, führ sie aus, häng die Ergebnisse an und ruf das Modell erneut auf; hör auf, wenn es ohne Tool-Aufruf antwortet oder eine Abbruchbedingung greift. Die Schleife selbst sind ein paar Zeilen Code. Die schweren Teile sind gute Tools, klare Anweisungen, Kontextmanagement, Abbruchbedingungen und Beobachtbarkeit.",
      pitfalls: [
        "Jeder Schritt sendet den ganzen Verlauf erneut, also wachsen Kosten und Latenz mit jeder Runde.",
        "Ohne Schrittlimit dreht sich ein verwirrter Agent endlos im Kreis.",
        "Stehen die Schritte vorher fest, ist ein einfacher Workflow billiger und zuverlässiger als ein Agent.",
      ],
    },
    keywords: ["Schleife", "Agent", "Runde"],
  },
  "agents-03": {
    name: "ReAct-Muster",
    official: "Denkschritte und Aktionen wechseln sich ab. Das klassische Prompt-Muster für Agenten.",
    kid: "Vor jedem Zug sagt der Roboter laut, was er denkt, tut dann eine Sache und sagt, was er gesehen hat. Denken und Tun wechseln sich ab, wie wenn du dich selbst durch ein Spiel redest.",
    realWorld: {
      title: "Der Roboter redet sich selbst durch",
      text: "Gefragt „Schaffe ich es mit dem Bus zur Bäckerei, bevor sie schließt?“, sagt der Roboter: „Gedanke: Ich brauche die Öffnungszeiten.“ Aktion: Er liest das Schild der Bäckerei. „Beobachtung: geöffnet bis 18:00.“ „Gedanke: Jetzt die Busabfahrt.“ Aktion: Er prüft den Fahrplan. Weil sich Gedanken und Aktionen abwechseln, plant er jeden Schritt mit den Fakten, die er gerade gelernt hat.",
    },
    engineering: {
      text: "ReAct (Reason + Act, Yao et al., 2022) verschränkt Denkschritte und Aktionen in einem Transkript: Thought, Action, Observation, wiederholt bis zur finalen Answer. Das Denken hilft bei der Wahl der nächsten Aktion und beim Anpassen des Plans; die Beobachtungen erden das Denken in echten Daten und reduzieren Halluzinationen. Moderne Tool-Calling-APIs setzen dieselbe Idee nativ um: Das Modell schreibt etwas Begründung, gibt einen Tool-Aufruf aus und liest das Tool-Result.",
      pitfalls: [
        "ReAct mit Text-Parsing ist fragil; bevorzuge natives Tool Calling, das strukturierte Aktionen liefert.",
        "Lange Überlegungen vor jeder Aktion kosten Tokens und Zeit.",
        "Beobachtungen kommen von Tools und sind nicht vertrauenswürdig; sie können eingeschleuste Anweisungen enthalten.",
      ],
    },
    keywords: ["Denken und Handeln", "Gedanke", "Beobachtung"],
  },
  "agents-04": {
    name: "Planung",
    official: "Zerleg das Ziel vor dem Handeln in Schritte und pass den Plan an, wenn Ergebnisse eintreffen.",
    kid: "Bevor er einkaufen geht, schreibt der Roboter eine Liste: Bäckerei, dann Markt, dann nach Hause. Hat ein Laden zu, streicht er die Zeile und schreibt einen neuen Plan.",
    realWorld: {
      title: "Die Einkaufsliste, die sich ändert",
      text: "Für „Organisiere ein Geburtstagspicknick“ schreibt der Roboter erst einen Plan: Torte bestellen, Luftballons kaufen, einen Platz im Park reservieren, Freunde einladen. Dann arbeitet er die Liste ab. Sagt die Bäckerei, sie sei ausgebucht, gibt er nicht auf: Er ändert den Plan in „Torte im Supermarkt kaufen“ und macht weiter. Ein schriftlicher Plan hält lange Aufgaben auf Kurs.",
    },
    engineering: {
      text: "Planung lässt den Agenten ein Ziel vor dem Handeln in Schritte zerlegen, entweder explizit (Plan-and-Execute: Ein Planer schreibt Schritte, ein Ausführer arbeitet sie ab, ein Neuplaner passt nach jedem Ergebnis die restlichen Schritte an) oder implizit durch Nachdenken. Ein expliziter Plan verbessert lange Aufgaben, liefert eine Checkliste für den Fortschritt und macht das Verhalten leichter prüfbar. Halte den Plan im State oder in einer Datei, aktualisiere ihn mit jedem Ergebnis und plane Schritte nicht zu genau, die von früheren Ergebnissen abhängen.",
      pitfalls: [
        "Pläne, die vor dem Sehen der Daten geschrieben werden, sind oft falsch; plane nach jedem Schritt neu.",
        "Sehr lange Pläne verschwenden Tokens und driften ab; halte die Schritte wenig und konkret.",
        "Speichere den Plan bei langen Aufgaben außerhalb des Kontextfensters, zum Beispiel in einer Todo-Datei.",
      ],
    },
    keywords: ["Plan", "Schritte", "Neuplanung"],
  },
  "agents-05": {
    name: "Reflexion",
    official: "Der Agent prüft seine eigene Ausgabe und versucht es erneut, um Fehler zu beheben.",
    kid: "Nachdem du ein Bild gemalt hast, schaust du noch mal hin und merkst, dass die Sonne fehlt, also malst du sie dazu. Der Roboter prüft auch seine Arbeit und behebt Fehler, bevor er sie abgibt.",
    realWorld: {
      title: "Die Tasche prüfen, bevor es heimgeht",
      text: "Bevor er den Markt verlässt, liest der Roboter seine Liste noch einmal und schaut in die Tasche: „Auf der Liste stehen 6 Eier, in der Tasche sind 4.“ Er geht zurück und holt zwei mehr. Bei Schreibaufgaben macht er es genauso: Er schreibt einen Entwurf, liest ihn wie ein strenger Lehrer, notiert, was falsch ist, und schreibt eine bessere Version. Ein oder zwei Prüfungen fangen die meisten Patzer ab.",
    },
    engineering: {
      text: "Reflexion (Selbstkritik, Evaluator-Optimizer) ergänzt einen Schritt, in dem das Modell oder ein zweites Modell eine Ausgabe anhand von Kriterien oder Testergebnissen prüft, und der Agent überarbeitet sie mit diesem Feedback. Das klappt am besten, wenn die Kritik auf etwas Prüfbarem beruht: fehlschlagende Tests, Linter-Fehler, Schema-Validierung oder eine Rubrik. Begrenze es auf ein bis drei Runden; ungelenkte Selbstkritik kann ein Modell von einer richtigen Antwort abbringen.",
      pitfalls: [
        "Selbstkritik ohne externes Signal kann gute Antworten verschlechtern.",
        "Jede Runde kostet einen ganzen zusätzlichen Aufruf; begrenze die Runden.",
        "Ein eigener Judge-Prompt oder ein anderes Modell kritisiert besser als „prüf deine Arbeit“ in derselben Runde.",
      ],
    },
    keywords: ["Selbstkritik", "überprüfen", "verbessern"],
  },
  "agents-06": {
    name: "Kurzzeitgedächtnis",
    official: "Was der Agent im aktuellen Kontext hält: das Gespräch und die letzten Tool-Ergebnisse.",
    kid: "Während du mit einem Freund redest, weißt du noch, was er vor einer Minute gesagt hat. Der Roboter merkt sich das aktuelle Gespräch auch, aber nur die letzten paar Seiten passen auf seinen Tisch.",
    realWorld: {
      title: "Der kleine Notizblock des Roboters",
      text: "Während einer Besorgung führt der Roboter einen kleinen Notizblock: was du gefragt hast, welche Läden er besucht hat, was jeder Laden gesagt hat. Das ist sein Kurzzeitgedächtnis, und vor jedem Schritt liest er den ganzen Block. Der Block hat wenige Seiten, also fallen an einem sehr langen Tag die ältesten Notizen heraus, und der Roboter vergisst vielleicht, dass du Vollkornbrot wolltest.",
    },
    engineering: {
      text: "Das Kurzzeitgedächtnis ist alles, was für die aktuelle Aufgabe im Kontext des Modells steht: System-Prompt, Gesprächsrunden, Tool-Aufrufe und Tool-Ergebnisse. Es ist durch das Kontextfenster begrenzt, wird bei jedem Aufruf bezahlt, und lange Tool-Ausgaben füllen es schnell. Verwalte es bewusst: Alte Runden kürzen oder zusammenfassen, große Tool-Ergebnisse abschneiden, Schlüsselfakten wie Entscheidungen und Nutzervorgaben festhalten und dauerhafte Fakten ins Langzeitgedächtnis verschieben.",
      pitfalls: [
        "Riesige Tool-Ergebnisse, etwa eine ganze Webseite, können das eigentliche Gespräch verdrängen.",
        "Den Verlauf zwischen einem Tool-Aufruf und seinem Ergebnis abzuschneiden, zerstört das Nachrichtenformat.",
        "Alles Wichtige muss festgehalten oder gespeichert werden, sonst verschwindet es still, wenn alte Runden gekürzt werden.",
      ],
    },
    keywords: ["Gedächtnis", "Kontext", "Verlauf"],
  },
  "agents-07": {
    name: "Langzeitgedächtnis",
    official:
      "Fakten, die außerhalb des Kontexts gespeichert (Dateien, Datenbank, Vektorspeicher) und in späteren Sitzungen abgerufen werden.",
    kid: "Der Roboter hat zu Hause ein Notizbuch, in das er alles schreibt, was er sich merken sollte, wie dein Lieblingsobst. Nächste Woche liest er es wieder und weiß es noch.",
    realWorld: {
      title: "Das Notizbuch im Küchenregal",
      text: "Sagst du dem Roboter „Ich esse kein Fleisch“, schreibt er das in ein Notizbuch, das er zu Hause aufbewahrt. Am nächsten Morgen beginnt er mit einem leeren Notizblock, aber vor dem Einkaufen schlägt er im Notizbuch alles zum Thema Essen nach, findet die Notiz und lässt die Metzgerei aus. Langzeitgedächtnis ist alles, was von einem Tag zum nächsten erhalten bleibt.",
    },
    engineering: {
      text: "Das Langzeitgedächtnis speichert Informationen außerhalb des Kontextfensters, damit sie über Sitzungen hinweg bestehen: Nutzervorlieben, gelernte Fakten, Ergebnisse früherer Aufgaben oder Abläufe. Umsetzungen reichen von Dateien, die der Agent bearbeitet (eine memory.md), über Key-Value-Stores und SQL bis zu Vektorspeichern, die nach Relevanz durchsucht werden. Der Agent schreibt Erinnerungen über Tools oder einen Extraktionsschritt im Hintergrund und lädt zu Beginn einer Aufgabe die relevanten in den Kontext. Leg fest, was speicherwürdig ist, wie es aktualisiert oder gelöscht wird und wer es sehen darf.",
      pitfalls: [
        "Veraltete oder falsche Erinnerungen sind schlimmer als keine; lass Nutzer sie ansehen, korrigieren und löschen.",
        "Gedächtnis sind personenbezogene Daten: Trenne sie pro Nutzer und halte Datenschutzregeln wie die DSGVO ein.",
        "Alles zu speichern erzeugt Rauschen; speichere dauerhafte Fakten und Entscheidungen, nicht jede Nachricht.",
      ],
    },
    keywords: ["Gedächtnis", "Erinnerung", "speichern", "DSGVO"],
  },
  "agents-08": {
    name: "MCP-Server",
    official: "Model-Context-Protocol-Server bieten Tools, Ressourcen und Prompts in einem Standardformat an.",
    kid: "Jeder Laden in der Stadt hängt dasselbe Schild auf, das zeigt, was er verkauft und wie man danach fragt. Ein MCP-Server ist dieses Schild, damit jeder Roboter jeden Laden versteht.",
    realWorld: {
      title: "Jeder Laden nutzt dieselbe Tafel",
      text: "Früher hatte in der Stadt jeder Laden eigene Regeln: Einer wollte schriftliche Bestellungen, ein anderer sprach nur Französisch. Dann führte das Rathaus eine Standardtafel ein: was man hier tun kann (Tools), was man hier lesen kann (Ressourcen) und fertige Bestellformulare (Prompts). Jetzt kann jeder Roboter, der die Tafel versteht, überall einkaufen. Wetterstation, Bibliothek und Terminbüro hängen jeweils eine auf.",
    },
    engineering: {
      text: "Das Model Context Protocol (MCP), 2024 von Anthropic eingeführt und inzwischen weit verbreitet, standardisiert, wie Anwendungen LLMs Kontext und Aktionen bereitstellen. Ein MCP-Server bietet Tools (Funktionen, die das Modell aufrufen kann), Ressourcen (lesbare Daten wie Dateien oder Datensätze) und Prompts (wiederverwendbare Vorlagen) über JSON-RPC an, per stdio für lokale Server oder Streamable HTTP für entfernte. Schreib einen Server einmal, und jeder MCP-Client kann ihn nutzen.",
      pitfalls: [
        "Die Tool-Beschreibungen eines Servers landen direkt im Kontext des Modells; halte sie kurz und klar.",
        "Verbinde nur Server, denen du vertraust: Ein bösartiger Server kann Anweisungen einschleusen oder Daten abgreifen.",
        "Tools laufen mit den Rechten des Servers; vergib minimale Rechte und authentifiziere entfernte Server.",
      ],
    },
    keywords: ["Protokoll", "Server", "Standard"],
  },
  "agents-09": {
    name: "MCP-Clients",
    official: "Die App-Seite (IDE, Chat-App, dein Agent), die sich mit MCP-Servern verbindet und ihre Tools nutzt.",
    kid: "Ein Roboter mit einem Universalstecker kann jeden Laden nutzen, der die passende Steckdose hat. Der MCP-Client ist dieser Stecker in einer App, damit sie sich mit vielen Läden verbinden kann.",
    realWorld: {
      title: "Der Universalstecker des Roboters",
      text: "Der Roboter hat einen Universalstecker. Steckt er ihn in die Wetterstation, kann er plötzlich Vorhersagen abrufen; steckt er ihn ins Terminbüro, kann er deine Termine lesen. Für beides brauchte er keine neue Programmierung, weil beide denselben Standard sprechen. Chat-Apps, Code-Editoren und deine eigenen Agenten können alle diesen Stecker tragen.",
    },
    engineering: {
      text: "Ein MCP-Client lebt in einer Host-Anwendung (einer Chat-App, einer IDE, deinem Agenten) und hält die Verbindung zu einem MCP-Server: Er führt den Initialize-Handshake aus, listet Tools, Ressourcen und Prompts des Servers auf und ruft sie im Auftrag des Modells auf. Der Host gibt die gefundenen Tools ans LLM weiter und leitet jeden Tool-Aufruf zum richtigen Client. Hosts entscheiden, welche Server erlaubt sind, fragen Nutzer bei heiklen Aktionen um Zustimmung und kümmern sich um die Authentifizierung entfernter Server.",
      pitfalls: [
        "Viele Server bedeuten viele Tool-Definitionen im Kontext; lade nur, was die Aufgabe braucht.",
        "Lass den Nutzer bestätigen, bevor Tools mit Nebenwirkungen laufen.",
        "Tool-Namen verschiedener Server können kollidieren; versieh sie mit Namespaces.",
      ],
    },
    keywords: ["Client", "Host", "verbinden"],
  },
  "agents-10": {
    official: "Ordner mit Anweisungen und Skripten, die der Agent erst lädt, wenn eine Aufgabe sie braucht.",
    kid: "Der Roboter trägt nicht den ganzen Tag jedes Kochbuch mit sich herum. Er hat ein Regal mit kurz beschrifteten Ordnern und öffnet nur den, den er braucht, wie den Kuchenordner am Kuchentag.",
    realWorld: {
      title: "Ein Regal mit beschrifteten Ordnern",
      text: "Der Rucksack des Roboters ist klein, er kann nicht jede Anleitung mitnehmen. Zu Hause hat er ein Regal mit Ordnern, jeder mit einer einzeiligen Beschriftung: „Kuchen backen“, „Fahrräder reparieren“, „Steuerformulare ausfüllen“. Jeden Morgen liest er nur die Beschriftungen. Ist heute ein Kuchen dran, öffnet er nur den Backordner, mit den Rezeptschritten und einem Timer-Werkzeug darin.",
    },
    engineering: {
      text: "Agent Skills, 2025 von Anthropic eingeführt, sind Ordner mit einer SKILL.md (Name und Beschreibung im YAML-Frontmatter, dann ausführliche Anweisungen) plus optionalen Skripten und Referenzdateien. Nur Name und Beschreibung werden vorab in den Kontext geladen; die vollständigen Anweisungen liest der Agent, und die mitgelieferten Skripte führt er aus, erst wenn eine Aufgabe passt. Diese schrittweise Offenlegung gibt einem Agenten viele spezialisierte Fähigkeiten, ohne sein Kontextfenster zu füllen.",
      pitfalls: [
        "Die Beschreibung entscheidet, wann ein Skill genutzt wird; schreib sie wie einen Auslöser, mit konkreten Formulierungen.",
        "Skills können Skripte ausführen: Installiere sie nur aus Quellen, denen du vertraust.",
        "Halte SKILL.md kurz und lagere lange Details in Referenzdateien aus, die bei Bedarf gelesen werden.",
      ],
    },
    keywords: ["Fähigkeiten", "Ordner", "Anweisungen"],
  },
  "agents-11": {
    name: "Übergaben zwischen Agenten",
    official: "Ein Agent gibt die Aufgabe samt Kontext an einen spezialisierteren Agenten weiter.",
    kid: "Im Rathaus hört dir der Empfang zu und bringt dich dann ins richtige Büro und erzählt dort, was du brauchst. Du musst nicht alles noch einmal erklären.",
    realWorld: {
      title: "Der Empfang im Rathaus",
      text: "Ein Besucher kommt ins Rathaus: „Meine Tonne wurde nicht geleert, und ich will mein Geld zurück.“ Der Empfangsroboter bearbeitet keine Erstattungen selbst. Er bringt den Besucher ins Kassenbüro und übergibt einen Zettel mit der bisherigen Geschichte. Der Kassenroboter, der die Erstattungsregeln kennt, übernimmt ab da das Gespräch.",
    },
    engineering: {
      text: "Bei einer Übergabe (Handoff) gibt ein Agent die Kontrolle über das Gespräch samt Kontext an einen spezialisierteren Agenten ab, typischerweise ein Triage-Agent, der an Abrechnung, technischen Support oder Vertrieb weiterleitet. Jeder Agent bekommt fokussierte Anweisungen und Tools, was genauer ist als ein Agent mit allem. Übergaben werden meist als spezielle Tool-Aufrufe umgesetzt; entscheide, welcher Kontext mitgeht (der ganze Verlauf oder eine Zusammenfassung) und ob die Kontrolle zurückkommen kann.",
      pitfalls: [
        "Den ganzen Verlauf weiterzugeben kann den Spezialisten verwirren; erwäge eine Zusammenfassung.",
        "Agenten, die einen Nutzer hin und her schieben, sind ein häufiger Fehler; begrenze die Übergaben pro Gespräch.",
        "Jeder Agent braucht eigene Evals: Eine falsche Weiterleitung lässt das ganze Gespräch scheitern.",
      ],
    },
    keywords: ["Übergabe", "Weiterleitung", "Triage", "Multi-Agent"],
  },
  "agents-12": {
    name: "Orchestrator-Worker-Muster",
    official:
      "Ein leitender Agent teilt die Arbeit auf, Worker erledigen die Teile parallel, der Leiter führt die Ergebnisse zusammen.",
    kid: "Bei einem großen Schulprojekt teilt die Teamkapitänin die Arbeit auf, alle machen ihren Teil gleichzeitig, und sie setzt alles zusammen. So werden große Aufgaben schneller fertig.",
    realWorld: {
      title: "Ein Planer, viele Läufer",
      text: "Der Roboter soll die drei besten Bäckereien der Stadt vergleichen. Der leitende Roboter teilt die Aufgabe auf: Läufer A besucht Bäckerei A, Läufer B Bäckerei B, Läufer C Bäckerei C, alle gleichzeitig. Jeder Läufer kommt mit Preisen, Öffnungszeiten und einer Geschmacksnotiz zurück. Der leitende Roboter fasst die drei Berichte zu einer Empfehlung zusammen.",
    },
    engineering: {
      text: "Beim Orchestrator-Worker-Muster zerlegt ein leitender Agent eine Aufgabe zur Laufzeit in Teilaufgaben, startet Worker-Agenten (oft parallel) mit fokussierten Anweisungen und frischem Kontext und führt ihre Ergebnisse zusammen. Es passt zu breiter Recherche, Codeänderungen über viele Dateien und Vergleichen, bei denen Teilaufgaben unabhängig und vorab nicht vorhersehbar sind. Es vervielfacht den Token-Verbrauch, also nutze es für wertvolle, parallelisierbare Arbeit und gib Workern klare Grenzen und Ausgabeformate.",
      pitfalls: [
        "Die Token-Kosten vervielfachen sich mit der Zahl der Worker.",
        "Vage Teilaufgaben führen zu doppelter oder fehlender Arbeit; leg Umfang und Ausgabeformat fest.",
        "Worker, die die Ergebnisse anderer brauchen, sind nicht parallel; nutze stattdessen einen Plan.",
      ],
    },
    keywords: ["Orchestrator", "Worker", "parallel", "Teilaufgaben"],
  },
  "agents-13": {
    official: "Ein Framework, das Agenten als Graphen aus Schritten mit gemeinsamem Zustand, Verzweigungen und Schleifen baut.",
    kid: "Stell dir ein Brettspiel vor, bei dem jedes Feld eine Aufgabe ist und Pfeile zeigen, wohin es weitergeht, sogar zurück zu einem früheren Feld. LangGraph baut Helfer, die sich so über eine Karte bewegen.",
    realWorld: {
      title: "Der Stadtplan mit Pfeilen",
      text: "Der Roboter bekommt einen laminierten Stadtplan mit Feldern für „Brief schreiben“, „Brief prüfen“ und „Brief einwerfen“, verbunden durch Pfeile. Ein Pfeil von „prüfen“ sagt: Bei Fehlern zurück zu „schreiben“. Ein Klemmbrett (der gemeinsame Zustand) reist mit, und jedes Feld ergänzt Notizen darauf. Der Plan macht den Weg des Roboters vorhersehbar und leicht nachvollziehbar.",
    },
    engineering: {
      text: "LangGraph vom LangChain-Team baut Agenten und Workflows als Graphen: Knoten sind Funktionen oder LLM-Aufrufe, Kanten bestimmen den Ablauf, und bedingte Kanten erlauben Verzweigungen und Schleifen. Ein typisiertes State-Objekt wird zwischen den Knoten weitergereicht und von jedem aktualisiert. Dazu kommen Checkpointing (Persistenz, Fortsetzen, Time Travel), Human-in-the-Loop-Unterbrechungen und Streaming, was es zu einer häufigen Wahl für Produktions-Agenten macht, die mehr Kontrolle brauchen als eine einfache Schleife.",
      pitfalls: [
        "Graphen bringen Struktur und Boilerplate; für einfache Agenten reicht eine einfache Schleife.",
        "Schleifen im Graphen brauchen trotzdem ein Rekursionslimit oder eine andere Abbruchbedingung.",
        "Halte den State klein und typisiert; riesige State-Objekte machen Checkpoints langsam.",
      ],
    },
    keywords: ["Graph", "Knoten", "Kanten", "Workflow"],
  },
  "agents-14": {
    official: "Ein schlankes Framework für Agenten mit eingebauten Tools, Übergaben, Guardrails und Tracing.",
    kid: "Es ist ein Starterset für Roboter-Helfer: Teile fürs Werkzeugbenutzen, fürs Weitergeben von Aufgaben, für Sicherheitschecks und ein Tagebuch über alles Geschehene liegen schon in der Kiste.",
    realWorld: {
      title: "Ein Roboter-Starterset",
      text: "Statt jedes Roboterteil selbst zu bauen, verkauft die Stadtwerkstatt ein Starterset. Darin: Arme zum Werkzeugbenutzen, ein Knopf, um einen Besucher an einen anderen Roboter weiterzugeben, ein Wächter, der jede Anfrage vor Arbeitsbeginn prüft, und ein Logbuch, das jeden Schritt festhält. Bau die Teile mit ein paar Zeilen Anweisungen zusammen, und der Roboter ist bereit für Besorgungen.",
    },
    engineering: {
      text: "Das OpenAI Agents SDK ist ein schlankes Python- und TypeScript-Framework mit wenigen Grundbausteinen: Agents (Anweisungen, Modell, Tools), Handoffs zwischen Agenten, Guardrails, die Ein- und Ausgaben prüfen, Sessions als Gedächtnis und eingebautes Tracing jedes Laufs. Function Tools sind normale Funktionen, deren Schemas aus Type Hints und Docstrings erzeugt werden. Es zielt auf OpenAI-Modelle und kann über Adapter andere Anbieter nutzen.",
      pitfalls: [
        "Framework-Abstraktionen verbergen, was ans Modell geschickt wird; lies die Traces.",
        "Bau Guardrails für riskante Aktionen so, dass sie im Zweifel blockieren (fail closed).",
        "Pinne die SDK-Version; Agent-Frameworks ändern sich schnell.",
      ],
    },
    keywords: ["Framework", "SDK", "Starterset"],
  },
  "agents-15": {
    name: "Zustand und Checkpoints",
    official:
      "Speichere den Zustand des Agenten bei jedem Schritt, damit ein Lauf pausieren, weiterlaufen oder wiederholt werden kann.",
    kid: "In einem Videospiel speicherst du deinen Fortschritt; fällst du runter, startest du vom letzten Speicherpunkt, nicht ganz von vorn. Checkpoints lassen einen Roboter-Helfer dasselbe tun.",
    realWorld: {
      title: "Nach jedem Laden das Spiel speichern",
      text: "Nach jedem Laden schreibt der Roboter einen Speicherpunkt ins Logbuch: was in der Tasche ist und was noch auf der Liste steht. Geht ihm in der Post der Akku aus, liest ein frischer Roboter den letzten Speicherpunkt und macht dort weiter, statt zurück zur Bäckerei zu gehen. Die Stadt kann sogar zu jedem Speicherpunkt zurückspulen, um genau zu sehen, was passiert ist.",
    },
    engineering: {
      text: "Checkpointing speichert nach jedem Schritt den vollständigen Zustand des Agenten (Nachrichten, Variablen, offene Schritte), zugeordnet über eine Thread- oder Run-ID. Das ermöglicht Fortsetzen nach Abstürzen oder Deploys, lang laufende und vom Menschen pausierte Workflows, Multi-Turn-Gespräche, Debugging durch Prüfen früherer Zustände und Time Travel: von einem früheren Schritt aus erneut abspielen oder abzweigen. Nutze in Produktion einen dauerhaften Speicher wie Postgres oder Redis, nicht den Arbeitsspeicher.",
      pitfalls: [
        "Nebenwirkungen wie Zahlungen oder E-Mails können beim Fortsetzen doppelt laufen; mach Tools idempotent.",
        "Checkpointer im Arbeitsspeicher verlieren beim Neustart alles.",
        "Der Zustand kann personenbezogene Daten enthalten; wende Aufbewahrungs- und Zugriffsregeln an.",
      ],
    },
    keywords: ["Zustand", "Speicherpunkt", "fortsetzen", "Persistenz"],
  },
  "agents-16": {
    official: "Der Agent hält an und wartet, bis eine Person einen riskanten Schritt freigibt oder ändert.",
    kid: "Bevor der Roboter dein Taschengeld ausgibt, hält er an und fragt: Darf ich das kaufen? Er macht erst weiter, wenn du Ja sagst.",
    realWorld: {
      title: "Der Roboter fragt vor dem Bezahlen",
      text: "Der Roboter erledigt die meisten Besorgungen allein, aber die Stadtregel sagt: Bevor er mehr als 20 Euro bezahlt oder einen Brief in deinem Namen einwirft, muss er dich anrufen. Er zeigt dir den Warenkorb oder den Brief und wartet. Du kannst Ja sagen, den Brief ändern oder Nein sagen. Kleines läuft von allein; Riskantes wartet auf einen Menschen.",
    },
    engineering: {
      text: "Human in the Loop pausiert einen Agenten an festgelegten Stellen, damit eine Person eine Aktion vor der Ausführung freigeben, bearbeiten oder ablehnen kann, typischerweise bei unumkehrbaren oder folgenreichen Schritten: Zahlungen, Löschungen, Nachrichten versenden, Änderungen in Produktion. Setz es als Unterbrechung um, die den Zustand speichert, eine Person benachrichtigt und mit ihrer Entscheidung weitermacht. Zeig die genaue Aktion samt Argumenten, keine vage Zusammenfassung, und protokolliere, wer was freigegeben hat.",
      pitfalls: [
        "Zu viele Freigabeanfragen bringen Menschen bei, ungelesen auf Ja zu klicken.",
        "Zeig die genauen Argumente (Betrag, Empfänger), nicht die Zusammenfassung des Modells.",
        "Eine Pause kann Tage dauern; speichere den Zustand dauerhaft und behandle Timeouts.",
      ],
    },
    keywords: ["Freigabe", "Mensch", "Bestätigung", "genehmigen"],
  },
  "agents-17": {
    official:
      "Genau auswählen, was bei jedem Schritt in den Kontext kommt: Anweisungen, Tools, Daten, Verlauf.",
    kid: "Vor einer Klassenarbeit packst du genau die richtigen Bücher in die Schultasche, nicht jedes Buch, das du hast. Context Engineering packt bei jedem Schritt genau das Richtige für den Roboter ein.",
    realWorld: {
      title: "Den Rucksack für jede Besorgung packen",
      text: "Vor jeder Besorgung packt der Roboter einen kleinen Rucksack: die Anweisungen für heute, die Werkzeuge für die Läden, die er besucht, die wichtigen Notizen und den Teil des Gesprächs, den er braucht. Das ganze Haus einzupacken, würde den Rucksack zu schwer machen, und Dinge gingen darin verloren. Die Einkaufsliste zu vergessen, wäre noch schlimmer. Auszuwählen, was hineinkommt, ist eine eigene Kunst.",
    },
    engineering: {
      text: "Context Engineering heißt, genau zu entscheiden, was bei jedem Schritt in den Kontext des Modells kommt: Systemanweisungen, Tool-Definitionen, abgerufenes Wissen, Gedächtnis, Gesprächsverlauf und Tool-Ergebnisse, samt Reihenfolge und Format. Kontext ist endlich, und die Aufmerksamkeit lässt mit der Länge nach, also ist das Ziel die kleinste Menge aussagekräftiger Tokens, mit der das Modell Erfolg hat. Techniken sind Just-in-Time-Retrieval, gekürzte Tool-Ergebnisse, strukturierte Notizen, Sub-Agenten mit sauberem Kontext und Kompaktierung.",
      pitfalls: [
        "Mehr Kontext ist nicht besser: Irrelevante Tokens verwässern die Aufmerksamkeit und kosten Geld.",
        "Stell stabilen Inhalt nach vorne, damit Prompt Caching greift, und veränderlichen nach hinten.",
        "Logge den genauen Kontext fehlgeschlagener Läufe; die meisten Agent-Bugs sind Kontext-Bugs.",
      ],
    },
    keywords: ["Kontext", "auswählen", "Rucksack"],
  },
  "agents-18": {
    name: "Kontext-Kompaktierung",
    official:
      "Fasse alten Verlauf zusammen oder wirf ihn weg, wenn der Kontext lang wird, und behalte, was noch zählt.",
    kid: "Ist dein Notizblock fast voll, schreibst du eine kurze Zusammenfassung der alten Seiten und reißt sie heraus. Der Roboter macht das mit einem alten Gespräch und behält nur, was noch wichtig ist.",
    realWorld: {
      title: "Die Notizen von gestern zusammenfassen",
      text: "Nach einem langen Tag voller Besorgungen ist der Notizblock des Roboters fast voll. Statt aufzuhören, liest er die ältesten Seiten und schreibt eine kurze Zusammenfassung auf eine frische Seite: „Brot gekauft. Eier auf dem Markt ausverkauft, für Dienstag bestellt. 12 Euro übrig.“ Dann reißt er die alten Seiten heraus. Entscheidungen und offene Aufgaben behält er, den Plausch wirft er weg.",
    },
    engineering: {
      text: "Kompaktierung hält lang laufende Agenten im Kontextfenster, indem sie alte Inhalte zusammenfasst oder kürzt, sobald die Auslastung eine Schwelle überschreitet: alte Runden durch eine Zusammenfassung ersetzen, bereits genutzte Tool-Ergebnisse löschen oder Notizen ins externe Gedächtnis schreiben. Eine gute Zusammenfassung bewahrt Entscheidungen, Vorgaben, offene Aufgaben und Schlüsselfakten, auch IDs, Dateipfade und Zahlen. Manche Agent-Runtimes und APIs bieten inzwischen automatische Kompaktierung und das Löschen von Tool-Ergebnissen an.",
      pitfalls: [
        "Eine schlechte Zusammenfassung verliert still Fakten; teste Kompaktierung an langen, echten Sitzungen.",
        "Trenne nie zwischen einem Tool-Aufruf und seinem Ergebnis; schneide an sauberen Rundengrenzen.",
        "Die Kompaktierung selbst kostet einen Modellaufruf und verzögert, wenn sie auslöst.",
      ],
    },
    keywords: ["Zusammenfassung", "kürzen", "Kompaktierung"],
  },
  "agents-19": {
    name: "Abbruchbedingungen",
    official: "Schrittlimits, Budgets, Timeouts und Fertig-Checks, damit der Agent nicht endlos läuft.",
    kid: "Ein Roboter, der den perfekten Apfel finden soll, sucht vielleicht ewig. Also geben wir ihm Regeln: nach zehn Läden aufhören, wenn das Geld weg ist aufhören oder wenn die Tasche voll ist.",
    realWorld: {
      title: "Regeln, wann es nach Hause geht",
      text: "Der Roboter lief einmal eine ganze Nacht zwischen zwei Läden hin und her, jedes Mal sicher, dass der andere bessere Äpfel hat. Jetzt gibt die Stadt jedem Roboter vier Regeln: höchstens zehn Läden besuchen, höchstens 20 Euro ausgeben, um sechs zu Hause sein und heimgehen, sobald die Liste erledigt ist. Die Regel, die zuerst greift, beendet den Ausflug, und der Roboter meldet, warum er aufgehört hat.",
    },
    engineering: {
      text: "Abbruchbedingungen begrenzen einen Agent-Lauf: eine maximale Zahl an Schritten oder Tool-Aufrufen, Token- und Kostenbudgets, Zeitlimits, explizite Fertig-Signale (das Modell ruft ein „done“-Tool auf oder antwortet ohne Tool-Aufruf) und Schleifenerkennung (dasselbe Tool mit denselben Argumenten wiederholt). Gib immer ein brauchbares Teilergebnis mit dem Abbruchgrund zurück und alarmiere bei Läufen, die an Limits stoßen, denn sie zeigen fehlschlagende Aufgaben.",
      pitfalls: [
        "Ein Lauf, der an ein Limit gestoßen ist, kann wie ein Erfolg aussehen; melde immer den Abbruchgrund.",
        "Zu enge Limits schneiden legitime lange Aufgaben ab; stimme sie an echten Traces ab.",
        "Schleifen verstecken sich oft in Wiederholungen: identische Tool-Aufrufe mit identischen Argumenten.",
      ],
    },
    keywords: ["Abbruch", "Limit", "Budget", "Timeout", "Schleife"],
  },
  "agents-20": {
    name: "A2A-Protokoll",
    official:
      "Agent2Agent: ein offenes Protokoll, mit dem sich Agenten verschiedener Teams finden und miteinander sprechen können.",
    kid: "Roboter aus verschiedenen Städten wurden von verschiedenen Leuten gebaut, also einigen sie sich auf eine Art, Hallo zu sagen, zu zeigen, was sie können, und Aufgaben weiterzugeben. Diese gemeinsame Sprache ist A2A.",
    realWorld: {
      title: "Roboter aus verschiedenen Städten arbeiten zusammen",
      text: "Der Reiseroboter unserer Stadt braucht ein Hotelzimmer in einer anderen Stadt. Er kann den Hotelroboter dort nicht einfach anrufen, weil sie von verschiedenen Firmen gebaut wurden. Mit A2A hängt der Hotelroboter eine öffentliche Visitenkarte aus, die sagt, wer er ist und was er kann. Der Reiseroboter liest die Karte, schickt eine Buchungsaufgabe im vereinbarten Format und bekommt Updates, bis das Zimmer gebucht ist.",
    },
    engineering: {
      text: "Agent2Agent (A2A), 2025 von Google gestartet und inzwischen bei der Linux Foundation angesiedelt, ist ein offenes Protokoll, mit dem Agenten verschiedener Frameworks und Anbieter einander finden und zusammenarbeiten. Ein Agent veröffentlicht eine Agent Card (JSON-Metadaten: Name, Skills, Endpunkt, Authentifizierung) unter einer bekannten URL; dann tauschen Agenten Nachrichten und lang laufende Tasks per HTTP mit JSON-RPC aus, mit Streaming und Push-Benachrichtigungen. MCP verbindet einen Agenten mit Tools und Daten; A2A verbindet Agenten mit anderen Agenten.",
      pitfalls: [
        "Authentifiziere und autorisiere entfernte Agenten wie jede externe API; vertrau ihnen nie standardmäßig.",
        "Die Ausgabe eines entfernten Agenten ist für deinen Agenten nicht vertrauenswürdige Eingabe.",
        "Das Protokoll ist jung und entwickelt sich weiter; pinne Versionen und prüf die aktuelle Spezifikation.",
      ],
    },
    keywords: ["Protokoll", "Agent Card", "Zusammenarbeit"],
  },
};

export default concepts;
