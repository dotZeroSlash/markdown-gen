---
title: README
description: Document from d:\Documents\rust-projects\yumlabs\README.md
date: 2025-10-05
---

# 🚀 YUMLABS

<div align="center">

![Rust](https://img.shields.io/badge/Rust-2021-orange?style=for-the-badge&logo=rust)
![Iced](https://img.shields.io/badge/Iced-0.13-blue?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A professional, multi-purpose desktop assistant built with Rust**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

**YUMLABS** is a sleek, always-on-top desktop assistant that combines the power of AI, productivity tools, and financial tracking into a single, elegant interface. Built with Rust and the Iced GUI framework, it delivers blazing-fast performance with a modern, professional design.

### ✨ Highlights

- 🤖 **AI-Powered** - Integrated with Perplexity and Gemini LLMs for intelligent queries
- 📝 **Task Management** - MongoDB-backed todo system for persistent task tracking
- 📈 **Finance Tracking** - Real-time stock market data with AI-powered analysis
- 🎨 **Beautiful UI** - Professional dark theme with smooth interactions
- ⚡ **Lightning Fast** - Native Rust performance with async operations
- 🪟 **Always Available** - Compact, always-on-top window for quick access

---

## 🎯 Features

### 🧠 LLM Integration
Query multiple AI providers directly from your desktop:
- **Perplexity AI** - Advanced reasoning and research capabilities
- **Gemini** - Google's powerful language model
- Copy responses to clipboard with one click
- Model selection for fine-tuned control

### ✅ Todo Management
Stay organized with a persistent task system:
- Create, complete, and delete tasks
- MongoDB backend for reliable storage
- Clean, intuitive interface
- Real-time updates

### 💹 Finance Dashboard
Track the stock market with AI insights:
- Real-time stock quotes via Finnhub API
- AI-powered stock recommendations
- Daily market analysis
- Smart caching (refreshes daily)
- Visual indicators for gains/losses

### 🛠️ Tools Hub
Quick access to your favorite services:
- VS Code integration
- Twitch, YouTube, GitHub shortcuts
- Perplexity, Claude, and more
- One-click navigation

---

## 🚀 Installation

### Prerequisites

- **Rust** (2021 edition or later) - [Install Rust](https://rustup.rs/)
- **MongoDB** - [Install MongoDB](https://www.mongodb.com/try/download/community)
- **API Keys** (optional, for full functionality):
  - [Perplexity API Key](https://www.perplexity.ai/)
  - [Gemini API Key](https://ai.google.dev/)
  - [Finnhub API Key](https://finnhub.io/)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yumlabs.git
   cd yumlabs
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```env
   PERPLEXITY_API_KEY=your_perplexity_key_here
   GEMINI_API_KEY=your_gemini_key_here
   MONGODB_URI=mongodb://localhost:27017
   ```

3. **Build and run**
   ```bash
   cargo build --release
   cargo run --release
   ```

### Development Mode

For active development with auto-reload:
```bash
cargo install cargo-watch
cargo watch -x run
```

---

## 💻 Usage

### Window Controls
- **Position**: Bottom-right corner (optimized for 1920x1080 displays)
- **Size**: 300x550 pixels - compact and unobtrusive
- **Always on Top**: Quick access without switching windows
- **Transparent**: Blends seamlessly with your desktop

### Keyboard Shortcuts
- **Focus**: Query input is auto-focused on startup
- **Enter**: Submit queries or create tasks
- **Escape**: Clear input or go back

### Navigation
- **Home Icon**: Return to main LLM view
- **Tools Icon**: Access tools dashboard
- **Todo Icon**: Open task manager
- **Finance Icon**: View stock market data

---

## 🏗️ Architecture

YUMLABS follows a clean, modular architecture inspired by MVC patterns:

```
src/
├── main.rs              # Application entry point
├── models.rs            # State management & message types
├── update/              # Business logic layer
│   ├── llm_updater.rs
│   ├── todo_updater.rs
│   └── finance_updater.rs
├── view/                # UI rendering layer
│   ├── llm_view.rs
│   ├── todo_view.rs
│   ├── finance_view.rs
│   └── components.rs
├── api.rs               # LLM API integration
├── finance.rs           # Finance API & data models
├── mongo_connection.rs  # Database connection
├── theme.rs             # UI styling system
└── colors.rs            # Color palette
```

### Key Technologies

| Technology | Purpose |
|------------|---------|
| **Iced 0.13** | Cross-platform GUI framework |
| **Tokio** | Async runtime for non-blocking operations |
| **Reqwest** | HTTP client for API calls |
| **MongoDB** | Persistent data storage |
| **Serde** | JSON serialization/deserialization |
| **Arboard** | Clipboard operations |

---

## 🎨 Design System

YUMLABS features a carefully crafted design system with:

- **15-color palette** - Minimal, purposeful color choices
- **Professional dark theme** - Easy on the eyes
- **Consistent spacing** - 8px grid system
- **Smooth interactions** - Hover and focus states
- **Custom components** - Buttons, inputs, tooltips, and more

### Color Philosophy
- **Primary Blue** (#4285F4) - Interactive elements
- **Success Green** (#34BB72) - Positive indicators
- **Error Red** (#F2434F) - Warnings and losses
- **Neutral Grays** - Layered backgrounds and text hierarchy

---

## 📚 Documentation

- **[Developer Documentation](/yumlabs-developer-doc)** - Comprehensive technical guide
- **[Finance Implementation](/finance-implementation-yumlabs)** - Stock market feature details
- **[API Reference](/yumlabs-developer-doc#modules-breakdown)** - Module documentation

---

## 🛠️ Development

### Building from Source
```bash
# Debug build
cargo build

# Release build (optimized)
cargo build --release
```

### Running Tests
```bash
cargo test
```

### Code Quality
```bash
# Linting
cargo clippy

# Formatting
cargo fmt
```

### Adding Features

1. Create new view in `src/view/`
2. Add state struct in `src/models.rs`
3. Create updater in `src/update/`
4. Wire up navigation in `view/mod.rs` and `update/mod.rs`

See [Developer Documentation](/yumlabs-developer-doc) for detailed guides.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- Follow Rust best practices
- Use the existing design system
- Write clear commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **[Iced](https://github.com/iced-rs/iced)** - Excellent Rust GUI framework
- **[Perplexity AI](https://www.perplexity.ai/)** - Powerful AI research assistant
- **[Google Gemini](https://ai.google.dev/)** - Advanced language model
- **[Finnhub](https://finnhub.io/)** - Real-time stock market data

---

## 📧 Contact

**YUMLABS Team** - [yumlabs.team@gmail.com]

Project Link: [dotZeroSlash](https://github.com/dotZeroSlash)

---

<div align="center">

**Made with ❤️ and Rust**

⭐ Star this repo if you find it useful!

</div>

