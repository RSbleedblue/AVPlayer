import React, { createContext, useState, useRef, useEffect } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioList, setAudioList] = useState([]); 
  const [visualizationData, setVisualizationData] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
        updateVisualization();
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setAudioList(prevList => [...prevList, audioUrl]);
      };

      audioChunksRef.current = [];
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const updateVisualization = () => {
    const audioChunk = audioChunksRef.current[audioChunksRef.current.length - 1];
    if (audioChunk) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const audioData = new Float32Array(e.target.result);
        const newData = Array.from(audioData).map((value, index) => ({
          x: index,
          y: value * 100 
        })).slice(0, 100);

        setVisualizationData(prevData => [...prevData, ...newData].slice(-1000)); 
      };
      reader.readAsArrayBuffer(audioChunk);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <AudioContext.Provider value={{
      isRecording,
      audioUrl,
      audioList, // Provide the list of recorded audio
      visualizationData,
      startRecording,
      stopRecording,
    }}>
      {children}
    </AudioContext.Provider>
  );
};
