import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  // const question = req.body.question || "";
  // if (question.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       message: "Please enter a valid question",
  //     },
  //   });
  //   return;
  // }



  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      //prompt: req.body.question,
      prompt: `¡Hola! Soy un psicólogo virtual y estoy aquí para ayudarte. ¿Tienes alguna pregunta que quieras hacerme o comentarme que te esta pasando? Si es así, por favor escríbela a continuación y estaré encantado de responderla. Si no, puedes simplemente comenzar a hablar conmigo y podemos explorar juntos cualquier problema o preocupación que tengas, las respuestas van a ser concisas y con muchas preguntas para que puedas reflexionar, respuestas concisas y cortas!. Por ejemplo, pregunta:${req.body.question}. respuesta: 'respuesta del psicólogo'`,
      //temperature: 0.6,
      //prompt:req.body.question,
      max_tokens: 500,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },

      });
    }
  }
}

// function generatePrompt(animal, cantidadAnimal) {
//   console.log(animal, cantidadAnimal);
//   return `genera una tabla en html con sugerencias de ${cantidadAnimal} nombres de ${animal} `;
// }
