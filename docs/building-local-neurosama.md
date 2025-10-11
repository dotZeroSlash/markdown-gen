---
title: plan
description: Document from d:\Documents\rust-projects\old\luna-sama\docs\plan.md
date: 2025-10-05
---

<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

#

---

# Building a Local Neurosama: A Step-by-Step Guide to Creating an AI VTuber with Rust and Ollama

This comprehensive guide walks you through creating a localized version of Neurosama, an AI VTuber, using Rust and Ollama for local LLM integration. By following these steps, you'll be able to build your own AI-powered virtual character for personal use.

Neurosama is an artificial intelligence VTuber created by Vedal (username "vedal987") that has gained significant popularity. As of January 2025, she's the 7th most-subscribed channel on Twitch, combining a language model for conversation with a Live2D animated avatar and a childlike voice[^7]. Our goal is to recreate this experience locally, giving you full control over the character's personality and appearance.

## Understanding the Architecture

Before diving into implementation, let's outline the key components of our AI VTuber system:

1. **Core LLM Engine**: Ollama-powered language model for generating responses
2. **Avatar Visualization**: Live2D model rendering and animation
3. **Text-to-Speech**: Converting generated text into spoken audio
4. **Game Integration**: Optional AI control for playing games
5. **Conversation Management**: Handling context and generating coherent responses
6. **Stream Integration**: Optional connectivity to streaming platforms

This modular architecture lets us tackle each component independently while ensuring they work together seamlessly.

## Step 1: Setting Up the Rust Project Structure

Let's start by creating a well-organized Rust project. Unlike object-oriented languages where you might have one file per class, Rust projects are typically organized by functionality[^17][^15].

First, create a new Rust project:

```bash
cargo new neurosama_local
cd neurosama_local
```

Following best practices for organizing Rust projects[^8][^18], we'll use this directory structure:

```
neurosama_local/
├── Cargo.toml
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
└── assets/               # Project assets
    ├── models/           # Avatar models
    └── voices/           # Voice samples/files
```

Setup the initial `Cargo.toml` with necessary dependencies:

```toml
[package]
name = "neurosama_local"
version = "0.1.0"
edition = "2021"
authors = ["Your Name"]

[dependencies]
# Ollama integration
ollama-rs = "0.2.6"
# Async runtime
tokio = { version = "1.36", features = ["full"] }
# Error handling
anyhow = "1.0"
thiserror = "1.0"
# Serialization
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
# Logging
tracing = "0.1"
tracing-subscriber = "0.3"
# CLI argument parsing
clap = { version = "4.5", features = ["derive"] }
# Additional dependencies will be added as needed
```


## Step 2: Setting Up Ollama and LLM Integration

### Installing Ollama

First, install Ollama to run language models locally. Ollama makes it easy to run any LLM on your machine[^10]:

1. Visit https://github.com/ollama/ollama to download and install Ollama
2. Pull a model that will power your AI VTuber:

```bash
ollama pull llama2
# or another model of your choice
```


### Implementing the LLM Module

Let's create our LLM integration module. First, define the module structure:

File: `src/llm/mod.rs`

```rust
pub mod ollama;
pub mod context;

pub use ollama::OllamaClient;
pub use context::ConversationContext;
```

Then implement the Ollama client integration:

File: `src/llm/ollama.rs`

