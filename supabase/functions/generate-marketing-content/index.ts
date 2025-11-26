import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productTitle, description, category, targetAudience } = await req.json();

    // Validation
    if (!productTitle || typeof productTitle !== 'string' || productTitle.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Product title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Product description is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (productTitle.length > 200 || description.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Input too long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `You are a social media marketing expert for artisan crafts. Create engaging marketing content for different platforms.

Product Information:
- Title: ${productTitle}
- Description: ${description}
- Category: ${category || 'Handcrafted'}
- Target Audience: ${targetAudience || 'Craft enthusiasts'}

Generate marketing content for:

1. INSTAGRAM CAPTION (100-150 words):
- Start with an attention-grabbing hook
- Include 5-8 relevant hashtags
- Emoji usage for visual appeal
- Call-to-action at the end

2. FACEBOOK POST (150-200 words):
- More detailed storytelling
- Engaging question to encourage comments
- Include hashtags
- Clear call-to-action

3. EMAIL CAMPAIGN (200-250 words):
- Compelling subject line at the start
- Personalized greeting
- Product benefits and story
- Urgency or special offer hint
- Clear purchase link placeholder

Format your response as JSON:
{
  "instagram": "...",
  "facebook": "...",
  "email": "..."
}`;

    console.log('Calling Gemini API for marketing content...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1200,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to generate marketing content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Try to parse as JSON
    let content;
    try {
      // Extract JSON from response (might be wrapped in markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create structured content from text
        content = {
          instagram: aiResponse.substring(0, 500),
          facebook: aiResponse.substring(0, 700),
          email: aiResponse
        };
      }
    } catch {
      // If parsing fails, use the raw response
      content = {
        instagram: aiResponse.substring(0, 500) + "\n\n#handcrafted #artisan #handmade #shoplocal #supportartisans",
        facebook: aiResponse.substring(0, 700) + "\n\nWhat do you think? Comment below! 👇",
        email: `Subject: Discover This Beautiful Handcrafted Treasure\n\n${aiResponse}`
      };
    }

    console.log('Marketing content generated successfully');

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-marketing-content function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
