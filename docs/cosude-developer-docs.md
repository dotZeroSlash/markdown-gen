---
title: developer-docs
description: Document from d:\Documents\rust-projects\old\COsuDE\developer-docs.md
date: 2025-10-05
---

# COsuDE Developer Documentation

## Overview
COsuDE is a Rust-based typing game built with the Bevy game engine. Players type falling words to score points, with difficulty levels and penalties for mistakes. The game features a sci-fi aesthetic with neon colors and animations.

## Architecture
The project follows Bevy's ECS (Entity Component System) architecture. The main application is set up in `main.rs`, with game logic split across modules. States manage screen transitions, and systems handle updates.

### Project Structure
- `src/main.rs`: Application entry point and setup
- `src/components.rs`: Entity components and resources
- `src/states.rs`: Game state definitions
- `src/config.rs`: Constants and configuration
- `src/words.rs`: Word list for gameplay
- `src/systems.rs`: Utility systems (camera setup)
- `src/ui.rs`: UI spawning and management
- `src/menu.rs`: Menu and difficulty selection logic
- `src/game.rs`: Core gameplay systems

## Dependencies
- `bevy = "0.13"`: Game engine providing ECS, rendering, input, etc.
- `rand = "0.8"`: Random number generation for word shuffling

## Key Components and Resources

### Components (`components.rs`)
- `FallingWord`: Represents a falling word with text, typed portion, and completion status
- `Velocity`: Movement vector for falling entities
- `FadeOut`: Timer for fade-out animations
- `Flash`: Temporary color flash effect with timer
- `DifficultyButton`: Marker for difficulty selection buttons
- UI Components: `LoadingUI`, `MenuUI`, `StartButton`, `QuitButton`, `HighScoreText`, `DifficultyUI`, `PlayingUI`, `CurrentScoreText`

### Resources
- `Score`: Current and high score tracking
- `SelectedDifficulty`: Chosen difficulty level
- `ClearColor`: Background color

### Enums
- `Difficulty`: Easy (5 words), Medium (10 words), Hard (all words)
- `GameState`: Loading, Menu, DifficultySelect, Playing, Score

## Systems and Functions

### Core Systems (`main.rs`)
- `setup_camera`: Spawns 2D camera on startup
- State transitions managed via `NextState<GameState>`

### UI Systems (`ui.rs`)
- `spawn_loading_ui`: Creates loading screen text
- `despawn_loading_ui`: Removes loading UI
- `spawn_menu_ui`: Creates main menu with title, high score, start/quit buttons
- `despawn_menu_ui`: Removes menu UI
- `spawn_difficulty_ui`: Creates difficulty selection screen
- `despawn_difficulty_ui`: Removes difficulty UI
- `spawn_playing_ui`: Creates in-game score display
- `despawn_playing_ui`: Removes playing UI

### Menu Systems (`menu.rs`)
- `loading_system`: Timer-based transition from loading to menu
- `menu_button_system`: Handles start/quit button interactions and state changes
- `update_high_score_text`: Updates high score display
- `update_current_score_text`: Updates current score during gameplay
- `difficulty_select_system`: Handles difficulty button interactions

### Gameplay Systems (`game.rs`)
- `spawn_words`: Creates falling word entities based on selected difficulty
- `falling_system`: Updates word positions downward
- `typing_system`: Processes keyboard input, updates typed text, handles penalties/completions
- `update_text_system`: Updates word text rendering with colors and flash effects
- `fade_system`: Handles fade-out animations for completed words
- `win_condition_system`: Checks for game completion and resets

## Gameplay Flow
1. **Loading**: 2-second loading screen
2. **Menu**: Display high score, start/quit options
3. **Difficulty Select**: Choose Easy/Medium/Hard
4. **Playing**: Type falling words, avoid penalties, complete all words to win
5. **Win**: Return to menu with updated high score

## UI Interactions
- Buttons use `Interaction` queries for hover/press states
- Colors change on interaction (neon blue hover, purple press)
- Text colors: Neon blue (#00d4ff) for titles/scores, white for buttons
- Panels: Semi-transparent black (#00000080) with neon borders

## Word Rendering
- Typed portions: Neon blue (#00d4ff)
- Untyped portions: Dim gray (#808080)
- Flash effects: Red-orange (#ff6b6b) for penalties, green for completions
- Font size: 50px for words, 45-70px for UI text

## Scoring
- Correct word completion: 10 points × word length
- Backspace penalty: -2 points
- Invalid input reset: -5 points
- Negative scores allowed, instant fail if score < 0

## Configuration (`config.rs`)
- `WINDOW_WIDTH`: 800.0
- `WINDOW_HEIGHT`: 600.0
- `FONT_SIZE`: 50.0 (word size)
- `FALL_SPEED`: 100.0 (pixels/second)
- `FADE_DURATION`: 1.0 (seconds)

## Word List (`words.rs`)
Contains 73 Rust/programming-related words for typing practice.

## State Management
Uses Bevy's `States` for screen management. Transitions triggered by user input or timers.

## Rendering
- 2D camera with default bundle
- Text2dBundle for falling words
- NodeBundle for UI panels
- ButtonBundle for interactive elements

## Input Handling
- `ReceivedCharacter`: For typed letters
- `KeyboardInput`: For backspace detection
- Input processed in `typing_system` with character validation

## Animations
- Falling: Continuous downward movement
- Fade-out: Alpha reduction over time
- Flash: Temporary color override with timer
- No particle effects or complex animations implemented

## Error Handling
- Word reset on invalid input
- Score penalties for mistakes
- Entity existence checks before despawning (prevents B0003 warnings)

## Performance Considerations
- Words shuffled once per game start
- Systems run conditionally based on state
- Entities despawned after use

## Extensibility
- Easy to add new difficulties or word lists
- UI screens modular and reusable
- Systems separated by concern (UI, menu, gameplay)

## Build and Run
- `cargo run`: Build and run the game
- `cargo check`: Verify compilation
- Requires Rust 2024 edition

This documentation provides a complete overview of COsuDE's codebase, interactions, and functionality for developers.
