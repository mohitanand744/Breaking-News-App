apiKey = "1d3a0eefa97b499d8fbc4ee93eeb40b7";
apiUrl = `https://newsapi.org/v2/everything?q=`;

let fillCards = (articles) => {
  let cardContainer = document.getElementById("card-container");
  let template = document.getElementById("template");

  cardContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    let cardClone = template.content.cloneNode(true);
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#title");
    const newsSource = cardClone.querySelector("#source");
    const newsDesc = cardClone.querySelector("#Description");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    let description = article.description;
    let words = description.split(" ");
    let limitedDescription = words.slice(0, 19).join(" ");

    newsDesc.innerHTML = `${limitedDescription}...`;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;
    cardClone.firstElementChild.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    cardContainer.append(cardClone);
  });
};

let fetchNews = async (query) => {
  try {
    let fetchData = await fetch(`${apiUrl}${query}&apiKey=${apiKey}`);
    let res = await fetchData.json();

    document.getElementById("head").innerText = query;
    fillCards(res.articles);
  } catch {
    document.getElementById("head").innerText =
      "Sorry Our API is not Working..!!!";
  }
};

let showData = (query) => {
  fetchNews(query);
};
document.querySelector(".list-container").addEventListener("click", (e) => {
  const clickedElement = e.target;

  document.querySelectorAll(".list-container .active").forEach((element) => {
    element.classList.remove("active");
  });

  clickedElement.classList.add("active");
});

window.addEventListener("load", () => fetchNews("india"));
