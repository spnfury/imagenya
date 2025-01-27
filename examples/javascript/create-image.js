import Together from "together-ai";

const client = new Together();

const image = await client.images.create({
  prompt:
    "ep sketch, A vibrant, colorful, sketch illustration of a sleek, retro-style sports car with bold, expressive lines, bright, pop-art inspired colors, and dynamic, swirling patterns in the background.",
  model: "black-forest-labs/FLUX.1-dev-lora",
  height: 832,
  width: 1280,
  seed: 1234,
  steps: 33,
  image_loras: [
    {
      path: "https://huggingface.co/strangerzonehf/Flux-Sketch-Ep-LoRA",
      scale: 1,
    },
  ],
});

console.log(image.data[0].url);
