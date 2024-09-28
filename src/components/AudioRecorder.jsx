import React, { useContext, useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AudioContext } from '../context/AudioContext';
import { Play, Pause, Square } from 'lucide-react';

const AudioRecorder = () => {
    const {
        isRecording,
        audioUrl,
        audioList,
        visualizationData,
        startRecording,
        stopRecording,
    } = useContext(AudioContext);

    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRefs = useRef([]); // Array of audio refs

    const playAudio = (audioUrl, index) => {
        if (currentAudio !== audioUrl) {
            setCurrentAudio(audioUrl);
            setIsPlaying(true);
            audioRefs.current[index].play();
        } else {
            togglePlayPause(index);
        }
    };

    const togglePlayPause = (index) => {
        if (audioRefs.current[index]) {
            if (isPlaying) {
                audioRefs.current[index].pause();
            } else {
                audioRefs.current[index].play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (currentAudio) {
            audioRefs.current.forEach((audioRef, index) => {
                audioRef.addEventListener('ended', () => setIsPlaying(false));
            });
        }

        return () => {
            audioRefs.current.forEach((audioRef) => {
                audioRef.removeEventListener('ended', () => setIsPlaying(false));
            });
        };
    }, [currentAudio]);

    return (
        <div className="p-4 bg-baseColor space-y-4 w-full max-w-4xl mx-auto text-whiteColor mb-10 flex flex-col items-start">
            <p className='text-3xl md:text-[80px] font-semibold mb-4 mt-10'>Record Audio</p>
            <div className="flex space-x-4 mb-6 w-full">
                <button 
                    onClick={startRecording} 
                    disabled={isRecording} 
                    className='p-3 md:p-4 border border-opacity-10 border-baseColor text-base md:text-lg rounded-full shadow-xl hover:scale-105 transition-all bg-blue-500 text-white flex items-center justify-center'
                >
                    <Play size={24} />
                    <span className="hidden md:inline ml-2">Start</span>
                </button>
                <button 
                    onClick={stopRecording} 
                    disabled={!isRecording} 
                    className='p-3 md:p-4 border border-opacity-10 border-baseColor text-base md:text-lg rounded-full shadow-xl hover:scale-105 transition-all bg-red-500 text-white flex items-center justify-center'
                >
                    <Square size={24} />
                    <span className="hidden md:inline ml-2">Stop</span>
                </button>
            </div>

            {isRecording ? (
                <div className="mt-4 w-full">
                    <h2 className="text-xl font-semibold mb-2">Waveform Visualization</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={visualizationData}>
                            <XAxis dataKey="x" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Line type="monotone" dataKey="y" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="mt-4 mb-[100px] h-[200px]">
                    <h2 className="text-3xl font-semibold ">Recorded Audios</h2>
                    {audioList.length > 0 ? (
                        <ul className="space-y-2">
                            {audioList.map((audio, index) => (
                                <li key={index} className="flex items-center justify-between hover:border-l-2 p-2 mt-2 cursor-pointer transition-all" onClick={() => playAudio(audio, index)} >
                                    <span>Recording {index + 1}</span>
                                    <button 
                                        className="bg-green-500 p-2 rounded-full text-white"
                                        
                                    >
                                        {isPlaying && currentAudio === audio ? (
                                            <Pause size={16} />
                                        ) : (
                                            <Play size={16} />
                                        )}
                                    </button>
                                    <audio
                                        ref={(el) => (audioRefs.current[index] = el)} // Assign audio ref to array
                                        src={audio}
                                        className="hidden"
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No recordings yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
