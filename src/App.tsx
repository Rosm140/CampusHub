import React, { useState } from 'react';
import {
  Home,
  Calendar,
  Users,
  MessageSquare,
  User as UserIcon,
  Bell,
  Search,
  BookOpen,
  Megaphone,
  ShieldCheck,
  Check,
  ChevronRight,
  Download,
  Code2,
  Smartphone,
  ExternalLink,
  Plus,
  Heart,
  Share2,
  Bookmark,
  FileText,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Copy,
  Sparkles,
  Settings,
  ArrowLeft,
  X
} from 'lucide-react';
import JSZip from 'jszip';
import {
  UserProfile,
  CampusEvent,
  StudentClub,
  Notice,
  AcademicDoc,
  CommunityFeedPost,
  InAppAlert,
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_CLUBS,
  INITIAL_NOTICES,
  INITIAL_RESOURCES,
  INITIAL_POSTS,
  INITIAL_ALERTS
} from './data/mockData';
import { ANDROID_FILES, AndroidFileRecord } from './data/androidProjectFiles';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'home' | 'events' | 'clubs' | 'community' | 'profile'>('home');
  const [subScreen, setSubScreen] = useState<'none' | 'announcements' | 'resources' | 'notifications' | 'admin'>('none');
  const [viewMode, setViewMode] = useState<'simulator' | 'codebase' | 'firebase_guide'>('simulator');

  // Role & User State
  const [currentRoleKey, setCurrentRoleKey] = useState<keyof typeof INITIAL_USERS>('STUDENT');
  const currentUser = INITIAL_USERS[currentRoleKey];

  // Live Data State
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [clubs, setClubs] = useState<StudentClub[]>(INITIAL_CLUBS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [resources, setResources] = useState<AcademicDoc[]>(INITIAL_RESOURCES);
  const [posts, setPosts] = useState<CommunityFeedPost[]>(INITIAL_POSTS);
  const [alerts, setAlerts] = useState<InAppAlert[]>(INITIAL_ALERTS);

  // Search & Filter State
  const [eventFilter, setEventFilter] = useState('All');
  const [eventSearch, setEventSearch] = useState('');
  const [clubSearch, setClubSearch] = useState('');
  const [resourceFilter, setResourceFilter] = useState('All');
  const [resourceSearch, setResourceSearch] = useState('');
  const [postFilter, setPostFilter] = useState('All');

  // Modal / Toast State
  const [registeredSuccessModal, setRegisteredSuccessModal] = useState<CampusEvent | null>(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'Campus Life' | 'Academic Help' | 'Projects'>('Campus Life');
  const [copiedFile, setCopiedFile] = useState(false);
  const [selectedAndroidFile, setSelectedAndroidFile] = useState<AndroidFileRecord>(ANDROID_FILES[5]); // MainActivity
  const [isExporting, setIsExporting] = useState(false);

  // Unread Alert Count
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  // Event Registration Handler (atomic simulation with duplicate & capacity prevention)
  const handleToggleEventRSVP = (event: CampusEvent) => {
    if (event.isRegistered) {
      setEvents(prev =>
        prev.map(e =>
          e.id === event.id
            ? { ...e, isRegistered: false, registeredCount: Math.max(0, e.registeredCount - 1) }
            : e
        )
      );
    } else {
      if (event.registeredCount >= event.capacity) {
        alert('This event has reached full capacity.');
        return;
      }
      setEvents(prev =>
        prev.map(e =>
          e.id === event.id
            ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1 }
            : e
        )
      );
      setRegisteredSuccessModal(event);

      // Trigger in-app notification
      const newAlert: InAppAlert = {
        id: `alert_${Date.now()}`,
        title: 'Registration Confirmed',
        message: `You are booked for "${event.title}". Event badge added to profile.`,
        timeAgo: 'Just now',
        type: 'EVENT',
        isRead: false
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  // Club Membership Request Handler
  const handleRequestClubJoin = (clubId: string) => {
    setClubs(prev =>
      prev.map(c =>
        c.id === clubId
          ? { ...c, membershipStatus: 'PENDING' }
          : c
      )
    );
  };

  // Coordinator/Admin Club Approval
  const handleApproveClubMember = (clubId: string, approve: boolean) => {
    setClubs(prev =>
      prev.map(c =>
        c.id === clubId
          ? {
              ...c,
              membershipStatus: approve ? 'APPROVED' : 'REJECTED',
              memberCount: approve ? c.memberCount + 1 : c.memberCount
            }
          : c
      )
    );
  };

  // Like Toggle
  const handleToggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1
            }
          : p
      )
    );
  };

  // Create Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityFeedPost = {
      id: `post_${Date.now()}`,
      authorName: currentUser.displayName,
      authorRole: `${currentUser.role.replace('_', ' ')} • ${currentUser.department.split('&')[0]}`,
      timeAgo: 'Just now',
      category: newPostCategory,
      content: newPostText.trim(),
      likes: 0,
      comments: 0,
      isLiked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setCreatePostOpen(false);
  };

  // Bookmark Toggle
  const handleToggleBookmark = (resId: string) => {
    setResources(prev =>
      prev.map(r =>
        r.id === resId ? { ...r, isBookmarked: !r.isBookmarked } : r
      )
    );
  };

  // Download ZIP of Android Project
  const handleDownloadAndroidZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Add all generated Android project files
      ANDROID_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Add additional required metadata
      zip.file(
        'android/app/google-services.json.template',
        JSON.stringify(
          {
            project_info: {
              project_number: '1234567890',
              project_id: 'campushub1-prod',
              storage_bucket: 'campushub1-prod.appspot.com'
            },
            client: [
              {
                client_info: {
                  mobilesdk_app_id: '1:1234567890:android:campushub1abcdef',
                  android_client_info: {
                    package_name: 'com.campushub1.app'
                  }
                }
              }
            ],
            configuration_version: '1'
          },
          null,
          2
        )
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'CampusHUB1_Native_Android_Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to generate zip', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedAndroidFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Top Banner / Studio Control Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white">CampusHUB1</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-medium border border-indigo-500/30">
                  Android Native • Jetpack Compose
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Your Campus. Your Community. One Hub.
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setViewMode('simulator')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Simulator</span>
            </button>
            <button
              onClick={() => setViewMode('codebase')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'codebase'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Android Codebase & Files</span>
            </button>
            <button
              onClick={() => setViewMode('firebase_guide')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'firebase_guide'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Firebase & Rules Guide</span>
            </button>
          </div>

          {/* Role Switcher & Export */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1 bg-slate-800/90 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 mr-1">Role:</span>
              <select
                value={currentRoleKey}
                onChange={e => {
                  setCurrentRoleKey(e.target.value as keyof typeof INITIAL_USERS);
                  if (e.target.value === 'ADMINISTRATOR') setSubScreen('admin');
                }}
                className="bg-transparent text-indigo-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="STUDENT" className="bg-slate-900 text-white">Student</option>
                <option value="FACULTY" className="bg-slate-900 text-white">Faculty</option>
                <option value="CLUB_COORDINATOR" className="bg-slate-900 text-white">Club Coordinator</option>
                <option value="ADMINISTRATOR" className="bg-slate-900 text-white">Administrator</option>
              </select>
            </div>

            <button
              onClick={handleDownloadAndroidZip}
              disabled={isExporting}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-md shadow-cyan-500/10 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Packaging...' : 'Export Android ZIP'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col items-center">
        {viewMode === 'simulator' && (
          <div className="w-full flex flex-col items-center">
            {/* Context Info Pill */}
            <div className="mb-4 text-center">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Role: <strong className="text-slate-200">{currentUser.displayName} ({currentUser.role})</strong> — Test real event RSVP, club requests, notices, and admin powers.
              </p>
            </div>

            {/* Android Device Mockup Frame */}
            <div className="w-full max-w-[420px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-800">
              {/* Phone Inner Bezel & Screen */}
              <div className="w-full bg-slate-50 text-slate-900 rounded-[34px] overflow-hidden flex flex-col h-[760px] relative shadow-inner">
                {/* Android Status Bar */}
                <div className="bg-indigo-600 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none z-20">
                  <span>9:41</span>
                  {/* Camera hole */}
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700"></div>
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Sub-screen Header or Main App Header */}
                {subScreen !== 'none' ? (
                  <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
                    <button
                      onClick={() => setSubScreen('none')}
                      className="p-1 rounded-full hover:bg-white/10 text-white transition flex items-center space-x-1 text-xs"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <h2 className="text-sm font-bold capitalize">
                      {subScreen === 'admin'
                        ? 'Admin Console'
                        : subScreen === 'announcements'
                        ? 'Announcements'
                        : subScreen === 'resources'
                        ? 'Academic Library'
                        : 'Notifications'}
                    </h2>
                    <div className="w-8"></div>
                  </div>
                ) : (
                  <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
                    <div>
                      <h2 className="text-base font-extrabold tracking-tight">CampusHUB1</h2>
                      <p className="text-[11px] text-indigo-100">
                        Welcome, {currentUser.displayName.split(' ')[0]} 👋
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {currentUser.role === 'ADMINISTRATOR' && (
                        <button
                          onClick={() => setSubScreen('admin')}
                          className="p-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white transition"
                          title="Admin Dashboard"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-300" />
                        </button>
                      )}
                      <button
                        onClick={() => setSubScreen('notifications')}
                        className="relative p-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white transition"
                      >
                        <Bell className="w-4 h-4" />
                        {unreadAlertsCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                            {unreadAlertsCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Scrollable View Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 relative">
                  {/* SUB-SCREENS */}
                  {subScreen === 'notifications' && (
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Recent updates</span>
                        <button
                          onClick={() => setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))}
                          className="text-indigo-600 font-semibold hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                      {alerts.map(alertItem => (
                        <div
                          key={alertItem.id}
                          className={`p-3 rounded-2xl border transition ${
                            alertItem.isRead
                              ? 'bg-white border-slate-200'
                              : 'bg-indigo-50/60 border-indigo-200 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                            <div className="flex-1">
                              <h4 className="text-xs font-bold text-slate-900">{alertItem.title}</h4>
                              <p className="text-xs text-slate-600 mt-0.5">{alertItem.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{alertItem.timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {subScreen === 'announcements' && (
                    <div className="p-4 space-y-3">
                      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Official Notice Feed:</strong> Published and digitally signed by College Administration and Department Heads.
                        </div>
                      </div>
                      {notices.map(notice => (
                        <div key={notice.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                                notice.priority === 'URGENT'
                                  ? 'bg-rose-100 text-rose-700'
                                  : notice.priority === 'HIGH'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-indigo-100 text-indigo-700'
                              }`}
                            >
                              {notice.priority}
                            </span>
                            <span className="text-slate-400">{notice.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">{notice.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-medium">
                            <span>Author: {notice.author}</span>
                            <span className="text-slate-400">Audience: All Students</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {subScreen === 'resources' && (
                    <div className="p-4 space-y-3">
                      {/* Search & Category Filter */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search lecture notes, papers, syllabus..."
                          value={resourceSearch}
                          onChange={e => setResourceSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                        {['All', 'Notes', 'Question Papers', 'Syllabus', 'Lab Manuals'].map(type => (
                          <button
                            key={type}
                            onClick={() => setResourceFilter(type)}
                            className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition ${
                              resourceFilter === type
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2.5">
                        {resources
                          .filter(
                            r =>
                              (resourceFilter === 'All' || r.type === resourceFilter) &&
                              (r.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
                                r.subject.toLowerCase().includes(resourceSearch.toLowerCase()))
                          )
                          .map(doc => (
                            <div key={doc.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-900 leading-snug">{doc.title}</h5>
                                    <p className="text-[11px] text-indigo-600 font-medium mt-0.5">{doc.subject}</p>
                                    <p className="text-[10px] text-slate-400">{doc.author} • {doc.fileSize}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleToggleBookmark(doc.id)}
                                  className="text-slate-400 hover:text-indigo-600 p-1"
                                >
                                  <Bookmark
                                    className={`w-4 h-4 ${
                                      doc.isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''
                                    }`}
                                  />
                                </button>
                              </div>
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                  {doc.type}
                                </span>
                                <button
                                  onClick={() => alert(`Simulated download of: ${doc.title} (${doc.fileSize})`)}
                                  className="text-indigo-600 text-xs font-semibold flex items-center space-x-1 hover:underline"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download PDF</span>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {subScreen === 'admin' && (
                    <div className="p-4 space-y-4">
                      {/* Metric Grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                          <p className="text-[11px] text-slate-500 font-medium">Total Registered</p>
                          <h4 className="text-lg font-bold text-slate-900 mt-1">4,280</h4>
                          <span className="text-[10px] text-emerald-600 font-semibold">Active Campus Users</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                          <p className="text-[11px] text-slate-500 font-medium">Live Events</p>
                          <h4 className="text-lg font-bold text-slate-900 mt-1">{events.length}</h4>
                          <span className="text-[10px] text-indigo-600 font-semibold">Across Departments</span>
                        </div>
                      </div>

                      {/* Event Approvals */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <span>Pending Event Approvals</span>
                        </h4>

                        <div className="border border-slate-100 rounded-xl p-2.5 space-y-2 bg-slate-50/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-xs font-semibold text-slate-800">Drone Racing Championship</h5>
                              <p className="text-[10px] text-slate-500">Submitted by Robotics Club • Dec 10, 2026</p>
                            </div>
                            <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                              PENDING
                            </span>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => alert('Event approved and pushed to Firestore collection!')}
                              className="flex-1 bg-emerald-600 text-white text-[11px] font-semibold py-1 rounded-lg hover:bg-emerald-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => alert('Event rejected with feedback.')}
                              className="flex-1 bg-slate-200 text-slate-700 text-[11px] font-semibold py-1 rounded-lg hover:bg-slate-300 transition"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Immutable Audit Log */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                        <h4 className="text-xs font-bold text-slate-900">Firestore Audit Trail (Last 24h)</h4>
                        <div className="text-[11px] text-slate-600 space-y-1.5">
                          <p>• User 'dr.desai@campus.edu' granted FACULTY permissions.</p>
                          <p>• Event 'CodeSpark Hackathon' registration cap updated.</p>
                          <p>• Membership request approved for Student #CS23-0491.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BOTTOM TAB DESTINATIONS */}
                  {subScreen === 'none' && activeTab === 'home' && (
                    <div className="p-4 space-y-4">
                      {/* Urgent Notice Banner */}
                      <div
                        onClick={() => setSubScreen('announcements')}
                        className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 p-3 rounded-2xl cursor-pointer hover:shadow-sm transition"
                      >
                        <div className="flex items-center space-x-2 text-indigo-700 text-[11px] font-bold">
                          <Megaphone className="w-3.5 h-3.5 text-indigo-600 animate-bounce" />
                          <span>CAMPUS NOTICE</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">
                          Mid-Term Examination Schedule Released
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Official dates and slot distributions now live. Tap to view details.
                        </p>
                      </div>

                      {/* Quick Action Tiles */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 mb-2">Campus Modules</h4>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => setSubScreen('announcements')}
                            className="bg-white p-2.5 rounded-2xl border border-slate-200 flex flex-col items-center text-center shadow-xs hover:border-indigo-400 transition"
                          >
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                              <Megaphone className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-800">Notices</span>
                          </button>

                          <button
                            onClick={() => setSubScreen('resources')}
                            className="bg-white p-2.5 rounded-2xl border border-slate-200 flex flex-col items-center text-center shadow-xs hover:border-violet-400 transition"
                          >
                            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-1">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-800">Library</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('clubs')}
                            className="bg-white p-2.5 rounded-2xl border border-slate-200 flex flex-col items-center text-center shadow-xs hover:border-cyan-400 transition"
                          >
                            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-1">
                              <Users className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-800">Clubs</span>
                          </button>

                          <button
                            onClick={() => {
                              if (currentUser.role === 'ADMINISTRATOR') setSubScreen('admin');
                              else alert('Switch role to Administrator at top bar to access Admin Console.');
                            }}
                            className="bg-white p-2.5 rounded-2xl border border-slate-200 flex flex-col items-center text-center shadow-xs hover:border-amber-400 transition"
                          >
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-800">Admin</span>
                          </button>
                        </div>
                      </div>

                      {/* Featured Upcoming Events Carousel */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-800">Upcoming Events</h4>
                          <button
                            onClick={() => setActiveTab('events')}
                            className="text-[11px] text-indigo-600 font-semibold hover:underline"
                          >
                            View all
                          </button>
                        </div>
                        <div className="space-y-2.5">
                          {events.slice(0, 2).map(event => (
                            <div key={event.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                              <div className="flex items-start justify-between">
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 uppercase">
                                  {event.category}
                                </span>
                                <span className="text-[11px] font-bold text-indigo-600">
                                  {event.capacity - event.registeredCount} spots remaining
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 leading-snug">{event.title}</h5>
                              <div className="text-[11px] text-slate-500 space-y-0.5">
                                <div className="flex items-center space-x-1.5">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{event.date} • {event.time}</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{event.venue}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleToggleEventRSVP(event)}
                                className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                                  event.isRegistered
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                                }`}
                              >
                                {event.isRegistered ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Registered (Tap to Cancel)</span>
                                  </>
                                ) : (
                                  <span>Register Now</span>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Student Clubs */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-800">Popular Student Clubs</h4>
                          <button
                            onClick={() => setActiveTab('clubs')}
                            className="text-[11px] text-indigo-600 font-semibold hover:underline"
                          >
                            Explore
                          </button>
                        </div>
                        <div className="space-y-2">
                          {clubs.slice(0, 2).map(club => (
                            <div key={club.id} className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                  {club.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-slate-800">{club.name}</h5>
                                  <p className="text-[10px] text-slate-500">{club.category} • {club.memberCount} Members</p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {subScreen === 'none' && activeTab === 'events' && (
                    <div className="p-4 space-y-3">
                      {/* Search */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search hackathons, seminars, sports..."
                          value={eventSearch}
                          onChange={e => setEventSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Category Chips */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                        {['All', 'Hackathon', 'Workshop', 'Cultural', 'Seminar'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setEventFilter(cat)}
                            className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition ${
                              eventFilter === cat
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Event Cards */}
                      <div className="space-y-3">
                        {events
                          .filter(
                            e =>
                              (eventFilter === 'All' || e.category === eventFilter) &&
                              e.title.toLowerCase().includes(eventSearch.toLowerCase())
                          )
                          .map(event => {
                            const percentFilled = Math.round((event.registeredCount / event.capacity) * 100);
                            return (
                              <div key={event.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                                <div className="flex items-start justify-between">
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 uppercase">
                                    {event.category}
                                  </span>
                                  <span className="text-[11px] font-bold text-slate-700">
                                    {event.capacity - event.registeredCount} spots left
                                  </span>
                                </div>

                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">{event.title}</h4>
                                  <p className="text-[10px] text-indigo-600 font-medium">By {event.organizer}</p>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {event.description}
                                </p>

                                <div className="space-y-1 text-[11px] text-slate-500">
                                  <div className="flex items-center space-x-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{event.date} • {event.time}</span>
                                  </div>
                                  <div className="flex items-center space-x-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{event.venue}</span>
                                  </div>
                                </div>

                                {/* Capacity Bar */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>RSVPs ({event.registeredCount}/{event.capacity})</span>
                                    <span>{percentFilled}% Filled</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        percentFilled > 85 ? 'bg-amber-500' : 'bg-indigo-600'
                                      }`}
                                      style={{ width: `${percentFilled}%` }}
                                    ></div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleToggleEventRSVP(event)}
                                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                                    event.isRegistered
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                                  }`}
                                >
                                  {event.isRegistered ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      <span>RSVP Confirmed • Tap to Cancel</span>
                                    </>
                                  ) : (
                                    <span>Confirm Registration</span>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {subScreen === 'none' && activeTab === 'clubs' && (
                    <div className="p-4 space-y-3">
                      {/* Search */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search clubs, societies, councils..."
                          value={clubSearch}
                          onChange={e => setClubSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-3">
                        {clubs
                          .filter(c => c.name.toLowerCase().includes(clubSearch.toLowerCase()))
                          .map(club => (
                            <div key={club.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center shrink-0">
                                  {club.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-slate-900">{club.name}</h4>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      {club.memberCount} members
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-indigo-600">{club.category} Society</p>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed">
                                {club.description}
                              </p>

                              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                                <span>{club.lead}</span>
                                <span>Advisor: {club.advisor}</span>
                              </div>

                              {/* Membership Action */}
                              {club.membershipStatus === 'APPROVED' ? (
                                <div className="bg-emerald-50 text-emerald-700 py-1.5 px-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Active Member</span>
                                </div>
                              ) : club.membershipStatus === 'PENDING' ? (
                                <div className="space-y-1.5">
                                  <div className="bg-amber-50 text-amber-700 py-1.5 px-3 rounded-xl text-center text-xs font-bold border border-amber-200">
                                    Membership Request Pending Review
                                  </div>
                                  {(currentUser.role === 'CLUB_COORDINATOR' || currentUser.role === 'ADMINISTRATOR') && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleApproveClubMember(club.id, true)}
                                        className="flex-1 bg-emerald-600 text-white text-[11px] py-1 rounded-lg font-semibold hover:bg-emerald-700"
                                      >
                                        Coordinator Approve
                                      </button>
                                      <button
                                        onClick={() => handleApproveClubMember(club.id, false)}
                                        className="flex-1 bg-rose-600 text-white text-[11px] py-1 rounded-lg font-semibold hover:bg-rose-700"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleRequestClubJoin(club.id)}
                                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition border border-indigo-200"
                                >
                                  Request to Join Club
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {subScreen === 'none' && activeTab === 'community' && (
                    <div className="p-4 space-y-3">
                      {/* Post Input Box */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {currentUser.avatarText}
                        </div>
                        <button
                          onClick={() => setCreatePostOpen(true)}
                          className="flex-1 text-left bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs px-3 py-2 rounded-xl transition"
                        >
                          Start a campus discussion or ask a question...
                        </button>
                      </div>

                      {/* Category filter */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                        {['All', 'Campus Life', 'Academic Help', 'Projects', 'Achievements'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setPostFilter(cat)}
                            className={`px-2.5 py-1 rounded-full shrink-0 font-medium transition ${
                              postFilter === cat
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Community Posts */}
                      <div className="space-y-3">
                        {posts
                          .filter(p => postFilter === 'All' || p.category === postFilter)
                          .map(post => (
                            <div key={post.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2.5">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                                    {post.authorName.charAt(0)}
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-900">{post.authorName}</h5>
                                    <p className="text-[10px] text-slate-400">{post.authorRole} • {post.timeAgo}</p>
                                  </div>
                                </div>
                                <span className="text-[9px] bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                                  {post.category}
                                </span>
                              </div>

                              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                                {post.content}
                              </p>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <button
                                  onClick={() => handleToggleLike(post.id)}
                                  className={`flex items-center space-x-1.5 font-medium transition ${
                                    post.isLiked ? 'text-rose-600' : 'hover:text-slate-900'
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600' : ''}`} />
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1.5 hover:text-slate-900">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{post.comments} comments</span>
                                </button>
                                <button
                                  onClick={() => alert('Post reported to campus moderator team.')}
                                  className="text-slate-400 hover:text-rose-600 text-[11px]"
                                >
                                  Report
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {subScreen === 'none' && activeTab === 'profile' && (
                    <div className="p-4 space-y-4">
                      {/* Profile Card */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
                        <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20">
                          {currentUser.avatarText}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{currentUser.displayName}</h4>
                          <p className="text-xs text-slate-500">{currentUser.email}</p>
                        </div>
                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                          Role: {currentUser.role}
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                          <div>
                            <p className="text-sm font-bold text-indigo-600">
                              {clubs.filter(c => c.membershipStatus === 'APPROVED').length}
                            </p>
                            <p className="text-[10px] text-slate-400">Joined Clubs</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-indigo-600">
                              {events.filter(e => e.isRegistered).length}
                            </p>
                            <p className="text-[10px] text-slate-400">Event RSVPs</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-indigo-600">
                              {resources.filter(r => r.isBookmarked).length}
                            </p>
                            <p className="text-[10px] text-slate-400">Bookmarks</p>
                          </div>
                        </div>
                      </div>

                      {/* Academic Info */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
                        <h5 className="font-bold text-slate-900 text-xs">Academic Records</h5>
                        <div className="space-y-1.5 text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Department</span>
                            <span className="font-medium text-slate-800">{currentUser.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Degree / Program</span>
                            <span className="font-medium text-slate-800">{currentUser.course}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Year & Semester</span>
                            <span className="font-medium text-slate-800">{currentUser.academicYear}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Student ID</span>
                            <span className="font-mono text-slate-800">{currentUser.studentId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                        <button
                          onClick={() => setSubScreen('resources')}
                          className="w-full px-4 py-3 text-left font-medium text-slate-700 flex items-center justify-between hover:bg-slate-50"
                        >
                          <span>My Bookmarked Notes & Papers</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => setSubScreen('announcements')}
                          className="w-full px-4 py-3 text-left font-medium text-slate-700 flex items-center justify-between hover:bg-slate-50"
                        >
                          <span>Campus Notice Board</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => alert('Feedback submitted to Student Affairs!')}
                          className="w-full px-4 py-3 text-left font-medium text-slate-700 flex items-center justify-between hover:bg-slate-50"
                        >
                          <span>Submit App Feedback / Bug Report</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Material 3 Bottom Navigation Bar */}
                <div className="bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around z-20">
                  <button
                    onClick={() => {
                      setSubScreen('none');
                      setActiveTab('home');
                    }}
                    className={`flex flex-col items-center p-1 text-[10px] font-semibold transition ${
                      activeTab === 'home' && subScreen === 'none'
                        ? 'text-indigo-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Home className="w-5 h-5 mb-0.5" />
                    <span>Home</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubScreen('none');
                      setActiveTab('events');
                    }}
                    className={`flex flex-col items-center p-1 text-[10px] font-semibold transition ${
                      activeTab === 'events' && subScreen === 'none'
                        ? 'text-indigo-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Calendar className="w-5 h-5 mb-0.5" />
                    <span>Events</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubScreen('none');
                      setActiveTab('clubs');
                    }}
                    className={`flex flex-col items-center p-1 text-[10px] font-semibold transition ${
                      activeTab === 'clubs' && subScreen === 'none'
                        ? 'text-indigo-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Users className="w-5 h-5 mb-0.5" />
                    <span>Clubs</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubScreen('none');
                      setActiveTab('community');
                    }}
                    className={`flex flex-col items-center p-1 text-[10px] font-semibold transition ${
                      activeTab === 'community' && subScreen === 'none'
                        ? 'text-indigo-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 mb-0.5" />
                    <span>Community</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubScreen('none');
                      setActiveTab('profile');
                    }}
                    className={`flex flex-col items-center p-1 text-[10px] font-semibold transition ${
                      activeTab === 'profile' && subScreen === 'none'
                        ? 'text-indigo-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <UserIcon className="w-5 h-5 mb-0.5" />
                    <span>Profile</span>
                  </button>
                </div>

                {/* Android System Navigation Pill Indicator */}
                <div className="bg-white py-1 flex justify-center">
                  <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANDROID STUDIO CODEBASE EXPLORER VIEW */}
        {viewMode === 'codebase' && (
          <div className="w-full max-w-6xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[760px]">
            {/* File Tree Sidebar */}
            <div className="w-full md:w-80 bg-slate-950/80 border-r border-slate-800 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Android Project Structure
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                  Gradle 8.8
                </span>
              </div>

              <div className="space-y-1">
                {ANDROID_FILES.map(file => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedAndroidFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      selectedAndroidFile.path === file.path
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Code2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className="text-[9px] opacity-75">{file.category.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Android Studio Import</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  This project uses <strong>Kotlin 2.0</strong>, <strong>Jetpack Compose (Material 3)</strong>, and <strong>Firebase Android BoM</strong>.
                </p>
                <button
                  onClick={handleDownloadAndroidZip}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ZIP</span>
                </button>
              </div>
            </div>

            {/* Code Content Viewer */}
            <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold text-indigo-400">{selectedAndroidFile.path}</h3>
                  <span className="text-[10px] text-slate-500">{selectedAndroidFile.category}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  {copiedFile ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/40">
                <pre>{selectedAndroidFile.content}</pre>
              </div>
            </div>
          </div>
        )}

        {/* FIREBASE & SECURITY RULES GUIDE VIEW */}
        {viewMode === 'firebase_guide' && (
          <div className="w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <span>Firebase Authentication & Cloud Firestore Security Guide</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                How CampusHUB1 implements safe atomic operations, role separation, and fraud prevention.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-indigo-300">1. Role Escalation Prevention</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In <code className="text-cyan-300">firestore.rules</code>, regular users can never modify their <code className="text-cyan-300">role</code> field. During registration, role is forced to <code className="text-cyan-300">STUDENT</code>. Only authenticated <code className="text-cyan-300">ADMINISTRATOR</code> users can promote someone to Faculty or Club Coordinator.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-indigo-300">2. Capacity Safety & Atomic Transactions</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In <code className="text-cyan-300">EventsRepository.kt</code>, registering for an event uses <code className="text-cyan-300">runTransaction</code> to verify <code className="text-cyan-300">registeredCount &lt; capacity</code> before atomically incrementing the counter and writing the ticket document with ID <code className="text-cyan-300">{`\${eventId}_\${userId}`}</code>, making duplicate registrations impossible.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-indigo-300">3. Club Coordinator Isolation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Club coordinators can only review membership requests and manage events belonging to their assigned <code className="text-cyan-300">coordinatorId</code>. They cannot alter other clubs.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-indigo-300">4. Append-Only Audit Trail</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All administrative actions (promotions, event approvals, suspensions) create immutable documents in the <code className="text-cyan-300">auditLogs</code> collection. Rules forbid any update or deletion.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">How to connect your Firebase Project in Android Studio:</h4>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2">
                <li>Create a project in the Firebase Console: <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">console.firebase.google.com</a></li>
                <li>Add an Android App with package name: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">com.campushub1.app</code></li>
                <li>Download <code className="text-cyan-300">google-services.json</code> and save it in <code className="text-cyan-300">android/app/google-services.json</code></li>
                <li>Deploy Security Rules using Firebase CLI: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono">firebase deploy --only firestore:rules</code></li>
                <li>Hit Run in Android Studio!</li>
              </ol>
            </div>
          </div>
        )}
      </main>

      {/* REGISTRATION CONFIRMED MODAL */}
      {registeredSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Registration Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                You are registered for <strong>{registeredSuccessModal.title}</strong>.
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-600 space-y-1 text-left border border-slate-100">
              <p><strong>Venue:</strong> {registeredSuccessModal.venue}</p>
              <p><strong>Date & Time:</strong> {registeredSuccessModal.date} ({registeredSuccessModal.time})</p>
              <p><strong>Attendee:</strong> {currentUser.displayName} ({currentUser.studentId})</p>
            </div>
            <button
              onClick={() => setRegisteredSuccessModal(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Great, Got It!
            </button>
          </div>
        </div>
      )}

      {/* CREATE COMMUNITY POST MODAL */}
      {createPostOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Create Campus Post</h3>
              <button
                onClick={() => setCreatePostOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                <select
                  value={newPostCategory}
                  onChange={e => setNewPostCategory(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Campus Life">Campus Life</option>
                  <option value="Academic Help">Academic Help</option>
                  <option value="Projects">Projects & Hackathons</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Your Thoughts / Inquiry</label>
                <textarea
                  rows={4}
                  value={newPostText}
                  onChange={e => setNewPostText(e.target.value)}
                  placeholder="Ask a question, announce a student initiative, or start a discussion..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreatePostOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
