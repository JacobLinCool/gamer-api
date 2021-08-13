import { response } from "./response";

async function getUser(request) {
    const { params, query } = request;
    const data = await fetch(`https://api.gamer.com.tw/mobile_app/bahamut/v1/home.php?owner=${params.username.toLowerCase()}&page=1`).then((r) => r.json());

    if (data.code === 0) {
        return response({
            data: JSON.stringify({ error: "User Not Found" }, null, query.min ? 0 : 2),
            status: 404,
        });
    }

    const user = data.userData;

    return response({
        data: JSON.stringify(
            {
                username: user.userid,
                nickname: user.nick,
                avatar: user.avatar,
                race: user.race,
                career: user.career,
                title: user.avatar_title,
                level: user.lv,
                gp: user.gp,
                gold: user.gold,
                honor: user.honor,
            },
            null,
            query.min ? 0 : 2
        ),
    });
}

async function getUserCreations(request) {
    const { params, query } = request;
    const depth = query.depth || 40;
    const creations = [];
    for (let i = 1; i <= depth; i++) {
        const data = await fetch(`https://api.gamer.com.tw/mobile_app/bahamut/v1/home.php?owner=${params.username.toLowerCase()}&page=${i}`).then((r) =>
            r.json()
        );
        if (data.code === 0) break;
        if (data.creation.length === 0) break;
        creations.push(...data.creation);
        if (data.creation.length < 15) break;
    }

    return response({ data: JSON.stringify(creations, null, query.min ? 0 : 2) });
}

export { getUser, getUserCreations };
