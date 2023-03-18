console.log("getPageMetas - begin")

var metas = document.getElementsByTagName('meta'); 
var metaArr = [];
for (var i=0; i<metas.length; i++) { 
    var name = metas[i].getAttribute("name");
    var property = metas[i].getAttribute("property");
    var httpequiv = metas[i].getAttribute("http-equiv");
    var content = metas[i].getAttribute("content");
    var charset = metas[i].getAttribute("charset");
    metaArr.push([name, property, httpequiv, content, charset]);
} 

chrome.runtime.sendMessage({
    method:"getMetas",
    metas:metaArr
});

console.log("got metas")
console.log("metaArr information: ", metaArr)

// make api call

const url = "https://api.openai.com/v1/engines/text-davinci-002/completions";
const body = {
    prompt: "What are some good ways to improve my productivity?",
    max_tokens: 600,
    n: 1,
    stop: ""
};
const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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"
};

fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers
}).then(response => {
    console.log("11111111")
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("ChatGPT API request failed.");
    }
}).then(data => {
    console.log(data.choices);
    console.log(data.choices[0].text);
    console.log(data.choices[0].text.trim());
}).catch(error => {
    console.error(error);
}).finally(() => {
    console.log("getPageMetas - end");
});
