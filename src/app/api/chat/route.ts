import { createClient } from '@/utils/supabase/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  console.log('--- Chat API Route Started ---');
  try {
    const { messages, conversationId } = await req.json();
    console.log(`--- [API/CHAT] Incoming Request ---`);
    console.log(`Conversation ID: ${conversationId}`);
    console.log(`Messages Count: ${messages?.length || 0}`);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Unauthorized: No user found');
      return new Response('Unauthorized', { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    console.log(`Calling Backend: ${backendUrl}/chat`);

    const enhancedMessages = [...messages];
    if (enhancedMessages.length > 0 && enhancedMessages[enhancedMessages.length - 1].role === 'user') {
        const strictPrompt = `

### SYSTEM INSTRUCTION — MED-VOICE CLINICAL ENGINE v2.0 ###
You are the AI MED-VOICE Senior Diagnostic Specialist. You MUST respond with a single, valid JSON object.
No conversational filler. No markdown outside the JSON. No backticks. Output ONLY the JSON.

REQUIRED JSON STRUCTURE (all fields are MANDATORY):
{
  "specialty": "The single most relevant medical specialty (e.g., 'Neurologist', 'Cardiologist', 'General Physician').",
  "diagnosis": "A concise 1-2 sentence primary clinical impression.",
  "clinical_evaluation": {
    "symptom_pathophysiology": "Write 3-5 sentences explaining the underlying biological and physiological mechanisms that explain WHY these specific symptoms are occurring. Reference relevant organ systems, receptors, or biochemical pathways (e.g., histamine cascade, vagal tone, neuroinflammation). Be precise and educational.",
    "differential_considerations": "List 3-5 plausible medical conditions that match the symptom profile. For each, write one sentence explaining the clinical rationale. FORMAT: '1. [Condition Name]: [Rationale]. 2. [Condition Name]: [Rationale]...' END with a bold disclaimer: DISCLAIMER: This AI output is for educational purposes only and does NOT constitute a medical diagnosis. Always consult a licensed physician.",
    "urgency_triaging": "Categorize as exactly one of: ROUTINE / URGENT / EMERGENCY. Then explain in 3-4 sentences the clinical reasoning for this categorization, including specific red-flag symptoms to watch for that would change the triage level.",
    "pharmacist_notes": "Provide 3-5 sentences relevant to a US pharmacy context. Include: potential drug classes that are commonly prescribed for this condition (e.g., NSAIDs, SSRIs, ACE inhibitors), common OTC options available without prescription, any critical drug-drug interaction warnings, and relevant FDA black-box warnings if applicable. Do NOT recommend specific dosages."
  },
  "home_remedies": [
    { "title": "Remedy Name", "description": "Step-by-step instruction.", "clinical_logic": "Evidence-based reasoning from peer-reviewed sources." }
  ],
  "medical_treatments": [
    { "title": "Treatment / Drug Class", "description": "How it is typically used.", "clinical_logic": "Mechanism of action and evidence grade." }
  ],
  "doctors": [],
  "chat_response": "A direct, compassionate 1-2 sentence response to the patient summarizing your assessment."
}

CRITICAL RULES:
- The "clinical_evaluation" object MUST always be present and fully populated. Never omit any sub-key.
- If input is unclear, still populate all fields with your best inference and note uncertainty.
- "urgency_triaging" must start with exactly one of the three labels: ROUTINE, URGENT, or EMERGENCY in capital letters.
- Keep "differential_considerations" strictly fact-based with the disclaimer at the end.
### END INSTRUCTION ###`;

        enhancedMessages[enhancedMessages.length - 1].content =
            enhancedMessages[enhancedMessages.length - 1].content + strictPrompt;
    }

    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: enhancedMessages,
        conversation_id: conversationId,
        user_id: user.id
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend Error (${response.status}):`, errorText);
      throw new Error(`Backend error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Backend response received successfully');
    
    // 1. Resolve Conversation ID
    let currentConvId = conversationId || data.conversation_id;
    if (!currentConvId) {
        const newId = crypto.randomUUID();
        // Create conversation
        const title = messages[messages.length - 1].content.substring(0, 50) + '...';
        await supabase.from('conversations').insert({
            id: newId,
            user_id: user.id,
            title: title
        });
        currentConvId = newId;
    }

    const assistantContent = data.messages[data.messages.length - 1].content;

    // 2. Persist Messages to Supabase
    // Save User Message
    const lastUserMsg = messages[messages.length - 1];
    await supabase.from('messages').insert({
        conversation_id: currentConvId,
        role: 'user',
        content: lastUserMsg.content,
        user_id: user.id
    });

    // Save Assistant Message
    await supabase.from('messages').insert({
        conversation_id: currentConvId,
        role: 'assistant',
        content: assistantContent,
        user_id: user.id
    });

    // 3. Return response with stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(assistantContent));
            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'x-conversation-id': currentConvId
        }
    });

  } catch (error: any) {
    console.error('Chat API Route Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
