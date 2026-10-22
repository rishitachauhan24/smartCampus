import Issue from "../models/Issue.js";

export const getPublicIssues = async (
  _req,
  res,
  next
) => {

  try {

    const issues = await Issue.find({
      status: {
        $ne: "Resolved"
      }
    })

      .select(
        "title category location priority status createdAt"
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