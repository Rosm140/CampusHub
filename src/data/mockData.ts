export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'STUDENT' | 'FACULTY' | 'CLUB_COORDINATOR' | 'ADMINISTRATOR';
  department: string;
  course: string;
  academicYear: string;
  studentId: string;
  avatarText: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Seminar' | 'Hackathon';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  capacity: number;
  registeredCount: number;
  eligibility: string;
  isRegistered: boolean;
  status: 'UPCOMING' | 'ONGOING' | 'PAST';
}

export interface StudentClub {
  id: string;
  name: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Academic' | 'Media & Arts';
  description: string;
  lead: string;
  advisor: string;
  memberCount: number;
  membershipStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Urgent' | 'Examination' | 'Placement' | 'Academic' | 'Events';
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  author: string;
  date: string;
  isRead: boolean;
}

export interface AcademicDoc {
  id: string;
  title: string;
  subject: string;
  department: string;
  semester: string;
  type: 'Notes' | 'Question Papers' | 'Syllabus' | 'Lab Manuals';
  author: string;
  fileSize: string;
  isBookmarked: boolean;
}

export interface CommunityFeedPost {
  id: string;
  authorName: string;
  authorRole: string;
  timeAgo: string;
  category: 'Campus Life' | 'Academic Help' | 'Projects' | 'Achievements' | 'Opportunities';
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export interface InAppAlert {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'EVENT' | 'CLUB' | 'NOTICE' | 'ADMIN';
  isRead: boolean;
}

export const INITIAL_USERS: Record<string, UserProfile> = {
  STUDENT: {
    uid: 'usr_student_01',
    email: 'alex.harrison@campus.edu',
    displayName: 'Alex Harrison',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    course: 'B.Tech in Artificial Intelligence',
    academicYear: '3rd Year (Sem 5)',
    studentId: 'CS23-0491',
    avatarText: 'AH'
  },
  FACULTY: {
    uid: 'usr_faculty_02',
    email: 'dr.desai@campus.edu',
    displayName: 'Dr. Anita Desai',
    role: 'FACULTY',
    department: 'Computer Science & Engineering',
    course: 'Professor & Head of Research',
    academicYear: 'Faculty ID: FAC-882',
    studentId: 'FAC-882',
    avatarText: 'AD'
  },
  CLUB_COORDINATOR: {
    uid: 'usr_coord_03',
    email: 'rohan.verma@campus.edu',
    displayName: 'Rohan Verma',
    role: 'CLUB_COORDINATOR',
    department: 'Information Technology',
    course: 'Lead • Google Developer Student Club',
    academicYear: '4th Year (Sem 7)',
    studentId: 'IT22-0112',
    avatarText: 'RV'
  },
  ADMINISTRATOR: {
    uid: 'usr_admin_04',
    email: 'dean.admin@campus.edu',
    displayName: 'Prof. Marcus Vance',
    role: 'ADMINISTRATOR',
    department: 'Office of Campus Administration',
    course: 'Chief Dean of Student Affairs',
    academicYear: 'Admin Staff',
    studentId: 'ADM-001',
    avatarText: 'MV'
  }
};

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'ev_1',
    title: 'CodeSpark National Hackathon 2026',
    description: '36-hour non-stop hackathon with problem statements from top tech companies. $10,000 in prizes, free food, and mentorship.',
    category: 'Hackathon',
    date: 'Nov 14 - Nov 15, 2026',
    time: '09:00 AM onwards',
    venue: 'Computing Innovation Center & Virtual',
    organizer: 'GDSC & CS Department',
    capacity: 120,
    registeredCount: 86,
    eligibility: 'All Undergraduate Students',
    isRegistered: false,
    status: 'UPCOMING'
  },
  {
    id: 'ev_2',
    title: 'Autonomous Robotics & ROS2 Workshop',
    description: 'Hands-on hardware lab constructing 4-wheel steering rovers with LiDAR mapping and autonomous obstacle avoidance.',
    category: 'Workshop',
    date: 'Nov 20, 2026',
    time: '10:00 AM - 04:30 PM',
    venue: 'Mechatronics Lab 3',
    organizer: 'Campus Robotics Club',
    capacity: 40,
    registeredCount: 38,
    eligibility: 'Engineering 2nd to 4th Year',
    isRegistered: false,
    status: 'UPCOMING'
  },
  {
    id: 'ev_3',
    title: 'AURA 2026: Annual Inter-College Cultural Fest',
    description: 'The biggest festival of the year! Battle of bands, street theatre, choreography competitions, EDM night, and food festival.',
    category: 'Cultural',
    date: 'Dec 01 - Dec 03, 2026',
    time: '04:00 PM - 10:00 PM',
    venue: 'Grand Amphitheatre & Main Quad',
    organizer: 'Student Cultural Council',
    capacity: 1500,
    registeredCount: 840,
    eligibility: 'Open to All Students and Faculty',
    isRegistered: true,
    status: 'UPCOMING'
  },
  {
    id: 'ev_4',
    title: 'AI in Healthcare & Medicine Seminar',
    description: 'Keynote lecture by Dr. S. Nair on transforming diagnostic radiology with vision-language multimodal models.',
    category: 'Seminar',
    date: 'Nov 26, 2026',
    time: '02:00 PM - 04:00 PM',
    venue: 'Senate Hall, Block B',
    organizer: 'Bio-Medical Research Wing',
    capacity: 80,
    registeredCount: 45,
    eligibility: 'All Departments',
    isRegistered: false,
    status: 'UPCOMING'
  }
];

