import express from "express";
import fs from "fs";

const app = express();

app.get("/video", (req, res) => {
    const video = "./asserts/Oscar_winning_short_film.mp4"
    const videoSize = fs.statSync(video).size;

    const range = req.headers.range;
    if (range) {
        const chunkSize = 50 ** 6;
        const rangeParts = range.replace(/bytes=/, "").split("-");
        const startingByte = parseInt(rangeParts[0], 10);
        const endingByte = Math.min(startingByte + chunkSize, videoSize - 1);
        const contentLength = endingByte - startingByte + 1;

        const videoStream = fs.createReadStream(video, {startingByte, endingByte});
        
        const headers = {
            "Content-Range": `bytes ${startingByte}-${endingByte}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4"
        }

        res.writeHead(206, headers);
        videoStream.pipe(res);
    } else {
        const headers = {
            "Content-Length": videoSize,
            "Content-Type": "video/mp4"
        }

        res.writeHead(200, headers);
        const videoStream = fs.createReadStream(video);
        videoStream.pipe(res);
    }
});

app.get("/test", (req, res) => {
    res.send("This is the test api.")
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening to ${port} port!!`);
});