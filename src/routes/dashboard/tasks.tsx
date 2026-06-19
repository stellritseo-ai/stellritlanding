import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState, useEffect, useMemo } from "react";
import {
  ListTodo,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  CheckSquare,
  Layers,
  AlertCircle,
  Trash2,
  Edit,
  ChevronRight,
  Calendar,
  Paperclip,
  MessageSquare,
  History,
  UserPlus,
  X,
  Check,
  CheckCircle,
  TrendingUp,
  XCircle,
  BookOpen,
  Tag,
  Briefcase,
  Globe,
  MoreVertical,
  Activity,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/dashboard/tasks")({
  component: TasksPage,
});

interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

interface TaskActivity {
  action: string;
  performedBy: string;
  timestamp: string;
}

interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskAttachment {
  name: string;
  url: string;
  type?: string;
}

interface Task {
  id: string;
  title: string;
  projectName: string;
  businessName: string;
  assignedUsers: string[];
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "Ongoing" | "Done" | "Work Failed" | "Domain Book";
  tags: string[];
  description: string;
  businessInfo?: {
    businessName?: string;
    contactPerson?: string;
    phoneNumber?: string;
    email?: string;
    website?: string;
    requirements?: string[];
  };
  domainInfo?: {
    domainName?: string;
  };
  attachments: TaskAttachment[];
  checklist: TaskChecklistItem[];
  comments: TaskComment[];
  activityHistory: TaskActivity[];
  relatedProjectId: string;
  createdBy: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectBrief {
  id: string;
  projectName: string;
  clientName: string;
  businessName?: string;
}

const TEAM_MEMBERS = [
  { name: "Jiten Sony", email: "jiten@stellrit.com", avatar: "JS" },
  { name: "Sarah Jenkins", email: "sarah.j@nexus.io", avatar: "SJ" },
  { name: "David Chen", email: "david.c@technova.com", avatar: "DC" },
  { name: "Alex Rivera", email: "alex@riveradesign.co", avatar: "AR" },
  { name: "Emily Watson", email: "emily.w@harmonycare.org", avatar: "EW" }
];

const COLUMNS: Task["status"][] = ["To Do", "Ongoing", "Done", "Work Failed", "Domain Book"];

import {
  getTasksFn,
  createTaskFn,
  updateTaskFn,
  deleteTaskFn,
  getProjectsFn,
} from "@/lib/dashboard.functions.server";

function TasksPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // State Management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<ProjectBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  // Selection & Modal visibility
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeColDragOver, setActiveColDragOver] = useState<string | null>(null);

  // Toast notifications state
  interface ToastItem {
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Form Fields States for Create Task
  const [formTitle, setFormTitle] = useState("");
  const [formProjectId, setFormProjectId] = useState("");
  const [formAssignedUsers, setFormAssignedUsers] = useState<string[]>([]);
  const [formPriority, setFormPriority] = useState<Task["priority"]>("Medium");
  const [formTags, setFormTags] = useState("");
  const [formDescription, setFormDescription] = useState("");
  
  // Business Info states
  const [formBusName, setFormBusName] = useState("");
  const [formBusContact, setFormBusContact] = useState("");
  const [formBusPhone, setFormBusPhone] = useState("");
  const [formBusEmail, setFormBusEmail] = useState("");
  const [formBusWebsite, setFormBusWebsite] = useState("");
  const [formBusRequirements, setFormBusRequirements] = useState("");

  // Domain Info states
  const [formDomName, setFormDomName] = useState("");

  // Comments & checklist state inside Drawer
  const [newCommentText, setNewCommentText] = useState("");
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState("");

  // Fetch all tasks and projects from DB
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await getTasksFn();
      const fetchedProjects = await getProjectsFn();
      setTasks(fetchedTasks as any);
      setProjects(fetchedProjects as any);
    } catch (e: any) {
      setError(e.message || "Failed to sync board details with the MongoDB server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Selected Task Object
  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.id === activeTaskId) || null;
  }, [tasks, activeTaskId]);

  // Handle Project Selection in Create Form to auto-populate Business/Client fields
  useEffect(() => {
    if (formProjectId) {
      const selectedProj = projects.find((p) => p.id === formProjectId);
      if (selectedProj) {
        setFormBusName(selectedProj.businessName || selectedProj.clientName || "");
        setFormDomName(selectedProj.projectName.toLowerCase().replace(/\s+/g, "") + ".com");
      }
    }
  }, [formProjectId, projects]);

  // Summary Widgets calculations
  const widgets = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "To Do").length;
    const ongoing = tasks.filter((t) => t.status === "Ongoing").length;
    const completed = tasks.filter((t) => t.status === "Done").length;
    const failed = tasks.filter((t) => t.status === "Work Failed").length;
    const domainBook = tasks.filter((t) => t.status === "Domain Book").length;
    
    return { total, todo, ongoing, completed, failed, domainBook };
  }, [tasks]);

  // Filters logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.businessName.toLowerCase().includes(query) ||
        task.projectName.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === "All" || task.assignedUsers.includes(assigneeFilter);
      const matchesProject = projectFilter === "All" || task.projectName === projectFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesProject;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter, projectFilter]);

  // Columns contents
  const columnsData = useMemo(() => {
    const cols: Record<Task["status"], Task[]> = {
      "To Do": [],
      "Ongoing": [],
      "Done": [],
      "Work Failed": [],
      "Domain Book": []
    };
    filteredTasks.forEach((task) => {
      if (cols[task.status]) {
        cols[task.status].push(task);
      }
    });
    // Sort columns by orderIndex
    Object.keys(cols).forEach((key) => {
      cols[key as Task["status"]].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    });
    return cols;
  }, [filteredTasks]);

  // Create Task Form Submit
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast("Task Title is required.", "warning");
      return;
    }

    setLoading(true);
    try {
      const selectedProj = projects.find((p) => p.id === formProjectId);
      const projName = selectedProj ? selectedProj.projectName : "";

      const requirementsArray = formBusRequirements
        ? formBusRequirements.split("\n").map((r) => r.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formTitle,
        projectName: projName,
        businessName: formBusName,
        assignedUsers: formAssignedUsers,
        priority: formPriority,
        status: "To Do",
        tags: formTags ? formTags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        description: formDescription,
        businessInfo: {
          businessName: formBusName,
          contactPerson: formBusContact,
          phoneNumber: formBusPhone,
          email: formBusEmail,
          website: formBusWebsite,
          requirements: requirementsArray
        },
        domainInfo: {
          domainName: formDomName
        },
        attachments: [],
        checklist: [],
        comments: [],
        activityHistory: [
          {
            action: "Task created and added to Board",
            performedBy: "Jiten Sony",
            timestamp: new Date().toISOString()
          }
        ],
        relatedProjectId: formProjectId,
        createdBy: "Jiten Sony",
        orderIndex: tasks.filter((t) => t.status === "To Do").length + 1
      };

      const created = await createTaskFn({
        data: payload
      });

      setTasks((prev) => [created, ...prev]);
      showToast("Task created successfully!", "success");
      
      // Reset fields
      setFormTitle("");
      setFormProjectId("");
      setFormAssignedUsers([]);
      setFormPriority("Medium");
      setFormTags("");
      setFormDescription("");
      setFormBusName("");
      setFormBusContact("");
      setFormBusPhone("");
      setFormBusEmail("");
      setFormBusWebsite("");
      setFormBusRequirements("");
      setFormDomName("");
      
      setIsCreateModalOpen(false);
    } catch (err: any) {
      showToast("Failed to create task: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop events
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, column: Task["status"]) => {
    e.preventDefault();
    setActiveColDragOver(column);
  };

  const handleDragLeave = () => {
    setActiveColDragOver(null);
  };

  const handleDrop = async (e: React.DragEvent, targetCol: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setActiveColDragOver(null);
    setDraggedTaskId(null);

    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.status === targetCol) return; // Dropped in the same column

    // Calculate new orderIndex
    const colTasks = tasks.filter((t) => t.status === targetCol);
    const maxOrder = colTasks.reduce((max, t) => Math.max(max, t.orderIndex || 0), 0);
    const newOrder = maxOrder + 1;

    // Optimistic Local State Update
    const newLog = {
      action: `Moved task from "${task.status}" to "${targetCol}"`,
      performedBy: "Jiten Sony",
      timestamp: new Date().toISOString()
    };
    
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: targetCol,
              orderIndex: newOrder,
              activityHistory: [...t.activityHistory, newLog]
            }
          : t
      )
    );

    try {
      await updateTaskFn({
        data: {
          id: taskId,
          update: {
            status: targetCol,
            orderIndex: newOrder,
            activityHistory: [...task.activityHistory, newLog]
          }
        }
      });
      showToast(`Task moved to ${targetCol}`, "success");
    } catch (err: any) {
      showToast("Database synchronization failed: " + err.message, "error");
      // Revert data
      loadData();
    }
  };

  // Add Comment inside Details Drawer
  const handleAddComment = async () => {
    if (!selectedTask || !newCommentText.trim()) return;

    const newComment: TaskComment = {
      id: Math.random().toString(36).substring(2, 9),
      userId: "m1",
      userName: "Jiten Sony",
      userAvatar: "JS",
      content: newCommentText,
      createdAt: new Date().toISOString()
    };

    const newLog = {
      action: `Added comment: "${newCommentText.substring(0, 30)}..."`,
      performedBy: "Jiten Sony",
      timestamp: new Date().toISOString()
    };

    const updatedComments = [...(selectedTask.comments || []), newComment];
    const updatedHistory = [...(selectedTask.activityHistory || []), newLog];

    // Local update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, comments: updatedComments, activityHistory: updatedHistory }
          : t
      )
    );
    setNewCommentText("");

    try {
      await updateTaskFn({
        data: {
          id: selectedTask.id,
          update: {
            comments: updatedComments,
            activityHistory: updatedHistory
          }
        }
      });
      showToast("Comment posted", "success");
    } catch (err: any) {
      showToast("Failed to save comment to database.", "error");
      loadData();
    }
  };

  // Toggle checklist subtask completed
  const handleToggleSubtask = async (subtaskId: string) => {
    if (!selectedTask) return;

    const updatedChecklist = selectedTask.checklist.map((item) =>
      item.id === subtaskId ? { ...item, completed: !item.completed } : item
    );

    const targetItem = selectedTask.checklist.find((i) => i.id === subtaskId);
    const newLog = {
      action: `${targetItem?.completed ? "Unchecked" : "Checked"} subtask: "${targetItem?.text}"`,
      performedBy: "Jiten Sony",
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...(selectedTask.activityHistory || []), newLog];

    // Local update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, checklist: updatedChecklist, activityHistory: updatedHistory }
          : t
      )
    );

    try {
      await updateTaskFn({
        data: {
          id: selectedTask.id,
          update: {
            checklist: updatedChecklist,
            activityHistory: updatedHistory
          }
        }
      });
    } catch (err: any) {
      showToast("Failed to save checklist state to database.", "error");
      loadData();
    }
  };

  // Add checklist item
  const handleAddSubtask = async () => {
    if (!selectedTask || !newSubtaskText.trim()) return;

    const newItem: TaskChecklistItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: newSubtaskText,
      completed: false
    };

    const newLog = {
      action: `Added checklist item: "${newSubtaskText}"`,
      performedBy: "Jiten Sony",
      timestamp: new Date().toISOString()
    };

    const updatedChecklist = [...(selectedTask.checklist || []), newItem];
    const updatedHistory = [...(selectedTask.activityHistory || []), newLog];

    // Local update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, checklist: updatedChecklist, activityHistory: updatedHistory }
          : t
      )
    );
    setNewSubtaskText("");

    try {
      await updateTaskFn({
        data: {
          id: selectedTask.id,
          update: {
            checklist: updatedChecklist,
            activityHistory: updatedHistory
          }
        }
      });
      showToast("Subtask added", "success");
    } catch (err: any) {
      showToast("Failed to save checklist to database.", "error");
      loadData();
    }
  };

  // Delete checklist item
  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!selectedTask) return;

    const targetItem = selectedTask.checklist.find((i) => i.id === subtaskId);
    const updatedChecklist = selectedTask.checklist.filter((item) => item.id !== subtaskId);

    const newLog = {
      action: `Deleted checklist item: "${targetItem?.text}"`,
      performedBy: "Jiten Sony",
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...(selectedTask.activityHistory || []), newLog];

    // Local update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, checklist: updatedChecklist, activityHistory: updatedHistory }
          : t
      )
    );

    try {
      await updateTaskFn({
        data: {
          id: selectedTask.id,
          update: {
            checklist: updatedChecklist,
            activityHistory: updatedHistory
          }
        }
      });
      showToast("Subtask deleted", "info");
    } catch (err: any) {
      showToast("Failed to save checklist deletion.", "error");
      loadData();
    }
  };

  // Delete Task Card
  const handleDeleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await deleteTaskFn({
        data: { id: taskId }
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
      showToast("Task card deleted successfully.", "success");
    } catch (err: any) {
      showToast("Failed to delete task: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Attach a mock file representation
  const handleAddAttachment = async () => {
    if (!selectedTask || !newAttachmentName.trim() || !newAttachmentUrl.trim()) return;

    const newAttach: TaskAttachment = {
      name: newAttachmentName,
      url: newAttachmentUrl.startsWith("http") ? newAttachmentUrl : `https://${newAttachmentUrl}`,
      type: newAttachmentName.split(".").pop() || "doc"
    };

    const newLog = {
      action: `Attached file: "${newAttachmentName}"`,
      performedBy: "Jiten Sony",
      timestamp: new Date().toISOString()
    };

    const updatedAttach = [...(selectedTask.attachments || []), newAttach];
    const updatedHistory = [...(selectedTask.activityHistory || []), newLog];

    // Local update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTask.id
          ? { ...t, attachments: updatedAttach, activityHistory: updatedHistory }
          : t
      )
    );
    setNewAttachmentName("");
    setNewAttachmentUrl("");

    try {
      await updateTaskFn({
        data: {
          id: selectedTask.id,
          update: {
            attachments: updatedAttach,
            activityHistory: updatedHistory
          }
        }
      });
      showToast("File attached successfully", "success");
    } catch (err: any) {
      showToast("Failed to upload attachment representation.", "error");
      loadData();
    }
  };

  // Helper classes for priority badge
  const getPriorityStyles = (prio: Task["priority"]) => {
    switch (prio) {
      case "Urgent":
        return "bg-red-500/20 border-red-500/30 text-red-400";
      case "High":
        return "bg-amber-500/20 border-amber-500/30 text-amber-400";
      case "Medium":
        return "bg-indigo-500/20 border-indigo-500/30 text-indigo-400";
      case "Low":
      default:
        return "bg-slate-500/20 border-slate-500/30 text-slate-400";
    }
  };



  return (
    <div className="space-y-8 relative pb-20 select-none">
      
      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-55 space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl border shadow-xl flex items-center gap-3 pointer-events-auto ${
                t.type === "success"
                  ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400"
                  : t.type === "error"
                  ? "bg-rose-950/90 border-rose-500/30 text-rose-400"
                  : t.type === "warning"
                  ? "bg-amber-950/90 border-amber-500/30 text-amber-400"
                  : "bg-slate-900/90 border-slate-700/50 text-slate-300"
              }`}
            >
              {t.type === "error" || t.type === "warning" ? (
                <AlertCircle className="h-5 w-5 shrink-0" />
              ) : (
                <CheckCircle className="h-5 w-5 shrink-0" />
              )}
              <span className="text-xs font-semibold">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Operation Tasks Kanban</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Manage slicing pipelines, client requirements ledger, and domain setup procedures.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-[#a855f7] font-semibold mr-2">
              <Plus className="h-4.5 w-4.5 animate-spin" />
              Syncing Board...
            </span>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg hover:shadow-[#a855f7]/15 transition text-xs font-bold active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Task Card
          </button>
        </div>
      </div>

      {/* Summary Widgets Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Cards", val: widgets.total, icon: Layers, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
          { label: "To Do", val: widgets.todo, icon: ListTodo, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { label: "Ongoing", val: widgets.ongoing, icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
          { label: "Done", val: widgets.completed, icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { label: "Work Failed", val: widgets.failed, icon: XCircle, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
          { label: "Domain Book", val: widgets.domainBook, icon: BookOpen, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
        ].map((w, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border flex flex-col items-start gap-1.5 transition ${
              isDark ? "bg-[#12052c]/40" : "bg-white shadow-sm"
            } ${w.color}`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{w.label}</span>
              <w.icon className="h-4 w-4 opacity-70" />
            </div>
            <span className="text-xl font-bold font-mono mt-1">{w.val}</span>
          </div>
        ))}
      </div>

      {/* Filter / Advanced Search Bar */}
      <div className={`p-4.5 rounded-2xl border flex flex-col gap-4 transition ${
        isDark ? "bg-[#12052c]/65 border-white/5" : "bg-white border-slate-200"
      }`}>
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Text Search */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-white/40" : "text-slate-400"}`} />
            <input
              type="text"
              placeholder="Search tasks by title, client or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-10 pl-10 pr-4 border rounded-xl text-xs font-semibold transition focus:outline-none focus:ring-1 ${
                isDark
                  ? "bg-white/5 border-white/5 text-white placeholder-white/30 focus:border-[#a855f7]/50 focus:ring-[#a855f7]/50"
                  : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/50 focus:ring-[#a855f7]/50"
              }`}
            />
          </div>

          {/* Quick Select Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Assignee Filter */}
            <div className="relative flex items-center">
              <User className={`absolute left-3 h-3.5 w-3.5 ${isDark ? "text-white/40" : "text-slate-400"}`} />
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className={`pl-9 pr-8 py-2 border rounded-xl text-xs font-semibold focus:outline-none transition ${
                  isDark ? "bg-white/5 border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <option value="All">All Members</option>
                {TEAM_MEMBERS.map((m) => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Project Filter */}
            <div className="relative flex items-center">
              <Briefcase className={`absolute left-3 h-3.5 w-3.5 ${isDark ? "text-white/40" : "text-slate-400"}`} />
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className={`pl-9 pr-8 py-2 border rounded-xl text-xs font-semibold focus:outline-none transition ${
                  isDark ? "bg-white/5 border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <option value="All">All Projects</option>
                {Array.from(new Set(tasks.map((t) => t.projectName))).filter(Boolean).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative flex items-center">
              <AlertCircle className={`absolute left-3 h-3.5 w-3.5 ${isDark ? "text-white/40" : "text-slate-400"}`} />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={`pl-9 pr-8 py-2 border rounded-xl text-xs font-semibold focus:outline-none transition ${
                  isDark ? "bg-white/5 border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || assigneeFilter !== "All" || projectFilter !== "All" || priorityFilter !== "All" || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setAssigneeFilter("All");
                  setProjectFilter("All");
                  setPriorityFilter("All");
                  setStatusFilter("All");
                }}
                className="text-[10px] font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition duration-300"
              >
                Reset Filters
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-6 items-start overflow-x-auto pb-6 custom-scrollbar">
        {COLUMNS.map((column) => {
          const colTasks = columnsData[column] || [];
          const isDraggingOver = activeColDragOver === column;
          
          return (
            <div
              key={column}
              onDragOver={(e) => handleDragOver(e, column)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column)}
              className={`rounded-2xl border p-5 transition duration-300 flex flex-col max-h-[82vh] min-h-[550px] w-[340px] md:w-[360px] shrink-0 ${
                isDark ? "bg-[#12052c]/50 border-white/5" : "bg-slate-50 border-slate-200/50 shadow-inner"
              } ${isDraggingOver ? "border-[#a855f7]/40 ring-2 ring-[#a855f7]/15 bg-[#a855f7]/5" : ""}`}
            >
              
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4.5 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className={`h-3 w-3 rounded-full ${
                    column === "To Do" ? "bg-blue-500" :
                    column === "Ongoing" ? "bg-amber-500" :
                    column === "Done" ? "bg-emerald-500" :
                    column === "Work Failed" ? "bg-rose-500" :
                    "bg-purple-500"
                  }`} />
                  <h3 className="font-bold text-sm md:text-base leading-none">{column}</h3>
                </div>
                <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                  isDark ? "bg-white/5 text-white/50" : "bg-slate-200/50 text-slate-500"
                }`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Column List */}
              <div className="space-y-4 overflow-y-auto pr-1 flex-1 py-1 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {colTasks.length > 0 ? (
                    colTasks.map((task) => {
                      // Subtask progress
                      const subtasksCount = task.checklist?.length || 0;
                      const completedSubtasks = task.checklist?.filter((c) => c.completed).length || 0;
                      
                      return (
                        <motion.div
                          key={task.id}
                          layoutId={task.id}
                          draggable
                          onDragStart={(e: any) => handleDragStart(e, task.id)}
                          onClick={() => setActiveTaskId(task.id)}
                          className={`p-5 rounded-xl border cursor-grab active:cursor-grabbing transition hover:shadow-lg ${
                            isDark
                              ? "bg-[#1a0c36] border-white/5 hover:border-white/10 text-white"
                              : "bg-white border-slate-200 hover:border-slate-350 text-slate-800 shadow-sm"
                          } ${activeTaskId === task.id ? "ring-1 ring-[#a855f7]/50 border-[#a855f7]/40" : ""}`}
                        >
                          
                          {/* Card tags & Priority */}
                          <div className="flex justify-between items-center gap-2 mb-3">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${getPriorityStyles(task.priority)}`}>
                              {task.priority}
                            </span>
                            <div className="flex gap-1.5">
                              {task.tags?.slice(0, 2).map((t) => (
                                <span
                                  key={t}
                                  className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                                    isDark ? "bg-white/5 text-white/50" : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="font-bold text-sm leading-snug mb-1.5 group-hover:text-[#a855f7] transition">
                            {task.title}
                          </h4>

                          {/* Client / Project info */}
                          <div className="flex items-center gap-1.5 opacity-55 text-[10px] mb-4">
                            <Briefcase className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate max-w-[140px] font-medium">{task.businessName || "No Client"}</span>
                            <span>•</span>
                            <span className="truncate max-w-[120px] font-medium">{task.projectName || "No Project"}</span>
                          </div>

                          {/* Footer details (Checklist, attachments, users) */}
                          <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-3.5 text-[11px]">
                            
                            {/* Indicators */}
                            <div className="flex items-center gap-2.5 opacity-50 font-mono">
                              {subtasksCount > 0 && (
                                <span className={`flex items-center gap-1 ${completedSubtasks === subtasksCount ? "text-emerald-400 opacity-90" : ""}`}>
                                  <CheckSquare className="h-3.5 w-3.5 shrink-0" />
                                  {completedSubtasks}/{subtasksCount}
                                </span>
                              )}
                              {task.comments?.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                                  {task.comments.length}
                                </span>
                              )}
                            </div>

                            {/* Assignee Avatar Group */}
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {task.assignedUsers?.slice(0, 3).map((user) => {
                                const initials = user.split(" ").map((n) => n[0]).join("");
                                return (
                                  <div
                                    key={user}
                                    className="h-6 w-6 rounded-full border border-slate-900 bg-gradient-to-tr from-[#a855f7] to-[#ff8a5b] flex items-center justify-center text-[8px] font-bold text-white shadow-inner"
                                    title={user}
                                  >
                                    {initials}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30 text-center space-y-1.5">
                      <ListTodo className="h-6 w-6 stroke-1" />
                      <span className="text-[10px] font-semibold tracking-wide uppercase">No Tasks</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          );
        })}
      </div>

      {/* Task Details Side Drawer */}
      <AnimatePresence>
        {selectedTask && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTaskId(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl overflow-y-auto p-6 flex flex-col gap-6 shadow-2xl border-l select-text ${
                isDark ? "bg-[#0c0420] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              
              {/* Drawer Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4.5 shrink-0">
                <div className="space-y-1 pr-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${getPriorityStyles(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                      selectedTask.status === "Done" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" :
                      selectedTask.status === "Ongoing" ? "bg-amber-500/15 border-amber-500/20 text-amber-400" :
                      selectedTask.status === "Work Failed" ? "bg-rose-500/15 border-rose-500/20 text-rose-400" :
                      "bg-blue-500/15 border-blue-500/20 text-blue-400"
                    }`}>
                      {selectedTask.status}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold leading-snug mt-1.5">
                    {selectedTask.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTaskToDelete(selectedTask)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center border border-red-500/10 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition"
                    title="Delete task card"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTaskId(null)}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center border transition ${
                      isDark ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                
                {/* 1. Assignments Metadata */}
                <div className={`p-4.5 rounded-2xl border text-xs leading-relaxed ${
                  isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
                }`}>
                  <div className="flex flex-col gap-1.5">
                    <span className="block opacity-40 font-medium">Assigned Team Members</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTask.assignedUsers?.length > 0 ? (
                        selectedTask.assignedUsers.map((user) => (
                          <div
                            key={user}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/80"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {user}
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] opacity-40 italic">Unassigned</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Description */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" /> Task Description
                  </h4>
                  <p className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-100"
                  }`}>
                    {selectedTask.description || "No description provided for this card."}
                  </p>
                </div>

                {/* 3. Business Information */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> Business & Contact details
                  </h4>
                  <div className={`p-4.5 rounded-2xl border text-xs grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                    isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
                  }`}>
                    <div>
                      <span className="block opacity-40 font-medium">Business Name</span>
                      <span className="font-semibold block mt-0.5">{selectedTask.businessInfo?.businessName || selectedTask.businessName || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block opacity-40 font-medium">Contact Person</span>
                      <span className="font-semibold block mt-0.5">{selectedTask.businessInfo?.contactPerson || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block opacity-40 font-medium">Phone Number</span>
                      <span className="font-semibold block mt-0.5">{selectedTask.businessInfo?.phoneNumber || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block opacity-40 font-medium">Email Address</span>
                      <span className="font-semibold block mt-0.5">{selectedTask.businessInfo?.email || "N/A"}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block opacity-40 font-medium">Website/Domain</span>
                      {selectedTask.businessInfo?.website ? (
                        <a
                          href={`https://${selectedTask.businessInfo.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#a855f7] hover:underline block mt-0.5"
                        >
                          {selectedTask.businessInfo.website}
                        </a>
                      ) : (
                        <span className="font-semibold block mt-0.5">N/A</span>
                      )}
                    </div>
                    
                    {/* Requirements */}
                    {selectedTask.businessInfo?.requirements && selectedTask.businessInfo.requirements.length > 0 && (
                      <div className="sm:col-span-2 border-t border-white/5 pt-3 mt-1 space-y-1.5">
                        <span className="block opacity-40 font-medium">Slicing & Integration Requirements</span>
                        <ul className="list-disc pl-4 space-y-1 font-medium leading-relaxed">
                          {selectedTask.businessInfo.requirements.map((req, rIdx) => (
                            <li key={rIdx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Domain Information */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Domain Booking details
                  </h4>
                  <div className={`p-4.5 rounded-2xl border text-xs ${
                    isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
                  }`}>
                    <div>
                      <span className="block opacity-40 font-medium">Domain Name</span>
                      <span className="font-semibold font-mono block mt-0.5">{selectedTask.domainInfo?.domainName || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* 5. Subtasks Checklist progress */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1.5">
                    <CheckSquare className="h-3.5 w-3.5" /> Checklist Subtasks
                  </h4>
                  <div className={`p-4.5 rounded-2xl border space-y-4 ${
                    isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
                  }`}>
                    {/* Checklist items list */}
                    <div className="space-y-2">
                      {selectedTask.checklist?.length > 0 ? (
                        selectedTask.checklist.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                            <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleSubtask(item.id)}
                                className="rounded text-[#a855f7] focus:ring-[#a855f7]/30 h-4 w-4 bg-white/5 border-white/10"
                              />
                              <span className={item.completed ? "line-through opacity-55" : "font-medium"}>
                                {item.text}
                              </span>
                            </label>
                            <button
                              onClick={() => handleDeleteSubtask(item.id)}
                              className="text-white/30 hover:text-red-400 transition"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs opacity-40 italic">No checklist subtasks listed.</div>
                      )}
                    </div>

                    {/* Add Checklist Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add subtask text..."
                        value={newSubtaskText}
                        onChange={(e) => setNewSubtaskText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                        className={`flex-1 h-9 px-3 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-white/5 border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}
                      />
                      <button
                        onClick={handleAddSubtask}
                        className="px-3.5 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white text-xs font-bold active:scale-95 transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6. Attachments Configuration */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5" /> File Attachments
                  </h4>
                  <div className={`p-4.5 rounded-2xl border space-y-4 ${
                    isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
                  }`}>
                    {/* Attachment List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {selectedTask.attachments?.length > 0 ? (
                        selectedTask.attachments.map((attach, aIdx) => (
                          <a
                            key={aIdx}
                            href={attach.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs hover:border-[#a855f7]/40 transition ${
                              isDark ? "bg-[#160c2d] border-white/5" : "bg-white border-slate-200"
                            }`}
                          >
                            <Paperclip className="h-4 w-4 text-[#ff8a5b] shrink-0" />
                            <div className="truncate flex-1">
                              <span className="font-semibold block truncate leading-tight">{attach.name}</span>
                              <span className="text-[9px] opacity-40 block mt-0.5 uppercase">{attach.type || "file"}</span>
                            </div>
                          </a>
                        ))
                      ) : (
                        <div className="col-span-2 text-xs opacity-40 italic">No files attached to this card.</div>
                      )}
                    </div>

                    {/* Simulate Attachment Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="File Name (e.g. wireframe.pdf)"
                        value={newAttachmentName}
                        onChange={(e) => setNewAttachmentName(e.target.value)}
                        className={`h-9 px-3 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-white/5 border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                        }`}
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="File URL (e.g. google.drive/link)"
                          value={newAttachmentUrl}
                          onChange={(e) => setNewAttachmentUrl(e.target.value)}
                          className={`flex-1 h-9 px-3 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                            isDark ? "bg-white/5 border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        />
                        <button
                          onClick={handleAddAttachment}
                          className="px-3.5 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white text-xs font-bold active:scale-95 transition"
                        >
                          Attach
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. Comments Section */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" /> Comments Thread
                  </h4>
                  <div className={`p-4.5 rounded-2xl border space-y-4 ${
                    isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
                  }`}>
                    {/* Add Comment Input */}
                    <div className="flex gap-3 items-start">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#ff8a5b] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        JS
                      </div>
                      <div className="flex-1 space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Post collaborative feedback (@mention members)..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition resize-none ${
                            isDark ? "bg-[#180a3a]/40 border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        />
                        <button
                          onClick={handleAddComment}
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white text-[11px] font-bold active:scale-95 transition flex items-center gap-1 ml-auto"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>

                    {/* Comments list */}
                    <div className="space-y-4 pt-2 border-t border-white/5">
                      {selectedTask.comments?.length > 0 ? (
                        selectedTask.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 items-start text-xs">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#ff8a5b] flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-inner">
                              {comment.userAvatar || comment.userName.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold">{comment.userName}</span>
                                <span className="text-[9px] opacity-40 font-mono">{new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className={`p-3 rounded-xl text-xs leading-relaxed ${
                                isDark ? "bg-[#12052b]/80 text-white/90" : "bg-white border border-slate-150 text-slate-700 shadow-sm"
                              }`}>
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs opacity-40 italic text-center py-4">No comments posted yet. Start the discussion!</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 8. Activity Timeline history */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> Task Activity Timeline
                  </h4>
                  <div className={`p-4.5 rounded-2xl border space-y-4.5 ${
                    isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
                  }`}>
                    <div className="relative border-l border-white/5 pl-4 ml-2.5 space-y-4">
                      {selectedTask.activityHistory?.map((log, lIdx) => (
                        <div key={lIdx} className="relative text-xs">
                          {/* Dot indicator */}
                          <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#ff8a5b] border-2 border-slate-900" />
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-white/95">{log.action}</span>
                            <span className="text-[9px] opacity-35 font-mono">{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <span className="block text-[10px] opacity-40 mt-0.5">Performed by: {log.performedBy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <>
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-55 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6.5 select-text ${
                isDark ? "bg-[#0d0524] border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold">New Operation Task Card Setup</h3>
                  <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    Configure client requirement briefs and assign card to columns.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center border transition ${
                    isDark ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-6">
                
                {/* 1. Basic configuration fields */}
                <div className="space-y-3.5">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest opacity-40">Client & Card Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                    
                    {/* Task Title */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Task Title *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Make Slicing - ABCD Construction"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                    {/* Related Project Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Related Project Selection</label>
                      <select
                        value={formProjectId}
                        onChange={(e) => setFormProjectId(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-[#12052c] border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        <option value="">Unassigned / No Project</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>{p.projectName}</option>
                        ))}
                      </select>
                    </div>

                    {/* Client / Business Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Client / Business Name</label>
                      <input
                        type="text"
                        placeholder="e.g. ABCD Construction"
                        value={formBusName}
                        onChange={(e) => setFormBusName(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                    {/* Assigned Users */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Assigned Team Members</label>
                      <select
                        multiple
                        value={formAssignedUsers}
                        onChange={(e) => {
                          const options = e.target.options;
                          const values: string[] = [];
                          for (let i = 0; i < options.length; i++) {
                            if (options[i].selected) {
                              values.push(options[i].value);
                            }
                          }
                          setFormAssignedUsers(values);
                        }}
                        className={`w-full h-24 p-2 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-[#12052c] border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        {TEAM_MEMBERS.map((m) => (
                          <option key={m.name} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                      <span className="text-[8px] opacity-40 block mt-1">Hold Cmd/Ctrl to assign multiple members.</span>
                    </div>

                    {/* Priority & Tags */}
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Priority Level</label>
                        <select
                          value={formPriority}
                          onChange={(e) => setFormPriority(e.target.value as any)}
                          className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                            isDark ? "bg-[#12052c] border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Tags / Labels (comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Slicing, Responsive, SEO"
                          value={formTags}
                          onChange={(e) => setFormTags(e.target.value)}
                          className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                            isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Task Description</label>
                      <textarea
                        rows={2}
                        placeholder="Enter general task descriptions..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className={`w-full p-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition resize-none ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                  </div>
                </div>



                {/* 3. Business Information */}
                <div className="space-y-3.5 border-t border-white/5 pt-5">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest opacity-40">Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Contact Person</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={formBusContact}
                        onChange={(e) => setFormBusContact(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. (000) 000-0000"
                        value={formBusPhone}
                        onChange={(e) => setFormBusPhone(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. example@email.com"
                        value={formBusEmail}
                        onChange={(e) => setFormBusEmail(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Website URL</label>
                      <input
                        type="text"
                        placeholder="e.g. abcdconstruction.com"
                        value={formBusWebsite}
                        onChange={(e) => setFormBusWebsite(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Project Requirements (Line-by-line)</label>
                      <textarea
                        rows={3}
                        placeholder="e.g.&#10;Create pixel-perfect HTML slicing.&#10;Ensure responsiveness for all screen sizes.&#10;Optimize images and performance."
                        value={formBusRequirements}
                        onChange={(e) => setFormBusRequirements(e.target.value)}
                        className={`w-full p-3 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition resize-none ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                  </div>
                </div>

                {/* 4. Domain Information */}
                <div className="space-y-3.5 border-t border-white/5 pt-5">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest opacity-40">Domain / DNS booking Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Domain Name</label>
                      <input
                        type="text"
                        placeholder="e.g. abcdconstruction.com"
                        value={formDomName}
                        onChange={(e) => setFormDomName(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                          isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>

                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end gap-3.5 border-t border-white/5 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className={`h-10 px-6.5 rounded-xl border text-xs font-bold transition ${
                      isDark ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-7.5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]"
                  >
                    Register Task Card
                  </button>
                </div>

              </form>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Confirm Delete Modal */}
      <AnimatePresence>
        {taskToDelete && (
          <div className="fixed inset-0 z-55 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTaskToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl z-55 backdrop-blur-xl ${
                isDark
                  ? "bg-[#0d0524]/95 border-white/10 text-white shadow-red-950/10"
                  : "bg-white border-slate-200 text-slate-800 shadow-slate-400/20"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4 animate-pulse">
                  <Trash2 className="h-6 w-6" />
                </div>
                
                <h3 className="font-serif text-base font-bold">Delete Task Card</h3>
                <p className={`text-xs mt-2 leading-relaxed ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  Are you sure you want to permanently delete this task card? This action is irreversible.
                </p>

                <div className="flex items-center gap-3 w-full mt-6">
                  <button
                    onClick={() => setTaskToDelete(null)}
                    className={`flex-1 py-2.5 rounded-full text-xs font-semibold border transition ${
                      isDark ? "border-white/5 bg-white/5 text-white/70 hover:bg-white/10" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteTask(taskToDelete.id);
                      setTaskToDelete(null);
                    }}
                    className="flex-1 py-2.5 rounded-full text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/10 transition active:scale-[0.98]"
                  >
                    Delete Card
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
