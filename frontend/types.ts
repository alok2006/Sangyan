// src/types.ts
export enum UserRole {
  Student = 'Student',
  Faculty = 'Faculty',
  Staff = 'Staff',
  CR = 'Class Representative',
  MR = 'Mess Representative',
  Admin = 'Admin'
}

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Date;
  isApproved: boolean;
  
  // Student specific fields
  rollNo?: string;
  batchYear?: string;
  group?: number;
  
  // Faculty specific fields
  department?: string;
  designation?: string;
  employeeId?: string;
  
  // Staff specific fields
  staffId?: string;
  division?: string;
  
  // Additional roles for students (CR, MR can be assigned later)
  additionalRoles?: UserRole[];
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  photoFile?: File;
  
  // Role-specific fields
  rollNo?: string;
  batchYear?: string;
  department?: string;
  designation?: string;
  employeeId?: string;
  staffId?: string;
  division?: string;
}

// Keep your existing interfaces
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
  author: UserRole.CR | UserRole.MR;
  createdAt: Date;
}

export enum ResourceCategory {
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Math = 'Math',
  Biology = 'Biology',
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  link: string;
  fileType: 'PDF' | 'DOCX' | 'PPT' | 'LINK';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
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
