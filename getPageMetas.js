const API_KEY = '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'

console.log("getPageMetas - begin")

const productDescription = document.querySelector('#productDescription')?.innerText.trim();
console.log("Product Description: ", productDescription);



let typicalPackage = '';
if (productDescription?.includes('Typical Package')) {
  typicalPackage = productDescription.split('Typical Package :')[1].split('.')[0].trim();
}
console.log("Typical Package: ", typicalPackage);


///////////////
///////////////


// const table = document.querySelector('#productOverview_feature_div').querySelectorAll('.a-list-item');
const table = document.querySelector('#productOverview_feature_div');
console.log("table: ", table);

// add "div" to query selector string until qeury is not null
const Brand = document.querySelector('#productOverview_feature_div div div div table tbody .po-brand .a-span9 span')?.textContent;
console.log("Brand: ", Brand);
const Brand2 = document.querySelector('#productOverview_feature_div div div table tbody .po-brand .a-span9 span')?.textContent;
console.log("Brand: ", Brand2);
const compatible_devices = document.querySelector('#productOverview_feature_div div div div table tbody .po-compatible_devices .a-span9 span')?.textContent;
console.log("compatible_devices: ", compatible_devices);
const ConnectivityTechnology = document.querySelector('#productOverview_feature_div div div div table tbody .po-connectivity_technology .a-span9 span')?.textContent;
console.log("Brand: ", ConnectivityTechnology);
const KeyboardBacklighting = document.querySelector('#productOverview_feature_div div div div table tbody .po-keyboard_backlighting_color_support .a-span9 span')?.textContent;
console.log("Brand: ", KeyboardBacklighting);

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

const score_prompt = `
Generate an eco friendly score out of 100 for the product and the company based on the following 
title: "${title}", 
ingredients: "${ingredients}", 
packaging type: "${packaging}".`

console.log("prompt", score_prompt)

const description_prompt = `
Generate an eco friendly score out of 100 for the product and the company based on the following 
title: "${title}", 
ingredients: "${ingredients}", 
packaging type: "${packaging}". 
Give score out of 100 to each of the factors with an explanation regarding 
the pros and cons of the product's sustainability.
`

console.log("prompt", description_prompt)

const alternative_prompt = `
provide 3 alternative sustainable products similar to the product
title: "${title}", 
ingredients: "${ingredients}", 
packaging type: "${packaging}"`

console.log("prompt", alternative_prompt)

// 3 chatgpt api calls
// 1. for score
// 2. for explanation of score
// 3. for alternatives

// to do: display the chatgpt result on the extension

// make api call to chatGPT
const url = "https://api.openai.com/v1/engines/text-davinci-002/completions";
const body = {
    prompt: [score_prompt, description_prompt, alternative_prompt],
    max_tokens: 600,
    n: 1,
    stop: ""
};
const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + API_KEY
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
        score:data.choices[0].text,
        explanation:data.choices[1].text,
        alternatives:data.choices[2].text
    });
}).catch(error => {
    console.error(error);
}).finally(() => {
    console.log("getPageMetas - end");
});

