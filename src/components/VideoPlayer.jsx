import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Play, Pause } from 'lucide-react';

const captions = [
    { start: 0, end: 5, text: { en: 'A car driving at night.', es: 'Un coche conduciendo por la noche.' } },
    { start: 6, end: 10, text: { en: 'The road is clear.', es: 'El camino está despejado.' } },
    { start: 11, end: 15, text: { en: 'Heading to the city.', es: 'Dirigiéndose a la ciudad.' } },
    { start: 16, end: 20, text: { en: 'The lights flicker in the distance.', es: 'Las luces parpadean a lo lejos.' } },
    { start: 21, end: 25, text: { en: 'Traffic begins to build.', es: 'El tráfico comienza a acumularse.' } },
    { start: 26, end: 30, text: { en: 'The driver checks the time.', es: 'El conductor mira la hora.' } },
    { start: 31, end: 39, text: { en: 'The city skyline appears.', es: 'Aparece el horizonte de la ciudad.' } },
];

const VideoPlayer = () => {
    const {
        isPlaying,
        progress,
        videoRef,
        togglePlayPause,
        handleTimeUpdate,
        handleSeek
    } = useContext(AppContext);
    
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentCaption, setCurrentCaption] = useState('');
    const [language, setLanguage] = useState('en'); 

    useEffect(() => {
        const video = videoRef.current;

        const updateCurrentTime = () => {
            if (video) {
                setCurrentTime(video.currentTime);
                updateCaption(video.currentTime);
            }
        };

        const updateDuration = () => {
            if (video) {
                setDuration(video.duration);
            }
        };

        if (video) {
            video.addEventListener('timeupdate', updateCurrentTime);
            video.addEventListener('loadedmetadata', updateDuration);
        }

        return () => {
            if (video) {
                video.removeEventListener('timeupdate', updateCurrentTime);
                video.removeEventListener('loadedmetadata', updateDuration);
            }
        };
    }, [videoRef, language]);
    const updateCaption = (time) => {
        const caption = captions.find(
            (caption) => time >= caption.start && time <= caption.end
        );
        if (caption) {
            setCurrentCaption(caption.text[language]);
        } else {
            setCurrentCaption(''); 
        }
    };
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    return (
        <div className="flex flex-col bg-brown backdrop-blur-md bg-opacity-30 lg:flex-row text-whiteColor p-4 lg:p-6 rounded-b-lg w-full lg:w-[80%] mx-auto shadow-md">
            {/* Video Section */}
            <div className="relative w-full lg:w-[50%] mb-4 lg:mb-0">
                <video
                    ref={videoRef}
                    width="100%"
                    height="auto"
                    onTimeUpdate={handleTimeUpdate}
                    className="rounded-2xl shadow-xl"
                >
                    <source
                        src="https://videos.pexels.com/video-files/3554563/3554563-hd_1920_1080_30fps.mp4"
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
                {/* Caption Overlay */}
                <div className="absolute bottom-10 w-full text-center">
                    <p className="text-lg lg:text-xl bg-black bg-opacity-50 text-white py-2 px-4 rounded-md">
                        {currentCaption}
                    </p>
                </div>
            </div>
            {/* Info and Controls Section */}
            <div className="w-full lg:w-[50%] flex flex-col justify-center lg:px-6 text-white">
                <p className="text-sm text-gray-300 mb-1">Season 1 • Episode 1</p>
                <h1 className="text-2xl lg:text-4xl font-bold mb-2">Man Driving A Car At Night</h1>
                <h2 className="text-lg lg:text-xl font-semibold mb-4 text-gray-300">Simple, but significant.</h2>
                {/* Controls */}
                <div className="flex items-center gap-4 lg:gap-6 mb-2">
                    <button
                        onClick={togglePlayPause}
                        className="bg-white text-gray-900 rounded-full p-2 lg:p-3 hover:bg-gray-200 transition-colors"
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => handleSeek(e.target.value)}
                        className="w-full accent-white"
                    />
                </div>
                {/* Time display */}
                <div className="flex justify-between text-sm text-gray-300">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Language Selector */}
                <div className="mt-4">
                    <label className="text-sm text-gray-300 mr-2">Translate Language: </label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-baseColor text-white rounded p-2 text-xs"
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        {/* Add more languages here */}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
