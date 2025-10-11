---
title: developer-doc
description: Document from d:\Documents\rust-projects\yumlabs\docs\developer-doc.md
date: 2025-10-05
---

# Developer Documentation for YUMLABS

**Version:** 2.1
**Last Updated:** 2025-10-04

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Design System](#design-system)
4. [Modules Breakdown](#modules-breakdown)
5. [Dependencies](#dependencies)
6. [Configuration](#configuration)
7. [Development Guide](#development-guide)

---

## Project Overview

YUMLABS is a professional Rust-based GUI application built with the Iced framework. It serves as a multi-purpose assistant with LLM integration, todo management, and stock market tracking.

### Key Features
- **LLM Integration** - Query Perplexity and Gemini APIs
- **Todo Management** - Create, complete, and delete tasks (MongoDB: yumlabs.todos)
- **Finance Tracking** - Real-time stock market data with AI analysis (MongoDB: yumlabs.finance_data)
- **Tools Dashboard** - Quick access to external services
- **Professional UI** - Modern, streamlined design system

### Technical Stack
- **Rust 2021** - Systems programming language
- **Iced 0.13** - GUI framework with Tokio async
- **Reqwest** - HTTP client for API calls
- **MongoDB** - Consolidated database 'yumlabs' for todos, finance, and LLM data
- **Serde** - JSON serialization
- **Arboard** - Clipboard operations
- **Dotenv** - Environment configuration

### Window Configuration
- Size: 300x550 pixels
- Position: Bottom-right corner (1920x1080 screens)
- Style: Transparent, always-on-top, no decorations
- Focus: Query input focused on startup

---

## Architecture

### MVC-Inspired Structure

```
src/
├── main.rs              # Entry point, window setup
├── models.rs            # State management, message types
├── update/              # Business logic
│   ├── mod.rs          # Message router
│   ├── llm_updater.rs  # LLM logic
│   ├── todo_updater.rs # Todo logic
│   └── finance_updater.rs # Finance logic
├── view/                # UI rendering
│   ├── mod.rs          # View router
│   ├── llm_view.rs     # LLM interface
│   ├── todo_view.rs    # Todo list
│   ├── finance_view.rs # Stock market
│   ├── tools_view.rs   # Tools dashboard
│   └── components.rs   # Reusable components
├── colors.rs            # Color palette (15 colors)
├── theme.rs             # Component styles (6 functions)
├── api.rs               # LLM API integration
├── finance.rs           # Finance API integration
├── todo.rs              # Todo database models
├── mongo_connection.rs  # MongoDB connection
├── icons.rs             # Icon loading
└── constants.rs         # App constants
```

### Key Principles
- **Modular** - Clear separation of concerns
- **Async** - Tokio for non-blocking operations
- **Immutable** - State updates via messages
- **Typed** - Strong type safety with Result types
- **Declarative** - UI built with Iced widgets

---

## Design System

### Philosophy
The YUMLABS design system emphasizes **simplicity, consistency, and purpose**. Every color and component has a clear reason for existing.

### Color Palette (15 Colors)

#### Core Colors (3)
```rust
PRIMARY: #4285F4  // Professional blue - interactive elements, focus, scrollbars
SUCCESS: #34BB72  // Green - positive values, stock gains
ERROR:   #F2434F  // Red - negative values, stock losses
```

#### Neutral Colors (3)
```rust
BACKGROUND:       #171A21  // Main app background (96% opacity)
SURFACE:          #212730  // Cards, buttons (95% opacity)
SURFACE_ELEVATED: #292E3A  // Tooltips, hover states (97% opacity)
```

#### Text Colors (3)
```rust
TEXT_PRIMARY:   #F2F4F7  // Main content (high emphasis)
TEXT_SECONDARY: #B5BCC7  // Labels (medium emphasis)
TEXT_MUTED:     #949DAD  // Placeholders (low emphasis)
```

#### Border Colors (3)
```rust
BORDER:       #404857  // Default borders
BORDER_FOCUS: #4285F4  // Focused elements (primary blue)
BORDER_HOVER: #595C6C  // Hovered elements
```

#### Component-Specific (3)
```rust
PANEL_SHADOW:  rgba(0,0,0,0.65)  // Main panel shadow
BUTTON_SHADOW: rgba(0,0,0,0.35)  // Button shadows
INPUT_BG:      #1A1C23            // Input backgrounds
SELECTION:     rgba(#4285F4,0.25) // Text selection
SCROLLER_BG:   #1C1D28            // Scrollable backgrounds
```

### Typography
```rust
20px - Main titles (TEXT_PRIMARY)
16px - Section headers (TEXT_PRIMARY)
14px - Body text (TEXT_PRIMARY)
13px - Labels (TEXT_SECONDARY)
12px - Metadata (TEXT_SECONDARY)
10px - Fine print (TEXT_MUTED)
```

### Spacing System
```rust
8px  - Extra small (compact elements)
12px - Small (buttons, inputs)
16px - Medium (cards)
24px - Large (view padding)
```

### Component Library (6 Functions)

#### 1. panel()
Main application container
```rust
container(content).style(theme::panel())
```

#### 2. panel_button()
Universal button with three states (default, hover, pressed)
```rust
button(content).padding(12).style(theme::panel_button())
```

#### 3. input()
Text input with focus effects
```rust
text_input("Placeholder", &value).padding(12).style(theme::input())
```

#### 4. picker() & picker_menu()
Dropdown selection
```rust
pick_list(options, selected, on_select)
    .style(theme::picker())
    .menu_style(theme::picker_menu())
```

#### 5. scroller()
Scrollable container with custom scrollbar
```rust
scrollable(content).style(theme::scroller())
```

#### 6. tooltip()
Tooltip with elevated appearance
```rust
tooltip(element, "Text", Position::Bottom).style(theme::tooltip())
```

### Design Patterns

#### View Layout
```rust
column![
    row![back_button].align_y(Alignment::Center),
    text("Title").size(20).style(|_| text::Style {
        color: Some(crate::colors::TEXT_PRIMARY),
    }),
    // content...
]
.spacing(18)
.padding(24)
```

#### Button Group
```rust
row![btn1, btn2, btn3]
    .spacing(12)
    .align_y(Alignment::Center)
```

#### Form Field
```rust
column![
    text("Label").size(13).style(|_| text::Style {
        color: Some(crate::colors::TEXT_SECONDARY),
    }),
    text_input("Placeholder", &value).padding(12).style(theme::input())
]
.spacing(8)
```

---

## Modules Breakdown

### main.rs
Entry point (src/main.rs). Sets up the Iced application with window settings and initial state.

- **Imports**: `iced::window::{self, Level, Position}`, `iced::{Task, Point}`, and local modules.
- **main()**: Creates default `LlmWidget` state, configures window (size 300x550, position bottom-right, always-on-top, no decorations, transparent), runs app with initial task to focus the query input field.
- **Purpose**: Bootstraps the GUI loop; sets up initial focus for user convenience.

### models.rs
Core data models (src/models.rs). Defines state, enums, and messages for the app.

- **`AppState` Struct**: The single source of truth for the application. It holds the `current_view` and instances of view-specific states like `LlmState` and `TodoState`. It also contains global fields like `is_loading` and `error`.
- **View-Specific States**: Structs like `LlmState` and `TodoState` hold data relevant only to their corresponding views.
- **`Message` Enum**: A nested enum structure. The top-level `Message` handles global events and navigation, while sub-enums like `LlmMessage` and `TodoMessage` contain actions specific to a view.
- **Purpose**: To create a modular and scalable state management system where state and logic are co-located by feature.

### update.rs
The `update` module is responsible for all state mutations.

- **`update/mod.rs`**: The main entry point. The `update` function acts as a router, delegating messages to the appropriate sub-updater based on the message variant (e.g., `Message::Llm` goes to `llm_updater`).
- **`update/llm_updater.rs`**, **`update/todo_updater.rs`**: Each file handles the logic for its specific part of the state. They receive the relevant `Message` variant and a mutable reference to the main `AppState`.
- **Purpose**: To break down the application logic into manageable, feature-specific chunks, improving readability and maintainability.

### view.rs
The `view` module is responsible for UI rendering.

- **`view/mod.rs`**: The main entry point. Contains the top-level `view` function that acts as a router, selecting which sub-view to render based on the application's current state (`LlmWidget.current_view`).
- **`view/llm_view.rs`**, **`view/todo_view.rs`**, etc.: Each file is responsible for building a specific screen of the application. They contain the layout logic and widget definitions for their respective views.
- **`view/components.rs`**: Contains reusable UI components, such as `create_button` and `build_error_display`, that are shared across multiple views.
- **Purpose**: To create a modular and maintainable UI layer by separating the concerns of each view.

### colors.rs
Professional color palette (src/colors.rs). Defines a streamlined, focused color system.

- **Primary Color**: PRIMARY (#4285F4) - Professional blue for interactive elements
- **Status Colors**: SUCCESS (#34BB72) green, ERROR (#F2434F) red
- **Neutral Colors**: BACKGROUND, SURFACE, SURFACE_ELEVATED - Dark theme layers
- **Text Colors**: TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED - Clear hierarchy
- **Border Colors**: BORDER, BORDER_FOCUS, BORDER_HOVER - Interactive states
- **Component Colors**: PANEL_SHADOW, BUTTON_SHADOW, INPUT_BG, SELECTION, SCROLLER_BG
- **Purpose**: Minimal, essential color palette for consistency and maintainability

### theme.rs
Professional component styling (src/theme.rs). Defines style functions for all UI components.

- **panel()**: Main application container with background, border, shadow
- **panel_button()**: Universal button style with three states (default, hover, pressed)
  - Default: Surface background, border, subtle shadow
  - Hover: Elevated surface, enhanced border, larger shadow
  - Pressed: Primary border, reduced shadow
- **input()**: Text input with focus ring and hover states
- **picker()**: Pick list styled with hover feedback
- **picker_menu()**: Dropdown menu with elevated appearance
- **scroller()**: Scrollable container with custom scrollbar (primary blue thumb)
- **tooltip()**: Elevated tooltip with shadow
- **Purpose**: Consistent, professional theming across all components

### api.rs
API interaction (src/api.rs). Handles async LLM queries.

- **Imports**: Serde, dotenv, std::env.
- **get_api_key()** (lines 7-22): Loads dotenv, checks env for PERPLEXITY_API_KEY or GEMINI_API_KEY.
- **Structs**: ChatCompletionRequest/MessageReq (Perplexity), ChatCompletionResponse/Choice/MessageResp (Perplexity response); GeminiRequest/Content/Part (Gemini), GeminiResponse/Candidate/ContentResp/PartResp (Gemini response).
- **fetch_llm_response()** (lines 86-173): Async fn taking query, provider, model.
  - Loads dotenv, creates reqwest client.
  - Match provider:
    - Perplexity: Gets API key, builds ChatCompletionRequest, POST to api.perplexity.ai, parses response.
    - Gemini: Gets API key, builds GeminiRequest, POST to generativelanguage.googleapis.com with model, parses response.
  - Returns Result<String, String> with content or error.
- **Purpose**: Encapsulates HTTP logic; error handling for keys, requests, parsing.

## Dependencies
From Cargo.toml:
- iced 0.13 (tokio feature): GUI framework.
- reqwest 0.12 (json): HTTP client.
- serde 1.0 (derive): Serialization.
- arboard 3.4.0: Clipboard.
- tokio 1 (full): Async runtime.
- dotenv 0.15.0: Env loading.

## Configuration
- API keys: Set PERPLEXITY_API_KEY and GEMINI_API_KEY in .env file.
- Build: `cargo build`.
- Run: `cargo run` (loads .env automatically).
- Development: Install cargo-watch with `cargo install cargo-watch`, then use `cargo watch -x run` for auto-rebuild and run on file changes.
- No linting specified; use `cargo clippy` for checks.

---

## Development Guide

### Getting Started

1. **Clone and Setup**
   ```bash
   git clone <repository>
   cd yumlabs
   ```

2. **Configure Environment**
   Create `.env` file:
   ```
   PERPLEXITY_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   MONGODB_URI=your_mongodb_uri
   ```

3. **Build and Run**
   ```bash
   cargo build
   cargo run
   ```

4. **Development Mode**
   ```bash
   cargo install cargo-watch
   cargo watch -x run
   ```

### Code Patterns

#### Async Operations
```rust
// In update.rs
Task::perform(
    async move {
        api::fetch_llm_response(query, provider, model).await
    },
    |result| Message::Llm(LlmMessage::ResponseReceived(result))
)
```

#### Error Handling
```rust
match result {
    Ok(data) => {
        state.data = Some(data);
        state.error.clear();
    }
    Err(e) => {
        state.error = format!("Error: {}", e);
    }
}
```

#### State Updates
```rust
// Immutable updates via messages
pub fn update(state: &mut AppState, message: Message) -> Task<Message> {
    match message {
        Message::Llm(msg) => llm_updater::update(state, msg),
        Message::Todo(msg) => todo_updater::update(state, msg),
        // ...
    }
}
```

### Best Practices

#### Colors
✅ Use `PRIMARY` for interactive elements
✅ Use `SUCCESS` for positive values
✅ Use `ERROR` for negative values
✅ Use `TEXT_PRIMARY` for main content
❌ Don't use hardcoded RGB values
❌ Don't create custom colors

#### Components
✅ Use `panel_button()` for ALL buttons
✅ Apply consistent padding (12px buttons, 16px cards, 24px views)
✅ Use theme functions for styling
❌ Don't create custom button styles
❌ Don't skip hover/focus states

#### Spacing
✅ Use 8, 12, 16, 24px values
✅ 18px for section spacing
✅ 24px for view padding
❌ Don't use arbitrary values

### Testing
```bash
cargo test
cargo clippy  # Linting
cargo fmt     # Formatting
```

### Database Migration (2025-10-04)
The application previously used separate MongoDB databases: `finance_db`, `llm_db`, and `todo_db`. These have been consolidated into a single database named `yumlabs` with the following collections:
- `todos` (from todo_db)
- `finance_data` (from finance_db)
- `llm_responses` (from llm_db)

If migrating from older versions, use `mongodump` and `mongorestore` to consolidate data. Ensure your `MONGODB_URI` in `.env` points to the correct MongoDB instance.

### Common Tasks

#### Adding a New View
1. Create `src/view/new_view.rs`
2. Add view enum variant in `models.rs`
3. Add message enum variant in `models.rs`
4. Create updater in `src/update/new_updater.rs`
5. Wire up in `view/mod.rs` and `update/mod.rs`
6. Use `panel_button()` and follow spacing system

#### Adding a New Color
⚠️ **Think twice!** The palette is intentionally minimal.
1. Add to `src/colors.rs` with clear purpose
2. Document usage in this file
3. Update design system section

#### Styling a Component
```rust
// Use existing theme functions
button(content).style(theme::panel_button())
text_input(placeholder, value).style(theme::input())

// For custom containers
container(content).style(|_| container::Style {
    background: Some(Background::Color(crate::colors::SURFACE)),
    border: Border {
        color: crate::colors::BORDER,
        width: 1.0,
        radius: 12.0.into(),
    },
    ..Default::default()
})
```

### Troubleshooting

**Build Errors**
- Check Rust version: `rustc --version` (need 2021 edition)
- Update dependencies: `cargo update`
- Clean build: `cargo clean && cargo build`

**API Errors**
- Verify `.env` file exists and has correct keys
- Check API key validity
- Review error messages in UI

**MongoDB Errors**
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure 'yumlabs' database exists and has proper permissions
- Confirm collections: todos, finance_data, llm_responses

### Code Navigation Tips

1. **Start with** `models.rs` - Understand state structure
2. **Follow message flow** - View → Message → Update → Task
3. **Check theme** - `colors.rs` and `theme.rs` for styling
4. **Review views** - `src/view/` for UI patterns
5. **API integration** - `api.rs` and `finance.rs` for external calls

### File References
- State: `src/models.rs`
- Logic: `src/update/*.rs`
- UI: `src/view/*.rs`
- Styling: `src/colors.rs`, `src/theme.rs`
- APIs: `src/api.rs`, `src/finance.rs`
- Database: `src/todo.rs`, `src/mongo_connection.rs`

---

## Additional Documentation

- **Finance Feature**: See `finance-implementation.md` for stock market feature details
- **Proposed Features**: See `proposed.md` for future enhancements
- **Workflow**: See `workflow.md` for development workflow

---

**Last Updated:** 2025-10-04
**Version:** 2.1
**Maintainer:** YUMLABS Team