export const INITIAL_CLUBS: StudentClub[] = [
  {
    id: 'club_1',
    name: 'Google Developer Student Club',
    category: 'Technical',
    description: 'Peer-to-peer learning community for mobile, cloud, machine learning, and web development with Google technologies.',
    lead: 'Rohan Verma (Lead)',
    advisor: 'Dr. Anita Desai',
    memberCount: 340,
    membershipStatus: 'APPROVED'
  },
  {
    id: 'club_2',
    name: 'Literary & Debating Society (DebSoc)',
    category: 'Cultural',
    description: 'Fosters rhetorical discourse, Model United Nations, parliamentary debate, and public speaking mastery.',
    lead: 'Priya Sen (President)',
    advisor: 'Prof. Robert Smith',
    memberCount: 185,
    membershipStatus: 'NONE'
  },
  {
    id: 'club_3',
    name: 'Autonomous Robotics & Drone Wing',
    category: 'Technical',
    description: 'Designing drone payloads, underwater rovers, and competing in national robotics challenges.',
    lead: 'Dev Patel (Head)',
    advisor: 'Dr. K. Narayanan',
    memberCount: 210,
    membershipStatus: 'PENDING'
  },
  {
    id: 'club_4',
    name: 'Campus E-Cell (Entrepreneurship Hub)',
    category: 'Academic',
    description: 'Incubating student startups, venture capital pitch days, founder talks, and investor networking.',
    lead: 'Tarun Mehra (Founder)',
    advisor: 'Prof. David Chang',
    memberCount: 160,
    membershipStatus: 'NONE'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not_1',
    title: 'URGENT: Revised End-Semester Examination Schedule',
    content: 'All students must note that the examinations scheduled on Dec 02 are rescheduled to Dec 09. Please check individual timetables.',
    category: 'Examination',
    priority: 'URGENT',
    author: 'Controller of Examinations',
    date: 'Today, 10:30 AM',
    isRead: false
  },
  {
    id: 'not_2',
    title: 'Google & Microsoft Campus Recruitment Drive 2026',
    content: 'Registration portal opens today for final year eligible candidates (Min CGPA 7.5). Pre-placement talk this Saturday at 11:00 AM.',
    category: 'Placement',
    priority: 'HIGH',
    author: 'Placement & Career Cell',
    date: 'Yesterday, 04:15 PM',
    isRead: false
  },
  {
    id: 'not_3',
    title: 'Central Library Extended Hours for Finals Week',
    content: 'The Central Library reading hall will remain open 24/7 starting Nov 10 through the end of examination season.',
    category: 'Academic',
    priority: 'NORMAL',
    author: 'Head Librarian',
    date: 'Oct 25, 2026',
    isRead: true
  }
];

