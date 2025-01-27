import { codeToHtml } from "shiki/bundle/web";
import dedent from "dedent";
import { LORAS } from "@/data/loras";

export async function POST(request: Request) {
  const json = await request.json();
  const lora = LORAS.find((l) => l.model === json.lora);

  if (!lora) {
    return new Response("Missing lora", { status: 404 });
  }

  const jsInstall = await text`npm install together-ai`;
  const jsExample = await javascript`
    import Together from "together-ai";

    const client = new Together();
    
    const response = await client.images.create({
      prompt: \"${json.prompt}\",
      model: "black-forest-labs/FLUX.1-dev-lora",
      height: ${lora.height ?? 768},
      width: ${lora.width ?? 1024},
      seed: 1234,
      steps: ${lora.steps},
      image_loras: [
        {
          path: "${lora.path}",
          scale: ${lora.scale},
        },
      ],
    }); 

    console.log("Image:", response.data[0]);
  `;

  const pythonInstall = await text`pip install together-ai`;
  const pythonExample = await python`
    from together import Together

    def create_image():
        client = Together()

        response = client.images.generate(
            prompt="ep sketch, A vibrant, colorful, sketch illustration of a sleek, retro-style sports car with bold, expressive lines, bright, pop-art inspired colors, and dynamic, swirling patterns in the background.",
            model="black-forest-labs/FLUX.1-dev-lora",
            height=832,
            width=1280,
            seed=1234,
            steps=33,
            image_loras=[
                {
                    "path": "https://huggingface.co/strangerzonehf/Flux-Sketch-Ep-LoRA",
                    "scale": 1,
                },
            ],
        )

        print(response.data[0].url)

    # Call the function
    create_image()
  `;

  return Response.json({
    js: {
      install: jsInstall,
      example: jsExample,
    },
    python: {
      install: pythonInstall,
      example: pythonExample,
    },
  });
}

async function javascript(strings: TemplateStringsArray, ...values: any[]) {
  const string = extract(strings, ...values);
  return generateCode(string, "javascript");
}

async function python(strings: TemplateStringsArray, ...values: any[]) {
  const string = extract(strings, ...values);
  return generateCode(string, "python");
}

async function text(strings: TemplateStringsArray, ...values: any[]) {
  const string = extract(strings, ...values);
  return generateCode(string, "text");
}

function extract(strings: TemplateStringsArray, ...values: any[]) {
  return strings.reduce((result, string, i) => {
    return result + (values[i - 1] || "") + string;
  });
}

async function generateCode(code: string, lang: string) {
  const content = dedent(code);
  const html = await codeToHtml(content, {
    lang,
    theme: "github-dark-default",
  });

  return html;
}

export const runtime = "edge";
