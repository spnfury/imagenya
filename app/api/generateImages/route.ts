import Together from "together-ai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { Lora, LORAS } from "@/data/loras";

let ratelimit: Ratelimit | undefined;

// Add rate limiting if Upstash API keys are set, otherwise skip
if (process.env.UPSTASH_REDIS_REST_URL) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // Allow 60 requests per day (~4-6 prompts), then need to use API key
    limiter: Ratelimit.fixedWindow(60, "1440 m"),
    analytics: true,
    prefix: "loras-dev",
  });
}

let requestSchema = z.object({
  prompt: z.string(),
  lora: z.string(),
  userAPIKey: z.string().optional(),
});

export async function POST(req: Request) {
  let json = await req.json();
  let { prompt, userAPIKey, lora } = requestSchema.parse(json);

  // Add observability if a Helicone key is specified, otherwise skip
  // TODO
  // let options: ConstructorParameters<typeof Together>[0] = {};
  // if (process.env.HELICONE_API_KEY) {
  //   options.baseURL = "https://together.helicone.ai/v1";
  //   options.defaultHeaders = {
  //     "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
  //     "Helicone-Property-BYOK": userAPIKey ? "true" : "false",
  //   };
  // }

  // if (userAPIKey) {
  //   client.apiKey = userAPIKey;
  // }

  const options = {};
  const client = new Together(options);

  // if (ratelimit && !userAPIKey) {
  //   const identifier = getIPAddress();

  //   const { success } = await ratelimit.limit(identifier);
  //   if (!success) {
  //     return Response.json(
  //       "No requests left. Please add your own API key or try again in 24h.",
  //       {
  //         status: 429,
  //       },
  //     );
  //   }
  // }

  const selectedLora = LORAS.find((l) => l.model === lora);
  if (!selectedLora) {
    return Response.json(
      { error: `Missing lora: ${lora}` },
      {
        status: 404,
      },
    );
  }

  const improvedPrompt = await improvePrompt({
    prompt,
    lora: selectedLora,
    client,
  });
  const untouchedPrompt = selectedLora.applyTrigger(prompt);

  console.log("Untouched prompt:", untouchedPrompt);
  console.log("Improved prompt:", improvedPrompt);

  let response;
  try {
    response = await client.images.create({
      prompt: normalPrompt,
      // prompt: improvedPrompt,
      // prompt:
      //   "denim dark blue 5-pocket ankle-length jeans in washed stretch denim slightly looser fit with a wide waist panel for best fit over the tummy and tapered legs with raw-edge frayed hems",
      // prompt: "solid black long-sleeved top in soft jersey",

      // prompt:
      //   "a jacket with Color: black, Department: Outer wear, Style: Elegant, Detail: Buttons, Type: Fit and Flare, Fabric-Elasticity: High Stretch, Sleeve-Length: Long, Material: Leather",
      // prompt:
      //   "A dress with Color: Red, Department: Dresses, Detail: Belted, Fabric-Elasticity: High Stretch, Fit: Fitted, Hemline: Flared, Material: Gabardine, Neckline: Off The Shoulder, Pattern: Floral, Sleeve-Length: Sleeveless, Style: Elegant, Type: Fit and Flare, Waistline: High",
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
      response_format: "base64",
      // @ts-expect-error asdf
      image_loras: [{ path: selectedLora.path, scale: selectedLora.scale }],
    });

    console.log({
      path: selectedLora.path,
      scale: selectedLora.scale,
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

async function improvePrompt({
  prompt,
  lora,
  client,
}: {
  prompt: string;
  lora: Lora;
  client: Together;
}) {
  try {
    let res = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: `You are an bot that helps refine prompts passed to the ${lora.model} image generation model. Only respond with the improved prompt and nothing else. Be as terse as possible.`,
        },
        {
          role: "user",
          // NOTE/TODO: asking it to apply the trigger word messes up, can influence the prompt too much
          content: `Write a more detailed prompt about "${prompt}"`,
        },
      ],
    });

    let improved = res.choices[0].message?.content ?? prompt;
    return lora.applyTrigger(improved);
  } catch (e) {
    console.log("Error refining prompt", e);
    return lora.applyTrigger(prompt);
  }
}
