import PageManager from "../../theme/page-manager";

export default class ProductData extends PageManager {
    constructor(context) {
        super(context);
        // console.log("context", context);
        this.accesstoken = context.credential;
        this.prdctId = context.productId;
    }

    onReady() {
        this.getCategory();
    }

    getCategory() {
        // console.log("accesstoken", this.accesstoken);
        // console.log("productId", this.prdctId);

        fetch("/graphql", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.accesstoken}`,
            },
            body: JSON.stringify({
                query: `query MyQuery {
                            site {
                                category(entityId: 23) {
                                products {
                                    edges {
                                    node {
                                        name
                                        description
                                        prices {
                                        basePrice {
                                            formatted
                                        }
                                        }
                                        images {
                                        edges {
                                            node {
                                            urlOriginal
                                            }
                                        }
                                        }
                                    }
                                    }
                                }
                                }
                            }
                        }`,
            }),
        })
        .then(res => res.json())
        .then(data => {
            const productData = data.data.site.category.products.edges;

            productData.forEach((pdata) => {
                const productName = pdata.node.name;
                const productDescription = pdata.node.description;
                const productPrice = pdata.node.prices.basePrice.formatted;
                const productImage = pdata.node.images.edges[0]?.node.urlOriginal;

                // Call the function to create a product card with fetched data
                createProductCard(productName, productDescription, productPrice, productImage);
            });
        })
        .catch(error => console.error(error));
    }
}
function createProductCard(name, description, price, imageUrl) {
    const cardContainer = document.getElementById('card-container');

    // Create the card element
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('flip-card');

    //front side of the card (product details)
    const front = document.createElement('div');
    front.classList.add('card-side', 'front');

    front.innerHTML = `
        <h1>${name}</h1>
        <p>${price}</p>
        <img src="${imageUrl}" alt="${name}">
    `;

    // back side of the card (product description)
    const back = document.createElement('div');
    back.classList.add('card-side', 'back');

    back.innerHTML = `
        <h2>Description</h2>
        <p>${description}</p>
    `;

    //"Next" button
    const nextButton = document.createElement('button');
    nextButton.classList.add('next-button');
    nextButton.textContent = 'View Details';
    nextButton.onclick = () => flipCard(card); // Pass the current card to the function

    //"Back" button
    const backButton = document.createElement('button');
    backButton.classList.add('back-button');
    backButton.textContent = 'Back';
    backButton.onclick = () => flipCard(card); 

    front.appendChild(nextButton);

    back.appendChild(backButton);

    card.appendChild(front);
    card.appendChild(back);

    cardContainer.appendChild(card);
}

// Function to flip the card when the button is clicked
function flipCard(card) {
    card.classList.toggle('flipped'); 
}









    