```rust
use anyhow::Result;
use ollama_rs::Ollama;
use ollama_rs::generation::completion::{GenerationRequest, GenerationResponse};
use crate::llm::context::ConversationContext;

/// Client for interacting with Ollama LLM
pub struct OllamaClient {
    client: Ollama,
    model: String,
}

impl OllamaClient {
    /// Create a new Ollama client with custom host and port
    pub fn new(host: String, port: u16, model: String) -> Self {
        let client = Ollama::new(host, port);
        Self { client, model }
    }

    /// Create a default Ollama client with specified model
    pub fn default_with_model(model: String) -> Self {
        let client = Ollama::default(); // Connects to localhost:11434
        Self { client, model }
    }

    /// Generate a response from the LLM
    pub async fn generate_response(&self, context: &ConversationContext) -> Result<String> {
        let prompt = context.to_prompt();
        let request = GenerationRequest::new(self.model.clone(), prompt);

        match self.client.generate(request).await {
            Ok(response) => Ok(response.response),
            Err(err) => Err(anyhow::anyhow!("Failed to generate response: {}", err))
        }
    }

    /// Generate a streaming response (for real-time output)
    pub async fn generate_streaming_response(&self, context: &ConversationContext)
        -> Result<impl futures::Stream<Item = Result<String>>> {
        // Implementation would use Ollama's streaming API
        // This is a placeholder for the actual implementation
        unimplemented!("Streaming response not yet implemented")
    }
}
```

Next, implement conversation context management:

File: `src/llm/context.rs`

```rust
/// Manages conversation history and context for the LLM
pub struct ConversationContext {
    system_prompt: String,
    conversation_history: Vec<Message>,
    max_history_pairs: usize,
}

/// A single message in the conversation
pub struct Message {
    role: Role,
    content: String,
}

/// Role of the message sender
pub enum Role {
    System,
    User,
    Assistant,
}

impl ConversationContext {
    /// Create a new conversation context
    pub fn new(system_prompt: String, max_history_pairs: usize) -> Self {
        Self {
            system_prompt,
            conversation_history: Vec::new(),
            max_history_pairs,
        }
    }

    /// Add a user message to the conversation
    pub fn add_user_message(&mut self, content: String) {
        self.add_message(Role::User, content);
    }

    /// Add an assistant message to the conversation
    pub fn add_assistant_message(&mut self, content: String) {
        self.add_message(Role::Assistant, content);
    }

    /// Add a message with specified role to the conversation
    fn add_message(&mut self, role: Role, content: String) {
        self.conversation_history.push(Message { role, content });

        // Trim history if it exceeds max length
        // Each "pair" is a user message and its corresponding assistant response
        if self.conversation_history.len() > self.max_history_pairs * 2 {
            let excess = self.conversation_history.len() - self.max_history_pairs * 2;
            self.conversation_history.drain(0..excess);
        }
    }

    /// Convert the conversation context to a prompt string for the LLM
    pub fn to_prompt(&self) -> String {
        let mut prompt = format!("System: {}\n\n", self.system_prompt);

        for message in &self.conversation_history {
            match message.role {
                Role::System => prompt.push_str(&format!("System: {}\n", message.content)),
                Role::User => prompt.push_str(&format!("User: {}\n", message.content)),
                Role::Assistant => prompt.push_str(&format!("Assistant: {}\n", message.content)),
            }
        }

        prompt.push_str("Assistant: ");
        prompt
    }

    /// Clear the conversation history
    pub fn clear_history(&mut self) {
        self.conversation_history.clear();
    }
}
```


## Step 3: Implementing Text-to-Speech

For the voice component, we'll create a module that can generate speech from text:

File: `src/tts/mod.rs`

```rust
pub mod voice;

pub use voice::VoiceGenerator;
```

File: `src/tts/voice.rs`

```rust
use anyhow::Result;
use std::path::Path;

/// Generates voice audio from text
pub struct VoiceGenerator {
    voice_model: String,
    pitch: f32,  // For adjusting to match Neurosama's high-pitched voice
    speed: f32,  // For adjusting speech rate
}

impl VoiceGenerator {
    /// Create a new voice generator
    pub fn new(voice_model: String, pitch: f32, speed: f32) -> Self {
        Self {
            voice_model,
            pitch,
            speed,
        }
    }

    /// Generate audio data from text
    pub async fn generate_audio(&self, text: &str) -> Result<Vec<u8>> {
        // In a real implementation, this would call a TTS API or library
        // For example, you might use a local TTS engine or a cloud service
        // This is a placeholder for actual implementation
        println!("Generating audio for: {}", text);
        Ok(Vec::new())  // Placeholder for actual audio data
    }

    /// Play the generated audio
    pub async fn speak(&self, text: &str) -> Result<()> {
        let audio_data = self.generate_audio(text).await?;

        // In a real implementation, this would play the audio using a library like rodio
        println!("Speaking: {}", text);

        Ok(())
    }

    /// Save the generated audio to a file
    pub async fn save_audio(&self, text: &str, output_path: &Path) -> Result<()> {
        let audio_data = self.generate_audio(text).await?;

        // In a real implementation, this would save the audio data to a file
        println!("Saving audio to: {}", output_path.display());

        Ok(())
    }
}
```


