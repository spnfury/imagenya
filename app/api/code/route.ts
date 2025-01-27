import { codeToHtml } from "shiki/bundle/web";
import dedent from "dedent";
import { LORAS } from "@/data/loras";

export async function POST(request: Request) {
  let json = await request.json();
  let lora = LORAS.find((l) => l.model === json.lora);

  if (!lora) {
    return new Response("Missing lora", { status: 404 });
  }

  let jsInstall = await text`npm install together-ai`;
  let jsExample = await javascript`
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

  return Response.json({
    install: jsInstall,
    example: jsExample,
  });
}

async function javascript(strings: TemplateStringsArray, ...values: any[]) {
  const string = strings.reduce((result, string, i) => {
    return result + (values[i - 1] || "") + string;
  });

  return generateCode(string, "javascript");
}

async function text(strings: TemplateStringsArray, ...values: any[]) {
  const string = strings.reduce((result, string, i) => {
    return result + (values[i - 1] || "") + string;
  });

  return generateCode(string, "text");
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
