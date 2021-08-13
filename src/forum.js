import { response } from "./response";

async function getBoards(request) {
    const { query } = request;
    const offset = +query.offset || 0;
    const depth = +query.depth || 1;
    const boards = [];
    for (let i = offset + 1; i <= offset + depth; i++) {
        const { data } = await fetch(`https://api.gamer.com.tw/mobile_app/forum/v2/board_list.php?page=${i}`).then((r) => r.json());
        if (data.list.length === 0) break;
        boards.push(...data.list.map((x) => ({ ...x, favorite: undefined, rank_diff: undefined, topic_title: undefined, topic_sn: undefined })));
        if (data.list.length < 30) break;
    }

    return response({ data: JSON.stringify(boards, null, query.min ? 0 : 2) });
}

async function getBoard(request) {
    const { params, query } = request;
    const { data } = await fetch(`https://api.gamer.com.tw/mobile_app/forum/v3/B.php?bsn=${params.bsn}&page=1`).then((r) => r.json());
    if (!data) {
        return response({ data: JSON.stringify({ error: "無此版" }, null, query.min ? 0 : 2), satus: 404 });
    }

    const info = data.otherInfo;

    return response({
        data: JSON.stringify(
            {
                name: info.boardName,
                image: info.board_image,
                category: info.category,
                categoryId: info.category_id,
                summery: info.board_summary,
            },
            null,
            query.min ? 0 : 2
        ),
    });
}

// Not Finshed
async function getTopic(request) {
    const { params, query } = request;
    const offset = +query.offset || 0;
    const depth = +query.depth || 1;
    const topics = [];
    for (let i = offset + 1; i <= offset + depth; i++) {
        const { data } = await fetch(`https://api.gamer.com.tw/mobile_app/forum/v3/B.php?bsn=${params.bsn}&page=${i}`).then((r) => r.json());
        if (data.list.length === 0) break;
        topics.push(
            ...data.list.map((x) => ({
                title: x.title,
                summery: x.summery,
                sub: x.subboard_title,
                thumbnail: x.thumbnail,
                author: x.author,
                created: x.ctime,
                updated: x.reply_timestamp,
                gp: x.gp,
                bsn: x.bsn,
                snA: x.snA,
            }))
        );
        if (data.list.length < 30) break;
    }

    return response({ data: JSON.stringify(topics, null, query.min ? 0 : 2) });
}

export { getBoards, getBoard, getTopic };
