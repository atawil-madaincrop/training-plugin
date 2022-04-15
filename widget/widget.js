const initComponents = () => {
    document.getElementById("my_container_div").innerHTML = '<p><span style="background-color: #bfedd2; font-size: 24px;"><strong><em>Hello this is Abed &amp; Alaa!</em></strong></span></p>';

    let viewer = new buildfire.components.carousel.view(".carousel", [
        {
            title: "build fire",
            url: "https://www.facebook.com/buildfireapps",
            action: "linkToWeb",
            openIn: "_blank",
            iconUrl: "https://placekitten.com/800/400",
        },
        {
            title: "build fire",
            url: "https://www.facebook.com/buildfireapps",
            action: "linkToWeb",
            openIn: "_blank",
            iconUrl: "https://placekitten.com/600/300",
        }
    ]);
}

const init = async () => {
    initComponents();
}

init();