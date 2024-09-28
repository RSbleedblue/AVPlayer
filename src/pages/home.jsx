import AudioRecorder from "../components/AudioRecorder";
import VideoPlayer from "../components/VideoPlayer";

const Home = () => {
    return (
        <div className="flex w-full flex-col ">
            {/* Video Player */}
            <VideoPlayer/>
            {/* Audio Recorder */}
            <AudioRecorder/>
        </div>    
    );
};

export default Home;
