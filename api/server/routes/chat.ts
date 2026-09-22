import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const SYSTEM_PROMPT = `You are SiteFlow AI — a fast, intelligent, and adaptable website builder chatbot.

Rules:
- Analyze user input and extract: business name, type, tone, colors, audience, goal, location, unique offerings, etc.
- If critical info is missing (especially business type, desired tone, main goal), ask politely and briefly (max 3 short questions). Be friendly and conversational.
- When you have enough details, generate a COMPLETE, REAL, PRODUCTION-READY single-page website using HTML, CSS, and JavaScript.

IMPORTANT OUTPUT FORMAT:
- When generating a website, output the FULL HTML code inside a single code block with \`\`\`html and \`\`\` markers.
- The HTML must be a complete, self-contained page with inline CSS and JS (no external files).
- Use modern CSS (flexbox, grid, gradients, animations, smooth scrolling).
- Use Google Fonts via CDN link for beautiful typography.
- Make it fully responsive (mobile-first).
- Include smooth scroll behavior, hover effects, and subtle animations.
- Use the user's requested color palette, or choose a beautiful one if not specified.
- The website must include these sections as appropriate:
  - Navigation bar (sticky, with smooth scroll links)
  - Hero section (with headline, subheadline, CTA button, gradient or image background)
  - About Us section
  - Services / Offerings section (cards layout)
  - Why Choose Us / Features section
  - Testimonials section
  - Contact / CTA section
  - Footer
- Add a brief summary BEFORE the code block explaining the website you built (2-3 sentences max).
- Add SEO meta tags, favicon placeholder, and proper semantic HTML.

IMAGE GUIDELINES (CRITICAL — FOLLOW EXACTLY):
- The app AUTOMATICALLY replaces image URLs after generation. You MUST use semantic placeholder names as src values.
- NEVER use real URLs like https://images.unsplash.com/..., picsum.photos, source.unsplash.com, placeholder.com, via.placeholder.com, or ANY real image host.
- Instead, use ONLY these semantic placeholder names as the src attribute value:
  - hero-image (for the hero/banner section)
  - about-image (for about section)
  - service-image-1, service-image-2, service-image-3 (for services cards)
  - gallery-image-1, gallery-image-2 (for gallery)
  - team-image-1, team-image-2 (for team members)
  - testimonial-image-1, testimonial-image-2 (for testimonial avatars)
  - cta-image (for CTA section background)
  - feature-image-1, feature-image-2 (for features section)
- Example: <img src="hero-image" alt="Relaxing spa environment with candles and stones" />
- Example CSS: background-image: url('hero-image');
- Include 5-8 images across the page in different sections.
- ALWAYS add HIGHLY DESCRIPTIVE alt text that matches the SPECIFIC business type. For a spa: "Relaxing massage therapy room with warm lighting". For a café: "Fresh brewed coffee with latte art on wooden table".
- The alt text is used by our image system to find the right photos, so make it detailed and specific to the business.
- Use object-fit: cover, strong aspect ratios, and loading="lazy" below the fold.
- For background images in CSS, use the same semantic names: background-image: url('hero-image');

STYLE GUIDELINES:
- Make it visually stunning and professional — not generic or template-looking.
- Use subtle animations (fade-in on scroll, hover transforms, smooth transitions).
- Beautiful gradients, shadows, and spacing.
- Perfectly match the requested tone (calm & premium, bold, friendly, luxurious, etc.).
- Never be salesy or generic in copy.

If the user asks to modify the generated website (change tone, add sections, change colors, etc.), regenerate the FULL HTML with the requested changes.

Example output format:
Here's your stunning website for [Business Name]! I've created a [tone] design with [colors] that perfectly captures your brand.

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>...</body>
</html>
\`\`\`

You can preview it live on the right panel, or copy the code to use it anywhere!`;

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const { messages } = req.body as { messages?: { role: string; content: string }[] };

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
  }

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${geminiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
        max_tokens: 65000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment and try again." });
      }
      if (response.status === 402) {
        return res.status(402).json({ error: "AI credits exhausted. Please add funds to continue." });
      }

      const text = await response.text();
      console.error(`Gemini API error (${response.status}):`, text);
      let errorMessage = "AI service error";

      try {
        const parsed = JSON.parse(text);
        if (parsed.error?.message) {
          errorMessage = parsed.error.message;
        } else if (Array.isArray(parsed) && parsed[0]?.error?.message) {
          errorMessage = parsed[0].error.message;
        } else if (response.status === 503) {
          errorMessage = "AI service is currently experiencing high demand. Please try again later.";
        }
      } catch {
        if (response.status === 503) {
          errorMessage = "AI service is currently experiencing high demand. Please try again later.";
        }
      }

      return res.status(500).json({ error: errorMessage });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (!response.body) {
      return res.status(500).json({ error: "No response body from AI service" });
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();
  } catch (error) {
    console.error("chat error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
