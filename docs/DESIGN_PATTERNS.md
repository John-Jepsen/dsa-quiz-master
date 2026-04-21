# Design Patterns Quiz Section

## Overview

The Design Patterns section covers all 23 Gang of Four (GoF) patterns, organized into three topic categories that mirror the existing DSA quiz structure.

## Data Model Changes

Two optional fields were added to `QuizQuestion` in `src/lib/quiz-data.ts`:

```typescript
questionType?: 'multiple_choice' | 'uml';
diagramSource?: string; // Mermaid classDiagram source
```

Existing DSA questions are unaffected (both fields default to `undefined`, and the Quiz component treats `undefined` questionType as multiple choice).

## File Structure

| File | Purpose |
|------|---------|
| `src/lib/design-pattern-modules.ts` | 3 topics, 23 modules (QuizTopic/QuizModule definitions) |
| `src/lib/design-pattern-questions.ts` | 138 questions (6 per pattern: 4 MC + 2 UML) |
| `src/components/MermaidDiagram.tsx` | Renders Mermaid classDiagram strings in-browser |
| `src/lib/quiz-modules.ts` | Exports `allQuizTopics` combining DSA + design patterns |
| `src/lib/module-questions.ts` | Combines DSA + design pattern questions in `getQuestionsByModule()` |
| `src/lib/achievements.ts` | 4 new mastery achievements for design patterns |

## Topic/Module Hierarchy

- **Creational Patterns** (5 modules, 30 questions)
  - Singleton, Factory Method, Abstract Factory, Builder, Prototype
- **Structural Patterns** (7 modules, 42 questions)
  - Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
- **Behavioral Patterns** (11 modules, 66 questions)
  - Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor

## UML Diagrams

UML questions use Mermaid `classDiagram` syntax rendered client-side via the `mermaid` npm package. The `MermaidDiagram` component handles initialization and rendering.

## How to Add a New Pattern

1. Add a module entry to `src/lib/design-pattern-modules.ts` under the appropriate topic
2. Add 6+ questions to `src/lib/design-pattern-questions.ts` with the module's `moduleId`
3. Update `totalQuestions` on the parent topic
4. Optionally add a mastery achievement in `src/lib/achievements.ts`

No other files need changes — the combined question/module lookups automatically include new entries.
