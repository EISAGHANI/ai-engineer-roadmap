import type { ConceptTranslations } from "../../types";

/** Bereich Deployment auf Deutsch. Szene: ein Foodtruck, der jeden Tag öffnen muss. */
const concepts: ConceptTranslations = {
  "deployment-01": {
    official:
      "Pack deine App und alles, was sie braucht, in einen Container, der überall gleich läuft.",
    kid: "Wenn du verreist, packst du alles, was du brauchst, in einen Koffer. Docker packt eine App und alles, was sie braucht, in eine Kiste, damit sie auf jedem Computer gleich läuft.",
    realWorld: {
      title: "Der Truck, der seine eigene Küche mitbringt",
      text: "Unser Burgerstand hat sich früher Küchen geliehen: eine hatte einen anderen Ofen, eine andere keinen Kühlschrank, und die Burger schmeckten jeden Tag anders. Also baute der Besitzer einen Foodtruck mit eigenem Ofen, Kühlschrank und Gewürzen. Jetzt parkt er überall in der Stadt, und die Burger schmecken überall gleich. Der Truck ist der Container; der Bauplan, nach dem er gebaut wurde, ist das Image.",
    },
    engineering: {
      text: "Docker verpackt eine Anwendung mit Laufzeitumgebung, Bibliotheken und Konfiguration in ein Image, gebaut aus einem Dockerfile, und führt es als isolierten Container aus, der sich auf dem Laptop, in der CI und in Produktion gleich verhält. Images bestehen aus gecachten Schichten, liegen in Registries und werden mit Tags versioniert. Für Python-KI-Dienste: schlanke Basis-Images nutzen, Abhängigkeiten vor dem Code kopieren, damit der Layer-Cache greift, als Nicht-Root-Nutzer laufen und Modellgewichte und Secrets aus dem Image heraushalten.",
      pitfalls: [
        "Ins Image kopierte Secrets bleiben in seinen Schichten, selbst wenn sie später gelöscht werden; übergib sie zur Laufzeit.",
        "Riesige Images (CUDA, Modellgewichte) laden langsam; nutze schlanke Basen und lade Gewichte separat.",
        "„latest“ ist keine Version; tagge Images mit Versionsnummern oder Commit-SHAs.",
      ],
    },
    keywords: ["Container", "Image", "Dockerfile", "verpacken"],
  },
  "deployment-02": {
    official: "Mehrere Container zusammen starten (API, Datenbank, Redis), aus einer Datei.",
    kid: "Ein Festival braucht einen Burgertruck, einen Getränketruck und einen Eiswagen nebeneinander. Docker Compose baut die ganze Gruppe nach einem Plan auf, der sagt, was wohin kommt.",
    realWorld: {
      title: "Ein Plan für das ganze Festival",
      text: "Fürs Straßenfest braucht unser Burgertruck Nachbarn: einen Getränketruck, einen Eiswagen, der alles kühl hält, und einen Transporter mit Brot. Statt jeden Fahrer anzurufen, verteilt die Organisatorin einen Plan: wer wo parkt, wer an welche Stromleitung kommt, wer zuerst startet. Ein Befehl, und das ganze Festival steht jedes Mal gleich da.",
    },
    engineering: {
      text: "Docker Compose definiert eine Anwendung aus mehreren Containern (API, Worker, Postgres, Redis, Vektordatenbank) in einer compose.yaml: Images oder Builds, Ports, Umgebung, Volumes, Netzwerke, Abhängigkeiten und Health Checks. docker compose up startet alles zusammen, und Dienstnamen sind als Hostnamen nutzbar. Ideal für lokale Entwicklung, Integrationstests in der CI und einfache Deployments auf einem Server; größere Produktionssysteme wechseln meist zu Kubernetes oder einer verwalteten Plattform.",
      pitfalls: [
        "depends_on allein legt nur die Startreihenfolge fest; ohne Health-Bedingung startet die API vielleicht, bevor die Datenbank bereit ist.",
        "Daten verschwinden mit dem Container, wenn sie nicht in einem benannten Volume liegen.",
        "Entwicklungseinstellungen wie Standardpasswörter und offene Ports dürfen nicht in Produktion landen.",
      ],
    },
    keywords: ["Compose", "mehrere Container", "lokal"],
  },
  "deployment-03": {
    name: "Kubernetes-Grundlagen",
    official: "Pods, Deployments und Services: Container auf einem Cluster betreiben und skalieren.",
    kid: "Stell dir eine Managerin vor, die hundert Foodtrucks im Blick hat: Fällt einer aus, schickt sie einen neuen, kommen viele Leute, schickt sie mehr. Kubernetes ist diese Managerin für Apps auf vielen Computern.",
    realWorld: {
      title: "Die Flottenmanagerin",
      text: "Mit fünfzig Trucks in der Stadt stellt der Besitzer eine Flottenmanagerin ein und sagt ihr: „Halte immer drei Burgertrucks offen und schick Kunden zur kürzesten Schlange.“ Sie prüft ständig. Ein Truck fällt aus? Sie schickt Ersatz. Eine neue Speisekarte? Sie tauscht die Trucks einzeln aus, damit die Straße nie leer ist. Der Besitzer sagt, was er will; sie sorgt dafür, dass es stimmt.",
    },
    engineering: {
      text: "Kubernetes betreibt Container über einen Cluster von Maschinen und hält den tatsächlichen Zustand passend zu einem deklarierten Sollzustand. Pods sind die kleinste Einheit (ein oder mehrere Container); Deployments verwalten replizierte Pods mit Rolling Updates und Selbstheilung; Services geben einen stabilen Netzwerknamen und verteilen Traffic über Pods; ConfigMaps und Secrets liefern Konfiguration. Es bietet Skalierung, Scheduling (auch auf GPU-Knoten) und Wiederherstellung, zum Preis echter Betriebskomplexität; verwaltete Angebote wie EKS, GKE und AKS verringern sie.",
      pitfalls: [
        "Kubernetes hat viele bewegliche Teile; eine einzelne VM oder eine verwaltete Plattform reicht oft für den Anfang.",
        "Ohne Resource Requests und Limits kann ein Pod seine Nachbarn aushungern.",
        "Ohne Readiness Probes erreicht Traffic Pods, die noch Modelle laden.",
      ],
    },
    keywords: ["Kubernetes", "Cluster", "Pods", "Orchestrierung"],
  },
  "deployment-04": {
    name: "CI/CD-Pipelines",
    official: "Bei jedem Push automatisch testen, bauen und deployen.",
    kid: "Jedes Mal, wenn der Koch ein Rezept ändert, probiert es ein Helfer, packt es ein und fährt es zu den Trucks. CI/CD macht diese Prüfungen und diese Lieferung für Code, jedes einzelne Mal.",
    realWorld: {
      title: "Von der Testküche zu jedem Truck",
      text: "Immer wenn der Koch das Burgerrezept anpasst, läuft dieselbe Routine: Die Testküche kocht es, drei Tester probieren, die Rezeptkarte wird gedruckt, und erst dann geht sie an jeden Truck. Niemand überspringt einen Schritt, und niemand vergisst Truck Nummer sieben. Sagt ein Tester „zu salzig“, verlässt das neue Rezept nie die Küche.",
    },
    engineering: {
      text: "Continuous Integration lässt bei jedem Push und Pull Request automatische Prüfungen laufen (Lint, Typprüfungen, Unit- und Integrationstests, Evals, Sicherheitsscans, Builds). Continuous Delivery oder Deployment verpackt den Build dann in ein Artefakt, etwa ein Container-Image, und gibt es automatisch oder nach einer Freigabe an Staging und Produktion frei. Pipelines machen Releases häufig, wiederholbar und risikoarm. Halte sie schnell, deterministisch und verpflichtend fürs Mergen, und deploye genau das Artefakt, das getestet wurde.",
      pitfalls: [
        "Pro Umgebung neu zu bauen heißt, Produktion läuft mit etwas nie Getestetem; befördere ein Artefakt.",
        "Wackelige Tests bringen Leuten bei, neu zu starten und Fehler zu ignorieren; repariere oder entferne sie.",
        "Langsame Pipelines werden umgangen; cache Abhängigkeiten und lass Jobs parallel laufen.",
      ],
    },
    keywords: ["Pipeline", "automatisch", "Continuous Integration", "Release"],
  },
  "deployment-05": {
    official: "Das eingebaute CI/CD von GitHub. Workflows werden in YAML geschrieben.",
    kid: "GitHub Actions ist ein Helfer-Roboter, der neben deinem Code wohnt. Immer wenn du neuen Code speicherst, arbeitet er deine Liste ab: prüfen, testen, bauen und ausliefern.",
    realWorld: {
      title: "Die Checkliste an der Küchenwand",
      text: "In der Küche der Truckfirma hängt eine Checkliste an der Wand: „Wenn ein neues Rezept kommt: 1. Testcharge kochen, 2. zwei Tester probieren lassen, 3. Rezeptkarten drucken, 4. an die Trucks schicken.“ Ein Küchenhelfer folgt ihr aufs Wort, jedes Mal, und notiert, was passiert ist. Die Checkliste steht im Rezeptbuch, die Routine zu ändern heißt also nur, eine Seite zu bearbeiten.",
    },
    engineering: {
      text: "GitHub Actions ist das eingebaute CI/CD von GitHub. Workflows sind YAML-Dateien in .github/workflows, die Jobs bei Ereignissen wie push, pull_request, schedule oder manuellem Start ausführen. Jobs laufen auf von GitHub gehosteten oder eigenen Runnern, bestehen aus Steps mit Shell-Befehlen oder wiederverwendbaren Actions und können voneinander abhängen, parallel oder als Matrix laufen. Secrets, Environments mit Schutzregeln, Caching und Artefakte sind eingebaut.",
      pitfalls: [
        "Pinne Actions von Dritten auf eine Version oder einen Commit-SHA; eine gekaperte Action läuft mit deinen Secrets.",
        "Gib jedem Workflow über den Schlüssel permissions nur die nötigen Rechte.",
        "Secrets werden an Workflows aus Forks nicht weitergegeben; plane Pull-Request-Checks entsprechend.",
      ],
    },
    keywords: ["Workflow", "YAML", "Runner"],
  },
  "deployment-06": {
    name: "Eval-Gates in der CI",
    official: "Das Deployment stoppt, wenn Eval-Werte unter deine Schwelle fallen.",
    kid: "Bevor ein neues Rezept zu den Trucks geht, bewerten Tester es. Schneidet es schlechter ab als das alte, bleibt das neue in der Küche.",
    realWorld: {
      title: "Das Probierteam an der Tür",
      text: "Jedes neue Rezept trifft jetzt an der Küchentür auf ein Probierteam. Jede Version wird an 50 Testgerichten gegen die aktuelle bewertet. Die Regel ist einfach: Mindestens 90 % der Gerichte müssen bestehen, und der Wert darf um höchstens zwei Punkte sinken. Eine billigere Soße, die Geld spart, aber beim Probieren durchfällt, erreicht nie einen Kunden.",
    },
    engineering: {
      text: "Ein Eval-Gate ist ein verpflichtender CI/CD-Schritt, der die Eval-Suite gegen den Kandidaten laufen lässt (einen neuen Prompt, ein Modell, eine Retrieval-Einstellung oder eine Codeänderung) und Merge oder Deployment blockiert, wenn Werte unter absolute Schwellen fallen oder gegenüber der Baseline schlechter werden. So wird aus Evals statt eines Berichts eine Release-Kontrolle. Setz das Gate auf wenige verlässliche Metriken, fang den Nicht-Determinismus von LLMs mit Toleranzen oder wiederholten Läufen ab und poste am Pull Request einen Unterschied pro Fall.",
      pitfalls: [
        "Schwellen ohne gemessene Streuung der Werte machen Gates wackelig; miss zuerst das Rauschen.",
        "Setz das Gate auf das, was Nutzern wichtig ist (Richtigkeit, Sicherheit), nicht nur auf billige Ersatzmetriken.",
        "Halte einen Notfall-Override bereit, aber protokolliere jeden Override.",
      ],
    },
    keywords: ["Gate", "Eval", "Schwelle", "blockieren"],
  },
  "deployment-07": {
    name: "Umgebungskonfiguration",
    official: "Getrennte Einstellungen und Secrets für Entwicklung, Staging und Produktion.",
    kid: "Dasselbe Rezept nutzt zu Hause eine kleine Pfanne und auf dem Festival eine riesige. Umgebungseinstellungen sind die Notizen, welche Pfanne, welcher Schlüssel und welche Adresse wo gilt.",
    realWorld: {
      title: "Ein Truck, drei Einstellungskarten",
      text: "Der Truck ist derselbe, ob er zum Üben auf dem Hof, auf einem Testmarkt oder auf dem großen Festival steht. Was sich ändert, ist eine Einstellungskarte im Handschuhfach: welcher Lieferant angerufen wird, welches Kartenlesegerät genutzt wird, mit wie viel Personal zu rechnen ist. Tausch die Karte, nicht den Truck. Die PIN der Kasse steht nie auf der Karte; sie liegt in einer verschlossenen Kiste.",
    },
    engineering: {
      text: "Umgebungskonfiguration trennt, was sich zwischen Entwicklung, Staging und Produktion ändert (Datenbank-URLs, API-Keys, Modellnamen, Feature Flags, Log-Level, Rate Limits), vom Code und vom Build-Artefakt, meist über Umgebungsvariablen (der Twelve-Factor-Ansatz), die beim Start geladen und geprüft werden. Secrets kommen aus einem Secret Manager oder dem Secret Store der Plattform, nie aus dem Repository. Eine typisierte Settings-Klasse lässt einen fehlenden Wert beim Start scheitern statt bei der ersten Anfrage.",
      pitfalls: [
        "Eine committete .env-Datei verrät Secrets; trag sie in .gitignore ein und committe stattdessen eine .env.example.",
        "Konfiguration, die zwischen Staging und Produktion still abweicht, macht Staging-Tests bedeutungslos.",
        "Konfiguration erst bei Bedarf zu lesen, versteckt fehlende Werte bis zur ersten Anfrage in Produktion.",
      ],
    },
    keywords: ["Konfiguration", "Umgebungsvariablen", ".env", "Staging"],
  },
  "deployment-08": {
    official:
      "Definiere Server, Datenbanken und Netzwerke in Code (Terraform, Pulumi), statt herumzuklicken.",
    kid: "Statt jeden Truck von Hand zu bauen, schreibst du die Anleitung einmal auf, und eine Maschine baut immer wieder denselben Truck. Infrastructure as Code macht das für die Computer, die eine App braucht.",
    realWorld: {
      title: "Trucks nach Bauplan bauen",
      text: "Die ersten Trucks wurden von Hand zusammengebaut, und jeder wurde etwas anders: Bei einem war der Kühlschrank größer, bei einem fehlte ein Kabel. Jetzt hat die Firma einen schriftlichen Bauplan: Fahrgestell, Ofen, Kühlschrank, Verkabelung, Lack. Die Werkstatt baut jeden neuen Truck danach, und Änderungen laufen über den Bauplan, von einem zweiten Mechaniker geprüft, nie als schnelle Bastelei an einem Truck.",
    },
    engineering: {
      text: "Infrastructure as Code (IaC) definiert Cloud-Ressourcen (Netzwerke, Datenbanken, Buckets, Cluster, GPU-Instanzen, DNS, Berechtigungen) in versioniertem Code, und ein Werkzeug plant und wendet die Änderungen an, die zu diesem Zustand führen. Terraform und OpenTofu nutzen HCL und eine State-Datei; Pulumi und AWS CDK nutzen allgemeine Programmiersprachen. Die Vorteile sind reproduzierbare Umgebungen, Code-Review für Infrastruktur, Drift-Erkennung und einfaches Abreißen. Speichere den State entfernt mit Sperre und halte Secrets aus dem Code heraus.",
      pitfalls: [
        "Von Hand in der Cloud-Konsole gemachte Änderungen driften vom Code ab und werden überschrieben.",
        "Die State-Datei zu verlieren oder zu beschädigen ist schmerzhaft; nutze entfernten State mit Sperre.",
        "Lies immer den Plan: Eine umbenannte Ressource kann Löschen und Neuanlegen bedeuten, auch bei einer Datenbank.",
      ],
    },
    keywords: ["Terraform", "IaC", "Bauplan", "Cloud-Ressourcen"],
  },
  "deployment-09": {
    name: "Serverless-Funktionen",
    official:
      "Code bei Bedarf ausführen, ohne Server zu verwalten (AWS Lambda, Cloudflare Workers, Vercel).",
    kid: "Statt einen Truck zu besitzen, der den ganzen Tag wartet, mietest du Koch und Küche nur für die Minuten einer Bestellung. Serverless führt deinen Code nur aus, wenn er gebraucht wird, und du zahlst nur dafür.",
    realWorld: {
      title: "Eine Pop-up-Küche für jede Bestellung",
      text: "An manchen Abenden will niemand Burger, und ein geparkter Truck kostet trotzdem Geld. Also nutzt die Firma für die Spätkarte Pop-up-Küchen: Kommt eine Bestellung, erscheint eine Küche, kocht ein Essen und verschwindet. Bezahlt wird pro gekochtem Essen, nie fürs Warten. Der Haken: Die erste Bestellung des Abends wartet ein bisschen, während die Küche warm wird.",
    },
    engineering: {
      text: "Serverless-Funktionen (AWS Lambda, Cloudflare Workers, Vercel Functions) und Serverless-Container-Plattformen führen Code bei Bedarf als Reaktion auf Anfragen oder Ereignisse aus, skalieren automatisch bis auf null und rechnen pro Aufruf und Laufzeit ab. Sie passen zu APIs mit sprunghaftem Traffic, Webhooks und Verbindungscode. Für KI-Apps zählen ihre Grenzen: Kaltstarts, Laufzeitlimits, Speichergrenzen und auf den meisten Plattformen keine GPUs. Lange LLM-Aufrufe brauchen Streaming oder eine Queue, und schwere Inferenz läuft meist woanders.",
      pitfalls: [
        "Kaltstarts verzögern die erste Anfrage nach einer Pause; halte Abhängigkeiten klein.",
        "Laufzeitlimits können lange LLM-Generierungen abschneiden; streame oder verlagere die Arbeit in eine Queue.",
        "Preise pro Anfrage werden bei hohem, gleichmäßigem Traffic teuer; vergleiche mit dauerhaft laufenden Servern.",
      ],
    },
    keywords: ["Serverless", "Lambda", "Funktionen", "Kaltstart"],
  },
  "deployment-10": {
    name: "GPU-Instanzen",
    official: "GPU-Maschinen in der Cloud mieten, um Modelle zu betreiben oder zu fine-tunen.",
    kid: "Manche Aufgaben brauchen einen superstarken Motor, wie um einen riesigen Anhänger zu ziehen. GPU-Computer sind die starken Motoren für KI, und du kannst sie stundenweise mieten, statt einen zu kaufen.",
    realWorld: {
      title: "Den schweren Abschleppwagen mieten",
      text: "Meistens fahren die Trucks nur durch die Stadt. Aber einmal im Monat bewegt die Firma einen riesigen mobilen Ofen, und dafür braucht es einen schweren Abschleppwagen. Einen zu kaufen wäre Verschwendung, also mietet sie ihn stundenweise in einer Werkstatt. Schwere Abschleppwagen sind gefragt, manchmal ist die Werkstatt ausgebucht, und die billigste Miete kann kurzfristig zurückgerufen werden.",
    },
    engineering: {
      text: "GPU-Instanzen sind virtuelle Cloud-Maschinen mit Beschleunigern (zum Beispiel NVIDIA L4, A100, H100 oder neuer), mit denen offene Modelle betrieben oder fine-getunt werden. Wähle nach VRAM (Gewichte plus KV-Cache müssen hineinpassen), Speicherbandbreite, Verbindung für Arbeit mit mehreren GPUs und Preis. Die Optionen reichen von den großen Cloud-Anbietern über spezialisierte GPU-Clouds bis zu Serverless-GPU-Plattformen. Spot- oder Preemptible-Instanzen sind viel billiger, können aber zurückgeholt werden, und High-End-GPUs sind oft knapp.",
      pitfalls: [
        "Ungenutzte GPUs kosten so viel wie ausgelastete; fahr sie herunter oder skaliere bei Nichtnutzung auf null.",
        "Spot-Instanzen können mitten im Job verschwinden; setz beim Training Checkpoints und plane Neustarts ein.",
        "Prüf vor dem Mieten, dass Gewichte plus KV-Cache in den VRAM passen; lange Kontexte brauchen viel mehr Speicher.",
      ],
    },
    keywords: ["GPU", "mieten", "VRAM", "Spot-Instanzen"],
  },
  "deployment-11": {
    name: "Ollama für lokale Modelle",
    official:
      "Offene Modelle mit einem Befehl auf dem eigenen Laptop ausführen. Gut zum Testen und für den Datenschutz.",
    kid: "Statt ein Restaurant anzurufen, kochst du das Essen nach einer einfachen Rezeptkarte in deiner eigenen Küche. Ollama lässt KI-Modelle mit einem Befehl auf deinem Computer laufen, und nichts verlässt dein Haus.",
    realWorld: {
      title: "Zu Hause üben",
      text: "Bevor die Köche ein neues Gericht in den Trucks probieren, üben sie zu Hause. Dafür brauchen sie nicht die große Küche: Eine kleine Hausversion des Rezepts reicht, um Ideen zu testen, und kein Kunde sieht je die Fehler. Ollama ist diese Küche zu Hause: Es lädt kleine, komprimierte Versionen offener Modelle herunter und lässt sie auf einem Laptop laufen, sogar ohne Internet.",
    },
    engineering: {
      text: "Ollama lädt Open-Weight-Modelle (Llama, Qwen, Mistral, Gemma und mehr) mit einem Befehl herunter und führt sie lokal aus, meist als quantisierte GGUF-Modelle, und bietet eine lokale REST-API plus einen OpenAI-kompatiblen Endpunkt. Ideal für Entwicklung ohne API-Kosten, für private Daten, die die Maschine nicht verlassen dürfen, für Offline-Nutzung und schnelle Modellvergleiche. Für Serving mit hohem Durchsatz und vielen Nutzern ist es nicht gebaut; nimm dafür vLLM oder Ähnliches.",
      pitfalls: [
        "Kleine lokale Modelle sind viel schwächer als Frontier-Modelle; beurteile die Qualität deines Produkts nicht an ihnen.",
        "Die Standard-Kontextlänge ist oft klein; setz sie für lange Dokumente explizit.",
        "Die Geschwindigkeit hängt stark von RAM und GPU ab; Maschinen nur mit CPU sind langsam.",
      ],
    },
    keywords: ["lokal", "Laptop", "offline", "Datenschutz"],
  },
  "deployment-12": {
    official: "Instanzen automatisch hinzufügen oder entfernen, wenn der Traffic steigt und fällt.",
    kid: "Endet ein Fußballspiel und die Menge strömt heraus, kommen mehr Foodtrucks, und später fahren sie wieder heim. Autoscaling fügt Kopien einer App von selbst hinzu oder entfernt sie, wenn Besucher kommen und gehen.",
    realWorld: {
      title: "Mehr Trucks, wenn die Menge kommt",
      text: "An einem ruhigen Dienstag reichen zwei Trucks. Leert sich nach einem Spiel das Stadion, explodiert die Schlange. Der Disponent hat eine Regel: Warten an jedem Truck mehr als 20 Leute, schick einen weiteren, bis zu zehn; bleiben die Schlangen 15 Minuten kurz, schick einen heim, aber nie weniger als zwei. Niemand muss die ganze Nacht die Schlangen beobachten.",
    },
    engineering: {
      text: "Autoscaling fügt Instanzen (Pods, VMs oder Serverless-Instanzen) anhand von Lastsignalen wie CPU, Speicher, laufenden Anfragen, Queue-Länge oder eigenen Metriken wie Tokens pro Sekunde hinzu oder entfernt sie, zwischen einem Minimum und einem Maximum. Horizontale Skalierung fügt Kopien hinzu; vertikale Skalierung macht eine Kopie größer. LLM-Dienste skalieren oft besser nach Queue-Tiefe oder gleichzeitigen Anfragen als nach CPU, und GPU-gestützte Dienste skalieren langsam, weil jede neue Instanz starten und das Modell laden muss.",
      pitfalls: [
        "Skalieren nach CPU verpasst LLM-Engpässe; Queue-Länge oder Nebenläufigkeit sind oft bessere Signale.",
        "Neue Instanzen brauchen Zeit zum Starten und Modell-Laden; skaliere früh und halte ein warmes Minimum.",
        "Ohne Maximum wird eine Traffic-Spitze oder ein Bug zu einer riesigen Rechnung.",
      ],
    },
    keywords: ["Skalierung", "automatisch", "Instanzen", "Last"],
  },
  "deployment-13": {
    name: "Load Balancing",
    official: "Verteil Anfragen über Instanzen, damit keine einzelne überlastet wird.",
    kid: "Auf einem vollen Markt gibt eine Helferin jedem neuen Kunden einen Zettel für den Truck mit der kürzesten Schlange. Ein Load Balancer macht das für App-Besucher, damit keine Kopie überlastet wird.",
    realWorld: {
      title: "Die Helferin mit dem Schild am Eingang",
      text: "Am Festivaleingang steht eine Helferin mit einem Schild. Sie schickt jeden ankommenden Kunden der Reihe nach zu einem anderen Truck, und ist die Schlange an einem Truck deutlich länger, schickt sie die Leute woandershin. Gehen bei einem Truck die Lichter aus, schickt sie niemanden mehr hin, bis er wieder läuft. Die Kunden sehen nur einen Eingang, nie, welcher Truck sie bedient hat.",
    },
    engineering: {
      text: "Ein Load Balancer verteilt eingehende Anfragen hinter einer Adresse über gesunde Instanzen, mit Algorithmen wie Round Robin, Least Connections oder gewichtetem Routing, und nimmt Instanzen heraus, die Health Checks nicht bestehen. Er ermöglicht horizontale Skalierung, Rolling Deployments und Hochverfügbarkeit; Layer-7-Balancer können zusätzlich nach Pfad oder Header routen und TLS terminieren. Beim LLM-Serving schlägt Routing nach den wenigsten offenen Anfragen das Round Robin, weil Anfragen extrem unterschiedlich lange dauern.",
      pitfalls: [
        "Round Robin bei sehr ungleichen Anfragelängen überlastet manche Instanzen; bevorzuge Least Connections.",
        "Standard-Timeouts von Proxys können lange LLM-Antworten abschneiden; erhöhe sie für diese Routen.",
        "Sticky Sessions verstecken ungleiche Last und brechen, wenn eine Instanz ausfällt; halte Instanzen zustandslos.",
      ],
    },
    keywords: ["Lastverteilung", "Load Balancer", "Round Robin"],
  },
  "deployment-14": {
    official: "Schick erst einen kleinen Teil des Traffics zur neuen Version und roll sie dann für alle aus.",
    kid: "Bevor du einen neuen Kuchen für alle backst, lässt du erst ein paar Freunde ein Stück probieren. Schmeckt er ihnen, bekommen mehr Leute davon; wenn nicht, kehrst du zum alten Kuchen zurück.",
    realWorld: {
      title: "Ein Truck probiert den neuen Burger zuerst",
      text: "Der neue Burger geht nicht am ersten Tag an alle fünfzig Trucks. Zuerst serviert ihn ein Truck in einer ruhigen Straße etwa jedem zwanzigsten Kunden. Die Firma vergleicht Beschwerden, Reste und Umsatz mit dem alten Rezept. Sieht es nach einem Tag gut aus? Zehn Trucks. Dann alle. Beschweren sich die Kunden, stellt nur dieser eine Truck zurück um.",
    },
    engineering: {
      text: "Ein Canary Release schickt einen kleinen Teil des echten Traffics (etwa 5 %) zur neuen Version, während der Rest auf der aktuellen bleibt, vergleicht Fehlerrate, Latenz, Kosten und Qualitätsmetriken und erhöht den Anteil schrittweise, mit automatischem Rollback, wenn Metriken schlechter werden. Es begrenzt den Schaden schlechter Releases, auch von LLM-Regressionen, die Offline-Evals übersehen haben. Den Traffic teilen der Load Balancer, ein Service Mesh, ein API-Gateway oder Werkzeuge wie Argo Rollouts und Flagger auf.",
      pitfalls: [
        "Bei wenig Traffic sind 5 % vielleicht zu wenige Anfragen, um ein Problem zu erkennen; warte länger oder erhöhe den Anteil.",
        "Vergleiche Canary und Baseline über denselben Zeitraum; Effekte der Tageszeit führen in die Irre.",
        "Datenbankänderungen müssen mit beiden Versionen gleichzeitig funktionieren.",
      ],
    },
    keywords: ["Canary", "schrittweise", "Rollout", "kleiner Anteil"],
  },
  "deployment-15": {
    official: "Ein Feature für einige Nutzer ein- oder ausschalten, ohne neu zu deployen.",
    kid: "Wie ein Schalter an einem Spielzeug schaltet ein Feature Flag einen neuen Teil einer App an oder aus. Du kannst ihn nur für ein paar Leute anschalten, ohne etwas neu zu bauen.",
    realWorld: {
      title: "Schalter im Büro, nicht in den Trucks",
      text: "Die Firma will eine vegane Karte ausprobieren. Statt für jeden Truck neue Karten zu drucken, haben alle Trucks sie schon versteckt dabei, und eine Schalttafel im Büro entscheidet, welche Trucks sie zeigen: erst zwei Trucks, dann ein ganzer Stadtteil, dann alle. Gehen dem Lieferanten die veganen Patties aus, versteckt ein Klick die Karte überall wieder.",
    },
    engineering: {
      text: "Feature Flags sind Schalter zur Laufzeit, ausgewertet pro Anfrage, Nutzer oder Segment, die Codepfade ohne Deployment an- oder ausschalten. Sie trennen Deployment von Release und ermöglichen schrittweise Rollouts, Beta-Gruppen, A/B-Tests, Notschalter für riskante Features (zum Beispiel ein neues Agent-Tool) und Konfiguration pro Kunde. Nutze einen Flag-Dienst oder eine Bibliothek (LaunchDarkly, Unleash oder OpenFeature-kompatible Anbieter), gib jedem Flag einen Verantwortlichen und ein Ablaufdatum und entferne Flags, wenn du fertig bist.",
      pitfalls: [
        "Alte Flags häufen sich zu verwirrendem totem Code an; entferne sie nach einem vollständigen Rollout.",
        "Jedes Flag verdoppelt die zu testenden Pfade; halte nur wenige gleichzeitig aktiv.",
        "Cache Flag-Werte lokal, damit der Flag-Dienst kein Single Point of Failure ist.",
      ],
    },
    keywords: ["Schalter", "Feature Flag", "Rollout", "Notschalter"],
  },
  "deployment-16": {
    name: "Prompt-Versionierung",
    official: "Behandle Prompts wie Code: versioniert, geprüft und leicht zurückzunehmen.",
    kid: "Jedes Mal, wenn die Köchin die Rezeptkarte ändert, schreibt sie eine neue Nummer darauf und behält die alten Karten. Schmeckt die neue schlechter, nimmt sie einfach wieder die alte Karte.",
    realWorld: {
      title: "Nummerierte Rezeptkarten in einem Ordner",
      text: "Früher kritzelten die Köche Änderungen auf eine einzige Rezeptkarte, und niemand wusste mehr, warum sich die Burger im Mai verändert hatten. Jetzt ist jede Änderung eine neue nummerierte Karte in einem Ordner, mit einer Notiz, wer was warum geändert hat, und einer Probierbewertung. Die Truck-Karte verweist auf „Karte 14“. Zurück zu Karte 13 dauert eine Sekunde.",
    },
    engineering: {
      text: "Prompt-Versionierung behandelt Prompts wie Code: in der Versionskontrolle oder einer Prompt-Registry gespeichert, per Review geändert, mit Evals getestet, per Label freigegeben (production, staging) und mit jeder Anfrage geloggt, damit du weißt, welcher Prompt welche Ausgabe erzeugt hat. Templates trennen die festen Anweisungen von den Variablen. Zusammen mit Eval-Gates und Feature Flags ermöglicht das sicheres Iterieren und sofortiges Zurücknehmen ohne neues Deployment.",
      pitfalls: [
        "Prompts in Produktion ohne Review oder Evals zu ändern ist die häufigste Ursache stiller Regressionen.",
        "Loggen Anfragen die Prompt-Version nicht, kannst du eine Ausgabe weder erklären noch reproduzieren.",
        "Eine Prompt-Version bedeutet nur zusammen mit der Modellversion etwas, mit der sie getestet wurde.",
      ],
    },
    keywords: ["Prompt", "Version", "Registry", "zurücknehmen"],
  },
  "deployment-17": {
    name: "Modell-Versionierung",
    official: "Pinne exakte Modellversionen und halte fest, welche Version jede Anfrage beantwortet hat.",
    kid: "Kaufst du immer „das neueste“ Mehl, kann dein Kuchen ohne Vorwarnung anders schmecken. Modell-Versionierung heißt, genau aufzuschreiben, welches Mehl du benutzt hast, damit jeder Kuchen gleich wird.",
    realWorld: {
      title: "Genau welches Mehl, aus welcher Charge",
      text: "An einem Montag schmeckten die Burger anders, und niemand wusste warum. Der Lieferant war für „Standardbrötchen“ still auf ein neues Mehl umgestiegen. Jetzt bestellt die Firma ein genaues Mehl aus einer genauen Charge, schreibt die Charge auf jeden Lieferschein und testet eine neue Charge in einem Truck, bevor sie wechselt. Ein neues Mehl ist eine Änderung wie jede andere.",
    },
    engineering: {
      text: "Modell-Versionierung pinnt exakte Modellkennungen oder datierte Snapshots statt wandernder Aliase wie „latest“, speichert Modell-ID und Parameter mit jeder Anfrage und behandelt Modell-Upgrades als Deployments, die Evals und Canaries durchlaufen. Für selbst gehostete und fine-getunte Modelle speichert eine Modell-Registry (MLflow, Revisionen im Hugging Face Hub) Artefakte mit Versionen, Herkunft und Stage-Labels. Anbieter nehmen alte Modelle außer Betrieb, Upgrades müssen also geplant werden, und ein neues Embedding-Modell heißt, alles neu einzubetten.",
      pitfalls: [
        "Wandernde Aliase wie „latest“ ändern das Verhalten unter dir; pinne Versionen in Produktion.",
        "Ein neues Embedding-Modell macht jeden gespeicherten Vektor ungültig; plane ein vollständiges Neu-Einbetten.",
        "Anbieter nehmen alte Modelle außer Betrieb; verfolge Abkündigungstermine und teste den Nachfolger früh.",
      ],
    },
    keywords: ["Modellversion", "pinnen", "Registry", "Abkündigung"],
  },
  "deployment-18": {
    official: "Endpunkte, die der Plattform sagen, ob deine App lebt und bereit für Traffic ist.",
    kid: "Jeden Morgen fragt die Managerin jeden Truck: Ist deine Tür offen und dein Ofen heiß? Trucks, die nicht antworten, bekommen keine Kunden, bis sie repariert sind.",
    realWorld: {
      title: "Zwei Fragen alle paar Sekunden",
      text: "Der Disponent funkt jeden Truck alle zehn Sekunden mit zwei Fragen an. „Lebst du?“ Antwortet ein Truck nicht mehr, wird ein Mechaniker geschickt, um ihn neu zu starten. „Bist du bereit zum Verkaufen?“ Ein Truck, der lebt, aber noch seinen Ofen aufheizt, sagt Nein, also schickt die Helferin am Eingang noch keine Kunden hin. Zwei verschiedene Fragen, zwei verschiedene Reaktionen.",
    },
    engineering: {
      text: "Health Checks sind Endpunkte oder Befehle, die die Plattform abfragt, um zu entscheiden, was mit einer Instanz passiert. Liveness fragt, ob der Prozess gesund ist (sonst Neustart); Readiness fragt, ob er gerade Traffic bedienen kann (sonst raus aus dem Load Balancer, etwa während ein Modell lädt oder ein Cache aufwärmt). Startup Probes geben langsam startenden Diensten mehr Zeit. Halte Liveness billig und unabhängig von Abhängigkeiten; Readiness darf kritische Abhängigkeiten mit kurzen Timeouts prüfen.",
      pitfalls: [
        "Ein Liveness-Check, der die Datenbank aufruft, startet bei jedem kurzen Datenbankaussetzer alle Pods neu; halte ihn lokal.",
        "Ohne Readiness-Checks trifft Traffic Instanzen, die noch Modelle laden.",
        "Health-Endpunkte ohne Timeouts können hängen und den Check selbst scheitern lassen.",
      ],
    },
    keywords: ["Health Check", "Liveness", "Readiness", "Gesundheit"],
  },
  "deployment-19": {
    name: "Alarme und Dashboards",
    official: "Lass dich bei Fehlern, Latenz- oder Kostenspitzen alarmieren und sieh Trends auf einen Blick.",
    kid: "Eine Busfahrerin hat ein Armaturenbrett mit Lämpchen, die rot werden, wenn etwas nicht stimmt. Dashboards zeigen, wie es einer App geht, und Alarme klingeln, wenn ein Mensch handeln muss.",
    realWorld: {
      title: "Der große Bildschirm und der Pager",
      text: "Im Büro zeigt ein großer Bildschirm jeden Truck: Kunden pro Stunde, Wartezeit, weggeworfene Burger, Geld für Zutaten. Niemand starrt den ganzen Tag darauf. Stattdessen piept ein Pager, wenn etwas zählt: Die Wartezeit eines Trucks liegt über 15 Minuten, oder die Zutatenkosten sind doppelt so hoch wie sonst. Der Bildschirm ist zum Verstehen da, der Pager zum Handeln.",
    },
    engineering: {
      text: "Dashboards zeigen Schlüsselmetriken über die Zeit: Anfragerate, Fehlerrate, Latenz-Perzentile, Tokens und Kosten pro Feature, Eval- und Feedback-Werte, GPU-Auslastung. Alarme benachrichtigen die Bereitschaft, wenn eine Metrik eine Schwelle überschreitet oder für eine bestimmte Zeit vom Normalen abweicht. Für KI-Apps kommen Kostenspitzen, Tokens pro Nutzer, Ablehnungsquote, Quote leerer Retrievals und Anbieterfehler (429 und 5xx) dazu. Alarmiere bei Symptomen, die Nutzer spüren, häng an jeden Alarm ein Runbook und entferne laute Alarme, die Leuten das Ignorieren beibringen.",
      pitfalls: [
        "Zu viele Alarme führen zu Alarmmüdigkeit; pagen nur bei Problemen, die Nutzer spüren.",
        "Ein Alarm ohne Runbook lässt die Bereitschaft raten.",
        "Durchschnitte auf Dashboards verstecken Probleme; zeig Perzentile und schlüssle nach Feature und Modell auf.",
      ],
    },
    keywords: ["Alarm", "Dashboard", "Monitoring", "Bereitschaft"],
  },
  "deployment-20": {
    official: "In einem Schritt zur letzten guten Version zurück.",
    kid: "Mögen die Kunden das neue Rezept nicht, nimmst du sofort wieder die alte Rezeptkarte. Ein Rollback bringt in einem Schritt die letzte gute Version einer App zurück.",
    realWorld: {
      title: "Die Ersatztrucks mit der Karte von gestern",
      text: "Wenn die Firma die Trucks auf eine neue Karte umstellt, hält sie die Trucks von gestern vollgetankt und bereit um die Ecke. Sorgt die neue Karte für Chaos (falsche Preise, wütende Kunden), schickt der Disponent die alten Trucks mit einem Funkspruch zurück. Niemand muss nachts unter Druck etwas neu bauen. Zurückgehen muss schneller und sicherer sein als nach vorne zu reparieren.",
    },
    engineering: {
      text: "Ein Rollback stellt die letzte bekannte gute Version in einem Schritt wieder her: das vorherige Image-Tag neu deployen, den Kubernetes-Rollout rückgängig machen, in einem Blue-Green-Setup den Traffic zurückschalten, ein Feature Flag ausschalten oder ein Prompt- oder Modell-Label zurücksetzen. Das klappt nur, wenn Artefakte unveränderlich und versioniert sind, Konfiguration und Prompts ebenfalls versioniert sind und Datenbankmigrationen abwärtskompatibel bleiben. Scripte es als einen Befehl und übe es.",
      pitfalls: [
        "Migrationen, die Spalten löschen oder umbenennen, machen das Zurückrollen des Codes unmöglich; nutze Expand-and-Contract.",
        "Code zurückzurollen macht Nebenwirkungen wie gesendete E-Mails oder geschriebene Daten nicht rückgängig.",
        "Ein ungetesteter Rollback-Weg versagt genau dann, wenn du ihn brauchst; übe ihn.",
      ],
    },
    keywords: ["Rollback", "zurückrollen", "letzte gute Version"],
  },
};

export default concepts;
