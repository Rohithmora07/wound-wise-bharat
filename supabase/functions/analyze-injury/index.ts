import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Strip data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const systemPrompt = `You are an emergency first-aid injury assessment AI for India. Analyze the image and respond ONLY with a JSON object (no markdown, no explanation).

IMPORTANT RULES:
1. If the image does NOT show a physical injury (e.g. it's a selfie, landscape, food, object, text, etc.), respond with:
{"isInjury": false}

2. If the image DOES show a physical injury, respond with:
{
  "isInjury": true,
  "injuryType": "Brief injury name in English",
  "injuryTypeHi": "Brief injury name in Hindi",
  "severity": "critical" | "moderate" | "minor",
  "confidence": 50-99,
  "nextAction": "1-2 sentence first-aid action in English",
  "nextActionHi": "Same first-aid action in Hindi",
  "remedySteps": [
    {"icon": "emoji", "en": "Step in English", "hi": "Step in Hindi"},
    ...
  ]
}

The "remedySteps" array MUST contain 4-6 specific, actionable first-aid steps tailored to the EXACT injury shown. Each step must be different and specific to the injury type. Examples:

For a burn: clean water cooling, no ice, no butter/toothpaste, cover with clean cloth, pain relief, when to see doctor.
For a cut: apply pressure, clean wound, antiseptic, bandage, tetanus warning, elevation.
For a fracture: immobilize, do not move, splint if possible, ice pack, call ambulance.
For a sprain: RICE method steps (Rest, Ice, Compress, Elevate).
For a bruise: ice pack, rest, elevation, monitor for worsening.

Do NOT give generic steps. Each remedy must be specific to the injury you identified.

Severity guidelines:
- critical: Deep cuts with heavy bleeding, severe burns, suspected spinal/head injuries, compound fractures
- moderate: Sprains, simple fractures, moderate burns, wounds needing stitches
- minor: Scrapes, small cuts, bruises, minor burns

Be conservative with confidence scores. Never claim 100% confidence.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${base64Data}` },
                },
                {
                  type: "text",
                  text: "Analyze this image. Is it a physical injury? If yes, assess severity and provide first-aid guidance.",
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the AI response (strip markdown fences if any)
    const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(jsonStr);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-injury error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
