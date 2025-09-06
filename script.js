const manageSpinner = (status) => {
    const spinner = document.getElementById("spinner");
    const wordContainer = document.getElementById("word-container");
    if(status){
        spinner.classList.remove("hidden");
        wordContainer.classList.add("hidden");
    }
    else{
        spinner.classList.add("hidden");
        wordContainer.classList.remove("hidden");
    }
}

const pronounceWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const loadLessons = async() => {
    const url = "https://openapi.programming-hero.com/api/levels/all";
    const res = await fetch(url);
    const json = await res.json();
    displayLessons(json.data);
}

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    lessons.forEach(lesson => {
        levelContainer.innerHTML += `
            <button id="lesson-btn-${lesson.level_no}" type="button" onclick="loadLevelWord(${lesson.level_no});" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
        `;
    });
}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach(btn => btn.classList.add("btn-outline"));
}

const loadLevelWord = async(id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    const res = await fetch(url);
    const json = await res.json();
    removeActive();
    const clickedBtn = document.getElementById(`lesson-btn-${id}`);
    clickedBtn.classList.remove("btn-outline");
    displayLevelWord(json.data);
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
    if(words.length === 0){
        wordContainer.innerHTML = `
            <div class="text-center font-hind-siliguri col-span-full py-10 px-5">
                <img src="assets/alert-error.png" alt="" class="mx-auto">
                <p class="text-neutral-500 mb-3 text-xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <p class="text-3xl font-semibold">নেক্সট Lesson এ যান।</p>
            </div>
        `;
        manageSpinner(false);
        return;
    }
    words.forEach(word => {
        wordContainer.innerHTML += `
            <div class="bg-white px-5 py-10 rounded-lg text-center shadow space-y-4">
                <h4 class="font-bold text-2xl">${word.word ?? "শব্দ পাওয়া যায়নি"}</h4>
                <p class="font-semibold">Meaning/Pronunciation</p>
                <p class="font-hind-siliguri text-2xl font-medium">"${word.meaning ?? "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ?? "Pronunciation পাওয়া যায়নি"}"</p>
                <div class="flex justify-between items-center">
                    <button class="btn bg-[#1a91ff]/20 hover:bg-[#1a91ff]/70" type="button" onclick="loadWordDetail(${word.id})"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="btn bg-[#1a91ff]/20 hover:bg-[#1a91ff]/70" type="button" onclick="pronounceWord('${word.word}')"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `;
    });
    manageSpinner(false);
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}

const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("details-box");
    const wordModal = document.getElementById("word_modal");
    wordModal.showModal();
    detailsBox.innerHTML = `
        <div class="">
            <h4 class="text-2xl font-bold">${word.word ?? "শব্দ পাওয়া যায়নি"} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation ?? "Pronunciation পাওয়া যায়নি"})</h4>
        </div>
        <div class="">
            <h5 class="text-xl font-semibold mb-2">Meaning</h5>
            <p class="font-hind-siliguri">${word.meaning ?? "অর্থ পাওয়া যায়নি"}</p>
        </div>
        <div class="">
            <h5 class="text-xl font-semibold mb-2">Example</h5>
            <p>${word.sentence ?? "বাক্য পাওয়া যায়নি"}</p>
        </div>
        <div class="">
            <h5 class="text-xl font-semibold mb-2">Synonyms</h5>
            ${showSynonyms(word.synonyms)}
        </div>
    `;
}

const showSynonyms = (arr) => {
    if(arr.length === 0){
        return `<span>সমার্থক শব্দ পাওয়া যায়নি</span>`;
    }
    const synonyms = arr.map(item => `<span class="btn">${item}</span>`);
    return synonyms.join(" ");
}

loadLessons();

const searchBtn = document.getElementById("btn-search");
searchBtn.addEventListener("click", async() => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    const url = "https://openapi.programming-hero.com/api/words/all";
    const res = await fetch(url);
    const json = await res.json();
    const allWords = json.data;
    const filteredWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
    displayLevelWord(filteredWords);
});