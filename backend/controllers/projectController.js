import crypto from "crypto";
import Project from "../models/Project.js";
import Note from "../models/Note.js";
import Contribution from "../models/Contribution.js";
import User from "../models/User.js";
import { askGemini } from "../utils/gemini.js";
import { sendProjectInvitation } from "../utils/mailer.js";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "project";

const projectId = (project) => project._id.toString();

const getProject = async (id) =>
  Project.findById(id)
    .populate("owner", "name email role")
    .populate("members.user", "name email role department");

const isMember = (project, userId) =>
  project.members.some((member) => member.user._id.toString() === userId.toString());

const isOwner = (project, userId) =>
  project.owner._id.toString() === userId.toString();

const requireMember = async (req, res) => {
  const project = await getProject(req.params.id);

  if (!project) {
    res.status(404).json({ success: false, message: "Project not found" });
    return null;
  }

  if (!isMember(project, req.user._id)) {
    res.status(403).json({ success: false, message: "Join this project to access it" });
    return null;
  }

  return project;
};

const addContribution = (data) => Contribution.create(data);

export const listProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      "members.user": req.user._id
    })
      .populate("owner", "name email role")
      .populate("members.user", "name email role")
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description = "", visibility = "private", tags = [] } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let suffix = 1;

    while (await Project.exists({ slug })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      visibility: visibility === "public" ? "public" : "private",
      tags: Array.isArray(tags) ? tags.slice(0, 10) : [],
      slug,
      shareToken: crypto.randomBytes(18).toString("hex"),
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }]
    });

    await addContribution({
      project: project._id,
      user: req.user._id,
      type: "PROJECT_CREATED",
      details: project.name
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: await getProject(project._id)
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectDetails = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;

    const [notes, files, contributionCount] = await Promise.all([
      Note.find({ project: project._id })
        .populate("createdBy updatedBy", "name email")
        .sort({ updatedAt: -1 }),
      Contribution.find({ project: project._id })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(20),
      Contribution.countDocuments({ project: project._id })
    ]);

    res.json({ success: true, project, notes, files: project.files || [], contributionCount });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;

    if (!isOwner(project, req.user._id)) {
      return res.status(403).json({ success: false, message: "Only the project owner can update project settings" });
    }

    const { name, description, visibility, tags } = req.body;
    if (name !== undefined) project.name = name.trim();
    if (description !== undefined) project.description = description;
    if (visibility !== undefined) project.visibility = visibility === "public" ? "public" : "private";
    if (Array.isArray(tags)) project.tags = tags.slice(0, 10);

    await project.save();
    res.json({ success: true, message: "Project updated", project: await getProject(project._id) });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;

    if (!isOwner(project, req.user._id)) {
      return res.status(403).json({ success: false, message: "Only the project owner can manage members" });
    }

    const email = req.body.email?.trim().toLowerCase();
    const { userId } = req.body;

    if (!email && !userId) {
      return res.status(400).json({ success: false, message: "Member email is required" });
    }

    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ email });

    if (!user) {
      try {
        await sendProjectInvitation({ email, project, inviterName: req.user.name });
        return res.status(202).json({ success: true, invited: true, message: "Invitation email sent" });
      } catch (error) {
        if (error.message?.startsWith("Email service is not configured")) {
          return res.status(503).json({
            success: false,
            message: "This email is not registered. Configure SMTP in backend/.env to send an invitation."
          });
        }
        throw error;
      }
    }

    if (isMember(project, user._id)) {
      return res.status(409).json({ success: false, message: "User is already a project member" });
    }

    project.members.push({ user: user._id, role: "collaborator" });
    await project.save();
    await addContribution({ project: project._id, user: req.user._id, type: "MEMBER_ADDED", details: user.name });

    let message = "Member added.";
    try {
      await sendProjectInvitation({ email: user.email, project, inviterName: req.user.name });
      message = "Member added and invitation email sent.";
    } catch (error) {
      if (!error.message?.startsWith("Email service is not configured")) throw error;
      message = "Member added. Email invitation is unavailable until SMTP is configured.";
    }

    res.status(201).json({ success: true, message, project: await getProject(project._id) });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;

    if (!isOwner(project, req.user._id)) {
      return res.status(403).json({ success: false, message: "Only the project owner can manage members" });
    }

    const memberId = req.params.userId;
    if (memberId === project.owner._id.toString()) {
      return res.status(400).json({ success: false, message: "The project owner cannot be removed" });
    }

    project.members = project.members.filter((member) => member.user._id.toString() !== memberId);
    await project.save();
    res.json({ success: true, message: "Member removed", project: await getProject(project._id) });
  } catch (error) {
    next(error);
  }
};

