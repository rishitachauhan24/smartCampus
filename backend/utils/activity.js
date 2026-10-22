import Activity from "../models/Activity.js";

export const logActivity = async ({
  user,
  issue = null,
  action,
  details = ""
}) => {

  try {

    await Activity.create({
      user,
      issue,
      action,
      details
    });

  } catch (error) {

    console.error(
      "Activity log failed:",
      error.message
    );

  }
};