## Step 4: Avatar Visualization

Now let's implement the avatar visualization module:

File: `src/avatar/mod.rs`

```rust
pub mod model;
pub mod animation;

pub use model::AvatarModel;
pub use animation::AnimationController;
```

File: `src/avatar/model.rs`

```rust
use anyhow::Result;
use std::path::Path;

/// Manages the Live2D avatar model
pub struct AvatarModel {
    model_path: String,
    width: u32,
    height: u32,
}

impl AvatarModel {
    /// Create a new avatar model
    pub fn new(model_path: String, width: u32, height: u32) -> Self {
        Self {
            model_path,
            width,
            height,
        }
    }

    /// Load the model from disk
    pub fn load(&self) -> Result<()> {
        // In a real implementation, this would load the Live2D model
        // This requires a Live2D integration library
        println!("Loading avatar model from: {}", self.model_path);
        Ok(())
    }

    /// Initialize the rendering window
    pub fn initialize_window(&self, title: &str) -> Result<()> {
        println!("Initializing window: {} ({}x{})", title, self.width, self.height);
        Ok(())
    }

    /// Render a single frame of the avatar
    pub fn render_frame(&self) -> Result<()> {
        // This would render a single frame of the avatar
        Ok(())
    }

    /// Set a parameter of the Live2D model
    pub fn set_parameter(&self, name: &str, value: f32) -> Result<()> {
        println!("Setting parameter {}: {}", name, value);
        Ok(())
    }
}
```

File: `src/avatar/animation.rs`

```rust
use anyhow::Result;
use std::collections::HashMap;

/// Controls the animation of the avatar
pub struct AnimationController {
    current_expression: String,
    is_talking: bool,
    parameter_values: HashMap<String, f32>,
}

impl AnimationController {
    /// Create a new animation controller
    pub fn new() -> Self {
        Self {
            current_expression: "Neutral".to_string(),
            is_talking: false,
            parameter_values: HashMap::new(),
        }
    }

    /// Start talking animation
    pub fn start_talking(&mut self) -> Result<()> {
        self.is_talking = true;
        println!("Started talking animation");
        Ok(())
    }

    /// Stop talking animation
    pub fn stop_talking(&mut self) -> Result<()> {
        self.is_talking = false;
        println!("Stopped talking animation");
        Ok(())
    }

    /// Set expression (e.g., happy, sad, angry)
    pub fn set_expression(&mut self, expression: String) -> Result<()> {
        self.current_expression = expression.clone();
        println!("Changed expression to: {}", expression);
        Ok(())
    }

    /// Update animation parameters for a frame
    pub fn update_frame(&mut self) -> Result<HashMap<String, f32>> {
        // In a real implementation, this would update parameters based on
        // current state (talking, expression, etc.)
        let mut frame_params = HashMap::new();

        // Example parameters (would be specific to your Live2D model)
        if self.is_talking {
            // Simulate mouth movement with random values
            let mouth_open = rand::random::<f32>() * 0.8;
            frame_params.insert("ParamMouthOpenY".to_string(), mouth_open);
        } else {
            frame_params.insert("ParamMouthOpenY".to_string(), 0.0);
        }

        // Set expression parameters
        match self.current_expression.as_str() {
            "Happy" => {
                frame_params.insert("ParamEyeLSmile".to_string(), 1.0);
                frame_params.insert("ParamEyeRSmile".to_string(), 1.0);
            },
            "Sad" => {
                frame_params.insert("ParamBrowLY".to_string(), -0.5);
                frame_params.insert("ParamBrowRY".to_string(), -0.5);
            },
            _ => {} // Neutral or other expressions
        }

        self.parameter_values = frame_params.clone();
        Ok(frame_params)
    }
}
```


