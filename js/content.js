// JavaScript to toggle mobile menu
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});


const loadCategory = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then(res => res.json())
        .then(data => showCategory(data.categories))
        .catch(err => console.log(err))
}

var selectedCategory = null;

const loadCategoryWise = (id) => {
    selectedCategory = id;
  
    // Show the spinner immediately
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("hidden");
  
    // Remove all existing content from the showAllPets container
    const petContainer = document.getElementById("pets-container");
    petContainer.innerHTML = ''; // Clear all current content
  
    // Set a timeout of 3 seconds before fetching and displaying the data
    setTimeout(() => {
      fetch(`https://openapi.programming-hero.com/api/peddy/category/${id}`)
        .then(res => res.json())
        .then(data => {
          // Hide the spinner after 3 seconds and fetch the data
          spinner.classList.add("hidden");
  
          // Remove active class from all category buttons
          const removeActive = () => {
            const allButton = document.getElementsByClassName("btn-category");
            for (const re of allButton) {
              re.classList.remove("active");
              console.log(re);
            }
          };
          removeActive();
  
          // Add active class to the selected category button
          const activeBtn = document.getElementById(`btn-${id}`);
          console.log(activeBtn);
          activeBtn.classList.add("active");
  
          // Show the pets in the selected category
          showAllPets(data.data);
        })
        .catch(err => {
          console.log(err);
          // In case of error, hide the spinner
          spinner.classList.add("hidden");
        });
    }, 3000); // 3-second delay before making the fetch request
  }
  

const showCategory = (data) => {

    const adoptContainer = document.getElementById("category-btn");

    for (const categoryContent of data) {
        const newDiv = document.createElement("div");
        newDiv.classList = "flex justify-center items-center";
        newDiv.innerHTML = `
            <button id="btn-${categoryContent.category}" onclick="loadCategoryWise('${categoryContent.category}')" class="btn btn-category flex gap-2 h-20 w-full ">
                <img src="${categoryContent.category_icon}" alt="Category Icon" class="w-6 h-6">
                <span class="text-base font-bold">${categoryContent.category}</span>
            </button>`;

        adoptContainer.appendChild(newDiv);
    }
}
const loadAllPets = () => {
    // Show spinner
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("hidden");


    setTimeout(() => {
        fetch("https://openapi.programming-hero.com/api/peddy/pets")
            .then(res => res.json())
            .then(data => {
                showAllPets(data.pets);
                spinner.classList.add("hidden");
            })
            .catch(err => {
                console.log(err);
                spinner.classList.add("hidden");
            });
    }, 3000);
}


const sortPetsByPriceDescending = () => {
    if (selectedCategory) {
        fetch(`https://openapi.programming-hero.com/api/peddy/category/${selectedCategory}`)
            .then(res => res.json())
            .then(data => {
                const sortedPets = data.data.sort((a, b) => {
                    const priceA = a.price ? parseInt(a.price.toString().replace(/[^\d.-]/g, '')) : 0;
                    const priceB = b.price ? parseInt(b.price.toString().replace(/[^\d.-]/g, '')) : 0;

                    return priceB - priceA;
                });
                showAllPets(sortedPets);
            })
            .catch(err => console.log(err));
    } else {
        fetch("https://openapi.programming-hero.com/api/peddy/pets")
            .then(res => res.json())
            .then(data => {
                const sortedPets = data.pets.sort((a, b) => {
                    const priceA = a.price ? parseInt(a.price.toString().replace(/[^\d.-]/g, '')) : 0;
                    const priceB = b.price ? parseInt(b.price.toString().replace(/[^\d.-]/g, '')) : 0;

                    return priceB - priceA;
                });
                showAllPets(sortedPets);
            })
            .catch(err => console.log(err));
    }
};

