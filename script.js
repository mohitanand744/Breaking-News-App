apiUrl = `https://newsapi.org/v2/everything?q=`;

let fetchNews = async (query) => {
  try {
    let fetchData = await fetch(
      `${apiUrl}${query}&apiKey=a4b9eeed786d4868bf252831e3c9dbe9`
    );
    let res = await fetchData.json();

    document.getElementById("head").innerText = query;
    fillCards(res.articles);
    initPagination();
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

let searchButton = document.querySelector(".btn");
searchButton.addEventListener("click", () => {
  let searchText = document.querySelector(".search-text").value;
  const query = searchText;
  if (!query) {
    document.getElementById("head").innerText = "Please Give Some Input";
  } else {
    fetchNews(query);
  }
});

window.addEventListener("load", () => {
  fetchNews("india");
});

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

// ! pagination Code

const initPagination = () => {
  let pageNumbers = document.querySelector(".pageNumbers");
  let cardContainer = document.getElementById("card-container");
  let cardList = cardContainer.querySelectorAll(".card");
  let prevBtn = document.getElementById("prevBtn");
  let nextBtn = document.getElementById("nextBtn");

  let cardLimit = 9;
  let pageCount = Math.ceil(cardList.length / 4);
  let currentPage = 1;

  const displayPageNumbers = () => {
    pageNumbers.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const pageNumber = document.createElement("a");
      pageNumber.setAttribute("href", "#");
      pageNumber.setAttribute("index", i);
      pageNumber.innerText = i;
      pageNumbers.appendChild(pageNumber);
    }
  };

  const disableButton = (button, condition) => {
    button.classList.toggle("disabled", condition);
    button.disabled = condition;
  };

  const controlButtonsStatus = () => {
    disableButton(prevBtn, currentPage === 1);
    disableButton(nextBtn, pageCount === currentPage);
  };

  const handleActivePageNumber = () => {
    pageNumbers
      .querySelectorAll("a")
      .forEach((button) =>
        button.classList.toggle(
          "bgActive",
          Number(button.getAttribute("index")) === currentPage
        )
      );
  };

  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;
    controlButtonsStatus();
    handleActivePageNumber();

    const prevRange = (pageNum - 1) * cardLimit;
    const currRange = pageNum * cardLimit;

    cardList.forEach((card, index) => {
      card.classList.toggle("hidden", index < prevRange || index >= currRange);
    });
  };

  const handlePageClick = (e) => {
    e.preventDefault();
    const pageNum = Number(e.target.getAttribute("index"));
    if (pageNum) {
      setCurrentPage(pageNum);
    }
  };

  pageNumbers.addEventListener("click", handlePageClick);
  prevBtn.addEventListener("click", () => setCurrentPage(currentPage - 1));
  nextBtn.addEventListener("click", () => setCurrentPage(currentPage + 1));

  displayPageNumbers();
  controlButtonsStatus();
  setCurrentPage(1);
};
