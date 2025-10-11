---
title: odin-overview
description: Document from d:\Documents\odin-projects\explore-odin\docs\odin-overview.md
date: 2025-10-05
---

# Odin Programming Language Overview

## Installation

To install Odin, download the latest release from [GitHub Releases](https://github.com/odin-lang/Odin/releases). Ensure you have the required compilers: MSVC on Windows, Clang on macOS/Linux.

For detailed instructions, see the [official install guide](https://odin-lang.org/docs/install/).

## What Odin is Good For
Odin is a general-purpose, compiled systems programming language designed for high performance, modern systems, and data-oriented programming. It's positioned as a modern alternative to C, emphasizing simplicity, orthogonality, and joy in programming. It's particularly good for:

- **Systems programming**: Low-level control over memory, allocators, and hardware.
- **High-performance applications**: Real-time simulations, games, and multimedia (e.g., used in EmberGen for 3D fluid simulations).
- **Data-oriented programming**: Features like SOA (Struct of Arrays), array programming, and custom allocators for efficient data handling.
- **Cross-platform development**: Supports bindings to C libraries, graphics APIs (OpenGL, Vulkan), and has a rich standard library.

## Syntax Comparison

Odin's syntax is procedural and C-like, with influences from Go and Pascal. It uses `::` for declarations (constants/procedures), `:=` for inference, and has explicit typing. Key differences from TypeScript, Lua, and Rust:

- **vs. TypeScript** (typed JavaScript for web/apps):
  - Odin is compiled and static-typed with no runtime (no JS-like dynamism or GC). Syntax is more verbose and low-level: e.g., `proc` instead of `function`, explicit pointers (`^T`), and no classes/objects (uses structs/unions).
  - No closures or async/await; focuses on procedures and manual memory.
  - Example: Odin's `main :: proc() { fmt.println("Hello") }` vs. TS's `function main() { console.log("Hello"); }`.

- **vs. Lua** (scripting, dynamic, embedded):
  - Odin is compiled and static-typed; Lua is interpreted and dynamic. Odin's syntax is stricter: requires types, no global variables by default, and uses `::` for constants/procedures.
  - No tables/metatables; uses arrays, maps, structs. Procedures are `proc` with explicit returns.
  - Example: Odin's `x: int = 42` vs. Lua's `local x = 42` (inferred).

- **vs. Rust** (memory-safe systems language):
  - Similar low-level focus, but Odin's syntax is simpler: no ownership/borrowing rules, no lifetimes. Uses `proc` instead of `fn`, `^T` for pointers (like C), and explicit overloading.
  - Less safe by default (no borrow checker); relies on manual management. Supports generics (parapoly) but with explicit overloading.
  - Example: Odin's `x: ^int = &y` vs. Rust's `let x: &i32 = &y` (with borrowing).

Odin emphasizes readability and orthogonality, with features like implicit context for allocators and `defer` for cleanup.

## Footguns (Common Pitfalls)

- **Manual memory management**: No GC; forgetting to `delete` or `free` leads to leaks. Use tracking allocators in debug mode.
- **Pointers and safety**: Like C, dereferencing `nil` or invalid pointers causes segfaults. Bounds checking is on by default but can be disabled for perf.
- **Type assertions on unions/any**: `v.(Type)` panics if wrong type; use `v.?` or `or_else` for safety.
- **Implicit context**: Allocators/loggers are global per scope; forgetting to set context in foreign code can fail silently.
- **Array programming/SOA**: Swizzling (`a.xy`) or SOA syntax can confuse if unfamiliar; easy to mix up AOS vs. SOA layouts.
- **Strict typing**: Few implicit conversions; e.g., `int` to `f32` requires explicit cast, leading to compile errors.
- **Foreign bindings**: Calling conventions (e.g., `stdcall`) must match C libs; mismatches cause crashes.
- **Parametric polymorphism**: Explicit overloading can lead to verbose code; `where` clauses are powerful but complex.
- **No overflow checks**: Integers wrap silently; use `#bounds_check` or external checks.
