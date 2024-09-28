import React, { createContext, useRef, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);

    const togglePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(currentProgress);
    };

    const handleSeek = (value) => {
        const seekTime = (value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = seekTime;
        setProgress(value);
    };

    return <AppContext.Provider value={{isPlaying,
        progress,
        videoRef,
        togglePlayPause,
        handleTimeUpdate,
        handleSeek}}>
        {children}
    </AppContext.Provider>
}