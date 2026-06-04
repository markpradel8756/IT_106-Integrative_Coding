// ============================================
// IT 106 – Integrative Coding Module
// Laboratory Activity 3: Student Notification System
// Demonstrates: Interface, Abstract Class, Inheritance,
// Factory Method Pattern, Observer Pattern
// ============================================

// ---------- 1. INTERFACE (NotificationSender) ----------
interface NotificationSender {
    send(recipient: string, message: string): void;
}

// ---------- Concrete implementations of the interface ----------
class EmailSender implements NotificationSender {
    send(recipient: string, message: string): void {
        console.log(`📧 Email sent to ${recipient}: ${message}`);
    }
}

class SmsSender implements NotificationSender {
    send(recipient: string, message: string): void {
        console.log(`📱 SMS sent to ${recipient}: ${message}`);
    }
}

// ---------- 2. FACTORY METHOD PATTERN ----------
class NotificationFactory {
    static createSender(type: string): NotificationSender {
        switch (type.toLowerCase()) {
            case 'email': return new EmailSender();
            case 'sms':   return new SmsSender();
            default: throw new Error(`Unsupported sender type: ${type}`);
        }
    }
}

// ---------- 3. OBSERVER PATTERN ----------
interface Observer {
    update(message: string): void;
}

class AnnouncementBroadcaster {
    private observers: Observer[] = [];

    subscribe(observer: Observer): void {
        this.observers.push(observer);
        console.log(`[Broadcaster] New subscriber added. Total: ${this.observers.length}`);
    }

    unsubscribe(observer: Observer): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(message: string): void {
        console.log(`\n[Broadcaster] Sending announcement to ${this.observers.length} subscribers...`);
        this.observers.forEach(observer => observer.update(message));
    }
}

// Concrete Observer: Student
class StudentObserver implements Observer {
    constructor(private name: string, private email: string) {}

    update(message: string): void {
        console.log(`📢 ${this.name} (${this.email}) received: ${message}`);
    }
}

// ---------- 4. ABSTRACT CLASS ----------
abstract class Announcement {
    constructor(protected title: string, protected postedBy: string) {}

    // Concrete method (reused by all child classes)
    displayHeader(): void {
        console.log(`\n===== ANNOUNCEMENT: ${this.title} =====`);
        console.log(`Posted by: ${this.postedBy}`);
    }

    // Abstract method – must be implemented by subclasses
    abstract getContent(): string;

    // Template method returning the full message
    getFullMessage(): string {
        return `${this.title}\n${this.getContent()}`;
    }
}

// ---------- 5. INHERITANCE (extends abstract class) ----------
class ImportantExamAnnouncement extends Announcement {
    constructor(
        title: string,
        postedBy: string,
        private examDate: string,
        private notes: string
    ) {
        super(title, postedBy);
    }

    // Implementation of the abstract method
    getContent(): string {
        return `📅 Exam Date: ${this.examDate}\n📝 Notes: ${this.notes}\nPlease prepare accordingly.`;
    }

    // Getter for exam date (used later in demo)
    getExamDate(): string {
        return this.examDate;
    }
}

// ---------- DEMONSTRATION ----------
function runDemo(): void {
    console.log("=== Student Notification System Demo ===\n");

    // ---- Factory Method Pattern demonstration ----
    console.log("--- Factory Method Pattern ---");
    const emailSender = NotificationFactory.createSender("email");
    const smsSender = NotificationFactory.createSender("sms");

    emailSender.send("student@university.com", "Welcome to the new semester!");
    smsSender.send("+1234567890", "Your class schedule is updated.");
    console.log();

    // ---- Abstract Class + Inheritance demonstration ----
    console.log("--- Abstract Class & Inheritance ---");
    const examAnnounce = new ImportantExamAnnouncement(
        "Final Exam Schedule",
        "Registrar's Office",
        "December 15, 2026",
        "Bring your ID and calculator."
    );
    examAnnounce.displayHeader();
    console.log("Content:", examAnnounce.getContent());
    console.log("Full Message:", examAnnounce.getFullMessage());
    console.log();

    // ---- Observer Pattern demonstration ----
    console.log("--- Observer Pattern ---");
    const broadcaster = new AnnouncementBroadcaster();

    const alice = new StudentObserver("Alice", "alice@student.edu");
    const bob = new StudentObserver("Bob", "bob@student.edu");
    const carol = new StudentObserver("Carol", "carol@student.edu");

    broadcaster.subscribe(alice);
    broadcaster.subscribe(bob);
    broadcaster.subscribe(carol);

    const announcementMessage = examAnnounce.getFullMessage();
    broadcaster.notify(announcementMessage);
    console.log();

    // ---- Combined: Factory Method used to send personalized notifications ----
    console.log("--- Combined: Factory Method for Personalized Notifications ---");
    const studentContacts = [
        { name: "Alice", contact: "alice@student.edu", type: "email", msgSuffix: "Study hard!" },
        { name: "Bob",   contact: "+1234567890",      type: "sms",    msgSuffix: "Good luck!" }
    ];

    studentContacts.forEach(student => {
        const sender = NotificationFactory.createSender(student.type);
        const message = `Reminder: ${examAnnounce.getExamDate()} – ${student.msgSuffix}`;
        sender.send(student.contact, message);
    });

    console.log("\n=== Demo Completed Successfully ===");
    console.log("✅ Requirements met:");
    console.log("   • Interface (NotificationSender, Observer)");
    console.log("   • Abstract class (Announcement)");
    console.log("   • Inheritance (ImportantExamAnnouncement extends Announcement)");
    console.log("   • Factory Method Pattern (NotificationFactory)");
    console.log("   • Observer Pattern (AnnouncementBroadcaster + StudentObserver)");
}

runDemo();