---
title: README
description: Document from d:\Documents\rust-projects\old\luna-sama\README.md
date: 2025-10-05
---

# Luna Sama: A Local AI VTuber

Luna Sama is a local implementation of an AI VTuber, inspired by Neurosama. It uses Rust and Ollama for local LLM integration, providing a customizable AI-powered virtual character.

## Features

- **Local LLM Integration**: Uses Ollama to run language models locally
- **Avatar Visualization**: Support for Live2D models (placeholder implementation)
- **Text-to-Speech**: Voice generation for the AI character (placeholder implementation)
- **Game Integration**: Optional capability to interact with games (placeholder implementation)
- **Conversation Management**: Maintains context for natural conversations

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (2021 edition or later)
- [Ollama](https://github.com/ollama/ollama) for running language models locally

### Installing Ollama

Follow these steps to install Ollama:

1. Visit the [Ollama GitHub repository](https://github.com/ollama/ollama) or the [official website](https://ollama.ai/)
2. Download and install the appropriate version for your OS
3. Once installed, pull a model that will be used by Luna Sama:

```bash
# Pull a model (e.g., Llama 2)
ollama pull llama2
```

Make sure Ollama is running before starting Luna Sama:

```bash
# Start the Ollama service
ollama serve
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/luna-sama.git
   cd luna-sama
   ```

2. Build the project:
   ```bash
   cargo build
   ```

## Development Environment

For NixOS users, a `shell.nix` file is provided for setting up the development environment:

```bash
nix-shell
```

This will install all necessary dependencies for building the project.

## Usage

1. Generate a default configuration:
   ```bash
   cargo run -- --generate-config config.json
   ```

2. Edit the configuration file as needed.

3. Run the application:
   ```bash
   cargo run -- --config config.json
   ```

## Configuration

The configuration file contains settings for:

- **LLM**: Model name, host, port, system prompt, and history size
- **Avatar**: Model path, window dimensions
- **Voice**: Voice model, pitch, and speed
- **Game**: Optional game integration settings

## Project Structure

```
luna-sama/
├── src/
│   ├── main.rs           # Application entry point
│   ├── lib.rs            # Core library code
│   ├── llm/              # LLM integration module
│   │   ├── mod.rs        # Module definition
│   │   ├── ollama.rs     # Ollama client integration
│   │   └── context.rs    # Conversation context management
│   ├── avatar/           # Avatar visualization
│   │   ├── mod.rs
│   │   ├── model.rs      # Model loading/rendering
│   │   └── animation.rs  # Animation controller
│   ├── tts/              # Text-to-speech
│   │   ├── mod.rs
│   │   └── voice.rs      # Voice generation
│   ├── game/             # Game integration (optional)
│   │   ├── mod.rs
│   │   └── controller.rs # Game control logic
│   └── utils/            # Shared utilities
│       ├── mod.rs
│       └── config.rs     # Configuration management
└── assets/               # Project assets (not included)
    ├── models/           # Avatar models
    └── voices/           # Voice samples/files
```

## Current Status

This project is in early development. Many components are currently placeholder implementations that will be expanded in future versions.

## License

MIT License
