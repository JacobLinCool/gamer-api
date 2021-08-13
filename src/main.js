import { Router } from "itty-router";
import { response } from "./response";
import { getUser, getUserCreations } from "./user";
import { getBoards, getBoard, getTopic } from "./forum";

const router = Router();

router.get("/user", async (request) => {
    const { query } = request;
    return response({
        data: JSON.stringify({ usage: { getUser: "GET /user/{username}", getUserCreations: "GET /user/{username}/creations" } }, null, query.min ? 0 : 2),
        status: 400,
    });
});
router.get("/user/:username", getUser);
router.get("/user/:username/", getUser);
router.get("/user/:username/creations", getUserCreations);

router.get("/forum", async (request) => {
    const { query } = request;
    return response({
        data: JSON.stringify(
            { usage: { getBoards: "GET /forum/boards", getBoard: "GET /forum/board/{bsn}", getTopic: "GET /forum/board/{bsn}/topics" } },
            null,
            query.min ? 0 : 2
        ),
        status: 400,
    });
});
router.get("/forum/boards", getBoards);
router.get("/forum/board/:bsn", getBoard);
router.get("/forum/board/:bsn/topics", getTopic);

router.all("*", async (request) => {
    const { query } = request;
    return response({ data: JSON.stringify({ error: "Unknown Request" }, null, query.min ? 0 : 2), status: 400 });
});

async function main() {
    addEventListener("fetch", (event) => {
        event.respondWith(
            router.handle(event.request).catch((err) => {
                console.error(err);
                return response({ data: JSON.stringify({ error: err.message }, null, 2), status: 500 });
            })
        );
    });

    addEventListener("scheduled", (event) => {
        event.waitUntil(handle_cron(event));
    });
}

export { main };
