import { QuizQuestion } from './quiz-data';

export interface DesignPatternQuestion extends QuizQuestion {
    questionType: 'multiple_choice' | 'uml';
    diagramSource?: string;
}

export const designPatternQuestions: DesignPatternQuestion[] = [
    // ===== CREATIONAL PATTERNS =====

    // Singleton
    {
        id: 'dp-singleton-1',
        topic: 'creational-patterns',
        moduleId: 'pattern-singleton',
        difficulty: 'beginner' as const,
        question: 'What problem does the Singleton pattern primarily solve?',
        questionType: 'multiple_choice' as const,
        options: [
            'Defining an interface for creating an object but letting subclasses decide which class to instantiate',
            'Separating the construction of a complex object from its representation',
            'Creating families of related objects without specifying concrete classes',
            'Ensuring a class has only one instance and providing a global access point to it',
        ],
        correctAnswer: 3,
        explanation: 'The Singleton pattern restricts instantiation of a class to a single object and provides a global point of access to that instance.',
    },
    {
        id: 'dp-singleton-2',
        topic: 'creational-patterns',
        moduleId: 'pattern-singleton',
        difficulty: 'beginner' as const,
        question: 'Which scenario is the BEST fit for the Singleton pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'A pizza builder that assembles different crust and topping combinations',
            'A logging service that must coordinate writes across an entire application',
            'A prototype registry that clones pre-configured report templates',
            'A button factory that creates different button styles per OS theme',
        ],
        correctAnswer: 1,
        explanation: 'A logging service benefits from Singleton because all parts of the application should write to the same logger instance.',
    },
    {
        id: 'dp-singleton-3',
        topic: 'creational-patterns',
        moduleId: 'pattern-singleton',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a standard participant in the Singleton pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'ConcreteCreator',
            'Static getInstance() method',
            'Singleton class',
            'Private constructor',
        ],
        correctAnswer: 0,
        explanation: 'ConcreteCreator is a participant in the Factory Method pattern, not Singleton.',
    },
    {
        id: 'dp-singleton-4',
        topic: 'creational-patterns',
        moduleId: 'pattern-singleton',
        difficulty: 'intermediate' as const,
        question: 'What is the key distinction between the Singleton pattern and a class that uses only static methods?',
        questionType: 'multiple_choice' as const,
        options: [
            'Static methods are always thread-safe, whereas Singleton instances require no synchronization',
            'Singleton prevents the use of instance variables, forcing all state into static fields',
            'Singleton supports lazy initialization and can implement interfaces, while static-only classes cannot be instantiated or polymorphically substituted',
            'Singleton classes cannot be subclassed, but static-only classes can be freely extended',
        ],
        correctAnswer: 2,
        explanation: 'Singleton produces an actual object instance, enabling lazy initialization and the ability to implement interfaces or be passed as a dependency.',
    },
    {
        id: 'dp-singleton-5',
        topic: 'creational-patterns',
        moduleId: 'pattern-singleton',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Singleton {
        -instance: Singleton
        -Singleton()
        +getInstance() Singleton
        +businessOperation() void
    }`,
        options: [
            'Prototype',
            'Singleton',
            'Factory Method',
            'Builder',
        ],
        correctAnswer: 1,
        explanation: 'The diagram shows a class with a private instance field, a private constructor, and a static getInstance() method — the hallmarks of the Singleton pattern.',
    },
    {
        id: 'dp-singleton-6',
        topic: 'creational-patterns',
        moduleId: 'pattern-singleton',
        difficulty: 'advanced' as const,
        question: 'The following diagram shows a Singleton, but something critical is missing for thread-safe lazy initialization. What is absent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class ConfigManager {
        -instance: ConfigManager
        -ConfigManager()
        +getInstance() ConfigManager
        +getProperty(key: String) String
    }
    class Client {
        +run() void
    }
    Client ..> ConfigManager`,
        options: [
            'A public constructor so subclasses can extend ConfigManager',
            'An abstract base class that ConfigManager inherits from',
            'A separate factory class responsible for creating the ConfigManager',
            'A synchronization mechanism or double-checked locking guard on getInstance()',
        ],
        correctAnswer: 3,
        explanation: 'In multi-threaded environments, getInstance() must guard against two threads simultaneously finding instance null.',
    },

    // Factory Method
    {
        id: 'dp-factory-method-1',
        topic: 'creational-patterns',
        moduleId: 'pattern-factory-method',
        difficulty: 'beginner' as const,
        question: 'What is the primary intent of the Factory Method pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Create an exact copy of an object by cloning an existing instance',
            'Ensure only one instance of a class exists throughout the application',
            'Construct complex objects step by step using a separate builder object',
            'Define an interface for creating an object, but let subclasses decide which class to instantiate',
        ],
        correctAnswer: 3,
        explanation: 'Factory Method defines a creator interface with a factory method that subclasses override to instantiate the appropriate product.',
    },
    {
        id: 'dp-factory-method-2',
        topic: 'creational-patterns',
        moduleId: 'pattern-factory-method',
        difficulty: 'beginner' as const,
        question: 'Which scenario is the BEST fit for the Factory Method pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'A database connection that must be shared across all services in an application',
            'A UI framework that lets developers choose which concrete Button to create without altering the framework code',
            'A report generator that needs to set dozens of optional fields before producing output',
            'A graphics editor that duplicates selected shapes by copying their current state',
        ],
        correctAnswer: 1,
        explanation: 'A UI framework with abstract Button creation is the canonical Factory Method use case.',
    },
    {
        id: 'dp-factory-method-3',
        topic: 'creational-patterns',
        moduleId: 'pattern-factory-method',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a standard participant in the Factory Method pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'ConcreteProduct',
            'Creator',
            'Director',
            'ConcreteCreator',
        ],
        correctAnswer: 2,
        explanation: 'Director is a participant in the Builder pattern, not Factory Method.',
    },
    {
        id: 'dp-factory-method-4',
        topic: 'creational-patterns',
        moduleId: 'pattern-factory-method',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes Factory Method from Abstract Factory?',
        questionType: 'multiple_choice' as const,
        options: [
            'Abstract Factory relies on subclassing a single creator; Factory Method uses a separate factory object',
            'Factory Method uses inheritance to vary the product; Abstract Factory uses composition to create families of related products',
            'Factory Method always produces exactly one instance; Abstract Factory always produces multiple',
            'Factory Method creates families of related objects; Abstract Factory creates only a single type',
        ],
        correctAnswer: 1,
        explanation: 'Factory Method relies on subclassing: a subclass overrides one factory method. Abstract Factory encapsulates a family of factory methods in a separate factory object.',
    },
    {
        id: 'dp-factory-method-5',
        topic: 'creational-patterns',
        moduleId: 'pattern-factory-method',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Dialog {
        +createButton() Button
        +render() void
    }
    class WindowsDialog {
        +createButton() Button
    }
    class WebDialog {
        +createButton() Button
    }
    class Button {
        +onClick() void
        +render() void
    }
    class WindowsButton {
        +onClick() void
        +render() void
    }
    class HtmlButton {
        +onClick() void
        +render() void
    }
    Dialog <|-- WindowsDialog
    Dialog <|-- WebDialog
    Button <|-- WindowsButton
    Button <|-- HtmlButton
    Dialog ..> Button`,
        options: [
            'Abstract Factory',
            'Builder',
            'Prototype',
            'Factory Method',
        ],
        correctAnswer: 3,
        explanation: 'The diagram shows a Creator (Dialog) with a factory method createButton() overridden by ConcreteCreators.',
    },
    {
        id: 'dp-factory-method-6',
        topic: 'creational-patterns',
        moduleId: 'pattern-factory-method',
        difficulty: 'advanced' as const,
        question: 'In the diagram below, which element is missing to complete a valid Factory Method pattern?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Logistics {
        +planDelivery() void
    }
    class RoadLogistics {
        +createTransport() Transport
    }
    class SeaLogistics {
        +createTransport() Transport
    }
    class Truck {
        +deliver() void
    }
    class Ship {
        +deliver() void
    }
    Logistics <|-- RoadLogistics
    Logistics <|-- SeaLogistics`,
        options: [
            'A Transport interface that Truck and Ship implement, plus a dependency from Logistics to Transport',
            'A static getInstance() method on Logistics to enforce a single delivery manager',
            'A Director class that orchestrates the steps of building a Truck or Ship',
            'A clone() method on Truck and Ship so they can be copied at runtime',
        ],
        correctAnswer: 0,
        explanation: 'The diagram is missing the Transport product interface and relationships showing Truck and Ship implement Transport.',
    },

    // Abstract Factory
    {
        id: 'dp-abstract-factory-1',
        topic: 'creational-patterns',
        moduleId: 'pattern-abstract-factory',
        difficulty: 'beginner' as const,
        question: 'What problem does the Abstract Factory pattern solve?',
        questionType: 'multiple_choice' as const,
        options: [
            'Creating families of related or dependent objects without specifying their concrete classes',
            'Ensuring a class has only one instance accessible globally',
            'Building a complex object step by step while keeping construction separate from representation',
            'Allowing subclasses to decide which single product class to instantiate',
        ],
        correctAnswer: 0,
        explanation: 'Abstract Factory provides an interface for creating families of related products.',
    },
    {
        id: 'dp-abstract-factory-2',
        topic: 'creational-patterns',
        moduleId: 'pattern-abstract-factory',
        difficulty: 'beginner' as const,
        question: 'Which scenario is the BEST fit for the Abstract Factory pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'A notification system where each subclass decides whether to send Email or SMS',
            'A cross-platform UI toolkit that must produce matching Button, Checkbox, and ScrollBar widgets for each OS',
            'A document exporter that assembles a header, body, and footer through a sequence of steps',
            'A logging framework where only one logger instance should exist',
        ],
        correctAnswer: 1,
        explanation: 'Abstract Factory shines when a system needs to create coordinated families of products.',
    },
    {
        id: 'dp-abstract-factory-3',
        topic: 'creational-patterns',
        moduleId: 'pattern-abstract-factory',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a standard participant in the Abstract Factory pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'ConcreteFactory',
            'Director',
            'AbstractProduct',
            'AbstractFactory',
        ],
        correctAnswer: 1,
        explanation: 'Director belongs to the Builder pattern.',
    },
    {
        id: 'dp-abstract-factory-4',
        topic: 'creational-patterns',
        moduleId: 'pattern-abstract-factory',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes Abstract Factory from Factory Method?',
        questionType: 'multiple_choice' as const,
        options: [
            'Abstract Factory creates single objects; Factory Method creates collections',
            'Abstract Factory prevents subclassing; Factory Method requires two levels of inheritance',
            'Abstract Factory always uses inheritance; Factory Method always uses composition',
            'Abstract Factory groups multiple factory methods into one interface for a consistent product family; Factory Method defines a single factory method that subclasses override',
        ],
        correctAnswer: 3,
        explanation: 'Abstract Factory bundles several factory methods into a factory interface, guaranteeing all products belong to the same family.',
    },
    {
        id: 'dp-abstract-factory-5',
        topic: 'creational-patterns',
        moduleId: 'pattern-abstract-factory',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class GUIFactory {
        +createButton() Button
        +createCheckbox() Checkbox
    }
    class WinFactory {
        +createButton() Button
        +createCheckbox() Checkbox
    }
    class MacFactory {
        +createButton() Button
        +createCheckbox() Checkbox
    }
    class Button {
        +render() void
    }
    class Checkbox {
        +render() void
    }
    GUIFactory <|-- WinFactory
    GUIFactory <|-- MacFactory
    GUIFactory ..> Button
    GUIFactory ..> Checkbox`,
        options: [
            'Prototype',
            'Builder',
            'Abstract Factory',
            'Factory Method',
        ],
        correctAnswer: 2,
        explanation: 'The diagram shows a factory interface with multiple creation methods and two concrete factories — the signature of Abstract Factory.',
    },
    {
        id: 'dp-abstract-factory-6',
        topic: 'creational-patterns',
        moduleId: 'pattern-abstract-factory',
        difficulty: 'advanced' as const,
        question: 'This diagram intends to show an Abstract Factory but is missing a key structural element. What is absent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class FurnitureFactory {
        +createChair() Chair
        +createSofa() Sofa
    }
    class VictorianFactory {
        +createChair() Chair
        +createSofa() Sofa
    }
    class ModernFactory {
        +createChair() Chair
        +createSofa() Sofa
    }
    class VictorianChair {
        +sitOn() void
    }
    class ModernChair {
        +sitOn() void
    }
    FurnitureFactory <|-- VictorianFactory
    FurnitureFactory <|-- ModernFactory`,
        options: [
            'A static clone() method on VictorianChair and ModernChair',
            'A private constructor on FurnitureFactory to prevent direct instantiation',
            'A Director class to coordinate the order in which methods are called',
            'Abstract product interfaces (Chair and Sofa) that concrete products implement',
        ],
        correctAnswer: 3,
        explanation: 'The diagram is missing the abstract Chair and Sofa product interfaces and the concrete product hierarchy.',
    },

    // Builder
    {
        id: 'dp-builder-1',
        topic: 'creational-patterns',
        moduleId: 'pattern-builder',
        difficulty: 'beginner' as const,
        question: 'What problem does the Builder pattern primarily solve?',
        questionType: 'multiple_choice' as const,
        options: [
            'Ensuring that only one instance of a complex object exists at any time',
            'Cloning an existing complex object instead of constructing a new one from scratch',
            'Providing a single interface for creating families of related objects',
            'Separating the construction of a complex object from its representation so the same process can create different representations',
        ],
        correctAnswer: 3,
        explanation: 'Builder addresses the problem of constructing complex objects that require many steps or configurations.',
    },
    {
        id: 'dp-builder-2',
        topic: 'creational-patterns',
        moduleId: 'pattern-builder',
        difficulty: 'beginner' as const,
        question: 'Which scenario is the BEST fit for the Builder pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Duplicating a fully configured HTTP request object to use as a template',
            'Guaranteeing that a database connection pool is shared across an application',
            'Constructing a complex SQL query object that has many optional clauses',
            'Choosing between PDF and HTML export formats at runtime via different subclasses',
        ],
        correctAnswer: 2,
        explanation: 'Builder is ideal when an object has many optional or ordered construction steps.',
    },
    {
        id: 'dp-builder-3',
        topic: 'creational-patterns',
        moduleId: 'pattern-builder',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a standard participant in the Builder pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'ConcreteBuilder',
            'Builder',
            'ConcreteFactory',
            'Director',
        ],
        correctAnswer: 2,
        explanation: 'ConcreteFactory is a participant in the Abstract Factory pattern.',
    },
    {
        id: 'dp-builder-4',
        topic: 'creational-patterns',
        moduleId: 'pattern-builder',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes the Builder pattern from the Abstract Factory pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Builder focuses on constructing a single complex object step by step; Abstract Factory creates families of related objects in one step',
            'Abstract Factory constructs step by step; Builder returns a complete family at once',
            'Builder products must share a common interface; Abstract Factory products can be unrelated',
            'Builder always requires a Director; Abstract Factory never uses a Director',
        ],
        correctAnswer: 0,
        explanation: 'Builder is about the construction process of one complex object. Abstract Factory is about which family of products to create.',
    },
    {
        id: 'dp-builder-5',
        topic: 'creational-patterns',
        moduleId: 'pattern-builder',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Director {
        -builder: HouseBuilder
        +constructHouse() void
    }
    class HouseBuilder {
        +buildFoundation() void
        +buildWalls() void
        +buildRoof() void
        +getResult() House
    }
    class WoodHouseBuilder {
        +buildFoundation() void
        +buildWalls() void
        +buildRoof() void
        +getResult() House
    }
    class House {
        +foundation: String
        +walls: String
        +roof: String
    }
    HouseBuilder <|-- WoodHouseBuilder
    Director o-- HouseBuilder
    WoodHouseBuilder ..> House`,
        options: [
            'Prototype',
            'Abstract Factory',
            'Factory Method',
            'Builder',
        ],
        correctAnswer: 3,
        explanation: 'The diagram shows a Director orchestrating step-by-step construction through a Builder interface.',
    },
    {
        id: 'dp-builder-6',
        topic: 'creational-patterns',
        moduleId: 'pattern-builder',
        difficulty: 'advanced' as const,
        question: 'The diagram below shows a Builder structure. Which element is missing?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class PizzaBuilder {
        +setCrust(type: String) void
        +setSauce(type: String) void
        +addTopping(t: String) void
    }
    class MargheritaBuilder {
        +setCrust(type: String) void
        +setSauce(type: String) void
        +addTopping(t: String) void
    }
    class Pizza {
        +crust: String
        +sauce: String
        +toppings: String
    }
    PizzaBuilder <|-- MargheritaBuilder`,
        options: [
            'A private constructor on Pizza to prevent instantiation outside the builder',
            'A static getInstance() method on PizzaBuilder to enforce a single builder instance',
            'An abstract product interface that Pizza must implement',
            'A getResult() method on PizzaBuilder returning Pizza, and a Director class that calls the build steps in sequence',
        ],
        correctAnswer: 3,
        explanation: 'The diagram is missing a getResult() method and a Director class for orchestrating the build steps.',
    },

    // Prototype
    {
        id: 'dp-prototype-1',
        topic: 'creational-patterns',
        moduleId: 'pattern-prototype',
        difficulty: 'beginner' as const,
        question: 'What problem does the Prototype pattern primarily solve?',
        questionType: 'multiple_choice' as const,
        options: [
            'Providing a unified interface for creating families of related products',
            'Creating new objects by copying an existing object, avoiding the cost of creating from scratch',
            'Ensuring only a single instance of a class is created',
            'Defining a step-by-step process for assembling a complex object',
        ],
        correctAnswer: 1,
        explanation: 'Prototype lets you clone a pre-configured object instead of instantiating and configuring a new one.',
    },
    {
        id: 'dp-prototype-2',
        topic: 'creational-patterns',
        moduleId: 'pattern-prototype',
        difficulty: 'beginner' as const,
        question: 'Which scenario is the BEST fit for the Prototype pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'A meal-ordering system that builds a burger through sequential steps',
            'A game that spawns many enemy characters based on a pre-configured template',
            'A payment gateway that must have exactly one active connection per session',
            'A report tool that chooses between PDF and HTML renderers via subclasses',
        ],
        correctAnswer: 1,
        explanation: 'Cloning a pre-configured enemy template and tweaking attributes is far more efficient than re-running initialization.',
    },
    {
        id: 'dp-prototype-3',
        topic: 'creational-patterns',
        moduleId: 'pattern-prototype',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a standard participant in the Prototype pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Director',
            'ConcretePrototype',
            'Prototype interface',
            'Client',
        ],
        correctAnswer: 0,
        explanation: 'Director is a participant in the Builder pattern.',
    },
    {
        id: 'dp-prototype-4',
        topic: 'creational-patterns',
        moduleId: 'pattern-prototype',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes Prototype from Builder when both can produce customized objects?',
        questionType: 'multiple_choice' as const,
        options: [
            'Prototype creates objects by cloning an existing instance; Builder assembles through a defined sequence of steps',
            'Builder clones a prototype at the end of construction; Prototype delegates to a Director',
            'Prototype uses inheritance to vary the product; Builder uses composition',
            'Prototype always performs a deep copy; Builder always performs a shallow copy',
        ],
        correctAnswer: 0,
        explanation: 'Prototype starts with a fully formed existing object and produces variations through cloning. Builder starts from nothing and assembles step by step.',
    },
    {
        id: 'dp-prototype-5',
        topic: 'creational-patterns',
        moduleId: 'pattern-prototype',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Shape {
        +color: String
        +clone() Shape
    }
    class Circle {
        +radius: int
        +clone() Shape
    }
    class Rectangle {
        +width: int
        +height: int
        +clone() Shape
    }
    class Client {
        +duplicateShape(s: Shape) Shape
    }
    Shape <|-- Circle
    Shape <|-- Rectangle
    Client ..> Shape`,
        options: [
            'Prototype',
            'Abstract Factory',
            'Builder',
            'Factory Method',
        ],
        correctAnswer: 0,
        explanation: 'The diagram shows Shape with a clone() method, concrete classes implementing clone(), and a Client that duplicates shapes.',
    },
    {
        id: 'dp-prototype-6',
        topic: 'creational-patterns',
        moduleId: 'pattern-prototype',
        difficulty: 'advanced' as const,
        question: 'The diagram shows a Prototype registry. What is missing for safe, independent copies?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class PrototypeRegistry {
        -prototypes: Map
        +register(key: String, p: Document) void
        +get(key: String) Document
    }
    class Document {
        +title: String
        +sections: List
        +clone() Document
    }
    class LegalDocument {
        +clauses: List
        +clone() Document
    }
    Document <|-- LegalDocument
    PrototypeRegistry o-- Document`,
        options: [
            'A static getInstance() on PrototypeRegistry to ensure only one registry exists',
            'A deep copy implementation inside clone() so nested objects are copied independently',
            'A Director class that orchestrates calls to clone() in order',
            'A private constructor on Document so only the registry can create instances',
        ],
        correctAnswer: 1,
        explanation: 'Without deep copy in clone(), the cloned Document shares references to the same nested objects as the original.',
    },

    // ===== STRUCTURAL PATTERNS =====

    // Adapter
    {
        id: 'dp-adapter-1',
        topic: 'structural-patterns',
        moduleId: 'pattern-adapter',
        difficulty: 'beginner' as const,
        question: 'What problem does the Adapter pattern solve?',
        questionType: 'multiple_choice' as const,
        options: [
            'It allows incompatible interfaces to work together by wrapping one interface to match another',
            'It provides a simplified interface to a complex subsystem',
            'It adds new responsibilities to an object dynamically',
            'It decouples an abstraction from its implementation',
        ],
        correctAnswer: 0,
        explanation: 'The Adapter pattern converts the interface of a class into another interface that clients expect.',
    },
    {
        id: 'dp-adapter-2',
        topic: 'structural-patterns',
        moduleId: 'pattern-adapter',
        difficulty: 'beginner' as const,
        question: 'Which scenario best illustrates the Adapter pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Adding logging behavior to a service without changing its code',
            'Integrating a third-party library whose interface differs from what your system expects',
            'Providing a single entry point to a complex set of subsystem classes',
            'Sharing glyph objects across a document to save memory',
        ],
        correctAnswer: 1,
        explanation: 'Adapting a third-party library interface to match your system is the classic Adapter use case.',
    },
    {
        id: 'dp-adapter-3',
        topic: 'structural-patterns',
        moduleId: 'pattern-adapter',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a participant in the Adapter pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Adapter',
            'Target',
            'Implementor',
            'Adaptee',
        ],
        correctAnswer: 2,
        explanation: 'Implementor is a participant in the Bridge pattern.',
    },
    {
        id: 'dp-adapter-4',
        topic: 'structural-patterns',
        moduleId: 'pattern-adapter',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes the Adapter pattern from the Facade pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Adapter simplifies an interface; Facade makes two incompatible interfaces compatible',
            'Adapter is a structural pattern; Facade is a behavioral pattern',
            'Adapter requires inheritance; Facade requires composition',
            'Adapter wraps a single class to match an expected interface; Facade provides a unified interface over an entire subsystem',
        ],
        correctAnswer: 3,
        explanation: 'Adapter targets interface incompatibility between two specific interfaces. Facade targets complexity by providing a higher-level interface.',
    },
    {
        id: 'dp-adapter-5',
        topic: 'structural-patterns',
        moduleId: 'pattern-adapter',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Target {
        +request()
    }
    class Adapter {
        -adaptee: Adaptee
        +request()
    }
    class Adaptee {
        +specificRequest()
    }
    Target <|-- Adapter
    Adapter --> Adaptee`,
        options: [
            'Proxy',
            'Bridge',
            'Decorator',
            'Adapter',
        ],
        correctAnswer: 3,
        explanation: 'The diagram shows an Adapter that inherits from Target and delegates to Adaptee — the classic Adapter structure.',
    },
    {
        id: 'dp-adapter-6',
        topic: 'structural-patterns',
        moduleId: 'pattern-adapter',
        difficulty: 'advanced' as const,
        question: 'This diagram is missing a key element. What should be added to complete the Adapter pattern?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Target {
        +request()
    }
    class Adapter {
        +request()
    }
    class Adaptee {
        +specificRequest()
    }
    Target <|-- Adapter`,
        options: [
            'A composition or association arrow from Adapter to Adaptee',
            'A dependency arrow from Target to Adaptee',
            'An inheritance arrow from Adaptee to Adapter',
            'A dependency arrow from Client to Target',
        ],
        correctAnswer: 0,
        explanation: 'The Adapter must hold a reference to the Adaptee to delegate calls to the incompatible interface.',
    },

    // Bridge
    {
        id: 'dp-bridge-1',
        topic: 'structural-patterns',
        moduleId: 'pattern-bridge',
        difficulty: 'beginner' as const,
        question: 'What is the primary intent of the Bridge pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'To attach additional responsibilities to an object dynamically',
            'To provide a surrogate or placeholder for another object',
            'To compose objects into tree structures for part-whole hierarchies',
            'To decouple an abstraction from its implementation so the two can vary independently',
        ],
        correctAnswer: 3,
        explanation: 'Bridge separates an abstraction from its implementation using composition, allowing each side to be extended independently.',
    },
    {
        id: 'dp-bridge-2',
        topic: 'structural-patterns',
        moduleId: 'pattern-bridge',
        difficulty: 'beginner' as const,
        question: 'Which scenario best fits the Bridge pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Building a GUI component tree where containers and leaves are treated uniformly',
            'Providing a single access point to control a resource-intensive object',
            'Adding undo/redo behavior to a text editor without modifying its class',
            'Supporting multiple database backends for a reporting system without coupling reports to specific drivers',
        ],
        correctAnswer: 3,
        explanation: 'Bridge is ideal when abstractions (reports) and implementations (database drivers) should both be extensible independently.',
    },
    {
        id: 'dp-bridge-3',
        topic: 'structural-patterns',
        moduleId: 'pattern-bridge',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a participant in the Bridge pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Adaptee',
            'RefinedAbstraction',
            'Implementor',
            'Abstraction',
        ],
        correctAnswer: 0,
        explanation: 'Adaptee belongs to the Adapter pattern.',
    },
    {
        id: 'dp-bridge-4',
        topic: 'structural-patterns',
        moduleId: 'pattern-bridge',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes Bridge from Adapter?',
        questionType: 'multiple_choice' as const,
        options: [
            'Bridge is designed upfront to allow abstraction and implementation to vary independently; Adapter retrofits incompatible interfaces after the fact',
            'Bridge uses inheritance exclusively; Adapter uses composition exclusively',
            'Bridge is used after design to fix incompatible interfaces; Adapter is designed upfront',
            'There is no meaningful difference',
        ],
        correctAnswer: 0,
        explanation: 'Bridge is an intentional design decision made proactively. Adapter is typically applied reactively.',
    },
    {
        id: 'dp-bridge-5',
        topic: 'structural-patterns',
        moduleId: 'pattern-bridge',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Abstraction {
        -impl: Implementor
        +operation()
    }
    class RefinedAbstraction {
        +operation()
    }
    class Implementor {
        +operationImpl()
    }
    class ConcreteImplementor {
        +operationImpl()
    }
    Abstraction <|-- RefinedAbstraction
    Abstraction --> Implementor
    Implementor <|-- ConcreteImplementor`,
        options: [
            'Decorator',
            'Bridge',
            'Adapter',
            'Strategy',
        ],
        correctAnswer: 1,
        explanation: 'The diagram shows Abstraction and Implementor hierarchies connected by composition — the Bridge pattern.',
    },
    {
        id: 'dp-bridge-6',
        topic: 'structural-patterns',
        moduleId: 'pattern-bridge',
        difficulty: 'advanced' as const,
        question: 'Which UML structure correctly represents the Bridge pattern?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Shape {
        -renderer: Renderer
        +draw()
    }
    class Circle {
        +draw()
    }
    class Renderer {
        +renderCircle()
    }
    class VectorRenderer {
        +renderCircle()
    }
    class RasterRenderer {
        +renderCircle()
    }
    Shape <|-- Circle
    Shape --> Renderer
    Renderer <|-- VectorRenderer
    Renderer <|-- RasterRenderer`,
        options: [
            'Renderer wrapping a Shape instance and delegating draw calls',
            'Circle and Renderer having no relationship',
            'This diagram, where Shape and Renderer hierarchies are connected by composition',
            'Shape inheriting from both VectorRenderer and RasterRenderer',
        ],
        correctAnswer: 2,
        explanation: 'Bridge connects two independent hierarchies through composition. Shape holds a reference to Renderer.',
    },

    // Composite
    {
        id: 'dp-composite-1',
        topic: 'structural-patterns',
        moduleId: 'pattern-composite',
        difficulty: 'beginner' as const,
        question: 'What problem does the Composite pattern solve?',
        questionType: 'multiple_choice' as const,
        options: [
            'It reduces the number of objects by sharing common state',
            'It controls access to an object by providing a surrogate',
            'It allows objects with incompatible interfaces to collaborate',
            'It lets clients treat individual objects and compositions of objects uniformly',
        ],
        correctAnswer: 3,
        explanation: 'Composite composes objects into tree structures and lets clients treat leaf and composite nodes through the same interface.',
    },
    {
        id: 'dp-composite-2',
        topic: 'structural-patterns',
        moduleId: 'pattern-composite',
        difficulty: 'beginner' as const,
        question: 'Which scenario best fits the Composite pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Lazily loading a large image only when first displayed',
            'Providing a simplified API for a media player subsystem',
            'Dynamically adding encryption and compression to a data stream',
            'Representing a file system where files and directories share the same interface',
        ],
        correctAnswer: 3,
        explanation: 'A file system is the canonical Composite example: files (leaves) and directories (composites) respond to the same operations.',
    },
    {
        id: 'dp-composite-3',
        topic: 'structural-patterns',
        moduleId: 'pattern-composite',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a participant in the Composite pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Composite',
            'Component',
            'Handler',
            'Leaf',
        ],
        correctAnswer: 2,
        explanation: 'Handler is a participant in the Chain of Responsibility pattern.',
    },
    {
        id: 'dp-composite-4',
        topic: 'structural-patterns',
        moduleId: 'pattern-composite',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes Composite from a simple collection or list?',
        questionType: 'multiple_choice' as const,
        options: [
            'Composite only works with two levels of nesting',
            'Composite enforces that all elements be the same type',
            'Composite is immutable; collections are mutable',
            'Composite defines a common interface for both individual elements and containers, enabling recursive tree structures',
        ],
        correctAnswer: 3,
        explanation: 'The key is the shared Component interface: both leaves and composites implement it, allowing recursive composition.',
    },
    {
        id: 'dp-composite-5',
        topic: 'structural-patterns',
        moduleId: 'pattern-composite',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Component {
        +operation()
        +add(c: Component)
        +remove(c: Component)
    }
    class Leaf {
        +operation()
    }
    class Composite {
        -children: List~Component~
        +operation()
        +add(c: Component)
        +remove(c: Component)
    }
    Component <|-- Leaf
    Component <|-- Composite
    Composite o-- Component`,
        options: [
            'Composite',
            'Chain of Responsibility',
            'Decorator',
            'Flyweight',
        ],
        correctAnswer: 0,
        explanation: 'The diagram shows a Component interface implemented by both Leaf and Composite, with Composite aggregating Components.',
    },
    {
        id: 'dp-composite-6',
        topic: 'structural-patterns',
        moduleId: 'pattern-composite',
        difficulty: 'advanced' as const,
        question: 'This diagram is incomplete. What relationship is missing?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Component {
        +operation()
    }
    class Leaf {
        +operation()
    }
    class Composite {
        +operation()
        +add(c: Component)
    }
    Component <|-- Leaf
    Component <|-- Composite`,
        options: [
            'A dependency arrow from Leaf to Component',
            'A composition arrow from Component to Composite',
            'An aggregation arrow from Composite to Component showing Composite holds children',
            'An inheritance arrow from Composite to Leaf',
        ],
        correctAnswer: 2,
        explanation: 'Composite must aggregate Component (its children list). Without this, the recursive structure that defines Composite is absent.',
    },

    // Decorator
    {
        id: 'dp-decorator-1',
        topic: 'structural-patterns',
        moduleId: 'pattern-decorator',
        difficulty: 'beginner' as const,
        question: 'What is the primary intent of the Decorator pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'To ensure only one instance of a class is created',
            'To define a family of algorithms and make them interchangeable',
            'To provide a simplified interface to a complex subsystem',
            'To attach additional responsibilities to an object dynamically without subclassing',
        ],
        correctAnswer: 3,
        explanation: 'Decorator wraps an object to add new behavior dynamically at runtime.',
    },
    {
        id: 'dp-decorator-2',
        topic: 'structural-patterns',
        moduleId: 'pattern-decorator',
        difficulty: 'beginner' as const,
        question: 'Which scenario best fits the Decorator pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Adding scrollbars, borders, and shadows to a text view widget at runtime',
            'Adapting a legacy logging API to a new interface',
            'Representing a menu system where items and sub-menus share an interface',
            'Providing a cached proxy for expensive database queries',
        ],
        correctAnswer: 0,
        explanation: 'GUI widget decoration is a classic Decorator example.',
    },
    {
        id: 'dp-decorator-3',
        topic: 'structural-patterns',
        moduleId: 'pattern-decorator',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a participant in the Decorator pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'ConcreteDecorator',
            'Component',
            'Implementor',
            'ConcreteComponent',
        ],
        correctAnswer: 2,
        explanation: 'Implementor belongs to the Bridge pattern.',
    },
    {
        id: 'dp-decorator-4',
        topic: 'structural-patterns',
        moduleId: 'pattern-decorator',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes Decorator from Composite?',
        questionType: 'multiple_choice' as const,
        options: [
            'Decorator is used for I/O streams; Composite is used for UI only',
            'Decorator uses inheritance; Composite uses composition exclusively',
            'There is no structural difference',
            'Decorator adds behavior to a single component and has exactly one child; Composite aggregates multiple children',
        ],
        correctAnswer: 3,
        explanation: 'Decorator wraps exactly one component to add behavior. Composite manages a collection of children to build trees.',
    },
    {
        id: 'dp-decorator-5',
        topic: 'structural-patterns',
        moduleId: 'pattern-decorator',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Component {
        +operation()
    }
    class ConcreteComponent {
        +operation()
    }
    class Decorator {
        -component: Component
        +operation()
    }
    class ConcreteDecorator {
        +operation()
        +addedBehavior()
    }
    Component <|-- ConcreteComponent
    Component <|-- Decorator
    Decorator <|-- ConcreteDecorator
    Decorator --> Component`,
        options: [
            'Proxy',
            'Decorator',
            'Bridge',
            'Composite',
        ],
        correctAnswer: 1,
        explanation: 'Decorator both inherits from Component and holds a reference to a Component — the signature wrapping structure.',
    },
    {
        id: 'dp-decorator-6',
        topic: 'structural-patterns',
        moduleId: 'pattern-decorator',
        difficulty: 'advanced' as const,
        question: 'Which pattern does this I/O stream diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class DataStream {
        +write(data: string)
    }
    class FileStream {
        +write(data: string)
    }
    class EncryptedStream {
        -wrappee: DataStream
        +write(data: string)
    }
    class CompressedStream {
        -wrappee: DataStream
        +write(data: string)
    }
    DataStream <|-- FileStream
    DataStream <|-- EncryptedStream
    DataStream <|-- CompressedStream
    EncryptedStream --> DataStream
    CompressedStream --> DataStream`,
        options: [
            'Bridge — DataStream is an abstraction separated from its implementation',
            'Decorator — wrappers inherit the component interface and delegate to a wrapped component',
            'Adapter — EncryptedStream converts DataStream into a different interface',
            'Composite — streams aggregate multiple DataStreams',
        ],
        correctAnswer: 1,
        explanation: 'EncryptedStream and CompressedStream both implement DataStream and hold a DataStream reference — the hallmarks of Decorator.',
    },

    // Facade
    {
        id: 'dp-facade-1',
        topic: 'structural-patterns',
        moduleId: 'pattern-facade',
        difficulty: 'beginner' as const,
        question: 'What problem does the Facade pattern solve?',
        questionType: 'multiple_choice' as const,
        options: [
            'It allows incompatible interfaces to work together',
            'It prevents direct instantiation of complex subsystem classes',
            'It dynamically adds responsibilities to individual objects',
            'It provides a simple, unified interface to a complex subsystem',
        ],
        correctAnswer: 3,
        explanation: 'Facade defines a higher-level interface that makes a subsystem easier to use.',
    },
    {
        id: 'dp-facade-2',
        topic: 'structural-patterns',
        moduleId: 'pattern-facade',
        difficulty: 'beginner' as const,
        question: 'Which scenario best fits the Facade pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'A single startMovie() method that coordinates the projector, sound system, and lights',
            'Wrapping a legacy MP3 decoder to conform to your audio player interface',
            'Adding a progress bar to a download without modifying the downloader',
            'Sharing font glyph objects across a document to reduce memory',
        ],
        correctAnswer: 0,
        explanation: 'A home theater facade that exposes one method while coordinating many subsystems is the textbook Facade example.',
    },
    {
        id: 'dp-facade-3',
        topic: 'structural-patterns',
        moduleId: 'pattern-facade',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a participant in the Facade pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Client',
            'Subsystem classes',
            'Facade',
            'Adaptee',
        ],
        correctAnswer: 3,
        explanation: 'Adaptee belongs to the Adapter pattern.',
    },
    {
        id: 'dp-facade-4',
        topic: 'structural-patterns',
        moduleId: 'pattern-facade',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes Facade from Mediator?',
        questionType: 'multiple_choice' as const,
        options: [
            'Facade uses inheritance; Mediator uses composition',
            'Facade provides a simplified interface without changing subsystem behavior; Mediator centralizes communication between peer objects',
            'Facade and Mediator are identical',
            'Facade coordinates bidirectional communication; Mediator provides a one-way simplified interface',
        ],
        correctAnswer: 1,
        explanation: 'Facade is one-directional simplification. Mediator enables peer objects to communicate through it.',
    },
    {
        id: 'dp-facade-5',
        topic: 'structural-patterns',
        moduleId: 'pattern-facade',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Facade {
        -subsystemA: SubsystemA
        -subsystemB: SubsystemB
        -subsystemC: SubsystemC
        +unifiedOperation()
    }
    class SubsystemA {
        +operationA()
    }
    class SubsystemB {
        +operationB()
    }
    class SubsystemC {
        +operationC()
    }
    Facade --> SubsystemA
    Facade --> SubsystemB
    Facade --> SubsystemC`,
        options: [
            'Facade',
            'Adapter',
            'Mediator',
            'Proxy',
        ],
        correctAnswer: 0,
        explanation: 'A single class holding references to multiple subsystem classes and exposing a unified operation — the Facade pattern.',
    },
    {
        id: 'dp-facade-6',
        topic: 'structural-patterns',
        moduleId: 'pattern-facade',
        difficulty: 'advanced' as const,
        question: 'Which diagram correctly represents a Facade for a compiler subsystem?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Compiler {
        +compile(file: string)
    }
    class Lexer {
        +tokenize(src: string)
    }
    class Parser {
        +parse(tokens: List~string~)
    }
    class CodeGenerator {
        +generate(ast: string)
    }
    Compiler --> Lexer
    Compiler --> Parser
    Compiler --> CodeGenerator`,
        options: [
            'Lexer, Parser, and CodeGenerator all inheriting from Compiler',
            'This diagram — Compiler is a facade delegating to Lexer, Parser, and CodeGenerator',
            'CodeGenerator wrapping Compiler and adding optimization behavior',
            'Compiler implementing the same interface as Lexer, Parser, and CodeGenerator',
        ],
        correctAnswer: 1,
        explanation: 'Compiler acts as a Facade exposing compile() while hiding tokenizing, parsing, and code generation.',
    },

    // Flyweight
    {
        id: 'dp-flyweight-1',
        topic: 'structural-patterns',
        moduleId: 'pattern-flyweight',
        difficulty: 'beginner' as const,
        question: 'What problem does the Flyweight pattern solve?',
        questionType: 'multiple_choice' as const,
        options: [
            'It allows a class to have only one instance globally',
            'It reduces memory usage by sharing common state among many fine-grained objects',
            'It composes objects into tree structures for part-whole hierarchies',
            'It provides a placeholder that controls access to an expensive object',
        ],
        correctAnswer: 1,
        explanation: 'Flyweight minimizes memory use by sharing intrinsic (common) state while keeping extrinsic (context-specific) state external.',
    },
    {
        id: 'dp-flyweight-2',
        topic: 'structural-patterns',
        moduleId: 'pattern-flyweight',
        difficulty: 'beginner' as const,
        question: 'Which scenario best fits the Flyweight pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Dynamically adding spell-check and grammar-check to a text editor at runtime',
            'Treating text characters and paragraphs uniformly in a document tree',
            'Providing a single entry point that controls access to a shared database connection',
            'Representing thousands of characters in a text editor where each glyph shares font and style data',
        ],
        correctAnswer: 3,
        explanation: 'Sharing intrinsic glyph data (font, style) across thousands of characters is the classic Flyweight example.',
    },
    {
        id: 'dp-flyweight-3',
        topic: 'structural-patterns',
        moduleId: 'pattern-flyweight',
        difficulty: 'intermediate' as const,
        question: 'In the Flyweight pattern, what is the difference between intrinsic and extrinsic state?',
        questionType: 'multiple_choice' as const,
        options: [
            'There is no meaningful difference',
            'Intrinsic state is shared and stored in the flyweight; extrinsic state is context-dependent and passed in by the client',
            'Intrinsic state is mutable and stored externally; extrinsic state is immutable in the flyweight',
            'Intrinsic state is managed by the FlyweightFactory; extrinsic state is managed by the Flyweight',
        ],
        correctAnswer: 1,
        explanation: 'Intrinsic state is independent of context and safely shared. Extrinsic state varies per use and must be supplied by the client.',
    },
    {
        id: 'dp-flyweight-4',
        topic: 'structural-patterns',
        moduleId: 'pattern-flyweight',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes Flyweight from Singleton?',
        questionType: 'multiple_choice' as const,
        options: [
            'Flyweight manages a pool of shared objects keyed by type to reduce memory; Singleton ensures exactly one instance globally',
            'Flyweight requires a factory; Singleton never uses a factory',
            'Flyweight is a structural pattern; Singleton is behavioral',
            'Flyweight ensures exactly one shared instance; Singleton manages a pool',
        ],
        correctAnswer: 0,
        explanation: 'Singleton restricts to one object. Flyweight maintains a pool of shared objects managed by a factory.',
    },
    {
        id: 'dp-flyweight-5',
        topic: 'structural-patterns',
        moduleId: 'pattern-flyweight',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class FlyweightFactory {
        -flyweights: Map
        +getFlyweight(key: string) Flyweight
    }
    class Flyweight {
        -intrinsicState: string
        +operation(extrinsicState: string)
    }
    class ConcreteFlyweight {
        +operation(extrinsicState: string)
    }
    FlyweightFactory --> Flyweight
    Flyweight <|-- ConcreteFlyweight`,
        options: [
            'Object Pool',
            'Singleton',
            'Proxy',
            'Flyweight',
        ],
        correctAnswer: 3,
        explanation: 'FlyweightFactory maintaining a pool of shared Flyweight objects keyed by intrinsic state — the Flyweight pattern.',
    },
    {
        id: 'dp-flyweight-6',
        topic: 'structural-patterns',
        moduleId: 'pattern-flyweight',
        difficulty: 'advanced' as const,
        question: 'This particle system diagram is missing an element to correctly apply the Flyweight pattern. What is it?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class ParticleFlyweight {
        -texture: string
        -color: string
        +draw(x: int, y: int, velocity: float)
    }
    class Particle {
        +x: int
        +y: int
        +velocity: float
    }
    Particle --> ParticleFlyweight`,
        options: [
            'A ParticleFactory that caches and returns shared ParticleFlyweight instances by texture and color',
            'A separate interface that both Particle and ParticleFlyweight implement',
            'A collection of Particle objects stored inside ParticleFlyweight',
            'An inheritance arrow from Particle to ParticleFlyweight',
        ],
        correctAnswer: 0,
        explanation: 'Flyweight requires a factory to manage the pool of shared objects and prevent duplicates.',
    },

    // Proxy
    {
        id: 'dp-proxy-1',
        topic: 'structural-patterns',
        moduleId: 'pattern-proxy',
        difficulty: 'beginner' as const,
        question: 'What is the primary intent of the Proxy pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'To simplify a complex subsystem',
            'To add behavior dynamically without modifying a class',
            'To decouple an abstraction from its implementation',
            'To provide a surrogate or placeholder for another object to control access to it',
        ],
        correctAnswer: 3,
        explanation: 'A Proxy acts as a stand-in for a real subject, controlling access to it.',
    },
    {
        id: 'dp-proxy-2',
        topic: 'structural-patterns',
        moduleId: 'pattern-proxy',
        difficulty: 'beginner' as const,
        question: 'Which scenario best fits the Proxy pattern?',
        questionType: 'multiple_choice' as const,
        options: [
            'Wrapping a third-party parser so it conforms to your interface',
            'Composing a menu system where items and sub-menus share the same interface',
            'Sharing textures across thousands of game objects to save memory',
            'Deferring the loading of a large image until it is first scrolled into view',
        ],
        correctAnswer: 3,
        explanation: 'A virtual proxy that loads a large image lazily is a classic Proxy use case.',
    },
    {
        id: 'dp-proxy-3',
        topic: 'structural-patterns',
        moduleId: 'pattern-proxy',
        difficulty: 'intermediate' as const,
        question: 'Which of the following is NOT a recognized type of Proxy?',
        questionType: 'multiple_choice' as const,
        options: [
            'Remote Proxy',
            'Protection Proxy',
            'Virtual Proxy',
            'Behavioral Proxy',
        ],
        correctAnswer: 3,
        explanation: 'Common types include Virtual, Protection, Remote, and Caching Proxy. "Behavioral Proxy" is not a recognized type.',
    },
    {
        id: 'dp-proxy-4',
        topic: 'structural-patterns',
        moduleId: 'pattern-proxy',
        difficulty: 'intermediate' as const,
        question: 'What distinguishes Proxy from Decorator?',
        questionType: 'multiple_choice' as const,
        options: [
            'Decorator can only wrap one level deep; Proxy supports unlimited nesting',
            'Proxy and Decorator have identical structure',
            'Decorator adds behavior chosen by the client at runtime; Proxy controls access and manages the lifecycle of the real subject itself',
            'Proxy uses inheritance; Decorator uses composition',
        ],
        correctAnswer: 2,
        explanation: 'Structurally similar, but Decorator enriches behavior while Proxy manages access and lifecycle.',
    },
    {
        id: 'dp-proxy-5',
        topic: 'structural-patterns',
        moduleId: 'pattern-proxy',
        difficulty: 'intermediate' as const,
        question: 'Which design pattern does this UML diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Subject {
        +request()
    }
    class RealSubject {
        +request()
    }
    class Proxy {
        -realSubject: RealSubject
        +request()
    }
    Subject <|-- RealSubject
    Subject <|-- Proxy
    Proxy --> RealSubject`,
        options: [
            'Decorator',
            'Facade',
            'Adapter',
            'Proxy',
        ],
        correctAnswer: 3,
        explanation: 'Proxy implements the same Subject interface and holds a reference to RealSubject — the defining Proxy structure.',
    },
    {
        id: 'dp-proxy-6',
        topic: 'structural-patterns',
        moduleId: 'pattern-proxy',
        difficulty: 'advanced' as const,
        question: 'What type of Proxy does this diagram represent?',
        questionType: 'uml' as const,
        diagramSource: `classDiagram
    class Image {
        +display()
    }
    class RealImage {
        -filename: string
        +loadFromDisk()
        +display()
    }
    class ImageProxy {
        -filename: string
        -realImage: RealImage
        +display()
    }
    Image <|-- RealImage
    Image <|-- ImageProxy
    ImageProxy --> RealImage`,
        options: [
            'Flyweight — ImageProxy shares a single RealImage across callers',
            'Virtual Proxy — ImageProxy defers creation of RealImage until display() is called',
            'Decorator — ImageProxy adds display behavior to RealImage',
            'Adapter — ImageProxy converts the RealImage interface',
        ],
        correctAnswer: 1,
        explanation: 'ImageProxy is a Virtual Proxy: it defers the expensive loadFromDisk until display() is first called.',
    },

    // ===== BEHAVIORAL PATTERNS =====

// Chain of Responsibility
{
    id: 'dp-chain-of-responsibility-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-chain-of-responsibility',
    difficulty: 'intermediate' as const,
    question: 'What problem does the Chain of Responsibility pattern solve?',
    questionType: 'multiple_choice' as const,
    options: [
            'It decouples a sender of a request from its receiver by giving multiple objects a chance to handle the request',
            'It couples a sender of a request to its receiver by giving multiple objects a chance to handle the request',
            'It broadcasts a request to all objects in a collection simultaneously',
            'It ensures exactly one object handles every request in a system',
        ],
        correctAnswer: 0,
    explanation: 'Chain of Responsibility decouples sender from receiver. The request is passed along a chain until one handler processes it, avoiding tight coupling between sender and specific handler.',
},
{
    id: 'dp-chain-of-responsibility-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-chain-of-responsibility',
    difficulty: 'intermediate' as const,
    question: 'Which scenario best illustrates the Chain of Responsibility pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A publish-subscribe system where all subscribers receive every event',
            'A factory that creates different types of objects based on input',
            'A logging system where DEBUG, INFO, and ERROR handlers each decide whether to handle or pass a log message up the chain',
            'A strategy selector that picks one algorithm from a predefined set',
        ],
        correctAnswer: 2,
    explanation: 'A tiered logging system where each handler (DEBUG, INFO, ERROR) checks if it should handle the message and passes it along if not is a classic Chain of Responsibility example.',
},
{
    id: 'dp-chain-of-responsibility-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-chain-of-responsibility',
    difficulty: 'intermediate' as const,
    question: 'Which of these is NOT a participant in the Chain of Responsibility pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Handler (abstract)',
            'Mediator',
            'Client',
            'ConcreteHandler',
        ],
        correctAnswer: 1,
    explanation: 'The participants in Chain of Responsibility are Handler (abstract interface), ConcreteHandler (handles requests it is responsible for), and Client (initiates the request). Mediator is a separate behavioral pattern.',
},
{
    id: 'dp-chain-of-responsibility-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-chain-of-responsibility',
    difficulty: 'intermediate' as const,
    question: 'What distinguishes Chain of Responsibility from the Decorator pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Chain of Responsibility only works with UI components, while Decorator works with any object',
            'Decorator passes a request until one handler processes it; Chain of Responsibility adds behavior at every step',
            'Chain of Responsibility passes a request until one handler processes it and stops; Decorator wraps behavior so every link in the chain adds to the result',
            'Both patterns are identical in structure and intent',
        ],
        correctAnswer: 2,
    explanation: 'In Chain of Responsibility, a handler either processes the request or passes it on — typically only one handler acts. In Decorator, every wrapper adds behavior and the call continues through all layers.',
},
{
    id: 'dp-chain-of-responsibility-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-chain-of-responsibility',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Handler {
        <<abstract>>
        -successor: Handler
        +setSuccessor(Handler)
        +handleRequest(request)
    }
    class ConcreteHandler1 {
        +handleRequest(request)
    }
    class ConcreteHandler2 {
        +handleRequest(request)
    }
    class Client {
        +sendRequest()
    }
    Handler <|-- ConcreteHandler1
    Handler <|-- ConcreteHandler2
    Handler o-- Handler
    Client --> Handler`,
    options: [
            'Observer',
            'Chain of Responsibility',
            'Strategy',
            'Command',
        ],
        correctAnswer: 1,
    explanation: 'The diagram shows Handler holding a reference to another Handler (successor), allowing requests to be passed along the chain. This self-referential structure is the hallmark of Chain of Responsibility.',
},
{
    id: 'dp-chain-of-responsibility-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-chain-of-responsibility',
    difficulty: 'advanced' as const,
    question: 'In this partial Chain of Responsibility diagram, what is missing from the ConcreteHandler that makes it a valid implementation?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Handler {
        <<abstract>>
        -successor: Handler
        +setSuccessor(Handler)
        +handleRequest(request)
    }
    class ConcreteHandler {
        +processRequest(request)
    }
    Handler <|-- ConcreteHandler`,
    options: [
            'An override of handleRequest() that checks if it can handle the request and calls successor.handleRequest() if not',
            'A list of all possible successors to choose from at runtime',
            'A reference to the Client that initiated the request',
            'A static factory method to create handler chains',
        ],
        correctAnswer: 0,
    explanation: 'A ConcreteHandler must override handleRequest() to decide whether it handles the request itself or forwards it to its successor. Without this logic, the chain cannot function.',
},

// Command
{
    id: 'dp-command-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-command',
    difficulty: 'intermediate' as const,
    question: 'What is the primary intent of the Command pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'To notify multiple objects when one object changes state',
            'To define a family of algorithms and make them interchangeable',
            'To encapsulate a request as an object, allowing parameterization, queuing, logging, and undoable operations',
            'To provide a simplified interface to a complex subsystem',
        ],
        correctAnswer: 2,
    explanation: 'The Command pattern encapsulates a request as an object. This allows requests to be parameterized, stored in queues or logs, and supports undo/redo operations.',
},
{
    id: 'dp-command-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-command',
    difficulty: 'intermediate' as const,
    question: 'Which scenario best fits the Command pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A report generator that fills in a template with data from different sources',
            'A payment system that selects between credit card, PayPal, or crypto at runtime',
            'A text editor that records every user action so it can support multi-level undo and a macro recorder',
            'An event bus that broadcasts state changes to all registered listeners',
        ],
        correctAnswer: 2,
    explanation: 'A text editor with undo and macro recording is the canonical Command use case. Each action (insert, delete, format) is a Command object that can be executed, undone, or stored for replay.',
},
{
    id: 'dp-command-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-command',
    difficulty: 'intermediate' as const,
    question: 'Which role does NOT belong in the Command pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Successor',
            'ConcreteCommand',
            'Receiver',
            'Invoker',
        ],
        correctAnswer: 0,
    explanation: 'The Command pattern participants are Command (interface), ConcreteCommand, Invoker, Receiver, and Client. "Successor" belongs to the Chain of Responsibility pattern.',
},
{
    id: 'dp-command-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-command',
    difficulty: 'intermediate' as const,
    question: 'What distinguishes the Command pattern from the Strategy pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Command encapsulates a request with its own state and often supports undo; Strategy encapsulates an interchangeable algorithm with no notion of history or undo',
            'Command and Strategy are structurally identical and differ only in naming conventions',
            'Strategy encapsulates a request as an object for queuing; Command selects among algorithms at runtime',
            'Strategy supports undo/redo while Command does not',
        ],
        correctAnswer: 0,
    explanation: 'Command objects carry the request and often receiver state, enabling undo. Strategy objects encapsulate algorithms that are swapped for computation purposes, without the request/history concept.',
},
{
    id: 'dp-command-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-command',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Command {
        <<interface>>
        +execute()
        +undo()
    }
    class ConcreteCommand {
        -receiver: Receiver
        -state: string
        +execute()
        +undo()
    }
    class Invoker {
        -history: List~Command~
        +executeCommand(Command)
        +undoLast()
    }
    class Receiver {
        +action()
    }
    Command <|.. ConcreteCommand
    ConcreteCommand --> Receiver
    Invoker --> Command`,
    options: [
            'Chain of Responsibility',
            'Command',
            'Strategy',
            'Template Method',
        ],
        correctAnswer: 1,
    explanation: 'The diagram shows an Invoker holding a history of Command objects, with ConcreteCommand referencing a Receiver. The execute/undo interface and history list are definitive Command pattern markers.',
},
{
    id: 'dp-command-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-command',
    difficulty: 'advanced' as const,
    question: 'This diagram shows a partial Command implementation. What critical element is missing to support macro commands (composite commands)?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Command {
        <<interface>>
        +execute()
    }
    class ConcreteCommand {
        -receiver: Receiver
        +execute()
    }
    class Invoker {
        +run(Command)
    }
    class Receiver {
        +doWork()
    }
    Command <|.. ConcreteCommand
    ConcreteCommand --> Receiver
    Invoker --> Command`,
    options: [
            'A second Receiver class for handling batch operations',
            'An abstract Invoker subclass that iterates over commands',
            'A MacroCommand class that implements Command and holds a list of Command objects to execute in sequence',
            'A static registry mapping command names to ConcreteCommand classes',
        ],
        correctAnswer: 2,
    explanation: 'A MacroCommand implements the Command interface and contains a list of Commands. When executed, it runs each sub-command in sequence, enabling composite (macro) commands without changing the Invoker.',
},

// Interpreter
{
    id: 'dp-interpreter-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-interpreter',
    difficulty: 'intermediate' as const,
    question: 'What problem does the Interpreter pattern solve?',
    questionType: 'multiple_choice' as const,
    options: [
            'It encapsulates algorithms so they can be swapped independently of clients that use them',
            'It provides a way to traverse a collection without exposing its underlying representation',
            'It converts the interface of one class into another interface that clients expect',
            'It defines a grammar for a language and provides an interpreter to deal with that grammar',
        ],
        correctAnswer: 3,
    explanation: 'The Interpreter pattern defines a grammar representation for a language and provides an interpreter. Each grammar rule maps to a class, and parsing is done by composing these objects into an abstract syntax tree.',
},
{
    id: 'dp-interpreter-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-interpreter',
    difficulty: 'intermediate' as const,
    question: 'Which scenario best fits the Interpreter pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A SQL query builder that represents each SQL clause (SELECT, WHERE, ORDER BY) as objects in a tree that can be evaluated',
            'A UI framework that chains event handlers for mouse and keyboard events',
            'A file system that notifies all open editors when a file changes on disk',
            'A shopping cart that applies one of several discount strategies at checkout',
        ],
        correctAnswer: 0,
    explanation: 'A SQL query builder using composable clause objects is a good Interpreter fit. Each clause is a grammar rule represented as a class, and evaluating the tree produces the final query or result.',
},
{
    id: 'dp-interpreter-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-interpreter',
    difficulty: 'intermediate' as const,
    question: 'Which of these is NOT a participant in the Interpreter pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Invoker',
            'TerminalExpression',
            'AbstractExpression',
            'NonterminalExpression',
        ],
        correctAnswer: 0,
    explanation: 'Interpreter participants are AbstractExpression, TerminalExpression, NonterminalExpression, Context, and Client. "Invoker" belongs to the Command pattern.',
},
{
    id: 'dp-interpreter-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-interpreter',
    difficulty: 'advanced' as const,
    question: 'What distinguishes the Interpreter pattern from the Composite pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Composite supports recursive composition; Interpreter does not allow recursive structures',
            'Interpreter and Composite share a similar tree structure, but Interpreter adds semantic interpretation (evaluate/interpret) specific to a language grammar',
            'Interpreter is used only for UI component trees; Composite is for language parsing',
            'They are completely unrelated patterns with no structural similarity',
        ],
        correctAnswer: 1,
    explanation: 'Interpreter often uses a Composite-like tree structure for expressions, but adds domain-specific interpretation methods (interpret/evaluate) that give nodes meaning within a formal grammar.',
},
{
    id: 'dp-interpreter-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-interpreter',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class AbstractExpression {
        <<abstract>>
        +interpret(context: Context)
    }
    class TerminalExpression {
        +interpret(context: Context)
    }
    class NonterminalExpression {
        -expressions: List~AbstractExpression~
        +interpret(context: Context)
    }
    class Context {
        +input: string
        +output: string
    }
    AbstractExpression <|-- TerminalExpression
    AbstractExpression <|-- NonterminalExpression
    NonterminalExpression o-- AbstractExpression`,
    options: [
            'Command',
            'Visitor',
            'Composite',
            'Interpreter',
        ],
        correctAnswer: 3,
    explanation: 'The diagram shows AbstractExpression with an interpret(context) method, TerminalExpression for leaf grammar rules, and NonterminalExpression containing other expressions — the classic Interpreter structure.',
},
{
    id: 'dp-interpreter-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-interpreter',
    difficulty: 'advanced' as const,
    question: 'Which diagram correctly represents an Interpreter for a boolean expression grammar with AND and OR operators?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class BooleanExpression {
        <<abstract>>
        +evaluate() bool
    }
    class VariableExpression {
        -name: string
        +evaluate() bool
    }
    class AndExpression {
        -left: BooleanExpression
        -right: BooleanExpression
        +evaluate() bool
    }
    class OrExpression {
        -left: BooleanExpression
        -right: BooleanExpression
        +evaluate() bool
    }
    BooleanExpression <|-- VariableExpression
    BooleanExpression <|-- AndExpression
    BooleanExpression <|-- OrExpression
    AndExpression o-- BooleanExpression
    OrExpression o-- BooleanExpression`,
    options: [
            'A diagram where all expressions inherit from both AndExpression and OrExpression',
            'The diagram shown, where AndExpression and OrExpression hold references to BooleanExpression',
            'A diagram where VariableExpression holds references to AndExpression and OrExpression',
            'A diagram with a single ConcreteExpression class that has a type field (AND, OR, VARIABLE)',
        ],
        correctAnswer: 1,
    explanation: 'The correct Interpreter structure has a common AbstractExpression (BooleanExpression) with terminal leaves (VariableExpression) and nonterminal composites (AndExpression, OrExpression) that hold references back to the abstract type.',
},

// Iterator
{
    id: 'dp-iterator-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-iterator',
    difficulty: 'beginner' as const,
    question: 'What is the intent of the Iterator pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'To define a one-to-many dependency so all dependents are notified when one object changes state',
            'To provide a way to access elements of an aggregate object sequentially without exposing its underlying representation',
            'To allow an object to alter its behavior when its internal state changes',
            'To encapsulate a family of algorithms and make them interchangeable',
        ],
        correctAnswer: 1,
    explanation: 'Iterator provides sequential access to elements of a collection without revealing how the collection is stored internally (array, linked list, tree, etc.).',
},
{
    id: 'dp-iterator-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-iterator',
    difficulty: 'beginner' as const,
    question: 'Which scenario best fits the Iterator pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A music player that switches between shuffle, repeat, and normal playback algorithms',
            'A factory that produces different types of media players for audio, video, and podcasts',
            'A playlist manager that allows clients to traverse songs in order, reversed, or shuffled without knowing the internal data structure',
            'A notification service that alerts all subscribers when a new song is added to the playlist',
        ],
        correctAnswer: 2,
    explanation: 'A playlist manager offering multiple traversal strategies (forward, reverse, shuffle) through a uniform interface is a textbook Iterator use case, hiding whether the playlist is an array, linked list, or tree.',
},
{
    id: 'dp-iterator-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-iterator',
    difficulty: 'intermediate' as const,
    question: 'Which of these is NOT a participant in the Iterator pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Iterator (interface)',
            'ConcreteIterator',
            'Receiver',
            'Aggregate',
        ],
        correctAnswer: 2,
    explanation: 'Iterator pattern participants are Iterator (interface), ConcreteIterator, Aggregate (interface), ConcreteAggregate, and Client. "Receiver" is a participant in the Command pattern.',
},
{
    id: 'dp-iterator-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-iterator',
    difficulty: 'intermediate' as const,
    question: 'What distinguishes an external iterator from an internal iterator?',
    questionType: 'multiple_choice' as const,
    options: [
            'An external iterator is defined inside the collection class; an internal iterator is a separate class',
            'Internal iterators support undo; external iterators do not',
            'An external iterator is controlled by the client (client calls next()); an internal iterator controls its own traversal and invokes a callback for each element',
            'External iterators only work with arrays; internal iterators work with any collection',
        ],
        correctAnswer: 2,
    explanation: 'With an external iterator the client drives the traversal by calling next(). With an internal iterator the iterator drives traversal and the client supplies a callback (like forEach) that is invoked per element.',
},
{
    id: 'dp-iterator-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-iterator',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Iterator {
        <<interface>>
        +hasNext() bool
        +next() Object
    }
    class ConcreteIterator {
        -collection: ConcreteAggregate
        -position: int
        +hasNext() bool
        +next() Object
    }
    class Aggregate {
        <<interface>>
        +createIterator() Iterator
    }
    class ConcreteAggregate {
        -items: List~Object~
        +createIterator() Iterator
    }
    Iterator <|.. ConcreteIterator
    Aggregate <|.. ConcreteAggregate
    ConcreteAggregate --> ConcreteIterator
    ConcreteIterator --> ConcreteAggregate`,
    options: [
            'Visitor',
            'Composite',
            'Chain of Responsibility',
            'Iterator',
        ],
        correctAnswer: 3,
    explanation: 'The diagram shows an Iterator interface with hasNext()/next() methods, a ConcreteIterator tracking position inside a ConcreteAggregate, and the Aggregate interface with createIterator() — the defining Iterator structure.',
},
{
    id: 'dp-iterator-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-iterator',
    difficulty: 'advanced' as const,
    question: 'This diagram shows a tree collection. What must be added to support a depth-first Iterator over the tree?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class TreeNode {
        -value: int
        -children: List~TreeNode~
        +addChild(TreeNode)
        +getChildren() List~TreeNode~
    }
    class Tree {
        -root: TreeNode
        +createIterator() Iterator
    }
    class Iterator {
        <<interface>>
        +hasNext() bool
        +next() Object
    }`,
    options: [
            'A DepthFirstIterator that implements Iterator, uses a stack to track nodes to visit, and traverses children before siblings',
            'A Comparator class that sorts TreeNodes by depth before the iterator begins',
            'A Visitor that accepts each TreeNode and flattens them into a list',
            'A second Tree class that reorders nodes into a flat array before iteration',
        ],
        correctAnswer: 0,
    explanation: 'A DepthFirstIterator implementing the Iterator interface uses an internal stack. When next() is called, it pops a node, pushes its children, and returns the node — enabling depth-first traversal without exposing tree internals.',
},

// Mediator
{
    id: 'dp-mediator-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-mediator',
    difficulty: 'intermediate' as const,
    question: 'What problem does the Mediator pattern solve?',
    questionType: 'multiple_choice' as const,
    options: [
            'It attaches additional responsibilities to an object dynamically',
            'It converts the interface of a class into another interface that clients expect',
            'It provides a surrogate for another object to control access to it',
            'It encapsulates how a set of objects interact, promoting loose coupling by keeping objects from referring to each other explicitly',
        ],
        correctAnswer: 3,
    explanation: 'Mediator centralizes complex communication logic between many objects into one mediator object. Objects (colleagues) interact via the mediator rather than directly, reducing dependencies from O(n²) to O(n).',
},
{
    id: 'dp-mediator-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-mediator',
    difficulty: 'intermediate' as const,
    question: 'Which scenario best illustrates the Mediator pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'An air traffic control tower that coordinates communication between aircraft so planes do not communicate directly with each other',
            'A document class that iterates over its paragraphs one by one',
            'A chain of security checkpoints that passes a passenger through until one clears them',
            'A UI button that notifies all registered click listeners when pressed',
        ],
        correctAnswer: 0,
    explanation: 'An air traffic control tower is the classic Mediator analogy. Planes (colleagues) report to the tower (mediator) rather than talking to every other plane, centralizing coordination and reducing coupling.',
},
{
    id: 'dp-mediator-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-mediator',
    difficulty: 'intermediate' as const,
    question: 'Which role does NOT belong in the Mediator pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'ConcreteMediator',
            'Colleague',
            'Mediator (interface)',
            'ConcreteHandler',
        ],
        correctAnswer: 3,
    explanation: 'Mediator participants are Mediator (interface), ConcreteMediator, and Colleague classes. ConcreteHandler belongs to the Chain of Responsibility pattern.',
},
{
    id: 'dp-mediator-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-mediator',
    difficulty: 'intermediate' as const,
    question: 'What distinguishes the Mediator pattern from the Observer pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Observer centralizes communication like a hub; Mediator is a one-to-many broadcast mechanism',
            'Mediator is used only for UI components; Observer is for any domain object',
            'Mediator centralizes two-way communication between many colleagues into one object; Observer defines a one-to-many notification where the subject does not know observers\' internals',
            'Both patterns are structurally identical — only naming differs',
        ],
        correctAnswer: 2,
    explanation: 'Mediator is a hub that knows and coordinates all colleagues (bidirectional awareness). Observer establishes a one-to-many notification chain where the subject broadcasts to loosely coupled, anonymous observers.',
},
{
    id: 'dp-mediator-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-mediator',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Mediator {
        <<interface>>
        +notify(sender: Colleague, event: string)
    }
    class ConcreteMediator {
        -colleague1: ConcreteColleague1
        -colleague2: ConcreteColleague2
        +notify(sender: Colleague, event: string)
    }
    class Colleague {
        <<abstract>>
        -mediator: Mediator
        +setMediator(Mediator)
    }
    class ConcreteColleague1 {
        +doAction()
    }
    class ConcreteColleague2 {
        +doAction()
    }
    Mediator <|.. ConcreteMediator
    Colleague <|-- ConcreteColleague1
    Colleague <|-- ConcreteColleague2
    ConcreteMediator --> ConcreteColleague1
    ConcreteMediator --> ConcreteColleague2
    Colleague --> Mediator`,
    options: [
            'Facade',
            'Command',
            'Observer',
            'Mediator',
        ],
        correctAnswer: 3,
    explanation: 'The diagram shows ConcreteMediator holding references to all colleague objects and colleagues holding a back-reference to the mediator via notify(). This hub-and-spoke coordination is the Mediator pattern.',
},
{
    id: 'dp-mediator-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-mediator',
    difficulty: 'advanced' as const,
    question: 'In this dialog box diagram, which element is missing for a proper Mediator implementation?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class DialogMediator {
        -okButton: Button
        -textField: TextField
        -checkbox: Checkbox
        +widgetChanged(widget: Widget)
    }
    class Widget {
        <<abstract>>
        +changed()
    }
    class Button {
        +click()
    }
    class TextField {
        +getText() string
    }
    class Checkbox {
        +isChecked() bool
    }
    Widget <|-- Button
    Widget <|-- TextField
    Widget <|-- Checkbox`,
    options: [
            'A list of all possible widget states stored statically on Widget',
            'Each Widget must hold a reference to DialogMediator and call mediator.widgetChanged(this) from changed(), so the mediator is notified of any widget event',
            'DialogMediator must inherit from Widget to receive events through the hierarchy',
            'A separate EventBus class that routes widget events to the mediator asynchronously',
        ],
        correctAnswer: 1,
    explanation: 'For Mediator to work, each Widget must hold a reference to the Mediator and call mediator.widgetChanged(this) when it changes. Without this back-reference, widgets cannot notify the mediator of their events.',
},

// Memento
{
    id: 'dp-memento-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-memento',
    difficulty: 'intermediate' as const,
    question: 'What is the primary intent of the Memento pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'To provide a surrogate object that controls access to the original',
            'To define a one-to-many dependency so objects are notified of state changes automatically',
            'To capture and externalize an object\'s internal state so it can be restored later, without violating encapsulation',
            'To represent an operation to be performed, allowing it to be queued and undone',
        ],
        correctAnswer: 2,
    explanation: 'Memento captures an object\'s internal state into a separate memento object. The originator\'s encapsulation is preserved because only the originator can read and write the memento\'s state.',
},
{
    id: 'dp-memento-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-memento',
    difficulty: 'intermediate' as const,
    question: 'Which scenario best fits the Memento pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A game where each possible enemy action is represented as a command object',
            'A game that applies different movement strategies depending on the character class',
            'A game that saves a checkpoint of the player\'s position, health, and inventory so the player can restore that exact game state later',
            'A game engine that notifies all UI panels when the player\'s score changes',
        ],
        correctAnswer: 2,
    explanation: 'Saving and restoring game state (position, health, inventory) is the canonical Memento use case — the game object (originator) creates a memento snapshot, and the caretaker (save system) holds it for later restoration.',
},
{
    id: 'dp-memento-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-memento',
    difficulty: 'intermediate' as const,
    question: 'Which of these is NOT a participant in the Memento pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Originator',
            'Invoker',
            'Memento',
            'Caretaker',
        ],
        correctAnswer: 1,
    explanation: 'Memento participants are Originator (creates and uses the memento), Memento (stores originator state), and Caretaker (stores the memento without inspecting it). Invoker belongs to the Command pattern.',
},
{
    id: 'dp-memento-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-memento',
    difficulty: 'intermediate' as const,
    question: 'What distinguishes the Memento pattern from the Command pattern when implementing undo?',
    questionType: 'multiple_choice' as const,
    options: [
            'Memento can only undo one step; Command supports multi-level undo',
            'Command stores snapshots of state; Memento executes reverse operations for undo',
            'Memento restores state by storing a snapshot of the object; Command restores state by executing a reverse operation',
            'Both patterns store the same information — the difference is only where the undo logic lives',
        ],
        correctAnswer: 2,
    explanation: 'Memento undo works by reverting to a saved state snapshot. Command undo works by executing an inverse action (e.g., delete undoes insert). Memento is simpler but may use more memory for large states.',
},
{
    id: 'dp-memento-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-memento',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Originator {
        -state: string
        +createMemento() Memento
        +restoreMemento(Memento)
        +setState(string)
        +getState() string
    }
    class Memento {
        -state: string
        +getState() string
    }
    class Caretaker {
        -history: List~Memento~
        +save(Memento)
        +undo() Memento
    }
    Originator --> Memento
    Caretaker o-- Memento`,
    options: [
            'Prototype',
            'State',
            'Memento',
            'Command',
        ],
        correctAnswer: 2,
    explanation: 'The diagram shows Originator creating Memento snapshots, and Caretaker storing a history of Mementos without accessing their internals. This is the definitive Memento structure.',
},
{
    id: 'dp-memento-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-memento',
    difficulty: 'advanced' as const,
    question: 'This diagram shows a Memento where the Caretaker can read the Memento\'s state directly. What design principle does this violate, and how should it be fixed?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Originator {
        -state: string
        +createMemento() Memento
        +restoreMemento(Memento)
    }
    class Memento {
        +state: string
        +setState(string)
        +getState() string
    }
    class Caretaker {
        -saved: Memento
        +readState() string
        +modifyState(string)
    }
    Originator --> Memento
    Caretaker --> Memento`,
    options: [
            'It violates the Dependency Inversion Principle because Caretaker depends on a concrete Memento class',
            'It violates the Open/Closed Principle because Caretaker directly extends Memento behavior',
            'It violates encapsulation — Memento\'s state should be private with access restricted to the Originator only, and Caretaker should treat Memento as an opaque token',
            'It violates the Single Responsibility Principle because Memento holds both state and behavior',
        ],
        correctAnswer: 2,
    explanation: 'The core rule of Memento is that only the Originator can access the Memento\'s internal state. The Caretaker must treat the Memento as an opaque object. Making Memento\'s state public breaks the encapsulation guarantee.',
},

// Observer
{
    id: 'dp-observer-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-observer',
    difficulty: 'beginner' as const,
    question: 'What problem does the Observer pattern solve?',
    questionType: 'multiple_choice' as const,
    options: [
            'It defines a one-to-many dependency so that when one object changes state, all its dependents are notified and updated automatically',
            'It allows an object to change behavior based on its internal state',
            'It provides a way to create families of related objects without specifying their concrete classes',
            'It encapsulates a request as an object so it can be queued, logged, or undone',
        ],
        correctAnswer: 0,
    explanation: 'Observer defines a one-to-many dependency: when the subject changes state, all registered observers are notified automatically. This enables loose coupling between the subject and its observers.',
},
{
    id: 'dp-observer-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-observer',
    difficulty: 'beginner' as const,
    question: 'Which scenario best fits the Observer pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A stock trading system that routes orders through compliance, risk, and execution handlers in sequence',
            'A stock price feed that automatically updates all portfolio dashboards, alert systems, and charts whenever a stock price changes',
            'A stock report generator that iterates through portfolio items one by one',
            'A stock order that encapsulates a buy/sell action for logging and undo support',
        ],
        correctAnswer: 1,
    explanation: 'A stock price feed updating multiple independent views (dashboards, alerts, charts) when the price changes is the classic Observer scenario — one subject, many loosely coupled observers.',
},
{
    id: 'dp-observer-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-observer',
    difficulty: 'intermediate' as const,
    question: 'Which of these is NOT a participant in the Observer pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Subject',
            'Observer (interface)',
            'ConcreteObserver',
            'Caretaker',
        ],
        correctAnswer: 3,
    explanation: 'Observer participants are Subject (or Publisher), Observer (interface), ConcreteSubject, and ConcreteObserver. Caretaker belongs to the Memento pattern.',
},
{
    id: 'dp-observer-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-observer',
    difficulty: 'intermediate' as const,
    question: 'What distinguishes the Observer pattern from the Mediator pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Mediator broadcasts to many anonymous listeners; Observer coordinates two specific objects',
            'Observer is a one-to-many broadcast where the subject does not control observer logic; Mediator is a hub that actively coordinates bidirectional communication between colleagues',
            'Observer and Mediator are interchangeable — the choice is purely stylistic',
            'Observer requires synchronous notification; Mediator always uses asynchronous messaging',
        ],
        correctAnswer: 1,
    explanation: 'In Observer, the subject simply notifies registered observers without knowing what they do. In Mediator, the mediator actively knows all colleagues and controls the logic of how they interact with each other.',
},
{
    id: 'dp-observer-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-observer',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Subject {
        -observers: List~Observer~
        +attach(Observer)
        +detach(Observer)
        +notify()
    }
    class Observer {
        <<interface>>
        +update()
    }
    class ConcreteObserver {
        -subject: Subject
        +update()
    }
    Subject --> Observer
    Observer <|.. ConcreteObserver`,
    options: [
            'State',
            'Mediator',
            'Observer',
            'Command',
        ],
        correctAnswer: 2,
    explanation: 'The diagram shows Subject maintaining a list of Observers with attach/detach/notify methods, and ConcreteObserver implementing the update() interface. This is the canonical Observer structure.',
},
{
    id: 'dp-observer-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-observer',
    difficulty: 'advanced' as const,
    question: 'This diagram shows a push-model Observer. What would need to change to implement a pull-model Observer instead?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Subject {
        -observers: List~Observer~
        -state: string
        +attach(Observer)
        +notify()
    }
    class Observer {
        <<interface>>
        +update(state: string)
    }
    class ConcreteObserver {
        +update(state: string)
    }
    Subject --> Observer
    Observer <|.. ConcreteObserver`,
    options: [
            'Remove the observers list from Subject and have ConcreteObserver poll Subject on a timer',
            'Make Subject extend ConcreteObserver so it can push and pull simultaneously',
            'Change update() to take no arguments; ConcreteObserver stores a reference to Subject and calls subject.getState() to pull the data it needs',
            'Add a second notify() method that sends partial state updates to specific observers',
        ],
        correctAnswer: 2,
    explanation: 'In a pull model, update() carries no data. The observer holds a reference to the Subject and explicitly calls getState() to retrieve only the data it cares about, giving observers more control over what they read.',
},

// State
{
    id: 'dp-state-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-state',
    difficulty: 'intermediate' as const,
    question: 'What is the intent of the State pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'To provide a way to access collection elements sequentially without exposing the underlying representation',
            'To encapsulate a request as an object that can be queued or undone',
            'To allow an object to alter its behavior when its internal state changes, appearing to change its class',
            'To define a skeleton of an algorithm in a base class and let subclasses fill in specific steps',
        ],
        correctAnswer: 2,
    explanation: 'The State pattern encapsulates state-dependent behavior into separate state classes. The context delegates behavior to the current state object, making the context appear to change its class as state transitions occur.',
},
{
    id: 'dp-state-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-state',
    difficulty: 'intermediate' as const,
    question: 'Which scenario best fits the State pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A vending machine that iterates through available products to display them on a screen',
            'A vending machine that behaves differently (accept money, dispense item, return change) depending on whether it is idle, has received money, or is out of stock',
            'A vending machine that notifies a restocking system whenever inventory drops to zero',
            'A vending machine that applies different pricing strategies during peak and off-peak hours',
        ],
        correctAnswer: 1,
    explanation: 'A vending machine with distinct behaviors per state (Idle, HasMoney, OutOfStock) is the classic State example. Each state encapsulates what actions are valid and how the machine responds to inputs in that state.',
},
{
    id: 'dp-state-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-state',
    difficulty: 'intermediate' as const,
    question: 'Which of these is NOT a participant in the State pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Context',
            'Aggregate',
            'State (interface)',
            'ConcreteState',
        ],
        correctAnswer: 1,
    explanation: 'State pattern participants are Context (maintains current state), State (interface defining state-specific behavior), and ConcreteState (implements behavior for a specific state). Aggregate belongs to the Iterator pattern.',
},
{
    id: 'dp-state-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-state',
    difficulty: 'intermediate' as const,
    question: 'What distinguishes the State pattern from the Strategy pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Strategy allows state transitions; State only selects among fixed algorithms with no transitions',
            'In State, transitions between states are typically driven by the states themselves or the context; in Strategy, the client or context selects an algorithm explicitly and algorithms don\'t drive transitions',
            'State and Strategy are structurally identical — intent is the only difference',
            'Strategy objects know about each other to coordinate; State objects are completely independent',
        ],
        correctAnswer: 1,
    explanation: 'State objects often trigger transitions to other states (state machine behavior). Strategy algorithms are simply swapped by the client/context to change computation, without any notion of transitioning between strategies.',
},
{
    id: 'dp-state-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-state',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Context {
        -state: State
        +setState(State)
        +request()
    }
    class State {
        <<interface>>
        +handle(context: Context)
    }
    class ConcreteStateA {
        +handle(context: Context)
    }
    class ConcreteStateB {
        +handle(context: Context)
    }
    Context --> State
    State <|.. ConcreteStateA
    State <|.. ConcreteStateB`,
    options: [
            'Observer',
            'Command',
            'State',
            'Strategy',
        ],
        correctAnswer: 2,
    explanation: 'The diagram shows Context holding a reference to a State interface, with ConcreteStateA and ConcreteStateB implementing state-specific handle() behavior. The context passing itself into handle() for possible transitions is the State pattern signature.',
},
{
    id: 'dp-state-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-state',
    difficulty: 'advanced' as const,
    question: 'Which diagram correctly models a traffic light with three states (Red, Yellow, Green) using the State pattern?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class TrafficLight {
        -currentState: LightState
        +setState(LightState)
        +change()
    }
    class LightState {
        <<interface>>
        +handle(light: TrafficLight)
        +getColor() string
    }
    class RedState {
        +handle(light: TrafficLight)
        +getColor() string
    }
    class YellowState {
        +handle(light: TrafficLight)
        +getColor() string
    }
    class GreenState {
        +handle(light: TrafficLight)
        +getColor() string
    }
    TrafficLight --> LightState
    LightState <|.. RedState
    LightState <|.. YellowState
    LightState <|.. GreenState`,
    options: [
            'The diagram shown, where each ConcreteState implements LightState and transitions are triggered via handle()',
            'A diagram where a single ColorState class holds an enum field and a switch statement',
            'A diagram where RedState, YellowState, and GreenState each extend TrafficLight directly',
            'A diagram where TrafficLight has three boolean fields (isRed, isYellow, isGreen) and switches with if-else logic',
        ],
        correctAnswer: 0,
    explanation: 'The correct State implementation has an interface (LightState), a ConcreteState per state (Red, Yellow, Green), and a Context (TrafficLight) that delegates to the current state. Each state\'s handle() transitions to the next state.',
},

// Strategy
{
    id: 'dp-strategy-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-strategy',
    difficulty: 'beginner' as const,
    question: 'What is the intent of the Strategy pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'To define a family of algorithms, encapsulate each one, and make them interchangeable so the algorithm varies independently from clients that use it',
            'To provide a way to access elements of an aggregate object sequentially',
            'To allow an object to change its behavior when its internal state changes',
            'To capture and externalize an object\'s state for later restoration',
        ],
        correctAnswer: 0,
    explanation: 'Strategy defines a family of interchangeable algorithms. Clients can switch algorithms at runtime without modifying the context class, following the Open/Closed Principle.',
},
{
    id: 'dp-strategy-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-strategy',
    difficulty: 'beginner' as const,
    question: 'Which scenario best fits the Strategy pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A navigation app that allows the user to undo the last rerouting decision',
            'A navigation app that notifies all open map views when the user\'s GPS location changes',
            'A navigation app that records each turn instruction as a command for voice replay',
            'A navigation app that can switch between fastest route, shortest route, and avoid-highways routing algorithms based on user preference',
        ],
        correctAnswer: 3,
    explanation: 'Swappable routing algorithms (fastest, shortest, avoid highways) are a textbook Strategy use case. Each algorithm is encapsulated in a ConcreteStrategy, and the navigator (context) delegates routing to whichever is selected.',
},
{
    id: 'dp-strategy-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-strategy',
    difficulty: 'intermediate' as const,
    question: 'Which of these is NOT a participant in the Strategy pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'ConcreteStrategy',
            'NonterminalExpression',
            'Context',
            'Strategy (interface)',
        ],
        correctAnswer: 1,
    explanation: 'Strategy participants are Strategy (interface), ConcreteStrategy (implements the algorithm), and Context (uses the strategy). NonterminalExpression belongs to the Interpreter pattern.',
},
{
    id: 'dp-strategy-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-strategy',
    difficulty: 'intermediate' as const,
    question: 'What distinguishes the Strategy pattern from the Template Method pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Strategy defines the full algorithm in a base class; Template Method provides no default behavior',
            'Both patterns use inheritance — Strategy simply has more abstract methods',
            'Strategy uses composition to swap whole algorithms at runtime; Template Method uses inheritance to let subclasses override specific steps of a fixed algorithm skeleton',
            'Template Method uses composition; Strategy uses inheritance to vary behavior',
        ],
        correctAnswer: 2,
    explanation: 'Strategy favors composition: the context holds a reference to a strategy object and can swap it at runtime. Template Method uses inheritance: a base class defines the algorithm skeleton with hook methods that subclasses override.',
},
{
    id: 'dp-strategy-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-strategy',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Context {
        -strategy: SortStrategy
        +setStrategy(SortStrategy)
        +executeSort(data: List~int~)
    }
    class SortStrategy {
        <<interface>>
        +sort(data: List~int~)
    }
    class BubbleSort {
        +sort(data: List~int~)
    }
    class QuickSort {
        +sort(data: List~int~)
    }
    class MergeSort {
        +sort(data: List~int~)
    }
    Context --> SortStrategy
    SortStrategy <|.. BubbleSort
    SortStrategy <|.. QuickSort
    SortStrategy <|.. MergeSort`,
    options: [
            'Strategy',
            'Command',
            'Template Method',
            'State',
        ],
        correctAnswer: 0,
    explanation: 'The diagram shows a Context holding a reference to a SortStrategy interface with multiple interchangeable ConcreteStrategy implementations (BubbleSort, QuickSort, MergeSort). This is the Strategy pattern.',
},
{
    id: 'dp-strategy-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-strategy',
    difficulty: 'advanced' as const,
    question: 'This diagram shows a payment system. Which element is missing to make it a proper Strategy implementation?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class PaymentStrategy {
        <<interface>>
        +pay(amount: float)
    }
    class CreditCardPayment {
        -cardNumber: string
        +pay(amount: float)
    }
    class PayPalPayment {
        -email: string
        +pay(amount: float)
    }
    PaymentStrategy <|.. CreditCardPayment
    PaymentStrategy <|.. PayPalPayment`,
    options: [
            'A PaymentFactory class with a static method that returns the correct strategy based on a string input',
            'A ShoppingCart (Context) class that holds a PaymentStrategy reference and delegates pay() to it, allowing the strategy to be set or changed at runtime',
            'A PaymentHistory class that logs each payment strategy used',
            'An abstract PaymentProcessor base class that CreditCardPayment and PayPalPayment extend instead of using an interface',
        ],
        correctAnswer: 1,
    explanation: 'Without a Context class (ShoppingCart) that holds and delegates to a PaymentStrategy, the pattern is incomplete. The context is what makes the strategy swappable at runtime and decouples the client from concrete payment implementations.',
},

// Template Method
{
    id: 'dp-template-method-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-template-method',
    difficulty: 'intermediate' as const,
    question: 'What is the intent of the Template Method pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'To encapsulate a family of algorithms and make them interchangeable via composition',
            'To provide a way to traverse a collection without exposing its representation',
            'To capture and restore an object\'s internal state without violating encapsulation',
            'To define the skeleton of an algorithm in a base class, deferring some steps to subclasses without changing the algorithm\'s structure',
        ],
        correctAnswer: 3,
    explanation: 'Template Method defines a fixed algorithm skeleton in a base class with placeholder (hook) methods. Subclasses override the hooks to supply specific behavior without changing the overall algorithm structure.',
},
{
    id: 'dp-template-method-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-template-method',
    difficulty: 'intermediate' as const,
    question: 'Which scenario best illustrates the Template Method pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A file reader that encapsulates each read operation as a command for retry support',
            'A data streaming service where all subscribers receive new records as they arrive',
            'A query builder where each SQL clause is an object that can be composed into a tree',
            'A data mining framework where the overall steps (open file, extract data, parse data, analyze, report) are fixed, but subclasses override extract and parse for CSV vs XML sources',
        ],
        correctAnswer: 3,
    explanation: 'A data mining framework with fixed steps but variable extraction/parsing logic per format (CSV, XML) is the canonical Template Method example. The base class controls the algorithm flow; subclasses fill in format-specific steps.',
},
{
    id: 'dp-template-method-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-template-method',
    difficulty: 'intermediate' as const,
    question: 'Which of these is NOT a participant in the Template Method pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Context',
            'ConcreteClass (with hook overrides)',
            'Hook methods',
            'AbstractClass (with template method)',
        ],
        correctAnswer: 0,
    explanation: 'Template Method participants are AbstractClass (defines the template method and hook methods) and ConcreteClass (overrides hook methods). "Context" is the role that holds a strategy in the Strategy pattern, not Template Method.',
},
{
    id: 'dp-template-method-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-template-method',
    difficulty: 'intermediate' as const,
    question: 'What distinguishes the Template Method pattern from the Strategy pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Template Method uses inheritance — the base class calls overridden hooks in subclasses; Strategy uses composition — the context delegates to a replaceable strategy object',
            'They are equivalent patterns — Template Method is simply the compile-time version of Strategy',
            'Template Method allows the algorithm to be replaced entirely at runtime; Strategy locks the skeleton in place',
            'Strategy uses inheritance; Template Method uses composition via a pluggable object',
        ],
        correctAnswer: 0,
    explanation: 'Template Method relies on inheritance (subclass overrides), locking the algorithm skeleton in the parent. Strategy relies on composition (context references a strategy), allowing the algorithm to be swapped at runtime.',
},
{
    id: 'dp-template-method-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-template-method',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class DataProcessor {
        <<abstract>>
        +process()
        +readData()
        +analyzeData()*
        +writeReport()
    }
    class CSVProcessor {
        +analyzeData()
    }
    class JSONProcessor {
        +analyzeData()
    }
    DataProcessor <|-- CSVProcessor
    DataProcessor <|-- JSONProcessor`,
    options: [
            'Factory Method',
            'Template Method',
            'Strategy',
            'Decorator',
        ],
        correctAnswer: 1,
    explanation: 'The diagram shows an abstract base class with a concrete process() template method and an abstract hook analyzeData() that subclasses (CSVProcessor, JSONProcessor) override. This is the Template Method pattern.',
},
{
    id: 'dp-template-method-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-template-method',
    difficulty: 'advanced' as const,
    question: 'This diagram shows a beverage preparation Template Method. What is the role of the hook method canAddCondiments()?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Beverage {
        <<abstract>>
        +prepare()
        +boilWater()
        +brew()*
        +pourInCup()
        +addCondiments()*
        +canAddCondiments() bool
    }
    class Tea {
        +brew()
        +addCondiments()
        +canAddCondiments() bool
    }
    class Coffee {
        +brew()
        +addCondiments()
    }
    Beverage <|-- Tea
    Beverage <|-- Coffee`,
    options: [
            'It is an optional hook that the template method calls to decide whether to invoke addCondiments(); subclasses can override it to conditionally skip that step',
            'It is a factory method that creates the correct condiment object for each beverage',
            'It is a utility method that has no effect on the algorithm flow and is for informational use only',
            'It is an abstract method that all subclasses must implement to validate condiment types',
        ],
        correctAnswer: 0,
    explanation: 'canAddCondiments() is a hook method. The template method (prepare()) calls it and only calls addCondiments() if it returns true. Tea overrides it to return false when the user does not want condiments; Coffee uses the default (true).',
},

// Visitor
{
    id: 'dp-visitor-1',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-visitor',
    difficulty: 'intermediate' as const,
    question: 'What is the intent of the Visitor pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'To represent an operation to be performed on elements of an object structure, letting you define new operations without changing the classes of the elements',
            'To traverse a collection without exposing its internal structure',
            'To define a grammar for a language and interpret sentences in that language',
            'To allow an object to alter its behavior when its internal state changes',
        ],
        correctAnswer: 0,
    explanation: 'Visitor separates an algorithm from the object structure it operates on. New operations can be added by creating new Visitor classes without modifying the element classes — following the Open/Closed Principle.',
},
{
    id: 'dp-visitor-2',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-visitor',
    difficulty: 'intermediate' as const,
    question: 'Which scenario best fits the Visitor pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'A compiler that notifies all registered plugins whenever a new source file is parsed',
            'A compiler that saves and restores parse state to support incremental compilation',
            'A compiler that chains syntax, semantic, and optimization phases, each passing errors to the next',
            'A compiler that needs to perform type checking, code generation, and optimization as separate passes over a fixed AST node hierarchy without modifying the node classes',
        ],
        correctAnswer: 3,
    explanation: 'Multiple compiler passes (type check, codegen, optimize) over a stable AST hierarchy is the canonical Visitor use case. Each pass is a Visitor — new passes can be added without changing AST node classes.',
},
{
    id: 'dp-visitor-3',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-visitor',
    difficulty: 'intermediate' as const,
    question: 'Which of these is NOT a participant in the Visitor pattern?',
    questionType: 'multiple_choice' as const,
    options: [
            'Visitor (interface)',
            'ConcreteVisitor',
            'Caretaker',
            'Element (with accept method)',
        ],
        correctAnswer: 2,
    explanation: 'Visitor participants are Visitor (interface with visit methods), ConcreteVisitor (implements operations), Element (defines accept()), ConcreteElement (implements accept()), and ObjectStructure. Caretaker belongs to the Memento pattern.',
},
{
    id: 'dp-visitor-4',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-visitor',
    difficulty: 'advanced' as const,
    question: 'What distinguishes the Visitor pattern from the Iterator pattern when processing a collection?',
    questionType: 'multiple_choice' as const,
    options: [
            'They are equivalent — both traverse and operate on elements, differing only in naming',
            'Visitor provides traversal access; Iterator encapsulates operations per element type using double dispatch',
            'Iterator provides traversal access and the client defines the operation; Visitor encapsulates the operation itself in a visitor object and uses double dispatch to apply the right operation per element type',
            'Iterator supports heterogeneous element types; Visitor only works with homogeneous collections',
        ],
        correctAnswer: 2,
    explanation: 'Iterator abstracts traversal but the client writes the per-element logic. Visitor encapsulates the operation in the visitor object and uses double dispatch (accept/visit) so the correct visitXxx() overload is called per concrete element type.',
},
{
    id: 'dp-visitor-5',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-visitor',
    difficulty: 'intermediate' as const,
    question: 'Which design pattern does this UML diagram represent?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Visitor {
        <<interface>>
        +visitCircle(Circle)
        +visitRectangle(Rectangle)
    }
    class AreaCalculator {
        +visitCircle(Circle)
        +visitRectangle(Rectangle)
    }
    class Shape {
        <<interface>>
        +accept(Visitor)
    }
    class Circle {
        -radius: float
        +accept(Visitor)
    }
    class Rectangle {
        -width: float
        -height: float
        +accept(Visitor)
    }
    Visitor <|.. AreaCalculator
    Shape <|.. Circle
    Shape <|.. Rectangle
    Circle --> Visitor
    Rectangle --> Visitor`,
    options: [
            'Iterator',
            'Interpreter',
            'Visitor',
            'Strategy',
        ],
        correctAnswer: 2,
    explanation: 'The diagram shows Visitor with visitCircle/visitRectangle methods, and Shape elements with accept(Visitor). AreaCalculator is a ConcreteVisitor. The accept/visit double-dispatch mechanism is the Visitor pattern.',
},
{
    id: 'dp-visitor-6',
    topic: 'behavioral-patterns',
    moduleId: 'pattern-visitor',
    difficulty: 'advanced' as const,
    question: 'This partial Visitor diagram is missing the double-dispatch mechanism. What must be added to Circle\'s accept() method to complete the pattern?',
    questionType: 'uml' as const,
    diagramSource: `classDiagram
    class Visitor {
        <<interface>>
        +visitCircle(c: Circle)
        +visitSquare(s: Square)
    }
    class Shape {
        <<interface>>
        +accept(v: Visitor)
    }
    class Circle {
        -radius: float
        +accept(v: Visitor)
    }
    class Square {
        -side: float
        +accept(v: Visitor)
    }
    Shape <|.. Circle
    Shape <|.. Square
    Visitor <|.. ConcreteVisitor`,
    options: [
            'Circle.accept(v) must call v.visitCircle(this), so the visitor\'s type-specific method is invoked with the concrete element as the argument',
            'Circle.accept(v) must iterate over all visitor methods and call the one matching its class name via reflection',
            'Circle.accept(v) must call super.accept(v) to delegate to the Shape interface',
            'Circle.accept(v) must call v.accept(this) to allow the visitor to dispatch back to itself',
        ],
        correctAnswer: 0,
    explanation: 'Double dispatch works because accept() is called on the concrete element (first dispatch), and inside accept() the element calls v.visitCircle(this) (second dispatch), routing to the type-correct visitor method with the concrete element available.',
},
];

export function getDesignPatternQuestionsByModule(moduleId: string): DesignPatternQuestion[] {
    return designPatternQuestions.filter(q => q.moduleId === moduleId);
}
