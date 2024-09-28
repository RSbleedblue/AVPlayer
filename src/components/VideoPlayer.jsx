import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Play, Pause } from 'lucide-react';

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

    useEffect(() => {
        const video = videoRef.current;

        const updateCurrentTime = () => {
            if (video) {
                setCurrentTime(video.currentTime);
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
    }, [videoRef]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="flex flex-col bg-brown backdrop-blur-md bg-opacity-30 lg:flex-row text-whiteColor p-4 lg:p-6 rounded-lg w-full lg:w-[80%] mx-auto shadow-md">
            {/* Video Section */}
            <div className="w-full lg:w-[50%] mb-4 lg:mb-0">
                <video
                    ref={videoRef}
                    width="100%"
                    height="auto"
                    onTimeUpdate={handleTimeUpdate}
                    className="rounded-2xl shadow-xl"
                >
                    <source
                        src="https://videos.pexels.com/video-files/3554563/3554563-hd_1920_1080_30fps.mp4" 
                        type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
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
                
            </div>
        </div>
    );
};

export default VideoPlayer;
