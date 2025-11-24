//Header login y registro//

document.addEventListener("DOMContentLoaded", () => {
    const header = `
        <header>
            <a href="#" class="logo">
                <img src="../img/logoPlats.svg" alt="PLATS logo">
                PLATS
            </a>
            <nav>
                <a href="">
                <span class="material-symbols-outlined">headset_mic</span>Ayuda</a>
                <a href="">Contactanos</a>
            </nav>
        </header>
    `;
    
    document.body.insertAdjacentHTML("afterbegin", header);
});

