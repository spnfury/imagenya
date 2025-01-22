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
import { z } from "zod";

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

                      <div className="relative text-left">
                        <div className="relative">
                          <Image
                            className="aspect-[3/2] rounded-[4px] object-cover object-center"
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
          <GeneratedImage prompt={prompt} loraModel={selectedLoraModel} />
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
}: {
  prompt: string;
  loraModel: string;
}) {
  const { data, isFetching } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: [prompt, loraModel],
    queryFn: async () => {
      let res = await fetch("/api/generateImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          lora: loraModel,
          // userAPIKey,
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
            width={1024}
            height={768}
            src={`data:image/png;base64,${data.image.b64_json}`}
            alt=""
            className={`${isFetching ? "animate-pulse" : ""} max-w-full rounded-lg object-cover shadow-sm shadow-black`}
          />
        </div>
      ) : null}
    </>
  );
}
