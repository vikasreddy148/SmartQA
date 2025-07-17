const axios = require("axios");

const callGemini = async (questions) => {
  const prompt = `
      Given the following list of questions from an audience, group them if they are similar, and return a sorted list with most frequently asked or relevant questions aummarized

      ${questions
        .map((ques, index) => `${index + 1}. ${ques.content}`)
        .join("\n")}

      Respond with only the summarized list, one per line.
    `;
  const url ="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };
  const requestHeaders = {
    headers:{
      "Content-Type": "application/json",
      "X-goog-api-key": process.env.GEMINI_API_KEY,
    }
  };

  const response = await axios.post(url,requestBody,requestHeaders);

  const text =  response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return text.split("\n").filter((line)=>line.trim() !== "");

};

module.exports = { callGemini };
