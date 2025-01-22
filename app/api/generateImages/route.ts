import Together from "together-ai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

let ratelimit: Ratelimit | undefined;

// Add rate limiting if Upstash API keys are set, otherwise skip
if (process.env.UPSTASH_REDIS_REST_URL) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // Allow 60 requests per day (~4-6 prompts), then need to use API key
    limiter: Ratelimit.fixedWindow(60, "1440 m"),
    analytics: true,
    prefix: "blinkshot",
  });
}

export async function POST(req: Request) {
  let json = await req.json();
  let { prompt, userAPIKey, iterativeMode, style } = z
    .object({
      prompt: z.string(),
      iterativeMode: z.boolean(),
      userAPIKey: z.string().optional(),
      style: z.string().optional(),
    })
    .parse(json);

  // Add observability if a Helicone key is specified, otherwise skip
  let options: ConstructorParameters<typeof Together>[0] = {};
  if (process.env.HELICONE_API_KEY) {
    options.baseURL = "https://together.helicone.ai/v1";
    options.defaultHeaders = {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      "Helicone-Property-BYOK": userAPIKey ? "true" : "false",
    };
  }

  const client = new Together(options);

  if (userAPIKey) {
    client.apiKey = userAPIKey;
  }
  console.log(client.apiKey);

  if (ratelimit && !userAPIKey) {
    const identifier = getIPAddress();

    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return Response.json(
        "No requests left. Please add your own API key or try again in 24h.",
        {
          status: 429,
        },
      );
    }
  }

  if (style) {
    prompt += `. Use a ${style} style for the image.`;
  }

  let response;
  const selectedLora = LORAS[8];
  try {
    response = await client.images.create({
      // prompt:
      //   "denim dark blue 5-pocket ankle-length jeans in washed stretch denim slightly looser fit with a wide waist panel for best fit over the tummy and tapered legs with raw-edge frayed hems",
      // prompt: "solid black long-sleeved top in soft jersey",

      // prompt:
      //   "a jacket with Color: black, Department: Outer wear, Style: Elegant, Detail: Buttons, Type: Fit and Flare, Fabric-Elasticity: High Stretch, Sleeve-Length: Long, Material: Leather",
      prompt:
        "A dress with Color: Red, Department: Dresses, Detail: Belted, Fabric-Elasticity: High Stretch, Fit: Fitted, Hemline: Flared, Material: Gabardine, Neckline: Off The Shoulder, Pattern: Floral, Sleeve-Length: Sleeveless, Style: Elegant, Type: Fit and Flare, Waistline: High",
      // prompt: `${selectedLora.triggerWord ? `${selectedLora.triggerWord}, ` : ""} a computer`,
      // prompt,
      // model: "black-forest-labs/FLUX.1-schnell",
      model: "black-forest-labs/FLUX.1-dev-lora",
      // model: "black-forest-labs/FLUX.1-dev",
      width: 1024,
      // height: 1024,
      height: 768,
      seed: 1234,
      steps: selectedLora.steps,
      // guidance: 3.5,
      // guidance: 3.5,
      // seed: iterativeMode ? 123 : undefined,
      // steps: 3,
      response_format: "base64",
      // @ts-expect-error asdf
      image_loras: [{ path: selectedLora.path, scale: selectedLora.scale }],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return Response.json(
      { error: e.toString() },
      {
        status: 500,
      },
    );
  }

  return Response.json(response.data[0]);
}

export const runtime = "edge";

function getIPAddress() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const forwardedFor = headers().get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

const LORAS = [
  {
    label: "colored sketch",
    path: "https://huggingface.co/strangerzonehf/Flux-Sketch-Ep-LoRA",
    triggerWord: "ep sketch",
    scale: 1,
    steps: 28,
  },
  {
    label: "simple sketch",
    path: "https://huggingface.co/dvyio/flux-lora-simple-illustration",
    triggerWord: "illustration in the style of SMPL",
    scale: 1,
    steps: 28,
  },
  {
    label: "vector sketch",
    path: "https://huggingface.co/mujibanget/vector-illustration",
    triggerWord: "vector illustration with mujibvector style",
    scale: 1,
    steps: 28,
  },
  {
    label: "pencil sketch",
    path: "https://huggingface.co/hassanelmghari/shou_xin",
    triggerWord: "shou_xin, pencil sketch",
    scale: 1,
    steps: 28,
  },
  {
    label: "anime sketch",
    path: "https://huggingface.co/glif/anime-blockprint-style",
    triggerWord: "blockprint style",
    scale: 1,
    steps: 28,
  },
  {
    label: "logo design",
    path: "https://huggingface.co/Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design",
    triggerWord: "logo, Minimalist", // docs said wablogo
    scale: 0.8,
    steps: 28,
  },
  {
    label: "flux midjourney",
    path: "https://huggingface.co/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
    triggerWord: "MJ v6",
    scale: 1,
    steps: 28,
  },
  {
    label: "outfit generator",
    path: "https://huggingface.co/tryonlabs/FLUX.1-dev-LoRA-Outfit-Generator",
    triggerWord: "",
    scale: 1,
    steps: 28,
  },
  {
    label: "icons",
    path: "https://huggingface.co/strangerzonehf/Flux-Icon-Kit-LoRA",
    triggerWord: "Icon Kit", // 1280 x 832 is best
    scale: 1,
    steps: 28,
  },
  {
    label: "tarot card",
    path: "https://huggingface.co/multimodalart/flux-tarot-v1",
    triggerWord: "in the style of TOK a trtcrd tarot style",
    scale: 1,
    steps: 28,
  },
];
