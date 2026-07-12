import ai from "../config/gemini.js";

const MODEL = "gemini-3.5-flash";

const generateAIResponse = async (prompt) => {

    try {

        const interaction = await ai.interactions.create({

            model: MODEL,

            input: prompt,

            generation_config: {

                temperature: 0.7,

                thinking_level: "low"

            }

        });

        return interaction.output_text;

    }

    catch (error) {

        console.error("Gemini Error:", error);

        throw new Error("Failed to generate AI response");

    }

};

export {

    generateAIResponse

};