export const listNotes = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;

    const notes = await Note.find({ project: project._id })
      .populate("createdBy updatedBy", "name email")
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;

    const { title, content = "" } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Note title is required" });
    }

    const note = await Note.create({
      project: project._id,
      title: title.trim(),
      content,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    await addContribution({ project: project._id, user: req.user._id, type: "NOTE_CREATED", note: note._id, details: note.title });
    res.status(201).json({ success: true, message: "Note created", note: await Note.findById(note._id).populate("createdBy updatedBy", "name email") });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;

    const note = await Note.findOne({ _id: req.params.noteId, project: project._id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    const { title, content } = req.body;
    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content;
    note.updatedBy = req.user._id;
    await note.save();
    await addContribution({ project: project._id, user: req.user._id, type: "NOTE_UPDATED", note: note._id, details: note.title });

    res.json({ success: true, message: "Note updated", note: await Note.findById(note._id).populate("createdBy updatedBy", "name email") });
  } catch (error) {
    next(error);
  }
};

export const summarizeNote = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;

    const note = await Note.findOne({ _id: req.params.noteId, project: project._id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    const summary = await askGemini(`Summarize this project markdown note in 3 concise bullet points. Do not invent facts.\n\nTitle: ${note.title}\n\n${note.content}`);
    note.aiSummary = summary;
    note.updatedBy = req.user._id;
    await note.save();

    res.json({ success: true, summary, note });
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;
    if (!req.file) return res.status(400).json({ success: false, message: "A file is required" });

    const file = {
      id: crypto.randomUUID(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      url: `/uploads/projects/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    };

    project.files = [...(project.files || []), file];
    await project.save();
    await addContribution({ project: project._id, user: req.user._id, type: "FILE_UPLOADED", details: file.originalName });

    res.status(201).json({ success: true, message: "File uploaded", file });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const project = await requireMember(req, res);
    if (!project) return;

    const [byUser, byType, recent] = await Promise.all([
      Contribution.aggregate([
        { $match: { project: project._id } },
        { $group: { _id: "$user", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $project: { count: 1, user: { name: "$user.name", email: "$user.email" } } }
      ]),
      Contribution.aggregate([
        { $match: { project: project._id } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Contribution.find({ project: project._id }).populate("user", "name email").sort({ createdAt: -1 }).limit(10)
    ]);

    res.json({ success: true, summary: { total: await Contribution.countDocuments({ project: project._id }), members: project.members.length }, byUser, byType, recent });
  } catch (error) {
    next(error);
  }
};

export const getPublicProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      $or: [{ slug: req.params.slug }, { shareToken: req.params.slug }],
      visibility: "public"
    }).populate("owner", "name").populate("members.user", "name");

    if (!project) return res.status(404).json({ success: false, message: "Public project not found" });

    const [notes, files] = await Promise.all([
      Note.find({ project: project._id }).select("title content aiSummary createdAt updatedAt").sort({ updatedAt: -1 }),
      Project.findById(project._id).select("files")
    ]);

    res.json({ success: true, project, notes, files: files?.files || [] });
  } catch (error) {
    next(error);
  }
};
