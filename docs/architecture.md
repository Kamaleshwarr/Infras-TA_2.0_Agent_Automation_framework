# Architecture

Visual reference for framework design, lifecycles, and folder relationships.

## Framework Flow

```mermaid
flowchart TD
    F[Feature File<br/>Gherkin] --> SD[Step Definition<br/>Cucumber Glue]
    SD --> P[Page Object<br/>Business Actions]
    P --> L[Locator File<br/>Selectors]
    P --> B[Base Layer<br/>Actions & Assertions]
    B --> PW[Playwright API]
    PW --> BR[Browser<br/>Chromium / Chrome / Firefox / Edge / WebKit]

    TD[Test Data Provider] --> SD
    CFG[Environment Config] --> P
    CFG --> BR
    HK[Hooks] --> BR
    HK --> RPT[Allure Report]
```

## Layer Responsibilities

| Layer           | Input                 | Output              | Contains       |
| --------------- | --------------------- | ------------------- | -------------- |
| Feature         | Business requirements | Gherkin scenarios   | Tags, Examples |
| Step Definition | Gherkin step          | Page method call    | No Playwright  |
| Page            | Business intent       | Composed actions    | No selectors   |
| Locator         | UI structure          | Playwright Locators | No logic       |
| Base            | Locators + intent     | Playwright calls    | Generic only   |

## Folder Relationships

```mermaid
flowchart LR
    subgraph src
        features --> stepdefinitions
        stepdefinitions --> pages
        pages --> locators
        pages --> base
        hooks --> pages
        hooks --> config
        config --> constants
        stepdefinitions --> testdata
        utils --> hooks
        utils --> pages
    end

    subgraph external
        config --> dotenv[.env files]
        hooks --> allure[Allure Results]
    end
```

## Execution Lifecycle

```mermaid
sequenceDiagram
    participant C as Cucumber
    participant H as Hooks
    participant BM as BrowserManager
    participant BF as BrowserFactory
    participant PO as Page Object
    participant PW as Playwright

    C->>H: BeforeAll (init reports)
    C->>H: Before (scenario start)
    H->>BM: getBrowser()
    BM->>BF: getBrowserType() + launchOptions
    BF->>PW: launch()
    H->>PW: newContext() + newPage()
    C->>PO: execute steps
    PO->>PW: actions via BaseActions
    C->>H: After (scenario end)
    alt failure
        H->>PW: screenshot + trace + video
        H->>C: attach artifacts
    else pass
        H->>PW: cleanup video (retain-on-failure)
    end
    H->>PW: closeContext()
    C->>H: AfterAll
    H->>BM: closeBrowser()
```

## Browser Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Idle: Framework start
    Idle --> BrowserLaunch: First scenario in worker
    BrowserLaunch --> ContextCreated: Before hook
    ContextCreated --> PageReady: newPage()
    PageReady --> ScenarioRunning: Steps execute
    ScenarioRunning --> ContextClosed: After hook
    ContextClosed --> BrowserLaunch: Next scenario (reuse browser)
    ContextClosed --> BrowserClosed: AfterAll
    BrowserClosed --> [*]
```

One **browser** per Cucumber worker. One **context + page** per scenario.

## Reporting Lifecycle

```mermaid
flowchart TD
    A[Test Start] --> B[Allure: scenario metadata]
    B --> C{Scenario result?}
    C -->|Pass| D[Log success]
    C -->|Fail| E[Screenshot attach]
    E --> F{Tracing enabled?}
    F -->|Yes| G[Trace ZIP attach]
    F -->|No| H{Video enabled?}
    G --> H
    H -->|Yes| I[Video attach]
    H -->|No| J[Write Allure result]
    D --> J
    I --> J
    J --> K[allure generate → HTML report]
```

## Browser Selection

Configured via `BROWSER` environment variable — no code changes:

| Value      | Engine                        |
| ---------- | ----------------------------- |
| `chromium` | Playwright Chromium (default) |
| `chrome`   | Installed Google Chrome       |
| `firefox`  | Playwright Firefox            |
| `edge`     | Installed Microsoft Edge      |
| `webkit`   | Playwright WebKit             |

## Related Documentation

- [Folder Structure](folder-structure.md)
- [Configuration](configuration.md)
- [Running Tests](running-tests.md)
- [`.cursor/rules/architecture.md`](../.cursor/rules/architecture.md)
