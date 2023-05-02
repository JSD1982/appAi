import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import {
  useSpeechSynthesis,
  useSpeechRecognition
} from "react-speech-kit";

export default function Home() {
  const [start, setStart] = useState(true);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [question, setQuestionInput] = useState("");
  
  //const [value, setValue] = useState('');
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setQuestionInput(result);
    },
  });
 
  const [result, setResult] = useState();
  const { speak, voices } = useSpeechSynthesis();
 const voice = voices[61];
  // const rate = 1.2;
  // const pitch = 2;
  // const [conversationHistory, setConversationHistory] = useState({
  //   question: "",
  //   answer:""
  // });

 const handlerStart = ()=>{
  setStart(false)
  speak({ text: `Hola ${name}, como estas?`, voice });
 }

    async function callMe() {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
          }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }

        setResult(data.result);
        setLoading(false);
        console.log(data.result);
     
        speak({ text: data.result, voice });
      
        setQuestionInput("");

      } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    }

  
  const handlerListen = () =>{
    setQuestionInput(listen)
    setResult("");
    setQuestionInput("")
  }
   const handlerResponse = () => {
    setLoading(true)
     setQuestionInput(stop);
     callMe(); 
     //setResult("");
    
   };

  
  return (
    <div className={styles.bodyContent}>
      <div className={styles.appContent}>
        {start === true ? (
          <div className={styles.startContainer}>
            <img src="/chat.png" />
            <input
              type="text"
              value={name}
              placeholder="Cual es tu nombre?"
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handlerStart}>empezar</button>
          </div>
        ) : (
          <>
            <Head>
              <title>OpenAI Psic</title>
              <link rel="icon" href="/chat.png" />
            </Head>

            <main className={styles.main}>
              {/* <img src="/dog.png" className={styles.icon} /> */}

              <h3>
                <span>
                  <img src="/avatar.png" />
                </span>
                Hablemos <b>{name}</b>
              </h3>

              <input
                autoFocus
                type="text"
                name="question"
                placeholder="Dejame tu consulta..."
                value={question}
                onChange={(e) => setQuestionInput(e.target.value)}
              />

              {/* <button onMouseDown={handlerListen} onMouseUp={handlerResponse}>
              🎤
            </button> */}
              <button onClick={handlerResponse}>Enviar</button>

              {listening && <div>Microfono listo para hablar!</div>}
              {loading ? (
                <>
                  <img src="/loader.gif" className={styles.loader} />
                </>
              ) : (
                <>
                  <div className={styles.result}>
                    {result
                      ? result
                      : "Hola, en que te puedo ayudar " + name + "?"}
                  </div>
                </>
              )}

              {/* <div dangerouslySetInnerHTML={{ __html: result }} /> */}
            </main>
            <div>
              {/* <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
        /> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
