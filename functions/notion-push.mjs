/**
 * Netlify Function: notion-push
 * Proxies requests to the Notion API so the integration token
 * never touches the client-side bundle.
 *
 * Environment variables required (set in Netlify dashboard):
 *   NOTION_TOKEN        – your Notion Internal Integration token
 *   NOTION_DATABASE_ID  – the target database ID
 */

const NOTION_VERSION = "2022-06-28";
const NOTION_API     = "https://api.notion.com/v1/pages";

export default async function handler(req) {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token  = process.env.NOTION_TOKEN;
  const dbId   = process.env.NOTION_DATABASE_ID;

  if (!token || !dbId) {
    return new Response(
      JSON.stringify({ error: "NOTION_TOKEN or NOTION_DATABASE_ID not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { type, title, content, date, category, tags = [] } = body;

  // ── Build Notion page properties based on item type ──────────────────────
  const properties = {
    // Every item gets a Name (title) property
    Name: {
      title: [{ text: { content: title || "Untitled" } }],
    },
    // Source tag so you know where it came from
    Source: {
      select: { name: "Kaam Se Kaam" },
    },
    // The type of item: Task | Note | Reflection
    Type: {
      select: { name: type || "Task" },
    },
    // Date the item was created / applies to
    Date: {
      date: { start: date || new Date().toISOString().split("T")[0] },
    },
  };

  // Optional category
  if (category) {
    properties["Category"] = {
      rich_text: [{ text: { content: category } }],
    };
  }

  // Optional tags (multi-select)
  if (tags.length > 0) {
    properties["Tags"] = {
      multi_select: tags.map((t) => ({ name: t })),
    };
  }

  // ── Build page children (body content) ───────────────────────────────────
  const children = [];
  if (content) {
    // Split long content into 2000-char chunks (Notion block limit)
    const chunks = content.match(/.{1,2000}/gs) || [];
    chunks.forEach((chunk) => {
      children.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: chunk } }],
        },
      });
    });
  }

  // ── Call Notion API ───────────────────────────────────────────────────────
  try {
    const notionRes = await fetch(NOTION_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties,
        children,
      }),
    });

    const data = await notionRes.json();

    if (!notionRes.ok) {
      return new Response(
        JSON.stringify({ error: data.message || "Notion API error", details: data }),
        { status: notionRes.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id, url: data.url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to reach Notion API", details: err.message }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
