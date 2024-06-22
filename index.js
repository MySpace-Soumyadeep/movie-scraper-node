const cheerio = require("cheerio");
const request = require("request-promise")
const json2csv = require('json2csv')
const fs = require('fs')

// const movie = "https://www.imdb.com/title/tt0898266/";
const movies = ["https://www.imdb.com/title/tt0898266/", "https://www.imdb.com/title/tt6226232/?ref_=tt_sims_tt_i_1", "https://www.imdb.com/title/tt0108778/?ref_=tt_sims_tt_i_4"];

(async () => {
    let imdbData = []
    for (let movie of movies) {
        const response = await request({
            uri: movie,
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-encoding': 'gzip, deflate, br, zstd',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8'
            },
            gzip: true,
        });

        let $ = cheerio.load(response)
        let title = $('span[class="hero__primary-text"]').text()
        let rating_value = parseFloat($('span[class="sc-bde20123-1 cMEQkK"]').text())

        imdbData.push({
            title,
            rating_value
        })
    }

    console.log({ imdbData });

    const csv = json2csv.parse(imdbData);

    fs.writeFileSync("./imdb.csv", csv, "utf-8")
})()