const path = require("path");
const express = require("express");
const app = express();

const PUBLIC_DIR = __dirname + "/public";

app.use(express.static(PUBLIC_DIR));

app.get("/", function name(req, res) {
	console.log("This rebuild");
	res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

const PORT = process.env.PORT || 8090;

app.listen(PORT, () => {
	console.log("App running");
});
