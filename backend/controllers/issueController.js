import Issue, {
  ISSUE_CATEGORIES,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES
} from "../models/Issue.js";

import User from "../models/User.js";

import { logActivity } from "../utils/activity.js";

import { analyzeIssueWithAI } from "../utils/gemini.js";


const buildIssueQuery = (req) => {

  const query = {};

  if (req.user.role === "student") {
    query.reportedBy = req.user._id;
  }

  if (req.user.role === "staff") {
    query.assignedTo = req.user._id;
  }

  return query;
};


export const createIssue = async (req, res, next) => {

  try {

    const {
      title,
      description,
      category,
      location,
      priority,
      isAnonymous
    } = req.body;


    if (
      !title ||
      !description ||
      !category ||
      !location
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Title, description, category and location are required"
      });

    }


    if (!ISSUE_CATEGORIES.includes(category)) {

      return res.status(400).json({
        success: false,
        message:
          `Invalid category. Use one of: ${ISSUE_CATEGORIES.join(", ")}`
      });

    }


    if (
      priority &&
      !ISSUE_PRIORITIES.includes(priority)
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid priority"
      });

    }


    const issue = await Issue.create({

      title,

      description,

      category,

      location,

      priority: priority || "Medium",

      isAnonymous:
        isAnonymous === true ||
        isAnonymous === "true",

      imageUrl:
        req.file
          ? `/uploads/${req.file.filename}`
          : "",

      reportedBy: req.user._id

    });


    await logActivity({

      user: req.user._id,

      issue: issue._id,

      action: "ISSUE_CREATED",

      details: issue.title

    });


    const populated = await Issue.findById(
      issue._id
    )
      .populate(
        "reportedBy",
        "name email role"
      )
      .populate(
        "assignedTo",
        "name email role department"
      );


    res.status(201).json({

      success: true,

      message: "Issue created successfully",

      issue: populated

    });

  } catch (error) {

    next(error);

  }

};


export const getIssues = async (req, res, next) => {

  try {

    const query = buildIssueQuery(req);

    const {
      status,
      category,
      priority
    } = req.query;


    if (
      status &&
      ISSUE_STATUSES.includes(status)
    ) {
      query.status = status;
    }


    if (
      category &&
      ISSUE_CATEGORIES.includes(category)
    ) {
      query.category = category;
    }


    if (
      priority &&
      ISSUE_PRIORITIES.includes(priority)
    ) {
      query.priority = priority;
    }


    const issues = await Issue.find(query)

      .populate(
        "reportedBy",
        "name email role"
      )

      .populate(
        "assignedTo",
        "name email role department"
      )

      .sort({
        createdAt: -1
      });


    res.json({

      success: true,

      count: issues.length,

      issues

    });

  } catch (error) {

    next(error);

  }

};


export const getIssueById = async (
  req,
  res,
  next
) => {

  try {

    const issue = await Issue.findById(
      req.params.id
    )

      .populate(
        "reportedBy",
        "name email role"
      )

      .populate(
        "assignedTo",
        "name email role department"
      );


    if (!issue) {

      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });

    }


    const canView =
      req.user.role !== "student" ||
      issue.reportedBy._id.toString() ===
        req.user._id.toString();


    if (!canView) {

      return res.status(403).json({
        success: false,
        message: "You cannot view this issue"
      });

    }


    res.json({
      success: true,
      issue
    });

  } catch (error) {

    next(error);

  }

};