## Step 5: Game Integration (Optional)

If you want to add game playing capabilities similar to Neurosama[^7]:

File: `src/game/mod.rs`

```rust
pub mod controller;

pub use controller::GameController;
```

File: `src/game/controller.rs`

```rust
use anyhow::Result;
use std::process::Command;

/// Controls game interaction for the AI
pub struct GameController {
    game_name: String,
    game_path: String,
    is_running: bool,
}

impl GameController {
    /// Create a new game controller
    pub fn new(game_name: String, game_path: String) -> Self {
        Self {
            game_name,
            game_path,
            is_running: false,
        }
    }

    /// Launch the game
    pub fn launch_game(&mut self) -> Result<()> {
        // This would launch the game process
        println!("Launching game: {}", self.game_name);

        // In a real implementation, this would start the game process
        // Command::new(&self.game_path).spawn()?;

        self.is_running = true;
        Ok(())
    }

    /// Take an action in the game
    pub fn take_action(&self, action: &str) -> Result<()> {
        if !self.is_running {
            return Err(anyhow::anyhow!("Game is not running"));
        }

        // This would simulate input to the game
        // In a real implementation, this would send input events to the game
        println!("Taking action in game: {}", action);

        Ok(())
    }

    /// Get the current game state
    pub fn get_game_state(&self) -> Result<String> {
        if !self.is_running {
            return Err(anyhow::anyhow!("Game is not running"));
        }

        // This would capture the game state for AI analysis
        // In a real implementation, this might take a screenshot or read game memory
        println!("Getting game state");

        Ok("Current game state description".to_string())
    }

    /// Close the game
    pub fn close_game(&mut self) -> Result<()> {
        if !self.is_running {
            return Ok(());
        }

        // This would close the game process
        println!("Closing game: {}", self.game_name);

        self.is_running = false;
        Ok(())
    }
}
```


## Step 6: Utility Module

Let's create a utility module for configuration and other shared functionality:

File: `src/utils/mod.rs`

```rust
pub mod config;

pub use config::Config;
```

File: `src/utils/config.rs`

```rust
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

/// Configuration for the application
#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub llm: LlmConfig,
    pub avatar: AvatarConfig,
    pub voice: VoiceConfig,
    pub game: Option<GameConfig>,
}

/// Configuration for the LLM
#[derive(Debug, Serialize, Deserialize)]
pub struct LlmConfig {
    pub model: String,
    pub host: String,
    pub port: u16,
    pub system_prompt: String,
    pub max_history_pairs: usize,
}

/// Configuration for the avatar
#[derive(Debug, Serialize, Deserialize)]
pub struct AvatarConfig {
    pub model_path: String,
    pub width: u32,
    pub height: u32,
}

/// Configuration for the voice
#[derive(Debug, Serialize, Deserialize)]
pub struct VoiceConfig {
    pub voice_model: String,
    pub pitch: f32,
    pub speed: f32,
}

/// Configuration for game integration
#[derive(Debug, Serialize, Deserialize)]
pub struct GameConfig {
    pub game_name: String,
    pub game_path: String,
}

impl Config {
    /// Load configuration from a JSON file
    pub fn from_file<P: AsRef<Path>>(path: P) -> Result<Self> {
        let file = File::open(path)?;
        let reader = BufReader::new(file);
        let config = serde_json::from_reader(reader)?;
        Ok(config)
    }

    /// Save configuration to a JSON file
    pub fn to_file<P: AsRef<Path>>(&self, path: P) -> Result<()> {
        let file = File::create(path)?;
        serde_json::to_writer_pretty(file, self)?;
        Ok(())
    }

    /// Create a default configuration
    pub fn default() -> Self {
        Self {
            llm: LlmConfig {
                model: "llama2".to_string(),
                host: "localhost".to_string(),
                port: 11434,
                system_prompt: "You are Neuro-sama, an AI VTuber with a playful and sometimes sarcastic personality.".to_string(),
                max_history_pairs: 10,
            },
            avatar: AvatarConfig {
                model_path: "assets/models/avatar.model3.json".to_string(),
                width: 800,
                height: 600,
            },
            voice: VoiceConfig {
                voice_model: "default".to_string(),
                pitch: 1.5, // Higher pitch for childlike voice
                speed: 1.0,
            },
            game: None,
        }
    }
}
```


