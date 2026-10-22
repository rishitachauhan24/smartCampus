import { askGemini } from "../utils/gemini.js";


export const generateSummary = async (
  req,
  res,
  next
) => {

  try {

    const { text } = req.body;


    if (!text) {

      return res.status(400).json({

        success: false,

        message: "Text is required"

      });

    }


    const result =
      await askGemini(`

Summarize this college campus problem
in 2-3 short sentences.

Do not invent facts.

Problem:

${text}

`);


    res.json({

      success: true,

      result

    });

  } catch (error) {

    next(error);

  }

};


export const suggestAction = async (
  req,
  res,
  next
) => {

  try {

    const {
      text,
      category,
      location
    } = req.body;


    if (!text) {

      return res.status(400).json({

        success: false,

        message: "Text is required"

      });

    }


    const result =
      await askGemini(`

You are helping college campus staff.

Suggest practical next steps
for this campus problem.

Do not invent facts.

Problem:
${text}

Category:
${category || "Unknown"}

Location:
${location || "Unknown"}

Give 3-5 clear action steps.

`);


    res.json({

      success: true,

      result

    });

  } catch (error) {

    next(error);

  }

};