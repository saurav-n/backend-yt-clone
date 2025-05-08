function convertMillisecondsToTimestamp(secs:number) {
    const fixedSecs=Number(secs.toFixed())
    const hours = Math.floor(fixedSecs / 3600);        // Calculate hours
    const minutes = Math.floor((fixedSecs % 3600) / 60); // Remaining minutes
    const seconds =  fixedSecs% 60;                   // Remaining seconds

    // Format hours, minutes, and seconds with leading zero if needed
    const formattedHours = hours > 0 ? `${hours}:` : ''; // Include hours only if > 0
    const formattedMinutes = `${hours > 0 && minutes < 10 ? '0' : ''}${minutes}`;
    const formattedSeconds = `${seconds < 10 ? '0' : ''}${seconds}`;

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}

export default convertMillisecondsToTimestamp