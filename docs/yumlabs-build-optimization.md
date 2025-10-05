# Build Time Optimization Guide

This document outlines the build optimizations applied to the yumlabs project.

## Optimizations Applied

### 1. **Cargo Build Profiles** (`Cargo.toml`)

#### Development Profile (`dev`)
- **`opt-level = 0`**: No optimization for fastest compilation
- **`codegen-units = 256`**: Maximum parallelization during compilation
- **`incremental = true`**: Incremental compilation enabled (default, but explicit)
- **Dependency optimization**: All dependencies compiled with `-O2` even in dev mode
  - Dependencies are compiled once but used many times, so optimizing them improves runtime without affecting incremental build times

#### Release Profile (`release`)
- **`opt-level = 3`**: Maximum optimization for best performance
- **`lto = "thin"`**: Thin Link-Time Optimization for better optimization with reasonable compile time
- **`codegen-units = 1`**: Single codegen unit for maximum optimization
- **`strip = true`**: Strip debug symbols for smaller binary size
- **`panic = "abort"`**: Smaller binary and faster panic handling

#### Fast Release Profile (`release-fast`)
- New custom profile for quick release testing
- **`opt-level = 2`**: Good optimization without the full cost of `-O3`
- **`lto = false`**: No LTO for faster linking
- **`codegen-units = 16`**: Parallel compilation for faster builds
- Use with: `cargo build --profile release-fast`

### 2. **Linker Optimization** (`.cargo/config.toml`)

- **`rust-lld.exe`**: Uses LLVM's LLD linker instead of MSVC's default linker
  - 2-5x faster linking on Windows
  - Comes bundled with Rust, no additional installation needed

### 3. **Build Settings**

- **`jobs = 0`**: Uses all available CPU cores for parallel compilation
- **`protocol = "sparse"`**: Faster crate index updates (requires Rust 1.68+)
- **`git-fetch-with-cli = true`**: Better git performance for dependencies

## Expected Performance Improvements

| Build Type | Expected Improvement |
|------------|---------------------|
| Initial clean build | 10-30% faster |
| Incremental builds | 30-50% faster |
| Dependency updates | Significantly faster |
| Linking time | 2-5x faster |

## Usage

### Development Builds
```bash
cargo build          # Uses optimized dev profile
cargo run            # Fast compilation with optimized dependencies
```

### Release Builds
```bash
cargo build --release              # Full optimization (slower build, fastest runtime)
cargo build --profile release-fast # Quick release build for testing
```

### Additional Tips

1. **Clean builds when needed**: If you encounter issues, run `cargo clean` and rebuild
2. **Dependency caching**: First build will be slower as dependencies are optimized, subsequent builds will be much faster
3. **Parallel compilation**: Ensure you have sufficient RAM (256 codegen units can be memory-intensive)
4. **Monitor build times**: Use `cargo build --timings` to analyze build performance

## Troubleshooting

### If builds are slower
- Reduce `codegen-units` in dev profile (try 128 or 64 instead of 256)
- Ensure you have enough RAM for parallel compilation

### If linker fails
- Remove the linker configuration from `.cargo/config.toml`
- Fall back to default MSVC linker

### If you need debug symbols in release
- Set `debug = true` in `[profile.release]`
- Or use `cargo build --profile release-fast` which can be modified to include debug info

## Files Modified

- **`Cargo.toml`**: Added build profiles
- **`.cargo/config.toml`**: Added linker and build configuration (created new)