export const INITIAL_RESOURCES: AcademicDoc[] = [
  {
    id: 'res_1',
    title: 'CS301: Algorithms & Complexity Complete Lecture Notes',
    subject: 'Data Structures & Algorithms',
    department: 'Computer Science',
    semester: 'Semester 5',
    type: 'Notes',
    author: 'Prof. D. Knuth (Faculty Verified)',
    fileSize: '4.2 MB PDF',
    isBookmarked: true
  },
  {
    id: 'res_2',
    title: 'Last 5 Years Solved Midterm & Final Question Papers (2020-2025)',
    subject: 'Engineering Mathematics III',
    department: 'All Engineering',
    semester: 'Semester 3',
    type: 'Question Papers',
    author: 'Academic Council Archive',
    fileSize: '14.8 MB PDF',
    isBookmarked: false
  },
  {
    id: 'res_3',
    title: 'Distributed Systems & Microservices Lab Manual with Code',
    subject: 'Distributed Systems',
    department: 'Computer Science / IT',
    semester: 'Semester 6',
    type: 'Lab Manuals',
    author: 'Dr. Anita Desai',
    fileSize: '6.5 MB ZIP',
    isBookmarked: true
  },
  {
    id: 'res_4',
    title: 'Complete Course Syllabus & Grading Rubric 2026',
    subject: 'Artificial Intelligence & Neural Nets',
    department: 'AI & Data Science',
    semester: 'Semester 5',
    type: 'Syllabus',
    author: 'Curriculum Board',
    fileSize: '1.2 MB PDF',
    isBookmarked: false
  }
];

export const INITIAL_POSTS: CommunityFeedPost[] = [
  {
    id: 'post_1',
    authorName: 'Samantha Hayes',
    authorRole: 'Student (3rd Year CSE)',
    timeAgo: '2h ago',
    category: 'Projects',
    content: 'Hey everyone! We are putting together an autonomous solar drone team for the Smart India Hackathon. We are looking for an Embedded Systems/IoT specialist. Drop a comment if interested!',
    likes: 24,
    comments: 8,
    isLiked: false
  },
  {
    id: 'post_2',
    authorName: 'Dr. Anita Desai',
    authorRole: 'Faculty Advisor',
    timeAgo: '5h ago',
    category: 'Academic Help',
    content: 'Reminder for CS304: Distributed Systems assignment 2 is due this Friday by 11:59 PM. Office hours tomorrow from 3 to 5 PM in Room 412.',
    likes: 42,
    comments: 12,
    isLiked: true
  },
  {
    id: 'post_3',
    authorName: 'Kabir Mehta',
    authorRole: 'Student (4th Year ECE)',
    timeAgo: '1d ago',
    category: 'Achievements',
    content: 'Super proud to share that our team won 1st Runner-up at the IEEE Robotics Summit 2026 with our assistive robotic arm prototype! Big thanks to our faculty mentors!',
    likes: 89,
    comments: 19,
    isLiked: true
  }
];

export const INITIAL_ALERTS: InAppAlert[] = [
  {
    id: 'alert_1',
    title: 'Event RSVP Confirmed',
    message: 'Your registration for AURA 2026 is confirmed. Ticket #AURA-9921 is now in your profile.',
    timeAgo: '15m ago',
    type: 'EVENT',
    isRead: false
  },
  {
    id: 'alert_2',
    title: 'Club Membership Approved',
    message: 'Google Developer Student Club (GDSC) has accepted your membership request!',
    timeAgo: '1h ago',
    type: 'CLUB',
    isRead: false
  },
  {
    id: 'alert_3',
    title: 'New Urgent Announcement',
    message: 'Office of Controller of Exams posted: Revised Mid-Term Exam Schedule.',
    timeAgo: '3h ago',
    type: 'NOTICE',
    isRead: false
  }
];
