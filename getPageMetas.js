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



console.log("got metas")
console.log("metaArr information: ", metaArr)

// get product title, description, manufacturer from metaArr
var title = "";
var ingredients = "";
var packaging = "";

for (var i=0; i<metaArr.length; i++) {
    if (metaArr[i][0] === "title") {
        title = metaArr[i][3];
    } else if (metaArr[i][0] === "description") {
        var desc = metaArr[i][3].toLowerCase();
        ingredients = desc;
        // if (desc.includes("ingredients")) {
        //     ingredients = desc.split("ingredients: ")[1];
        // } else if (desc.includes("packaging")) {
        //     packaging = desc.split("packaging: ")[1];
        // }
    }
}

console.log("title", title)
console.log("ingredients", ingredients)
console.log("packaging", packaging)
console.log("checkpoint 1")

const mark_prompt = `
Generate an eco friendly score out of 100 for the product and the company based on the following 
title: "${title}", 
ingredients: "${ingredients}", 
packaging type: "${packaging}". 
Give score out of 100 to each of the factors with an explanation regarding 
the pros and cons of the product's sustainability.

In addition, provide 3 alternative sustainable products similar to the product with title: "${title}" and their Amazon links.
`

console.log("prompt", mark_prompt)

const title_prompt = `
Generate an eco friendly score out of 100 for the product and the company based on the following 
title: "${title}", 
ingredients: "${ingredients}", 
packaging type: "${packaging}". 
Give score out of 100 to each of the factors with an explanation regarding 
the pros and cons of the product's sustainability.

In addition, provide 3 alternative sustainable products similar to the product with title: "${title}" and their Amazon links.
`

prompt = title_prompt

console.log("prompt", prompt)

// 3 chatgpt api calls
// 1. for score
// 2. for explanation of score
// 3. for alternatives

// to do: display the chatgpt result on the extension

// make api call to chatGPT
const url = "https://api.openai.com/v1/engines/text-davinci-002/completions";
const body = {
    prompt: prompt,
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
    chrome.runtime.sendMessage({
        method:"getMetas",
        metas:metaArr,
        data: data.choices[0].text
    });
}).catch(error => {
    console.error(error);
}).finally(() => {
    console.log("getPageMetas - end");
});

