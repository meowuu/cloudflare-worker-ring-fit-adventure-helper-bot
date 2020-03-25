const bot_token = "<TOKEN>";
const telegram_bot_api = "https://api.telegram.org/bot" + bot_token + "/";


//entry point
addEventListener('fetch', event => {
    const { request } = event
    const { url } = request
    if (url.includes('form')) {
        return event.respondWith(rawHtmlResponse(someForm))
    }
    if (request.method === 'POST') {
        return event.respondWith(handlePostRequest(request))
    } else if (request.method === 'GET') {
        return event.respondWith(handleRequest(request))
    }
})

async function handlePostRequest(request) {


    let bodyString = await readRequestBody(request)

    try {

        let body = JSON.parse(bodyString);

        const init = {
            headers: { 'content-type': 'application/json' },
        }

        if (body.message) {
            let payload = {
                "method": "sendMessage",
                "chat_id": body.message.chat.id,
                "text": "",
                "parse_mode": "HTML",
                "disable_web_page_preview": true,
                "reply_markup": ""
            };
            if (body.message.text) {

                if (body.message.text.startsWith("/ingredient") && body.message.text.split(" ").length == 2) {
                // payload.text = body.message.text;

                let target = body.message.text.split(" ")[1];
                var url = "https://github.com/meowuu/cloudflare-worker-ring-fit-adventure-helper-bot/raw/master/en.json";
                const init = {
                  method: "GET"
                };
                const response = await fetch(url, init);
                var resptxt = await response.text();
                var json = JSON.parse(resptxt);
                let list = json.filter(item => { return item["Ingredient 1"] == target || item["Ingredient 2"] == target || item["Ingredient 3"] == target || item["Ingredient 4"] == target || item["Ingredient 5"] == target; });

                let text= "你想找的材料 "+target+" 可以在以下关卡找到: ";

                list.forEach(function(item){
                    text += '\n世界: '+ item.World + ' 关卡: ' + item.level + ' 建议人物等级: ' + item['Lv.'];
                });

                payload.text = text;}

                if (body.message.text.startsWith("/start")||body.message.text.startsWith("/help")) {
                    payload.text = "/start - print this info\n/ingredient - search ingredient";
                }


                const opts = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                };

                let myRequest = new Request(telegram_bot_api, opts)

                fetch(myRequest);


                return new Response("OK")
            } else {
                return new Response("OK")
            }

        } else {
            return new Response(JSON.stringify(body), init)
        }

    } catch (e) {
        payload.text = e.message
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };
        let myRequest = new Request(telegram_bot_api, opts)

        //return new Response(e)
    }
}
async function handleRequest(request) {
    let retBody = `The request was a GET `
    return new Response(retBody)
}

/**
 * rawHtmlResponse delievers a response with HTML inputted directly
 * into the worker script
 * @param {string} html
 */
async function rawHtmlResponse(html) {
    const init = {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    }
    return new Response(html, init)
}
/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
    const { headers } = request
    const contentType = headers.get('content-type')
    if (contentType.includes('application/json')) {
        const body = await request.json()
        return JSON.stringify(body)
    } else if (contentType.includes('application/text')) {
        const body = await request.text()
        return body
    } else if (contentType.includes('text/html')) {
        const body = await request.text()
        return body
    } else if (contentType.includes('form')) {
        const formData = await request.formData()
        let body = {}
        for (let entry of formData.entries()) {
            body[entry[0]] = entry[1]
        }
        return JSON.stringify(body)
    } else {
        let myBlob = await request.blob()
        var objectURL = URL.createObjectURL(myBlob)
        return objectURL
    }
}
