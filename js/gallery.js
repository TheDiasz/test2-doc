const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");

const apiKey = "qHWByn30ZGcOxVquwKBLhRZX5Jskrtv4hWH6YWQ2o74i21INCSpVI9BS";
const perPage = 10;
let currentPage = 1;
const collectionId = "pzsqj0x";


const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image"));
}

// Função para gerar HTML com as imagens
const generateHTML = (images) => {

    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <button onclick="downloadImg('${img.src.large2x}')">
                    <i class="uil uil-import"></i>
                </button>   
            </div>
        </li>`
    ).join("");
};

// Função para buscar imagens da coleção
const getImages = (apiURL) => {
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    })
    .then(res => {
        if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log("Resposta completa da API:", data); // Debug da resposta
        let images = [];
        if (data && data.media) {
            images = data.media; // Algumas coleções podem usar "media" em vez de "photos"
        } else if (data && data.photos) {
            images = data.photos;
        } else {
            console.error("Nenhum dado válido encontrado na resposta.");
            return;
        }

        // Ordenar as imagens de forma aleatória
        const shuffledImages = images.sort(() => Math.random() - 0.5);
        console.log("Imagens embaralhadas:", shuffledImages); // Debug do embaralhamento
        
        generateHTML(shuffledImages); // Passar imagens aleatórias para a função de renderização
    })
    .catch(err => {
        console.error("Erro ao buscar imagens:", err);
        imagesWrapper.innerHTML = "<p>Erro ao carregar imagens. Tente novamente mais tarde.</p>";
    });
};

// URL da API para buscar imagens da coleção
const apiURL = `https://api.pexels.com/v1/collections/${collectionId}?page=${currentPage}&per_page=${perPage}`;

// Chama a função para buscar as imagens
getImages(apiURL);



const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/collections/${collectionId}?page=${currentPage}&per_page=${perPage}`
    getImages(apiURL);
}





loadMoreBtn.addEventListener("click", loadMoreImages);