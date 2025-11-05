// src/types.ts

// ====================================================================
//  1. CORE USER AND AUTHENTICATION TYPES (MATCHING DJANGO BACKEND)
// ====================================================================

/**
 * Matches the UserRole TextChoices in Django (models.py)
 */
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER', // 'Faculty' renamed to 'TEACHER'
  ADMIN = 'ADMIN',
}

/**
 * Matches the MembershipStatus TextChoices in Django (models.py)
 */
export enum MembershipStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * Reflects the ParasTransactionSerializer output.
 */
export interface ParasTransaction {
  amount: number;
  transaction_type: string; // e.g., 'earning', 'spending'
  timestamp: string; // DRF returns DateTimeField as a string
  reason?: string;
}

/**
 * CRITICAL REFACTOR: Reflects the exact output of the Django UserSerializer.
 */
export interface User {
  // Core fields from AbstractUser and Custom Fields
  uid: string; // Mapped from 'pk' in the serializer
  email: string;
  first_name: string;
  last_name: string;
  displayName: string; // Mapped from @property
  photoURL?: string;
  bio?: string; // Mapped from 'designation' or 'staffId' in your old model
  
  // Custom Role and Status Fields
  role: UserRole;
  membershipStatus: MembershipStatus;
  
  // Custom Information Fields (replacing rollNo, department, etc.)
  institute?: string;
  course?: string; // Replaces fields like batchYear
  
  // Monetary Fields
  parasStones: number;
  coins: number;
  
  // Read-only metadata
  createdAt: string; // DRF date_joined is a string (ISO 8601 format)
  is_staff: boolean;
  is_superuser: boolean;

  // Nested relation
  parasHistory: ParasTransaction[];
}

/**
 * Fields required for registration (UserSerializer.create)
 */
export interface RegistrationData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  // NOTE: photoURL/photoFile upload must be handled separately/by another field
  
  // Optional custom fields
  institute?: string;
  course?: string;
  bio?: string;
}

// ====================================================================
//  2. CONTENT TYPES (Refined to match Blog/Event/Resource Serializers)
// ====================================================================

/**
 * Reflects AuthorPublicSerializer output.
 */
export interface Author {
    uid: string;
    displayName: string;
    photoURL?: string;
    institute?: string;
    bio?: string;
}

export enum BlogCategory {
    PHYSICS = 'Physics',
    CHEMISTRY = 'Chemistry',
    BIOLOGY = 'Biology',
    MATHS = 'Mathematics',
    EARTH = 'Earth Sciences',
    CS = 'Computer Science',
    INTERDISC = 'Interdisciplinary',
    DATASCI = 'Data Science',
    OTHER = 'Other',
}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    author: Author; // Nested object
    category: BlogCategory;
    tags: string[]; // JSONField returns array of strings
    excerpt: string;
    content: string;
    coverImage: string;
    publishedAt: string; // DateTimeField
    readTime: number;
    views: number;
    likes: number;
    featured: boolean;
    is_premuim: boolean;
}

// Thread/Forum Types

export enum ThreadColor {
    INDIGO = '#6366F1',
    EMERALD = '#10B981',
    ROSE = '#F43F5E',
    AMBER = '#F59E0B',
    SKY = '#0EA5E9',
    SLATE = '#64748B',
}

export interface Thread {
    id: number;
    title: string;
    content: string;
    user: Author;
    created_at: string; // DateTimeField
    parent_thread: number | null; // ID of the parent thread
    color: ThreadColor;
    reply_count: number;
}

export interface ThreadDetail extends Thread {
    replies: Thread[]; // Nested array of Thread objects
}


// Event Types

export enum EventType {
    TALK = 'talk',
    WORKSHOP = 'workshop',
    PROJECT = 'project',
    DISCUSSION = 'discussion',
    SEMINAR = 'seminar',
    OTHER = 'other',
}

export enum EventMode {
    ONLINE = 'online',
    OFFLINE = 'offline',
    HYBRID = 'hybrid',
}

/**
 * Reflects the EventSpeakerSerializer custom output.
 */
export interface EventSpeaker {
    name: string;
    designation: string; // Mapped from 'bio'
    institute?: string;
    avatar?: string; // Mapped from 'photoURL'
}

export interface Event {
    id: number;
    title: string;
    type: EventType;
    slug: string;
    date: string; // DateField
    time: string; // CharField (e.g., '10:00 AM - 12:00 PM')
    venue: string;
    image: string;
    thumbnail?: string;
    mode?: EventMode;
    tags?: string[];
    speaker: EventSpeaker;
    description: string;
    registrationLink?: string;
    maxParticipants?: number;
    currentParticipants: number;
    isPast: boolean;
}

// Resource Types

export enum ResourceCategory {
    VIDEO = 'video',
    ARTICLE = 'article',
    SLIDES = 'slides',
    NOTES = 'notes',
    PAPER = 'paper',
}

export interface Resource {
    id: number;
    title: string;
    category: ResourceCategory;
    description: string;
    link: string;
    date: string; // DateField
    author: string; // CharField
    thumbnail?: string;
    downloads: number;
}

// ====================================================================
//  3. EXISTING UNUSED TYPES (Kept for continuity, but review needed)
// ====================================================================
// NOTE: These types do not currently map to a Django model you provided.
// They are kept below but should be reviewed for backend implementation.

export enum ComplaintCategory {
  Academic = 'Academic Issue',
  Hostel = 'Hostel Issue',
  Mess = 'Mess Issue',
}

export enum ComplaintStatus {
  Pending = 'Pending',
  UnderReview = 'Under Review',
  Resolved = 'Resolved',
}

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  isAnonymous: boolean;
  rollNo?: string;
  status: ComplaintStatus;
  createdAt: Date;
}

export enum AnnouncementCategory {
  Academic = 'Academic',
  Hostel = 'Hostel',
  Mess = 'Mess',
  Events = 'Events',
  General = 'General',
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  // This author field is now problematic, as UserRole is not an author. 
  // Should probably be 'authorId: string' or 'author: Author'
  author: string; 
  createdAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: UserRole;
  isOpen: boolean;
}