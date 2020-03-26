import finder from './libs/finder'
import parseUrl from 'parseurl'
import { match } from 'path-to-regexp'

const bot_token = "<TOKEN>";
const telegram_bot_api = "https://api.telegram.org/bot" + bot_token + "/";


//entry point
addEventListener('fetch', event => {
    const { request } = event
    const { url } = request
    if (url.includes('form')) {
        // return event.respondWith(rawHtmlResponse(someForm))
    }
    if (request.method === 'POST') {
        return event.respondWith(handlePostRequest(request))
    } else if (request.method === 'GET') {
        return event.respondWith(handleRequest(request))
    }
})

async function handlePostRequest(request: Request) {
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
                  const [_, name] = body.message.text.split(" ")[1];
                
                  payload.text = finder(name)
                }

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
        const payload: any = {}
        payload.text = e.message
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };
        let myRequest = new Request(telegram_bot_api, opts)

        return new Response(e)
    }
}

async function handleRequest(request: Request) {
  const parsedUrl = parseUrl({ url: request.url } as any)
  let retBody = `The request was a GET `
  if (parsedUrl && parsedUrl.path) {
    const ingredientMatch = match<{
      name: string
    }>('/ingredient/:name')
    const matchResult = ingredientMatch(parsedUrl.path)
    if (matchResult) {
      retBody = finder(decodeURIComponent(matchResult.params.name))
    }
  }
  console.log(request.url)
  return new Response(retBody)
}

/**
 * rawHtmlResponse delievers a response with HTML inputted directly
 * into the worker script
 * @param {string} html
 */
async function rawHtmlResponse(html: string) {
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
async function readRequestBody(request: Request) {
    const { headers } = request
    const contentType = headers.get('content-type')
    if (contentType === null) {
      return ''
    }
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
        const body: any = {}
        formData.forEach((item, k) => {
          body[k] = item
        })
        return JSON.stringify(body)
    } else {
        let myBlob = await request.blob()
        var objectURL = URL.createObjectURL(myBlob)
        return objectURL
    }
}
