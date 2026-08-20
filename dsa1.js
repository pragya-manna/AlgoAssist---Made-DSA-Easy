import express from "express";
    import cors from "cors";
    import { GoogleGenAI } from "@google/genai";


    const app = express();
    const port = 5000;

    app.use(cors());
    app.use(express.json());
    

    const ai = new GoogleGenAI({
      apiKey: "YOUR API"
    });

    

    app.post("/ask", async (req, res) => {
  const { question } = req.body;
  const chatMemory = req.body.chatMemory ?? [];

  if (!Array.isArray(chatMemory)) {
    return res.status(400).json({ error: "chatMemory must be an array" });
  }

  const fullConversation = [
    ...chatMemory,
    { role: "user", parts: [{ text: question }] },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullConversation,
      config: {
      systemInstruction: "You are AlgoAssist, a DSA mentoring assistant.For every query, follow this base format:1. Question: Restate the problem clearly.2. Solution: Provide a detailed, step-by-step explanation of the logic and reasoning. Use bullet points or numbered steps when needed.3. Diagram: If helpful, include an ASCII diagram, flowchart, dry-run table, or pseudocode representation.4. Example: Give at least one worked-out example with input and output.5. More Related Questions: Suggest 3–5 similar or progressively harder problems for further practice. Additional Sections:1) If the problem is algorithm-based, add Time Complexity and Space Complexity.2) If the problem is math-based, add Formula Derivation.3) If the problem is conceptual/theoretical, add Key Notes or Summary Table.4) If the problem requires code, add a Code Implementation section with clean, commented code.5) If the problem is error-debugging type, add a Bug Explanation and Fixed Code section.6) Adapt the structure depending on the question type but keep the core flow intact. The tone should be friendly and mentoring, like a tutor guiding a student."
    },
    });

    const modelReply = response.text;

    const updatedMemory = [
      ...fullConversation,
      { role: "model", parts: [{ text: modelReply }] },
    ];

    res.json({ answer: modelReply, updatedMemory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  app.get("/history",(req,res) =>{
    res.json({history:History});
  });
  app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
  });






let chats = [];
let currentChat = [];

function newChat() {
  if (currentChat.length > 0) chats.push([...currentChat]);
  currentChat = [];
  chatWindow.innerHTML = "";
}

async function handleSend() {
  const question = input.value.trim();
  if (!question) return;

  showMessage("user", question);

  // send existing conversation + new question
  const res = await fetch("http://localhost:5000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, chatMemory: currentChat }),
  });

  const data = await res.json();

  // ✅ Save full updated conversation (old + new Q&A)
  currentChat = data.updatedMemory;

  // show model's response
  showMessage("model", data.answer);

  // ✅ Optional: Log to see if it's working
  console.log("Full Chat Memory Now:", currentChat);
} 