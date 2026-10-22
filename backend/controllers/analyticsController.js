import Issue from "../models/Issue.js";
import Activity from "../models/Activity.js";

export const getAnalytics = async (
  _req,
  res,
  next
) => {

  try {

    const totalIssues =
      await Issue.countDocuments();


    const pending =
      await Issue.countDocuments({
        status: "Pending"
      });


    const assigned =
      await Issue.countDocuments({
        status: "Assigned"
      });


    const inProgress =
      await Issue.countDocuments({
        status: "In Progress"
      });


    const resolved =
      await Issue.countDocuments({
        status: "Resolved"
      });


    const categoryStats =
      await Issue.aggregate([

        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        },

        {
          $sort: {
            count: -1
          }
        }

      ]);


    const priorityStats =
      await Issue.aggregate([

        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 }
          }
        },

        {
          $sort: {
            count: -1
          }
        }

      ]);


    const locationStats =
      await Issue.aggregate([

        {
          $group: {
            _id: "$location",
            count: { $sum: 1 }
          }
        },

        {
          $sort: {
            count: -1
          }
        },

        {
          $limit: 10
        }

      ]);


    const recentActivities =
      await Activity.find()

        .populate(
          "user",
          "name role"
        )

        .populate(
          "issue",
          "title"
        )

        .sort({
          createdAt: -1
        })

        .limit(10);


    res.json({

      success: true,

      summary: {
        totalIssues,
        pending,
        assigned,
        inProgress,
        resolved
      },

      categoryStats,

      priorityStats,

      locationStats,

      recentActivities

    });

  } catch (error) {

    next(error);

  }

};