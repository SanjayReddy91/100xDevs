import React, { useState, useEffect } from 'react';

const Timer = () => {
    const [seconds, setSeconds] = useState(0);

    function update() {
        setSeconds(seconds => seconds+1)
    }

    useEffect(() => {
        setInterval(update, 5000);
        //return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return <div>{seconds} seconds elapsed</div>;
};

export default Timer