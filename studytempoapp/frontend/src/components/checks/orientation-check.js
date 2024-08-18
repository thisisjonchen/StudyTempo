import React, { useEffect, useState } from 'react';
import StudyTempoLogo from "../../assets/st-logo.png";

const OrientationCheck = () => {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsPortrait(window.innerWidth < window.innerHeight);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const studyTempoDiv = document.getElementById('StudyTempo');
        if (studyTempoDiv) {
            if (isPortrait) {
                studyTempoDiv.style.height = '100vh';
                studyTempoDiv.style.overflow = 'hidden';
            } else {
                studyTempoDiv.style.height = '';
                studyTempoDiv.style.overflow = '';
            }
        }

        return () => {
            if (studyTempoDiv) {
                studyTempoDiv.style.height = '';
                studyTempoDiv.style.overflow = '';
            }
        };
    }, [isPortrait]);

    if (!isPortrait) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
            <div className="flex flex-col items-center">
                <img alt="StudyTempo Logo" src={StudyTempoLogo} className="w-20 pb-4"/>
                <h1 className="text-2xl pb-2"><span className="font-bold">Study</span>Tempo</h1>
                <h2 className="text-red-600 font-bold">Landscape mode please</h2>
                <h6>Phones are not recommended</h6>
            </div>
        </div>
    );
};

export default OrientationCheck;