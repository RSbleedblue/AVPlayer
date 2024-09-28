import React, { useContext, useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AudioContext } from '../context/AudioContext';
import { Play, Pause, Square } from 'lucide-react';

const AudioRecorder = () => {
    const {
        isRecording,
        audioUrl,
        visualizationData,
        startRecording,
        stopRecording,
    } = useContext(AudioContext);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [recordingStartTime, setRecordingStartTime] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [timer, setTimer] = useState(0); // Track real-time duration

    // Start or pause the audio playback
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle seeking within the audio using the progress bar
    const handleSeek = (value) => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
            const seekTime = (value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
            setProgress(value);
        }
    };

    // Update the progress bar as the audio plays
    const updateProgress = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
            const currentTime = audioRef.current.currentTime;
            const totalDuration = audioRef.current.duration;
            const percent = (currentTime / totalDuration) * 100;
            setProgress(percent);
            setDuration(totalDuration);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleStartRecording = () => {
        setRecordingDuration(0);
        setRecordingStartTime(Date.now());
        setTimer(0); 
        startRecording();
    };

    const handleStopRecording = () => {
        stopRecording();
        if (recordingStartTime) {
            const endTime = Date.now();
            const duration = (endTime - recordingStartTime) / 1000;
            setRecordingDuration(duration);
        }
        setRecordingStartTime(null);
    };

    // Track real-time recording duration
    useEffect(() => {
        let interval = null;
        if (isRecording) {
            interval = setInterval(() => {
                setTimer((prevTime) => prevTime + 1); // Increment every second
            }, 1000);
        } else if (!isRecording) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRecording]);

    // Add event listeners to update progress during playback
    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;

            // Sync progress bar and audio state during playback
            audio.addEventListener('timeupdate', updateProgress);

            // Set the duration once metadata is loaded
            audio.addEventListener('loadedmetadata', () => {
                setDuration(audio.duration);
            });

            // Reset progress when the audio ends
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                setProgress(100);
            });

            return () => {
                audio.removeEventListener('timeupdate', updateProgress);
                audio.removeEventListener('loadedmetadata', updateProgress);
                audio.removeEventListener('ended', () => setIsPlaying(false));
            };
        }
    }, [audioUrl]);

    return (
        <div className="p-4 bg-baseColor space-y-4 w-full max-w-4xl mx-auto text-whiteColor mb-10 flex flex-col items-start">
            <p className='text-3xl md:text-[80px] font-semibold mb-4 mt-10'>Record Audio</p>
            <div className="flex space-x-4 mb-6">
                <button 
                    onClick={handleStartRecording} 
                    disabled={isRecording} 
                    className='p-3 md:p-4 border border-opacity-10 border-baseColor text-base md:text-lg rounded-full shadow-xl hover:scale-105 transition-all bg-blue-500 text-white flex items-center justify-center'
                >
                    <Play size={24} />
                    <span className="hidden md:inline ml-2">Start</span>
                </button>
                <button 
                    onClick={handleStopRecording} 
                    disabled={!isRecording} 
                    className='p-3 md:p-4 border border-opacity-10 border-baseColor text-base md:text-lg rounded-full shadow-xl hover:scale-105 transition-all bg-red-500 text-white flex items-center justify-center'
                >
                    <Square size={24} />
                    <span className="hidden md:inline ml-2">Stop</span>
                </button>
            </div>

            <div className='flex flex-col md:flex-row w-full justify-between gap-6'>
                <div className='w-full md:w-[50%]'>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlayPause}
                            className="bg-white text-gray-900 rounded-full p-2 shadow-md hover:scale-105 transition-all"
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) => handleSeek(parseFloat(e.target.value))}
                            className="w-full"
                        />
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onEnded={() => setIsPlaying(false)}
                            className="hidden"
                        />
                    </div>
                    <div className="flex justify-between text-gray-600 mt-2">
                        <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    {isRecording && (
                        <div className="text-sm text-gray-600 mt-4">
                            <p className='font-semibold text-xl md:text-2xl'>Recording Time: {formatTime(timer)}</p>
                        </div>
                    )}
                    {recordingStartTime && (
                        <div className="text-sm text-gray-600 mt-4">
                            <p className='font-semibold text-xl md:text-2xl'>Recording Duration: {formatTime(recordingDuration)}</p>
                        </div>
                    )}
                </div>

                <div className="h-64 w-full md:w-[100%]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={visualizationData}>
                            <XAxis dataKey="x" hide />
                            <YAxis hide domain={[-100, 100]} />
                            <Tooltip 
                                content={({ payload }) => {
                                    if (payload && payload.length) {
                                        return (
                                            <div className="bg-white p-2 rounded shadow">
                                                <p className="text-sm">{`Value: ${payload[0].value.toFixed(2)}`}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="y" 
                                stroke="url(#gradient)" 
                                strokeWidth={3} 
                                dot={false}
                                animationDuration={300}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="50%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#ffc658" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AudioRecorder;
