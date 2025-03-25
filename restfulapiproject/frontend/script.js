function getAPI() 
{
    window.location.href = "index2.html";
}

function getURL() 
{
    let language = document.getElementById('languageSelection').value;
    let year = document.getElementById('yearSelection').value;
    let rating = document.getElementById('ratingSelection').value;

    let url = "http://127.0.0.1:5000/data?";

    if (language !== 'all') {
        url += `language=${language}&`;
    }
    if (year) {
        url += `year=${year}&`;
    }
    if (rating) {
        url += `rating=${rating}&`;
    }

    if (url.endsWith('&')) {
        url = url.slice(0, -1);
    }

    return url;
}

function updateURL() 
{
    let url = getURL();
    document.getElementById('url').innerHTML = `Your URL: <a href="${url}" target="_blank" style="color: black; text-decoration: underline;">${url}</a>`;

    fetchDataPreview(url);
}


function fetchDataPreview(url) 
{
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const previewContainer = document.getElementById('dataPreview');
            previewContainer.innerHTML = '';
            const randomRows = getRandomRows(data, 3);
            const jsonData = JSON.stringify(randomRows, null, 2);
            previewContainer.innerHTML += `${jsonData}` ;
        })
        .catch(error => {
            console.error("Error fetching preview data:", error);
            document.getElementById('dataPreview').innerHTML = "<p>Error fetching preview data.</p>";
        });
}

function getRandomRows(data, n) 
{
    let temp = data;
    for (let i = temp.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));

        let t = temp[i];
        temp[i] = temp[randomIndex];
        temp[randomIndex] = t;
    }    
    return temp.slice(0, n); 
}



document.getElementById('languageSelection').addEventListener('change', updateURL);
document.getElementById('yearSelection').addEventListener('input', updateURL);
document.getElementById('ratingSelection').addEventListener('input', updateURL);

window.onload = updateURL;