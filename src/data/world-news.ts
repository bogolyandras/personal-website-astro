
export type News = {
    name: string,
    websites: {
        name: string,
        url: string
    }[]
}

const worldNewsData : News[][] = [
    [
        {
            name: "United Kingdom",
            websites: [
                { name: "The Guardian", url: "https://www.theguardian.com" },
                { name: "British Broadcasting Corporation (BBC)", url: "https://www.bbc.com/" },
                { name: "The Telegraph", url: "https://www.telegraph.co.uk" },
                { name: "Financial Times", url: "https://www.ft.com/" },
                { name: "The Independent", url: "https://www.independent.co.uk/" }
            ]
        },
        {
            name: "United States",
            websites: [
                { name: "Cable News Network (CNN)", url: "https://cnn.com/" },
                { name: "The New York Times", url: "https://www.nytimes.com/" },
                { name: "Fox News", url: "https://www.foxnews.com/" },
                { name: "NBC News", url: "https://www.nbcnews.com/" },
                { name: "Washington Post", url: "https://www.washingtonpost.com/" },
                { name: "The Wall Street Journal", url: "https://www.wsj.com/" },
                { name: "USA Today", url: "https://www.usatoday.com/" },
                { name: "Los Angeles Times", url: "https://www.latimes.com/" },
                { name: "Bloomberg", url: "https://www.bloomberg.com" },
                { name: "Reuters", url: "https://www.reuters.com/" },
                { name: "Public Radio International", url: "https://www.pri.org/" },
                { name: "CNBC", url: "https://www.cnbc.com/" },
                { name: "New York Post", url: "https://nypost.com/" },
                { name: "Time", url: "https://time.com/" },
                { name: "The Atlantic", url: "https://www.theatlantic.com" },
                { name: "U.S. News", url: "https://www.usnews.com/" },
                { name: "CBS News", url: "https://www.cbsnews.com/" },
                { name: "Houston Chronicle", url: "https://www.chron.com/" },
                { name: "SFGate", url: "https://www.sfgate.com/" }
            ]
        },
        {
            name: "Australia",
            websites: [
                { name: "ABC News", url: "https://abcnews.go.com/" },
                { name: "news.com.au", url: "https://www.news.com.au/" }
            ]
        },
        {
            name: "Canada",
            websites: [
                { name: "Canadian Broadcasting Corporation (CBC)", url: "https://www.cbc.ca/" }
            ]
        },
        {
            name: "France",
            websites: [
                { name: "France 24", url: "https://www.france24.com/en/" }
            ]
        },
        {
            name: "Germany",
            websites: [
                { name: "Deutsche Welle", url: "https://www.dw.com/en/" },
                { name: "Spiegel", url: "https://www.spiegel.de/international/" }
            ]
        }
    ],
    [
        {
            name: "Japan",
            websites: [
                { name: "Nikkei Asian Review", url: "https://asia.nikkei.com/" },
                { name: "The Asahi Shimbun", url: "https://www.asahi.com/ajw/" },
                { name: "The Japan News", url: "https://the-japan-news.com/" },
                { name: "The Japan Times", url: "https://www.japantimes.co.jp/" }
            ]
        },
        {
            name: "South Korea",
            websites: [
                { name: "The Chosun Ilbo", url: "https://english.chosun.com/" },
                { name: "Korea Joongang Daily", url: "https://koreajoongangdaily.joins.com/" },
                { name: "The Hankyoreh", url: "https://english.hani.co.kr/" },
                { name: "Daily NK", url: "https://www.dailynk.com/english/" }
            ]
        },
        {
            name: "Taiwan",
            websites: [
                { name: "Taipei Times", url: "https://www.taipeitimes.com/" }
            ]
        },
        {
            name: "Singapore",
            websites: [
                { name: "Straits Times", url: "https://www.straitstimes.com/" }
            ]
        },
        {
            name: "Malaysia",
            websites: [
                { name: "New Straits Times", url: "https://www.nst.com.my" }
            ]
        },
        {
            name: "Qatar",
            websites: [
                { name: "Al Jazeera", url: "https://www.aljazeera.com/" }
            ]
        },
        {
            name: "United Arab Emirates",
            websites: [
                { name: "Gulf news", url: "https://gulfnews.com/" }
            ]
        },
        {
            name: "Saudi Arabia",
            websites: [
                { name: "Arab news", url: "https://www.arabnews.com/" }
            ]
        },
        {
            name: "India",
            websites: [
                { name: "India Times", url: "https://www.indiatimes.com/" },
                { name: "Hindustan Times", url: "https://www.hindustantimes.com/" },
                { name: "The Hindu", url: "https://www.thehindu.com/" },
                { name: "TFIPost", url: "https://tfipost.com/" }
            ]
        },
        {
            name: "Israel",
            websites: [
                { name: "The Jerusalem Post", url: "https://www.jpost.com/" }
            ]
        }
    ],
    [
        {
            name: "Russia",
            websites: [
                { name: "Russia Today", url: "https://www.rt.com" },
                { name: "Pravda", url: "https://english.pravda.ru/" },
                { name: "Sputnik News", url: "https://sputniknews.com/" },
                { name: "Itar Tass", url: "https://tass.com/" }
            ]
        },
        {
            name: "China",
            websites: [
                { name: "South China Morning Post", url: "https://www.scmp.com/" },
                { name: "CGTN", url: "https://www.cgtn.com/" },
                { name: "CCTV", url: "https://english.cctv.com/" },
                { name: "Xinhua", url: "https://english.news.cn/" },
                { name: "People's Daily", url: "http://en.people.cn/" },
                { name: "China Daily", url: "https://www.chinadaily.com.cn/" },
                { name: "Caixin", url: "https://www.caixinglobal.com/" }
            ]
        },
        {
            name: "Turkey",
            websites: [
                { name: "Anadolu Agency", url: "https://aa.com.tr/en" }
            ]
        },
        {
            name: "North Korea",
            websites: [
                { name: "Rodong Sinmun", url: "http://rodong.rep.kp/en/" }
            ]
        }
    ]
];

export default worldNewsData
