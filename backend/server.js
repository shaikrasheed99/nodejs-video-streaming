import express from "express";

const app = express();

app.get("/test", (req, res) => {
    res.send("This is the test api.")
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening to ${port} port!!`);
});