"use client";

import GithubIcon from "@/components/icons/github-icon";
import XIcon from "@/components/icons/x-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lora, LORAS } from "@/data/loras";
import imagePlaceholder from "@/public/image-placeholder.png";
import logo from "@/public/logo.png";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";

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

      <div className="flex justify-center">
        <form className="mt-10 w-full max-w-5xl" action={action}>
          <fieldset>
            <div className="mx-auto w-full max-w-lg">
              <div className="relative">
                <textarea
                  name="prompt"
                  rows={4}
                  spellCheck={false}
                  placeholder="Describe your image..."
                  required
                  defaultValue={prompt}
                  className="block w-full resize-none rounded border border-gray-300 bg-white px-4 py-3 text-base text-gray-600 placeholder-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                />
                <div className="absolute bottom-2 right-2 flex">
                  <button
                    type="submit"
                    className="inline-flex size-7 items-center justify-center rounded-[2px] bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                  >
                    <ArrowRightIcon className="size-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Choose from expertly crafted styles or bring your own LoRA.
                Enter your prompt, select a style, and bring your imagination to
                life.
              </p>
            </div>
            <div className="mt-12">
              <RadioGroup.Root
                name="lora"
                value={selectedLoraModel}
                onValueChange={setSelectedLoraModel}
              >
                <div className="grid auto-rows-auto grid-cols-5 gap-5">
                  {LORAS.map((lora) => (
                    <RadioGroup.Item
                      key={lora.id}
                      value={lora.model}
                      className="relative flex flex-col justify-start"
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
                          <div className="absolute inset-0 rounded-[4px] ring-1 ring-inset ring-slate-400/30" />
                        </div>
                        <div className="mt-1 line-clamp-1 text-sm font-light text-slate-400">
                          {lora.model}
                        </div>
                        <div className="mt-1 flex items-center space-x-1.5">
                          <h3 className="text-[#314158]">{lora.name}</h3>
                          <div>
                            <a href={lora.url} target="_blank">
                              <ExternalLink className="size-3.5" />
                            </a>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          {lora.description}
                        </p>
                      </div>
                    </RadioGroup.Item>
                  ))}
                </div>
              </RadioGroup.Root>
            </div>
          </fieldset>
        </form>
      </div>

      {prompt && selectedLoraModel && (
        <div className="">
          <GeneratedImage
            prompt={prompt}
            loraModel={selectedLoraModel}
            userAPIKey={userAPIKey}
          />
        </div>
      )}

      <footer className="mt-16 w-full items-center pb-10 text-center text-gray-300 md:mt-4 md:flex md:justify-between md:pb-5 md:text-xs lg:text-sm">
        <p>
          Powered by{" "}
          <a
            href="https://togetherai.link"
            target="_blank"
            className="underline underline-offset-4 transition hover:text-blue-500"
          >
            Together.ai
          </a>{" "}
          &{" "}
          <a
            href="https://togetherai.link/together-flux"
            target="_blank"
            className="underline underline-offset-4 transition hover:text-blue-500"
          >
            Flux
          </a>
        </p>

        <div className="mt-8 flex items-center justify-center md:mt-0 md:justify-between md:gap-6">
          <p className="hidden whitespace-nowrap md:block">
            100% free and{" "}
            <a
              href="https://github.com/Nutlope/blinkshot"
              target="_blank"
              className="underline underline-offset-4 transition hover:text-blue-500"
            >
              open source
            </a>
          </p>

          <div className="flex gap-6 md:gap-2">
            <a href="https://github.com/Nutlope/blinkshot" target="_blank">
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
    <>
      {isFetching ? (
        <div>Loading...</div>
      ) : data ? (
        <div>
          <div>{data.prompt}</div>
          <Image
            placeholder="blur"
            blurDataURL={imagePlaceholder.blurDataURL}
            width={lora?.width ?? 1024}
            height={lora?.height ?? 768}
            src={`data:image/png;base64,${data.image.b64_json}`}
            alt=""
            className={`${isFetching ? "animate-pulse" : ""} max-w-full rounded-lg object-cover shadow-sm shadow-black`}
          />
        </div>
      ) : null}
    </>
  );
}
