"use client";

import GithubIcon from "@/components/icons/github-icon";
import PictureIcon from "@/components/icons/picture-icon";
import XIcon from "@/components/icons/x-icon";
import { Button } from "@/components/ui/button";
import { Lora, LORAS } from "@/data/loras";
import imagePlaceholder from "@/public/image-placeholder.png";
import logo from "@/public/logo.png";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import Spinner from "@/components/spinner";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [userAPIKey, setUserAPIKey] = useState("");
  const [selectedLoraModel, setSelectedLoraModel] = useState<Lora["model"]>();

  function saveAPIKey(key: string) {
    setUserAPIKey(key);
    if (key) {
      localStorage.setItem("togetherApiKey", key);
    } else {
      localStorage.removeItem("togetherApiKey");
    }
  }

  useEffect(() => {
    const key = localStorage.getItem("togetherApiKey") ?? "";
    setUserAPIKey(key);
  }, []);

  const isSubmitting = false;

  async function action(formData: FormData) {
    let { prompt } = Object.fromEntries(formData.entries());
    setPrompt(typeof prompt === "string" ? prompt : "");
  }

  return (
    <div className="flex h-full flex-col px-5">
      <header className="flex justify-start pt-20 md:pt-3">
        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <a href="https://togetherai.link" target="_blank">
            <Image alt="" className="h-8 w-auto" src={logo} />
          </a>
          <p className="font-mono text-gray-600">
            Generate AI Images with LoRAs
          </p>
        </div>
        <div className="flex flex-col">
          <label className="text-sm">
            <a
              href="https://api.together.xyz/settings/api-keys"
              target="_blank"
              className="inline-flex items-center gap-0.5 text-gray-700 transition hover:text-blue-500"
            >
              Together AI API Key
              <ArrowUpRightIcon className="size-3" />
            </a>{" "}
          </label>
          <input
            placeholder="Enter your API key"
            value={userAPIKey}
            className="mt-1 rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
            onChange={(e) => saveAPIKey(e.target.value)}
          />
        </div>
      </header>

      <main className="mx-auto mt-10 w-full max-w-5xl grow">
        <form className="w-full" action={action}>
          <fieldset className="flex w-full gap-8">
            <div className="max-w-sm rounded-lg bg-gray-100 p-5">
              <p className="font-mono font-medium">Choose your LoRA</p>

              <RadioGroup.Root
                name="lora"
                value={selectedLoraModel}
                onValueChange={setSelectedLoraModel}
                className="mt-4 grid grid-cols-2 gap-5"
              >
                {LORAS.map((lora) => (
                  <div
                    className="relative [&_input]:inset-0 [&_input]:!translate-x-0"
                    key={lora.id}
                  >
                    <RadioGroup.Item
                      value={lora.model}
                      className="relative flex flex-col justify-start"
                      required
                    >
                      {lora.model === selectedLoraModel && (
                        <div className="absolute -inset-2 rounded-[6px] border-[1.5px] border-black bg-white" />
                      )}
                      <div className="relative text-left">
                        <div className="relative">
                          <Image
                            className="aspect-[37/24] rounded-[4px] object-cover object-center"
                            src={lora.image}
                            alt={lora.name}
                          />
                          <div className="absolute inset-0 rounded-[4px] ring-1 ring-inset ring-black/10" />
                        </div>
                        <div className="mt-1 line-clamp-1 text-sm font-light text-gray-400">
                          {lora.model}
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="text-gray-700">{lora.name}</h3>
                          <div>
                            <a href={lora.url} target="_blank">
                              <ExternalLink className="size-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </RadioGroup.Item>
                  </div>
                ))}
              </RadioGroup.Root>
            </div>

            <div className="w-full">
              <div className="ml-auto max-w-lg">
                <textarea
                  name="prompt"
                  rows={4}
                  spellCheck={false}
                  placeholder="Describe your image..."
                  required
                  defaultValue={prompt}
                  className="block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-600 placeholder-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                />

                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-400">Suggestions</p>
                  <div className="mt-2 flex gap-2">
                    {[
                      "New York City",
                      "Elon Musk",
                      "Morocco",
                      "Italian cuisine",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        className="rounded-full bg-gray-100 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-1 rounded border border-cyan-700 bg-cyan-600 px-4 py-2 text-gray-100 shadow hover:bg-cyan-600/90"
                  >
                    <PictureIcon className="size-4" />
                    Generate Image
                  </button>
                </div>

                <div className="mt-20">
                  {prompt && selectedLoraModel ? (
                    <GeneratedImage
                      prompt={prompt}
                      loraModel={selectedLoraModel}
                      userAPIKey={userAPIKey}
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center">
                      <p className="text-balance px-4 text-center text-gray-500">
                        Choose from expertly crafted styles or bring your own
                        LoRA. Enter your prompt, select a style, and bring your
                        imagination to life.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </main>

      <footer className="mt-16 w-full items-center pb-10 text-center text-xs text-gray-600 md:mt-4 md:flex md:justify-between md:pb-5">
        <p>
          Powered by{" "}
          <a
            href="https://togetherai.link"
            target="_blank"
            className="font-bold transition hover:text-blue-500"
          >
            Together.ai
          </a>
          ,{" "}
          <a
            href="https://huggingface.co/"
            target="_blank"
            className="font-bold transition hover:text-blue-500"
          >
            HuggingFace
          </a>
          , &{" "}
          <a
            href="https://togetherai.link/together-flux"
            target="_blank"
            className="font-bold transition hover:text-blue-500"
          >
            Flux
          </a>
        </p>

        <div className="mt-8 flex items-center justify-center md:mt-0 md:justify-between md:gap-6">
          <div className="flex gap-6 md:gap-2">
            <a href="https://github.com/Nutlope/loras-dev" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <GithubIcon className="size-4" />
                GitHub
              </Button>
            </a>
            <a href="https://x.com/nutlope" target="_blank">
              <Button
                size="sm"
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <XIcon className="size-3" />
                Twitter
              </Button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const imageResponseSchema = z.object({
  prompt: z.string(),
  image: z.object({
    b64_json: z.string(),
    timings: z.object({
      inference: z.number(),
    }),
  }),
});

type ImageResponse = z.infer<typeof imageResponseSchema>;

function GeneratedImage({
  prompt,
  loraModel,
  userAPIKey,
}: {
  prompt: string;
  loraModel: string;
  userAPIKey: string;
}) {
  let lora = LORAS.find((l) => l.model === loraModel);

  const { data, isFetching } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: [prompt, loraModel, userAPIKey],
    queryFn: async () => {
      let res = await fetch("/api/generateImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          lora: loraModel,
          userAPIKey,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      let data = await res.json();

      return imageResponseSchema.parse(data);
    },
    enabled: !!(prompt.trim() && loraModel),
    staleTime: Infinity,
    retry: false,
  });

  return (
    <AnimatePresence mode="wait">
      {isFetching ? (
        <motion.div
          key="a"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            aspectRatio:
              lora?.width && lora?.height ? lora.width / lora.height : 4 / 3,
          }}
          className="flex h-auto max-w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 shadow-sm"
        >
          <Spinner className="size-4" />
          Generating...
        </motion.div>
      ) : data ? (
        <motion.div
          key="b"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Image
            placeholder="blur"
            blurDataURL={imagePlaceholder.blurDataURL}
            width={lora?.width ?? 1024}
            height={lora?.height ?? 768}
            src={`data:image/png;base64,${data.image.b64_json}`}
            alt=""
            className={`${isFetching ? "animate-pulse" : ""} max-w-full rounded-lg border border-gray-200 object-cover shadow-sm`}
          />
          <p className="mt-2 text-center text-sm text-gray-500">
            {data.prompt}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