const loadDetails = (id) => {
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`)
        .then(res => res.json())
        .then(data => showDetails(data.petData))
        .catch(err => console.log(err))
}

const showDetails = (data) => {
    const detailsContainer = document.getElementById("modal-content");
    detailsContainer.innerHTML = `
        <figure class="h-64 sm:h-80 md:h-96">
            <img class="rounded-lg w-full h-full object-cover" src="${data.image}" alt="${data.pet_name}" />
        </figure>
        <div class="text-xl md:text-2xl font-semibold text-center">
            ${data.pet_name}
        </div>
        <div class="mb-4 flex flex-col md:flex-row gap-6 justify-center items-start text-sm md:text-base">
            <div>
                <div class="flex items-center gap-2">
                    <img class="h-5 w-5" src="./images/breed.svg" alt="Breed">
                    <span>${data.breed}</span>
                </div>
                <div class="flex items-center gap-2">
                    <img class="h-5 w-5" src="./images/birth.svg" alt="Birth">
                    <span>${data.date_of_birth}</span>
                </div>
                <div class="flex items-center gap-2">
                    <img class="h-5 w-5" src="./images/gender.svg" alt="Gender">
                    <span>${data.gender}</span>
                </div>
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <img class="h-5 w-5" src="./images/dollar.svg" alt="Price">
                    <span>${data.price}$</span>
                </div>
                <div class="flex items-center gap-2">
                    <img class="h-5 w-5" src="./images/vaccine.svg" alt="Vaccinated">
                    <span>${data.vaccinated_status}</span>
                </div>
            </div>
        </div>
        <div>
            <h2 class="text-lg md:text-2xl font-bold">Details Information</h2>
            <p class="text-sm md:text-base leading-relaxed text-gray-600">${data.pet_details}</p>
        </div>
    `;
    // Show modal
    document.getElementById("customModal").showModal();
};


const showAdopt = (id) => {
    const adoptBtn = document.getElementById(`adopt-btn-${id}`);
    if (adoptBtn) {
        adoptBtn.disabled = true;
    } else {
        console.error(`Button with id "adopt-btn-${id}" not found.`);
    }

    const AdoptDetailsContainer = document.getElementById("modal-content-adopt");
    AdoptDetailsContainer.innerHTML = `
        <div class="flex flex-col justify-center items-center" >
            <img src="./images/congratulations.png">
            <h2 class="font-bold">congress</h2>
            <p class="font-bold">Adopt process is start for your pet</p>
            <div class="font-bold text-2xl" id="countdown">3</div>
        </div>
    `;

    let countdown = 3;
    const countdownElement = document.getElementById("countdown");

    const countdownInterval = setInterval(() => {
        countdown -= 1;
        countdownElement.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            document.getElementById("customModalAdopt").close();
        }
    }, 1000);

    // Show modal
    document.getElementById("customModalAdopt").showModal();
};

const closeModal = () => {
    // Close the modal and disable the "Adopt" button
    const modal = document.getElementById("customModalAdopt");
    modal.close();
};

document.querySelector("form[method='dialog']").addEventListener("click", closeModal);


const showImage = (imageUrl) => {
    // console.log(imageUrl);
    const showImageDiv = document.getElementById("show-image");
    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList = ("w-full px-3 lg:px-0 h-40 rounded-lg");
    thumbnailDiv.innerHTML = `<img class=" h-full rounded-lg object-cover" src="${imageUrl}" alt="Pet Thumbnail">`;
    showImageDiv.appendChild(thumbnailDiv);
};



const showAllPets = (data) => {
    const petContainer = document.getElementById("pets-container")
    petContainer.innerHTML = "";

    if (data.length === 0) {
        document.getElementById("pets-container").classList.remove("grid");
        petContainer.innerHTML = `
        <div class="flex flex-col justify-center min-h-[400px] bg-gray-300 ">
            <div class="mx-auto">
                <img class="" src="./images/error.webp">
            </div>
            <div class="w-2/3 mt-3 mx-auto">
                <h2 class="text-center font-bold">No Information Available</h2>
                <p class="text-center">
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at 
                    its layout. The point of using Lorem Ipsum is that it has a.
                </p>
            </div>
            
        </div>`
        return;

    } else {
        document.getElementById("pets-container").classList.add("grid");
    }
    for (const pets of data) {
        const allPet = document.createElement("div");
        allPet.classList = ("p-3 border border-gray-300 card card-compact ")
        allPet.innerHTML = `
        <figure class="h-[200px] w-full">
            <img class="rounded-lg object-cover h-full w-full" src=${pets.image}/>
        </figure>
        <div class="text-2xl px-10 lg:px-0">
            ${pets.pet_name}
        </div>
        <div class="border-b mb-2 px-10 lg:px-0">
            <div class="flex gap-1">
                <img src="./images/breed.svg">
                <span>${pets.breed}</span>
            </div>
            <div class="flex gap-1">
                <img src="./images/birth.svg">
                <span>${pets.date_of_birth}</span>
            </div>
            <div class="flex gap-1">
                <img src="./images/gender.svg">
                <span>${pets.gender}</span>
            </div>
            <div class="flex gap-1">
                <img src="./images/dollar.svg">
                <span>${pets.price}$</span>
            </div>
        </div>
        <div class="flex justify-center gap-12 lg:gap-0 lg:justify-between items-center">
            <div class="">
                <button onclick="showImage('${pets.image}')" class="">
                    <image class="w-full h-full object-cover" src="./images/like.svg">
                </button>
            </div>
            <div class="">
                 <button id="adopt-btn-${pets.petId}" onclick="showAdopt(${pets.petId})" class="btn">Adopt</button>
            </div>
            <div class="">
                <button onclick="loadDetails(${pets.petId})" class=" btn">Details</button>
            </div>
        </div>`
        petContainer.appendChild(allPet);
    }
}
// Attach the sorting function to the button
const menuTo = document.getElementById("sort-button");
menuTo.addEventListener("click", sortPetsByPriceDescending);


loadCategory();
loadAllPets();