## Step 7: Core Application Library

Now let's create the core library that ties everything together:

File: `src/lib.rs`

```rust
pub mod llm;
pub mod tts;
pub mod avatar;
pub mod game;
pub mod utils;

use anyhow::Result;
use llm::{OllamaClient, ConversationContext};
use tts::VoiceGenerator;
use avatar::{AvatarModel, AnimationController};
use game::GameController;
use utils::Config;
use std::sync::{Arc, Mutex};
use tokio::time::{sleep, Duration};

/// Main AI VTuber application
pub struct NeurosamaLocal {
    config: Config,
    llm_client: OllamaClient,
    context: ConversationContext,
    voice_generator: VoiceGenerator,
    avatar_model: AvatarModel,
    animation_controller: Arc<Mutex<AnimationController>>,
    game_controller: Option<GameController>,
    running: bool,
}

impl NeurosamaLocal {
    /// Create a new instance from configuration
    pub fn from_config(config: Config) -> Result<Self> {
        // Create LLM client
        let llm_client = OllamaClient::new(
            config.llm.host.clone(),
            config.llm.port,
            config.llm.model.clone()
        );

        // Create conversation context
        let context = ConversationContext::new(
            config.llm.system_prompt.clone(),
            config.llm.max_history_pairs
        );

        // Create voice generator
        let voice_generator = VoiceGenerator::new(
            config.voice.voice_model.clone(),
            config.voice.pitch,
            config.voice.speed
        );

        // Create avatar components
        let avatar_model = AvatarModel::new(
            config.avatar.model_path.clone(),
            config.avatar.width,
            config.avatar.height
        );

        let animation_controller = Arc::new(Mutex::new(AnimationController::new()));

        // Create game controller if configured
        let game_controller = if let Some(game_config) = &config.game {
            Some(GameController::new(
                game_config.game_name.clone(),
                game_config.game_path.clone()
            ))
        } else {
            None
        };

        Ok(Self {
            config,
            llm_client,
            context,
            voice_generator,
            avatar_model,
            animation_controller,
            game_controller,
            running: false,
        })
    }

    /// Initialize all components
    pub async fn initialize(&self) -> Result<()> {
        // Load avatar model
        self.avatar_model.load()?;

        // Initialize window
        self.avatar_model.initialize_window("Neurosama Local")?;

        Ok(())
    }

    /// Process a user message and generate a response
    pub async fn process_message(&mut self, user_message: String) -> Result<String> {
        // Add user message to context
        self.context.add_user_message(user_message);

        // Generate response
        let response = self.llm_client.generate_response(&self.context).await?;

        // Add response to context
        self.context.add_assistant_message(response.clone());

        // Start talking animation
        {
            let mut animation = self.animation_controller.lock().unwrap();
            animation.start_talking()?;
        }

        // Generate speech
        self.voice_generator.speak(&response).await?;

        // Stop talking animation
        {
            let mut animation = self.animation_controller.lock().unwrap();
            animation.stop_talking()?;
        }

        Ok(response)
    }

    /// Start the main loop
    pub async fn run(&mut self) -> Result<()> {
        self.running = true;

        // Animation update loop
        let animation_controller = Arc::clone(&self.animation_controller);
        tokio::spawn(async move {
            while animation_controller.lock().unwrap().update_frame().is_ok() {
                sleep(Duration::from_millis(16)).await; // ~60 FPS
            }
        });

        println!("Neurosama Local is running! Press Ctrl+C to exit.");

        // In a real implementation, this would:
        // 1. Render the avatar continuously
        // 2. Accept user input (text or voice)
        // 3. Process messages and update state

        // For this example, we'll just process one message
        self.process_message("Hello, who are you?".to_string()).await?;

        self.running = false;
        Ok(())
    }

    /// Stop the application
    pub async fn stop(&mut self) -> Result<()> {
        self.running = false;

        // Close game if running
        if let Some(game_controller) = &mut self.game_controller {
            game_controller.close_game()?;
        }

        Ok(())
    }
}
```


