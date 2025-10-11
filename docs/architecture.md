---
title: ARCHITECTURE
description: Document from d:\Documents\rust-projects\old\luna-sama\docs\ARCHITECTURE.md
date: 2025-10-05
---

# Luna Sama Architecture Overview

This document provides a high-level overview of the Luna Sama codebase architecture, including the step numbering system used throughout the code comments.

## Project Structure

Luna Sama is organized into the following key components:

- **Main Application Entry** (`src/main.rs`): Command-line interface and application startup
- **Core Application Logic** (`src/lib.rs`): Main application structure and lifecycle management
- **LLM Services** (`src/llm/`): Language model integration with Ollama
- **Text-to-Speech** (`src/tts/`): Voice generation components
- **Avatar System** (`src/avatar/`): Visual representation of the AI character
- **Game Integration** (`src/game/`): Optional game integration features
- **Utilities** (`src/utils/`): Configuration and helper functions

## Step Numbering System

To make the codebase more navigable and document the execution flow, we use a phased step numbering system. This allows anyone reading the code to understand both the local context of a function and its place in the overall application flow.

### Phase 1: Application Entry (main.rs)

Steps 1.1-1.8 cover the command-line parsing, configuration loading, and main application bootstrap.

- **Step 1.1-1.3**: Parse command-line arguments and initialize logging
- **Step 1.4-1.5**: Handle configuration management
- **Step 1.6-1.8**: Create, initialize and run the application

### Phase 2: Core Components (lib.rs)

Steps 2.1-2.7 cover the core application structure, initialization and execution.

- **Step 2.1-2.2**: Module imports and dependencies
- **Step 2.3**: Application instance creation and component initialization
- **Step 2.4**: Component initialization
- **Step 2.5**: Message processing pipeline
- **Step 2.6**: Main application loop execution
- **Step 2.7**: Application shutdown

### Phase 3: LLM Service (llm/*.rs)

Steps 3.1-3.11 cover the language model integration and conversation management.

- **Step 3.1-3.4**: Ollama client initialization and API interactions
- **Step 3.5-3.11**: Conversation context management

### Phase 4: Text-to-Speech (tts/*.rs)

Steps 4.1-4.x cover the voice generation system.

### Phase 5: Avatar System (avatar/*.rs)

Steps 5.1-5.x cover the visual avatar component.

### Phase 6: Game Integration (game/*.rs)

Steps 6.1-6.x cover the optional game integration features.

## Maintaining This Structure

When adding new code:

1. Identify which phase the code belongs to
2. Use the appropriate phase number as the prefix
3. Continue the sequential numbering within that phase
4. For nested steps, add another level (e.g., 2.3.7)

This documentation should be updated if major architectural changes are made to the application.
