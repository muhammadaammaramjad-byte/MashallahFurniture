# Architecture

## Decision Records

### ADR 001: State Management
**Date:** 2024
**Status:** Accepted

**Context:** Need centralized state management for cart, wishlist, user data.

**Decision:** Use class-based Store pattern with localStorage persistence.

**Consequences:**
- Simple API with subscribe/unsubscribe
- Automatic persistence for critical data
- Easy to extend with new state slices

## Data Flow Diagrams

```
User Action -> Component -> Store.setState() -> localStorage -> UI Update
```

## Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── Navigation
│   └── Cart Icon
├── Main Content
│   ├── Product Grid
│   ├── Product Card
│   └── Filters
└── Footer
```