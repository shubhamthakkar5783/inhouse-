// ✅ Make sure your package.json has: { "type": "module" }
import { InferenceClient } from "@huggingface/inference";
import fs from "fs";

// ✅ Use your environment variable
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY; // or HF_TOKEN
const client = new InferenceClient(HF_TOKEN);

async function generateImage(prompt) {
  try {
    console.log("⏳ Generating image... please wait.");

    // 🔹 Generate image using Hugging Face Inference SDK
    const image = await client.textToImage({
      provider: "fal-ai",
      model: "stabilityai/stable-diffusion-3.5-large",
      inputs: prompt,
      parameters: { num_inference_steps: 25 }, // higher = better quality
    });

    // 🔹 Convert Blob → Buffer and save as PNG
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync("generated_image.png", buffer);

    console.log("✅ Image generated successfully! Saved as 'generated_image.png'");
  } catch (error) {
    console.error("❌ Error generating image:", error.message);
  }
}

// 🧠 Example prompt
generateImage("A futuristic cityscape with flying cars and neon lights at sunset");
