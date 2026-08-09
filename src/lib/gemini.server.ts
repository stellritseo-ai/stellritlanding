// Using Groq API instead of Gemini, keeping the filename the same to avoid breaking imports
const apiKey = process.env.GROQ_API_KEY || (import.meta.env as any).GROQ_API_KEY || (import.meta.env as any).VITE_GROQ_API_KEY || "";

export const isAIAvailable = !!apiKey;


export async function generateAIResponse(
  chatHistory: { sender: string; text: string }[],
  userMessage: string,
  visitorName: string = "there"
): Promise<{ text?: string; functionCall?: { name: string } }> {
  if (!apiKey) {
    return { text: "AI is currently offline (API key missing). Please wait for a human agent." };
  }

  const systemInstruction = `
You are the official AI sales assistant for StellR IT LLC. The person you are talking to is named ${visitorName}.
StellR IT is an enterprise digital transformation agency specializing in:
- UX Research & Strategy
- Brand Identity
- Web & Product Design
- Web Development
- Digital Marketing & CRO
- AI Software Development & Automation

Your goal is to qualify leads, gather requirements, and seamlessly schedule a follow-up call.
Follow this STRICT conversational flow:

1. WHEN ASKED ABOUT PRICING OR SERVICES: 
   Do NOT give a direct price immediately. First, ask them to clarify their requirements:
   - Which platform or technology they want to choose
   - Specific details about the service they need
   - Important details about their business

2. AFTER THEY PROVIDE THEIR REQUIREMENTS:
   Give them a rough estimate based on standard USA market pricing for premium digital services (e.g., custom websites range from $5,000 - $15,000+, apps from $15,000+, marketing from $2,000/mo). 
   Then tell them their project sounds great, and ask for their phone number so one of our experts can call them in exactly 10 minutes to discuss a precise quote.

3. ONCE THEY PROVIDE A PHONE NUMBER:
   Use the 'schedule_callback' tool.

4. AFTER AN APPOINTMENT IS BOOKED OR HUMAN IS REQUESTED:
   If the user says "thank you", "thanks", or acknowledges the booking, DO NOT use any tools. Simply reply with: "Great talking to you ${visitorName}, thank you and have a nice day!"

If a user is angry, explicitly demands a human immediately, or has a complex request you cannot handle, use the 'request_human' tool.
Keep your answers polite, conversational, and short.
`;

const tools = [
  {
    type: "function",
    function: {
      name: "schedule_callback",
      description: "Call this ONLY AFTER the user has provided their phone number to book the 10-minute callback.",
      parameters: { 
        type: "object", 
        properties: {
          phoneNumber: { type: "string", description: "The phone number provided by the user" }
        },
        required: ["phoneNumber"]
      },
    }
  },
  {
    type: "function",
    function: {
      name: "request_human",
      description: "Use this when the user explicitly asks for a human, is frustrated, or needs complex support.",
      parameters: { type: "object", properties: {} },
    }
  }
];



  try {
    const messages: any[] = [{ role: "system", content: systemInstruction }];
    
    for (const msg of chatHistory) {
      // Ignore debug messages and system messages
      if (msg.text.startsWith("[DEBUG")) continue;
      
      messages.push({
        role: msg.sender === "admin" ? "assistant" : "user",
        content: msg.text
      });
    }

    messages.push({ role: "user", content: userMessage });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        tools,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[AI] Groq fetch error:", errText);
      throw new Error(`Groq API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0]?.message;
    
    if (choice?.tool_calls?.length > 0) {
      const toolCall = choice.tool_calls[0].function;
      return { functionCall: { name: toolCall.name } };
    }
    
    if (choice?.content) {
      return { text: choice.content };
    }

    return { text: "I am currently unable to process your request." };
  } catch (error: any) {
    console.error("Groq Error:", error);
    throw new Error(error.message || "Unknown AI error");
  }
}
