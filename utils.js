import fs from 'fs'
import path from 'path'

var proxyData = []
var proxiesToBeRemoved = []


// const saveEntries = async (data) => {
//     const writeStream = fs.createWriteStream(csvPath, { flags: 'a' })
//     const stream = format({ delimiter: '\t', includeEndRowDelimiter: true })
//     stream.pipe(writeStream).on('end', () => process.exit())
//     if (!fs.existsSync(csvPath)) {
//         stream.write(header)
//     }
//     stream.write([data])
//     stream.end()
// }


const parseProxies = (data) =>
    data.split('\r\n').map(p => {
        let [serverName, port, username, password] = p.split(':')
        let server = serverName + ":" + port
        return {
            server, username, password
        }
    })

export const getProxies = (i) => {
    if (proxyData.length == 0) {
        const proxies = fs.readFileSync('./proxies.txt', 'utf-8')
        proxyData = parseProxies(proxies)
    } else if (i > proxyData.length) console.log("All proxies used up")
    return proxyData[i]
}

export const getRandomProxies = () => {
    if (proxyData.length == 0) {
        const proxies = fs.readFileSync('./proxies.txt', 'utf-8')
        proxyData = parseProxies(proxies)
    }
    return proxyData[Math.floor(Math.random() * proxyData.length)]
}


function blockingWait(seconds) {
    //simple blocking technique (wait...)
    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while (waitTill > new Date()) { }
}

export function sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export const addToRemoveQueue = (i) => proxiesToBeRemoved.push(i)

export const removeLines = () => {
    const data = fs.readFileSync('./proxies.txt', 'utf-8')
    const modifiedData = data.split('\n').filter((l, i) => proxiesToBeRemoved.indexOf(i) === -1).join('\n')
    fs.writeFileSync('./proxies.txt', modifiedData, 'utf-8')
    console.log('proxies removed')
}