export const updateIssueStatus = async (
  req,
  res,
  next
) => {

  try {

    const { status } = req.body;


    if (!ISSUE_STATUSES.includes(status)) {

      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });

    }


    const issue = await Issue.findById(
      req.params.id
    );


    if (!issue) {

      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });

    }


    if (
      req.user.role === "staff" &&
      (
        !issue.assignedTo ||
        issue.assignedTo.toString() !==
          req.user._id.toString()
      )
    ) {

      return res.status(403).json({
        success: false,
        message: "Issue is not assigned to you"
      });

    }


    issue.status = status;


    if (status === "Resolved") {
      issue.resolvedAt = new Date();
    } else {
      issue.resolvedAt = null;
    }


    await issue.save();


    await logActivity({

      user: req.user._id,

      issue: issue._id,

      action: "STATUS_UPDATED",

      details: status

    });


    res.json({

      success: true,

      message: "Status updated",

      issue

    });

  } catch (error) {

    next(error);

  }

};


export const assignIssue = async (
  req,
  res,
  next
) => {

  try {

    const { staffId } = req.body;


    const staff = await User.findOne({

      _id: staffId,

      role: "staff"

    });


    if (!staff) {

      return res.status(404).json({
        success: false,
        message: "Staff member not found"
      });

    }


    const issue = await Issue.findById(
      req.params.id
    );


    if (!issue) {

      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });

    }


    issue.assignedTo = staff._id;


    if (issue.status === "Pending") {
      issue.status = "Assigned";
    }


    await issue.save();


    await logActivity({

      user: req.user._id,

      issue: issue._id,

      action: "STAFF_ASSIGNED",

      details: staff.name

    });


    const populated = await Issue.findById(
      issue._id
    ).populate(
      "assignedTo",
      "name email role department"
    );


    res.json({

      success: true,

      message: "Issue assigned successfully",

      issue: populated

    });

  } catch (error) {

    next(error);

  }

};


export const getStaff = async (
  _req,
  res,
  next
) => {

  try {

    const staff = await User.find({
      role: "staff"
    })
      .select(
        "name email department"
      )
      .sort({
        name: 1
      });


    res.json({
      success: true,
      staff
    });

  } catch (error) {

    next(error);

  }

};


export const runIssueAI = async (
  req,
  res,
  next
) => {

  try {

    const issue = await Issue.findById(
      req.params.id
    );


    if (!issue) {

      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });

    }


    const result =
      await analyzeIssueWithAI({

        title: issue.title,

        description:
          issue.description,

        location:
          issue.location

      });


    if (
      ISSUE_CATEGORIES.includes(
        result.category
      )
    ) {
      issue.category =
        result.category;
    }


    if (
      ISSUE_PRIORITIES.includes(
        result.priority
      )
    ) {
      issue.priority =
        result.priority;
    }


    issue.aiSummary =
      result.summary || "";

    issue.aiSuggestedAction =
      result.suggestedAction || "";

    issue.aiReason =
      result.reason || "";


    await issue.save();


    await logActivity({

      user: req.user._id,

      issue: issue._id,

      action: "AI_ANALYZED",

      details:
        "AI analysis completed"

    });


    res.json({

      success: true,

      message:
        "AI analysis completed",

      ai: result,

      issue

    });

  } catch (error) {

    next(error);

  }

};


export const generateIssueSuggestions = async (
  req,
  res,
  next
) => {

  try {

    const issue = await Issue.findById(
      req.params.id
    );


    if (!issue) {

      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });

    }


    const canGenerateSuggestions =
      req.user.role === "admin" ||
      (req.user.role === "student" &&
        issue.reportedBy.toString() ===
          req.user._id.toString()) ||
      (req.user.role === "staff" &&
        issue.assignedTo?.toString() ===
          req.user._id.toString());


    if (!canGenerateSuggestions) {

      return res.status(403).json({
        success: false,
        message: "You cannot generate suggestions for this issue"
      });

    }


    const result = await analyzeIssueWithAI({
      title: issue.title,
      description: issue.description,
      location: issue.location
    });


    issue.aiSummary = result.summary || "";
    issue.aiSuggestedAction = result.suggestedAction || "";
    issue.aiReason = result.reason || "";

    await issue.save();
    await issue.populate("assignedTo", "name email role department");


    res.json({
      success: true,
      issue
    });

  } catch (error) {

    next(error);

  }

};