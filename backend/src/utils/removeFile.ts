import fs from "fs/promises";
export const removeImage = async (filename: string) => {
  try {
    const result = await fs.unlink(`public/uploads/${filename}`);
    return true;
  } catch (error) {
    console.log("Failed remove Image", error);
    throw new Error("Failed remove image");
  }
};
