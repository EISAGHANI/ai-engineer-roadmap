import type { ConceptTranslations } from "../../types";

/** Bereich Backend auf Deutsch. Szene: eine Post. */
const concepts: ConceptTranslations = {
  "backend-01": {
    name: "REST-APIs",
    official: "URLs für Ressourcen + HTTP-Methoden (GET, POST, PUT, DELETE), um deine App bereitzustellen.",
    kid: "Eine Post hat für jede Art von Erledigung einen eigenen Schalter: Brief verschicken, Paket abholen, Adresse ändern. REST-APIs geben einer App solche klaren Schalter, damit andere Programme wissen, wo sie was fragen.",
    realWorld: {
      title: "Schalter mit klaren Schildern",
      text: "In unserer Post hat jeder Schalter ein Schild. „Pakete“ ist der Ort, wo Pakete wohnen. Du kannst eins ansehen (zeig mir Paket 42), ein neues abgeben, seine Adresse ändern oder es stornieren. Weil jeder Schalter denselben Regeln folgt, weiß ein neuer Besucher, was zu tun ist, ohne zu fragen. REST funktioniert genauso: Substantive in der Adresse und eine Handvoll Standardverben für das, was passieren soll.",
    },
    engineering: {
      text: "REST-APIs stellen Ressourcen unter URLs bereit (/documents, /documents/42) und nutzen HTTP-Methoden für Aktionen: GET liest, POST erstellt, PUT oder PATCH ändert, DELETE entfernt. Anfragen und Antworten sind meist JSON, jede Anfrage trägt alles Nötige mit (zustandslos), und Statuscodes melden das Ergebnis. Gutes REST-Design nutzt Substantive im Plural, einheitliche Namen, Versionierung (/v1), Paginierung für Listen und ein veröffentlichtes OpenAPI-Schema. FastAPI erzeugt dieses Schema und die Validierung aus Type Hints.",
      pitfalls: [
        "Verben in URLs (/getDocument, /deleteDoc) vermischen Ressource und Aktion; nutze stattdessen Methoden.",
        "GET darf nie Daten ändern; Crawler, Caches und Prefetching rufen es ungefragt auf.",
        "Die Form einer Antwort ohne Versionierung zu ändern, bricht jeden Client, der sich darauf verlässt.",
      ],
    },
    keywords: ["REST", "Schnittstelle", "Endpunkte", "Ressourcen"],
  },
  "backend-02": {
    name: "HTTP und Statuscodes",
    official: "Wie Anfragen und Antworten funktionieren und was 200, 201, 400, 401, 404, 429 und 500 bedeuten.",
    kid: "Wenn du einen Brief schickst, stempelt die Post eine kurze Notiz auf die Antwort: zugestellt, falsche Adresse oder später wiederkommen. HTTP-Statuscodes sind diese kurzen Notizen für Apps, als Zahlen.",
    realWorld: {
      title: "Der Stempel auf jeder Antwort",
      text: "Jede Antwort unserer Post bekommt einen Stempel. „Zugestellt“ und „Angenommen, neues Paket registriert“ sind gute Nachrichten. „Formular falsch ausgefüllt“, „Erst Ausweis zeigen“, „Dieses Fach dürfen Sie nicht öffnen“ und „Adresse unbekannt“ heißen, dass der Absender etwas ändern muss. „Wir sind überlastet, später wiederkommen“ und „Unsere Sortiermaschine ist kaputt“ heißen, dass die Post ein Problem hat. Ein Blick auf den Stempel sagt, wer handeln muss.",
    },
    engineering: {
      text: "Jede HTTP-Antwort hat einen Statuscode. 2xx heißt Erfolg (200 OK, 201 Created, 204 No Content), 3xx Weiterleitung, 4xx ein Fehler des Clients (400 Bad Request, 401 Unauthorized für nicht angemeldet, 403 Forbidden für nicht erlaubt, 404 Not Found, 409 Conflict, 422 Validierungsfehler, 429 Too Many Requests) und 5xx ein Fehler des Servers (500, 502, 503, 504). Richtige Codes lassen Clients, Wiederholungen, Caches und Monitoring passend reagieren. Wiederhole 429 und 503 mit Backoff; die meisten 4xx nicht.",
      pitfalls: [
        "Mit 200 und {\"error\": ...} zu antworten, versteckt Fehler vor Monitoring, Wiederholungen und Clients.",
        "401 heißt nicht authentifiziert, 403 heißt nicht erlaubt; wer sie verwechselt, verwirrt Clients.",
        "4xx-Fehler zu wiederholen wiederholt denselben Fehler; wiederhole nur 429, 503 und Netzwerkfehler.",
      ],
    },
    keywords: ["Statuscodes", "HTTP", "Fehlercodes", "Antwort"],
  },
  "backend-03": {
    name: "Async und Await",
    official: "Viele langsame Aufrufe (wie LLM-Anfragen) gleichzeitig abwickeln, ohne zu blockieren.",
    kid: "Eine schlaue Postangestellte steht nicht still, während ein Brief im Zug unterwegs ist; sie hilft dem Nächsten in der Schlange. Async und Await lassen ein Programm andere Arbeit erledigen, während es wartet.",
    realWorld: {
      title: "Nie am Schalter stehen und warten",
      text: "Ein langsamer Angestellter ruft mit einer Frage in der Zentrale an und steht dann zehn Minuten da, bis der Rückruf kommt, während die Schlange wächst. Eine schlaue Angestellte fragt, schreibt eine Notiz „warte auf Zentrale“, bedient die nächsten fünf Leute und nimmt den ersten Fall wieder auf, wenn das Telefon klingelt. Dieselbe eine Angestellte, viel mehr bediente Leute, weil die meiste Zeit Warten ist, nicht Arbeit.",
    },
    engineering: {
      text: "Asynchrone Programmierung lässt einen Prozess viele I/O-lastige Aufgaben gleichzeitig abwickeln: Während eine Coroutine auf eine Netzwerkantwort wartet (einen LLM-Aufruf, eine Datenbankabfrage, eine Vektorsuche), führt die Event Loop andere aus. In Python definiert async def eine Coroutine, await pausiert sie, bis das Ergebnis da ist, und asyncio.gather führt mehrere awaits nebenläufig aus. KI-Backends warten vor allem auf Modell-APIs, daher bedienen asynchrone Server wie FastAPI auf uvicorn pro Prozess viel mehr gleichzeitige Nutzer. Blockierende Aufrufe in asynchronem Code frieren alles ein.",
      pitfalls: [
        "Ein blockierender Aufruf (requests.get, time.sleep, ein synchroner Datenbanktreiber) in asynchronem Code bremst jede Anfrage.",
        "Unbegrenzte gather-Aufrufe können Rate Limits der Anbieter reißen; begrenze die Nebenläufigkeit mit einer Semaphore.",
        "Async hilft beim Warten (I/O), nicht bei schwerer Rechenarbeit; nutze dafür Worker-Prozesse.",
      ],
    },
    keywords: ["asynchron", "nebenläufig", "Event Loop", "Coroutine"],
  },
  "backend-04": {
    name: "Streaming mit SSE",
    official: "Server-Sent Events schicken Tokens über eine HTTP-Verbindung an den Browser.",
    kid: "Statt zu warten, bis ein ganzes Buch gedruckt ist, stell dir vor, jede Seite kommt per Post, sobald sie geschrieben ist. Streaming schickt eine Antwort Wort für Wort, damit du sofort lesen kannst.",
    realWorld: {
      title: "Seiten per Post, sobald sie geschrieben sind",
      text: "Eine Leserin bestellt bei einem Autor eine lange Geschichte. Möglichkeit eins: zwei Wochen warten und dann das ganze Buch bekommen. Möglichkeit zwei: Der Autor schickt jede Seite los, sobald sie fertig ist, und die Leserin liest schon am ersten Tag. Das Buch braucht genauso lange, fühlt sich aber viel schneller an. SSE ist Möglichkeit zwei für Apps, und es fließt nur in eine Richtung: vom Autor zur Leserin.",
    },
    engineering: {
      text: "Server-Sent Events (SSE) streamen eine Antwort über eine langlebige HTTP-Verbindung als text/event-stream: Jedes Event ist eine Zeile „data:“, gefolgt von einer Leerzeile. LLM-APIs und Chat-Oberflächen nutzen das, um Tokens anzuzeigen, während sie erzeugt werden, und senken die gefühlte Latenz von vielen Sekunden auf die Zeit bis zum ersten Token. Es ist einseitig (Server zum Client), funktioniert durch die meisten Proxys, und EventSource im Browser verbindet sich automatisch neu. Schalte das Puffern im Proxy ab und sende bei langen Pausen Keep-alive-Kommentare.",
      pitfalls: [
        "Proxys, die Antworten puffern (nginx standardmäßig), halten den Stream zurück; schalte das Puffern für diese Routen ab.",
        "Zeilenumbrüche in einem Chunk brechen das Event-Format; escape sie oder schick JSON pro Event.",
        "Verlässt der Nutzer die Seite, hör auf zu generieren; sonst zahlst du weiter für Tokens, die niemand liest.",
      ],
    },
    keywords: ["SSE", "Streaming", "Event-Stream"],
  },
  "backend-05": {
    official: "Eine Live-Verbindung in beide Richtungen, für Sprache, Echtzeit-Chat und Zusammenarbeit.",
    kid: "Briefe hin und her zu schicken ist langsam, also besorgen sich zwei Freunde ein Walkie-Talkie. WebSockets halten eine Leitung offen, damit beide Seiten jederzeit sprechen können.",
    realWorld: {
      title: "Eine direkte Leitung statt Briefen",
      text: "Die meisten Kunden schreiben einen Brief und warten auf Antwort. Die Ladenbesitzerin, die vierzigmal am Tag bei der Post anruft, bekommt dagegen eine direkte Telefonleitung. Beide Seiten können jederzeit sprechen: Die Post kann sagen „Ihr Paket ist gerade angekommen“, und die Besitzerin kann mitten im Satz unterbrechen: „Stopp, falsche Adresse!“ Die Leitung offen zu halten kostet etwas, also bekommen nur Vielsprecher eine.",
    },
    engineering: {
      text: "WebSockets machen aus einer HTTP-Verbindung einen dauerhaften Vollduplex-Kanal, über den Client und Server jederzeit Nachrichten senden. Sie passen zu Sprach- und Echtzeit-Assistenten, gemeinsamem Bearbeiten, Live-Fortschritt von Agenten mit Unterbrechungen durch Nutzer und Multiplayer-Features. Gegenüber SSE gehen sie in beide Richtungen, sind aber komplexer: Du kümmerst dich um Neuverbindung, Heartbeats, Authentifizierung beim Verbinden, Backpressure und die Skalierung zustandsbehafteter Verbindungen (Sticky Routing oder eine Pub/Sub-Schicht). Streamst du nur vom Server zum Client, ist SSE einfacher.",
      pitfalls: [
        "Verbindungen brechen ab (Mobilfunk, Deploys); Clients müssen sich neu verbinden und weitermachen.",
        "Load Balancer brauchen WebSocket-Unterstützung und lange Leerlauf-Timeouts, dazu Heartbeats, um Verbindungen am Leben zu halten.",
        "Nachrichten kommen außerhalb des normalen Anfrageflusses; authentifiziere beim Verbinden und prüf Rechte pro Nachricht.",
      ],
    },
    keywords: ["WebSocket", "Echtzeit", "bidirektional", "Live"],
  },
  "backend-06": {
    name: "Authentifizierung mit JWT",
    official: "Signierte Tokens, die bei jeder Anfrage beweisen, wer der Nutzer ist.",
    kid: "Ein JWT ist wie ein gestempeltes Ticket von der Post, auf dem steht, wer du bist und wann es abläuft. Du zeigst es bei jedem Besuch, und der Stempel beweist, dass niemand es verändert hat.",
    realWorld: {
      title: "Der gestempelte Besucherausweis",
      text: "Nachdem die Post einmal deinen Pass geprüft hat, gibt sie dir einen Ausweis: dein Name, welche Schalter du nutzen darfst und „gültig bis 18 Uhr“, versiegelt mit dem eigenen Stempel der Post. An jedem Schalter prüft die Angestellte nur Stempel und Uhrzeit, ohne beim Empfang anzurufen. Kritzelt jemand „Filialleiter“ auf seinen Ausweis, passt das Siegel nicht mehr, und die Angestellte lehnt ab.",
    },
    engineering: {
      text: "Ein JSON Web Token (JWT) ist ein signierter, base64url-kodierter String aus drei Teilen: Header, Payload (Claims wie sub, exp, iat, Rollen oder Mandant) und Signatur. Nach dem Login stellt der Server ein kurzlebiges Access Token aus; bei jeder Anfrage prüft er Signatur und Ablauf ohne Datenbankabfrage, was ihn zustandslos und leicht skalierbar macht. Die Payload kann jeder lesen, also gehören nie Secrets hinein. Nutze kurze Laufzeiten plus Refresh Tokens, leg den Algorithmus fest und prüf Audience und Issuer.",
      pitfalls: [
        "Die Payload ist nur kodiert, nicht verschlüsselt; jeder kann sie lesen, also speichere dort nie Secrets.",
        "Langlebige Tokens lassen sich nicht leicht widerrufen; halte sie kurz und nutze Refresh Tokens.",
        "Gib beim Prüfen immer die erlaubten Algorithmen an; „none“ oder vertauschte Algorithmen zu akzeptieren ist ein klassischer Angriff.",
      ],
    },
    keywords: ["Login", "Token", "Authentifizierung", "Anmeldung"],
  },
  "backend-07": {
    official:
      "„Mit Google anmelden“ und deine App mit Erlaubnis des Nutzers in seinem Konto handeln lassen.",
    kid: "Statt dem Lieferboten deinen Hausschlüssel zu geben, bittest du die Hausverwaltung um eine Gästekarte, die nur den Postraum öffnet, für einen Tag. OAuth 2.0 gibt Apps solche begrenzten Gästekarten.",
    realWorld: {
      title: "Eine Gästekarte, nicht dein Hausschlüssel",
      text: "Ein neuer Paketdienst will Briefe aus dem Postraum deines Hauses abholen. Du gibst ihm nicht deinen Hausschlüssel. Stattdessen gehst du selbst zur Hausverwaltung und sagst: „Gebt dieser Firma eine Karte, die nur den Postraum öffnet, für einen Monat.“ Die Firma sieht deinen Schlüssel nie, und du kannst die Karte jederzeit sperren, ohne deine Schlösser zu tauschen.",
    },
    engineering: {
      text: "OAuth 2.0 ist ein Autorisierungs-Framework, mit dem eine App auf Ressourcen eines Nutzers bei einem anderen Dienst (Google Drive, GitHub, Slack) zugreift, ohne sein Passwort zu sehen. Beim Authorization Code Flow mit PKCE leitet die App den Nutzer zum Anbieter, er meldet sich dort an und erlaubt bestimmte Scopes, der Anbieter leitet mit einem Einmal-Code zurück, und die App tauscht ihn gegen ein Access Token (und oft ein Refresh Token). OpenID Connect ergänzt ein standardisiertes ID-Token fürs Login. KI-Apps nutzen es für „Mit Google anmelden“ und für Konnektoren und MCP-Server, die mit den Daten des Nutzers arbeiten.",
      pitfalls: [
        "Frag nur nach den Scopes, die du brauchst; breite Scopes schrecken Nutzer ab und vergrößern den Schaden eines Lecks.",
        "Prüf den state-Parameter und nutze PKCE, sonst können Angreifer eigene Autorisierungscodes einschleusen.",
        "Speichere Refresh Tokens verschlüsselt und behandle widerrufene oder abgelaufene Tokens sauber.",
      ],
    },
    keywords: ["OAuth", "Anmelden mit Google", "Scopes", "Autorisierung"],
  },
  "backend-08": {
    name: "SQL vs. NoSQL",
    official:
      "Tabellen mit Beziehungen und Joins gegenüber flexiblen Dokumenten oder Key-Value. Entscheide nach der Form deiner Daten.",
    kid: "Manche Postämter führen Adressen in einem ordentlichen Buch mit Spalten, andere haben für jeden Kunden einen eigenen Ordner. SQL ist das ordentliche Buch mit Spalten; NoSQL sind die Ordner.",
    realWorld: {
      title: "Das Hauptbuch und die Ordner",
      text: "Das Hauptpostamt führt ein Hauptbuch mit festen Spalten: Name, Straße, Postleitzahl, jede Zeile gleich ausgefüllt, und es beantwortet „Wie viele Pakete gingen letzten Monat nach Berlin?“ in Sekunden. Eine kleine Filiale hat pro Kunde einen Ordner mit allem, was er an Papieren hat: manche Fotos, manche Formulare, manche Notizen. Ordner sind flexibel und schnell als Ganzes greifbar; das Hauptbuch ist besser für Fragen über alle.",
    },
    engineering: {
      text: "SQL-Datenbanken (PostgreSQL, MySQL, SQLite) speichern Daten in Tabellen mit festem Schema, Beziehungen zwischen Tabellen per Joins, starker Konsistenz und ACID-Transaktionen sowie einer mächtigen Abfragesprache. NoSQL umfasst Dokumentspeicher (MongoDB), Key-Value-Stores (Redis, DynamoDB), Wide-Column- und Graphdatenbanken und tauscht Joins und strenge Schemas gegen Flexibilität oder massive horizontale Skalierung. Für die meisten KI-Apps ist Postgres der Standard: Nutzer, Chats, Dokumente und Metadaten als Tabellen, JSONB für flexible Felder und pgvector für Embeddings.",
      pitfalls: [
        "NoSQL zu wählen, um kein Schema entwerfen zu müssen, verschiebt das Schema nur in deinen Anwendungscode.",
        "Duplizierte Daten in Dokumentspeichern laufen auseinander; leg fest, welche Kopie die Wahrheit ist.",
        "Eine Datenbank für eingebildete Skalierung zu wählen; Postgres schafft weit mehr, als die meisten Produkte je brauchen.",
      ],
    },
    keywords: ["Datenbank", "relational", "Dokumente", "Postgres"],
  },
  "backend-09": {
    name: "Datenbank-Indizes",
    official: "Indizes machen Abfragen schnell. Wisse, welche Spalten deine Abfragen indexiert brauchen.",
    kid: "Um einen Brief unter einer Million zu finden, sortiert die Post sie nach Postleitzahl in Regale, statt jeden Brief anzusehen. Ein Datenbank-Index ist diese Sortierung, damit das Finden schnell geht.",
    realWorld: {
      title: "Regale nach Postleitzahl sortiert",
      text: "Ein neuer Angestellter soll in einem Berg aus einer Million Briefe jeden für die Postleitzahl 10115 finden. Ohne Sortierung prüft er sie einzeln, den ganzen Tag. Die erfahrene Kollegin geht zum Regal mit dem Schild 10115 und ist in einer Minute fertig. Die Regale einzurichten war Arbeit, und jeder neue Brief muss an den richtigen Platz, aber das Suchen geht fast sofort.",
    },
    engineering: {
      text: "Ein Datenbank-Index ist eine zusätzliche Datenstruktur, meist ein B-Baum, mit der die Datenbank passende Zeilen findet, ohne die ganze Tabelle zu durchsuchen, und aus Sekunden Millisekunden macht. Indexiere die Spalten in WHERE-, JOIN- und ORDER-BY-Klauseln; zusammengesetzte Indizes folgen der Leftmost-Prefix-Regel. Indizes kosten Speicher und verlangsamen Schreibvorgänge, also leg sie anhand echter Abfragepläne an (EXPLAIN ANALYZE). Die Vektorsuche nutzt eigene Index-Typen wie HNSW und IVFFlat in pgvector.",
      pitfalls: [
        "Jede Spalte zu indexieren verlangsamt Schreibvorgänge und verschwendet Speicher; indexiere, wonach deine Abfragen wirklich filtern.",
        "Eine Spalte in eine Funktion zu packen (lower(email)) umgeht einen einfachen Index; indexiere stattdessen den Ausdruck.",
        "Einen Index auf einer großen, aktiven Tabelle anzulegen sperrt Schreibvorgänge; nutze in Postgres CREATE INDEX CONCURRENTLY.",
      ],
    },
    keywords: ["Index", "schnelle Abfragen", "B-Baum", "EXPLAIN"],
  },
  "backend-10": {
    name: "Transaktionen und ACID",
    official: "Bündle Schreibvorgänge, sodass alle gelingen oder alle scheitern und deine Daten konsistent bleiben.",
    kid: "Geld zu überweisen sind zwei Schritte: von einer Karte abbuchen und auf eine andere gutschreiben. Eine Transaktion sorgt dafür, dass beide Schritte passieren oder keiner, selbst wenn der Computer mittendrin abstürzt.",
    realWorld: {
      title: "Beide Schritte oder keiner",
      text: "Ein Kunde verschickt ein Paket mit Guthaben. Die Angestellte muss das Guthaben abziehen und das Paket registrieren. Fällt nach dem ersten Schritt der Strom aus, hat der Kunde für nichts bezahlt. Also gilt in der Post eine Regel: Beide Einträge kommen in einem Zug mit Tinte ins Hauptbuch, oder keiner. Scheitert irgendetwas mittendrin, wird der halb geschriebene Eintrag gelöscht, als hätte es ihn nie gegeben.",
    },
    engineering: {
      text: "Eine Transaktion bündelt mehrere Datenbankoperationen zu einer Einheit mit ACID-Garantien: Atomarität (alles oder nichts), Konsistenz (Bedingungen gelten immer), Isolation (gleichzeitige Transaktionen sehen keine halbfertige Arbeit der anderen) und Dauerhaftigkeit (bestätigte Daten überstehen Abstürze). Nutze Transaktionen in KI-Apps für Guthaben und Abrechnung, um eine Nachricht zusammen mit ihrem Verbrauchseintrag zu speichern und beim Einlesen, das ein Dokument samt Chunks schreibt. Halte Transaktionen kurz und warte nie auf einen LLM-Aufruf, während eine offen ist.",
      pitfalls: [
        "Eine Transaktion während eines langsamen LLM-Aufrufs offen zu halten, blockiert Zeilen und erschöpft Verbindungen.",
        "Lesen und dann Schreiben ohne Sperre oder bedingtes Update führt zu Race Conditions, etwa doppelt ausgegebenem Guthaben.",
        "Eine Transaktion kann externe Nebenwirkungen wie E-Mails oder API-Aufrufe nicht zurücknehmen; nutze ein Outbox-Muster.",
      ],
    },
    keywords: ["Transaktion", "ACID", "Konsistenz", "alles oder nichts"],
  },
  "backend-11": {
    name: "Caching mit Redis",
    official: "Halte häufig genutzte Daten im Speicher, für schnelles Lesen und weniger Datenbank- oder LLM-Aufrufe.",
    kid: "Stellen viele Leute der Post dieselbe Frage, schreibt die Angestellte die Antwort auf einen Zettel am Schalter, statt jedes Mal die Zentrale anzurufen. Redis ist diese schnelle Zetteltafel.",
    realWorld: {
      title: "Die Antworttafel am Schalter",
      text: "Fünfzig Leute am Tag fragen: „Was kostet ein Paket nach Spanien?“ Die Zentrale anzurufen dauert jedes Mal fünf Minuten. Also schreibt die Angestellte die Antwort auf eine kleine Tafel am Schalter, mit dem Vermerk „gültig bis Freitag“, weil sich Preise ändern. Die meisten bekommen ihre Antwort jetzt in einer Sekunde. Ändert sich der Preis früher, wischt sie diese Zeile weg, damit niemand eine alte Antwort bekommt.",
    },
    engineering: {
      text: "Caching hält Ergebnisse teurer oder langsamer Arbeit (LLM-Antworten, Embeddings, Datenbankabfragen, externe API-Aufrufe) in schnellem Speicher, damit wiederholte Anfragen die Arbeit überspringen. Redis ist ein In-Memory-Key-Value-Store für Caches, Sessions, Rate Limiting und Queues. Übliche Muster: Cache-Aside mit TTL, Schlüssel, die alles enthalten, was das Ergebnis beeinflusst (Modell, Prompt-Version, normalisierte Eingabe, Mandant), und explizites Invalidieren. Bei LLMs ist exaktes Caching sicher; semantisches Caching per Embedding-Ähnlichkeit spart mehr, kann aber falsche Antworten liefern.",
      pitfalls: [
        "Schlüssel, die Mandant oder Nutzer ignorieren, geben die Antworten eines Kunden an einen anderen weiter.",
        "Ohne TTL oder Invalidierung veralten gecachte Antworten, wenn sich Dokumente oder Prompts ändern.",
        "Redis ist Arbeitsspeicher; setz maxmemory mit einer Eviction-Policy und behandle den Cache als verzichtbar.",
      ],
    },
    keywords: ["Cache", "Redis", "Zwischenspeicher", "TTL"],
  },
  "backend-12": {
    official: "Arbeit zuverlässig zwischen Diensten weiterreichen (RabbitMQ, SQS, Kafka).",
    kid: "Kommen tausend Briefe auf einmal, landen sie in einem großen Sortiersack, und Helfer nehmen sie einzeln heraus. Eine Message Queue ist dieser Sack, damit nichts verloren geht, wenn Arbeit schneller kommt als erledigt.",
    realWorld: {
      title: "Der Sortiersack, der nie überläuft",
      text: "Vor Weihnachten kommen Briefe schneller an, als die Sortierer schaffen. Statt Leute an der Tür abzuweisen, kommt jeder Brief in einen großen Sortiersack. Die Sortierer ziehen Briefe in ihrem eigenen Tempo heraus, und an vollen Tagen helfen mehr Sortierer mit. Lässt ein Sortierer einen Brief fallen, kommt er zurück in den Sack für jemand anderen. Der Schalter bleibt schnell, und kein Brief geht verloren.",
    },
    engineering: {
      text: "Eine Message Queue (RabbitMQ, Amazon SQS, Redis Streams, Kafka für Event-Streams) entkoppelt Erzeuger von Verbrauchern: Die API reiht eine Nachricht ein und antwortet sofort, und Worker verarbeiten sie in ihrem eigenen Tempo. Queues fangen Traffic-Spitzen ab, erlauben unabhängiges Skalieren der Worker und bieten Wiederholungen und Dead-Letter-Queues für fehlgeschlagene Nachrichten. Die Zustellung ist meist at-least-once, also müssen Verbraucher idempotent sein. KI-Einsätze sind Dokumente einlesen, Massen-Embedding, lange Agent-Läufe und Eval-Jobs.",
      pitfalls: [
        "At-least-once-Zustellung heißt Duplikate; mach jeden Verbraucher idempotent.",
        "Eine Nachricht, die immer fehlschlägt, blockiert oder kreist ohne Dead-Letter-Queue für immer.",
        "Beobachte Queue-Länge und Alter der ältesten Nachricht; eine wachsende Queue ist ein laufender Vorfall.",
      ],
    },
    keywords: ["Queue", "Warteschlange", "Nachrichten", "entkoppeln"],
  },
  "backend-13": {
    name: "Hintergrund-Jobs",
    official: "Langsame Aufgaben (Embeddings, Berichte, E-Mails) in Workern ausführen, außerhalb der Anfrage.",
    kid: "Gibst du ein großes Paket auf, bekommst du ein Ticket und hörst: „Wir verschicken es, Sie können nach Hause gehen.“ Hintergrund-Jobs erledigen langsame Arbeit später, damit die App sofort antworten kann.",
    realWorld: {
      title: "Hier ist Ihr Ticket, Sie können gehen",
      text: "Jemand bringt 500 Hochzeitseinladungen zur Post. Die Angestellte lässt ihn nicht warten, bis jeder Umschlag frankiert und sortiert ist. Sie gibt ihm eine Ticketnummer und sagt: „Schauen Sie auf die Tafel, dort steht fertig, wenn sie raus sind.“ Die Arbeit passiert im Hinterzimmer, während die Schlange am Schalter weiterläuft. Klemmt die Frankiermaschine, versucht es das Hinterzimmer erneut, ohne den Kunden zu stören.",
    },
    engineering: {
      text: "Hintergrund-Jobs verlagern langsame oder schwere Arbeit (ein 300-seitiges PDF einlesen und einbetten, Berichte erzeugen, lange Agent-Läufe, Batch-Evals, E-Mails senden) aus dem Anfrage-Antwort-Zyklus. Die API legt einen Job an, reiht ihn ein und antwortet mit 202 Accepted und einer Job-ID; Worker (Celery, RQ, Dramatiq, arq, Temporal für dauerhafte Workflows) verarbeiten ihn mit Wiederholungen, und der Client fragt einen Status-Endpunkt ab oder bekommt einen Webhook, ein SSE-Event oder eine WebSocket-Nachricht, wenn er fertig ist. So bleiben Anfragen schnell und innerhalb der Timeouts.",
      pitfalls: [
        "Schwere Arbeit in der Anfrage zu erledigen, reißt Timeouts und blockiert den Server für alle.",
        "Jobs werden wiederholt; bau sie idempotent, damit eine Wiederholung keine Chunks oder E-Mails dupliziert.",
        "Nutzer brauchen Rückmeldung zu Fortschritt und Fehlern; ein Job, der still scheitert, wirkt wie ein Bug.",
      ],
    },
    keywords: ["Hintergrund", "Worker", "Job", "asynchron"],
  },
  "backend-14": {
    official: "Begrenze Anfragen pro Nutzer oder Key, um deine App und deine LLM-Rechnung zu schützen.",
    kid: "Jeder Kunde bekommt eine Karte mit zehn Stempeln pro Stunde fürs Briefeaufgeben, damit niemand allein den ganzen Wagen füllt. Rate Limiting setzt eine faire Grenze, wie oft jemand eine App etwas fragen darf.",
    realWorld: {
      title: "Zehn Pakete pro Stunde für jeden",
      text: "Eine Firma lud jeden Morgen Tausende Pakete am Schalter ab, und niemand sonst wurde bedient. Jetzt bekommt jeder Kunde eine Karte mit zehn Stempeln pro Stunde; jedes Paket verbraucht einen Stempel, und die Karte füllt sich langsam wieder auf. Eilige Kunden können kurz mehrere schicken, aber niemand kann den Schalter für alle anderen blockieren. Ist deine Karte leer, sagt die Angestellte: „Kommen Sie in ein paar Minuten wieder.“",
    },
    engineering: {
      text: "Rate Limiting begrenzt, wie viele Anfragen (oder Tokens oder Euro) ein Client pro Zeitfenster nutzen darf, schützt den Dienst vor Missbrauch, außer Kontrolle geratenen Skripten und Kostenexplosionen und hält die Nutzung fair. Übliche Algorithmen sind Token Bucket (erlaubt Spitzen), Sliding Window und Fixed Window, meist in Redis gespeichert, damit alle Instanzen dieselben Zähler teilen. Begrenze pro Nutzer, API-Key, Mandant oder IP; bei LLM-Apps auch Tokens pro Minute und Ausgaben pro Tag. Antworte mit 429 und einem Retry-After-Header.",
      pitfalls: [
        "Pro Instanz statt in einem gemeinsamen Speicher zu zählen lässt Clients ihr Limit mit der Zahl der Instanzen multiplizieren.",
        "Limits nach Anzahl der Anfragen verpassen LLM-Kosten; ein riesiger Prompt kann mehr kosten als tausend kleine.",
        "Ohne Retry-After und klare Fehlermeldungen können sich gutartige Clients nicht richtig zurückhalten.",
      ],
    },
    keywords: ["Rate Limit", "Drosselung", "429", "Token Bucket"],
  },
  "backend-15": {
    name: "Idempotenz-Keys",
    official: "Eine wiederholte Anfrage mit demselben Key wird nur einmal verarbeitet. Keine doppelten Abbuchungen.",
    kid: "Gibst du versehentlich denselben Brief zweimal auf, sieht eine sorgfältige Angestellte dieselbe Ticketnummer und schickt ihn nur einmal. Ein Idempotenz-Key ist diese Nummer, damit Wiederholen nicht schadet.",
    realWorld: {
      title: "Gleiches Ticket, gleiches Paket",
      text: "Ein nervöser Kunde gibt ein Paket ab, hört im Lärm keine Antwort und gibt es noch einmal ab. Ohne Vorsicht verschickt die Post zwei Pakete und kassiert doppelt. Also schreibt jeder Kunde jetzt eine Ticketnummer auf sein Formular. Sieht die Angestellte Ticket 7731 ein zweites Mal, verschickt sie nichts Neues; sie sagt nur: „Schon erledigt, hier ist Ihre Quittung.“",
    },
    engineering: {
      text: "Ein Idempotenz-Key ist ein eindeutiger Wert (oft eine UUID), den der Client bei einer Anfrage mitschickt, die etwas ändert, etwa eine Zahlung, eine Bestellung oder der Start eines Agent-Laufs. Der Server speichert den Key mit dem Ergebnis; kommt derselbe Key erneut (eine Wiederholung nach Timeout, ein Doppelklick, eine erneut zugestellte Queue-Nachricht), gibt er das gespeicherte Ergebnis zurück, statt zweimal zu handeln. Stripe hat den Header Idempotency-Key bekannt gemacht. Keys brauchen eine Eindeutigkeitsbedingung, ein Ablaufdatum und eine Prüfung, dass der Anfrage-Body zum Original passt.",
      pitfalls: [
        "Erst prüfen und dann einfügen ohne Unique Constraint lässt zwei parallele Wiederholungen beide durch.",
        "Erzeuge den Key auf dem Client einmal pro Nutzeraktion; ein neuer Key bei jeder Wiederholung macht ihn sinnlos.",
        "Speichere Keys lange genug für alle Wiederholungsfenster und lass sie dann ablaufen.",
      ],
    },
    keywords: ["Idempotenz", "doppelt", "Wiederholung", "Zahlung"],
  },
  "backend-16": {
    name: "Wiederholungen mit Backoff",
    official:
      "Wiederhole fehlgeschlagene Aufrufe mit wachsenden Pausen (plus etwas Zufall), statt draufloszuhämmern.",
    kid: "Klemmt die Tür der Post, hämmerst du nicht jede Sekunde dagegen; du wartest, dann länger, dann noch länger. Wiederholungen mit Backoff versuchen es höflich erneut und warten jedes Mal etwas mehr.",
    realWorld: {
      title: "Klopfen, warten, klopfen, länger warten",
      text: "Die Telefonleitung der Zentrale ist überlastet. Wählt jede Angestellte der Stadt sofort und ununterbrochen neu, erholt sich die Leitung nie. Die Regel: Ist besetzt, warte eine Minute, dann zwei, dann vier, und gib ein paar zufällige Sekunden dazu, damit nicht alle im selben Moment anrufen. Nach fünf Versuchen aufgeben und es dem Kunden sagen. Die Leitung erholt sich, und die meisten Anrufe kommen irgendwann durch.",
    },
    engineering: {
      text: "Vorübergehende Fehler (Timeouts, Verbindungsabbrüche, 429-Rate-Limits, 502, 503 und 529 für Überlastung bei Modellanbietern) klappen bei Wiederholung oft. Exponentieller Backoff wartet nach jedem Fehler länger (1 s, 2 s, 4 s und so weiter) bis zu einer Obergrenze, und Jitter macht die Wartezeit zufällig, damit nicht viele Clients synchron wiederholen und eine Thundering Herd auslösen. Halte dich an Retry-After-Header, begrenze Versuche und Gesamtzeit, wiederhole nur sichere oder idempotente Operationen und ergänze für längere Ausfälle einen Circuit Breaker oder ein Fallback-Modell.",
      pitfalls: [
        "Ohne Jitter treffen alle Clients den Dienst wieder im selben Moment.",
        "Wiederholungen auf mehreren Ebenen (SDK, dein Code, das Gateway) multiplizieren sich zu Dutzenden Versuchen.",
        "Nicht-idempotente Aktionen wie Zahlungen oder E-Mails ohne Idempotenz-Keys zu wiederholen, verdoppelt sie.",
      ],
    },
    keywords: ["Backoff", "Wiederholung", "Jitter", "Retry"],
  },
  "backend-17": {
    name: "Datei-Uploads zu S3",
    official: "Dateien von Nutzern im Objektspeicher ablegen, meist über vorsignierte URLs.",
    kid: "Statt eine schwere Kiste über den Schalter zu wuchten, bekommst du einen Einmalschlüssel und stellst sie direkt ins große Lager. So schicken Apps große Dateien zu S3.",
    realWorld: {
      title: "Direkt ins Lager",
      text: "Große Kisten gingen früher über den Schalter: Der Kunde hob sie zur Angestellten, die trug sie nach hinten, und die Schlange stand still. Jetzt gibt die Angestellte nur eine Schlüsselkarte heraus, die ein Regal im Lager öffnet, nur für die nächsten fünfzehn Minuten. Der Kunde rollt die Kiste direkt hinein, und die Angestellte ist frei für den Nächsten. Danach ist die Karte nutzlos.",
    },
    engineering: {
      text: "Objektspeicher wie Amazon S3, Google Cloud Storage oder Azure Blob speichern Dateien (PDFs, Bilder, Audio, Modellartefakte) billig und dauerhaft. Statt Uploads durch deine API-Server zu leiten, stellt das Backend eine kurzlebige vorsignierte URL aus, mit der der Client direkt in den Bucket hochlädt; das Backend speichert dann den Objekt-Key, und ein Event oder Job startet die Verarbeitung wie Parsen und Einbetten. Prüf Typ und Größe, scanne auf Malware, halte Buckets privat und stell Keys einen Mandanten-Präfix voran.",
      pitfalls: [
        "Öffentliche Buckets sind ein klassisches Datenleck; halte Buckets privat und teile über signierte URLs.",
        "Typ und Größe vom Client zu vertrauen lädt zu Missbrauch ein; erzwinge sie in den Bedingungen der Signatur und prüf später erneut.",
        "Keys ohne Mandanten-Präfix machen Fehler beim Zugriff über Mandantengrenzen leicht.",
      ],
    },
    keywords: ["Upload", "Dateien", "Objektspeicher", "vorsignierte URL"],
  },
  "backend-18": {
    name: "Paginierung",
    official: "Lange Listen in Seiten zurückgeben (Limit/Offset oder Cursor).",
    kid: "Niemand gibt dir alle zehntausend Briefe auf einmal; du bekommst einen Sack mit fünfzig und einen Zettel, wo der nächste Sack anfängt. Paginierung liefert lange Listen so in kleinen Seiten.",
    realWorld: {
      title: "Ein Sack nach dem anderen",
      text: "Eine Firma will jeden Brief, den sie dieses Jahr bekommen hat: zehntausend. Die Post gibt einen Sack mit fünfzig heraus und einen Zettel „nächster Sack beginnt nach Brief 50213“. Positionen zu zählen („gib mir Brief 51 bis 100“) geht schief, wenn ständig neue Briefe kommen und alles verschieben, also nennt der Zettel stattdessen den letzten Brief. Niemand bekommt doppelte, und niemand verpasst einen.",
    },
    engineering: {
      text: "Paginierung gibt große Sammlungen seitenweise zurück, damit Antworten schnell und der Speicher begrenzt bleiben. Offset-Paginierung (LIMIT 20 OFFSET 40) ist einfach und erlaubt Sprünge zu Seite N, wird aber bei tiefen Seiten langsam und zeigt Duplikate oder Lücken, wenn Zeilen eingefügt oder gelöscht werden. Cursor-Paginierung (Keyset) gibt einen undurchsichtigen Cursor mit dem Sortierschlüssel des letzten Eintrags zurück, und die nächste Anfrage macht danach weiter: schnell in jeder Tiefe und stabil bei Schreibvorgängen. Sortiere immer nach einem eindeutigen, indexierten Schlüssel und begrenze die Seitengröße.",
      pitfalls: [
        "Tiefe OFFSET-Abfragen lesen jede übersprungene Zeile und werfen sie weg; Seite 5.000 wird sehr langsam.",
        "Nach einer nicht eindeutigen Spalte zu sortieren (created_at allein) lässt Einträge mit gleichen Werten zwischen Seiten doppelt auftauchen oder verschwinden.",
        "Unbegrenzte Seitengrößen lassen eine Anfrage die ganze Tabelle ziehen.",
      ],
    },
    keywords: ["Paginierung", "Seiten", "Cursor", "Offset"],
  },
  "backend-19": {
    name: "Eingabevalidierung mit Pydantic",
    official: "Definiere die Form von Anfragen und Antworten in Python. Schlechte Daten werden automatisch abgelehnt.",
    kid: "Bevor die Post einen Brief annimmt, prüft sie das Formular: Ist die Adresse ausgefüllt, hat die Postleitzahl fünf Ziffern? Pydantic prüft die Daten, die eine App bekommt, genauso.",
    realWorld: {
      title: "Das Formular am Schalter prüfen",
      text: "Die Hälfte der Probleme im Sortierzentrum kam von schlechten Formularen: eine Postleitzahl mit Buchstaben, eine fehlende Straße, ein Gewicht von „schwer“. Jetzt prüft die Angestellte jedes Formular am Schalter anhand einer klaren Regelliste und gibt es mit einem Vermerk zurück, welches Feld genau falsch ist. Schlechte Formulare kommen nie am Schalter vorbei, also können die Leute hinten allem trauen, was sie bekommen.",
    },
    engineering: {
      text: "Eingabevalidierung prüft, dass eingehende Daten die richtige Form, Typen und Werte haben, bevor dein Code sie nutzt. Pydantic-Modelle deklarieren Felder mit Typen und Bedingungen (Längen, Bereiche, Enums, Muster, eigene Validatoren); FastAPI prüft Request-Bodys, Query-Parameter und Header automatisch und antwortet mit 422 und genauen Fehlern. In KI-Apps prüfen dieselben Modelle strukturierte LLM-Ausgaben und Tool-Argumente. Validierung ist auch eine Sicherheitsschicht: Begrenze Längen und Größen, verbiete unbekannte Felder und vertrau nie dem Client.",
      pitfalls: [
        "Nur im Frontend zu validieren; jeder kann dein Backend direkt aufrufen.",
        "Ohne Längenlimits für Textfelder schickt eine Anfrage einen Prompt in Romanlänge und eine riesige Rechnung.",
        "Schlechte Werte still umzuwandeln versteckt Bugs; nutze strenge Typen, wo es zählt.",
      ],
    },
    keywords: ["Validierung", "Pydantic", "Schema", "Eingabe prüfen"],
  },
  "backend-20": {
    official:
      "Strukturierte Logs, Metriken und Fehlertracking, damit du Probleme siehst, bevor Nutzer sie melden.",
    kid: "Die Post schreibt für jedes Paket eine kurze Notiz ins Logbuch: wann es kam, wohin es ging und ob etwas schiefging. Logging und Monitoring helfen herauszufinden, was passiert ist, wenn etwas kaputtgeht.",
    realWorld: {
      title: "Das Logbuch und die Wandtafel",
      text: "Beschwert sich ein Kunde, dass ein Paket nie ankam, öffnet die Filialleiterin das Logbuch: Jedes Paket hat eine Ticketnummer, und jeder Schritt schreibt eine Zeile mit dieser Nummer: angenommen, sortiert, verladen, zugestellt. In Sekunden sieht sie, dass es beim Sortieren hängen geblieben ist. An der Wand zeigt eine Tafel Pakete pro Stunde und wie viele verloren gehen, so werden Probleme sichtbar, bevor sich jemand beschwert.",
    },
    engineering: {
      text: "Logging zeichnet einzelne Ereignisse mit Kontext auf; Monitoring fasst Metriken über die Zeit zusammen und alarmiert darauf. Nutze strukturierte JSON-Logs mit einheitlichen Feldern (Zeitstempel, Level, request_id oder trace_id, Nutzer oder Mandant, Route, Latenz, Modell, Tokens, Kosten, Fehler), damit Logs durchsuchbar und verknüpfbar sind. Reich eine Trace-ID durch jeden Dienst und LLM-Aufruf weiter (OpenTelemetry) und erzeuge Metriken wie Anfragerate, Fehler, Latenz-Perzentile und Tokens. Logge nie Secrets oder rohe personenbezogene Daten und sample ausführliche Logs.",
      pitfalls: [
        "Unstrukturierte print-Ausgaben lassen sich über Instanzen hinweg weder durchsuchen noch zusammenfassen.",
        "Prompts, Tokens oder personenbezogene Daten wörtlich zu loggen, schafft ein Datenschutz- und Sicherheitsrisiko.",
        "Ohne gemeinsame Request- oder Trace-ID ist das Problem eines Nutzers über zusammenhanglose Zeilen verstreut.",
      ],
    },
    keywords: ["Logs", "Monitoring", "Metriken", "Fehlertracking"],
  },
};

export default concepts;
