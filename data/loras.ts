import AnimeSketch from "@/public/lora-images/anime-sketch.png";
import ColoredSketch from "@/public/lora-images/colored-sketch.png";
import FluxMidJourney from "@/public/lora-images/flux-midjourney.png";
import Icons from "@/public/lora-images/icons.png";
import LogoDesign from "@/public/lora-images/logo-design.png";
import OutfitGenerator from "@/public/lora-images/outfit-generator.png";
import PencilSketch from "@/public/lora-images/pencil-sketch.png";
import SimpleSketch from "@/public/lora-images/simple-sketch.png";
import TarotCard from "@/public/lora-images/tarot-card.png";
import VectorSketch from "@/public/lora-images/vector-sketch.png";
import { StaticImageData } from "next/image";

export type Lora = {
  id: number;
  name: string;
  model: string;
  description: string;
  url: string;
  image: StaticImageData;
  path: string;
  applyTrigger: (prompt: string) => string;
  scale: number;
  steps: number;
  height?: number;
  width?: number;
};

export const LORAS: Lora[] = [
  {
    id: 9,
    name: "Icons",
    model: "Flux-Icon-Kit-LoRA",
    description: "Creates clean, scalable icon sets for UI/UX projects.",
    url: "https://huggingface.co/strangerzonehf/Flux-Icon-Kit-LoRA",
    image: Icons,
    path: "https://huggingface.co/strangerzonehf/Flux-Icon-Kit-LoRA",
    applyTrigger: (prompt) => `Icon Kit, ${prompt}`,
    scale: 1,
    steps: 28,
    height: 832,
    width: 1280,
  },
  {
    id: 6,
    name: "Logo Design",
    model: "FLUX.1-dev-LoRA-Logo-Design",
    description: "Tailored for professional and minimalist logo creation.",
    url: "https://huggingface.co/Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design",
    image: LogoDesign,
    path: "https://huggingface.co/Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design",
    applyTrigger: (prompt) => `wablogo, logo, Minimalist, ${prompt}`,
    scale: 0.8,
    steps: 28,
  },
  {
    id: 1,
    name: "Colored Sketch",
    model: "Flux-Sketch-Ep-LoRA",
    description: "Creates vibrant, colorful sketch-style illustrations.",
    url: "https://huggingface.co/strangerzonehf/Flux-Sketch-Ep-LoRA",
    image: ColoredSketch,
    path: "https://huggingface.co/strangerzonehf/Flux-Sketch-Ep-LoRA",
    applyTrigger: (prompt) => `ep sketch, ${prompt}`,
    scale: 1,
    steps: 28,
  },
  {
    id: 7,
    name: "Flux MidJourney",
    model: "Flux-Midjourney-Mix2-LoRA",
    url: "https://huggingface.co/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
    description:
      "Mimics MidJourney’s style, blending intricate and artistic designs.",
    image: FluxMidJourney,
    path: "https://huggingface.co/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
    applyTrigger: (prompt) => `MJ v6, ${prompt}`,
    scale: 1,
    steps: 28,
  },

  {
    id: 8,
    name: "Outfit Generator",
    model: "FLUX.1-dev-LoRA-Outfit-Generator",
    url: "https://huggingface.co/tryonlabs/FLUX.1-dev-LoRA-Outfit-Generator",
    description:
      "Generates creative outfit designs for concept art and fashion.",
    image: OutfitGenerator,
    path: "https://huggingface.co/tryonlabs/FLUX.1-dev-LoRA-Outfit-Generator",
    applyTrigger: (prompt) => prompt,
    scale: 1,
    steps: 28,
  },
  {
    id: 2,
    name: "Simple Sketch",
    model: "flux-lora-simple-illustration",
    description: "Produces clean and minimalistic sketch-style artwork.",
    url: "https://huggingface.co/dvyio/flux-lora-simple-illustration",
    image: SimpleSketch,
    path: "https://huggingface.co/dvyio/flux-lora-simple-illustration",
    applyTrigger: (prompt) =>
      `${prompt}, illustration in the style of SMPL, thick black lines on a white background`,
    scale: 1,
    steps: 28,
  },
  {
    id: 3,
    name: "Vector Sketch",
    model: "vector-illustration",
    description:
      "Generates smooth, scalable vector-style sketches ideal for digital designs.",
    url: "https://huggingface.co/mujibanget/vector-illustration",
    image: VectorSketch,
    path: "https://huggingface.co/mujibanget/vector-illustration",
    applyTrigger: (prompt) =>
      `${prompt}, vector illustration with mujibvector style`,
    scale: 1,
    steps: 28,
  },
  {
    id: 4,
    name: "Pencil Sketch",
    model: "shou_xin",
    description: "Adds a realistic pencil-drawn effect to your designs.",
    url: "https://huggingface.co/Datou1111/shou_xin",
    image: PencilSketch,
    path: "https://huggingface.co/hassanelmghari/shou_xin",
    applyTrigger: (prompt) => `shou_xin, A pencil sketch of ${prompt}`,
    scale: 1,
    steps: 28,
  },
  {
    id: 5,
    name: "Anime Sketch",
    model: "anime-blockprint-style",
    description:
      "Combines anime-inspired designs with textured block print aesthetics.",
    url: "https://huggingface.co/glif/anime-blockprint-style",
    image: AnimeSketch,
    path: "https://huggingface.co/glif/anime-blockprint-style",
    applyTrigger: (prompt) => `${prompt}, blockprint style`,
    scale: 1,
    steps: 28,
  },
  {
    id: 10,
    name: "Tarot Card",
    model: "flux-tarot-v1",
    url: "https://huggingface.co/multimodalart/flux-tarot-v1",
    description: "Produces artistic, mystical tarot card designs.",
    image: TarotCard,
    path: "https://huggingface.co/multimodalart/flux-tarot-v1",
    applyTrigger: (prompt) =>
      `${prompt} in the style of TOK a trtcrd tarot style`,
    scale: 1,
    steps: 28,
  },
];
