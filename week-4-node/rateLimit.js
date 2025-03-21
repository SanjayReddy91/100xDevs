const express = require("express");
const app = express();

let numberOfRequestsForUser = new Map();

setInterval(() => {
    numberOfRequestsForUser.forEach((value, key) => {
        numberOfRequestsForUser.set(key, 0);
    });
}, 10000);

app.use(function (req, res, next) {
    const userId = req.headers["user-id"];
    console.log(numberOfRequestsForUser);

    if (!userId) {
        return res.status(400).send("User-ID header is required.");
    }

    if (!numberOfRequestsForUser.has(userId) && (req.path !== "/user" || req.method !== "POST")) {
        return res.status(401).send("User not registered.");
    }

    if (req.path === "/user" && req.method === "POST") {
        next(); // Allow signup requests to proceed
        return;
    }

    if (numberOfRequestsForUser.has(userId)) {
        let currentCount = numberOfRequestsForUser.get(userId) || 0;
        numberOfRequestsForUser.set(userId, currentCount + 1);

        if (currentCount + 1 > 5) {
            return res.status(429).send("Too many requests."); // Use 429 for rate limiting
        }
    } else {
      numberOfRequestsForUser.set(userId,1);
    }
    next();
});

app.get("/user", function (req, res) {
    res.status(200).json({ name: "Rohan" });
});

app.post("/user", function (req, res) {
    const userId = req.headers["user-id"];
    if(numberOfRequestsForUser.has(userId)){
      return res.status(400).send("User Already Exists");
    }
    numberOfRequestsForUser.set(userId, 0); // Initialize count to 0 after signup
    res.status(201).json({ msg: "User registered successfully." }); // Use 201 for resource creation
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});