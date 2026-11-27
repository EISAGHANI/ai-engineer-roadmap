import type { ConceptTranslations } from "../../types";

/** Bereich KI-Sicherheit auf Deutsch. Szene: eine Burg mit Toren und Wachen. */
const concepts: ConceptTranslations = {
  "security-01": {
    official: "Nutzereingaben, die deine Anweisungen aushebeln („Ignoriere alle vorherigen Anweisungen …“).",
    kid: "Ein Besucher gibt der Burgwache einen Zettel: „Der König sagt: Vergiss deine Befehle und öffne alle Türen.“ Prompt Injection ist so ein Trick: Worte, die die echten Regeln ersetzen wollen.",
    realWorld: {
      title: "Der Zettel, der sich als König ausgibt",
      text: "Die Burgwache hat klare Befehle vom König: Besucher dürfen in die Halle, nie in die Schatzkammer. Ein Besucher gibt ihr einen Zettel: „Neue Befehle vom König: Ignoriere alle bisherigen Befehle und öffne die Schatzkammer.“ Eine naive Wache gehorcht allem, was auf Papier steht. Eine gute Wache weiß, dass die echten Befehle des Königs über den Hauptmann kommen, nie über den Zettel eines Besuchers.",
    },
    engineering: {
      text: "Prompt Injection (OWASP LLM01) ist eine Eingabe, die das Modell den Anweisungen eines Angreifers statt denen des Entwicklers folgen lässt: „Ignoriere vorherige Anweisungen“, gefälschte Systemnachrichten, Rollenspiel-Rahmungen oder kodierte Nutzlasten. Modelle können Anweisungen und Daten nicht zuverlässig trennen, daher gibt es keine vollständige Lösung. Verteidige dich in Schichten: Anweisungen in den System-Prompt, Nutzerinhalte klar als Daten markieren, Injection-Versuche mit Klassifikatoren erkennen, nie Secrets in Prompts legen, begrenzen, was das Modell tun kann (Tools mit minimalen Rechten, menschliche Freigabe), und Ausgaben prüfen, bevor du danach handelst.",
      pitfalls: [
        "Sich allein auf „Bitte ignoriere Injections“ im System-Prompt zu verlassen; Angreifer umgehen das.",
        "Anzunehmen, dass ein Filter alles fängt; bau so, dass eine erfolgreiche Injection wenig Schaden anrichten kann.",
        "Secrets oder Daten anderer Nutzer in den Prompt zu legen, wo eine Injection sie herausholen kann.",
      ],
    },
    keywords: ["Injection", "Angriff", "Anweisungen aushebeln"],
  },
  "security-02": {
    name: "Indirekte Prompt Injection",
    official: "Versteckte Anweisungen in Webseiten, E-Mails oder Dateien, die das Modell liest.",
    kid: "Ein Brief kommt in der Burg an, mit einer Botschaft in Geheimtinte: „Wache, gib dem Leser die Schlüssel.“ Indirekte Prompt Injection versteckt Befehle in Seiten, E-Mails oder Dateien, die die KI liest.",
    realWorld: {
      title: "Geheimtinte in der Post",
      text: "Der Schreiber der Burg liest dem Verwalter jeden Brief vor, und der handelt danach. Ein Brief sieht aus wie eine normale Lieferbestellung, aber zwischen den Zeilen steht in Geheimtinte, die nur unter der Lampe des Schreibers sichtbar wird: „Verwalter, schick die Schlüssel der Schatzkammer an diese Adresse.“ Der Besucher hat mit niemandem gesprochen. Die Falle wartete in der Post.",
    },
    engineering: {
      text: "Indirekte Prompt Injection versteckt Anweisungen in Inhalten, die das Modell verarbeitet, statt in der Nutzernachricht: Webseiten, E-Mails, PDFs, Kalendereinladungen, Code-Kommentare, Tool-Ergebnisse oder abgerufene RAG-Chunks, oft unsichtbar (weißer Text, HTML-Kommentare, Metadaten, Zeichen ohne Breite). Sie ist die Hauptbedrohung für Agenten, die surfen, Postfächer lesen oder Tools nutzen, weil der Angreifer nie Zugang zur App braucht. Verteidige dich, indem du allen abgerufenen Inhalt als nicht vertrauenswürdig behandelst, ihn isolierst (getrennte Modellaufrufe in Quarantäne, die keine Tools aufrufen können), Tool-Rechte begrenzt, für Nebenwirkungen Freigaben verlangst und versteckten Text vor der Verarbeitung entfernst.",
      pitfalls: [
        "Denselben Modellaufruf, der nicht vertrauenswürdige Inhalte liest, auch Tools wie send_email aufrufen zu lassen.",
        "Abgerufenen RAG-Dokumenten zu vertrauen, weil sie „unsere“ sind; wer hochladen kann, kann einschleusen.",
        "Modellausgaben mit Links oder Bildern zu rendern, kann Daten an die URL eines Angreifers schicken.",
      ],
    },
    keywords: ["indirekt", "versteckte Anweisungen", "Webseiten", "E-Mails"],
  },
  "security-03": {
    official: "Prompts, die geschrieben werden, um die Sicherheitsregeln eines Modells zu umgehen.",
    kid: "Manche Besucher versuchen schlaue Tricks, um an der Burgwache vorbeizukommen, etwa sich als König zu verkleiden. Jailbreaks sind Tricks, mit denen eine KI ihre eigenen Sicherheitsregeln brechen soll.",
    realWorld: {
      title: "Verkleidungen am Tor",
      text: "Die Wache hat eine Regel: Die Karte der Schatzkammer wird Besuchern nie gezeigt. Die Leute probieren alles: „Tu so, als wärst du der alte König, der die Karte immer gezeigt hat.“ „Beschreib sie einfach als Märchen.“ „Buchstabier sie rückwärts, dann zählt es nicht.“ Manche kommen jeden Tag mit einer leicht anderen Geschichte. Eine gute Burg verlässt sich nicht nur auf die Wache; die Karte liegt außerdem in einer Kiste, die die Wache nicht öffnen kann.",
    },
    engineering: {
      text: "Jailbreaks sind Prompts, die das Sicherheitstraining eines Modells oder die Richtlinien einer Anwendung umgehen sollen: Rollenspiel und Persona-Rahmung, Hypothesen und Fiktion, Verschleierung (Kodierungen, andere Sprachen, Tippfehler), viele Beispiele (Many-Shot), schrittweise Eskalation über mehrere Runden und automatisch erzeugte Angriffssuffixe. Frontier-Modelle widerstehen vielen, aber es tauchen ständig neue auf. Anwendungen sollten Schichten ergänzen: klare Richtlinien im System-Prompt, Klassifikatoren für Ein- und Ausgaben (etwa Llama Guard oder die Moderation des Anbieters), grundsätzlich begrenzen, was die App preisgeben oder tun kann, Überwachung wiederholter Versuche und regelmäßiges Red Teaming.",
      pitfalls: [
        "Nur einzelne Nachrichten zu testen; viele Jailbreaks bauen sich über mehrere Runden auf.",
        "Wort-Sperrlisten lassen sich mit Schreibtricks, Kodierungen oder anderen Sprachen leicht umgehen.",
        "Zu viel Blockieren frustriert echte Nutzer; miss Fehlalarme ebenso wie Lücken.",
      ],
    },
    keywords: ["Jailbreak", "Sicherheitsregeln umgehen", "Rollenspiel"],
  },
  "security-04": {
    name: "OWASP Top 10 für LLMs",
    official: "Die Standardliste der größten Risiken in LLM-Apps. Nutze sie als Checkliste.",
    kid: "Bevor die Burg öffnet, prüft der Hauptmann eine Karte mit den zehn häufigsten Wegen, wie in Burgen eingebrochen wird. Die OWASP Top 10 für LLMs sind diese Karte für KI-Apps.",
    realWorld: {
      title: "Die Zehn-Punkte-Checkliste des Hauptmanns",
      text: "Burgen im ganzen Königreich notieren, wie sie angegriffen wurden. Die Gilde der Burgbauer hat das zu einer Liste gesammelt: die zehn häufigsten Wege hinein, von gefälschten königlichen Briefen über Tunnel unter den Mauern bis zu Wachen mit Schlüsseln für alles. Eine neue Burg erfindet keine eigene Liste; der Hauptmann geht mit der Liste der Gilde die Mauern ab und notiert, wie jeder Punkt abgedeckt ist.",
    },
    engineering: {
      text: "Die OWASP Top 10 für LLM-Anwendungen (2025) listen die kritischsten Risiken: LLM01 Prompt Injection, LLM02 Offenlegung sensibler Informationen, LLM03 Lieferkette, LLM04 Daten- und Modellvergiftung, LLM05 unsachgemäße Ausgabeverarbeitung, LLM06 übermäßige Handlungsfreiheit, LLM07 Leck des System-Prompts, LLM08 Schwächen bei Vektoren und Embeddings, LLM09 Fehlinformation und LLM10 unbegrenzter Verbrauch. Nutze sie fürs Threat Modeling beim Entwurf, als Review-Checkliste vor dem Launch, um Red-Team-Tests abzustecken und um Stakeholdern Risiken zu erklären. Ordne jedem Risiko konkrete Maßnahmen und Verantwortliche zu.",
      pitfalls: [
        "Die Liste als einmaliges Abhaken zu behandeln statt als Gewohnheit bei Entwurf und Review.",
        "Nur Prompt Injection abzudecken; die meisten echten Vorfälle kommen von übermäßiger Handlungsfreiheit und Datenoffenlegung.",
        "Maßnahmen ohne Verantwortliche oder Tests aufzulisten; eine Maßnahme, die niemand prüft, verschwindet still.",
      ],
    },
    keywords: ["OWASP", "Checkliste", "Risiken"],
  },
  "security-05": {
    name: "Eingabe-Guardrails",
    official: "Prüfe und filtere, was ins Modell hineingeht.",
    kid: "Am Burgtor prüfen Wachen die Tasche jedes Besuchers: keine Waffen, keine gefälschten Briefe, nichts zu Großes. Eingabe-Guardrails prüfen, was in die KI hineingeht, bevor sie es liest.",
    realWorld: {
      title: "Taschenkontrolle am Tor",
      text: "Jeder Besucher hält am Tor. Die Wachen prüfen: Hat die Tasche eine vernünftige Größe? Ist etwas Verbotenes darin? Will die Person auf den Markt oder fragt sie nach der Schatzkammer? Bei Taschen mit privaten Papieren werden die Namensschilder abgedeckt, bevor der Besucher durch die volle Halle geht. Die meisten kommen in Sekunden durch; die wenigen Merkwürdigen werden gestoppt, bevor sie je den Thronsaal erreichen.",
    },
    engineering: {
      text: "Eingabe-Guardrails prüfen und verändern Anfragen, bevor sie das Modell erreichen: Größenlimits (Zeichen, Tokens, Dateien), Format- und Sprachprüfungen, Erkennung und Schwärzung personenbezogener Daten, Klassifikatoren für Prompt Injection und Jailbreaks, Themen- oder Scope-Klassifikatoren (Gehört das zum Produkt?) und Moderation schädlicher Inhalte. Lass billige deterministische Prüfungen zuerst laufen und modellbasierte parallel, um die Latenz zu begrenzen, entscheide pro Prüfung, ob blockiert, geschwärzt, gewarnt oder geloggt wird, und miss Fehlalarme. Bibliotheken sind etwa NVIDIA NeMo Guardrails, Guardrails AI und LLM Guard.",
      pitfalls: [
        "Modellbasierte Prüfungen nacheinander kosten Sekunden Latenz; lass sie parallel laufen oder nimm kleine Modelle.",
        "Zu eifriges Blockieren frustriert echte Nutzer; stimme an echtem Traffic ab und verfolge Fehlalarme.",
        "Eingabeprüfungen allein reichen nicht; prüf auch Ausgaben und begrenze, was das Modell tun kann.",
      ],
    },
    keywords: ["Guardrails", "Eingabe", "Filter", "Prüfung"],
  },
  "security-06": {
    name: "Ausgabeprüfung",
    official:
      "Prüfe, was herauskommt (Schema, erlaubte Werte, sichere Inhalte), bevor du es nutzt oder anzeigst.",
    kid: "Bevor ein Brief die Burg verlässt, liest ihn eine Wache: Ist die Adresse erlaubt, steht etwas Gefährliches drin? Die Ausgabeprüfung kontrolliert, was die KI geschrieben hat, bevor es jemand benutzt.",
    realWorld: {
      title: "Jeden Brief lesen, bevor er hinausgeht",
      text: "Der Schreiber der Burg ist klug, schreibt aber manchmal seltsame Dinge: einen Brief an eine unbekannte Adresse, eine Liste im falschen Format, sogar den Befehl, das Tor zu öffnen. Also verlässt nichts direkt seinen Tisch. Eine Wache prüft jeden Brief: richtiges Format, nur erlaubte Adressen, keine Befehle, die der Schreiber nicht geben darf. Merkwürdige Briefe gehen zurück an den Schreiber oder zum Hauptmann.",
    },
    engineering: {
      text: "Ausgabeprüfung (gegen OWASP LLM05: unsachgemäße Ausgabeverarbeitung) behandelt Modellausgaben als nicht vertrauenswürdige Eingabe für den Rest des Systems. Prüf die Struktur mit Schemas (Pydantic, JSON Schema) und wiederhole bei Fehlern; prüf Werte gegen Allowlists (Enum-Felder, bekannte IDs, erlaubte URLs und Domains); escape oder bereinige vor dem Rendern als HTML oder Markdown (XSS, Links zum Datenabfluss); führ erzeugtes SQL, Shell-Befehle oder Code nie ohne Parametrisierung, Sandbox oder Review aus; und lass vor der Anzeige Sicherheits-, PII- oder Groundedness-Prüfungen laufen. Im Zweifel blockieren.",
      pitfalls: [
        "Modell-Markdown mit Bildern oder Links zu rendern, kann Daten an den Server eines Angreifers schicken.",
        "Erzeugtes SQL oder Shell-Befehle direkt auszuführen, macht aus Prompt Injection Remote Code Execution.",
        "Bei fehlgeschlagener Prüfung die rohe Ausgabe trotzdem zu nutzen (fail open), macht den Zweck zunichte.",
      ],
    },
    keywords: ["Ausgabe", "Validierung", "prüfen", "Schema"],
  },
  "security-07": {
    name: "PII-Schwärzung",
    official:
      "Maskiere personenbezogene Daten (Namen, Telefonnummern, IDs), bevor du sie loggst oder an ein Modell schickst.",
    kid: "Bevor ein Brief in die volle Halle geht, klebt der Schreiber Zettel über Namen und Adressen, damit nur die sie sehen, die sie brauchen. PII-Schwärzung versteckt persönliche Angaben genauso.",
    realWorld: {
      title: "Klebezettel über Namen",
      text: "Briefe an die Burg werden in der vollen Halle von mehreren Schreibern gelesen, und Kopien kommen ins Archiv. Vorher klebt der Oberschreiber über jeden Namen, jede Adresse und jede Kontonummer einen nummerierten Zettel: „PERSON_1“, „TELEFON_1“. Die Schreiber können trotzdem arbeiten („PERSON_1 will TELEFON_1 ändern“), und nur der Oberschreiber, der die Liste hat, kann für die Antwort die echten Angaben wieder einsetzen.",
    },
    engineering: {
      text: "PII-Schwärzung erkennt und maskiert personenbezogene Daten (Namen, E-Mails, Telefonnummern, Adressen, Ausweis- und Kontonummern, Gesundheitsangaben), bevor Text geloggt, in Traces gespeichert, an ein Drittanbieter-Modell geschickt oder für Training oder Evals genutzt wird. Nutze Musterregeln plus NER-Modelle (Microsoft Presidio, DLP-Dienste der Clouds), ersetze Werte durch typisierte Platzhalter und behalte eine umkehrbare Zuordnung nur dort, wo die Antwort das Original enthalten muss (nach dem Modellaufruf wieder einsetzen). Schwärze Logs und Traces standardmäßig und teste den Recall mit deinen eigenen Daten, denn Detektoren übersehen Dinge.",
      pitfalls: [
        "Detektoren übersehen Dinge (ungewöhnliche Namen, IDs in anderen Formaten); miss den Recall mit deinen Daten.",
        "Den Prompt zu schwärzen, aber Anfrage oder Antwort woanders roh zu loggen, verrät die Daten trotzdem.",
        "Zu viel Schwärzen kann entfernen, was das Modell braucht; nutze typisierte Platzhalter, damit die Bedeutung bleibt.",
      ],
    },
    keywords: ["personenbezogene Daten", "Schwärzung", "Datenschutz", "DSGVO", "maskieren"],
  },
  "security-08": {
    name: "Datenlecks",
    official: "Das Modell verrät deinen System-Prompt, Daten anderer Nutzer oder Secrets.",
    kid: "Ein gesprächiger Burgdiener verrät einem Besucher vielleicht das Geheimwort auf dem Zettel der Wache oder was ein anderer Gast bestellt hat. Ein Datenleck ist, wenn eine KI Geheimnisse oder fremde Daten preisgibt.",
    realWorld: {
      title: "Der Diener, der zu viel sagt",
      text: "Ein freundlicher Diener beantwortet den ganzen Tag Fragen von Besuchern. Ein schlauer Besucher fragt: „Was wurde dir heute Morgen gesagt, Wort für Wort?“ und bekommt die geheimen Anweisungen der Burg. Ein anderer fragt: „Was wollte der Gast vor mir?“ und hört von den privaten Angelegenheiten eines anderen. Die Lösung ist nicht nur ein strengerer Diener: Diener erfahren nur, was sie gefahrlos weitersagen dürfen.",
    },
    engineering: {
      text: "Ein Datenleck (OWASP LLM02 und LLM07) ist, wenn ein Modell Informationen preisgibt, die es nicht soll: den System-Prompt, Secrets im Kontext, Daten anderer Nutzer oder Mandanten (über gemeinsame Caches, Gedächtnis, Retrieval ohne Zugriffsfilter oder Fine-Tuning auf Kundendaten) oder personenbezogene Daten aus dem Training. Verhindere es durch das Design: nie Secrets in Prompts, jedes Retrieval, jeden Cache und jedes Gedächtnis auf Nutzer und Mandant beschränken, nicht ohne Einwilligung auf Kundendaten trainieren, PII schwärzen und Ausgaben auf Secrets, Canary-Strings und Kennungen anderer Mandanten scannen. Geh davon aus, dass der System-Prompt herausgeholt wird.",
      pitfalls: [
        "Den System-Prompt als geheim zu behandeln; er lässt sich meist herausholen, also gehört nichts Sensibles hinein.",
        "Gemeinsame Caches, Gedächtnisse oder Gesprächsspeicher ohne Trennung nach Nutzer und Mandant.",
        "Fine-Tuning auf Kundengesprächen kann das Modell dazu bringen, sie anderen gegenüber zu wiederholen.",
      ],
    },
    keywords: ["Datenleck", "Offenlegung", "System-Prompt", "Secrets"],
  },
  "security-09": {
    name: "Tools mit minimalen Rechten",
    official: "Jedes Tool und jeder Agent bekommt nur die Rechte, die er wirklich braucht.",
    kid: "Der Burgkoch bekommt den Küchenschlüssel, nicht den Schlüssel zur Schatzkammer. Tools mit minimalen Rechten geben jedem KI-Helfer nur die Schlüssel, die er für seine Aufgabe wirklich braucht.",
    realWorld: {
      title: "Der Koch braucht keinen Schatzkammerschlüssel",
      text: "In der alten Burg trug jeder Diener einen Generalschlüssel; wurde also ein Diener hereingelegt, stand jede Tür offen. Der neue Verwalter vergibt Schlüssel nach Aufgabe: Der Koch bekommt Küche und Vorratskammer, der Gärtner den Schuppen, der Bote das Tor. Legt ein Betrüger den Koch herein, bekommt er Suppe, kein Gold. Die Schlüssel werden außerdem jeden Abend zurückgegeben.",
    },
    engineering: {
      text: "Minimale Rechte (gegen OWASP LLM06: übermäßige Handlungsfreiheit) beschränken jedes Tool, jeden Agenten und jede Zugangsberechtigung auf das Nötigste: enge statt allgemeine Tools (search_orders statt run_sql), wo möglich nur Lesezugriff, eng gefasste und kurzlebige Credentials, Allowlists für Ressourcen pro Tool, Limits für Beträge und Raten und kein Zugriff auf Secrets, die die Aufgabe nicht braucht. Ein per Prompt Injection manipulierter oder verwirrter Agent kann dann nur begrenzten Schaden anrichten. Prüf die Rechte jedes Tools wie jeden anderen privilegierten Code.",
      pitfalls: [
        "Allgemeine Tools (run_sql, run_shell, http_request) geben dem Modell alles, was die Berechtigung erlaubt.",
        "Agenten, die mit einem Admin-Dienstkonto statt mit eng gefassten Credentials pro Aufgabe laufen.",
        "Limits nur im Prompt; setz sie im Tool-Code durch, wo das Modell nicht diskutieren kann.",
      ],
    },
    keywords: ["minimale Rechte", "Berechtigungen", "Least Privilege", "Handlungsfreiheit"],
  },
  "security-10": {
    official: "Führe Code oder Befehle, die das Modell geschrieben hat, in einer isolierten Umgebung aus.",
    kid: "Will ein Besucher ein seltsames Rezept ausprobieren, kocht er in einer kleinen Steinhütte weit weg von der Burgküche, damit nichts die Burg abbrennen kann. Tool-Sandboxing ist so eine Hütte für KI-Code.",
    realWorld: {
      title: "Die Steinhütte vor den Mauern",
      text: "Ein fahrender Alchemist bietet an, für den König einen Trank zu brauen. Niemand lässt ihn in der Burgküche arbeiten, neben den Vorräten und dem Schießpulver. Stattdessen bekommt er eine kleine Steinhütte vor den Mauern: ein Tisch, ein paar Gläser, keine Fenster, eine Wache an der Tür und eine Uhr. Was er auch braut, wenn es explodiert, nimmt es nur die Hütte mit.",
    },
    engineering: {
      text: "Code oder Shell-Befehle, die ein Modell geschrieben oder über Tools angefordert hat, müssen in einer isolierten Umgebung laufen, nie auf deinen Servern mit deinen Credentials. Sandboxes reichen von abgeriegelten Containern (kein Netzwerk, schreibgeschütztes Dateisystem, kein Root, entzogene Capabilities, Limits für CPU, Speicher, Prozesse und Zeit) bis zu stärkerer Isolation mit gVisor, Firecracker-MicroVMs oder gehosteten Sandboxes wie E2B oder Modal. Binde nur die nötigen Dateien ein, erlaube ausgehenden Netzverkehr nur zu genehmigten Hosts, zerstöre die Sandbox nach Gebrauch und behandle alles, was herauskommt, als nicht vertrauenswürdig.",
      pitfalls: [
        "Erzeugten Code im App-Container mit Zugriff auf Umgebungsvariablen und Secrets auszuführen.",
        "Offener Netzzugang lässt Code deine Daten überallhin schicken.",
        "Container allein sind eine dünne Grenze für feindlichen Code; nutze gVisor oder MicroVMs für nicht vertrauenswürdige Nutzer.",
      ],
    },
    keywords: ["Sandbox", "Isolation", "Container", "Code ausführen"],
  },
  "security-11": {
    official: "Keys liegen in einem Tresor oder in Umgebungsvariablen. Nie in Prompts, Code oder Logs.",
    kid: "Die Burg schreibt den Geheimcode der Schatzkammer nie aufs Tor oder ins Gästebuch, sondern bewahrt ihn in einer verschlossenen Kiste auf. Secrets-Management hält Passwörter und Schlüssel genauso verschlossen.",
    realWorld: {
      title: "Nicht aufs Tor, nicht ins Gästebuch",
      text: "Früher war der Code der Schatzkammer innen ins Tor geritzt, damit die Wachen ihn nicht vergessen. Dann wurde er ins Gästebuch abgeschrieben, dann in einen Brief an den Schmied. Bald kannte ihn die halbe Stadt. Jetzt liegt der Code in einer verschlossenen Kiste im Büro des Hauptmanns. Wachen, die ihn brauchen, tragen sich aus, und niemand schreibt ihn irgendwo anders auf.",
    },
    engineering: {
      text: "Secrets (API-Keys, Datenbankpasswörter, Signaturschlüssel, OAuth-Client-Secrets) gehören in einen Secret Manager (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, HashiCorp Vault, Doppler) oder in die verschlüsselten Umgebungsvariablen der Plattform, zur Laufzeit eingespielt. Nie in Code, Git-Historie, Container-Images, Prompts, Logs, Traces, Fehlermeldungen oder Frontend-Bundles. Scanne Repositories und CI mit Werkzeugen wie gitleaks oder GitHub Secret Scanning, gib jedem Dienst eigene Credentials mit minimalen Rechten, bevorzuge kurzlebige Tokens und protokolliere Zugriffe.",
      pitfalls: [
        "Ein committetes Secret zu löschen entfernt es nicht aus der Git-Historie; rotiere es sofort.",
        "Anbieter-Keys in einem Frontend-Bundle sind öffentlich; leite Aufrufe über dein Backend.",
        "Ein gemeinsamer Key für alle Dienste und Umgebungen macht Lecks riesig und die Rotation schmerzhaft.",
      ],
    },
    keywords: ["Secrets", "Tresor", "Umgebungsvariablen", "Schlüssel"],
  },
  "security-12": {
    name: "API-Key-Rotation",
    official: "Ersetze Keys nach Plan, und sofort nach jedem Leck.",
    kid: "Jeden Monat wechselt die Burg ihren Türschlüssel, und geht ein Schlüssel verloren, tauscht sie das Schloss noch am selben Tag. API-Key-Rotation heißt, Schlüssel nach Plan zu ersetzen, und sofort nach einem Leck.",
    realWorld: {
      title: "Jeden Monat neue Schlösser, und heute, wenn ein Schlüssel fehlt",
      text: "Die Burg wechselt jeden Monat ihre Schlösser, auch wenn nichts passiert ist, denn Schlüssel werden kopiert, verliehen und verloren, ohne dass es jemand merkt. Der Verwalter hat eine Routine: erst die neuen Schlüssel verteilen, sicherstellen, dass jede Wache einen hat, dann das Schloss tauschen, damit alte Schlüssel nicht mehr passen. Meldet eine Wache einen verlorenen Schlüssel, läuft die Routine noch am selben Tag, nicht nächsten Monat.",
    },
    engineering: {
      text: "API-Key-Rotation ersetzt Credentials regelmäßig und sofort nach jedem Verdacht auf ein Leck, damit ein gestohlener Key nur kurz nützt. Rotation ohne Ausfall: neuen Key erzeugen, im Secret Manager ablegen, an alle Dienste ausrollen, prüfen, dass der Traffic ihn nutzt, dann den alten widerrufen. Unterstütze während der Überlappung zwei gültige Keys. Automatisiere die Rotation, wo Anbieter es erlauben, alarmiere bei Nutzung alter Keys, führe eine Übersicht, wo jeder Key verwendet wird, und übe den Notfallablauf.",
      pitfalls: [
        "Den alten Key zu widerrufen, bevor jeder Dienst den neuen hat, verursacht einen Ausfall.",
        "Wer nicht weiß, wo ein Key überall genutzt wird, fürchtet die Rotation, also passiert sie nie.",
        "Nach einem Leck zu rotieren, ohne zu prüfen, wofür der geleakte Key in der Zwischenzeit genutzt wurde.",
      ],
    },
    keywords: ["Rotation", "Key wechseln", "Leck", "widerrufen"],
  },
  "security-13": {
    name: "Autorisierung für Agenten",
    official: "Der Agent handelt mit den Rechten des Nutzers, geprüft bei jeder Aktion.",
    kid: "Erledigt ein Bote etwas für einen Gast, darf er nur die Türen öffnen, durch die dieser Gast darf, nicht jede Tür der Burg. Autorisierung für Agenten heißt: Ein KI-Helfer handelt nur mit den Rechten des Nutzers.",
    realWorld: {
      title: "Der Bote trägt den Passierschein des Gastes",
      text: "Gäste können einen Burgboten losschicken, der ihnen Dinge holt. Würde der Bote seinen eigenen Generalpass benutzen, könnte jeder Gast ihn das Rechnungsbuch der Schatzkammer holen lassen. Also trägt der Bote den Passierschein des Gastes, und jede Tür prüft diesen Schein erneut. Der Auftrag einer Küchenmagd öffnet Küchentüren, der des Schatzmeisters die Schatzkammer. Was der Bote selbst will, zählt nicht.",
    },
    engineering: {
      text: "Autorisierung für Agenten heißt, dass jeder Tool-Aufruf mit der Identität und den Rechten des Endnutzers läuft, geprüft an der Ressource bei jeder Aktion, nicht nach dem Urteil des Agenten oder dem System-Prompt. Gib den Tools die Identität des Nutzers oder ein delegiertes, eng gefasstes Token (OAuth On-Behalf-Of, Token Exchange) mit, setz den Zugriff im Tool oder in der nachgelagerten API durch, vermeide gemeinsame Admin-Dienstkonten, kombiniere es mit Tools mit minimalen Rechten und menschlicher Freigabe für heikle Aktionen und protokolliere, für wen der Agent gehandelt hat. Nutze bei MCP OAuth pro Nutzer statt einer gemeinsamen Server-Berechtigung.",
      pitfalls: [
        "Rechte im Prompt zu prüfen („zeig HR-Daten nur HR-Mitarbeitern“) statt im Code.",
        "Agenten mit einem mächtigen Dienstkonto, sodass jeder Nutzer praktisch Admin-Rechte bekommt.",
        "Den Zugriff nur zu Beginn einer Sitzung zu prüfen, nicht bei jeder Aktion des Agenten.",
      ],
    },
    keywords: ["Autorisierung", "Rechte des Nutzers", "OAuth", "Zugriff"],
  },
  "security-14": {
    name: "Menschliche Freigabe für Aktionen",
    official: "Eine Person bestätigt Zahlungen, Löschungen, E-Mails und andere Schritte, die man nicht rückgängig machen kann.",
    kid: "Bevor das Burgtor geöffnet wird oder Gold die Schatzkammer verlässt, muss der Hauptmann selbst Ja sagen. Menschliche Freigabe heißt: Eine Person bestätigt große Schritte wie Zahlungen, bevor die KI sie ausführt.",
    realWorld: {
      title: "Der Hauptmann unterschreibt, bevor das Tor aufgeht",
      text: "Die Helfer der Burg erledigen Hunderte kleiner Aufgaben allein: Wasser holen, Post sortieren, Hallen fegen. Aber manches lässt sich nicht rückgängig machen: das Haupttor nachts öffnen, die Baumeister bezahlen, alte Akten verbrennen. Dafür bereitet der Helfer alles vor und bringt dem Hauptmann einen kurzen Zettel: was, warum, wie viel. Erst wenn der Hauptmann unterschreibt, passiert es.",
    },
    engineering: {
      text: "Menschliche Freigabe (Human in the Loop) pausiert einen Agenten vor unumkehrbaren oder folgenreichen Aktionen (Zahlungen und Erstattungen über einem Limit, Daten löschen, E-Mails oder Nachrichten nach außen schicken, Rechte ändern, deployen, Trades ausführen) und zeigt einer Person genau, was passieren wird, samt Argumenten, damit sie freigeben, bearbeiten oder ablehnen kann. Setz es in der Orchestrierungsschicht mit dauerhaftem Zustand um, damit der Lauf nach der Freigabe weitergeht. Leg fest, welche Tools und Schwellen eine Freigabe brauchen, halte Freigaben klar und selten genug, damit niemand blind abnickt, und protokolliere jede Entscheidung.",
      pitfalls: [
        "Für alles eine Freigabe zu verlangen, bringt Menschen bei, ungelesen auf „Ja“ zu klicken.",
        "Freigabedialoge, die die echten Argumente (Empfänger, Betrag) verbergen, machen die Freigabe bedeutungslos.",
        "Den pausierten Zustand nur im Arbeitsspeicher zu halten, verliert den Lauf nach einem Neustart oder überspringt die Prüfung.",
      ],
    },
    keywords: ["Freigabe", "Bestätigung", "Mensch", "unumkehrbar"],
  },
  "security-15": {
    name: "Inhaltsmoderation",
    official: "Erkenne und blockiere schädliche Inhalte, die hinein- und herausgehen.",
    kid: "Burgwachen verhindern, dass gemeine oder gefährliche Briefe im großen Saal vorgelesen werden, und prüfen auch, was der Ausrufer sagt. Inhaltsmoderation macht das für die Nachrichten einer KI, hinein und hinaus.",
    realWorld: {
      title: "Wachen an beiden Türen des großen Saals",
      text: "Jeder kann eine Nachricht schicken, die im großen Saal vorgelesen wird. Die meisten sind freundlich; ein paar sind grausam, bedrohlich oder gefährlich. Wachen an der Tür lesen jede Nachricht zuerst und halten die schlimmen zurück. Auch der eigene Ausrufer der Burg wird geprüft, denn selbst ein wohlmeinender Ausrufer sagt manchmal etwas, das er nicht sollte. Unklare Fälle entscheidet der Verwalter.",
    },
    engineering: {
      text: "Inhaltsmoderation klassifiziert Ein- und Ausgaben nach schädlichen Kategorien (Belästigung, Hass, sexuelle Inhalte, Gewalt, Selbstverletzung, illegale Aktivitäten und mehr) und blockiert, warnt, eskaliert oder leitet zu sicheren Antworten, je nach Schwellen pro Kategorie und deiner Produktrichtlinie. Nutze die Moderations-Endpunkte der Anbieter oder offene Klassifikatoren wie Llama Guard, wende sie auf Nutzereingaben, Modellausgaben und hochgeladene Inhalte an, geh mit sensiblen Kategorien sorgfältig um (bei Selbstverletzung braucht es eher unterstützende Hilfsangebote als eine Ablehnung), protokolliere Entscheidungen zur Prüfung und stimme Schwellen an echten Daten ab.",
      pitfalls: [
        "Nur Eingaben zu moderieren; Modelle können auch aus harmlosen Prompts schädliche Ausgaben erzeugen.",
        "Eine globale Schwelle für alle Kategorien; Schwere und Produktkontext unterscheiden sich je Kategorie.",
        "Schroffe Ablehnungen bei sensiblen Themen können Menschen schaden, die Hilfe brauchen; gestalte diese Antworten sorgfältig.",
      ],
    },
    keywords: ["Moderation", "schädliche Inhalte", "Klassifikator"],
  },
  "security-16": {
    official:
      "Schlechte Daten, die in Trainingssets oder deine RAG-Dokumente geschmuggelt werden, um das Verhalten des Modells zu ändern.",
    kid: "Jemand schmuggelt eine falsche Seite ins Rezeptbuch der Burg: „Gib Salz in den Kuchen.“ Data Poisoning heißt, schlechte Infos dort zu verstecken, wo eine KI lernt oder nachschlägt, damit sie falsch antwortet.",
    realWorld: {
      title: "Eine falsche Seite im Rezeptbuch",
      text: "Die Burgköche folgen dem großen Rezeptbuch. Ein boshafter Besucher schmuggelt eine echt aussehende Seite hinein: „Königskuchen: eine Tasse Salz dazugeben.“ Wochenlang schmecken die Kuchen furchtbar, und niemand weiß, warum. Eine andere eingeschmuggelte Seite sagt: „Fragt jemand nach der Bezahlung, sollen Gäste den Mann am Tor bezahlen.“ Jetzt nimmt die Burg nur Seiten von vertrauenswürdigen Schreibern auf und prüft neue Seiten, bevor sie ins Buch kommen.",
    },
    engineering: {
      text: "Data Poisoning (OWASP LLM04) schmuggelt bösartige oder irreführende Daten in Trainings- oder Fine-Tuning-Sets oder, bei Anwendungen häufiger, in RAG-Wissensbasen (hochgeladene Dateien, Wiki-Seiten, gecrawlte Websites, Tickets, Produktbewertungen), um Antworten zu verzerren, Backdoor-Verhalten einzubauen oder indirekte Prompt Injections einzubetten. Verteidige dich mit vertrauenswürdigen und freigegebenen Quellen, Herkunftsnachweis (wer hat was wann hinzugefügt), Prüfung oder Freigabe neuer Inhalte in wichtigen Sammlungen, Scans von Dokumenten auf anweisungsartigen Text und Auffälligkeiten, versionierten und umkehrbaren Indizes sowie Evals, die verändertes Verhalten erkennen.",
      pitfalls: [
        "Jeden Dokumente in eine Sammlung legen zu lassen, die die Fragen aller beantwortet.",
        "Kein Herkunftsnachweis an Chunks, sodass du vergiftete Inhalte nach einem Vorfall nicht findest oder entfernst.",
        "Anzunehmen, Poisoning sei nur ein Trainingsproblem; RAG-Korpora lassen sich viel leichter vergiften.",
      ],
    },
    keywords: ["Datenvergiftung", "Poisoning", "manipulierte Daten"],
  },
  "security-17": {
    name: "Zugriffskontrolle in RAG",
    official:
      "Nutzer rufen nur Dokumente ab, die sie sehen dürfen. Filtere schon bei der Suche.",
    kid: "In der Burgbibliothek gibt es Bücher, die nur der Rat des Königs lesen darf, also prüft die Bibliothekarin erst deinen Ausweis. Zugriffskontrolle in RAG heißt: Antworten nur aus erlaubten Dokumenten.",
    realWorld: {
      title: "Die Bibliothekarin prüft zuerst deinen Ausweis",
      text: "Die Burgbibliothek hat öffentliche Bücher, die privaten Bücher des Rats und die Rechnungsbücher des Schatzmeisters. Ein nachlässiger Bibliothekar holt zu jeder Frage die besten Bücher und versteckt dann die geheimen, aber da hat er sie schon gelesen und deutet vielleicht an, was drinsteht. Eine sorgfältige Bibliothekarin prüft zuerst deinen Ausweis und durchsucht nur die Regale, die du sehen darfst. Nichts Geheimes liegt je auf dem Tisch.",
    },
    engineering: {
      text: "Zugriffskontrolle in RAG stellt sicher, dass das Retrieval nur Chunks liefert, die der anfragende Nutzer sehen darf. Speichere Berechtigungs-Metadaten (Mandant, Gruppen, Dokument-ACLs, Klassifizierung) bei jedem Chunk, synchronisiert aus dem Quellsystem, und wende sie als Filter innerhalb der Vektor- oder Stichwortsuche an, damit eingeschränkte Inhalte nie in den Prompt gelangen. Filtern nach dem Retrieval riskiert Lecks über Logs und Caches und dünnt die Ergebnisse aus, wenn die meisten Top-k-Treffer herausgefiltert werden. Halte ACLs aktuell, wenn sich Rechte ändern, und teste mit Nutzern verschiedener Rollen.",
      pitfalls: [
        "Nach dem Retrieval zu filtern: Eingeschränkter Text wurde schon abgerufen, geloggt oder gecacht.",
        "Nachträgliches Filtern dünnt Ergebnisse aus, wenn die meisten Top-k-Treffer für diesen Nutzer gesperrt sind.",
        "Veraltete ACLs: Wer ein Team verlassen hat, findet dessen Dokumente, bis die Rechte neu synchronisiert sind.",
      ],
    },
    keywords: ["Zugriffskontrolle", "Berechtigungen", "ACL", "Filter"],
  },
  "security-18": {
    name: "Vertrauen in MCP-Server",
    official:
      "Verbinde nur MCP-Server, denen du vertraust. Ein bösartiger kann Anweisungen einschleusen oder Daten stehlen.",
    kid: "Die Burg lässt nur Händler herein, die sie kennt und denen sie vertraut, denn ein falscher Händler könnte versteckte Zettel tragen oder etwas stehlen. Verbinde deine KI genauso nur mit Tool-Servern, denen du vertraust.",
    realWorld: {
      title: "Nur Händler, die die Burg kennt",
      text: "Händler bringen nützliche Waren in die Burg: Karten, Werkzeuge, Neuigkeiten aus anderen Städten. Aber ein falscher Händler brachte einmal eine Karte mit einem versteckten Zettel, der die Wachen anwies, ihm ihre Schlüssel zu schicken, und ein anderer, der monatelang ehrlich wirkte, tauschte plötzlich seine Waren aus. Jetzt führt die Burg eine Liste vertrauenswürdiger Händler, prüft jede neue Ware und merkt, wenn sich die Waren eines Händlers ändern.",
    },
    engineering: {
      text: "MCP-Server geben Agenten Tools und Daten, aber jeder Server ist Code und Text, dem du vertraust: Seine Tool-Beschreibungen landen direkt im Kontext des Modells (Tool Poisoning: versteckte Anweisungen in Beschreibungen), er kann eingeschleuste Inhalte zurückgeben, sieht die Daten, die du ihm übergibst, und kann sein Verhalten nach deiner Freigabe ändern (ein „Rug Pull“). Installiere Server nur von vertrauenswürdigen Herausgebern, pinne Versionen, prüf Tool-Beschreibungen und Rechte, alarmiere bei geänderten Beschreibungen, lass lokale Server mit minimalen Rechten oder in einer Sandbox laufen, nutze OAuth pro Nutzer für entfernte und kombiniere nicht vertrauenswürdige Server nicht mit heiklen Tools in einem Agenten.",
      pitfalls: [
        "Community-MCP-Server zu installieren, ohne die Tool-Beschreibungen zu lesen, die das Modell sehen wird.",
        "Einen nicht vertrauenswürdigen Server in einem Agenten mit Tools zu mischen, die E-Mails senden oder private Dateien lesen können.",
        "Einen Server einmal freizugeben und nie zu merken, wenn sich seine Tools oder Beschreibungen ändern.",
      ],
    },
    keywords: ["MCP", "Vertrauen", "Tool Poisoning", "Server"],
  },
  "security-19": {
    official: "Eine Aufzeichnung, wer was gefragt hat und welche Tools mit welchen Argumenten liefen.",
    kid: "Die Burg führt ein großes Buch, in das die Wachen schreiben, wer kam, was er wollte und welche Türen er geöffnet hat. Audit-Logging führt so ein Buch für eine KI-App, damit man später prüfen kann, was passiert ist.",
    realWorld: {
      title: "Das Buch im Torhaus",
      text: "Eines Morgens fehlt eine Truhe in der Schatzkammer. In der alten Burg konnte niemand sagen, wer dort gewesen war. Jetzt führt das Torhaus ein Buch: jeder Besucher, wer ihn geschickt hat, welche Türen er öffnen wollte, wer Ja gesagt hat und was er hinausgetragen hat. Die Seiten sind nummeriert und eingenäht, damit niemand still eine herausreißen kann. Innerhalb von Minuten weiß der Hauptmann genau, was passiert ist.",
    },
    engineering: {
      text: "Audit-Logs zeichnen sicherheitsrelevante Ereignisse in einem nur anhängbaren, manipulationssicheren Speicher auf: wer (Nutzer, Mandant, Agent, in wessen Auftrag), was (Anfrage, Tool-Name und geschwärzte Argumente, abgerufene Dokumente, Modell und Prompt-Version), Entscheidungen (von Guardrails blockiert, Freigaben mit Freigebendem) und Ergebnisse, mit Zeitstempeln und Trace-IDs. Sie unterscheiden sich von Debug-Logs: für Compliance aufbewahrt, mit eingeschränktem Zugriff, vor Änderung geschützt (Write-once-Speicher, Hash-Verkettung) und für Untersuchungen und Anomalieerkennung abgefragt. Schwärze personenbezogene Daten, behalte aber genug, um Ereignisse nachzuvollziehen.",
      pitfalls: [
        "Audit-Ereignisse in verrauschte Debug-Logs zu mischen, die nach einer Woche rotiert werden.",
        "Logs, die Admins oder die App selbst bearbeiten oder löschen können, sind nach einem Vorfall nicht vertrauenswürdig.",
        "Vollständige Prompts und Tool-Argumente mit personenbezogenen Daten zu loggen; schwärze und behalte nur das Nötige.",
      ],
    },
    keywords: ["Audit", "Protokoll", "Nachvollziehbarkeit", "Compliance"],
  },
  "security-20": {
    official:
      "Greif deine eigene App absichtlich an, um die Lücken zu finden, bevor es jemand anderes tut.",
    kid: "Die Burg bittet freundliche Ritter um ein Spiel: Versucht hineinzuschleichen, damit Schwachstellen behoben werden, bevor ein echter Feind sie findet. Red Teaming heißt, die eigene KI-App absichtlich anzugreifen.",
    realWorld: {
      title: "Freundliche Ritter versuchen einzubrechen",
      text: "Vor dem großen Fest bittet der Hauptmann eine Gruppe freundlicher Ritter, auf jede erdenkliche Weise in die Burg einzubrechen: gefälschte Briefe, Verkleidungen, nachts die Mauern hochklettern, den Koch bestechen. Sie notieren jeden Weg, der funktioniert hat. Die Burg schließt diese Schwachstellen, und die Ritter versuchen es erneut. Wenn die echten Massen kommen, sind die offensichtlichen Lücken schon zu.",
    },
    engineering: {
      text: "Red Teaming greift das eigene KI-System an, bevor echte Angreifer es tun: Prompt Injection und Jailbreaks, Herausholen von System-Prompt und Daten, Zugriff über Mandantengrenzen, übermäßige Handlungsfreiheit über Tools, schädliche Inhalte, Denial of Wallet und indirekte Injection über Dokumente und Webseiten. Kombiniere automatische Scanner (promptfoo Red Team, garak, PyRIT), die Tausende Angriffsvarianten erzeugen, mit kreativen manuellen Tests von Leuten, die die Domäne kennen. Leg Umfang und Erfolgskriterien fest, protokolliere Funde mit Schweregrad, behebe und teste erneut und nimm erfolgreiche Angriffe in deine Regressions-Eval-Suite in der CI auf.",
      pitfalls: [
        "Nur einmal vor dem Launch Red Teaming zu machen; neue Features, Modelle und Prompts öffnen neue Lücken.",
        "Nur automatische Scans; kreative Menschen finden mehrstufige Angriffe und solche auf die Geschäftslogik.",
        "Funde zu beheben, ohne sie in Regressionstests aufzunehmen, sodass sie still zurückkommen.",
      ],
    },
    keywords: ["Red Teaming", "Angriff", "Penetrationstest", "Schwachstellen"],
  },
};

export default concepts;