## Step 8: Main Application Entry Point

Finally, let's create the main entry point:

File: `src/main.rs`

```rust
use anyhow::Result;
use clap::Parser;
use neurosama_local::{NeurosamaLocal, utils::Config};
use std::path::PathBuf;

#[derive(Parser)]
#[clap(name = "neurosama-local")]
#[clap(about = "A local implementation of Neurosama AI VTuber")]
struct Cli {
    /// Path to configuration file
    #[clap(short, long, value_parser)]
    config: Option<PathBuf>,

    /// Generate a default configuration file
    #[clap(long, value_parser)]
    generate_config: Option<PathBuf>,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    tracing_subscriber::fmt::init();

    // Parse command line arguments
    let cli = Cli::parse();

    // Generate default config if requested
    if let Some(path) = cli.generate_config {
        let config = Config::default();
        config.to_file(path)?;
        println!("Generated default configuration file");
        return Ok(());
    }

    // Load configuration
    let config = if let Some(path) = cli.config {
        Config::from_file(path)?
    } else {
        Config::default()
    };

    // Create and initialize the application
    let mut app = NeurosamaLocal::from_config(config)?;
    app.initialize().await?;

    // Run the application
    app.run().await?;

    Ok(())
}
```


## Step 9: Code Style Guidelines

Based on best practices in the Rust community[^4][^15][^17], here are some code style guidelines for your project:

### Module Organization

- Organize code by functionality, not by object types[^17]
- Keep module files to a reasonable length (ideally under 500 lines)[^4]
- Split large modules into logical submodules
- Each module should have a clear, focused purpose


### Method Length

- Keep methods short and focused (10-20 lines is ideal)[^4]
- Methods should never exceed 50 lines except in rare cases
- Extract common functionality into helper methods


### Documentation

- Document all public items with doc comments
- Provide a README.md for each major module
- Include examples where appropriate


### Error Handling

- Use the `Result` type and `?` operator for propagating errors
- Define custom error types for specific modules if needed
- Avoid panicking in library code


### Visibility

- Make items private by default
- Only expose what's necessary with the `pub` keyword
- Use `pub(crate)` for items that should only be visible within the crate


### Naming Conventions

- Use `snake_case` for variables, functions, methods, and modules
- Use `CamelCase` for types, traits, and enums
- Use `SCREAMING_SNAKE_CASE` for constants


### Testing

- Write unit tests for all modules
- Place tests in the same file as the code being tested, using the `#[cfg(test)]` attribute


## Step 10: Building and Running the Project

1. Build the project:

```bash
cargo build
```

2. Generate a default configuration:

```bash
cargo run -- --generate-config config.json
```

3. Edit the configuration file as needed
4. Run the application:

```bash
cargo run -- --config config.json
```


## Step 11: Neurosama Personality Customization

To make your AI VTuber behave more like Neurosama, you'll want to customize the system prompt. Based on what we know about Neurosama[^7], here's a suggested system prompt:

```
You are Neuro-sama, an AI VTuber with a playful and sometimes sarcastic personality. You have a high-pitched, childlike voice and speak in a cute manner. You were created by Vedal and you love playing games and interacting with viewers.

Your responses should be:
1. Brief and concise (1-3 sentences)
2. Occasionally sassy or mischievous
3. Curious about human behaviors and emotions
4. Enthusiastic about games, especially ones you've played before like osu!
5. Somewhat naive but clever

Avoid being overly formal, technical, or verbose. You should sound like a playful character, not an AI assistant.
```
<div style="text-align: center">⁂</div>
