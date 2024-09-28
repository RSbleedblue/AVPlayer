import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Play, Pause } from 'lucide-react';
import captions from '../assets/caption';

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
    const [isTyping, setIsTyping] = useState(false);
    const [typeIndex, setTypeIndex] = useState(0);

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

    useEffect(() => {
        const caption = captions.find(c => currentTime >= c.time);
        if (caption) {
            // Start typing effect when a new caption is found
            setCurrentCaption(caption.translated); // Show translated text
            setIsTyping(true);
            setTypeIndex(0);
        } else {
            setCurrentCaption('');
        }
    }, [currentTime]);

    useEffect(() => {
        if (isTyping && currentCaption) {
            const typingInterval = setInterval(() => {
                setTypeIndex(prev => {
                    const newIndex = prev + 1;
                    if (newIndex > currentCaption.length) {
                        clearInterval(typingInterval);
                        setIsTyping(false);
                        return prev; // Stop at the full length
                    }
                    return newIndex;
                });
            }, 100); // Adjust typing speed here

            return () => clearInterval(typingInterval);
        }
    }, [isTyping, currentCaption]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleCaptionChange = (e, type) => {
        const newCaption = e.target.value;
        // Logic to handle editing the caption
        // You might want to update the corresponding caption in your captions array
        if (type === 'original') {
            // Update original caption logic
        } else if (type === 'translated') {
            setCurrentCaption(newCaption); // Updating the translated caption
        }
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
                {/* Dialogue Display */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-300 mb-1">Dialogue</h3>
                    <div className="p-2 bg-gray-700 text-white rounded-md">
                        {/* Show typed text */}
                        {currentCaption.slice(0, typeIndex)}
                        {/* Optional typing effect cursor */}
                        {isTyping && <span className="animate-pulse">|</span>}
                    </div>
                </div>
                {/* Editable Fields for Original and Translated Text */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-300 mb-1">Edit Captions</h3>
                    <input
                        type="text"
                        placeholder="Original Text"
                        onChange={(e) => handleCaptionChange(e, 'original')}
                        className="w-full p-2 mb-2 rounded-md text-black"
                    />
                    <input
                        type="text"
                        placeholder="Translated Text"
                        value={currentCaption} // Reflect the current translated caption
                        onChange={(e) => handleCaptionChange(e, 'translated')}
                        className="w-full p-2 rounded-md text-black"
                    />
                </div>
                {/* Audio Signal Visualization */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-300 mb-1">Audio Signal</h3>
                    <div className="w-full h-2 bg-gray-600">
                        {/* Placeholder for audio signal - can be enhanced with an actual visualization */}
                        <div className="h-full bg-blue-500" style={{ width: `${(currentTime / duration) * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
