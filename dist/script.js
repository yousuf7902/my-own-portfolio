const m_menu=document.getElementById("m-menu");
const m_icon=document.getElementById("m-icon");
const m_cross=document.getElementById("cross-icon");

m_icon.addEventListener("click",()=>{
    m_icon.classList.add("hidden");
    m_cross.classList.remove("hidden");
    if(m_menu.className=="hidden"){
        m_menu.classList.remove("hidden");
    }
    else{
        m_menu.classList.add("hidden");
    }
})

m_cross.addEventListener("click",()=>{
    m_icon.classList.remove("hidden");
    m_cross.classList.add("hidden");

    if(m_menu.className=="hidden"){
        m_menu.classList.remove("hidden");
    }
    else{
        m_menu.classList.add("hidden");
    }
})