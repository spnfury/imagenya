"use client";

import GithubIcon from "@/components/icons/github-icon";
import XIcon from "@/components/icons/x-icon";
import Logo from "@/components/logo";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import imagePlaceholder from "@/public/image-placeholder.png";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Lora, LORAS } from "@/data/loras";
import { ExternalLink } from "lucide-react";

type ImageResponse = {
  b64_json: string;
  timings: { inference: number };
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [userAPIKey, setUserAPIKey] = useState(() => {
    // Only run in browser
    if (typeof window !== "undefined") {
      return localStorage.getItem("togetherApiKey") || "";
    }
    return "";
  });
  const [selectedLoraModel, setSelectedLoraModel] = useState<Lora["model"]>();

  // TODO fix
  useEffect(() => {
    if (userAPIKey) {
      localStorage.setItem("togetherApiKey", userAPIKey);
    } else {
      localStorage.removeItem("togetherApiKey");
    }
  }, [userAPIKey]);

  const isSubmitting = false;

  async function action(formData: FormData) {
    let { prompt } = Object.fromEntries(formData.entries());
    setPrompt(typeof prompt === "string" ? prompt : "");
  }

  return (
    <div className="flex h-full flex-col px-5">
      <header className="flex justify-center pt-20 md:justify-end md:pt-3">
        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <a href="https://togetherai.link" target="_blank">
            <Logo />
          </a>
        </div>
        <div>
          <label className="text-xs text-gray-200">
            [Optional] Add your{" "}
            <a
              href="https://api.together.xyz/settings/api-keys"
              target="_blank"
              className="underline underline-offset-4 transition hover:text-blue-500"
            >
              Together API Key
            </a>{" "}
          </label>
          <Input
            placeholder="API Key"
            type="password"
            value={userAPIKey}
            className="mt-1 bg-gray-400 text-gray-200 placeholder:text-gray-300"
            onChange={(e) => setUserAPIKey(e.target.value)}
          />
        </div>
      </header>

      <div className="flex justify-center">
        <form className="mt-10 w-full max-w-5xl" action={action}>
          <fieldset>
            <div className="mx-auto w-full max-w-lg">
              <div className="relative">
                <Textarea
                  name="prompt"
                  rows={4}
                  spellCheck={false}
                  placeholder="Describe your image..."
                  required
                  defaultValue={prompt}
                  className="w-full resize-none border-gray-300 border-opacity-50 bg-gray-400 px-4 text-base placeholder-gray-300"
                />
                <div
                  className={`${isSubmitting ? "flex" : "hidden"} absolute bottom-3 right-3 items-center justify-center`}
                >
                  <Spinner className="size-4" />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center bg-gray-900 px-2 py-1 text-sm font-medium text-white"
                >
                  Create image
                </button>
              </div>
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
                      <div className="relative">
                        <div className="relative">
                          <Image
                            className="aspect-[3/2] rounded-[4px] object-cover object-center"
                            src={lora.image}
                            alt={lora.name}
                          />
                          <div className="absolute inset-0 rounded-[4px] ring-1 ring-inset ring-slate-400/20" />
                        </div>
                        <div>{lora.model}</div>
                        <div className="flex items-center space-x-1.5">
                          <h3>{lora.name}</h3>
                          <div>
                            <a href={lora.url} target="_blank">
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                        <p>{lora.description}</p>
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
        <div className="grid grid-cols-2">
          <GeneratedImage prompt={prompt} loraModel={selectedLoraModel} />

          <GeneratedImage
            prompt={prompt}
            loraModel={selectedLoraModel}
            refinePrompt
          />
        </div>
      )}

      {/* <div className="flex w-full grow flex-col items-center justify-center pb-8 pt-4 text-center">
        {!activeImage || !prompt ? (
          <div className="max-w-xl md:max-w-4xl lg:max-w-3xl">
            <p className="text-xl font-semibold text-gray-200 md:text-3xl lg:text-4xl">
              Generate images in real-time
            </p>
            <p className="mt-4 text-balance text-sm text-gray-300 md:text-base lg:text-lg">
              Enter a prompt and generate images in milliseconds as you type.
              Powered by Flux on Together AI.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex w-full max-w-4xl flex-col justify-center">
            <div>
              <Image
                placeholder="blur"
                blurDataURL={imagePlaceholder.blurDataURL}
                width={1024}
                height={768}
                src={`data:image/png;base64,${activeImage.b64_json}`}
                alt=""
                className={`${isFetching ? "animate-pulse" : ""} max-w-full rounded-lg object-cover shadow-sm shadow-black`}
              />
            </div>

            <div className="mt-4 flex gap-4 overflow-x-scroll pb-4">
              {generations.map((generatedImage, i) => (
                <button
                  key={i}
                  className="w-32 shrink-0 opacity-50 hover:opacity-100"
                  onClick={() => setActiveIndex(i)}
                >
                  <Image
                    placeholder="blur"
                    blurDataURL={imagePlaceholder.blurDataURL}
                    width={1024}
                    height={768}
                    src={`data:image/png;base64,${generatedImage.image.b64_json}`}
                    alt=""
                    className="max-w-full rounded-lg object-cover shadow-sm shadow-black"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div> */}

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

function GeneratedImage({
  prompt,
  loraModel,
  refinePrompt,
}: {
  prompt: string;
  loraModel: string;
  refinePrompt?: boolean;
}) {
  const shouldRefine = !!refinePrompt;
  const { data, isFetching } = useQuery<{
    prompt: string;
    image: ImageResponse;
  }>({
    placeholderData: (previousData) => previousData,
    queryKey: [prompt, loraModel, shouldRefine],
    queryFn: async () => {
      let res = await fetch("/api/generateImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          lora: loraModel,
          shouldRefine,
          // userAPIKey,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      return res.json();
    },
    enabled: !!(prompt.trim() && loraModel),
    staleTime: Infinity,
    retry: false,
  });

  return (
    <>
      {data && (
        <div>
          <div>{refinePrompt ? "Refined prompt" : "Unrefined prompt"}</div>
          <div>{data.prompt}</div>
          <Image
            placeholder="blur"
            blurDataURL={imagePlaceholder.blurDataURL}
            width={1024}
            height={768}
            src={`data:image/png;base64,${data.image.b64_json}`}
            alt=""
            className={`${isFetching ? "animate-pulse" : ""} max-w-full rounded-lg object-cover shadow-sm shadow-black`}
          />
        </div>
      )}
    </>
  );
}
