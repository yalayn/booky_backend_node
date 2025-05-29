
async function countReadingSessionsByUser(listReadingSessions){
    let time = 0;
    for (const session of listReadingSessions) {
        time = time + session.seconds;
    }
    return {"hours":formatTime(time), seconds:time};
}

const formatTime = (readingTime) => {
    const hours = Math.floor(readingTime / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((readingTime % 3600) / 60).toString().padStart(2, "0");
    const seconds = Math.floor(readingTime % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

module.exports = countReadingSessionsByUser;